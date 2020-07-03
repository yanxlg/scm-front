import React, {
    useState,
    useCallback,
    useMemo,
    useEffect,
    useRef,
    forwardRef,
    ForwardRefRenderFunction,
    useImperativeHandle,
} from 'react';
import { DatePicker, Table, Spin } from 'antd';
import {
    getUTCDate,
    startDateToUnixWithUTC,
    endDateToUnixWithUTC,
    getRangeFormatDate,
} from '@/utils/date';
import { ECharts } from 'echarts';
import echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/line';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
import 'echarts/lib/component/legend';
import dayjs, { Dayjs } from 'dayjs';
import { JsonFormRef } from 'react-components/es/JsonForm';

import styles from '../../_timeStatistics.less';
import { ColumnsType } from 'antd/es/table';
import { getMonitorOrder } from '@/services/dashboard';
import { IMonitorOrderReq, IMonitorOrderItem } from '@/interface/IDashboard';

const { RangePicker } = DatePicker;

const timeFormat = 'YYYY-MM-DD';

export interface ICancelRef {
    onSearch(): Promise<any>;
}

interface ICancelProps {
    searchRef: React.RefObject<JsonFormRef>;
}

const Cancel: ForwardRefRenderFunction<ICancelRef, ICancelProps> = ({ searchRef }, ref) => {
    const chartRef = useRef<ECharts | null>(null);
    const [loading, setLoading] = useState(false);
    const [dates, setDates] = useState<[Dayjs, Dayjs]>([
        getUTCDate().add(-10, 'day'),
        getUTCDate().add(-1, 'day'),
    ]);
    const [columns, setColumns] = useState(() => {
        return [
            {
                title: '时间',
                dataIndex: 'label',
                align: 'center',
                width: 150,
            },
            ...getRangeFormatDate(
                getUTCDate()
                    .add(-10, 'day')
                    .unix(),
                getUTCDate()
                    .add(-1, 'day')
                    .unix(),
            ).map(date => ({
                title: date,
                dataIndex: date,
                align: 'center',
                width: 150,
            })),
        ] as ColumnsType<object>;
    });
    const [dataSource, setDataSource] = useState<{ [key: string]: string | number }[]>([]);

    const disabledDate = useCallback(currentDate => {
        return currentDate.valueOf() > getUTCDate().valueOf();
    }, []);

    const _getMonitorOrder = useCallback(
        async (params?: IMonitorOrderReq) => {
            const data = await searchRef.current?.getFieldsValue();
            const postData = {
                ...data,
                confirm_time_start: startDateToUnixWithUTC(dates[0]),
                confirm_time_end:
                    getUTCDate().format(timeFormat) === dates[1].format(timeFormat)
                        ? getUTCDate().unix()
                        : endDateToUnixWithUTC(dates[1]),

                ...(params || {}),
            };
            setLoading(true);
            return getMonitorOrder(postData)
                .then(({ data }) => {
                    const { confirm_time_start: startTime, confirm_time_end: endTime } = postData;
                    // console.log('getMonitorOrder', data);
                    renderChart(startTime, endTime, data);

                    data.monitorOrder && setDataSource(getDataSource(data.monitorOrder));
                })
                .finally(() => {
                    setLoading(false);
                });
        },
        [dates],
    );

    const handleRangePicker = useCallback(
        values => {
            // console.log(values);
            setDates(values);
            setColumns([
                {
                    title: '时间',
                    dataIndex: 'label',
                    align: 'center',
                    width: 150,
                },
                ...getRangeFormatDate(values[0].unix(), values[1].unix()).map(date => ({
                    title: date,
                    dataIndex: date,
                    align: 'center',
                    width: 150,
                })),
            ] as ColumnsType<object>);
            _getMonitorOrder({
                confirm_time_start: startDateToUnixWithUTC(values[0]),
                confirm_time_end:
                    getUTCDate().format(timeFormat) === values[1].format(timeFormat)
                        ? getUTCDate().unix()
                        : endDateToUnixWithUTC(values[1]),
            });
        },
        [_getMonitorOrder],
    );

    const getDataSource = useCallback(data => {
        const dateMap: { [key: string]: IMonitorOrderItem[] } = {};
        data.forEach((item: IMonitorOrderItem) => {
            const {
                confirmTime,
                totalNum = 0,
                cancelNumMiddle = 0,
                cancelNumChannel = 0,
                ...rest
            } = item;
            const date = confirmTime.substr(0, 10);
            !dateMap[date] && (dateMap[date] = []);
            dateMap[date].push({
                confirmTime: date,
                totalNum,
                cancelNumMiddle,
                cancelNumChannel,
                percentage:
                    cancelNumMiddle === 0
                        ? '0%'
                        : Number(((cancelNumMiddle / totalNum) * 100).toFixed(2)) + '%',
                ...rest,
            });
        });
        const dateKeys = Object.keys(dateMap);
        const needDateMap: { [key: string]: IMonitorOrderItem } = {};
        dateKeys.forEach(date => {
            const list = dateMap[date];
            needDateMap[date] = {
                ...list[list.length - 1],
            };
        });
        // console.log(1111111, needDateMap);
        const ret: { [key: string]: string | number }[] = [
            {
                label: '总订单',
            },
            {
                label: '中台取消订单',
            },
            {
                label: '非中台取消',
            },
            {
                label: '中台取消率',
            },
        ];

        Object.keys(needDateMap).map(date => {
            const { totalNum, cancelNumMiddle, cancelNumChannel, percentage } = needDateMap[date];
            ret[0][date] = totalNum;
            ret[1][date] = cancelNumMiddle;
            ret[2][date] = cancelNumChannel;
            ret[3][date] = percentage || '0%';
        });
        // console.log(11111111, ret);
        return ret;
    }, []);

    const onSearch = useCallback(() => {
        return _getMonitorOrder();
    }, [_getMonitorOrder]);

    useImperativeHandle(
        ref,
        () => ({
            onSearch: onSearch,
        }),
        [onSearch],
    );

    const renderChart = useCallback((startTime, endTime, data) => {
        // console.log('renderChart', startTime, endTime, data);
        const { lastUpdateTime, monitorOrder } = data;

        const formatDateList = getRangeFormatDate(startTime, endTime);

        const dayMap: { [key: string]: IMonitorOrderItem[] } = {};

        monitorOrder?.forEach((item: IMonitorOrderItem) => {
            const { dayNum, confirmTime, ...rest } = item;
            !dayMap[dayNum] && (dayMap[dayNum] = []);
            dayMap[dayNum].push({
                ...rest,
                dayNum,
                confirmTime: confirmTime.substr(0, 10),
            });
        });

        const dayKeys = Object.keys(dayMap);

        const legendData = dayKeys.map(item => `${item}天`);

        const series: any[] = [];

        dayKeys.forEach(day => {
            const orderList = dayMap[day];
            orderList.sort((a, b) => {
                return new Date(a.confirmTime).getTime() - new Date(b.confirmTime).getTime()
                    ? 1
                    : -1;
            });
            const endDate = orderList[orderList.length - 1].confirmTime;
            // 找到数据截止的最后一天
            const currentDateList: string[] = [];
            for (let i = 0, len = formatDateList.length; i < len; i++) {
                currentDateList.push(formatDateList[i]);
                if (endDate === formatDateList[i]) break;
            }

            series.push({
                name: `${day}天`,
                type: 'line',
                data: currentDateList.map(date => {
                    const index = orderList.findIndex(item => item.confirmTime === date);
                    if (index > -1) {
                        const {
                            totalNum = 0,
                            cancelNumMiddle = 0,
                            cancelNumChannel = 0,
                        } = orderList[index];
                        return {
                            totalNum,
                            cancelNumMiddle,
                            cancelNumChannel,
                            value:
                                cancelNumMiddle === 0
                                    ? 0
                                    : Number(((cancelNumMiddle / totalNum) * 100).toFixed(2)),
                        };
                    }
                    return {
                        // value: 0,
                        totalNum: 0,
                        cancelNumMiddle: 0,
                        cancelNumChannel: 0,
                        value: 0,
                    };
                    // return index > -1 ? {} : {};
                }),
            });
        });

        chartRef.current?.setOption({
            title: {
                text: '取消率',
                subtext: `（最近更新时间：${lastUpdateTime}）`,
                left: 'center',
                bottom: 0,
            },
            tooltip: {
                trigger: 'axis',
                formatter: info => {
                    // console.log('formatter', info);
                    const data = Array.isArray(info) ? info[info.length - 1].data : info.data;
                    const { totalNum, cancelNumMiddle, cancelNumChannel, value } = data;
                    return `
                        <div style="padding: 8px 20px 8px 10px;">
                            <div style="margin-bottom: 4px;">
                                <span style="display: inline-block; width: 6px; height: 6px; margin-right: 4px; background: #6395FA; vertical-align: 2px;"></span>
                                总订单: ${totalNum}
                            </div>
                            <div>
                                <span style="display: inline-block; width: 6px; height: 6px; margin-right: 4px; background: red; vertical-align: 2px;"></span>
                                已取消: ${cancelNumMiddle} + ${cancelNumChannel}
                            </div>
                            <div style="margin-bottom: 4px;">
                                <span style="display: inline-block; width: 6px; height: 6px; margin-right: 4px; background: yellow; vertical-align: 2px;"></span>
                                中台取消率: ${value}%
                            </div>
                        </div>
                    `;
                },
            },
            legend: {
                data: legendData,
            },
            grid: {
                left: '4%',
                right: '8%',
                bottom: '10%',
                containLabel: true,
            },
            xAxis: {
                type: 'category',
                name: '确认订单时间',
                boundaryGap: false,
                data: formatDateList,
            },
            yAxis: {
                type: 'value',
                name: '取消率（%）',
            },
            series: series,
        });
    }, []);

    useEffect(() => {
        !chartRef.current &&
            (chartRef.current = echarts.init(
                document.getElementById('cancel-chart') as HTMLDivElement,
            ));
        _getMonitorOrder();
    }, []);

    return useMemo(() => {
        return (
            <Spin spinning={loading}>
                <div className={styles.dateSection}>
                    <span className={styles.label}>日期：</span>
                    <RangePicker
                        allowClear={false}
                        value={dates}
                        disabledDate={disabledDate}
                        onChange={handleRangePicker}
                    />
                </div>
                <div id="cancel-chart" className={styles.chartSection}></div>
                <Table
                    bordered
                    key="label"
                    columns={columns}
                    dataSource={dataSource}
                    pagination={false}
                    scroll={{ x: 'max-content' }}
                />
            </Spin>
        );
    }, [columns, dataSource, loading, handleRangePicker]);
};

export default forwardRef(Cancel);

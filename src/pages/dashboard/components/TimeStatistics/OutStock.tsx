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
const colors = ['#aaa', '#73A0FA', '#73DEB3', '#FFB761'];

export interface IOutStockRef {
    onSearch(): Promise<any>;
}

interface IOutStockProps {
    searchRef: React.RefObject<JsonFormRef>;
}

const OutStock: ForwardRefRenderFunction<IOutStockRef, IOutStockProps> = ({ searchRef }, ref) => {
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
                outboundNum = 0,
                cancelNumBeforeOutbound = 0,
                cancelNumAfterOutbound = 0,
                ...rest
            } = item;
            const date = confirmTime.substr(0, 10);
            !dateMap[date] && (dateMap[date] = []);
            dateMap[date].push({
                confirmTime: date,
                totalNum,
                outboundNum,
                cancelNumBeforeOutbound,
                cancelNumAfterOutbound,
                percentage:
                    totalNum - cancelNumBeforeOutbound === 0
                        ? '0%'
                        : Number(
                              ((outboundNum / (totalNum - cancelNumBeforeOutbound)) * 100).toFixed(
                                  2,
                              ),
                          ) + '%',
                ...rest,
            });
        });
        const dateKeys = Object.keys(dateMap);
        const needDateMap: { [key: string]: IMonitorOrderItem } = {};
        dateKeys.forEach(date => {
            const list = dateMap[date];
            const i = dateMap[date].findIndex(({ dayNum }) => dayNum === 8);
            needDateMap[date] = {
                ...list[list.length - 1],
                ...(i > -1 ? { specialPercentage: list[i].percentage } : {}),
            };
        });
        // console.log(1111111, needDateMap);
        const ret: { [key: string]: string | number }[] = [
            {
                label: '总订单',
            },
            {
                label: '已出库',
            },
            {
                label: '已取消',
            },
            {
                label: '8天出库率',
            },
            {
                label: '当前出库率',
            },
        ];

        Object.keys(needDateMap).map(date => {
            const {
                totalNum,
                outboundNum,
                cancelNumBeforeOutbound,
                cancelNumAfterOutbound,
                percentage,
                specialPercentage,
            } = needDateMap[date];
            ret[0][date] = totalNum;
            ret[1][date] = outboundNum;
            ret[2][date] = cancelNumBeforeOutbound + cancelNumAfterOutbound;
            ret[3][date] = specialPercentage || '0%';
            ret[4][date] = percentage || '0%';
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

        let colorIndex = 0;

        dayKeys.forEach(day => {
            switch (day) {
                case '7':
                    colorIndex = 1;
                    break;
                case '8':
                    colorIndex = 2;
                    break;
                case '9':
                    colorIndex = 3;
                    break;
                default:
                    colorIndex = 0;
            }
            const orderList = dayMap[day];
            orderList.sort((a, b) => {
                return new Date(a.confirmTime).getTime() - new Date(b.confirmTime).getTime();
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
                data: currentDateList.map((date, mapIndex) => {
                    const index = orderList.findIndex(item => item.confirmTime === date);
                    let lineData = {};
                    if (index > -1) {
                        const {
                            totalNum = 0,
                            outboundNum = 0,
                            cancelNumBeforeOutbound = 0,
                            cancelNumAfterOutbound = 0,
                        } = orderList[index];
                        lineData = {
                            totalNum,
                            outboundNum,
                            cancelNumBeforeOutbound,
                            cancelNumAfterOutbound,
                            value:
                                totalNum - cancelNumBeforeOutbound === 0
                                    ? 0
                                    : Number(
                                          (
                                              (outboundNum / (totalNum - cancelNumBeforeOutbound)) *
                                              100
                                          ).toFixed(2),
                                      ),
                        };
                    } else {
                        lineData = {
                            totalNum: 0,
                            outboundNum: 0,
                            cancelNumBeforeOutbound: 0,
                            cancelNumAfterOutbound: 0,
                            value: 0,
                        };
                    }
                    if (currentDateList.length - 1 === mapIndex) {
                        return {
                            ...lineData,
                            label: {
                                show: true,
                                position: 'right',
                                distance: 10,
                                formatter: '{a}',
                                color: '#333',
                            },
                        };
                    }
                    return lineData;
                }),
                lineStyle: {
                    color: colors[colorIndex],
                },
            });
        });

        chartRef.current?.clear();
        chartRef.current?.setOption({
            title: {
                text: '出库率',
                subtext: `（最近更新时间：${lastUpdateTime}）`,
                left: 'center',
                bottom: 0,
            },
            tooltip: {
                trigger: 'item',
                formatter: info => {
                    // console.log('formatter', info);
                    const data = Array.isArray(info) ? info[info.length - 1].data : info.data;
                    const {
                        totalNum,
                        outboundNum,
                        cancelNumBeforeOutbound,
                        cancelNumAfterOutbound,
                        value,
                    } = data;
                    return `
                        <div style="padding: 8px 20px 8px 10px;">
                            <div style="margin-bottom: 4px;">
                                <span style="display: inline-block; width: 6px; height: 6px; margin-right: 4px; background: #6395FA; vertical-align: 2px;"></span>
                                总订单: ${totalNum}
                            </div>
                            <div style="margin-bottom: 4px;">
                                <span style="display: inline-block; width: 6px; height: 6px; margin-right: 4px; background: #63DAAB; vertical-align: 2px;"></span>
                                已出库: ${outboundNum}
                            </div>
                            <div>
                                <span style="display: inline-block; width: 6px; height: 6px; margin-right: 4px; background: red; vertical-align: 2px;"></span>
                                已取消: ${cancelNumBeforeOutbound} + ${cancelNumAfterOutbound}
                            </div>
                            <div style="margin-bottom: 4px;">
                                <span style="display: inline-block; width: 6px; height: 6px; margin-right: 4px; background: yellow; vertical-align: 2px;"></span>
                                出库率: ${value}%
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
                name: '出库率（%）',
            },
            series: series,
        });
    }, []);

    useEffect(() => {
        !chartRef.current &&
            (chartRef.current = echarts.init(
                document.getElementById('out-stock') as HTMLDivElement,
            ));
        // if (loading) {
        //     chartRef.current.showLoading();
        // } else {
        //     chartRef.current.hideLoading();
        //     renderChart(orderInfo);
        // }
        // renderChart();
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
                <div id="out-stock" className={styles.chartSection}></div>
                <Table
                    bordered
                    rowKey="label"
                    columns={columns}
                    dataSource={dataSource}
                    pagination={false}
                    scroll={{ x: 'max-content' }}
                />
            </Spin>
        );
    }, [columns, dataSource, loading, handleRangePicker]);
};

export default forwardRef(OutStock);

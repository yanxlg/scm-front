import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react';
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

import styles from '../../_timeStatistics.less';
import { ColumnsType } from 'antd/es/table';
import { getMonitorPurchaseOrder } from '@/services/dashboard';
import { IMonitorOrderReq, IMonitorPurchaseOrderItem } from '@/interface/IDashboard';

const { RangePicker } = DatePicker;

const timeFormat = 'YYYY-MM-DD';
const colors = ['#aaa', '#73A0FA', '#73DEB3', '#FFB761'];

const InStock: React.FC = ({}) => {
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
            })),
        ] as ColumnsType<object>;
    });
    const [dataSource, setDataSource] = useState<{ [key: string]: string | number }[]>([]);

    const disabledDate = useCallback(currentDate => {
        return currentDate.valueOf() > getUTCDate().valueOf();
    }, []);

    const _getMonitorPurchaseOrder = useCallback(
        (params?: IMonitorOrderReq) => {
            const postData = {
                order_time_start: startDateToUnixWithUTC(dates[0]),
                order_time_end:
                    getUTCDate().format(timeFormat) === dates[1].format(timeFormat)
                        ? getUTCDate().unix()
                        : endDateToUnixWithUTC(dates[1]),

                ...(params || {}),
            };
            setLoading(true);
            return getMonitorPurchaseOrder(postData)
                .then(({ data }) => {
                    const { order_time_start: startTime, order_time_end: endTime } = postData;
                    // console.log('getMonitorPurchaseOrder', data);
                    renderChart(startTime, endTime, data);

                    data.monitorPurchaseOrder &&
                        setDataSource(getDataSource(data.monitorPurchaseOrder));
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
                },
                ...getRangeFormatDate(values[0].unix(), values[1].unix()).map(date => ({
                    title: date,
                    dataIndex: date,
                    align: 'center',
                })),
            ] as ColumnsType<object>);
            _getMonitorPurchaseOrder({
                confirm_time_start: startDateToUnixWithUTC(values[0]),
                confirm_time_end:
                    getUTCDate().format(timeFormat) === values[1].format(timeFormat)
                        ? getUTCDate().unix()
                        : endDateToUnixWithUTC(values[1]),
            });
        },
        [_getMonitorPurchaseOrder],
    );

    const getDataSource = useCallback(data => {
        const dateMap: { [key: string]: IMonitorPurchaseOrderItem[] } = {};
        data.forEach((item: IMonitorPurchaseOrderItem) => {
            const { orderTime, totalNum = 0, inboundNum = 0, cancelNumNoPay = 0, ...rest } = item;
            const date = orderTime.substr(0, 10);
            !dateMap[date] && (dateMap[date] = []);
            dateMap[date].push({
                orderTime: date,
                totalNum,
                inboundNum,
                cancelNumNoPay,
                percentage:
                    inboundNum === 0
                        ? '0%'
                        : Number(((inboundNum / (totalNum - cancelNumNoPay)) * 100).toFixed(2)) +
                          '%',
                ...rest,
            });
        });
        const dateKeys = Object.keys(dateMap);
        const needDateMap: { [key: string]: IMonitorPurchaseOrderItem } = {};
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
                label: '总采购订单',
            },
            {
                label: '已入库',
            },
            {
                label: '支付前取消采购单',
            },
            {
                label: '5天入库率',
            },
            {
                label: '当前入库率',
            },
        ];

        Object.keys(needDateMap).map(date => {
            const {
                totalNum,
                inboundNum,
                cancelNumNoPay,
                percentage,
                specialPercentage,
            } = needDateMap[date];
            ret[0][date] = totalNum;
            ret[1][date] = inboundNum;
            ret[2][date] = cancelNumNoPay;
            ret[3][date] = specialPercentage || '0%';
            ret[4][date] = percentage || '0%';
        });
        // console.log(11111111, ret);
        return ret;
    }, []);

    const onSearch = useCallback(() => {
        return _getMonitorPurchaseOrder();
    }, [_getMonitorPurchaseOrder]);

    const renderChart = useCallback((startTime, endTime, data) => {
        // console.log('renderChart', startTime, endTime, data);
        const { lastUpdateTime, monitorPurchaseOrder } = data;

        const formatDateList = getRangeFormatDate(startTime, endTime);

        const dayMap: { [key: string]: IMonitorPurchaseOrderItem[] } = {};

        monitorPurchaseOrder?.forEach((item: IMonitorPurchaseOrderItem) => {
            const { dayNum, orderTime, ...rest } = item;
            !dayMap[dayNum] && (dayMap[dayNum] = []);
            dayMap[dayNum].push({
                ...rest,
                dayNum,
                orderTime: orderTime.substr(0, 10),
            });
        });

        const dayKeys = Object.keys(dayMap);

        const legendData = dayKeys.map(item => `${item}天`);

        const series: any[] = [];

        let colorIndex = 0;

        dayKeys.forEach(day => {
            switch (day) {
                case '4':
                    colorIndex = 1;
                    break;
                case '5':
                    colorIndex = 2;
                    break;
                case '6':
                    colorIndex = 3;
                    break;
                default:
                    colorIndex = 0;
            }
            const orderList = dayMap[day];
            orderList.sort((a, b) => {
                return new Date(a.orderTime).getTime() - new Date(b.orderTime).getTime() ? 1 : -1;
            });
            const endDate = orderList[orderList.length - 1].orderTime;
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
                    const index = orderList.findIndex(item => item.orderTime === date);
                    if (index > -1) {
                        const { totalNum = 0, inboundNum = 0, cancelNumNoPay = 0 } = orderList[
                            index
                        ];
                        return {
                            totalNum,
                            inboundNum,
                            cancelNumNoPay,
                            value:
                                inboundNum === 0
                                    ? 0
                                    : Number(
                                          (
                                              (inboundNum / (totalNum - cancelNumNoPay)) *
                                              100
                                          ).toFixed(2),
                                      ),
                        };
                    }
                    return {
                        // value: 0,
                        totalNum: 0,
                        inboundNum: 0,
                        cancelNumNoPay: 0,
                        cancelNumAfterOutbound: 0,
                        value: 0,
                    };
                    // return index > -1 ? {} : {};
                }),
                lineStyle: {
                    color: colors[colorIndex],
                },
            });
        });

        chartRef.current?.setOption({
            title: {
                text: '入库率',
                subtext: `（最近更新时间：${lastUpdateTime}）`,
                left: 'center',
                bottom: 0,
            },
            tooltip: {
                trigger: 'axis',
                formatter: info => {
                    // console.log('formatter', info);
                    const data = Array.isArray(info) ? info[info.length - 1].data : info.data;
                    const { totalNum, inboundNum, cancelNumNoPay, value } = data;
                    return `
                        <div style="padding: 8px 20px 8px 10px;">
                            <div style="margin-bottom: 4px;">
                                <span style="display: inline-block; width: 6px; height: 6px; margin-right: 4px; background: #6395FA; vertical-align: 2px;"></span>
                                总采购单: ${totalNum}
                            </div>
                            <div style="margin-bottom: 4px;">
                                <span style="display: inline-block; width: 6px; height: 6px; margin-right: 4px; background: #63DAAB; vertical-align: 2px;"></span>
                                已入库: ${inboundNum}
                            </div>
                            <div>
                                <span style="display: inline-block; width: 6px; height: 6px; margin-right: 4px; background: red; vertical-align: 2px;"></span>
                                支付前取消订单: ${cancelNumNoPay}
                            </div>
                            <div style="margin-bottom: 4px;">
                                <span style="display: inline-block; width: 6px; height: 6px; margin-right: 4px; background: yellow; vertical-align: 2px;"></span>
                                入库率: ${value}%
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
                name: '入库率（%）',
            },
            series: series,
        });
    }, []);

    useEffect(() => {
        !chartRef.current &&
            (chartRef.current = echarts.init(
                document.getElementById('in-stock') as HTMLDivElement,
            ));
        _getMonitorPurchaseOrder();
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
                <div id="in-stock" className={styles.chartSection}></div>
                <Table
                    bordered
                    rowKey="label"
                    columns={columns}
                    dataSource={dataSource}
                    pagination={false}
                />
            </Spin>
        );
    }, [columns, dataSource, loading, handleRangePicker]);
};

export default InStock;

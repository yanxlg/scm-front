import React, { useMemo, useEffect, useCallback, useRef } from 'react';
import { ECharts } from 'echarts';
import { IOrderDashboardRes } from '@/interface/IDashboard';
import dayjs, { Dayjs } from 'dayjs';
import echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/funnel';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
import { formatTwodecimal } from '@/utils/transform';
import { getUTCDate } from '@/utils/date';

interface IProps {
    loading: boolean;
    startDate: Dayjs;
    statisticsType: string;
    orderInfo: IOrderDashboardRes;
}

const labelFormatter = (percentage: string, name: string) =>
    `${name} ${formatTwodecimal(percentage)}%`;

const OrderFunnel: React.FC<IProps> = ({ loading, orderInfo, startDate, statisticsType }) => {
    const chartRef = useRef<ECharts | null>(null);

    const getUpdateTime = useCallback(() => {
        const threeDayStart = getUTCDate()
            .add(-3, 'day')
            .hour(0)
            .minute(0)
            .second(0)
            .unix();
        // console.log(111111, startDate.unix(), threeDayStart);
        if (startDate.unix() >= threeDayStart) {
            return `${getUTCDate().format('YYYY-MM-DD hh')}:00`;
        } else {
            return getUTCDate().format('YYYY-MM-DD') + ' 00:00';
        }
    }, [startDate]);

    const renderChart = useCallback(
        orderInfo => {
            if (Object.keys(orderInfo).length === 0) {
                chartRef.current?.clear();
                return;
            }
            const suffix = statisticsType === '0' ? '单' : '';
            const {
                // 需采购
                mustPurchaseOrderCount,
                reserveOverstockCount,
                // 已拍单
                auctionsOrderCount,
                auctionsPercentage,
                // 已支付
                payOrderCount,
                payPercentage,
                // 已发货
                shippedOrderCount,
                shippedPercentage,
                // 已签收
                signedOrderCount,
                signedPercentage,
                // 已入库
                inStorageCount,
                inStoragePercentage,
                // 需采购--已出库
                purchaseOutStorageCount,
                purchaseOutStoragePercentage,
                stockOutStorageCount,
                stockOutStoragePercentage,
                // 已收货
                purchaseReceiveOrderCount,
                purchaseReceivedPercentage,
                stockReceiveOrderCount,
                stockReceivedPercentage,

                cancelOrderPercentage,
                purchaseAndStockPercentage,
                purchaseOrderPercentage,
                reserveStockPercentage,

                purchaseOutStorageOrderPercentage,
                stockOutStorageOrderPercentage,
            } = orderInfo;

            // 计算漏斗图占的区域大小
            const _reserveOverstockCount = Number(reserveOverstockCount);
            const _mustPurchaseOrderCount = Number(mustPurchaseOrderCount);
            // console.log(111111, _reserveOverstockCount, _mustPurchaseOrderCount);
            const leftRatio =
                _reserveOverstockCount / (_reserveOverstockCount + _mustPurchaseOrderCount);
            // const rightRatio = 1 - leftRatio;
            const leftWidth = (65 * leftRatio).toFixed(2) + '%';
            const rightWidth = (65 * (1 - leftRatio)).toFixed(2) + '%';
            const rightOffset = (25 + 65 * leftRatio).toFixed(2) + '%';

            // 绘制图表
            chartRef.current?.setOption({
                title: {
                    text: '订单流转漏斗模型',
                    subtext: `(更新时间: ${getUpdateTime()})`,
                    left: 'center',
                    bottom: '0%',
                    textStyle: {
                        fontSize: 16,
                        color: '#131415',
                    },
                    subtextStyle: {
                        color: '#575858',
                    },
                },
                tooltip: {
                    trigger: 'item',
                },
                // xAxis: { show: false, type: 'value' },
                // yAxis: { show: false, type: 'value' },
                // grid: {
                //     borderWidth: 0.5,
                //     containLabel: true,
                //     left: '20%',
                //     // right: 20,
                //     top: '22%',
                //     bottom: '29%',
                // },
                series: [
                    {
                        name: '',
                        type: 'funnel',
                        // width: '35%',
                        width: leftWidth,
                        height: '80%',
                        left: '25%',
                        top: '2%',
                        funnelAlign: 'right',
                        gap: 1,
                        label: {
                            position: 'leftTop',
                            color: '#999',
                        },
                        labelLine: {
                            length: 60,
                            lineStyle: {
                                color: '#999',
                                width: 0.5,
                            },
                        },
                        itemStyle: {
                            color: 'transparent',
                            borderWidth: 0,
                            opacity: 0,
                        },
                        tooltip: {
                            show: false,
                        },
                        sort: 'none',
                        data: [
                            {
                                name: '需采购',
                                value: reserveOverstockCount,
                                label: {
                                    show: false,
                                },
                                labelLine: {
                                    show: false,
                                },
                            },
                            ...['已拍单', '已支付', '已发货', '已签收', '已入库'].map(name => ({
                                value: reserveOverstockCount,
                                name: name,
                                itemStyle: {
                                    opacity: 0,
                                },
                                tooltip: {
                                    show: false,
                                    trigger: 'none',
                                },
                                label: {
                                    show: false,
                                },
                                labelLine: {
                                    show: false,
                                    lineStyle: {
                                        opacity: 0,
                                    },
                                },
                            })),
                            {
                                name: '需采购--已出库',
                                value: stockOutStorageCount,
                                percentage: stockOutStoragePercentage,
                                label: {
                                    // rich: {
                                    //     div: {}
                                    // },
                                    // width: 100,
                                    formatter: ({ data }: any) =>
                                        labelFormatter(data.percentage, '预定积压库存--出库率'),
                                },
                            },
                            {
                                name: '已收货',
                                value: stockReceiveOrderCount,
                                percentage: stockReceivedPercentage,
                                label: {
                                    formatter: ({ data }: any) =>
                                        labelFormatter(data.percentage, '预定积压库存--收货率'),
                                },
                            },
                        ],
                    },
                    {
                        name: '对比漏斗图',
                        type: 'funnel',
                        // width: '35%',
                        width: leftWidth,
                        height: '80%',
                        left: '25%',
                        top: '2%',
                        funnelAlign: 'right',
                        gap: 1,
                        label: {
                            // show: false,
                            position: 'insideRight',
                            color: 'rgba(0, 0, 0, 0.85)',
                        },
                        tooltip: {
                            show: false,
                            // formatter: () => {}
                        },
                        itemStyle: {
                            color: '#63DAAB',
                        },
                        sort: 'none',
                        data: [
                            {
                                name: '需采购',
                                value: reserveOverstockCount,
                                label: {
                                    formatter: (item: any) => {
                                        const { value } = item;
                                        return `预定积压库存${value}${suffix}`;
                                    },
                                },
                            },
                            ...['已拍单', '已支付', '已发货', '已签收', '已入库'].map(name => ({
                                value: reserveOverstockCount,
                                name: name,
                                itemStyle: {
                                    opacity: 0,
                                },
                                tooltip: {
                                    show: false,
                                    trigger: 'none',
                                },
                                label: {
                                    show: false,
                                },
                                labelLine: {
                                    show: false,
                                    lineStyle: {
                                        opacity: 0,
                                    },
                                },
                            })),
                            {
                                name: '需采购--已出库',
                                value: stockOutStorageCount,
                                percentage: stockOutStoragePercentage,
                                label: {
                                    formatter: (item: any) => {
                                        const { value } = item;
                                        return `预定积压库存--已出库${value}${suffix}`;
                                    },
                                },
                            },
                            {
                                name: '已收货',
                                value: stockReceiveOrderCount,
                                percentage: stockReceivedPercentage,
                                label: {
                                    formatter: (item: any) => {
                                        const { value } = item;
                                        return `预定积压库存--已收货${value}${suffix}`;
                                    },
                                },
                                // label: {
                                //     formatter: ({ data }: any) => labelFormatter(data.percentage, '拍单率')
                                // }
                            },
                        ],
                    },
                    {
                        name: '漏斗图',
                        type: 'funnel',
                        // width: '35%',
                        width: rightWidth,
                        height: '80%',
                        // left: '50%',
                        left: rightOffset,
                        top: '2%',
                        funnelAlign: 'left',
                        // center: ['50%', '50%'],  // for pie
                        sort: 'none',
                        gap: 1,
                        label: {
                            position: 'rightTop',
                            color: '#999',
                        },
                        labelLine: {
                            length: 60,
                            lineStyle: {
                                color: '#999',
                                width: 0.5,
                            },
                        },
                        itemStyle: {
                            color: 'transparent',
                            borderWidth: 0,
                            opacity: 0,
                        },
                        tooltip: {
                            show: false,
                        },
                        data: [
                            {
                                name: '需采购',
                                value: mustPurchaseOrderCount,
                                label: {
                                    show: false,
                                },
                                labelLine: {
                                    show: false,
                                },
                            },
                            {
                                name: '已拍单',
                                value: auctionsOrderCount,
                                percentage: auctionsPercentage,
                                label: {
                                    formatter: ({ data }: any) =>
                                        labelFormatter(data.percentage, '拍单率'),
                                },
                            },
                            {
                                name: '已支付',
                                value: payOrderCount,
                                percentage: payPercentage,
                                label: {
                                    formatter: ({ data }: any) =>
                                        labelFormatter(data.percentage, '支付率'),
                                },
                            },
                            {
                                name: '已发货',
                                value: shippedOrderCount,
                                percentage: shippedPercentage,
                                label: {
                                    formatter: ({ data }: any) =>
                                        labelFormatter(data.percentage, '发货率'),
                                },
                            },
                            {
                                name: '已签收',
                                value: signedOrderCount,
                                percentage: signedPercentage,
                                label: {
                                    formatter: ({ data }: any) =>
                                        labelFormatter(data.percentage, '签收率'),
                                },
                            },
                            {
                                name: '已入库',
                                value: inStorageCount,
                                percentage: inStoragePercentage,
                                label: {
                                    formatter: ({ data }: any) =>
                                        labelFormatter(data.percentage, '入库率'),
                                },
                            },
                            {
                                name: '需采购--已出库',
                                value: purchaseOutStorageCount,
                                percentage: purchaseOutStoragePercentage,
                                label: {
                                    formatter: ({ data }: any) =>
                                        labelFormatter(data.percentage, '出库率'),
                                },
                            },
                            {
                                name: '已收货',
                                value: purchaseReceiveOrderCount,
                                percentage: purchaseReceivedPercentage,
                                label: {
                                    formatter: ({ data }: any) =>
                                        labelFormatter(data.percentage, '收货率'),
                                },
                            },
                        ],
                    },
                    {
                        name: '',
                        type: 'funnel',
                        // width: '35%',
                        width: rightWidth,
                        height: '80%',
                        // left: '50%',
                        left: rightOffset,
                        top: '2%',
                        funnelAlign: 'left',
                        // center: ['50%', '50%'],  // for pie
                        sort: 'none',
                        gap: 1,
                        label: {
                            position: 'insideLeft',
                            formatter: (item: any) => {
                                const { value, name } = item;
                                return name + value + suffix;
                            },
                            color: 'rgba(0, 0, 0, 0.85)',
                            // fontWeight: 'bolder',
                        },
                        itemStyle: {
                            color: '#6395FA',
                        },
                        // tooltip: {
                        //     show: false
                        // },
                        data: [
                            {
                                name: '需采购',
                                value: mustPurchaseOrderCount,
                                cancelOrderPercentage,
                                purchaseAndStockPercentage,
                                purchaseOrderPercentage,
                                reserveStockPercentage,
                                tooltip: {
                                    // trigger: 'item'
                                    // show: true,
                                    formatter: ({ data }: any) => {
                                        // console.log(111111, item);
                                        const {
                                            cancelOrderPercentage,
                                            purchaseAndStockPercentage,
                                            purchaseOrderPercentage,
                                            reserveStockPercentage,
                                        } = data;
                                        // <div>需采购和预定积压库存的订单占比: ${formatTwodecimal(
                                        //     purchaseAndStockPercentage,
                                        // )}%</div>
                                        return `
                                            <div style="padding: 8px 20px 8px 10px;">
                                                <div style="margin-bottom: 10px;">销售订单已确认</div>
                                                <div style="margin-bottom: 4px;">
                                                    <span style="display: inline-block; width: 6px; height: 6px; margin-right: 4px; background: #6395FA; vertical-align: 2px;"></span>
                                                    已销售-需拍单: ${formatTwodecimal(
                                                        purchaseOrderPercentage,
                                                    )}%
                                                </div>
                                                <div style="margin-bottom: 4px;">
                                                    <span style="display: inline-block; width: 6px; height: 6px; margin-right: 4px; background: #63DAAB; vertical-align: 2px;"></span>
                                                    已销售-已预定库存: ${formatTwodecimal(
                                                        reserveStockPercentage,
                                                    )}%
                                                </div>
                                                <div>
                                                    <span style="display: inline-block; width: 6px; height: 6px; margin-right: 4px; background: transparent; vertical-align: 2px;"></span>
                                                    已取消订单: ${formatTwodecimal(
                                                        cancelOrderPercentage,
                                                    )}%
                                                </div>
                                            </div>
                                        `;
                                    },
                                },
                            },
                            {
                                name: '已拍单',
                                value: auctionsOrderCount,
                                tooltip: {
                                    formatter: () => {},
                                },
                            },
                            {
                                name: '已支付',
                                value: payOrderCount,
                                tooltip: {
                                    formatter: () => {},
                                },
                            },
                            {
                                name: '已发货',
                                value: shippedOrderCount,
                                tooltip: {
                                    formatter: () => {},
                                },
                            },
                            {
                                name: '已签收',
                                value: signedOrderCount,
                                tooltip: {
                                    formatter: () => {},
                                },
                            },
                            {
                                name: '已入库',
                                value: inStorageCount,
                                tooltip: {
                                    formatter: () => {},
                                },
                            },
                            {
                                name: '需采购--已出库',
                                value: purchaseOutStorageCount,
                                purchaseOutStorageOrderPercentage,
                                stockOutStorageOrderPercentage,
                                tooltip: {
                                    formatter: ({ data }: any) => {
                                        // console.log(111111, item);
                                        const {
                                            purchaseOutStorageOrderPercentage,
                                            stockOutStorageOrderPercentage,
                                        } = data;
                                        return `
                                            <div style="padding: 8px 20px 8px 10px;">
                                                <div style="margin-bottom: 10px">订单已出库</div>
                                                <div style="margin-bottom: 4px;">
                                                    <span style="display: inline-block; width: 6px; height: 6px; margin-right: 4px; background: #6395FA; vertical-align: 2px;"></span>
                                                    需采购订单占比: ${formatTwodecimal(
                                                        purchaseOutStorageOrderPercentage,
                                                    )}%</div>
                                                <div style="margin-bottom: 4px;">
                                                    <span style="display: inline-block; width: 6px; height: 6px; margin-right: 4px; background: #63DAAB; vertical-align: 2px;"></span>
                                                    仅预定积压库存的订单占比: ${formatTwodecimal(
                                                        stockOutStorageOrderPercentage,
                                                    )}%
                                                </div>
                                            </div>
                                            
                                        `;
                                    },
                                },
                            },
                            {
                                name: '已收货',
                                value: purchaseReceiveOrderCount,
                                tooltip: {
                                    formatter: () => {},
                                },
                            },
                        ],
                    },
                ] as any,
            });
        },
        [getUpdateTime, statisticsType],
    );

    useEffect(() => {
        !chartRef.current &&
            (chartRef.current = echarts.init(
                document.getElementById('order-funnel') as HTMLDivElement,
            ));
        if (loading) {
            chartRef.current.showLoading();
        } else {
            chartRef.current.hideLoading();
            renderChart(orderInfo);
        }
    }, [orderInfo, loading]);

    return useMemo(() => {
        return <div id="order-funnel" style={{ height: 680 }}></div>;
    }, []);
};

export default OrderFunnel;

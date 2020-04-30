import React, { useMemo, useEffect } from 'react';
import echarts from 'echarts';
import { IOrderDashboardRes } from '@/interface/IDashboard';

interface IProps {
    orderInfo: IOrderDashboardRes;
};

const OrderFunnel: React.FC<IProps> = ({
    orderInfo
}) => {
    useEffect(() => {
        if (Object.keys(orderInfo).length === 0) {
            return 
        };
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
        const myChart = echarts.init(document.getElementById('order-funnel') as HTMLDivElement);
        // 绘制图表
        myChart.setOption({
            title: {
                text: '订单流转漏斗模型',
                left: 'center',
                top: 'bottom',
            },
            tooltip: {
                trigger: 'item',
                formatter: '{a} <br/>{b} : {c}%',
            },
            // legend: {
            //     orient: 'vertical',
            //     left: 'left',
            //     data: ['产品A', '产品B', '产品C', '产品D', '产品E']
            // },
            xAxis: { show: false, type: 'value' },
            yAxis: { show: false, type: 'value' },
            grid: {
                borderWidth: 0.5,

                containLabel: true,
                left: '20%',
                // right: 20,
                top: '22%',
                bottom: '29%',
            },
            series: [
                {
                    name: '漏斗图',
                    type: 'funnel',
                    width: '25%',
                    height: '80%',
                    left: '10%',
                    top: '10%',
                    funnelAlign: 'right',
                    label: {
                        show: false,
                        position: 'left',
                    },
                    tooltip: {
                        // show: false,
                        // trigger: 'none'
                    },
                    itemStyle: {
                        color: '#63DAAB',
                    },
                    data: [
                        { value: stockReceiveOrderCount, name: '已收货', stockReceivedPercentage },
                        { value: stockOutStorageCount, name: '需采购--已出库', stockOutStoragePercentage },
                        
                        ...[
                            '已拍单',
                            '已支付',
                            '已发货',
                            '已签收',
                            '已入库',
                        ].map(name => ({
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
                        { value: reserveOverstockCount, name: '需采购' },              
                    ],
                },
                {
                    name: '漏斗图',
                    type: 'funnel',
                    width: '50%',
                    height: '80%',
                    left: '35%',
                    top: '10%',
                    funnelAlign: 'left',
                    // center: ['50%', '50%'],  // for pie
                    label: {
                        position: 'rightBottom',
                        color: '#333',
                    },
                    labelLine: {
                        lineStyle: {
                            color: '#333',
                        },
                    },
                    // itemStyle: {
                    //     color: '#6395FA'
                    // },
                    itemStyle: {
                        color: 'transparent',
                        borderWidth: 0,
                        opacity: 0,
                    },
                    data: [
                        { value: mustPurchaseOrderCount, name: '需采购' },
                        { value: auctionsOrderCount, name: '已拍单', auctionsPercentage, },
                        { value: payOrderCount, name: '已支付', payPercentage, },
                        { value: shippedOrderCount, name: '已发货', shippedPercentage, },
                        { value: signedOrderCount, name: '已签收', signedPercentage, },
                        { value: inStorageCount, name: '已入库', inStoragePercentage, },
                        { value: purchaseOutStorageCount, name: '需采购--已出库', purchaseOutStoragePercentage, },
                        { value: purchaseReceiveOrderCount, name: '已收货', purchaseReceivedPercentage, },
                    ],
                },
                {
                    name: '',
                    type: 'funnel',
                    width: '50%',
                    height: '80%',
                    left: '35%',
                    top: '10%',
                    funnelAlign: 'left',
                    // center: ['50%', '50%'],  // for pie
                    label: {
                        position: 'insideLeft',
                        formatter: (item: any) => {
                            const { value, name } = item;
                            return `${name}${value}单`;
                            // console.log('args', args);
                        },
                    },
                    itemStyle: {
                        color: '#6395FA',
                    },
                    data: [
                        { value: mustPurchaseOrderCount, name: '需采购' },
                        { value: auctionsOrderCount, name: '已拍单', },
                        { value: payOrderCount, name: '已支付', },
                        { value: shippedOrderCount, name: '已发货', },
                        { value: signedOrderCount, name: '已签收', },
                        { value: inStorageCount, name: '已入库', },
                        { value: purchaseOutStorageCount, name: '需采购--已出库', },
                        { value: purchaseReceiveOrderCount, name: '已收货', },
                    ],
                },
                // {
                //     type: 'graph',
                //     layout: 'none',
                //     coordinateSystem: 'cartesian2d',
                //     symbolSize: 0,
                //     lineStyle: {
                //         normal: {
                //             width: 1,
                //             shadowColor: 'none',
                //         },
                //     },
                //     data: [
                //         {
                //             name: '点1',
                //             value: [0, 0],
                //             symbolSize: 0
                //         },
                //         {
                //             name: '点2',
                //             value: [0, -1],
                //             symbolSize: 0
                //         },
                //     ],
                //     links: [
                //         {
                //             source: '点1',
                //             target: '点2',
                //             label: {
                //                 show: true,
                //                 formatter: '转换率(25.61%)',
                //                 // position: 'left'
                //             },
                //             lineStyle: { color: '#333' },
                //         },
                //     ],
                // },
            ] as any,
        });
    }, [orderInfo]);

    return useMemo(() => {
        return <div id="order-funnel" style={{ height: 450 }}></div>;
    }, []);
};

export default OrderFunnel;

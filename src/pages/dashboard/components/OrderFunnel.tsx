import React, { useMemo, useEffect } from 'react';
import echarts from 'echarts';

const OrderFunnel: React.FC = () => {
    //
    useEffect(() => {
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
                        { value: 500, name: '已收货' },
                        { value: 700, name: '需采购--已出库' },
                        { value: 1000, name: '需采购' },
                        {
                            value: 1000,
                            name: '已拍单',
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
                        },
                        {
                            value: 1000,
                            name: '已支付',
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
                        },
                        {
                            value: 1000,
                            name: '已发货',
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
                        },
                        {
                            value: 1000,
                            name: '已签收',
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
                        },
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
                        { value: 500, name: '已收货' },
                        { value: 700, name: '需采购--已出库' },
                        { value: 1000, name: '已签收' },
                        { value: 1200, name: '已发货' },
                        { value: 1500, name: '已支付' },
                        { value: 2000, name: '已拍单' },
                        { value: 3000, name: '需采购' },
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
                        { value: 500, name: '已收货' },
                        { value: 700, name: '需采购--已出库' },
                        { value: 1000, name: '已签收' },
                        { value: 1200, name: '已发货' },
                        { value: 1500, name: '已支付' },
                        { value: 2000, name: '已拍单' },
                        { value: 3000, name: '需采购' },
                    ],
                },
                {
                    type: 'graph',
                    layout: 'none',
                    coordinateSystem: 'cartesian2d',
                    symbolSize: 0,
                    // label: {
                    //     normal: {
                    //         show: true,
                    //         // position: 'top',
                    //         color: '#00FFFF',
                    //     },
                    // },
                    lineStyle: {
                        normal: {
                            width: 1,
                            shadowColor: 'none',
                        },
                    },
                    data: [
                        {
                            name: '点1',
                            value: [0, 0],
                            symbolSize: 0,
                            // itemStyle: { normal: { color: 'red' } },
                        },
                        {
                            name: '点2',
                            value: [0, -1],
                            symbolSize: 0,
                            // itemStyle: { normal: { color: 'red' } },
                        },
                        // {
                        //     name: '点4',
                        //     value: [300, -22],
                        //     symbolSize: 0,
                        //     itemStyle: { normal: { color: '#12b5d0' } },
                        // },
                    ],
                    links: [
                        {
                            source: '点1',
                            target: '点2',
                            label: {
                                show: true,
                                formatter: '转换率(25.61%)',
                                // position: 'left'
                            },
                            lineStyle: { color: '#333' },
                        },
                    ],
                },
            ] as any,
        });
    }, []);

    return useMemo(() => {
        return <div id="order-funnel" style={{ height: 450 }}></div>;
    }, []);
};

export default OrderFunnel;

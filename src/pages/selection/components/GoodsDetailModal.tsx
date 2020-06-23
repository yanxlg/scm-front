import React, { useMemo, useCallback, useRef, useEffect, useState } from 'react';
import { Modal, Button } from 'antd';
import { ECharts } from 'echarts';
import echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/line';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
import 'echarts/lib/component/legend';
// import classnames from 'classnames';

import styles from '../_index.less';

interface IProps {
    visible: boolean;
    onCancel(): void;
}

const GoodsDetailModal: React.FC<IProps> = ({ visible, onCancel }) => {
    const chartRef = useRef<ECharts | null>(null);
    const [loading, setLoading] = useState(false);

    const onOk = useCallback(() => {
        console.log('onOk');
    }, []);

    const renderChart = useCallback(() => {
        // 绘制图表
        const colors = ['#26DAD0', '#5584FF'];
        chartRef.current?.setOption({
            color: colors,
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'cross',
                },
            },
            grid: {
                left: 80,
                right: 80,
                top: 80,
            },
            // toolbox: {
            //     feature: {
            //         dataView: { show: false, readOnly: false },
            //         restore: { show: false },
            //         saveAsImage: { show: false },
            //     },
            // },
            legend: {
                top: 0,
                right: 40,
                data: [
                    {
                        name: '销量',
                        icon: 'circle',
                    },
                    {
                        name: '售价',
                        icon: 'circle',
                    },
                ],
                // bottom: 0,
            },
            xAxis: [
                {
                    type: 'category',
                    axisLine: {
                        lineStyle: {
                            color: '#C4C6CF',
                        },
                    },
                    axisTick: {
                        alignWithLabel: true,
                        lineStyle: {
                            color: '#666666',
                        },
                    },
                    // color: '#C4C6CF',
                    data: [
                        '2020-02-24',
                        '2020-02-25',
                        '2020-02-26',
                        '2020-02-27',
                        '2020-02-28',
                        '2020-02-29',
                        '2020-03-01',
                    ],
                },
            ],
            yAxis: [
                {
                    type: 'value',
                    name: '售价',
                    position: 'left',
                    axisLine: {
                        show: false,
                    },
                    splitLine: {
                        lineStyle: {
                            color: ['#EBECF0'],
                        },
                    },
                    axisTick: {
                        show: false,
                    },
                    axisLabel: {
                        formatter: '{value} ',
                    },
                },
                {
                    type: 'value',
                    name: '销量',
                    position: 'right',
                    axisLine: {
                        show: false,
                    },
                    splitLine: {
                        lineStyle: {
                            color: ['#EBECF0'],
                        },
                    },
                    axisTick: {
                        show: false,
                    },
                    axisLabel: {
                        formatter: '{value} ',
                    },
                },
            ],
            series: [
                {
                    name: '销量',
                    type: 'line',
                    // smooth: true,
                    data: [124, 165, 61, 126, 142, 122, 132],
                },
                {
                    name: '售价',
                    type: 'line',
                    // smooth: true,
                    yAxisIndex: 1,
                    data: [132, 115, 148, 108, 126, 125, 149],
                },
            ],
        });
    }, []);

    useEffect(() => {
        if (visible) {
            // console.log(111111, document.getElementById('goods-line'));
            setLoading(true);
            setTimeout(() => {
                setLoading(false);
            }, 500);
        }

        // if (loading) {
        //     chartRef.current.showLoading();
        // } else {
        //     chartRef.current.hideLoading();
        //     renderChart(orderInfo);
        // }
    }, [visible]);

    useEffect(() => {
        const lineDom = document.getElementById('goods-line');
        if (!loading && lineDom) {
            !chartRef.current &&
                (chartRef.current = echarts.init(
                    document.getElementById('goods-line') as HTMLDivElement,
                ));
            renderChart();
        }
    }, [loading]);

    return useMemo(() => {
        return (
            <Modal
                title="商品数据详情"
                visible={visible}
                width={880}
                onCancel={onCancel}
                onOk={onOk}
                className={styles.goodsModal}
                footer={null}
            >
                <div className={styles.header}>
                    <div className={styles.left}>
                        <div className={styles.tag}>爆款日期</div>
                        <div>
                            <span className={styles.date}>06.11</span>
                            <span className={styles.date}>06.12</span>
                            <span className={styles.date}>06.13</span>
                            <span className={styles.date}>06.14</span>
                        </div>
                    </div>
                    <div>
                        <Button type="primary">更改售价</Button>
                        <Button className={styles.btn}>查看商品版本信息</Button>
                    </div>
                </div>
                <div className={styles.chartContainer}>
                    <div className={styles.title}>近七日商品数据</div>
                    <div id="goods-line" style={{ height: 500 }}></div>
                </div>
            </Modal>
        );
    }, [visible]);
};

export default GoodsDetailModal;

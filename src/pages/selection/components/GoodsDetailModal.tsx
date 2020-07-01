import React, { useMemo, useCallback, useRef, useEffect, useState } from 'react';
import { Modal, Button, Spin } from 'antd';
import { ECharts } from 'echarts';
import echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/line';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
import 'echarts/lib/component/legend';
// import classnames from 'classnames';
import { Link } from 'umi';

import styles from '../_index.less';
import { queryGoodsSelectionDetail } from '@/services/selection';

interface IProps {
    visible: boolean;
    commodityId: string;
    merchantId: string;
    salePlatformCommodityId: string;
    onCancel(): void;
}

const GoodsDetailModal: React.FC<IProps> = ({
    visible,
    commodityId,
    merchantId,
    salePlatformCommodityId,
    onCancel,
}) => {
    const chartRef = useRef<ECharts | null>(null);
    const [loading, setLoading] = useState(false);
    const [explosionDays, setExplosionDays] = useState<string[]>([]);

    const handleCancel = useCallback(() => {
        setLoading(false);
        setExplosionDays([]);
        onCancel();
    }, []);

    const _queryGoodsSelectionDetail = useCallback(() => {
        setLoading(true);
        queryGoodsSelectionDetail({
            commodity_id: commodityId,
            merchant_id: merchantId,
        })
            .then(({ data }) => {
                const { explosion_day, history_detail } = data;
                setExplosionDays(explosion_day);
                history_detail && renderChart(history_detail);
            })
            .finally(() => {
                setLoading(false);
            });
    }, [visible]);

    const renderChart = useCallback(chartData => {
        // console.log('renderChart', chartData, );
        const dates = Object.keys(chartData).sort();
        const salePriceList: number[] = [];
        const profitList: number[] = [];
        const saleOrderList: number[] = [];
        dates.forEach(date => {
            const item = chartData[date];
            const { sale_order, sale_price, profit } = item;
            salePriceList.push(Number(sale_price));
            profitList.push(Number(profit));
            saleOrderList.push(Number(sale_order));
        });
        let saleMax: number = Math.ceil(Math.max(...salePriceList, ...profitList) * 1.5);
        let orderMax: number = Math.max(...saleOrderList);
        // 向上取5的倍数
        while (saleMax % 5 !== 0) {
            saleMax++;
        }
        while (orderMax % 5 !== 0) {
            orderMax++;
        }
        // 绘制图表
        const colors = ['#26DAD0', '#5584FF', '#C95FF2'];
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
            legend: {
                top: 0,
                right: 40,
                data: [
                    {
                        name: '销量',
                        icon: 'circle',
                    },
                    {
                        name: '销售价',
                        icon: 'circle',
                    },
                    {
                        name: '利润额',
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
                    data: dates,
                },
            ],
            yAxis: [
                {
                    type: 'value',
                    name: '金额',
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
                    // splitNumber: 5,
                    max: saleMax,
                    interval: saleMax / 5,
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
                    // splitNumber: 5,
                    max: orderMax,
                    interval: orderMax / 5,
                },
            ],
            series: [
                {
                    name: '销量',
                    type: 'line',
                    yAxisIndex: 1,
                    data: saleOrderList,
                },
                {
                    name: '销售价',
                    type: 'line',
                    data: salePriceList,
                },
                {
                    name: '利润额',
                    type: 'line',
                    data: profitList,
                },
            ],
        });
    }, []);

    useEffect(() => {
        if (visible) {
            _queryGoodsSelectionDetail();
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
        // !loading &&
        if (lineDom && !chartRef.current) {
            chartRef.current = echarts.init(
                document.getElementById('goods-line') as HTMLDivElement,
            );
        }
    }, [loading]);

    return useMemo(() => {
        return (
            <Modal
                title="商品数据详情"
                visible={visible}
                width={880}
                onCancel={handleCancel}
                className={styles.goodsModal}
                footer={null}
            >
                <Spin spinning={loading}>
                    <div className={styles.header}>
                        <div className={styles.left}>
                            <div className={styles.tag}>爆款日期</div>
                            <div>
                                {explosionDays?.map(item => (
                                    <span className={styles.date} key={item}>
                                        {item}
                                    </span>
                                ))}
                            </div>
                        </div>
                        <div>
                            <a
                                target="_blank"
                                href={`/goods/channel?commodity_id=${commodityId}&merchant_ids=${merchantId}&vova_virtual_id=${salePlatformCommodityId}&from=selection`}
                            >
                                <Button type="primary">更改售价</Button>
                            </a>
                            <a target="_blank" href={`/goods/local/${commodityId}`}>
                                <Button className={styles.btn}>查看商品版本信息</Button>
                            </a>
                        </div>
                    </div>
                    <div className={styles.chartContainer}>
                        <div className={styles.title}>商品数据</div>
                        <div id="goods-line" style={{ height: 500 }}></div>
                    </div>
                </Spin>
            </Modal>
        );
    }, [visible, loading, explosionDays]);
};

export default GoodsDetailModal;

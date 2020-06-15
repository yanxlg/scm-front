import React, { useMemo, useRef, useCallback, useState, useEffect } from 'react';
import { Row, Col, Radio, Button, Table, Statistic, Spin } from 'antd';
import { JsonForm, LoadingButton, FitTable } from 'react-components';
import { JsonFormRef, FormField } from 'react-components/es/JsonForm';
// import OrderFunnel from './components/OrderFunnel';
import DateRange from './components/DateRange';
import { formatThousands, formatTwodecimal } from '@/utils/transform';
import { getDashboardTradeData, getPlatformAndStore } from '@/services/dashboard';
import { ColumnsType } from 'antd/es/table';
import dayjs, { Dayjs } from 'dayjs';
import classNames from 'classnames';
import { CaretUpOutlined, CaretDownOutlined } from '@ant-design/icons';
import { startDateToUnix, endDateToUnix } from 'react-components/es/utils/date';
import { IDashboardOverviewReq, IOverviewInfo, IOverviewDetailItem } from '@/interface/IDashboard';

import formStyles from 'react-components/es/JsonForm/_form.less';
import styles from './_overview.less';

const formFields: FormField[] = [
    {
        type: 'select',
        name: 'platform',
        label: '销售平台',
        // className: 'order-input',
        syncDefaultOption: {
            value: '',
            name: '全部',
        },
        optionList: () => getPlatformAndStore(),
        onChange: (_, form) => {
            form.resetFields(['store']);
        },
    },
    {
        type: 'select',
        name: 'store',
        label: '销售店铺',
        optionListDependence: {
            name: 'platform',
            key: 'children',
        },
        syncDefaultOption: {
            value: '',
            name: '全部',
        },
        optionList: () => getPlatformAndStore(),
    },
];

// : ColumnsType<any>[]
const columns: ColumnsType<object> = [
    {
        width: 120,
        title: '日期',
        dataIndex: 'statisticsDayStr',
        align: 'center',
    },
    {
        width: 120,
        title: '销售渠道',
        dataIndex: 'channelPlatform',
        align: 'center',
    },
    {
        width: 120,
        title: '销售店铺',
        dataIndex: 'channelShop',
        align: 'center',
    },
    {
        width: 120,
        title: '采购渠道',
        dataIndex: 'purchasePlatform',
        align: 'center',
    },
    {
        width: 120,
        title: '交易额',
        dataIndex: 'tradeAmount',
        align: 'center',
    },
    {
        width: 120,
        title: '订单量',
        dataIndex: 'orderNum',
        align: 'center',
    },
    {
        width: 120,
        title: '实际毛利',
        dataIndex: 'actualGrossProfit',
        align: 'center',
    },
    {
        width: 120,
        title: '实际采购成本',
        dataIndex: 'actualPurchaseCost',
        align: 'center',
    },
    {
        width: 120,
        title: '实际物流成本',
        dataIndex: 'actualLogisticsCost',
        align: 'center',
    },
    {
        width: 120,
        title: '预期毛利',
        dataIndex: 'expectedGrossProfit',
        align: 'center',
    },
    {
        width: 120,
        title: '预估采购成本',
        dataIndex: 'expectedPurchaseCost',
        align: 'center',
    },
    {
        width: 120,
        title: '预估物流成本',
        dataIndex: 'expectedLogisticsCost',
        align: 'center',
    },
    {
        width: 120,
        title: '仓储成本',
        dataIndex: 'storageCost',
        align: 'center',
    },
    {
        width: 120,
        title: '预估退款成本',
        dataIndex: 'expectedRefundCost',
        align: 'center',
    },
    {
        width: 230,
        title: '其他成本（丢件漏件、不良品）',
        dataIndex: 'otherCost',
        align: 'center',
    },
    {
        width: 120,
        title: '仓库积压成本',
        dataIndex: 'storageBacklogCost',
        align: 'center',
    },
    {
        width: 120,
        title: '在架商品数',
        dataIndex: 'onsaleGoodsNum',
        align: 'center',
    },
    {
        width: 120,
        title: '有销量商品数',
        dataIndex: 'saledGoodsNum',
        align: 'center',
    },
];

const timeFormat = 'YYYY-MM-DD';

const Overview: React.FC = props => {
    const searchRef = useRef<JsonFormRef>(null);

    const [loading, setLoading] = useState(false);
    const [dates, setDates] = useState<[Dayjs, Dayjs]>([dayjs(), dayjs()]);
    const [detailList, setDetailList] = useState<IOverviewDetailItem[]>([]);
    const [overviewInfo, setOverviewInfo] = useState<IOverviewInfo>({
        totalTradeAmount: '0',
        totalOrderNum: 0,
        tradeAmount: '0',
        orderNum: 0,
        actualGrossProfit: '0',
        actualGrossProfitRatio: 0,
        expectedGrossProfit: '0',
        expectedGrossProfitRatio: 0,
        storageBacklogCost: '0',
        storageBacklogCostRatio: 0,
        actualPurchaseCost: '0',
        actualPurchaseCostRatio: 0,
        saledGoodsNum: '0',
        saledGoodsNumRatio: 0,
        onsaleGoodsNum: '0',
        onsaleGoodsNumRatio: 0,
        pinRate: '0',
        pinRateRatio: 0,
    });

    const _getDashboardTradeData = useCallback(
        (params = {}) => {
            setLoading(true);
            return getDashboardTradeData({
                ...searchRef.current?.getFieldsValue(),
                statistics_start_time: startDateToUnix(dates[0]),
                statistics_end_time:
                    dayjs().format(timeFormat) === dates[1].format(timeFormat)
                        ? dayjs().unix()
                        : endDateToUnix(dates[1]),
                ...params,
            } as IDashboardOverviewReq)
                .then(res => {
                    // console.log('getDashboardTradeData', res);
                    const {
                        totalTradeAmount,
                        totalOrderNum,
                        tradeAmount,
                        orderNum,
                        actualGrossProfit,
                        actualGrossProfitRatio,
                        expectedGrossProfit,
                        expectedGrossProfitRatio,
                        storageBacklogCost,
                        storageBacklogCostRatio,
                        actualPurchaseCost,
                        actualPurchaseCostRatio,
                        saledGoodsNum,
                        saledGoodsNumRatio,
                        onsaleGoodsNum,
                        onsaleGoodsNumRatio,
                        pinRate,
                        pinRateRatio,

                        detail,
                    } = res.data;
                    setOverviewInfo({
                        totalTradeAmount,
                        totalOrderNum,
                        tradeAmount,
                        orderNum,
                        actualGrossProfit,
                        actualGrossProfitRatio: formatTwodecimal(actualGrossProfitRatio),
                        expectedGrossProfit,
                        expectedGrossProfitRatio: formatTwodecimal(expectedGrossProfitRatio),
                        storageBacklogCost,
                        storageBacklogCostRatio: formatTwodecimal(storageBacklogCostRatio),
                        actualPurchaseCost,
                        actualPurchaseCostRatio: formatTwodecimal(actualPurchaseCostRatio),
                        saledGoodsNum,
                        saledGoodsNumRatio: formatTwodecimal(saledGoodsNumRatio),
                        onsaleGoodsNum,
                        onsaleGoodsNumRatio: formatTwodecimal(onsaleGoodsNumRatio),
                        pinRate,
                        pinRateRatio: formatTwodecimal(pinRateRatio),
                    });
                    setDetailList(detail);
                })
                .finally(() => {
                    setLoading(false);
                });
        },
        [dates],
    );

    const handleChangeDates = useCallback(
        currentDates => {
            setDates(currentDates);
            _getDashboardTradeData({
                statistics_start_time: startDateToUnix(currentDates[0]),
                statistics_end_time:
                    dayjs().format(timeFormat) === currentDates[1].format(timeFormat)
                        ? dayjs().unix()
                        : endDateToUnix(currentDates[1]),
            });
        },
        [_getDashboardTradeData],
    );

    useEffect(() => {
        _getDashboardTradeData();
    }, []);

    return useMemo(() => {
        const {
            totalTradeAmount,
            totalOrderNum,
            tradeAmount,
            orderNum,
            actualGrossProfit,
            actualGrossProfitRatio,
            expectedGrossProfit,
            expectedGrossProfitRatio,
            storageBacklogCost,
            storageBacklogCostRatio,
            actualPurchaseCost,
            actualPurchaseCostRatio,
            saledGoodsNum,
            saledGoodsNumRatio,
            onsaleGoodsNum,
            onsaleGoodsNumRatio,
            pinRate,
            pinRateRatio,
        } = overviewInfo;
        return (
            <div className={styles.container}>
                <div className={styles.formSection}>
                    <JsonForm
                        ref={searchRef}
                        fieldList={formFields}
                        // labelClassName="order-label"
                        initialValues={{
                            platform: '',
                            store: '',
                        }}
                    >
                        <div>
                            <LoadingButton
                                type="primary"
                                className={formStyles.formBtn}
                                onClick={() => _getDashboardTradeData()}
                            >
                                查询
                            </LoadingButton>
                            <LoadingButton
                                className={formStyles.formBtn}
                                onClick={() => _getDashboardTradeData()}
                            >
                                刷新
                            </LoadingButton>
                        </div>
                    </JsonForm>
                </div>
                <Spin spinning={loading}>
                    <div className={styles.chartSection}>
                        <div className={styles.totalSection}>
                            <div>
                                累计交易额:{' '}
                                {totalTradeAmount
                                    ? formatThousands(totalTradeAmount)
                                    : totalTradeAmount}
                            </div>
                            <div>
                                累计订单量:{' '}
                                {totalOrderNum ? formatThousands(totalOrderNum) : totalOrderNum}
                            </div>
                        </div>
                        <div className={styles.dateSection}>
                            <DateRange dates={dates} setDates={handleChangeDates} />
                        </div>
                        <div className={styles.periodSection}>
                            <Row className={styles.summaryBox}>
                                <Col
                                    span={12}
                                    className={classNames(styles.summaryItem, styles.first)}
                                >
                                    <Statistic
                                        className={styles.statistic}
                                        title="交易额"
                                        value={tradeAmount}
                                        valueStyle={{
                                            fontSize: '44px',
                                            color: '#3AA0FE',
                                        }}
                                    />
                                </Col>
                                <Col span={12} className={styles.summaryItem}>
                                    <Statistic
                                        className={styles.statistic}
                                        title="订单量"
                                        value={orderNum}
                                        valueStyle={{
                                            fontSize: '44px',
                                            color: '#333',
                                        }}
                                    />
                                </Col>
                            </Row>
                            <div className={styles.variousBox}>
                                <Row>
                                    <Col span={6}>
                                        <Statistic
                                            title="实际毛利"
                                            value={actualGrossProfit}
                                            valueStyle={{
                                                fontWeight: 'bold',
                                                color: '#333',
                                            }}
                                        />
                                        <div className={styles.affix}>
                                            环比
                                            {actualGrossProfitRatio >= 0 ? (
                                                <span className={styles.increase}>
                                                    {actualGrossProfitRatio}% <CaretUpOutlined />
                                                </span>
                                            ) : (
                                                <span className={styles.decrease}>
                                                    {actualGrossProfitRatio}% <CaretDownOutlined />
                                                </span>
                                            )}
                                        </div>
                                    </Col>
                                    <Col span={6}>
                                        <Statistic
                                            title="预期毛利"
                                            value={expectedGrossProfit}
                                            valueStyle={{
                                                fontWeight: 'bold',
                                                color: '#333',
                                            }}
                                        />
                                        <div className={styles.affix}>
                                            环比
                                            {expectedGrossProfitRatio >= 0 ? (
                                                <span className={styles.increase}>
                                                    {expectedGrossProfitRatio}% <CaretUpOutlined />
                                                </span>
                                            ) : (
                                                <span className={styles.decrease}>
                                                    {expectedGrossProfitRatio}%
                                                    <CaretDownOutlined />
                                                </span>
                                            )}
                                        </div>
                                    </Col>
                                    <Col span={6}>
                                        <Statistic
                                            title="仓库积压成本"
                                            value={storageBacklogCost}
                                            valueStyle={{
                                                fontWeight: 'bold',
                                                color: '#333',
                                            }}
                                        />
                                        <div className={styles.affix}>
                                            环比
                                            {storageBacklogCostRatio >= 0 ? (
                                                <span className={styles.increase}>
                                                    {storageBacklogCostRatio}% <CaretUpOutlined />
                                                </span>
                                            ) : (
                                                <span className={styles.decrease}>
                                                    {storageBacklogCostRatio}% <CaretDownOutlined />
                                                </span>
                                            )}
                                        </div>
                                    </Col>
                                    <Col span={6}>
                                        <Statistic
                                            title="实际采购成本"
                                            value={actualPurchaseCost}
                                            valueStyle={{
                                                fontWeight: 'bold',
                                                color: '#333',
                                            }}
                                        />
                                        <div className={styles.affix}>
                                            环比
                                            {actualPurchaseCostRatio >= 0 ? (
                                                <span className={styles.increase}>
                                                    {actualPurchaseCostRatio}% <CaretUpOutlined />
                                                </span>
                                            ) : (
                                                <span className={styles.decrease}>
                                                    {actualPurchaseCostRatio}% <CaretDownOutlined />
                                                </span>
                                            )}
                                        </div>
                                    </Col>
                                </Row>
                                <Row className={styles.secondLine}>
                                    <Col span={6}>
                                        <Statistic
                                            title="有销量的商品数"
                                            value={saledGoodsNum}
                                            valueStyle={{
                                                fontWeight: 'bold',
                                                color: '#333',
                                            }}
                                        />
                                        <div className={styles.affix}>
                                            环比
                                            {saledGoodsNumRatio >= 0 ? (
                                                <span className={styles.increase}>
                                                    {saledGoodsNumRatio}% <CaretUpOutlined />
                                                </span>
                                            ) : (
                                                <span className={styles.decrease}>
                                                    {saledGoodsNumRatio}% <CaretDownOutlined />
                                                </span>
                                            )}
                                        </div>
                                    </Col>
                                    <Col span={6}>
                                        <Statistic
                                            title="在架商品数"
                                            value={onsaleGoodsNum}
                                            valueStyle={{
                                                // fontSize: '44px',
                                                fontWeight: 'bold',
                                                color: '#333',
                                            }}
                                        />
                                        <div className={styles.affix}>
                                            环比
                                            {onsaleGoodsNumRatio >= 0 ? (
                                                <span className={styles.increase}>
                                                    {onsaleGoodsNumRatio}% <CaretUpOutlined />
                                                </span>
                                            ) : (
                                                <span className={styles.decrease}>
                                                    {onsaleGoodsNumRatio}% <CaretDownOutlined />
                                                </span>
                                            )}
                                        </div>
                                    </Col>
                                    <Col span={6}>
                                        <Statistic
                                            title="动销率"
                                            suffix="%"
                                            value={pinRate}
                                            valueStyle={{
                                                fontWeight: 'bold',
                                                color: '#333',
                                            }}
                                        />
                                        <div className={styles.affix}>
                                            环比
                                            {pinRateRatio >= 0 ? (
                                                <span className={styles.increase}>
                                                    {pinRateRatio}% <CaretUpOutlined />
                                                </span>
                                            ) : (
                                                <span className={styles.decrease}>
                                                    {pinRateRatio}% <CaretDownOutlined />
                                                </span>
                                            )}
                                        </div>
                                    </Col>
                                </Row>
                            </div>
                        </div>
                        <div className={styles.coreDataTitle}>核心数据明细</div>
                        <div className={styles.tableSection}>
                            <FitTable
                                bordered
                                rowKey="id"
                                className={styles.table}
                                loading={loading}
                                columns={columns}
                                dataSource={detailList}
                                scroll={{ x: 'max-content' }}
                                columnsSettingRender={true}
                                // pagination={pagination}
                                // onChange={onChange}
                                // toolBarRender={toolBarRender}
                            />
                        </div>
                    </div>
                </Spin>
            </div>
        );
    }, [dates, loading, overviewInfo, detailList]);
};

export default Overview;

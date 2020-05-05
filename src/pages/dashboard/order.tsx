import React, { useMemo, useRef, useCallback, useEffect, useState } from 'react';
import { Row, Col, Radio, Button, Table } from 'antd';
import { JsonForm, LoadingButton } from 'react-components';
import { JsonFormRef, FormField } from 'react-components/es/JsonForm';
import OrderFunnel from './components/OrderFunnel';
import DateRange from './components/DateRange';
import { ColumnsType } from 'antd/es/table';
import { getOrderDashboardData, getPlatformAndStore } from '@/services/dashboard';
import dayjs, { Dayjs } from 'dayjs';
import { IOrderDashboardReq, IOrderDashboardRes } from '@/interface/IDashboard';
import { startDateToUnix, endDateToUnix } from 'react-components/es/utils/date';

import formStyles from 'react-components/es/JsonForm/_form.less';
import styles from './_order.less';

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
const columns: ColumnsType<IOrderItem> = [
    {
        width: '20%',
        title: '',
        dataIndex: 'label',
        align: 'center'
    },
    {
        width: '20%',
        title: '数量（单）',
        dataIndex: 'count',
        align: 'center'
    },
    {
        width: '20%',
        title: '转化率',
        dataIndex: 'percentage',
        align: 'center'
    },
    {
        width: '20%',
        title: '预定积压库(单)',
        dataIndex: 'reserveStock',
        align: 'center'
    },
    {
        width: '20%',
        title: '预定积压库转化率',
        dataIndex: 'reserveStockPercentage',
        align: 'center'
    },
];

const timeFormat = 'YYYY-MM-DD';

interface IOrderItem {
    label: string;
    count: number;
    percentage?: string;
    reserveStock?: number;
    reserveStockPercentage?: string;

    _purchaseOrderPercentage?: string;
    _purchaseAndStockPercentage?: string;
    _reserveStockPercentage?: string;
    _cancelOrderPercentage?: string;
    _purchaseOutStorageOrderPercentage?: string;
    _stockOutStorageOrderPercentage?: string;
}

const OrderAnalysis: React.FC = props => {
    const searchRef = useRef<JsonFormRef>(null);
    const [loading, setLoading] = useState(false);
    const [orderInfoList, setOrderInfoList] = useState<IOrderItem[]>([]);
    const [statisticsType, setStatisticsType] = useState('0');
    const [dates, setDates] = useState<[Dayjs, Dayjs]>([ dayjs(), dayjs() ]);
    const [orderInfo, setOrderInfo] = useState<IOrderDashboardRes>({});

    const _getOrderDashboardData = useCallback(
        () => {
            setLoading(true);
            console.log(searchRef.current?.getFieldsValue(), dates, statisticsType, );
            return getOrderDashboardData({
                ...searchRef.current?.getFieldsValue(),
                statistics_start_time: startDateToUnix(dates[0]),
                statistics_end_time: dayjs().format(timeFormat) === dates[1].format(timeFormat) ? dayjs().unix() : endDateToUnix(dates[1]),
                statistics_type: statisticsType
            } as IOrderDashboardReq)
                .then(res => {
                    setOrderInfo(res.data);
                    // console.log('getOrderDashboardData', res);
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
                    } = res.data;
                    setOrderInfoList([
                        {
                            label: '需采购',
                            count: mustPurchaseOrderCount,
                            reserveStock: reserveOverstockCount,
                            _purchaseOrderPercentage: purchaseOrderPercentage, // 仅需采购的订单占比
                            _purchaseAndStockPercentage: purchaseAndStockPercentage,// 需采购和预定积压库存的订单占比
                            _reserveStockPercentage: reserveStockPercentage, // 仅预定积压库存的订单占比
                            _cancelOrderPercentage: cancelOrderPercentage, // 已取消订单

                        },
                        {
                            label: '已拍单',
                            count: auctionsOrderCount,
                            percentage: `${auctionsPercentage}%`,
                        },
                        {
                            label: '已支付',
                            count: payOrderCount,
                            percentage: `${payPercentage}%`,
                            
                        },
                        {
                            label: '已发货',
                            count: shippedOrderCount,
                            percentage: `${shippedPercentage}%`,
                        },
                        {
                            label: '已签收',
                            count: signedOrderCount,
                            percentage: `${signedPercentage}%`,
                        },
                        {
                            label: '已入库',
                            count: inStorageCount,
                            percentage: `${inStoragePercentage}%`,
                        },
                        {
                            label: '需采购--已出库',
                            count: purchaseOutStorageCount,
                            percentage: `${purchaseOutStoragePercentage}%`,
                            reserveStock: stockOutStorageCount,
                            reserveStockPercentage: `${stockOutStoragePercentage}%`,
                            _purchaseOutStorageOrderPercentage: purchaseOutStorageOrderPercentage,
                            _stockOutStorageOrderPercentage: stockOutStorageOrderPercentage
                        },
                        {
                            label: '已收货',
                            count: purchaseReceiveOrderCount,
                            percentage: `${purchaseReceivedPercentage}%`,
                            reserveStock: stockReceiveOrderCount,
                            reserveStockPercentage: `${stockReceivedPercentage}%`
                        },
                    ]);
                })
                .finally(() => {
                    setLoading(false);
                })
        },
        [],
    );

    useEffect(
        () => {
            _getOrderDashboardData();
            getPlatformAndStore();
        },
        []
    );

    return useMemo(() => {
        return (
            <div className={styles.container}>
                <div className={styles.formSection}>
                    <JsonForm
                        ref={searchRef}
                        fieldList={formFields}
                        // labelClassName="order-label"
                        initialValues={{
                            platform: '',
                            store: ''
                        }}
                    >
                        <div>
                            <LoadingButton
                                type="primary"
                                className={formStyles.formBtn}
                                onClick={() => _getOrderDashboardData()}
                            >
                                查询
                            </LoadingButton>
                            <LoadingButton
                                className={formStyles.formBtn}
                                onClick={() => _getOrderDashboardData()}
                            >
                                刷新
                            </LoadingButton>
                        </div>
                    </JsonForm>
                </div>
                <div className={styles.chartSection}>
                    <div className={styles.operationBox}>
                        <DateRange dates={dates} setDates={setDates}/>
                        <Radio.Group value={statisticsType} onChange={e => setStatisticsType(e.target.value)} buttonStyle="solid">
                            <Radio.Button value="0">订单量</Radio.Button>
                            <Radio.Button value="1">GMV($)</Radio.Button>
                        </Radio.Group>
                    </div>
                    <Row style={{marginTop: 30}}>
                        <Col span={18}>
                            <OrderFunnel orderInfo={orderInfo} loading={loading} startDate={dates[0]} />
                            <Table
                                bordered
                                rowKey="label"
                                pagination={false}
                                loading={loading}
                                columns={columns}
                                dataSource={orderInfoList}
                                expandable={{
                                    // defaultExpandedRowKeys: ['需采购'],
                                    expandedRowRender: ({
                                        label,
                                        _purchaseOrderPercentage,
                                        _purchaseAndStockPercentage,
                                        _reserveStockPercentage,
                                        _cancelOrderPercentage,

                                        _purchaseOutStorageOrderPercentage,
                                        _stockOutStorageOrderPercentage
                                    }) => label === '需采购' ? ( 
                                        <>
                                            <p>仅需采购的订单占比: {`${_purchaseOrderPercentage}%`}</p>
                                            <p>需采购和预定积压库存的订单占比: {`${_purchaseAndStockPercentage}%`}</p>
                                            <p>仅预定积压库存的订单占比: {`${_reserveStockPercentage}%`}</p>
                                            <p>已取消订单: {`${_cancelOrderPercentage}%`}</p>
                                        </>
                                    ) : (
                                        <>
                                            <p>需采购订单占比: {`${_purchaseOutStorageOrderPercentage}%`}</p>
                                            <p>仅预定积压库存的订单占比: {`${_stockOutStorageOrderPercentage}%`}</p>
                                        </>
                                    ),
                                    rowExpandable: record => ['需采购', '需采购--已出库'].indexOf(record.label) > -1,
                                }}
                            />
                        </Col>
                        <Col span={6}></Col>
                    </Row>
                </div>
            </div>
        );
    }, [loading, orderInfoList, statisticsType, orderInfo, dates]);
};

export default OrderAnalysis;

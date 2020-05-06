import React, { useMemo, useRef, useCallback, useEffect, useState } from 'react';
import { Row, Col, Radio, Button } from 'antd';
import { JsonForm, LoadingButton } from 'react-components';
import { JsonFormRef, FormField } from 'react-components/es/JsonForm';
import OrderFunnel from './components/OrderFunnel';
import DateRange from './components/DateRange';
import { getOrderDashboardData, getPlatformAndStore } from '@/services/dashboard';
import dayjs, { Dayjs } from 'dayjs';
import { IOrderDashboardReq, IOrderDashboardRes } from '@/interface/IDashboard';
import { startDateToUnix, endDateToUnix } from 'react-components/es/utils/date';
import { getAllTabCount } from '@/services/order-manage';
import { Link } from 'umi';

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

const timeFormat = 'YYYY-MM-DD';

interface ICatagoryOrderItem {
    penddingOrderCount: number;
    penddingPayCount: number;
}

const OrderAnalysis: React.FC = props => {
    const searchRef = useRef<JsonFormRef>(null);
    const [loading, setLoading] = useState(false);
    const [statisticsType, setStatisticsType] = useState('0');
    const [dates, setDates] = useState<[Dayjs, Dayjs]>([dayjs(), dayjs()]);
    const [orderInfo, setOrderInfo] = useState<IOrderDashboardRes>({});
    const [catagoryOrderCount, setCatagoryOrderCount] = useState<ICatagoryOrderItem>({
        penddingOrderCount: 0,
        penddingPayCount: 0,
    });

    const _getOrderDashboardData = useCallback(() => {
        setLoading(true);
        // console.log(searchRef.current?.getFieldsValue(), dates, statisticsType);
        return getOrderDashboardData({
            ...searchRef.current?.getFieldsValue(),
            statistics_start_time: startDateToUnix(dates[0]),
            statistics_end_time:
                dayjs().format(timeFormat) === dates[1].format(timeFormat)
                    ? dayjs().unix()
                    : endDateToUnix(dates[1]),
            statistics_type: statisticsType,
        } as IOrderDashboardReq)
            .then(res => {
                setOrderInfo(res.data);
            })
            .finally(() => {
                setLoading(false);
            });
    }, [statisticsType, dates]);

    const _getAllTabCount = useCallback(() => {
        getAllTabCount(2).then(res => {
            // console.log('getAllTabCount', res);
            const { penddingOrderCount, penddingPayCount } = res.data;
            setCatagoryOrderCount({
                penddingOrderCount,
                penddingPayCount,
            });
        });
    }, []);

    useEffect(() => {
        _getAllTabCount();
        _getOrderDashboardData();
        getPlatformAndStore();
    }, []);

    return useMemo(() => {
        const { penddingOrderCount, penddingPayCount } = catagoryOrderCount;
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
                        <DateRange dates={dates} setDates={setDates} />
                        <Radio.Group
                            value={statisticsType}
                            onChange={e => setStatisticsType(e.target.value)}
                            buttonStyle="solid"
                        >
                            <Radio.Button value="0">订单量</Radio.Button>
                            <Radio.Button value="1">GMV($)</Radio.Button>
                        </Radio.Group>
                    </div>
                    <Row style={{ marginTop: 30 }}>
                        <Col span={18}>
                            <OrderFunnel
                                orderInfo={orderInfo}
                                loading={loading}
                                startDate={dates[0]}
                                statisticsType={statisticsType}
                            />
                        </Col>
                        <Col span={6}>
                            <div className={styles.jumpSection}>
                                <div className={styles.title}>
                                    待处理订单数量：{penddingOrderCount + penddingPayCount}单
                                </div>
                                <div className={styles.item}>
                                    <div>剩余待拍单</div>
                                    <div>{penddingOrderCount}单</div>
                                    <Link to="/order?type=2">
                                        <Button type="primary">去拍单</Button>
                                    </Link>
                                </div>
                                <div className={styles.item}>
                                    <div>待发货订单</div>
                                    <div>{penddingPayCount}单</div>
                                    <Link to="/order?type=3">
                                        <Button type="primary">去支付</Button>
                                    </Link>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </div>
            </div>
        );
    }, [loading, statisticsType, orderInfo, dates, statisticsType, catagoryOrderCount]);
};

export default OrderAnalysis;

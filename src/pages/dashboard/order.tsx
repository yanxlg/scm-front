import React, { useMemo, useRef, useCallback, useEffect, useState } from 'react';
import { Row, Col, Radio } from 'antd';
import { JsonForm, LoadingButton } from 'react-components';
import { JsonFormRef, FormField } from 'react-components/es/JsonForm';
import OrderFunnel from './components/OrderFunnel';
import DateRange from './components/DateRange';
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

const timeFormat = 'YYYY-MM-DD';

const OrderAnalysis: React.FC = props => {
    const searchRef = useRef<JsonFormRef>(null);
    const [loading, setLoading] = useState(false);
    const [statisticsType, setStatisticsType] = useState('0');
    const [dates, setDates] = useState<[Dayjs, Dayjs]>([dayjs(), dayjs()]);
    const [orderInfo, setOrderInfo] = useState<IOrderDashboardRes>({});

    const _getOrderDashboardData = useCallback(() => {
        setLoading(true);
        console.log(searchRef.current?.getFieldsValue(), dates, statisticsType);
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
    }, [statisticsType]);

    useEffect(() => {
        _getOrderDashboardData();
        getPlatformAndStore();
    }, []);

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
                        <Col span={6}></Col>
                    </Row>
                </div>
            </div>
        );
    }, [loading, statisticsType, orderInfo, dates, statisticsType]);
};

export default OrderAnalysis;

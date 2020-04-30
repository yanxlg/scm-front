import React, { useMemo, useRef, useCallback } from 'react';
import { Row, Col, Radio, Button } from 'antd';
import { JsonForm, LoadingButton } from 'react-components';
import { JsonFormRef, FormField } from 'react-components/es/JsonForm';
// import OrderFunnel from './components/OrderFunnel';
import DateRange from './components/DateRange';

import formStyles from 'react-components/es/JsonForm/_form.less';
import styles from './_order.less';

const formFields: FormField[] = [
    {
        type: 'select',
        name: 'a1',
        label: '销售平台',
        // className: 'order-input',
        optionList: [],
    },
    {
        type: 'select',
        name: 'a2',
        label: '销售店铺',
        // className: 'order-input',
        optionList: [],
    },
];

const OrderAnalysis: React.FC = props => {
    const searchRef = useRef<JsonFormRef>(null);
    return useMemo(() => {
        return (
            <div className={styles.container}>
                <div className={styles.formSection}>
                    <JsonForm
                        ref={searchRef}
                        fieldList={formFields}
                        // labelClassName="order-label"
                        initialValues={{}}
                    >
                        <div>
                            <LoadingButton
                                type="primary"
                                className={formStyles.formBtn}
                                onClick={() => Promise.resolve()}
                            >
                                查询
                            </LoadingButton>
                            <LoadingButton
                                className={formStyles.formBtn}
                                onClick={() => Promise.resolve()}
                            >
                                刷新
                            </LoadingButton>
                        </div>
                    </JsonForm>
                </div>
                <div className={styles.chartSection}>
                    <div className={styles.operationBox}>
                        <DateRange />
                    </div>
                    <Row>
                        <Col span={14}>
                            {/* <OrderFunnel /> */}
                        </Col>
                        <Col span={10}></Col>
                    </Row>
                </div>
            </div>
        );
    }, []);
};

export default OrderAnalysis;

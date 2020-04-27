import React, { useMemo, useRef } from 'react';
import { Row, Col } from 'antd';
import { JsonForm, LoadingButton } from 'react-components';
import { JsonFormRef, FormField } from 'react-components/es/JsonForm';
import OrderFunnel from './components/OrderFunnel';

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
                                导出
                            </LoadingButton>
                        </div>
                    </JsonForm>
                </div>
                <div className={styles.chartSection}>
                    <Row>
                        <Col span={14}>
                            <OrderFunnel />
                        </Col>
                        <Col span={10}></Col>
                    </Row>
                </div>
            </div>
        );
    }, []);
};

export default OrderAnalysis;

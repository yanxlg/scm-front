import React, { useMemo, useRef, useCallback } from 'react';
import { Row, Col, Radio, Button, Table } from 'antd';
import { JsonForm, LoadingButton } from 'react-components';
import { JsonFormRef, FormField } from 'react-components/es/JsonForm';
// import OrderFunnel from './components/OrderFunnel';
import DateRange from './components/DateRange';

import formStyles from 'react-components/es/JsonForm/_form.less';
import styles from './_overview.less';
import { ColumnsType } from 'antd/es/table';

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


// : ColumnsType<any>[]
const columns: ColumnsType<object> = [
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

const dataSource = [
    {
        label: '需采购',
        count: 3000,
        percentage: '',
        reserveStock: 1000,
        reserveStockPercentage: ''
    },
    {
        label: '已拍单',
        count: 2000,
        percentage: '50%',
        reserveStock: '',
        reserveStockPercentage: ''
    },
    {
        label: '已支付',
        count: 1500,
        percentage: '50%',
        reserveStock: '',
        reserveStockPercentage: ''
    },
    {
        label: '已发货',
        count: 1200,
        percentage: '50%',
        reserveStock: '',
        reserveStockPercentage: ''
    },
    {
        label: '已签收',
        count: 1000,
        percentage: '50%',
        reserveStock: '',
        reserveStockPercentage: ''
    },
    {
        label: '已入库',
        count: 800,
        percentage: '50%',
        reserveStock: '',
        reserveStockPercentage: ''
    },
    {
        label: '需采购--已出库',
        count: 700,
        percentage: '50%',
        reserveStock: 500,
        reserveStockPercentage: '80%'
    },
    {
        label: '已收货',
        count: 500,
        percentage: '50%',
        reserveStock: 300,
        reserveStockPercentage: '50%'
    },
];

const Overview: React.FC = props => {
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
                    {/* <DateRange /> */}
                    <Row style={{marginTop: 30}}>
                        <Col span={16}>
                            <Table
                                bordered
                                columns={columns}
                                dataSource={dataSource}
                                pagination={false}
                            />
                        </Col>
                        <Col span={8}></Col>
                    </Row>
                </div>
            </div>
        );
    }, []);
};

export default Overview;

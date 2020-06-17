import React, { useRef } from 'react';
import { Button } from 'antd';
import Container from '@/components/Container';
import { JsonForm, LoadingButton } from 'react-components';
import { JsonFormRef, FormField } from 'react-components/es/JsonForm';

import formStyles from 'react-components/es/JsonForm/_form.less';
import { getCatagoryList } from '@/services/goods';
import { EmptyObject } from '@/config/global';

const _getCatagoryList = () =>
    getCatagoryList()
        .then(({ convertList = [] } = EmptyObject) => {
            return convertList;
        })
        .catch(() => {
            return [];
        });

const formFields: FormField[] = [
    {
        type: 'input',
        label: 'Commodity ID',
        name: 'commodity_id',
        placeholder: '请输入',
        // className: styles.input,
        formatter: 'number_str_arr',
    },
    {
        type: 'treeSelect',
        label: '一级品类',
        name: 'first_category',
        optionList: _getCatagoryList,
        placeholder: '请选择',
        onChange: (name, form) => {
            form.resetFields(['second_category']);
            form.resetFields(['third_category']);
        },
        // formatter: 'join',
    },
    {
        type: 'treeSelect',
        label: '二级品类',
        name: 'second_category',
        optionListDependence: {
            name: 'first_category',
            key: 'children',
        },
        placeholder: '请选择',
        optionList: _getCatagoryList,
        onChange: (name, form) => {
            form.resetFields(['third_category']);
        },
        // formatter: 'join',
    },
    {
        type: 'treeSelect',
        label: '三级品类',
        name: 'third_category',
        optionListDependence: {
            name: ['first_category', 'second_category'],
            key: 'children',
        },
        placeholder: '请选择',
        optionList: _getCatagoryList,
        // formatter: 'join',
    },
    // {
    //     type: 'inputRange',
    //     label: 'sku数量',
    //     name: ['min_sku', 'max_sku'],
    //     className: styles.inputMin,
    // },
    // {
    //     type: 'inputRange',
    //     label: '价格范围（￥）',
    //     name: ['min_price', 'max_price'],
    //     className: styles.inputMin,
    //     precision: 2,
    // },
    // {
    //     type: 'inputRange',
    //     label: '销量',
    //     name: ['min_sale', 'max_sale'],
    //     className: styles.inputMin,
    // },
    // {
    //     type: 'positiveInteger',
    //     label: '评论数量>=',
    //     name: 'min_comment',
    //     // placeholder: '多个逗号隔开',
    //     className: styles.inputMin,
    //     formatter: 'number',
    // },
];

const Selection: React.FC = () => {
    const formRef = useRef<JsonFormRef>(null);

    return (
        <Container>
            <JsonForm ref={formRef} fieldList={formFields} initialValues={{}}>
                <div>
                    <LoadingButton
                        type="primary"
                        className={formStyles.formBtn}
                        onClick={() => Promise.resolve()}
                    >
                        查询
                    </LoadingButton>
                    <LoadingButton className={formStyles.formBtn} onClick={() => Promise.resolve()}>
                        刷新
                    </LoadingButton>
                    <Button
                    // disabled={total <= 0}
                    // className={formStyles.formBtn}
                    // onClick={() => setExportStatus(true)}
                    >
                        导出
                    </Button>
                </div>
            </JsonForm>
        </Container>
    );
};

export default React.memo(Selection);

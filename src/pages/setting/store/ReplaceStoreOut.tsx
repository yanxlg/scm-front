import React, { useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { FitTable, JsonForm, LoadingButton } from 'react-components';
import { FormField } from 'react-components/src/JsonForm/index';
import { FormInstance } from 'antd/es/form';
import styles from '@/styles/_store.less';
import formStyles from 'react-components/es/JsonForm/_form.less';
import classNames from 'classnames';
import { Button, Form } from 'antd';
import { TableProps } from 'antd/es/table';
import { IParentOrderItem } from '@/pages/order/components/PaneAll';
import { utcToLocal } from 'react-components/es/utils/date';
import { ColumnsType } from 'antd/es/table/interface';

const fieldList: Array<FormField> = [
    {
        type: 'select',
        name: 'store',
        label: '店铺名',
        defaultValue: '',
        optionList: [
            {
                name: '全部',
                value: '',
            },
        ],
    },
    {
        type: 'select',
        name: 'type',
        colon: false,
        defaultValue: '1',
        formItemClassName: classNames(formStyles.formItem, styles.formAsLabel),
        optionList: [
            {
                name: '售卖商品Commoity ID',
                value: '1',
            },
            {
                name: '售卖商品Commoity SKU ID',
                value: '2',
            },
            {
                name: '出库商品Commoity ID',
                value: '3',
            },
            {
                name: '出库商品Commoity SKU ID',
                value: '4',
            },
        ],
    },
    {
        type: 'dynamic',
        shouldUpdate: (prevStore, nextStore) => {
            return prevStore.type !== nextStore.type;
        },
        dynamic: (form: FormInstance) => {
            const type = form.getFieldValue('type');
            return {
                type: 'input',
                colon: false,
                name: `value_${type}`,
                placeholder: '逗号隔开',
                formatter: 'multipleToArray',
            };
        },
    },
];

declare interface EditColumnsType {}

const ReplaceStoreOut = () => {
    const [form] = Form.useForm();
    const [editingKey, setEditingKey] = useState<string | undefined>(undefined);

    const formElement = useMemo(() => {
        return (
            <JsonForm fieldList={fieldList}>
                <LoadingButton type="primary" className={formStyles.formBtn} onClick={() => {}}>
                    查询
                </LoadingButton>
                <LoadingButton className={formStyles.formBtn} onClick={() => {}}>
                    刷新
                </LoadingButton>
            </JsonForm>
        );
    }, []);

    const columns: ColumnsType<any> = [
        {
            dataIndex: '0',
            title: '店铺名',
            width: 150,
        },
        {
            dataIndex: '1',
            title: '售卖商品 commodity id',
            width: 150,
        },
        {
            dataIndex: '2',
            title: '售卖商品 commodity sku id',
            width: 150,
        },
        {
            dataIndex: '3',
            title: '出库商品commodity id',
            width: 150,
        },
        {
            dataIndex: '4',
            title: '出库商品commodity sku id',
            width: 150,
        },
        {
            dataIndex: '5',
            title: '出库系数',
            width: 150,
        },
        {
            dataIndex: 'actions',
            title: '操作',
            width: 200,
        },
    ];

    const isEditing = (record: ITableItem) => record.account_id === editingKey;

    const mergedColumns = columns.map(col => {
        if (!col.editable) {
            return col;
        }
        return {
            ...col,
            onCell: (record: ITableItem) => ({
                record,
                dataIndex: col.dataIndex,
                title: col.title,
                editing: isEditing(record),
            }),
        };
    });

    const edit = (record: ITableItem) => {
        form.setFieldsValue({ ...record });
        setEditingKey(record.account_id);
    };

    const save = async (key: string) => {
        try {
            const values = await form.validateFields();
            await saveCookie({
                account_id: key,
                cookie: values.cookie,
            });
            setEditingKey(undefined);
            refresh();
        } catch (errInfo) {}
    };

    const table = useMemo(() => {
        return (
            <Form form={form} component={false}>
                <FitTable columns={columns} dataSource={[]} />
            </Form>
        );
    }, []);

    return useMemo(() => {
        return (
            <div>
                {formElement}
                {table}
            </div>
        );
    }, []);
};

export default ReplaceStoreOut;

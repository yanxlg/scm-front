import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { FitTable, JsonForm, LoadingButton, useList } from 'react-components';
import { FormField } from 'react-components/src/JsonForm/index';
import { FormInstance } from 'antd/es/form';
import styles from '@/styles/_store.less';
import formStyles from 'react-components/es/JsonForm/_form.less';
import classNames from 'classnames';
import { Button, Form, Input } from 'antd';
import { TableProps } from 'antd/es/table';
import { IParentOrderItem } from '@/pages/order/components/PaneAll';
import { utcToLocal } from 'react-components/es/utils/date';
import { ColumnType } from 'antd/es/table/interface';
import { queryReplaceStoreOutList } from '@/services/setting';
import { JsonFormRef } from 'react-components/es/JsonForm';

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

declare type EditColumnsType<T> = Array<
    ColumnType<T> & {
        editable?: boolean;
    }
>;

declare interface IReplaceStoreOutItem {
    id: string;
}

interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
    editing: boolean;
    dataIndex: string;
    title: any;
    inputType: 'number' | 'text';
    record: IReplaceStoreOutItem;
    index: number;
    children: React.ReactNode;
}

const EditableCell: React.FC<EditableCellProps> = ({
    editing,
    dataIndex,
    title,
    inputType,
    record,
    index,
    children,
    ...restProps
}) => {
    return (
        <td {...restProps}>
            {editing ? (
                <Form.Item
                    name={dataIndex}
                    style={{ margin: 0 }}
                    rules={[
                        {
                            required: true,
                            message: `请输入Cookie`,
                        },
                    ]}
                >
                    <Input />
                </Form.Item>
            ) : (
                children
            )}
        </td>
    );
};

const ReplaceStoreOut = () => {
    const [form] = Form.useForm();
    const formRef = useRef<JsonFormRef>(null);
    const [editingKey, setEditingKey] = useState<string | undefined>(undefined);
    const { total, loading, dataSource, pageSize, pageNumber } = useList({
        queryList: queryReplaceStoreOutList,
        formRef: formRef,
    });

    const isEditing = (record: IReplaceStoreOutItem) => record.id === editingKey;

    const formElement = useMemo(() => {
        return (
            <JsonForm fieldList={fieldList} ref={formRef}>
                <LoadingButton type="primary" className={formStyles.formBtn} onClick={() => {}}>
                    查询
                </LoadingButton>
                <LoadingButton className={formStyles.formBtn} onClick={() => {}}>
                    刷新
                </LoadingButton>
            </JsonForm>
        );
    }, []);
    const columns: EditColumnsType<IReplaceStoreOutItem> = [
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
            render: (_, record) => {
                const isEditable = isEditing(record);
                return (
                    <>
                        {isEditable ? (
                            <Button type="link">保存</Button>
                        ) : (
                            <React.Fragment>
                                <Button type="link">查看商品</Button>
                                <Button type="link">修改</Button>
                            </React.Fragment>
                        )}
                        <Button type="link" danger={true}>
                            删除
                        </Button>
                    </>
                );
            },
        },
    ];

    const mergedColumns = columns.map(col => {
        if (!col.editable) {
            return col;
        }
        return {
            ...col,
            onCell: (record: IReplaceStoreOutItem) => ({
                record,
                dataIndex: col.dataIndex,
                title: col.title,
                editing: isEditing(record),
            }),
        };
    });

    const edit = (record: IReplaceStoreOutItem) => {
        form.setFieldsValue({ ...record });
        setEditingKey(record.id);
    };

    const save = async (key: string) => {};

    const table = useMemo(() => {
        return (
            <Form form={form} component={false}>
                <FitTable
                    components={{
                        body: {
                            cell: EditableCell,
                        },
                    }}
                    columns={columns}
                    dataSource={dataSource}
                    pagination={{
                        current: pageNumber,
                        pageSize: pageSize,
                        total: total,
                        showSizeChanger: true,
                        position: ['topRight', 'bottomRight'],
                    }}
                />
            </Form>
        );
    }, [loading]);

    return useMemo(() => {
        return (
            <div>
                {formElement}
                {table}
            </div>
        );
    }, [loading]);
};

export default ReplaceStoreOut;

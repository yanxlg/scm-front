import React, { useMemo, useRef, useEffect, useState } from 'react';
import { Button, Form, Input } from 'antd';
import classNames from 'classnames';
import { FormField, JsonFormRef } from 'react-components/lib/JsonForm';
import { FormInstance } from 'antd/lib/form';
import { JsonForm, LoadingButton, FitTable, useList } from 'react-components';
import { ColumnType } from 'antd/lib/table';
import { queryShopList } from '@/services/global';

import formStyles from 'react-components/es/JsonForm/_form.less';
import styles from '@/styles/_store.less';
import { IOptionItem } from 'react-components/lib/JsonForm/items/Select';
import { queryReplaceStoreOutList } from '@/services/setting';

declare type EditColumnsType<T> = Array<
    ColumnType<T> & {
        editable?: boolean;
        onCell?: any;
    }
>;

declare interface ICommodityItem {
    [key: string]: any;
}

interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
    editing: boolean;
    dataIndex: string;
    title: any;
    inputType: 'select' | 'input';
    record: ICommodityItem;
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
    // console.log(111111, editing);
    return (
        <td {...restProps}>
            {editing ? (
                <Form.Item
                    name={dataIndex}
                    style={{ margin: 0 }}
                    rules={[
                        {
                            required: true,
                            message: `不能为空`,
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

const dataSource = [
    {
        id: '1',
        a1: 1,
        a2: 2,
        a3: 3,
    },
];

const OfflinePurchase: React.FC = ({}) => {
    const [form] = Form.useForm();
    const formRef = useRef<JsonFormRef>(null);
    const [editingKey, setEditingKey] = useState<string | undefined>(undefined);
    const [shopList, setShopList] = useState<IOptionItem[]>([]);
    const {
        loading,
        pageSize,
        pageNumber,
        total,
        // dataSource
    } = useList({
        queryList: queryReplaceStoreOutList,
        formRef: formRef,
    });

    const isEditing = (record: ICommodityItem) => record.id === editingKey;

    const edit = (record: ICommodityItem) => {
        form.setFieldsValue({ ...record });
        setEditingKey(record.id);
    };

    const save = () => {
        console.log(111111, form.getFieldsValue());
    };

    const fieldList = useMemo<Array<FormField>>(() => {
        return [
            {
                type: 'select',
                name: 'store',
                label: '店铺名',
                defaultValue: '',
                syncDefaultOption: {
                    name: '全部',
                    value: '',
                },
                optionList: () =>
                    queryShopList().then(({ data }) => {
                        const list = data.map(({ merchant_id, merchant_name }) => ({
                            name: merchant_name,
                            value: merchant_id,
                        }));
                        setShopList(list);
                        return list;
                    }),
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
    }, []);

    const formElement = useMemo(() => {
        return (
            <JsonForm fieldList={fieldList} ref={formRef}>
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
            </JsonForm>
        );
    }, []);

    const columns = useMemo<EditColumnsType<ICommodityItem>>(() => {
        return [
            {
                dataIndex: 'a1',
                title: '店铺名',
                width: 200,
                align: 'center',
                editable: true,
            },
            {
                dataIndex: 'a2',
                title: 'Commodity ID',
                width: 200,
                align: 'center',
                editable: true,
            },
            {
                dataIndex: 'a3',
                title: 'Commodity Sku ID',
                width: 200,
                align: 'center',
                editable: true,
            },
            {
                dataIndex: 'actions',
                title: '操作',
                width: 200,
                align: 'center',
                render: (_, record) => {
                    const isEditable = isEditing(record);
                    return (
                        <>
                            {isEditable ? (
                                <Button type="link" onClick={() => save()}>
                                    保存
                                </Button>
                            ) : (
                                <>
                                    <Button type="link">查看商品</Button>
                                    <Button type="link" onClick={() => edit(record)}>
                                        修改
                                    </Button>
                                </>
                            )}
                            <Button type="link" danger={true}>
                                删除
                            </Button>
                        </>
                    );
                },
            },
        ];
    }, [editingKey]);

    const table = useMemo(() => {
        // console.log();
        const mergedColumns = columns.map(col => {
            if (!col.editable) {
                return col;
            }
            return {
                ...col,
                onCell: (record: ICommodityItem) => {
                    // console.log('onCell', isEditing(record));
                    return {
                        record,
                        dataIndex: col.dataIndex,
                        title: col.title,
                        editing: isEditing(record),
                    };
                },
            };
        }) as EditColumnsType<ICommodityItem>;
        return (
            <Form form={form} component={false}>
                <FitTable
                    bordered
                    // loading={loading}
                    components={{
                        body: {
                            cell: EditableCell,
                        },
                    }}
                    columns={mergedColumns}
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
    }, [loading, editingKey]);

    return (
        <>
            {formElement}
            {table}
        </>
    );
};

export default OfflinePurchase;

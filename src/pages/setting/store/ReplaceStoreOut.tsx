import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import {
    FitTable,
    JsonForm,
    LoadingButton,
    PopConfirmLoadingButton,
    RichInput,
    useList,
} from 'react-components';
import { FormField } from 'react-components/src/JsonForm/index';
import { FormInstance } from 'antd/es/form';
import styles from '@/styles/_store.less';
import formStyles from 'react-components/es/JsonForm/_form.less';
import classNames from 'classnames';
import { Button, Form, Input, Select } from 'antd';
import { TableProps } from 'antd/es/table';
import { IParentOrderItem } from '@/pages/order/components/PaneAll';
import { utcToLocal } from 'react-components/es/utils/date';
import { ColumnType } from 'antd/es/table/interface';
import { queryReplaceStoreOutList } from '@/services/setting';
import { JsonFormRef } from 'react-components/es/JsonForm';
import { queryShopList } from '@/services/global';
import { SelectProps } from 'antd/lib/select';
import { PlusCircleOutlined } from '@ant-design/icons';
import { setLocale } from '@@/plugin-locale/localeExports';
import useFetch from '@/hooks/useFetch';
import { IReplaceStoreOutItem } from '@/interface/ISetting';

const fieldList: Array<FormField> = [
    {
        type: 'select',
        name: 'store',
        label: '店铺名',
        defaultValue: '',
        syncDefaultOption: {
            value: '',
            name: '全部',
        },
        optionList: () =>
            queryShopList().then(({ data = [] }) => {
                return data.map(({ merchant_name, merchant_id }) => {
                    return { name: merchant_name, value: merchant_id };
                });
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

interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
    editing: boolean;
    dataIndex: string;
    title: any;
    inputType: 'number' | 'text';
    record: IReplaceStoreOutItem;
    index: number;
    children: React.ReactNode;
}

const ShopSelect = (props: SelectProps<string>) => {
    const [list, setList] = useState<Array<{ name: string; value: string }>>([]);
    useEffect(() => {
        queryShopList().then(({ data = [] }) => {
            setList(
                data.map(({ merchant_name, merchant_id }) => {
                    return { name: merchant_name, value: merchant_id };
                }),
            );
        });
    }, []);

    return (
        <Select {...props}>
            {list.map(({ name, value }) => (
                <Select.Option key={value} value={value}>
                    {name}
                </Select.Option>
            ))}
        </Select>
    );
};

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
    const message =
        dataIndex === '0'
            ? '请选择店铺'
            : dataIndex === '1'
            ? '请输入售卖商品commodity id'
            : dataIndex === '2'
            ? '请输入售卖商品commodity sku id'
            : dataIndex === '3'
            ? '请输入出库商品commodity id'
            : dataIndex === '4'
            ? '请输入出库商品commodity sku id'
            : '请输入出库系数';

    return (
        <td {...restProps}>
            {editing ? (
                <Form.Item
                    name={dataIndex}
                    style={{ margin: 0 }}
                    rules={[
                        {
                            required: true,
                            message: message,
                        },
                    ]}
                >
                    {dataIndex === '0' ? (
                        <ShopSelect />
                    ) : dataIndex === '5' ? (
                        <RichInput richType={'positiveInteger'} />
                    ) : (
                        <Input allowClear={true} />
                    )}
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

    const { dataSource, setDataSource, loading, setLoading } = useList({
        queryList: queryReplaceStoreOutList,
        formRef: formRef,
    });

    const isEditing = (record: IReplaceStoreOutItem) => record.id === editingKey;

    const edit = (record: IReplaceStoreOutItem) => {
        form.setFieldsValue({ ...record });
        setEditingKey(record.id);
    };

    const del = (key: string) => {
        return new Promise(() => {});
    };

    const add = () => {
        // 如果已经有一条了则不会创建新的
        if (dataSource[dataSource.length - 1]?.id !== '') {
            setDataSource(
                dataSource.concat({
                    id: '',
                }),
            );
            setEditingKey('');
        }
    };

    const save = async (key: string) => {
        // 保存
        form.validateFields().then((values: any) => {
            console.log(values);
        });
    };

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
            align: 'center',
            width: 150,
            editable: true,
        },
        {
            dataIndex: '1',
            title: '售卖商品 commodity id',
            align: 'center',
            width: 150,
            editable: true,
        },
        {
            dataIndex: '2',
            title: '售卖商品 commodity sku id',
            align: 'center',
            width: 150,
            editable: true,
        },
        {
            dataIndex: '3',
            title: '出库商品commodity id',
            align: 'center',
            width: 150,
            editable: true,
        },
        {
            dataIndex: '4',
            title: '出库商品commodity sku id',
            align: 'center',
            width: 150,
            editable: true,
        },
        {
            dataIndex: '5',
            title: '出库系数',
            align: 'center',
            width: 150,
            editable: true,
        },
        {
            dataIndex: 'actions',
            title: '操作',
            align: 'center',
            width: 200,
            render: (_, record) => {
                const isEditable = isEditing(record);
                return (
                    <>
                        {isEditable ? (
                            <Button type="link" onClick={() => save(record.id)}>
                                保存
                            </Button>
                        ) : (
                            <React.Fragment>
                                <Button type="link">查看商品</Button>
                                <Button type="link" onClick={() => edit(record)}>
                                    修改
                                </Button>
                            </React.Fragment>
                        )}
                        <PopConfirmLoadingButton
                            popConfirmProps={{
                                title: '确定要删除该替换出库记录吗？',
                                okText: '确定',
                                cancelText: '取消',
                                placement: 'topRight',
                                onConfirm: () => del(record.id),
                            }}
                            buttonProps={{
                                children: '删除',
                                type: 'link',
                                danger: true,
                            }}
                        />
                    </>
                );
            },
        },
    ];

    const mergedColumns = useMemo(() => {
        return columns.map(col => {
            if (!col.editable) {
                return col;
            }
            return {
                ...col,
                onCell: (record: IReplaceStoreOutItem) => ({
                    record,
                    dataIndex: col.dataIndex,
                    title: col.title as string,
                    editing: isEditing(record),
                }),
            };
        });
    }, [editingKey]);

    const table = useMemo(() => {
        return (
            <Form form={form} component={false} className={formStyles.formHelpAbsolute}>
                <FitTable
                    components={{
                        body: {
                            cell: EditableCell,
                        },
                    }}
                    columns={mergedColumns}
                    dataSource={dataSource}
                    pagination={false}
                />
            </Form>
        );
    }, [loading, editingKey]);

    return useMemo(() => {
        return (
            <div>
                {formElement}
                {table}
                <Button type="link" icon={<PlusCircleOutlined />} onClick={add}>
                    添加替换出库配置
                </Button>
            </div>
        );
    }, [dataSource, editingKey]);
};

export default ReplaceStoreOut;

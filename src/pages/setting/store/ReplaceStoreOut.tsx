import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
    FitTable,
    JsonForm,
    LoadingButton,
    PopConfirmLoadingButton,
    RichInput,
    useList,
    useModal,
} from 'react-components';
import { FormField } from 'react-components/es/JsonForm/index';
import { FormInstance } from 'antd/es/form';
import styles from '@/styles/_store.less';
import formStyles from 'react-components/es/JsonForm/_form.less';
import classNames from 'classnames';
import { Button, Form, Input, message, Select, Tooltip } from 'antd';
import { TableProps } from 'antd/es/table';
import { ColumnType } from 'antd/es/table/interface';
import {
    addReplaceStoreOutList,
    deleteReplaceStoreOutList,
    queryReplaceStoreOutList,
    updateReplaceStoreOutList,
} from '@/services/setting';
import { JsonFormRef } from 'react-components/es/JsonForm';
import { PlusCircleOutlined, QuestionCircleFilled } from '@ant-design/icons';
import { IReplaceStoreOutItem } from '@/interface/ISetting';
import { ITaskListItem } from '@/interface/ITask';
import ModalWrap from '@/pages/setting/store/ReplaceModal';

const fieldList: Array<FormField> = [
    {
        type: 'select',
        name: 'type',
        colon: false,
        formItemClassName: classNames(formStyles.formItem, styles.formAsLabel),
        className: styles.selectType,
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
            const name =
                type === '1'
                    ? 'sale_commodity_ids'
                    : type === '2'
                    ? 'sale_commodity_sku_ids'
                    : type === '3'
                    ? 'outbound_commodity_ids'
                    : 'outbound_commodity_sku_ids';
            return {
                type: 'input',
                colon: false,
                name: name,
                placeholder: '逗号隔开',
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
    dataIndex: keyof IReplaceStoreOutItem;
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
    const message =
        dataIndex === 'sale_commodity_id'
            ? '必填'
            : dataIndex === 'sale_commodity_sku_id'
            ? '必填'
            : dataIndex === 'outbound_commodity_id'
            ? '必填'
            : dataIndex === 'outbound_commodity_sku_id'
            ? '必填'
            : '请以整数为单位';

    return (
        <td {...restProps}>
            {editing ? (
                <Form.Item
                    name={dataIndex}
                    style={{ margin: 0, padding: '10px 0' }}
                    validateTrigger="onBlur"
                    rules={[
                        {
                            required: true,
                            message: message,
                        },
                    ]}
                >
                    {dataIndex === 'outbound_score' ? (
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

const scroll: TableProps<ITaskListItem>['scroll'] = { x: true, scrollToFirstRowOnChange: true };

const ReplaceStoreOut = () => {
    const [form] = Form.useForm();
    const formRef = useRef<JsonFormRef>(null);
    const [editingKey, setEditingKey] = useState<string | undefined>(undefined);
    const { visible, setVisibleProps, onClose } = useModal<string>();

    const {
        dataSource,
        setDataSource,
        loading,
        total,
        pageNumber,
        pageSize,
        onSearch,
        onReload,
        onChange,
    } = useList({
        queryList: queryReplaceStoreOutList,
        formRef: formRef,
    });

    const isEditing = (record: IReplaceStoreOutItem) => record.id === editingKey;

    const edit = (record: IReplaceStoreOutItem) => {
        setDataSource(dataSource => {
            return dataSource.filter(data => data.id !== '');
        });
        form.setFieldsValue({ ...record });
        setEditingKey(record.id);
    };

    const del = (id: string) => {
        if (id === '') {
            return Promise.resolve().then(() => {
                setDataSource(dataSource => {
                    return dataSource.filter(data => data.id !== id);
                });
                setEditingKey(editKey => {
                    return editKey === id ? undefined : editKey;
                });
                message.success('删除成功！');
            });
        } else {
            return deleteReplaceStoreOutList(id as string).then(() => {
                message.success('删除成功！');
                onReload();
            });
        }
    };

    const add = () => {
        // 如果已经有一条了则不会创建新的
        if (dataSource[0]?.id !== '') {
            setDataSource(dataSource => {
                return [
                    {
                        id: '',
                    } as IReplaceStoreOutItem,
                ].concat(dataSource);
            });
            setEditingKey('');
            form.resetFields();
        }
    };

    const save = async (id: string) => {
        // 保存
        const values = await form.validateFields();
        if (id === '') {
            await addReplaceStoreOutList(values);
        } else {
            await updateReplaceStoreOutList({ ...values, id });
        }
        onReload().finally(() => {
            setEditingKey(undefined);
        });
    };

    const formElement = useMemo(() => {
        return (
            <JsonForm
                fieldList={fieldList}
                ref={formRef}
                initialValues={{
                    type: '1',
                }}
            >
                <LoadingButton type="primary" className={formStyles.formBtn} onClick={onSearch}>
                    查询
                </LoadingButton>
                <LoadingButton className={formStyles.formBtn} onClick={onReload}>
                    刷新
                </LoadingButton>
            </JsonForm>
        );
    }, []);

    const columns: EditColumnsType<IReplaceStoreOutItem> = useMemo(() => {
        return [
            {
                dataIndex: 'sale_commodity_id',
                title: '售卖商品 commodity id',
                align: 'center',
                width: 150,
                editable: true,
            },
            {
                dataIndex: 'sale_commodity_sku_id',
                title: '售卖商品 commodity sku id',
                align: 'center',
                width: 180,
                editable: true,
            },
            {
                dataIndex: 'outbound_commodity_id',
                title: '出库商品commodity id',
                align: 'center',
                width: 150,
                editable: true,
            },
            {
                dataIndex: 'outbound_commodity_sku_id',
                title: '出库商品commodity sku id',
                align: 'center',
                width: 180,
                editable: true,
            },
            {
                dataIndex: 'outbound_score',
                title: (
                    <span>
                        出库系数
                        <Tooltip title="*出库系数=需出库数量/售卖数量">
                            <QuestionCircleFilled />
                        </Tooltip>
                    </span>
                ),
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
                                <LoadingButton type="link" onClick={() => save(record.id)}>
                                    保存
                                </LoadingButton>
                            ) : (
                                <React.Fragment>
                                    <Button type="link" onClick={() => setVisibleProps(record.id)}>
                                        查看商品
                                    </Button>
                                    <Button type="link" onClick={() => edit(record)}>
                                        修改
                                    </Button>
                                </React.Fragment>
                            )}
                            {record.id === '' ? (
                                <Button type="link" danger={true} onClick={() => del(record.id)}>
                                    删除
                                </Button>
                            ) : (
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
                            )}
                        </>
                    );
                },
            },
        ];
    }, [editingKey]);

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
            <Form form={form} className={formStyles.formHelpAbsolute}>
                <FitTable
                    rowKey="id"
                    loading={loading}
                    components={{
                        body: {
                            cell: EditableCell,
                        },
                    }}
                    scroll={scroll}
                    columns={mergedColumns}
                    dataSource={dataSource}
                    onChange={onChange}
                    pagination={
                        {
                            total: total,
                            current: pageNumber,
                            pageSize: pageSize,
                            showSizeChanger: true,
                            position: ['topRight', 'bottomRight'],
                        } as any
                    }
                />
            </Form>
        );
    }, [loading, editingKey, dataSource.length]);

    return useMemo(() => {
        return (
            <div>
                {formElement}
                {table}
                <Button
                    className={styles.absBtn}
                    type="link"
                    icon={<PlusCircleOutlined />}
                    onClick={add}
                >
                    添加替换出库配置
                </Button>
                <ModalWrap visible={visible} onClose={onClose} />
            </div>
        );
    }, [loading, editingKey, dataSource.length, visible]);
};

export default ReplaceStoreOut;

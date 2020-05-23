import React, { useMemo, useRef, useEffect, useState, useCallback } from 'react';
import { Button, Form, Input, message } from 'antd';
import classNames from 'classnames';
import { FormField, JsonFormRef } from 'react-components/lib/JsonForm';
import { FormInstance } from 'antd/lib/form';
import { JsonForm, LoadingButton, FitTable, useList } from 'react-components';
import { ColumnType } from 'antd/lib/table';
import { queryReplaceStoreOutList } from '@/services/setting';
import { PlusCircleOutlined } from '@ant-design/icons';
import GoodsModal from '@/pages/setting/components/store/GoodsModal';
import {
    queryOfflinePurchaseList,
    addOfflinePurchase,
    updateOfflinePurchase,
    delOfflinePurchase,
} from '@/services/setting';

import formStyles from 'react-components/es/JsonForm/_form.less';
import styles from '@/styles/_store.less';
import { IOfflinePurchaseItem } from '@/interface/ISetting';

declare type EditColumnsType<T> = Array<
    ColumnType<T> & {
        editable?: boolean;
        onCell?: any;
    }
>;

interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
    editing: boolean;
    dataIndex: string;
    title: any;
    inputType: 'input';
    record: IOfflinePurchaseItem;
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

const OfflinePurchase: React.FC = ({}) => {
    const [form] = Form.useForm();
    const formRef = useRef<JsonFormRef>(null);
    const [editingKey, setEditingKey] = useState<string | undefined>(undefined);
    // 商品信息弹框
    const [goodsModalStatus, setGoodsModalStatus] = useState(false);
    const [goodsId, setGoodsId] = useState('');
    const {
        loading,
        pageSize,
        pageNumber,
        total,
        dataSource,
        setDataSource,
        onReload,
        onSearch,
    } = useList<IOfflinePurchaseItem>({
        queryList: queryOfflinePurchaseList,
        formRef: formRef,
    });

    const isEditing = (record: IOfflinePurchaseItem) => record.id === editingKey;

    // 删除新增未保存的配置
    const delAddNotSaveConfig = useCallback(dataSource => {
        const index = dataSource.findIndex((item: IOfflinePurchaseItem) => item.id === '');
        // console.log(11111, index, dataSource);
        if (index > -1) {
            const list = [...dataSource];
            list.splice(index, 1);
            setDataSource(list);
        }
    }, []);

    // 新增采购配置
    const _addOfflinePurchase = useCallback(data => {
        return addOfflinePurchase(data)
            .then(() => {
                message.success('新增成功！');
                onSearch();
            })
            .catch(() => {
                message.error('新增失败！');
            });
    }, []);

    // 更新采购配置
    const _updateOfflinePurchase = useCallback((id, data) => {
        return updateOfflinePurchase(id, data)
            .then(() => {
                message.success('更新成功！');
                onReload();
            })
            .catch(() => {
                message.error('更新失败！');
            });
    }, []);

    const edit = useCallback(
        (record: IOfflinePurchaseItem) => {
            delAddNotSaveConfig(dataSource);
            form.setFieldsValue({ ...record });
            setEditingKey(record.id);
        },
        [dataSource],
    );

    const save = useCallback(async id => {
        const data = await form.validateFields();
        return id ? _updateOfflinePurchase(id, data) : _addOfflinePurchase(data);
        // console.log(111111, data);
    }, []);

    const showGoodsModal = useCallback(id => {
        setGoodsId(id);
        setGoodsModalStatus(true);
    }, []);

    const hideGoodsModal = useCallback(() => {
        setGoodsModalStatus(false);
    }, []);

    const addPurchaseConfig = useCallback(() => {
        setEditingKey('');
        setDataSource([
            {
                id: '',
                commodity_id: '',
                commodity_sku_id: '',
            },
            ...dataSource,
        ]);
        form.setFieldsValue({
            id: '',
            commodity_id: '',
            commodity_sku_id: '',
        });
    }, [dataSource]);

    const delPurchaseConfig = useCallback(
        id => {
            if (!id) {
                delAddNotSaveConfig(dataSource);
            } else {
                // const index = dataSource.findIndex(item => item.id === id);
                delOfflinePurchase(id)
                    .then(() => {
                        message.success('删除成功！');
                        onReload();
                    })
                    .catch(() => {
                        message.error('删除失败！');
                    });
            }
        },
        [dataSource],
    );

    const fieldList = useMemo<Array<FormField>>(() => {
        return [
            {
                type: 'select',
                name: 'type',
                colon: false,
                defaultValue: 'commodity_ids',
                formItemClassName: classNames(formStyles.formItem, styles.formAsLabel),
                className: styles.labelSelect,
                optionList: [
                    {
                        name: '售卖商品Commoity ID',
                        value: 'commodity_ids',
                    },
                    {
                        name: '售卖商品Commoity SKU ID',
                        value: 'commodity_sku_ids',
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
                    // console.log(11111, type);
                    return {
                        type: 'input',
                        colon: false,
                        name: `${type || 'commodity_ids'}`,
                        placeholder: '逗号隔开',
                        className: styles.purchaseInput,
                        // formatter: 'multipleToArray',
                    };
                },
            },
        ];
    }, []);

    const formElement = useMemo(() => {
        return (
            <JsonForm fieldList={fieldList} ref={formRef}>
                <LoadingButton type="primary" className={formStyles.formBtn} onClick={onSearch}>
                    查询
                </LoadingButton>
                <LoadingButton className={formStyles.formBtn} onClick={onReload}>
                    刷新
                </LoadingButton>
            </JsonForm>
        );
    }, []);

    const columns = useMemo<EditColumnsType<IOfflinePurchaseItem>>(() => {
        return [
            {
                dataIndex: 'commodity_id',
                title: 'Commodity ID',
                width: 200,
                align: 'center',
                editable: true,
            },
            {
                dataIndex: 'commodity_sku_id',
                title: 'Commodity Sku ID',
                width: 200,
                align: 'center',
                editable: true,
            },
            {
                dataIndex: 'id',
                title: '操作',
                width: 200,
                align: 'center',
                render: (_, record) => {
                    const isEditable = isEditing(record);
                    const { id } = record;
                    return (
                        <>
                            {isEditable ? (
                                <Button type="link" onClick={() => save(id)}>
                                    保存
                                </Button>
                            ) : (
                                <>
                                    <Button type="link" onClick={() => showGoodsModal(id)}>
                                        查看商品
                                    </Button>
                                    <Button type="link" onClick={() => edit(record)}>
                                        修改
                                    </Button>
                                </>
                            )}
                            <Button type="link" danger={true} onClick={() => delPurchaseConfig(id)}>
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
                onCell: (record: IOfflinePurchaseItem) => {
                    // console.log('onCell', isEditing(record));
                    return {
                        record,
                        dataIndex: col.dataIndex,
                        title: col.title,
                        editing: isEditing(record),
                    };
                },
            };
        }) as EditColumnsType<IOfflinePurchaseItem>;
        return (
            <Form form={form} component={false}>
                <FitTable
                    bordered
                    loading={loading}
                    rowKey="id"
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
    }, [loading, editingKey, dataSource]);

    const disabled = useMemo(() => {
        const index = dataSource.findIndex(item => item.id === '');
        return index > -1;
    }, [dataSource]);

    return (
        <>
            {formElement}
            {table}
            <Button type="link" onClick={addPurchaseConfig} disabled={disabled}>
                <PlusCircleOutlined />
                添加线下采购配置
            </Button>
            <GoodsModal visible={goodsModalStatus} id={goodsId} onCancel={hideGoodsModal} />
        </>
    );
};

export default React.memo(OfflinePurchase);

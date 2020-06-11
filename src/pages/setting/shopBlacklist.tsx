import React, { useMemo, useRef, useCallback, useState, ReactText, useEffect } from 'react';
import { Button } from 'antd';
import Container from '@/components/Container';
import { FormField, JsonFormRef } from 'react-components/lib/JsonForm';
import { JsonForm, LoadingButton, useList, FitTable } from 'react-components';
import { queryGoodsSourceList } from '@/services/global';
import { PlusCircleOutlined } from '@ant-design/icons';
import { getStoreBlacklist, deleteBlackStore, saveBlackStore } from '@/services/setting';

import styles from './_shopBlacklist.less';
import formStyles from 'react-components/es/JsonForm/_form.less';
import { ColumnsType } from 'antd/lib/table';
import { ISaveBlackStoreReq } from '@/interface/ISetting';
import { utcToLocal } from 'react-components/src/utils/date';
import { IOptionItem } from 'react-components/lib/JsonForm/items/Select';
import { getStatusDesc } from '@/utils/transform';

const formFields1: FormField[] = [
    {
        type: 'select',
        name: 'purchase_channel',
        label: '采购渠道',
        optionList: () => queryGoodsSourceList(),
    },
    {
        type: 'textarea',
        name: 'merchant_id',
        label: '店铺ID',
        placeholder: '请输入',
        formatter: 'multipleToArray',
    },
];

const formFields2: FormField[] = [
    {
        type: 'select',
        name: 'purchase_channel',
        label: '采购渠道',
        optionList: () => queryGoodsSourceList(),
        rules: [{ required: true }],
    },
    {
        type: 'textarea',
        name: 'merchant_id',
        label: '店铺ID',
        placeholder: '请输入',
        formatter: 'multipleToArray',
        rules: [{ required: true, message: '不能为空' }],
    },
    {
        type: 'textarea',
        name: 'black_store_reason',
        label: '拉给原因',
        placeholder: '请输入',
        className: styles.reason,
        rules: [{ required: true, message: '不能为空' }],
    },
];

const ShopBlacklist: React.FC = props => {
    const form1 = useRef<JsonFormRef>(null);
    const form2 = useRef<JsonFormRef>(null);
    const [addStatus, setAddStatus] = useState(false);
    const [purchaseChannelList, setPurchaseChannelList] = useState<IOptionItem[]>([]);
    const {
        loading,
        pageNumber,
        pageSize,
        total,
        dataSource,
        selectedRowKeys,
        setSelectedRowKeys,
        onReload,
        onSearch,
        onChange,
    } = useList({
        formRef: form1,
        queryList: getStoreBlacklist,
    });

    useEffect(() => {
        queryGoodsSourceList().then(list => setPurchaseChannelList(list));
    }, []);

    const showAddConfig = useCallback(() => {
        setAddStatus(true);
    }, []);

    const hideAddConfig = useCallback(() => {
        setAddStatus(false);
    }, []);

    const delShop = useCallback(() => {
        return deleteBlackStore({
            purchase_channel: form1.current?.getFieldsValue()?.purchase_channel,
            merchant_id: selectedRowKeys,
        }).then(res => {
            onReload();
        });
    }, [selectedRowKeys]);

    const saveShop = useCallback(async () => {
        const data = (await form2.current?.validateFields()) as ISaveBlackStoreReq;
        return saveBlackStore(data).then(res => {
            form1.current?.setFieldsValue({
                purchase_channel: data.purchase_channel,
            });
            onSearch();
            setAddStatus(false);
        });
    }, []);

    const onSelectedRowKeysChange = useCallback((selectedKeys: ReactText[]) => {
        setSelectedRowKeys(selectedKeys as string[]);
    }, []);

    const searchNode = useMemo(() => {
        return (
            <JsonForm ref={form1} fieldList={formFields1} initialValues={{ purchase_channel: '1' }}>
                <div>
                    <LoadingButton type="primary" className={formStyles.formBtn} onClick={onSearch}>
                        查询
                    </LoadingButton>
                    <LoadingButton
                        ghost
                        type="primary"
                        className={formStyles.formBtn}
                        onClick={delShop}
                        disabled={selectedRowKeys.length === 0}
                    >
                        删除
                    </LoadingButton>
                    <LoadingButton
                        ghost
                        type="primary"
                        className={formStyles.formBtn}
                        onClick={onReload}
                    >
                        刷新
                    </LoadingButton>
                </div>
            </JsonForm>
        );
    }, [selectedRowKeys]);

    const addNode = useMemo(() => {
        return (
            <div className={styles.add}>
                <JsonForm
                    ref={form2}
                    fieldList={formFields2}
                    initialValues={{ purchase_channel: '1' }}
                >
                    <div>
                        <LoadingButton
                            type="primary"
                            className={formStyles.formBtn}
                            onClick={saveShop}
                        >
                            保存
                        </LoadingButton>
                        <Button
                            ghost
                            type="primary"
                            className={formStyles.formBtn}
                            onClick={hideAddConfig}
                        >
                            取消
                        </Button>
                    </div>
                </JsonForm>
            </div>
        );
    }, []);

    const pagination = useMemo(() => {
        return {
            total: total,
            current: pageNumber,
            pageSize: pageSize,
            showSizeChanger: true,
            position: ['topRight', 'bottomRight'],
        } as any;
    }, [loading]);

    const columns = useMemo<ColumnsType<any>>(() => {
        return [
            {
                title: '采购渠道',
                align: 'center',
                width: 200,
                dataIndex: 'purchase_channel',
                render: (val: string) => getStatusDesc(purchaseChannelList, val),
            },
            {
                title: '店铺ID',
                align: 'center',
                width: 200,
                dataIndex: 'merchant_id',
            },
            {
                title: '拉黑原因',
                align: 'center',
                width: 200,
                dataIndex: 'black_store_reason',
            },
            {
                title: '拉黑时间',
                align: 'center',
                width: 200,
                dataIndex: 'created_time',
                render: (val: string) => utcToLocal(val),
            },
            {
                title: '操作人',
                align: 'center',
                width: 200,
                dataIndex: 'operator',
            },
        ];
    }, [purchaseChannelList]);

    const rowSelection = useMemo(() => {
        return {
            fixed: true,
            columnWidth: '50px',
            selectedRowKeys: selectedRowKeys,
            onChange: onSelectedRowKeysChange,
        };
    }, [selectedRowKeys]);

    return (
        <Container>
            {searchNode}
            <div>
                <Button type="link" onClick={showAddConfig} disabled={addStatus}>
                    <PlusCircleOutlined />
                    添加采购店铺黑名单
                </Button>
            </div>
            {addStatus ? addNode : null}
            <FitTable
                bordered
                rowKey="merchant_id"
                loading={loading}
                columns={columns}
                rowSelection={rowSelection}
                dataSource={dataSource}
                scroll={{ x: 'max-content' }}
                // columnsSettingRender={false}
                pagination={pagination}
                onChange={onChange}
                // toolBarRender={toolBarRender}
            />
        </Container>
    );
};

export default React.memo(ShopBlacklist);

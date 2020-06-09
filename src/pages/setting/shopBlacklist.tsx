import React, { useMemo, useRef, useCallback, useState, ReactText } from 'react';
import { Button } from 'antd';
import Container from '@/components/Container';
import { FormField, JsonFormRef } from 'react-components/lib/JsonForm';
import { JsonForm, LoadingButton, useList, FitTable } from 'react-components';
import { defaultOption } from '@/enums/LocalGoodsEnum';
import { queryGoodsSourceList } from '@/services/global';
import { getGoodsList } from '@/services/goods';
import { PlusCircleOutlined } from '@ant-design/icons';

import styles from './_shopBlacklist.less';
import formStyles from 'react-components/es/JsonForm/_form.less';
import { ColumnsType } from 'antd/lib/table';

const formFields1: FormField[] = [
    {
        type: 'select',
        name: 'a1',
        label: '采购渠道',
        syncDefaultOption: defaultOption,
        defaultValue: '',
        optionList: () => queryGoodsSourceList(),
    },
    {
        type: 'textarea',
        name: 'a2',
        label: '店铺ID',
        placeholder: '请输入',
        formatter: 'multipleToArray',
    },
];

const formFields2: FormField[] = [
    {
        type: 'select',
        name: 'a1',
        label: '采购渠道',
        // syncDefaultOption: defaultOption,
        defaultValue: '1',
        optionList: () => queryGoodsSourceList(),
        rules: [{ required: true }],
    },
    {
        type: 'textarea',
        name: 'a2',
        label: '店铺ID',
        placeholder: '请输入',
        formatter: 'multipleToArray',
        rules: [{ required: true, message: '不能为空' }],
    },
    {
        type: 'textarea',
        name: 'a3',
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
    const {
        loading,
        pageNumber,
        pageSize,
        total,
        dataSource,
        selectedRowKeys,
        queryRef,
        setSelectedRowKeys,
        onReload,
        onSearch,
        onChange,
    } = useList({
        formRef: form1,
        queryList: getGoodsList,
    });

    const showAddConfig = useCallback(() => {
        setAddStatus(true);
    }, []);

    const hideAddConfig = useCallback(() => {
        setAddStatus(false);
    }, []);

    const delShop = useCallback(() => {
        return Promise.resolve();
    }, []);

    const onSelectedRowKeysChange = useCallback((selectedKeys: ReactText[]) => {
        setSelectedRowKeys(selectedKeys as string[]);
    }, []);

    const searchNode = useMemo(() => {
        return (
            <JsonForm ref={form1} fieldList={formFields1}>
                <div>
                    <LoadingButton type="primary" className={formStyles.formBtn} onClick={onSearch}>
                        查询
                    </LoadingButton>
                    <LoadingButton
                        ghost
                        type="primary"
                        className={formStyles.formBtn}
                        onClick={delShop}
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
    }, []);

    const addNode = useMemo(() => {
        return (
            <div className={styles.add}>
                <JsonForm ref={form2} fieldList={formFields2}>
                    <div>
                        <LoadingButton
                            type="primary"
                            className={formStyles.formBtn}
                            onClick={onSearch}
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
                dataIndex: 'a1',
            },
            {
                title: '店铺ID',
                align: 'center',
                width: 200,
                dataIndex: 'a2',
            },
            {
                title: '拉黑原因',
                align: 'center',
                width: 200,
                dataIndex: 'a3',
            },
            {
                title: '拉黑时间',
                align: 'center',
                width: 200,
                dataIndex: 'a4',
            },
            {
                title: '操作人',
                align: 'center',
                width: 200,
                dataIndex: 'a5',
            },
        ];
    }, []);

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
                // rowKey="purchase_plan_id"
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

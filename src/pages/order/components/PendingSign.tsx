import React, { ReactText, useCallback, useMemo, useRef } from 'react';
import { FormField, JsonFormRef } from 'react-components/es/JsonForm';
import {
    defaultOptionItem,
    defaultOptionItem1,
    purchaseReserveOptionList,
} from '@/enums/OrderEnum';
import { queryShopList } from '@/services/order-manage';
import {
    FitTable,
    JsonForm,
    LoadingButton,
    PopConfirmLoadingButton,
    useList,
    useModal2,
} from 'react-components';
import { Button } from 'antd';
import formStyles from 'react-components/es/JsonForm/_form.less';
import { getGoodsList } from '@/services/goods';
import Export from '@/components/Export';
import CancelOrder from '@/pages/order/components/CancelOrder';
import { utcToLocal } from 'react-components/es/utils/date';

const allFormFields: FormField[] = [
    {
        type: 'select',
        key: 'product_shop',
        name: 'product_shop',
        label: '销售店铺名称',
        className: 'order-input',
        syncDefaultOption: defaultOptionItem1,
        optionList: () =>
            queryShopList().then(({ data = [] }) => {
                return data.map((item: any) => {
                    const { merchant_name } = item;
                    return {
                        name: merchant_name,
                        value: merchant_name,
                    };
                });
            }),
    },
    {
        type: 'select',
        key: 'reserve_status',
        name: 'reserve_status',
        label: '仓库库存预定状态',
        className: 'order-input',
        optionList: [defaultOptionItem, ...purchaseReserveOptionList],
    },
    {
        type: 'textarea',
        key: 'order_goods_id',
        name: 'order_goods_id',
        label: '子订单ID',
        className: 'order-input',
        placeholder: '请输入',
        formatter: 'multipleToArray',
    },
    {
        type: 'textarea',
        key: 'commodity_id',
        name: 'commodity_id',
        label: 'Commodity ID',
        className: 'order-input',
        placeholder: '请输入',
        formatter: 'multipleToArray',
    },
    {
        type: 'textarea',
        key: 'purchase_platform_order_id',
        name: 'purchase_platform_order_id',
        label: '供应商订单ID',
        className: 'order-input',
        placeholder: '请输入',
        formatter: 'multipleToArray',
    },
    {
        type: 'textarea',
        key: 'purchase_parent_order_sn',
        name: 'purchase_parent_order_sn',
        label: '采购父订单ID',
        className: 'order-input',
        placeholder: '请输入',
        formatter: 'multipleToArray',
    },
    {
        key: 'purchase_order_time',
        type: 'dateRanger',
        name: ['purchase_order_stime', 'purchase_order_etime'],
        label: '采购订单生成时间',
        className: 'order-date-picker',
        formatter: ['start_date', 'end_date'],
    },
    {
        type: 'textarea',
        key: 'purchase_waybill_no',
        name: 'purchase_waybill_no',
        label: '采购运单ID',
        className: 'order-input',
        placeholder: '请输入',
        formatter: 'multipleToArray',
    },
    {
        type: 'dateRanger',
        key: 'order_create_time',
        name: ['order_create_time_start', 'order_create_time_end'],
        label: '订单生成时间',
        className: 'order-date-picker',
        formatter: ['start_date', 'end_date'],
    },
    {
        type: 'dateRanger',
        key: 'pay_time',
        name: ['pay_time_start', 'pay_time_end'],
        label: '支付时间',
        className: 'order-date-picker',
        formatter: ['start_date', 'end_date'],
    },
    {
        type: 'dateRanger',
        key: 'purchase_time',
        name: ['purchase_time_start', 'purchase_time_end'],
        label: '采购签收时间(1)',
        className: 'order-date-picker',
        formatter: ['start_date', 'end_date'],
    },
];

const configFields = [
    'product_shop',
    'reserve_status',
    'order_goods_id',
    'commodity_id',
    'purchase_platform_order_id',
    'purchase_waybill_no',
    'order_create_time',
    'pay_time',
    'purchase_time',
];

// 后续写算法
const fieldsList = allFormFields.filter(({ key }) => {
    return configFields.indexOf(key as string) > -1;
});

declare interface PendingSignProps {
    updateCount: () => void;
}

const PendingSign = ({ updateCount }: PendingSignProps) => {
    const formRef = useRef<JsonFormRef>(null);
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
        formRef: formRef,
        queryList: getGoodsList, // 获取订单列表
    });
    const [exportModal, showExportModal, closeExportModal] = useModal2<boolean>();

    const columns = [
        {
            key: 'operation',
            title: '操作',
            dataIndex: 'operation',
            align: 'center',
            width: 150,
            fixed: 'left',
            render: (value: string, item) => {
                return (
                    <>
                        <PopConfirmLoadingButton
                            popConfirmProps={{
                                title: '确定要取消该采购订单吗？',
                                onConfirm: () => _cancelPurchaseOrder([item.orderGoodsId]),
                            }}
                            buttonProps={{
                                type: 'link',
                                children: '取消采购订单',
                            }}
                        />
                        <CancelOrder
                            key={'2'}
                            orderGoodsIds={[item.orderGoodsId]}
                            onReload={onSearch}
                            getAllTabCount={getAllTabCount}
                        >
                            <Button type="link">取消销售订单</Button>
                        </CancelOrder>
                    </>
                );
            },
        },
        {
            key: 'orderCreateTime',
            title: '订单生成时间',
            dataIndex: 'orderCreateTime',
            align: 'center',
            width: 150,
            render: (value: string) => utcToLocal(value, ''),
        },
        {
            key: 'orderCreateTime',
            title: '子订单ID',
            dataIndex: 'orderCreateTime',
            align: 'center',
            width: 150,
            render: (value: string) => utcToLocal(value, ''),
        },
        {
            key: 'orderCreateTime',
            title: 'Commodity ID',
            dataIndex: 'orderCreateTime',
            align: 'center',
            width: 150,
            render: (value: string) => utcToLocal(value, ''),
        },
        {
            key: 'orderCreateTime',
            title: '商品名称',
            dataIndex: 'orderCreateTime',
            align: 'center',
            width: 150,
            render: (value: string) => utcToLocal(value, ''),
        },
        {
            key: 'orderCreateTime',
            title: 'SKU图片',
            dataIndex: 'orderCreateTime',
            align: 'center',
            width: 150,
            render: (value: string) => utcToLocal(value, ''),
        },
        {
            key: 'orderCreateTime',
            title: '商品规格',
            dataIndex: 'orderCreateTime',
            align: 'center',
            width: 150,
            render: (value: string) => utcToLocal(value, ''),
        },
        {
            key: 'orderCreateTime',
            title: '供应商订单ID',
            dataIndex: 'orderCreateTime',
            align: 'center',
            width: 150,
            render: (value: string) => utcToLocal(value, ''),
        },
        {
            key: 'orderCreateTime',
            title: '支付时间',
            dataIndex: 'orderCreateTime',
            align: 'center',
            width: 150,
            render: (value: string) => utcToLocal(value, ''),
        },
        {
            key: 'orderCreateTime',
            title: '销售店铺名称',
            dataIndex: 'orderCreateTime',
            align: 'center',
            width: 150,
            render: (value: string) => utcToLocal(value, ''),
        },
        {
            key: 'orderCreateTime',
            title: '采购运单ID',
            dataIndex: 'orderCreateTime',
            align: 'center',
            width: 150,
            render: (value: string) => utcToLocal(value, ''),
        },
        {
            key: 'orderCreateTime',
            title: '采购签收时间',
            dataIndex: 'orderCreateTime',
            align: 'center',
            width: 150,
            render: (value: string) => utcToLocal(value, ''),
        },
        {
            key: 'orderCreateTime',
            title: '采购计划状态',
            dataIndex: 'orderCreateTime',
            align: 'center',
            width: 150,
            render: (value: string) => utcToLocal(value, ''),
        },
        {
            key: 'orderCreateTime',
            title: '仓库库存预定状态',
            dataIndex: 'orderCreateTime',
            align: 'center',
            width: 150,
            render: (value: string) => utcToLocal(value, ''),
        },
    ];

    const formComponent = useMemo(() => {
        return (
            <JsonForm ref={formRef} fieldList={fieldsList} labelClassName="order-label">
                <div>
                    <LoadingButton type="primary" className={formStyles.formBtn} onClick={onSearch}>
                        查询
                    </LoadingButton>
                    <LoadingButton className={formStyles.formBtn} onClick={onReload}>
                        刷新
                    </LoadingButton>
                    <Button
                        disabled={total <= 0}
                        className={formStyles.formBtn}
                        onClick={() => showExportModal(true)}
                    >
                        导出
                    </Button>
                </div>
            </JsonForm>
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

    const toolBarRender = useCallback(() => {
        const disabled = selectedRowKeys.length === 0;
        return [
            <LoadingButton
                key="purchase_order"
                type="primary"
                className={formStyles.formBtn}
                disabled={disabled}
            >
                取消采购订单
            </LoadingButton>,
            <CancelOrder
                key="2"
                orderGoodsIds={selectedRowKeys}
                onReload={onSearch}
                getAllTabCount={updateCount}
            >
                <Button
                    key="channel_order"
                    type="primary"
                    className={formStyles.formBtn}
                    disabled={disabled}
                >
                    取消销售订单
                </Button>
            </CancelOrder>,
        ];
    }, [selectedRowKeys]);

    const rowSelection = useMemo(() => {
        return {
            fixed: true,
            columnWidth: '50px',
            selectedRowKeys: selectedRowKeys,
            onChange: (selectedKeys: ReactText[]) => {
                setSelectedRowKeys(selectedKeys as string[]);
            },
        };
    }, [selectedRowKeys]);

    return useMemo(() => {
        return (
            <div>
                {formComponent}
                <FitTable
                    bordered={true}
                    rowKey="purchase_plan_id"
                    loading={loading}
                    columns={columns}
                    // rowSelection={rowSelection}
                    dataSource={dataSource}
                    scroll={{ x: 'max-content' }}
                    columnsSettingRender={true}
                    pagination={pagination}
                    onChange={onChange}
                    toolBarRender={toolBarRender}
                    rowSelection={rowSelection}
                />
                <Export
                    columns={columns as any}
                    visible={exportModal}
                    onOKey={() => {}}
                    onCancel={closeExportModal}
                />
            </div>
        );
    }, []);
};

export { PendingSign };

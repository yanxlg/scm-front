import { FormField } from 'react-components/es/JsonForm';
import {
    childrenOrderCancelOptionList,
    defaultOptionItem,
    defaultOptionItem1,
    orderShippingOptionList,
    orderStatusOptionList,
    orderStatusOptionList1,
    purchaseOrderOptionList,
    purchasePayOptionList,
    purchasePayOptionList1,
    purchasePlanCancelOptionList,
    purchaseReserveOptionList,
} from '@/enums/OrderEnum';
import { getPurchaseUidList } from '@/services/order-manage';
import { CombineRowItem } from '@/interface/IOrder';
import React from 'react';
import { queryGoodsSourceList, getCategoryList } from '@/services/global';
import { ConnectState } from '@/models/connect';

const allFormFields: FormField[] = [
    {
        type: 'select',
        key: 'product_shop1',
        name: 'product_shop',
        label: '销售店铺名称',
        className: 'order-input',
        initialValue: '',
        syncDefaultOption: defaultOptionItem1,
        formatter: 'plainToArr',
        optionList: {
            type: 'select',
            selector: (state: ConnectState) => {
                return state?.permission?.merchantList;
            },
        },
    },
    {
        type: 'select',
        key: 'reserve_status',
        name: 'reserve_status',
        label: '仓库库存预定状态',
        className: 'order-input',
        initialValue: 100,
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
        label: '供应商父订单ID',
        className: 'order-input',
        placeholder: '请输入',
        formatter: 'multipleToArray',
    },
    {
        key: 'purchase_order_time',
        type: 'dateRanger',
        name: ['purchase_order_stime', 'purchase_order_etime'],
        label: '采购计划生成时间',
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
        name: ['order_time_start', 'order_time_end'],
        label: '订单生成时间',
        className: 'order-date-picker',
        formatter: ['start_date', 'end_date'],
    },
    {
        type: 'dateRanger',
        key: 'order_create_time1',
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
    /*    {
        type: 'dateRanger',
        key: 'purchase_time',
        name: ['purchase_time_start', 'purchase_time_end'],
        label: '采购签收时间',
        className: 'order-date-picker',
        formatter: ['start_date', 'end_date'],
    },*/
    {
        type: 'select',
        key: 'order_goods_status',
        name: 'order_goods_status',
        label: '订单状态',
        initialValue: 100,
        className: 'order-input',
        optionList: [defaultOptionItem, ...orderStatusOptionList],
    },
    {
        type: 'select',
        key: 'order_goods_status1',
        name: 'order_goods_status',
        label: '订单状态',
        initialValue: '',
        className: 'order-input',
        optionList: [defaultOptionItem1, ...orderStatusOptionList1],
    },
    {
        type: 'select',
        key: 'purchase_order_status',
        initialValue: 100,
        name: 'purchase_order_status',
        label: '采购计划状态',
        className: 'order-input',
        optionList: [defaultOptionItem, ...purchaseOrderOptionList],
    },
    {
        type: 'select',
        initialValue: 100,
        key: 'purchase_order_pay_status',
        name: 'purchase_order_pay_status',
        label: '采购支付状态',
        className: 'order-input',
        optionList: [defaultOptionItem, ...purchasePayOptionList],
    },
    {
        type: 'select',
        initialValue: '',
        key: 'purchase_order_pay_status1',
        name: 'purchase_order_pay_status',
        label: '采购支付状态',
        className: 'order-input',
        optionList: [defaultOptionItem1, ...purchasePayOptionList1],
    },
    {
        type: 'select',
        initialValue: 100,
        key: 'order_goods_shipping_status',
        name: 'order_goods_shipping_status',
        label: '配送状态',
        className: 'order-input',
        optionList: [defaultOptionItem, ...orderShippingOptionList],
    },
    {
        type: 'select',
        initialValue: '',
        key: 'channel_source',
        name: 'channel_source',
        label: '销售渠道',
        className: 'order-input',
        syncDefaultOption: defaultOptionItem1,
        formatter: 'plainToArr',
        optionList: {
            type: 'select',
            selector: (state: ConnectState) => {
                return state?.permission?.channelMerchantTree;
            },
        },
        // optionList: () => getPlatformAndStore(),
        onChange: (_, form) => {
            form.resetFields(['product_shop']);
        },
    },
    {
        type: 'select',
        initialValue: '',
        key: 'product_shop',
        name: 'product_shop',
        label: '销售店铺名称',
        className: 'order-input',
        syncDefaultOption: defaultOptionItem1,
        optionListDependence: {
            name: 'channel_source',
            key: 'children',
        },
        formatter: 'plainToArr',
        optionList: {
            type: 'select',
            selector: (state: ConnectState) => {
                return state?.permission?.channelMerchantTree;
            },
        },
        // optionList: () => getPlatformAndStore(),
    },
    {
        type: 'select',
        initialValue: 100,
        key: 'order_goods_cancel_type',
        name: 'order_goods_cancel_type',
        label: '子订单取消类型',
        className: 'order-input',
        optionList: [defaultOptionItem, ...childrenOrderCancelOptionList],
    },
    {
        type: 'select',
        initialValue: 100,
        key: 'purchase_plan_cancel_type',
        name: 'purchase_plan_cancel_type',
        label: '采购单取消类型',
        className: 'order-input',
        optionList: [defaultOptionItem, ...purchasePlanCancelOptionList],
    },
    {
        type: 'select@2',
        key: 'scm_error_code',
        name: 'scm_error_code',
        label: '拍单失败原因',
        labelClassName: 'order-label-next',
        options: {
            selector: (state: ConnectState) => state.options.platformErrorList,
        },
        childrenProps: {
            mode: 'multiple',
            maxTagCount: 2,
            placeholder: '请选择失败原因',
            className: 'order-input',
        },
    },
    {
        type: 'select',
        label: '一级类目',
        key: 'first_category',
        name: 'first_category',
        className: 'order-input',
        initialValue: '',
        syncDefaultOption: defaultOptionItem1,
        optionList: () => getCategoryList(),
        onChange: (name, form) => {
            form.resetFields(['second_category']);
            form.resetFields(['third_category']);
        },
    },
    {
        type: 'select',
        label: '二级类目',
        key: 'second_category',
        name: 'second_category',
        className: 'order-input',
        initialValue: '',
        optionListDependence: {
            name: 'first_category',
            key: 'children',
        },
        syncDefaultOption: defaultOptionItem1,
        optionList: () => getCategoryList(),
        onChange: (name, form) => {
            form.resetFields(['third_category']);
        },
    },
    {
        type: 'select',
        label: '三级类目',
        key: 'third_category',
        name: 'third_category',
        className: 'order-input',
        initialValue: '',
        optionListDependence: {
            name: ['first_category', 'second_category'],
            key: 'children',
        },
        syncDefaultOption: defaultOptionItem1,
        optionList: () => getCategoryList(),
    },
    {
        type: 'textarea',
        key: 'purchase_plan_id',
        name: 'purchase_plan_id',
        label: '采购计划ID',
        className: 'order-input',
        placeholder: '请输入',
        formatter: 'multipleToArray',
    },
    {
        type: 'textarea',
        key: 'channel_order_goods_sn',
        name: 'channel_order_goods_sn',
        label: '销售订单ID',
        className: 'order-input',
        placeholder: '请输入',
        formatter: 'multipleToArray',
    },
    {
        type: 'textarea',
        key: 'order_id',
        name: 'order_id',
        label: '父订单ID',
        className: 'order-input',
        placeholder: '请输入',
        formatter: 'multipleToArray',
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
        type: 'textarea',
        key: 'last_waybill_no',
        name: 'last_waybill_no',
        label: '销售尾程运单ID',
        className: 'order-input',
        placeholder: '请输入',
        formatter: 'multipleToArray',
    },
    {
        type: 'textarea',
        key: 'product_id',
        name: 'product_id',
        label: 'Product ID',
        className: 'order-input',
        placeholder: '请输入',
        formatter: 'multipleToArray',
    },
    {
        type: 'textarea',
        key: 'sku_id',
        name: 'sku_id',
        label: '中台SKU ID',
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
        type: 'dateRanger',
        key: 'confirm_time',
        name: ['confirm_time_start', 'confirm_time_end'],
        label: '销售订单确认时间',
        className: 'order-date-picker',
        formatter: ['start_date', 'end_date'],
    },
    {
        type: 'dateRanger',
        key: 'cancel_time',
        name: ['cancel_time_start', 'cancel_time_end'],
        label: '销售订单取消时间',
        className: 'order-date-picker',
        formatter: ['start_date', 'end_date'],
    },
    {
        type: 'dateRanger',
        key: 'delivery_time',
        name: ['delivery_time_start', 'delivery_time_end'],
        label: '销售订单出库时间',
        className: 'order-date-picker',
        formatter: ['start_date', 'end_date'],
    },
    {
        type: 'dateRanger',
        key: 'collect_time',
        name: ['collect_time_start', 'collect_time_end'],
        label: '销售订单揽收时间',
        className: 'order-date-picker',
        formatter: ['start_date', 'end_date'],
    },
    {
        type: 'dateRanger',
        key: 'receive_time',
        name: ['receive_time_start', 'receive_time_end'],
        label: '妥投时间',
        className: 'order-date-picker',
        formatter: ['start_date', 'end_date'],
    },
    {
        type: 'dateRanger',
        key: 'pay_time',
        name: ['pay_time_start', 'pay_time_end'],
        label: '采购支付时间',
        className: 'order-date-picker',
        formatter: ['start_date', 'end_date'],
    },
    {
        type: 'dateRanger',
        key: 'storage_time',
        name: ['storage_time_start', 'storage_time_end'],
        label: '采购入库时间',
        className: 'order-date-picker',
        formatter: ['start_date', 'end_date'],
    },
    {
        type: 'select',
        key: 'platform_uid',
        name: 'platform_uid',
        label: '下单账号',
        className: 'order-input',
        initialValue: '',
        syncDefaultOption: defaultOptionItem1,
        optionList: () => getPurchaseUidList(),
    },
    {
        type: 'select',
        key: 'product_platform',
        initialValue: '',
        name: 'product_platform',
        label: '商品渠道',
        className: 'order-input',
        syncDefaultOption: defaultOptionItem1,
        optionList: () => queryGoodsSourceList(),
    },
    {
        type: 'textarea',
        key: 'invented_sign_delivery_no',
        name: 'invented_sign_delivery_no',
        label: '虚拟运单ID',
        className: 'order-input',
        formatter: 'multipleToArray',
    },
];

const fieldMap = new Map();
allFormFields.forEach(item => {
    fieldMap.set(item.key, item);
});

export const filterFieldsList = (config: string[]) => {
    return config.map(key => fieldMap.get(key));
};

export const combineRows = <T extends CombineRowItem>(record: T, originNode: React.ReactNode) => {
    return {
        children: originNode,
        props: {
            rowSpan: record.__rowspan || 0,
        },
    };
};

export const combineRowsT = <T extends CombineRowItem>(originNode: React.ReactNode, record: T) => {
    return {
        children: originNode,
        props: {
            rowSpan: record.__rowspan || 0,
        },
    };
};

import { FormField } from 'react-components/es/JsonForm';
import {
    defaultOptionItem,
    defaultOptionItem1,
    purchaseReserveOptionList,
} from '@/enums/OrderEnum';
import { queryShopList } from '@/services/order-manage';
import { CombineRowItem } from '@/interface/IOrder';
import React from 'react';

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
        label: '供应商父订单ID',
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
        key: 'collect_time',
        name: ['collect_time_start', 'collect_time_end'],
        label: '采购签收时间',
        className: 'order-date-picker',
        formatter: ['start_date', 'end_date'],
    },
];

export const filterFieldsList = (config: string[]) => {
    return allFormFields.filter(({ key }) => {
        return config.indexOf(key as string) > -1;
    });
};

export const combineRows = <T extends CombineRowItem>(record: T, originNode: React.ReactNode) => {
    return {
        children: originNode,
        props: {
            rowSpan: record.__rowspan || 1,
        },
    };
};

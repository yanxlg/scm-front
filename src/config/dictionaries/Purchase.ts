import { transOptionList } from '@/utils/transform';
import { FormField } from 'react-components/es/JsonForm';

export enum PurchaseReturnType {
    PendingOut = '1',
    PendingReceived = '2',
    Over = '5,6',
}

export const PurchaseReturnMap = {
    '1': '待出库',
    '2': '出库成功',
    '3': '出库失败',
    '4': '取消中',
    '5': '已完结-取消',
    '6': '已完结-签收',
    '7': '待出库',
};

export type PurchaseReturnCode = keyof typeof PurchaseReturnMap;

export const PurchaseMap = {
    '0': '全部',
    '1': '待发货',
    '2': '待签收',
    '3': '等待入库',
    '4': '部分入库',
    '5': '已完结',
    '6': '采购退款',
    '7': '已取消',
    '8': '下单失败',
};

export type PurchaseCode = keyof typeof PurchaseMap;

//////////////////////////////////////////////
export enum PurchaseCreateType {
    Auto = '1',
    Manually = '2',
}
export const PurchaseCreateTypeMap = {
    '1': '系统创建',
    '2': '手动创建',
};

export type PurchaseCreateTypeCode = keyof typeof PurchaseCreateTypeMap;
export const PurchaseCreateTypeList = transOptionList(PurchaseCreateTypeMap);

export const IsFalseShippingMap = {
    '1': '是',
    '2': '否',
};

export type IsFalseShippingCode = keyof typeof IsFalseShippingMap;
export const IsFalseShippingList = transOptionList(IsFalseShippingMap);

export const FalseShippingReviewMap = {
    '1': '待审核',
    '2': '审核通过',
    '3': '审核驳回',
};

export type FalseShippingReviewCode = keyof typeof FalseShippingReviewMap;
export const FalseShippingReviewList = transOptionList(FalseShippingReviewMap);

export const falseShippingFieldList: FormField[] = [
    {
        label: '是否虚假发货',
        type: 'select',
        name: 'is_real_delivery',
        initialValue: '',
        optionList: [
            {
                name: '全部',
                value: '',
            },
            ...IsFalseShippingList,
        ],
    },
    {
        label: '虚假发货审核状态',
        type: 'select',
        name: 'audit_status',
        initialValue: '',
        optionList: [
            {
                name: '全部',
                value: '',
            },
            ...FalseShippingReviewList,
        ],
    },
];

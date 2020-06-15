import { transOptionList } from '@/utils/transform';

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

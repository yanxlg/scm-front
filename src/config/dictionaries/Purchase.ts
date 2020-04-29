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
};

export type PurchaseReturnCode = keyof typeof PurchaseReturnMap;

export const PurchaseMap = {
    '0': '全部',
    '1': '代发货',
    '2': '代签收',
    '3': '等待入库',
    '4': '部分入库',
    '5': '已完结',
    '6': '采购退款',
};

export type PurchaseCode = keyof typeof PurchaseMap;

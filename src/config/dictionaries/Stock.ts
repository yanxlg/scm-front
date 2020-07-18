export function transStatusList(statusMap: { [key: number]: string; [key: string]: string }) {
    let statusList = [];
    for (let key in statusMap) {
        if (statusMap.hasOwnProperty(key)) {
            statusList.push({
                value: key,
                name: statusMap[key],
            });
        }
    }
    return statusList;
}

export const StockType = {
    In: 2,
    Out: 1,
};

export const OutStockState = {
    5: '出库中',
    6: '出库失败',
    7: '取消出库',
    8: '已出库',
    9: '尾程已揽收',
    10: '已妥投',
};

export const OutStockStateList = transStatusList(OutStockState);

export type OutStockStateCode = keyof typeof OutStockState;

export const InStockState = {
    1: '未入库',
    5: '仓库签收',
    10: '已入库',
    40: '已取消',
};
export type InStockStateCode = keyof typeof InStockState;
export const InStockStateList = transStatusList(InStockState);

export const WarehouseMap = {
    1: '安骏',
    2: '捷网',
};

export type WarehouseMapCode = keyof typeof WarehouseMap;

export const WarehouseList = transStatusList(WarehouseMap);

export const OutStockFailureMap = {
    401: '飞鱼库存不足',
    402: '仓库无库存出库失败',
    403: '仓内丢货',
    404: '尾程退件换单',
    405: '无法发货',
    406: '出库单异常',
};

export type OutStockFailureCode = keyof typeof OutStockFailureMap;

export const OutStockFailureList = transStatusList(OutStockFailureMap);

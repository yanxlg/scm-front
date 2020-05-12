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
    1: '未配送',
    2: '头程已配送',
    3: '已妥投未入库',
    4: '已入库',
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
    10: '已入库',
};
export type InStockStateCode = keyof typeof InStockState;
export const InStockStateList = transStatusList(InStockState);

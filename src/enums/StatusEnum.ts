import { transStatusList } from '@/utils/transform';

//======================= 商品状态 ======================//
export const GoodsStatusMap: { [key: number]: string } = {
    0: '全部',
    1: '待上架',
    2: '已上架',
    3: '已下架',
};

export const GoodsStatusList = transStatusList(GoodsStatusMap);

// 返回哪些状态可以执行上架操作
export const checkUpperShelf = function(status: number) {
    return status === 1; // 待上架
};

//返回哪些状态可执行下架操作
export const checkLowerShelf = function(status: number) {
    return status === 2; // 已上架
};

//======================= 任务范围 ======================//
export const TaskRangeMap: { [key: number]: string } = {
    1: '指定URL',
    2: '全站',
    3: '指定店铺',
    4: '全部已上架',
    5: '有销量已上架',
};
export const TaskRangeList = transStatusList(TaskRangeMap);

//======================= 任务状态 ======================//

export const TaskStatusMap: { [key: string]: string } = {
    0: '未执行',
    1: '执行中',
    2: '已执行',
    3: '执行失败',
    4: '已取消',
    5: '已完成',
    6: '终止',
};

export const TaskStatusList = transStatusList(TaskStatusMap);

export enum TaskStatus {
    UnExecuted, // 未执行
    Executing, // 执行中
    Executed, // 已执行
    Failed, // 执行失败
}

//======================= Hot 任务范围 ======================//
export enum HotTaskRange {
    fullStack,
    store,
}

//======================= 任务执行类型 ======================//
export enum TaskExecuteType {
    once = 1, // 单次任务
    interval, // 定时任务
}

//======================= 定时任务类型 ======================//
export enum TaskIntervalConfigType {
    day,
    second,
}

//======================= 定时更新任务商品范围 ======================//
export enum TimerUpdateTaskRangeType {
    AllOnShelves = 2,
    HasSales,
}

//======================= Hot 任务筛选类型 ======================//
export enum HotTaskFilterType {
    ByCategory,
    ByKeywords,
}

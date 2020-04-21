import { transStatusList } from '@/utils/transform';

//======================= 任务范围 ======================//
export const TaskRangeMap = {
    1: '指定URL',
    2: '全站',
    3: '指定店铺',
    4: '全部已上架',
    5: '有销量在架商品',
    6: '采购',
    7: '商品上架',
    8: '商品下架',
    9: '采集上架',
    21: '全站',
    23: '全站',
    22: '指定店铺',
    24: '指定店铺',
    31: '商品更新',
};

export const isGoodsUpdateType = (code: TaskRangeCode) => {
    return Number(code) === 31;
};

export type TaskRangeCode = keyof typeof TaskRangeMap;

export enum TaskRangeEnum {
    URL = 1,
    FullStack,
    Store,
    AllOnShelf,
    SalesOnShelves,
    GatherGrounding = 9,
    FullStack1 = 21,
    FullStack2 = 23,
    Store1 = 22,
    Store2 = 24,
}

export const isGatherTask = (sub_cat_id: number) => {
    return (
        sub_cat_id === TaskRangeEnum.FullStack ||
        sub_cat_id === TaskRangeEnum.Store ||
        sub_cat_id === TaskRangeEnum.FullStack1 ||
        sub_cat_id === TaskRangeEnum.FullStack2 ||
        sub_cat_id === TaskRangeEnum.Store1 ||
        sub_cat_id === TaskRangeEnum.Store2 ||
        sub_cat_id === TaskRangeEnum.GatherGrounding
    );
};

export const isUrlTask = (sub_cat_id: number) => {
    return sub_cat_id === TaskRangeEnum.URL;
};

export const isGoodsUpdateTask = (sub_cat_id: number) => {
    return sub_cat_id === TaskRangeEnum.AllOnShelf || sub_cat_id === TaskRangeEnum.SalesOnShelves;
};

//======================= 任务状态 ======================//

export const TaskStatusMap = {
    1: '待执行',
    2: '执行中',
    3: '执行失败',
    4: '已取消',
    5: '执行成功',
    6: '已终止',
};

export type TaskStatusCode = keyof typeof TaskStatusMap;

export const TaskStatusList = transStatusList(TaskStatusMap);

export enum TaskStatusEnum {
    ToBeExecuted = 1, // 待执行
    Executing, // 执行中
    Failed, // 执行失败
    Canceled,
    Success,
    Terminated,
}

//======================= 任务类型 ======================//
export const TaskTypeMap = {
    0: '采集任务',
    1: '上架任务',
    2: '更新任务',
    3: '采购任务',
    4: '采集上架任务',
};

export type TaskTypeCode = keyof typeof TaskTypeMap;

export const TaskTypeList = transStatusList(TaskTypeMap);

export enum TaskTypeEnum {
    Gather = 0,
    Grounding = 1,
    Update = 2,
    Purchase = 3,
    GatherGrounding,
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
export enum PUTaskRangeType {
    AllOnShelves = 2,
    HasSalesOn,
    NoSalesOn,
    HasSalesOff,
    NoSalesOff,
    HasSales,
}

export const PUTaskRangeTypeMap = {
    1: '全部商品',
    2: '在架商品',
    3: '有销量的已上架商品',
    4: '无销量在架商品',
    5: '有销量下架商品',
    6: '未在架商品',
    7: '有销量商品',
};

export type PUTaskRangeTypeCode = keyof typeof PUTaskRangeTypeMap;

export enum UpdateItemType {
    All = 1,
    IgnoreImage,
}

//======================= Hot 任务筛选类型 ======================//
export enum HotTaskFilterType {
    ByCategory,
    ByKeywords,
}

//======================= AutoPurchase 任务类型 ======================//
export enum AutoPurchaseTaskType {
    OnlyOnce = 1,
    EveryDay,
}

//任务创建状态
export const TaskCreateStatusMap = {
    0: '未创建',
    1: '已创建',
};

export type TaskCreateStatusCode = keyof typeof TaskCreateStatusMap;

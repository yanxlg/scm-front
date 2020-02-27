import { Select } from 'antd';
import React from 'react';
import { transStatusList } from '@/utils/transform';

export enum TaskRange {
    fullStack,
    store,
}

export enum TaskType {
    once = 1,
    interval,
}

export enum TaskIntervalType {
    day,
    second,
}

export enum TaskStatus {
    UnExecuted,
    Executing,
    Executed,
    Failed,
    Canceled,
}

export enum TaskGoodsArea {
    AllOnShelves = 2,
    HasSales,
}

export const TaskRangeMap: { [key: number]: string } = {
    1: '指定URL',
    2: '全站',
    3: '指定店铺',
    4: '全部已上架',
    5: '有销量已上架',
};

export const TaskRangeList = transStatusList(TaskRangeMap);

export const TaskStatusMap: { [key: string]: string } = {
    '0': '未执行',
    '1': '执行中',
    '2': '已执行',
    '3': '执行失败',
    '4': '已取消',
};

export const TaskStatusList = transStatusList(TaskStatusMap);

export const imgDomain: string = '//vovaimguploadtest-img-t.vova.com.hk/';

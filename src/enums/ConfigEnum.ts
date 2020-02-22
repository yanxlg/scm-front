import { Select } from 'antd';
import React from 'react';

export enum TaskRange {
    fullStack,
    store,
}

export enum TaskType {
    once=1,
    interval
}


export enum TaskIntervalType{
    day,
    second
}


export enum TaskStatus{
    UnExecuted,
    Executing,
    Executed,
    Failed
}


export enum TaskGoodsArea {
    All,
    AllOnShelves,
    HasSales
}


export const TaskRangeList:{[key:number]:string}={
    1:"指定URL",
    2:"全站",
    3:"指定店铺"
};

export const TaskStatusList:{[key:number]:string}={
    0:"未执行",
    1:"执行中",
    2:"已执行",
    3:"执行失败"
};

export const imgDomain: string = '//vovaimguploadtest-img-t.vova.com.hk/'; 

import request, { errorHandlerFactory } from '@/utils/request';
import { ApiPathEnum } from '@/enums/ApiPathEnum';
import { IFormData } from '@/pages/task/components/TaskSearch';
import { isNull } from '@/utils/validate';
import { AutoPurchaseTaskType, TaskExecuteType } from '@/enums/StatusEnum';
import { transStartDate } from '@/utils/date';

declare interface ITaskListSearch extends IFormData {
    page: number;
    page_number: number;
}

export declare interface IPddHotTaskParams {
    range?: number;
    category_level_one?: string;
    category_level_two?: string;
    sort_type?: string;
    keywords?: string;
    task_type?: TaskExecuteType;
    sales_volume_min?: number;
    sales_volume_max?: number;
    price_min?: number;
    price_max?: number;
    grab_page_count?: number;
    grab_count_max?: number;
    task_start_time?: number;
    task_end_time?: number;
    task_interval_seconds?: number;
    task_name?: string;
    is_upper_shelf: boolean;
    success?: number;
    fail?: number;
    urls?: string;
    status?: string;
}

declare interface IPddURLTaskParams {
    urls: string;
    task_name: string;
    task_type: TaskExecuteType;
    task_start_time?: number;
    task_end_time?: number;
    task_interval_seconds?: number;
    is_upper_shelf: boolean;
}

export async function getTaskList(params: ITaskListSearch) {
    return request.get(ApiPathEnum.QueryTaskList, {
        params: params,
    });
}

export async function addPddHotTask({ grab_count_max, ...params }: IPddHotTaskParams) {
    return request.post(ApiPathEnum.AddPDDHotTask, {
        data: {
            ...params,
            grab_count_max: isNull(grab_count_max) ? 10000 : grab_count_max,
            version: '1.0',
            platform: 'PDD',
        },
        errorHandler: errorHandlerFactory(true),
    });
}

export async function addPddURLTask(params: IPddURLTaskParams) {
    return request.post(ApiPathEnum.AddPDDURLTask, {
        data: {
            ...params,
            version: '1.0',
            platform: 'PDD',
        },
        errorHandler: errorHandlerFactory(true),
    });
}

declare interface IPDDTimerUpdateTaskParams {
    task_name: string;
}

export async function addPDDTimerUpdateTask(params: IPDDTimerUpdateTaskParams) {
    return request.post(ApiPathEnum.ADDTimerUpdate, {
        data: {
            ...params,
            version: '1.0',
            platform: 'PDD',
        },
        errorHandler: errorHandlerFactory(true),
    });
}

export async function activeTasks(task_ids: string) {
    return request.post(ApiPathEnum.ActiveTask, {
        data: {
            task_ids,
            type: 0,
        },
    });
}

export async function reActiveTasks(task_ids: string) {
    return request.post(ApiPathEnum.ActiveTask, {
        data: {
            task_ids,
            type: 1,
        },
    });
}

export async function abortTasks(task_ids: string) {
    return request.post(ApiPathEnum.AbortTask, {
        data: {
            task_ids,
        },
    });
}

export async function deleteTasks(task_ids: string) {
    return request.put(ApiPathEnum.DeleteTask, {
        data: {
            task_ids,
        },
    });
}

export async function queryTaskDetail(task_id: number) {
    return request.get(ApiPathEnum.QueryTaskDetail, {
        params: {
            task_id,
        },
    });
}

export async function queryCategory() {
    return request.get(ApiPathEnum.QueryPDDCategory);
}

export async function querySortCondition() {
    return request.get(ApiPathEnum.QueryPDDSortCondition);
}

export async function queryTaskLog(task_id: number) {
    return request.get(ApiPathEnum.QueryTaskLog, {
        params: {
            task_id,
        },
    });
}

declare interface IAutoPurchaseTaskData {
    task_name: string;
    type: AutoPurchaseTaskType;
    task_start_time?: number;
    task_end_time?: number;
    purchase_times: string[];
}

export async function addAutoPurchaseTask(data: IAutoPurchaseTaskData) {
    return request.post(ApiPathEnum.ADDAutoPurchaseTask, {
        data: {
            ...data,
            version: '1.0',
            platform: 'PDD',
        },
    });
}

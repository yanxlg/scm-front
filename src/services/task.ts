import request, { errorHandlerFactory } from '@/utils/request';
import { TaskExecuteType, TaskStatusCode } from '@/enums/StatusEnum';
import {
    IHotTaskBody,
    ITaskCreatedResponse,
    ITaskListQuery,
    ITaskListResponse,
    IURLTaskBody,
    ITaskDetailResponse,
    IPDDCategoryResponse,
    IPDDSortQueryType,
    IPDDSortResponse,
    ITaskLogResponse,
    IPUTaskBody,
    IAPTaskBody,
    ITaskProgressQuery,
    ITaskProgressResponse,
    ISubTaskProgressQuery,
    ISubTaskProgressResponse,
} from '@/interface/ITask';
import { IResponse } from '@/interface/IGlobal';
import { TaskApiPath } from '@/enums/TaskApiPath';

export declare interface IPddHotTaskParams {
    range?: number;
    category_level_one?: string;
    category_level_two?: string;
    category_level_three?: string;
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
    status?: TaskStatusCode;
}

export async function getTaskList(params: ITaskListQuery) {
    return request.get<IResponse<ITaskListResponse>>(TaskApiPath.QueryTaskList, {
        params: params,
    });
}

export async function addPddHotTask(params: IHotTaskBody) {
    return request.post<IResponse<ITaskCreatedResponse>>(TaskApiPath.AddPDDHotTask, {
        data: {
            ...params,
            version: '1.0',
            platform: 'PDD',
        },
        errorHandler: errorHandlerFactory(true),
    });
}

export async function addPddURLTask(params: IURLTaskBody) {
    return request.post<IResponse<ITaskCreatedResponse>>(TaskApiPath.AddPDDURLTask, {
        data: {
            ...params,
            version: '1.0',
            platform: 'PDD',
        },
        errorHandler: errorHandlerFactory(true),
    });
}

export async function addPDDTimerUpdateTask(params: IPUTaskBody) {
    return request.post(TaskApiPath.AddPUTask, {
        data: {
            ...params,
            version: '1.0',
            platform: 'PDD',
        },
        errorHandler: errorHandlerFactory(true),
    });
}

export async function activeTasks(task_ids: string) {
    return request.post(TaskApiPath.ActiveTask, {
        data: {
            task_ids,
            type: 0,
        },
    });
}

export async function reActiveTasks(task_ids: string) {
    return request.post(TaskApiPath.ActiveTask, {
        data: {
            task_ids,
            type: 1,
        },
    });
}

export async function abortTasks(task_ids: string) {
    return request.post(TaskApiPath.AbortTask, {
        data: {
            task_ids,
        },
    });
}

export async function deleteTasks(task_ids: string) {
    return request.put(TaskApiPath.DeleteTask, {
        data: {
            task_ids,
        },
    });
}

export async function queryTaskDetail(task_id: number) {
    return request.get<IResponse<ITaskDetailResponse>>(TaskApiPath.QueryTaskDetail, {
        params: {
            task_id,
        },
    });
}

export async function queryPurchaseIds(task_id: number) {
    return request.post(TaskApiPath.QueryPurchaseIds, {
        data: {
            task_id,
        },
    });
}

export async function queryCategory() {
    return request.get<IResponse<IPDDCategoryResponse>>(TaskApiPath.QueryPDDCategory);
}

export async function querySortCondition(type: IPDDSortQueryType) {
    return request.get<IResponse<IPDDSortResponse>>(TaskApiPath.QueryPDDSortList, {
        params: {
            type: type,
        },
    });
}

export async function queryTaskLog(params: { task_id: number; page: number; page_number: number }) {
    return request.get<IResponse<ITaskLogResponse>>(TaskApiPath.QueryTaskLog, {
        params: params,
    });
}

export async function queryTaskProgressList(params: ITaskProgressQuery) {
    return request.get<IResponse<ITaskProgressResponse>>(TaskApiPath.QueryTaskProgressList, {
        params: params,
    });
}

export async function addAutoPurchaseTask(data: IAPTaskBody) {
    return request.post(TaskApiPath.AddAPTask, {
        data: {
            ...data,
            version: '1.0',
            platform: 'PDD',
        },
    });
}

export async function querySubTaskProgress(query: ISubTaskProgressQuery) {
    return request.get<IResponse<ISubTaskProgressResponse>>(TaskApiPath.QuerySubTaskProgress, {
        params: query,
    });
}

import request from '@/utils/request';
import { TaskExecuteType, HotTaskRange } from '@/enums/StatusEnum';
import {
    IHotTaskBody,
    ITaskCreatedResponse,
    ITaskListQuery,
    ITaskListResponse,
    IURLTaskBody,
    ITaskDetailResponse,
    IPDDCategoryResponse,
    IPDDSortResponse,
    ITaskLogResponse,
    IPUTaskBody,
    IAPTaskBody,
    ITaskProgressQuery,
    ITaskProgressResponse,
    ISubTaskProgressQuery,
    ISubTaskProgressResponse,
    ISubTaskIdQuery,
    ISubTaskIdData,
    IVoVaTaskBody,
} from '@/interface/ITask';
import { IResponse } from '@/interface/IGlobal';
import { TaskApiPath } from '@/config/api/TaskApiPath';
import { EmptyObject } from '@/config/global';
import { isZero, transPaginationRequest, transPaginationResponse } from '@/utils/utils';
import { TaskChannelEnum } from '@/config/dictionaries/Task';

export async function getTaskList(query: ITaskListQuery) {
    const params = transPaginationRequest(query);
    return request
        .get<IResponse<ITaskListResponse>>(TaskApiPath.QueryTaskList, {
            params: params,
        })
        .then(transPaginationResponse);
}

export async function addPddHotTask(params: IHotTaskBody) {
    return request.post<IResponse<ITaskCreatedResponse>>(TaskApiPath.AddPDDHotTask, {
        data: {
            ...params,
            version: '1.0',
            platform: 'PDD',
        },
        skipResponseInterceptors: true,
    });
}

export async function addPddURLTask(params: IURLTaskBody) {
    return request.post<IResponse<ITaskCreatedResponse>>(TaskApiPath.AddPDDURLTask, {
        data: {
            ...params,
            version: '1.0',
            platform: 'PDD',
        },
        skipResponseInterceptors: true,
    });
}

export async function addPDDTimerUpdateTask(params: IPUTaskBody) {
    return request.post<IResponse<ITaskCreatedResponse>>(TaskApiPath.AddPUTask, {
        data: {
            ...params,
            version: '1.0',
        },
        skipResponseInterceptors: true,
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

export async function reTryTasks(task_id: string) {
    return request.get(TaskApiPath.RetryTask, {
        params: {
            task_id,
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

export async function queryTaskDetail(task_id: number): Promise<IResponse<ITaskDetailResponse>> {
    return request
        .get(TaskApiPath.QueryTaskDetail, {
            params: {
                task_id,
            },
        })
        .then(
            ({
                data: {
                    task_detail_info: { range, sub_cat_id, execute_count, ...extra } = EmptyObject,
                } = EmptyObject,
                ...other
            } = EmptyObject) => {
                const subCatId = Number(sub_cat_id);
                const executeCount = Number(execute_count);
                // parse
                return {
                    data: {
                        task_detail_info: {
                            sub_cat_id: subCatId,
                            shopId: isZero(range) || range === 'all' ? undefined : range,
                            task_cycle:
                                executeCount === 1
                                    ? TaskExecuteType.once
                                    : TaskExecuteType.interval,
                            execute_count: executeCount,
                            range: isZero(range)
                                ? HotTaskRange.fullStack
                                : range === 'all'
                                ? HotTaskRange.all
                                : HotTaskRange.store,
                            ...extra,
                        },
                    },
                    ...other,
                };
            },
        );
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

export async function querySortCondition() {
    return Promise.all([
        request.get<IResponse<IPDDSortResponse>>(TaskApiPath.QueryPDDSortList, {
            params: {
                type: 'list',
            },
        }),
        request.get<IResponse<IPDDSortResponse>>(TaskApiPath.QueryPDDSortList, {
            params: {
                type: 'merchant',
            },
        }),
    ]);
}

export async function queryTaskLog(params: { task_id: number; page: number; page_number: number }) {
    return request.get<IResponse<ITaskLogResponse>>(TaskApiPath.QueryTaskLog, {
        params: params,
    });
}

export async function queryTaskProgressList(params: ITaskProgressQuery) {
    return request.post<IResponse<ITaskProgressResponse>>(TaskApiPath.QueryTaskProgressList, {
        data: params,
    });
}

export async function addAutoPurchaseTask(data: IAPTaskBody) {
    return request.post<IResponse<ITaskCreatedResponse>>(TaskApiPath.AddAPTask, {
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

export async function querySubTaskIdList(params: ISubTaskIdQuery) {
    return request.get<IResponse<ISubTaskIdData>>(TaskApiPath.QuerySubTaskIdList, {
        params: transPaginationRequest(params),
    });
}

export async function addVoVaTask(params: IVoVaTaskBody) {
    return request.post(TaskApiPath.AddVoVaTask, {
        data: {
            ...params,
            version: '1.0',
            platform:
                params.channel === TaskChannelEnum.VOVA
                    ? 'VOVA'
                    : params.channel === TaskChannelEnum.FD
                    ? 'FLORYDAY'
                    : '',
        },
    });
}

import request, { errorHandlerFactory } from '@/utils/request';
import { ApiPathEnum } from '@/enums/ApiPathEnum';
import { IFormData } from '@/pages/task/components/TaskSearch';
import { TaskIntervalType, TaskRange, TaskType } from '@/enums/ConfigEnum';

declare interface ITaskListSearch extends IFormData{
    page:number;
    page_number:number;
}


export declare interface IPddHotTaskParams {
    range?: number;
    category_level_one?:string;
    category_level_two?:string;
    sort_type?:string;
    keywords?:string;
    task_type?:TaskType;
    sales_volume_min?:number;
    sales_volume_max?:number;
    price_min?:number;
    price_max?:number;
    grab_page_count?:number;
    grab_count_max?:number;
    task_start_time?:number;
    task_end_time?:number;
    task_interval_seconds?:number;
    task_name?:string;
    is_upper_shelf:boolean;
    success?:number;
    fail?:number;
    urls?:string;
}

declare interface IPddURLTaskParams {
    urls: string;
    task_name:string;
    task_type:TaskType;
    task_start_time?:number;
    task_end_time?:number;
    task_interval_seconds?:number;
    is_upper_shelf:boolean;
}


export async function getTaskList(params:ITaskListSearch) {
    return request.get(ApiPathEnum.QueryTaskList, {
        params: params,
    });
}


export async function addPddHotTask(params: IPddHotTaskParams) {
    return request.post(ApiPathEnum.AddPDDHotTask, {
        data: params,
        errorHandler:errorHandlerFactory(true)
    });
}


export async function addPddURLTask(params: IPddURLTaskParams) {
    return request.post(ApiPathEnum.AddPDDURLTask, {
        data: {
            ...params,
            version:"1.0",
            platform:"PDD",
            spider_sub_cat_id:1
        },
        errorHandler:errorHandlerFactory(true)
    });
}

export async function deleteTasks(task_ids:string) {
    return request.delete(ApiPathEnum.DeleteTask, {
        data: {
            task_ids
        },
    });
}


export async function queryTaskDetail(task_Id: number) {
    return request.get(ApiPathEnum.QueryTaskDetail,{
        params:{
            task_Id
        }
    })
}

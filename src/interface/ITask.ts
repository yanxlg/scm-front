import {
    HotTaskRange,
    TaskExecuteType,
    TaskStatusEnum,
    TaskTypeEnum,
    TaskRangeCode,
    TaskTypeCode,
    TaskStatusCode,
    PUTaskRangeType,
    AutoPurchaseTaskType,
} from '@/enums/StatusEnum';
import { IRequestPagination, IRequestPagination2 } from '@/interface/IGlobal';

export declare interface ITaskDetail {
    task_sn: string;
    task_name: string;
    range?: HotTaskRange; // 热销款任务范围
    category_level_one?: number;
    category_level_two?: number;
    sort_type?: number;
    keywords?: string;
    sales_volume_min?: number;
    sales_volume_max?: number;
    price_min?: number;
    price_max?: number;
    grab_page_count?: number;
    grab_count_max?: number;
    task_type?: TaskExecuteType; // 任务执行类型
    task_start_time?: string;
    task_end_time?: string;
    task_interval_seconds?: number;
    is_upper_shelf?: 0 | 1;
    status?: TaskStatusEnum; //任务状态
    success?: number;
    fail?: number;
}

export type ITaskListQuery = {
    task_id?: string;
    task_name?: string;
    task_status?: TaskStatusEnum;
    task_begin_time?: number;
    task_end_time?: number;
    task_create_time1?: number;
    task_create_time2?: number;
    task_sn?: string;
    task_type?: TaskTypeEnum;
} & IRequestPagination;

export interface ITaskListItem {
    task_id: number;
    task_name: string;
    task_range: TaskRangeCode;
    task_type: TaskTypeCode;
    start_time: number;
    status: TaskStatusCode;
    result: 0 | 1;
    create_time: number;
    end_time: number;
    task_cycle: string;
}

export interface ITaskListResponse {
    total: number;
    task_not_execute_num: number;
    task_execting_num: number;
    task_exected_num: number;
    task_exected_fail_num: number;
    task_ternimation_num: number;
    task_info: ITaskListItem[];
}

export interface IURLTaskBody {
    urls: string;
    task_name: string;
    task_type: TaskExecuteType;
    is_immediately_execute: boolean;
    task_start_time?: number;
    is_upper_shelf: boolean;
}

export interface IHotTaskBody {
    task_name: string;
    range: number; //全站-0,指定店铺-店铺ID
    category_level_one?: string;
    category_level_two?: string;
    category_level_three?: string;
    sort_type: string;
    keywords?: string;
    sales_volume_min?: number;
    sales_volume_max?: number;
    price_min?: number;
    price_max?: number;
    grab_page_count: number;
    grab_count_max: number;
    task_type: TaskExecuteType;
    is_immediately_execute: boolean;
    task_start_time?: number;
    task_end_time?: number;
    task_interval_seconds?: number;
    is_upper_shelf: boolean;
}

export interface IPUTaskBody {
    task_name: string;
    range: PUTaskRangeType;
    task_start_time: number;
    task_end_time: number;
    task_interval_seconds: number;
}

export interface IAPTaskBody {
    task_name: string;
    task_start_time?: number;
    task_end_time?: number;
    purchase_times?: string[];
    type: AutoPurchaseTaskType;
}

export interface ITaskCreatedResponse {
    task_id: number;
}

export interface ITaskQuery {
    task_id: number;
}

export interface ITaskDetailInfo {
    task_sn?: string;
    task_name: string;
    range?: number;
    category_level_one?: string;
    category_level_two?: string;
    category_level_three?: string;
    sort_type?: string;
    keywords?: string;
    sales_volume_min?: number;
    sales_volume_max?: number;
    price_min?: number;
    price_max?: number;
    grab_page_count?: number;
    grab_count_max?: number;
    task_type: TaskExecuteType;
    task_start_time?: number;
    task_end_time?: number;
    task_interval_seconds?: number;
    is_upper_shelf: 0 | 1;
    status: TaskStatusCode;
    success: number;
    fail: number;
    update_type?: PUTaskRangeType;
    time_interval?: number;
    urls?: string;

    // 新增的
    type?: TaskTypeCode;
    task_range?: TaskRangeCode;
}

export interface ITaskDetailResponse {
    task_detail_info: ITaskDetailInfo;
}

export interface IPDDCategoryItem {
    platform_cate_id: string;
    platform_cate_name: string;
    children?: Array<IPDDCategoryItem>;
}
export type IPDDCategoryResponse = Array<IPDDCategoryItem>;

export type IPDDSortQueryType = 'list' | 'merchant';

export interface IPDDSortItem {
    display: string;
    value: string;
}

export interface IPDDSortResponse {
    sortCondition: Array<IPDDSortItem>;
}

type ITaskLogNodeType = 0 | 1 | 2 | 3;

type ITaskLogActionType = 0 | 1 | 2 | 3 | 4;

export interface ITaskLogItem {
    sub_task_id: number;
    task_send_time: number;
    status: TaskStatusCode;
    node: ITaskLogNodeType;
    action: ITaskLogActionType;
    content: string;
}

export interface ITaskLogResponse {
    list: Array<ITaskLogItem>;
    total: number;
}

export interface ITaskProgressQuery extends IRequestPagination2 {
    task_id: number;
}

export interface ITaskProgressItem {
    sub_task_id: number;
    start_time: number;
    end_time: number;
    create_status: 0 | 1;
    status: TaskStatusCode;
    progress: number;
    task_type: TaskTypeCode;
}

export interface ITaskProgressResponse {
    list: ITaskProgressItem[];
    total: number;
}

export interface ISubTaskProgressQuery {
    sub_task_id: number;
}

export interface ISubTaskProgressResponse {
    grab_num: number;
    transform_incoming_num: number;
    incoming_num: number;
    incoming_fail_num: number;
}

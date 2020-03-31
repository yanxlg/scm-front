/**
 * 任务中心接口
 */
import {
    TaskExecuteType,
    TaskStatusEnum,
    TaskTypeEnum,
    TaskRangeCode,
    TaskTypeCode,
    TaskStatusCode,
    PUTaskRangeType,
    AutoPurchaseTaskType,
    TaskCreateStatusCode,
    TaskRangeEnum,
    HotTaskRange,
} from '@/enums/StatusEnum';
import { IBoolean, RequestPagination } from '@/interface/IGlobal';

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
} & RequestPagination;

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
    execute_count: number;
}

export interface ITaskListExtraData {
    task_total_num: number;
    task_wait_execute_num: number;
    task_executing_num: number;
    task_executed_num: number;
    task_executed_fail_num: number;
    task_termination_num: number;
}

export interface ITaskListResponse extends ITaskListExtraData {
    total: number;
    list: ITaskListItem[];
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
export interface ITaskCreateItem {
    task_type: TaskTypeCode;
    task_sn: number;
}

export type ITaskCreatedResponse = ITaskCreateItem;

export interface ITaskQuery {
    task_id: number;
}

export interface ITaskDetailInfo {
    task_sn?: string;
    task_name: string;
    shopId?: number; // 指定店铺类型任务转换出改字段
    range?: HotTaskRange;

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
    task_start_time?: number;
    task_end_time?: number;
    task_interval_seconds?: number;
    is_upper_shelf: boolean;
    status: TaskStatusCode;
    success: number;
    fail: number;
    update_type?: PUTaskRangeType;
    time_interval?: number;
    urls?: string;

    // 新增的
    task_type?: TaskTypeCode;
    execute_count: number; //TaskExecuteType
    sub_cat_id: TaskRangeCode;
    sort_type_name?: string;
    cate_name_one?: string;
    cate_name_two?: string;
    cate_name_three?: string;
    task_cycle?: TaskExecuteType;
    task_channel?: string;
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

export interface ITaskProgressQuery {
    task_id: number;
    plan_id?: string;
    collect_onsale_type?: 1 | 2;
}

export interface ITaskProgressItem {
    stage: string;
    wait_execute: number;
    executing: string;
    success: string;
    fail: string;
    fail_reason: string;
}

export interface ITaskProgressResponse {
    list?: ITaskProgressItem[];
    total?: number;
    task_type?: TaskTypeCode;
    total_goods?: string;
    already_on_sale_goods?: string;
    already_catch_goods?: string;
    add_on_sale_goods?: string;
    add_catch_goods?: string;
    on_sale_goods?: string;
    catch_goods?: string;
    success?: string;
    fail?: string;
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

export interface ISubTaskIdItem {
    plan_id: string;
    status: string; // 3执行失败
}

export interface ISubTaskIdData {
    list: ISubTaskIdItem[];
    fail_count: string;
}

export interface ISubTaskIdQuery extends RequestPagination {
    task_id: number;
}

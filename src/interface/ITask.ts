import { HotTaskRange, TaskExecuteType, TaskStatusEnum } from '../enums/StatusEnum';

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

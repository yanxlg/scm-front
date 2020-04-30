export interface IOrderDashboardReq {
    statistics_start_time: number;
    statistics_end_time: number;
    platform: string;
    store: string;
    statistics_type: string;
}

export declare interface IPlatformItem {
    name: string;
    value: string;
    children?: IPlatformItem[];
}

export declare interface IOrderDashboardRes {
    [key: string]: any;
}
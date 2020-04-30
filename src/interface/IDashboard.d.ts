export interface IOrderDashboardReq {
    statistics_start_time: number;
    statistics_end_time: number;
    platform: number;
    store: number;
    statistics_type: string;
}
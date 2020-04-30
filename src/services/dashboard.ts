import request from '@/utils/request';
import { DashboardApiPath } from '@/config/api/DashboardApiPath';
import { IOrderDashboardReq } from '@/interface/IDashboard';

export function getOrderDashboardData(data: IOrderDashboardReq) {
    return request.post(DashboardApiPath.getOrderDashboardData, {
        data
    });
}

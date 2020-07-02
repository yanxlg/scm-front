import request from '@/utils/request';
import { DashboardApiPath } from '@/config/api/DashboardApiPath';
import {
    IOrderDashboardReq,
    IPlatformItem,
    IDashboardOverviewReq,
    IMonitorOrderReq,
    IMonitorPurchaseOrderReq,
} from '@/interface/IDashboard';
import { singlePromiseWrap } from '@/utils/utils';

// IOrderDashboardReq
export function getOrderDashboardData(data: IOrderDashboardReq) {
    return request.post(DashboardApiPath.getOrderDashboardData, {
        data,
    });
}

export const getPlatformAndStore = singlePromiseWrap(() => {
    return request.get(DashboardApiPath.getPlatformAndStore).then(res => {
        const list: IPlatformItem[] = [];
        const obj: any = {};
        res.data?.forEach((item: any) => {
            const { merchant_platform, merchant_name } = item;
            const nameList = obj[merchant_platform];
            !nameList && (obj[merchant_platform] = []);
            obj[merchant_platform].push({
                name: merchant_name,
                value: merchant_name,
            });
        });
        Object.keys(obj).forEach(platform => {
            const item: IPlatformItem = {
                name: platform,
                value: platform,
                children: obj[platform],
            };
            list.push(item);
        });
        return list;
    });
});

export function getDashboardTradeData(data: IDashboardOverviewReq) {
    return request.post(DashboardApiPath.getDashboardTradeData, {
        data,
    });
}

export function getMonitorOrder(data: IMonitorOrderReq) {
    return request.post(DashboardApiPath.getMonitorOrder, {
        data,
    });
}

export function getMonitorPurchaseOrder(data: IMonitorPurchaseOrderReq) {
    return request.post(DashboardApiPath.getMonitorPurchaseOrder, {
        data,
    });
}

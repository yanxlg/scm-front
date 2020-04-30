import request from '@/utils/request';
import { DashboardApiPath } from '@/config/api/DashboardApiPath';
import { IOrderDashboardReq, IPlatformItem } from '@/interface/IDashboard';
import { singlePromiseWrap } from '@/utils/utils';

// IOrderDashboardReq
export function getOrderDashboardData(data: IOrderDashboardReq) {
    return request.post(DashboardApiPath.getOrderDashboardData, {
        data
    });
}

export const getPlatformAndStore = singlePromiseWrap(() => {
    return request.get(DashboardApiPath.getPlatformAndStore).then(res => {
        // console.log('getPlatformAndStore', res.data);
        // {fd: ["flornt"], vova: ["fl"]}
        const list: IPlatformItem[] = [];
        Object.keys(res.data || {}).forEach(platform => {
            const item: IPlatformItem = {
                name: platform,
                value: platform,
                children: res.data[platform].map((merchant: string) => ({
                    name: merchant,
                    value: merchant
                }))
            };
            list.push(item);
        });
        return list;
    });
})


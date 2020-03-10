import request from '@/utils/request';
import { OrderApiPath } from '@/config/api/OrderApiPath';

export declare interface IFilterParams {
    page?: number;
    page_count?: number;
    only_p_order?: number;
}

export async function getAllOrderList(data: IFilterParams) {
    return request.post(OrderApiPath.getAllOrderList, {
        requestType: 'json',
        data
    });
}

// 获取待拍单
export async function getPendingOrderList(data = {}) {
    return request.post(OrderApiPath.getPendingOrderList, {
        requestType: 'json',
        data
    });
}

// 获取待支付
export async function getPayOrderList(data = {}) {
    return request.post(OrderApiPath.getPayOrderList, {
        requestType: 'json',
        data
    });
}

// 获取待发货
export async function getWaitShipList(data = {}) {
    return request.post(OrderApiPath.getWaitShipList, {
        requestType: 'json',
        data
    });
}

// 采购未发货
export async function getPurchasedNotStockList(data = {}) {
    return request.post(OrderApiPath.getPurchasedNotStockList, {
        requestType: 'json',
        data
    });
}

// 仓库未发货
export async function getStockNotShipList(data = {}) {
    return request.post(OrderApiPath.getStockNotShipList, {
        requestType: 'json',
        data
    });
}

// 获取异常订单
export async function getErrorOrderList(data = {}) {
    return request.post(OrderApiPath.getErrorOrderList, {
        requestType: 'json',
        data
    });
}


export async function getOrderGoodsDetail(params: { middleground_order_id: string }) {
    return request.get(OrderApiPath.getOrderGoodsDetail, {
        requestType: 'form',
        params
    });
}


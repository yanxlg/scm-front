import request from '@/utils/request';
import { ApiPathEnum } from '@/enums/ApiPathEnum';


export declare interface IFilterParams {
    page?: number;
    page_count?: number;
    only_p_order?: number;
}

 
export async function getAllOrderList(params: IFilterParams) {
    return request.post(ApiPathEnum.getAllOrderList, {
        requestType: 'form',
        params
    });
}

// 获取待拍单
export async function getPendingOrderList(params = {}) {
    return request.post(ApiPathEnum.getPendingOrderList, {
        requestType: 'form',
        params
    });
}

// 获取待支付
export async function getPayOrderList(params = {}) {
    return request.post(ApiPathEnum.getPayOrderList, {
        requestType: 'form',
        params
    });
}

// 获取待发货
export async function getWaitShipList(params = {}) {
    return request.get(ApiPathEnum.getWaitShipList, {
        requestType: 'form',
        params
    });
}

// 采购未发货
export async function getPurchasedNotStockList(params = {}) {
    return request.get(ApiPathEnum.getPurchasedNotStockList, {
        requestType: 'form',
        params
    });
}

// 仓库未发货
export async function getStockNotShipList(params = {}) {
    return request.get(ApiPathEnum.getStockNotShipList, {
        requestType: 'form',
        params
    });
}

// 获取异常订单
export async function getErrorOrderList(params = {}) {
    return request.get(ApiPathEnum.getErrorOrderList, {
        requestType: 'form',
        params
    });
}


export async function getOrderGoodsDetail(params: { middleground_order_id: string }) {
    return request.get(ApiPathEnum.getOrderGoodsDetail, {
        requestType: 'form',
        params
    });
}


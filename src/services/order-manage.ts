import request from '@/utils/request';
import { ApiPathEnum } from '@/enums/ApiPathEnum';

export declare interface IFilterBaseParams {
    page: number;
    page_number: number;
}

export declare interface IFilterParams extends IFilterBaseParams {
    order_confirm_time1?: number | undefined;
    order_confirm_time2?: number | undefined;
    commodity_id?: string;
    middleground_order_id?: string;
    channel_goods_id?: string;
    channel_order_number?: string;
    middleground_order_status?: string;
    purchase_order_status?: string;
    purchase_payment_status?: string;
    purchase_delivery_status?: string;
    channel_order_status?: string;
    channel_shipments_status?: string;
}

 
export async function getAllOrderList(params: IFilterParams) {
    return request.get(ApiPathEnum.getAllOrderList, {
        requestType: 'form',
        params
    });
}

// 获取待拍单
export async function getPendingOrderList(params = {}) {
    return request.get(ApiPathEnum.getPendingOrderList, {
        requestType: 'form',
        params
    });
}

// 获取待支付
export async function getPayOrderList(params = {}) {
    return request.get(ApiPathEnum.getPayOrderList, {
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


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

export async function getProductOrderList(params: IFilterParams) {
    return request.get(ApiPathEnum.getProductOrderList, {
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


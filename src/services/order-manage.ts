import request from '@/utils/request';
import { OrderApiPath } from '@/config/api/OrderApiPath';
import { downloadExcel } from '@/utils/common';

export declare interface IFilterParams {
    page?: number;
    page_count?: number;
    order_time_start?: number; // 订单时间
    order_time_end?: number;
    order_goods_id?: string[]; // 中台订单id
    order_id?: string[]; // 中台父订单id
    channel_order_goods_sn?: string[]; // 销售订单id
    channel_source?: number; // 渠道来源， VOVA, FD
    purchase_time_start?: number; // 采购时间
    purchase_time_end?: number; // 采购时间
    last_waybill_no?: string[]; // 尾程运单号
    product_id?: string[]; // 中台product id
    sku_id?: string[]; // 中台sku id
    order_goods_status?: number; // 订单状态 1：已确认 2：已取消
    order_goods_shipping_status?: number; // 订单配送状态 1：未配送 2：头程已配送 3：已妥投未入库 4： 已入库 5：出库中 6：出库失败  7：取消出库 8：已出库 9：尾程已揽收 10：已妥投
    delivery_time_start?: number; // 出库时间
    delivery_time_end?: number;
    collect_time_start?: number; // 上线时间 揽收时间
    collect_time_end?: number;
    receive_time_start?: number; // 收获时间
    receive_time_end?: number;
    pay_time_start?: number; // 支付时间
    pay_time_end?: number;
    storage_time_start?: number; // 入库时间
    storage_time_end?: number;
    confirm_time_start?: number; // 订单确认时间
    confirm_time_end?: number;
    non_purchase_plan?: number; // 没有采购计划的 true 没有采购计划
    cancel_time_start?: number; // og订单取消时间
    cancel_time_end?: number;
    only_p_order?: number;
}

export declare interface IPayFilterParams {
    page?: number;
    page_count?: number;
    purchase_order_stime?: number;
    purchase_order_etime?: number;
    purchase_platform?: number;
    purchase_order_sn?: string;
    purchase_parent_order_sn?: string;
}

export declare interface IErrFilterParams {
    page?: number;
    page_count?: number;
    order_start_time?: number;
    order_end_time?: number;
    confirm_time_start?: number;
    confirm_time_end?: number;
    channel_source?: number;
    order_goods_id?: string;
    abnormal_type?: number;
    abnormal_detail_type?: number;
}

interface IConfirmPayData {
    purchase_platform_parent_order_id: string;
    purchase_plan_id: string[];
}

// 获取所有列表的条数
export async function getAllTabCount(type: number) {
    return request.get(`/api/v1/orders/count/${type}`);
}

// 获取全部订单
export async function getAllOrderList(data: IFilterParams) {
    return request.post(OrderApiPath.getAllOrderList, {
        requestType: 'json',
        data,
    });
}

export async function postExportAll(data: IFilterParams) {
    return request
        .post(OrderApiPath.postExportAll, {
            data,
            responseType: 'blob',
            parseResponse: false,
        })
        .then(downloadExcel);
}

// 获取待拍单
export async function getPendingOrderList(data = {}) {
    return request.post(OrderApiPath.getPendingOrderList, {
        requestType: 'json',
        data,
    });
}

// 获取待支付
export async function getPayOrderList(data: IPayFilterParams) {
    return request.post(OrderApiPath.getPayOrderList, {
        requestType: 'json',
        data,
    });
}

export async function postExportPay(data: IPayFilterParams) {
    return request
        .post(OrderApiPath.postExportPay, {
            data,
            responseType: 'blob',
            parseResponse: false,
        })
        .then(downloadExcel);
}

// 获取待发货
export async function getWaitShipList(data = {}) {
    return request.post(OrderApiPath.getWaitShipList, {
        requestType: 'json',
        data,
    });
}

// 采购未发货
export async function getPurchasedNotStockList(data = {}) {
    return request.post(OrderApiPath.getPurchasedNotStockList, {
        requestType: 'json',
        data,
    });
}

// 仓库未发货
export async function getStockNotShipList(data = {}) {
    return request.post(OrderApiPath.getStockNotShipList, {
        requestType: 'json',
        data,
    });
}

// 获取异常订单
export async function getErrorOrderList(data: IErrFilterParams) {
    return request.post(OrderApiPath.getErrorOrderList, {
        requestType: 'json',
        data,
    });
}

export async function postExportErrOrder(data: IErrFilterParams) {
    return request
        .post(OrderApiPath.postExportErrOrder, {
            data,
            responseType: 'blob',
            parseResponse: false,
        })
        .then(downloadExcel);
}

// 获取商品详情
export async function getOrderGoodsDetail(id: string) {
    return request.get(`/api/v1/goods/get/${id}`);
}

// 一键拍单
export async function postOrdersPlace(data: { order_goods_ids: string[] }) {
    return request.post(OrderApiPath.postOrdersPlace, {
        requestType: 'json',
        data,
    });
}

// 取消采购订单
export async function delPurchaseOrders(data: { order_goods_ids: string[] }) {
    return request.delete(OrderApiPath.delPurchaseOrders, {
        requestType: 'json',
        data,
    });
}

// 取消渠道订单
export async function delChannelOrders(data: { order_goods_ids: string[] }) {
    return request.delete(OrderApiPath.delChannelOrders, {
        requestType: 'json',
        data,
    });
}

// 确认支付
export async function putConfirmPay(data: IConfirmPayData) {
    return request.put(OrderApiPath.putConfirmPay, {
        requestType: 'json',
        data,
    });
}

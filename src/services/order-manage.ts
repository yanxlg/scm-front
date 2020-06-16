import request from '@/utils/request';
import { OrderApiPath } from '@/config/api/OrderApiPath';
import { GlobalApiPath } from '@/config/api/Global';
import {
    IPadSimilarBody,
    IWarehouseNotShipSearch,
    INotWarehouseSearch,
    IWaitShipSearch,
    IWaitPaySearch,
    IPendingOrderSearch,
    ISimilarInfoResponse,
    IChannelSourceResponse,
    IReviewSearch,
    IPlatformItem,
    IPurchaseLog,
    IOrderItem,
} from '@/interface/IOrder';
import { transPaginationResponse, singlePromiseWrap } from '@/utils/utils';
import { api } from 'react-components';
import { IRequestPagination1, IResponse } from '@/interface/IGlobal';
// import { ISHopList } from '@/interface/IChannel';
import { ChannelApiPath } from '@/config/api/ChannelApiPath';
import Order from '@/pages/order';
import { IPaginationResponse } from 'react-components/es/hooks/useList';

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
    return request.post(OrderApiPath.postExportAll, {
        data,
    });
}

// 获取待拍单
export async function getPendingOrderList(data: IPendingOrderSearch) {
    return request.post(OrderApiPath.getPendingOrderList, {
        requestType: 'json',
        data,
    });
}

export async function postExportPendingOrder(data: IPendingOrderSearch) {
    return request.post(OrderApiPath.postExportPendingOrder, {
        data,
    });
}

// 获取待支付
export async function getPayOrderList(data: IWaitPaySearch) {
    return request.post(OrderApiPath.getPayOrderList, {
        requestType: 'json',
        data,
    });
}

export async function postExportPay(data: IWaitPaySearch) {
    return request.post(OrderApiPath.postExportPay, {
        data,
    });
}

// 获取待发货
export async function getWaitShipList(data: IWaitShipSearch) {
    return request.post(OrderApiPath.getWaitShipList, {
        requestType: 'json',
        data,
    });
}

export async function postExportWaitShip(data: IWaitShipSearch) {
    return request.post(OrderApiPath.postExportWaitShip, {
        data,
    });
}

// 已采购未入库
export async function getPurchasedNotWarehouseList(data: INotWarehouseSearch) {
    return request.post(OrderApiPath.getPurchasedNotWarehouseList, {
        requestType: 'json',
        data,
    });
}

export async function postExportPurchasedNotWarehouse(data: INotWarehouseSearch) {
    return request.post(OrderApiPath.postExportPurchasedNotWarehouse, {
        data,
    });
}

// 仓库未发货
export async function getWarehouseNotShipList(data: IWarehouseNotShipSearch) {
    return request.post(OrderApiPath.getWarehouseNotShipList, {
        requestType: 'json',
        data,
    });
}

export async function postExportWarehouseNotShip(data: IWarehouseNotShipSearch) {
    return request.post(OrderApiPath.postExportWarehouseNotShip, {
        data,
    });
}

export function getErrorOrderList(data: IErrFilterParams) {
    return api
        .post(OrderApiPath.getErrorOrderList, {
            requestType: 'json',
            data: data,
        })
        .then(transPaginationResponse);
}

export async function postExportErrOrder(data: IErrFilterParams) {
    return request.post(OrderApiPath.postExportErrOrder, {
        data,
    });
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

// 查看物流轨迹
export async function getOrderTrack(params: { order_goods_id: string; last_waybill_no: string }) {
    return request.get(OrderApiPath.getOrderTrack, {
        params,
    });
}

export async function patSimilarGoods(body: IPadSimilarBody) {
    return request.post(OrderApiPath.padSimilarGood, {
        data: body,
    });
}

export async function querySimilarInfo(query: {
    order_goods_id: string;
    purchase_plan_id: string;
}) {
    return request.get<IResponse<ISimilarInfoResponse>>(OrderApiPath.querySimilarInfo, {
        params: query,
    });
}

export const queryChannelSource = singlePromiseWrap(() => {
    return request.get<IResponse<IChannelSourceResponse>>(OrderApiPath.queryChannelSource);
});

export function getReviewOrderList(data: IReviewSearch) {
    return api
        .post(OrderApiPath.getReviewOrderList, {
            requestType: 'json',
            data: data,
        })
        .then(transPaginationResponse);
}

export async function postExportReview(data: any) {
    return request.post(GlobalApiPath.ExportExcel, {
        data,
    });
}

export function postReviewPass(data: { order_goods_ids: string[] }) {
    return request.post(OrderApiPath.postReviewPass, {
        data,
    });
}

export function postOrderOffsale(data: { order_goods_ids: string[] }) {
    return request.post(OrderApiPath.postOrderOffsale, {
        data,
    });
}

export const queryShopList = singlePromiseWrap(() => {
    return request.get(OrderApiPath.QueryShopList);
});

export const getPlatformAndStore = singlePromiseWrap(() => {
    return request.get(OrderApiPath.QueryShopList).then(res => {
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

export const queryPendingCount = () => {
    return request.get<
        IResponse<{
            penddingFailOrderCount: number;
            penddingOrderCount: number;
            samePenddingOrderCount: number;
            waitPenddingOrderCount: number;
        }>
    >(OrderApiPath.QueryPendingCount);
};

export const queryTakeOrders = () => {
    return request.get<
        IResponse<{
            data: Array<IPurchaseLog>;
        }>
    >(OrderApiPath.QueryTakeOrders);
};

export const getPurchaseUidList = singlePromiseWrap(() => {
    return request.get(OrderApiPath.getPurchaseUidList).then(({ data: { data } }) => {
        if (data && data.length) {
            return data.map(({ name, platform_uid }: any) => ({
                name,
                value: platform_uid,
            }));
        }

        return [];
    });
});

export const getWarehouseList = singlePromiseWrap(() => {
    return request.get(OrderApiPath.getWarehouseList).then(({ data }) => {
        return Object.keys(data).map(key => ({
            name: data[key],
            value: key,
        }));
    });
});

export const queryPendingSignList = (data: any) => {
    return api
        .post<IResponse<IPaginationResponse<IOrderItem>>>(OrderApiPath.queryPendingSignList, {
            data,
        })
        .then(({ data, ...extra }) => {
            return {
                ...extra,
                data: {
                    ...Object.assign({}, data, {
                        // @ts-ignore
                        total: data.all_count || data.total,
                    }),
                },
            };
        });
};

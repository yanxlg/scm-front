import { failureReasonCode } from '@/enums/OrderEnum';

export interface IPadSimilarBody {
    platform: 'pdd';
    goods_id: string;
    sku_id: string;
    type: '1' | '2';
    origin_purchase_plan_id: string;
}

export interface IPagination {
    page?: number;
    page_count?: number;
}

export interface IPendingOrderSearch extends IPagination {
    order_goods_id?: string[];
    product_id?: string[];
    sku_id?: string[];
    channel_source?: number;
    order_time_start?: number;
    order_time_end?: number;
}

export interface IPendingOrderItem {
    [key: string]: any;
}

export interface IWaitPaySearch extends IPagination {
    purchase_order_sn?: string;
    purchase_parent_order_sn?: string;
    purchase_platform?: number;
    purchase_order_stime?: number;
    purchase_order_etime?: number;
}

export declare interface IWaitPayOrderItem {
    purchase_pay_url: string;
    purchase_total_amount: string;
    purchase_parent_order_sn: string;
    purchase_order_time: string;
    parent_purchase_pay_status_desc: string;
    purchase_plan_id: string;
    purchase_order_sn: string;
    purchase_order_status: string;
    purchase_order_status_desc: string;
    purchase_pay_status: string;
    purchase_pay_status_desc: string;
    order_goods_id: string;
    _rowspan?: number;
    _checked?: boolean;
}

export interface IWaitShipSearch extends IPagination {
    order_goods_id?: string;
    purchase_platform_order_id_list?: string[];
    product_id?: string;
    channel_source?: number;
    order_goods_status?: number;
    purchase_order_status?: number;
    platform_order_time_start?: number;
    platform_order_time_end?: number;
    order_create_time_start?: number;
    order_create_time_end?: number;
}

export interface IWaitShipOrderItem {
    platformOrderTime: string;
    purchasePlatformOrderId: string;
    purchaseAmount: string;
    orderGoodsStatus: string;
    purchaseOrderStatus: string;
    purchaseOrderShippingStatus: string;
    purchasePlanId: string;
    orderGoodsId: string;
    orderCreateTime: string;
    productId: string;
    // purchasewaybillNo: string;
    channelSource: string;
}

export interface INotWarehouseSearch extends IPagination {
    order_goods_id?: string;
    purchase_platform_order_id_list?: string[];
    product_id?: string;
    purchase_waybill_no?: string;
    channel_source?: number;
    order_goods_status?: number;
    purchase_order_status?: number;
    platform_order_time_start?: number;
    platform_order_time_end?: number;
}

export interface INotWarehouseOrderItem {
    [key: string]: any;
}

export interface IWarehouseNotShipSearch extends IPagination {
    order_goods_id?: string[];
    product_id?: string[];
    purchase_waybill_no?: string[];
    channel_source?: number;
    storage_time_start?: number;
    storage_time_end?: number;
}

export interface IWarehouseNotShipOrderItem {
    [key: string]: any;
}

export interface IHistorySimilar {
    productSkuStyle: string;
    commoditySkuId: string;
    productId: string;
    substituteSuccessRate: string;
}

export interface ISimilarInfoResponse {
    status: 0 | 1 | 2 | 3 | 4;
    purchaseInfo: {
        productImageUrl: string;
        productName: string;
        productId: string;
        commoditySkuId: string;
        platform: string;
        goodsId: string;
        skuId: string;
        productSkuStyle: string;
        purchaseFailCode: failureReasonCode;
    };
    originOrderInfo: {
        skuImageUrl: string;
        productId: string;
        skuId: string;
        productTitle: string;
        productOptionValue: string;
    };
    historySimilarGoodsInfo: Array<IHistorySimilar>;
}

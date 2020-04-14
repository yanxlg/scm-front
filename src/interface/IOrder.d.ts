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

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

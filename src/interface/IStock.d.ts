import { Dayjs } from 'dayjs';

export interface IStockOutItem {
    sku: string;
    outboundOrderSn: string;
    planedQuantity: number;
    quantity: number;
    outboundTime: string;
    lastWaybillNo: string;
    commodity_id: string;
}

export interface IStockInItem {
    sku: string;
    inboundOrderSn: string;
    planedQuantity: number;
    quantity: number;
    inboundTime: string;
    firstWaybillNo: string;
    purchaseOrderSn: string;
    commodity_id: string;
}

export declare interface IStockINFormData {
    time_start?: Dayjs | number;
    time_end?: Dayjs | number;
    purchase_order_sn?: string;
    inbound_order_sn?: string;
    commodity_id?: string;
}

export declare interface IStockOUTFormData {
    time_start?: Dayjs | number;
    time_end?: Dayjs | number;
    last_waybill_no?: string;
    outbound_order_sn?: string;
    commodity_id?: string;
}

export declare interface IStockRequest {
    commodity_id?: string;
    commodity_sku_id?: string;
}

export declare interface IStockItem {
    sku: string;
    warehousingInventory: number;
    bookedInventory: number;
    sku_item: {
        commodityId: string;
        commoditySkuId: string;
        channelSkuId: string;
        optionValue: string;
        imageUrl: string;
        size?: string;
        color?: string;
    };
}

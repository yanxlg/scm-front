import { Dayjs } from 'dayjs';

export interface IStockOutItem {
    referWaybillNo: string;
    orderAddress: {
        consignee: string;
        country: string;
        province: string;
        city: string;
        address1: string;
        address2: string;
        zipCode: string;
        tel: string;
    };
    orderGoodsShippingStatus: string;
    lastWaybillNo: string;
    carrierName: string;
    orderGoods: Array<{
        channelOrderGoodsSn: string;
        orderGoodsId: string;
        commodityId: string;
        skuId: string;
        productImage: string;
        goodsNumber: string;
    }>;
    deliveryTime: string;
    totalWeight: string;
    weightUnit: string;
    deliveryCommandTime: string;

    channelOrderGoodsSn?: string;
    orderGoodsId?: string;
    commodityId?: string;
    skuId?: string;
    productImage?: string;
    goodsNumber?: string;
    rowSpan?: number;
}

export interface IStockInItem {
    referWaybillNo: string;
    createTime: string;
    commodityId: string;
    commoditySkuId: string;
    purchaseSkuId: string;
    productImageUrl: string;
    productGoodsName: string;
    boundStatus: number;
    purchaseWaybillNo: string;
    purchaseShippingName: string;
    purchaseOrderGoodsId: string;
    purchaseGoodsNumber: string;
    waybillNumber: number;
    inboundWeight: string;
    inWarehouseTime: string;
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

export declare interface Ilogistic {
    carrier_id: string;
    carrier_name: string;
}

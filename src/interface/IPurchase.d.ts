export declare interface IPurchaseItem {
    purchaseOrderGoodsId: string;
    purchaseOrderStatus: number;
    purchaseTotalAmount: string;
    planPurchaseTotalAmount: string;
    purchaseProductName: string;
    purchasePlatform: string;
    purchaseMerchantName: string;
    purchaseOrderGoodsSn: string;
    purchaseOrderSn: string;
    refundAmount: string;
    refundStatus: string;
    purchaseGoodsNumber: string;
    storageExpressInfo: Array<{
        referWaybillNo: string;
        purchaseTrackingNumber: string;
        type: string;
    }>;
    productImageUrl: string;
    productSkuStyle: string;

    referWaybillNo?: string; // flat
    purchaseTrackingNumber?: string; // flat
    type?: string; // flat
    rowSpan?: number;
}

export declare interface IReturnItem {
    purchaseReturnStatus: string;
    returnNumber: string;
    realReturnNumber: string;
    purchaseOrderGoodsId: string;
    referWaybillNo: string;
    purchaseOrderGoodsSn: string;
    waybillNo: string;
    productImageUrl: string;
    purchasePlatformGoodsName: string;
    productPddMerchantName: string;
    purchaseOrderGoodsReturnId: string;
    productSkuStyle: string;
}

export declare interface IReturnStatics {
    total?: number;
    wait_outbound_total?: number;
    wait_delivery_total?: number;
    finished_total?: number;
}

export declare interface IAddressItem {
    label: string;
    value: string;
    children?: IAddressItem[];
}

export declare interface IAddressConfig {
    children: IAddressItem[];
    label: string;
    value: string;
}

export declare interface IPurchaseStatics {
    all_total?: number;
    finish_total?: number;
    wait_in_total?: number;
    wait_send_total?: number;
    wait_recieve_total?: number;
    some_in_total?: number;
    purchase_refund_total?: number;
}

export declare interface IPurchasePlain {
    purchasePlanId: string;
    orderGoodsId: string;
    purchasePlatformOrderId: string;
    commoditySkuId: string;
    purchaseNumber: string;
    payTime: string;
    platformSendOrderTime: string;
    platformOrderTime: string;
    platformShippingTime: string;
    reserveStatus: 1 | 2 | 3 | 4;
    purchaseOrderStatus: 1 | 2 | 3 | 4 | 5 | 6 | 7;
    purchaseFailReason: string;
    purchaseCancelStatus: 1 | 2;
    purchaseCancelReason: string;
    purchaseOrderPayStatus: 1 | 2 | 3 | 4 | 5 | 6;
}

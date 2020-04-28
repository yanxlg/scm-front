export declare interface IPurchaseItem {
    purchase_goods_id: number;
    purchaseOrderStatus: number;
    purchase_total_amount: string;
    plan_purchase_total_amount: string;
    purchase_product_info: string;
    supply_merchant_name: string;
    supply_goods_sn: string;
    supply_parent_goods_sn: string;
    refund_amount: string;
    refund_status: string;
    storage_express_info: {
        refer_waybill_no: string;
        purchase_tracking_number: string;
        type: string;
    };
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

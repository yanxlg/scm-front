import { PurchaseCode, PurchaseCreateTypeCode } from '@/config/dictionaries/Purchase';

export interface IWaybillExceptionType {
    '101': string;
    '102': string;
    '103': string;
    '104': string;
    '105': string;
}

export type IWaybillExceptionTypeKey = keyof IWaybillExceptionType;

export interface IWaybillExceptionStatus {
    1: '待处理';
    2: '处理中';
    3: '已完结';
}

export type IWaybillExceptionStatusKey = keyof IWaybillExceptionStatus;

export interface IPurchaseAbnormalItem {
    waybillExceptionSn: string; // 异常订单编号
    waybillExceptionType: IWaybillExceptionTypeKey; // 异常类型 101扫码失败，102拒收 103多发货 104货不对版 105货品不合规
    waybillExceptionStatus: IWaybillExceptionStatusKey; // 异常单状态 1:待处理 2:处理中 3:已完结
    waybillExceptionDescription: string; // 异常描述
    waybillNo: string; // 物流运单号
    shippingName: string; // 物流商名称
    finishedTime: string; // 完结时间
    purchaseOrderGoodsId: string; // 采购单id
    referWaybillNo: string; // 入库单号
    quantity: number; // 异常数量
    packagImageUrl: string; // 包裹图片
    goodsImageUrl: string; // 商品图片
    // platformUid: string;
    // purchasePlatform: string;
    remark: string;
    packageImageUrl?: string;
}

export interface IPurchaseAbnormalReq {
    waybill_exception_sn?: string[];
    waybill_exception_type?: number;
    purchase_order_id?: string[];
    waybill_no?: string;
    waybill_exception_status?: number;
}

export interface ICorrelateWaybillReq {
    purchase_order_goods_id: string;
    purchase_waybill_no: string;
    goods_number: string;
    remark: string;
    // waybill_exception_sn: string;
    request_type: 'PURCHASE_ORDER';
}

export interface IRejectAbnormalOrderReq {
    waybill_exception_sn: string;
    abnormal_operate_type: '拒收';
    reject_count: string;
    receive_name: string;
    receive_tel: string;
    receive_address: string;
    receive_address_detail: string;
    zip_code: string;
    remarks: string;
}

export interface IDiscardAbnormalOrderReq {
    waybill_exception_sn: string;
    abnormal_operate_type: '废弃';
    remarks: string;
}

export interface IApplyPurchaseRefundReq {
    purchase_order_goods_id: string;
    remark: string;
}

export declare interface IPurchaseItem {
    purchaseOrderGoodsId: string;
    purchaseOrderStatus: number;
    purchaseTotalAmount: string;
    planPurchaseTotalAmount: string;
    purchaseGoodsName: string;
    purchasePlatform: string;
    purchaseMerchantName: string;
    purchaseOrderGoodsSn: string;
    purchaseOrderSn: string;
    refundAmount: string;
    purchaseRefundStatus: string;
    purchaseGoodsNumber: string;
    storageExpressInfo: Array<{
        referWaybillNo: string;
        purchaseTrackingNumber: string;
        type: string;
        waybillNumber: string;
        boundStatus: string;
    }>;
    productImageUrl: string;
    productSkuStyle: string;
    purchaseGoodsStatus: PurchaseCode;
    referWaybillNo?: string; // flat
    purchaseTrackingNumber?: string; // flat
    waybillNumber?: string;
    type?: string; // flat
    rowSpan?: number;
    boundStatus?: string;
    realInStorageNumber?: number;
    origin: PurchaseCreateTypeCode;
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
    receiverTel: string;
    receiverProvince: string;
    receiverCity: string;
    receiverStreet: string;
    receiverAddress: string;
    receiverName: string;
    receiverCode: string;
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

export declare interface IReturnInfo {
    purchaseRefundId: string;
    purchaseOrderId: string;
    purchaseOrderGoodsId: string;
    afterSalesId: string;
    purchaseRefundType: string;
    refundAmount: string;
    purchaseOrderSn: string;
    purchaseAccountId: string;
    shippingId: string;
    shippingName: string;
    trackingNumber: string;
    purchaseRefundStatus: string;
    receiverAddress: string;
    receiverName: string;
    receiverTel: string;
}

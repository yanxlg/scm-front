export interface IPurchaseAbnormalItem {
    waybillExceptionSn: string; // 异常订单编号
    waybillExceptionType: string; // 异常类型 101扫码失败，102拒收 103多发货 104货不对版 105货品不合规
    waybillExceptionStatus: number; // 异常单状态 1:待处理 2:处理中 3:已完结
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
    goods_number: number;
    remark: string;
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

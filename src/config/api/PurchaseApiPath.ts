/**
 * 订单api地址枚举
 */
export enum PurchaseApiPath {
    getAbnormalAllList = '/api/v1/purchase/waybill_exception',
    setCorrelateWaybill = '/api/v1/purchase/correlate_waybill',
    setDiscardAbnormalOrder = '/api/v1/purchase/discard_abnormal_order',
    applyPurchaseRefund = '/api/v1/purchase/refund',
    getExceptionCount = '/api/v1/purchase/waybill_exception/count',
    downloadExcel = '/api/v1/download/create',
    QueryList = '/api/v1/purchase/purchase_list',
    QueryReturnList = '/api/v1/purchase/purchase_return_list',
    QueryReturnStatic = '/api/v1/purchase/purchase_return_count',
    QueryAddressConfig = '/api/v1/purchase/region',
    AddReturn = '/api/v1/purchase/create_purchase_return',
    CancelReturn = '/api/v1/purchase/cancel_purchase_return',
    QueryPurchaseStatic = '/api/v1/purchase/purchase_count',
    Export = '/api/v1/download/create',
    QueryPurchasePlainList = '/api/v1/purchase/plan_list',
    getPurchaseGoodsInfo = '/api/v1/purchase/purchase_info/:id',
    ApplyReturn = '/api/v1/purchase/refund',
    QueryReturnInfo = '/api/v1/purchase/refund_info',
    AddWaybill = '/api/v1/purchase/waybill',
    CreatePurchase = '/api/v1/purchase/purchase_order',
    CancelPurchaseByUser = '/api/v1/purchase/purchase_order',
    EndPurchaseByUser = '/api/v1/purchase/finish_purchase_order',
    QueryStrategyException = '/v1/strategy/waybill_exception',
    FinishPurchaseExceptionOrder = '/api/v1/purchase/finish_waybill_exception_order',
}

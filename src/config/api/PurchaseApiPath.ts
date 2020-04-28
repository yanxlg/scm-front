/**
 * 订单api地址枚举
 */
export enum PurchaseApiPath {
    getAbnormalAllList = '/api/v1/purchase/waybill_exception',
    setCorrelateWaybill = '/api/v1/purchase/correlate_waybill',
    setDiscardAbnormalOrder = '/api/v1/purchase/discard_abnormal_order',
    applyPurchaseRefund = '/api/v1/purchase/refund',
    getExceptionCount = '/api/v1/purchase/waybill_exception/count',
}

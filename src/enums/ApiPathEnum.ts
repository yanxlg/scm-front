enum ApiPathEnum {
    Login = '/api/login/login',
    GetOrderList="/api/order/list",
    FilterOrder="/api/order/filter",
    ExportOrder="/api/order/export",
    ModifyOrderInfo="/api/order/modifyPurchaseOrderInfo",
    CancelOrder="/api/order/cancelPurchaseOrder",
    ModifyMark="/api/order/modifyRemark",
    ManualCreatePurchaseOrder="/api/order/manualCreatePurchaseOrder",
    // 商品中心相关接口
    getGoodsList="/v1/goods/list",
    putGoodsPicEdit="/v1/goods/pic/edit",
    postGoodsPicUpload="/v1/goods/pic/upload",
    getGoodsOnsale="/v1/goods/onsale",
    getGoodsDelete="/v1/goods/delete",
    putGoodsEdit="/v1/goods/edits",
    getGoodsSales="/v1/goods/sales",
    getGoodsVersion="/v1/goods_version",
    
}

export { ApiPathEnum };

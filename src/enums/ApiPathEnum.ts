enum ApiPathEnum {
    Login = '/api/login/login',
    GetOrderList = '/api/order/list',
    FilterOrder = '/api/order/filter',
    ExportOrder = '/api/order/export',
    ModifyOrderInfo = '/api/order/modifyPurchaseOrderInfo',
    CancelOrder = '/api/order/cancelPurchaseOrder',
    ModifyMark = '/api/order/modifyRemark',
    ManualCreatePurchaseOrder = '/api/order/manualCreatePurchaseOrder',

    // 商品中心相关接口
    getGoodsVersionList = '/goodsVersion/list',

    // vova商品库相关接口''
    postGoodsApplyVersion = '/api/v1/goods/apply_version',

    ExportVovaGoodsVersion = '/api/v1/vova_goods/version_exports',
    ActiveVovaGoodsVersion = '/api/v1/vova_goods/apply_version',
}

export { ApiPathEnum };

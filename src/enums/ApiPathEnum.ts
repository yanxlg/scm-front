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

    getGoodsList = '/api/v1/goods/list',
    postGoodsExports = '/api/v1/goods/exports',
    putGoodsPicEdit = '/api/v1/goods/pic/edit',
    postGoodsPicUpload = '/api/v1/goods/pic/upload',
    getGoodsOnsale = '/api/v1/goods/onsale',
    getGoodsDelete = '/api/v1/goods/delete',
    putGoodsEdit = '/api/v1/goods/edits',
    getGoodsSales = '/api/v1/goods/sales',
    getCatagoryList = '/api/v1/catagory/list',
    getGoodsVersion = '/api/v1/goods/version_list',
    postGoodsVersionExport = '/api/v1/goods/version_export',
    postGoodsApplyVersion = '/api/v1/goods/apply_version',
    postGoodsIgnoreVersion = '/api/v1/goods/ignore_version',

    ExportVovaGoodsVersion = '/api/v1/vova_goods/version_exports',
    ActiveVovaGoodsVersion = '/api/v1/vova_goods/apply_version',
}

export { ApiPathEnum };

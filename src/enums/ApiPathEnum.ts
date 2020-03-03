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
    getVovaGoodsList = '/api/v1/vova_goods/list',
    getSearchConditionOptions = '/api/v1/vova_goods/catagory/list',
    getVovaChangedProperties = '/api/v1/vova_goods/changed_property',
    putVovaGoodsSales = '/api/v1/vova_goods/sales',
    postVovaGoodsListExport = '/api/v1/vova_goods/exports',

    // 任务中心相关接口
    QueryTaskList = '/api/v1/task/list',
    AddPDDHotTask = '/api/v1/task/spider/pdd_hotsale',
    AddPDDURLTask = '/api/v1/task/spider/url',
    ADDTimerUpdate = '/api/v1/task/spider/goods_update',
    DeleteTask = '/api/v1/task/delete',
    ActiveTask = '/api/v1/task/plan',
    AbortTask = '/api/v1/task/cancel',
    QueryTaskDetail = '/api/v1/task/detail',
    QueryPDDCategory = '/api/v1/spider/pdd_category',
    QueryPDDSortCondition = '/api/v1/spider/pdd_sort_type',
    QueryTaskLog = '/api/v1/task/exec_log',

    QueryGoodsVersion = '/api/v1/vova_goods/version_list',
    QueryGoodsDetail = '/api/v1/vova_goods/detail',
    EditGoodsDetail = '/api/v1/vova_goods/edits',
    ClearGoodsVersionRecord = '/api/v1/vova_goods/readed_property',

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

    // 全部订单
    getAllOrderList="/api/v1/orders/list/1",
    // 待拍单
    getPendingOrderList="/v1/orders/list/2",
    // 待支付
    getPayOrderList="/v1/orders/list/3",
    // 待发货
    getWaitShipList="/v1/orders/list/4",
    // 采购未发货
    getPurchasedNotStockList="/v1/orders/list/5",
    // 仓库未发货
    getStockNotShipList="/v1/orders/list/6",
    // 错误订单
    getErrorOrderList="/v1/orders/list/7",
    getOrderGoodsDetail="/v1/order/goods_detail"
}

export { ApiPathEnum };

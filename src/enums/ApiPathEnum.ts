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
    getGoodsVersionList="/goodsVersion/list",

    // vova商品库相关接口''
    getVovaGoodsList="/v1/vova_goods/list",
    getChangedProperties="/1/vova_goods/changed_property",

    // 任务中心相关接口
    QueryTaskList="/api/v1/task/list",
    AddPDDHotTask="/api/v1/task/spider/pdd_hotsale",
    AddPDDURLTask="/api/v1/task/spider/url",
    DeleteTask = "/api/v1/task/delete",
    QueryTaskDetail="/api/v1/task/detail",
    QueryPDDCategory = "/api/v1/spider/pdd_category",
    QueryPDDSortCondition = "/api/v1/spider/pdd_sort_type",
    QueryTaskLog="/api/v1/task/exec_log",

    QueryGoodsVersion = "/v1/vova_goods/version",
    QueryGoodsDetail="/v1/vova_goods/detail",
    EditGoodsDetail="/v1/vova_goods/edits",

    getGoodsList="/api/v1/goods/list",
    postGoodsExports="/api/v1/goods/exports",
    putGoodsPicEdit="/api/v1/goods/pic/edit",
    postGoodsPicUpload="/api/v1/goods/pic/upload",
    getGoodsOnsale="/api/v1/goods/onsale",
    getGoodsDelete="/api/v1/goods/delete",
    putGoodsEdit="/api/v1/goods/edits",
    getGoodsSales="/api/v1/goods/sales",
    getCatagoryList="/api/v1/catagory/list",
    getGoodsVersion="/api/v1/goods/version",
    postGoodsVersionExport="/api/v1/goods/version_export",

}

export { ApiPathEnum };

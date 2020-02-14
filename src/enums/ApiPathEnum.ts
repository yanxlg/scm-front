

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
    getGoodsVersionList="/goodsVersion/list",

    // vova商品库相关接口''
    getVovaGoodsList="/v1/vova_goods/list",


    // 任务中心相关接口
    QueryTaskList="/api/v1/task/list",
    AddPDDHotTask="/api/v1/task/spider/pdd_hotsale",
    AddPDDURLTask="/api/v1/task/spider/url",
    DeleteTask = "/api/v1/task/delete",
    QueryTaskDetail="/api/v1/task/detail",

    QueryGoodsVersion = "/v1/vova_goods/version",
    QueryGoodsDetail="/v1/vova_goods/detail",
    EditGoodsDetail="/v1/vova_goods/edits",
}

export { ApiPathEnum };



enum ApiPathEnum {
    Login = '/api/login/login',
    GetOrderList="/api/order/list",
    FilterOrder="/api/order/filter",
    ExportOrder="/api/order/export",
    ModifyOrderInfo="/api/order/modifyPurchaseOrderInfo",
    CancelOrder="/api/order/cancelPurchaseOrder",
    ModifyMark="/api/order/modifyRemark",
    ManualCreatePurchaseOrder="/api/order/manualCreatePurchaseOrder",





    QueryTaskList="/v1/task/list",
    AddPDDHotTask="/v1/task/spider/pdd_hotsale",
    AddPDDURLTask="/v1/task/spider/url",
    DeleteTask = "/v1/task/delete",
    QueryTaskDetail="/v1/task/detail",
}

export { ApiPathEnum };

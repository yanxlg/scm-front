/**
 * 订单api地址枚举
 */
export enum OrderApiPath {
    // 全部订单
    getAllOrderList = '/api/v1/orders/list/1',
    // 导出全部订单
    postExportAll = '/api/v1/orders/exports/1',

    // 待拍单
    getPendingOrderList = '/api/v1/orders/list/2',
    // 导出待拍单
    postExportPendingOrder = '/api/v1/orders/exports/2',

    // 待支付
    getPayOrderList = '/api/v1/orders/list/3',
    // 导出待支付
    postExportPay = '/api/v1/orders/exports/3',

    // 待发货
    getWaitShipList = '/api/v1/orders/list/4',
    // 导出待发货
    postExportWaitShip = '/api/v1/orders/exports/4',

    // 已采购未入库
    getPurchasedNotStockList = '/api/v1/orders/list/5',
    // 导出已采购未入库
    postExportPurchasedNotStock = '/api/v1/orders/exports/5',

    // 仓库未发货
    getStockNotShipList = '/api/v1/orders/list/6',
    postExportStockNotShip = '/api/v1/orders/exports/6',

    // 错误订单
    getErrorOrderList = '/api/v1/orders/list/7',
    // 导出错误订单
    postExportErrOrder = '/api/v1/orders/exports/7',

    // 一键拍单
    postOrdersPlace = '/api/v1/orders/place',
    // 取消采购单
    delPurchaseOrders = '/api/v1/orders/purchase',
    // 取消渠道订单
    delChannelOrders = '/api/v1/orders/channel',
    // 确认支付
    putConfirmPay = '/api/v1/orders/confirm_pay',
    // 获取物流轨迹
    getOrderTrack = '/api/v1/orders/track',
    // 代拍相似款
    padSimilarGood = '/api/v1/orders/similar_goods_pat',

    querySimilarInfo = '/api/v1/orders/similar_goods_info',
}

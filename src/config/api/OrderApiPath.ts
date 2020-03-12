/**
 * 订单api地址枚举
 */
export enum OrderApiPath {
    // 全部订单
    getAllOrderList = '/api/v1/orders/list/1',
    // 待拍单
    getPendingOrderList = '/api/v1/orders/list/2',
    // 待支付
    getPayOrderList = '/api/v1/orders/list/3',
    // 待发货
    getWaitShipList = '/v1/orders/list/4',
    // 采购未发货
    getPurchasedNotStockList = '/v1/orders/list/5',
    // 仓库未发货
    getStockNotShipList = '/v1/orders/list/6',
    // 错误订单
    getErrorOrderList = '/v1/orders/list/7',
    getOrderGoodsDetail = '/v1/order/goods_detail',
    // 一键拍单
    postOrdersPlace = '/api/v1/orders/place',
    // 取消渠道订单
    delChannelOrders = '/api/v1/orders/channel',
    // 确认支付
    putConfirmPay = '/api/v1/orders/confirm_pay',
}

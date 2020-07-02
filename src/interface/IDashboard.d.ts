export interface IOrderDashboardReq {
    statistics_start_time: number;
    statistics_end_time: number;
    platform: string;
    store: string;
    statistics_type: string;
}

export declare interface IPlatformItem {
    name: string;
    value: string;
    children?: IPlatformItem[];
}

export declare interface IOrderDashboardRes {
    [key: string]: any;
}

/*** 数据概览 ***/

export interface IDashboardOverviewReq {
    statistics_start_time: number;
    statistics_end_time: number;
    platform: string;
    store: string;
}

export interface IOverviewInfo {
    totalTradeAmount: string; // 累计交易额
    totalOrderNum: number; // 累计订单量
    tradeAmount: string; // 订单金额
    orderNum: number; // 订单数量
    actualGrossProfit: string; // 实际毛利
    actualGrossProfitRatio: number; // 实际毛利环比
    expectedGrossProfit: string; // 预期毛利
    expectedGrossProfitRatio: number; // 预期毛利环比
    storageBacklogCost: string; // 仓储积压成本
    storageBacklogCostRatio: number; // 仓储积压成本环比
    actualPurchaseCost: string; // 实际采购成本
    actualPurchaseCostRatio: number; // 实际采购成本环比
    saledGoodsNum: string; // 有销量商品数量
    saledGoodsNumRatio: number; // 有销量商品数量环比
    onsaleGoodsNum: string; // 在架商品数量
    onsaleGoodsNumRatio: number; // 在架商品数量环比
    pinRate: number; // 动销率
    pinRateRatio: number; // 动销率环比
}

export interface IOverviewDetailItem {
    id: string;
    statisticsDayStr: string; // 日期
    channelPlatform: string; // 销售渠道
    channelShop: string; // 销售店铺
    purchasePlatform: string; // 采购渠道
    tradeAmount: string; // 交易额
    orderNum: number; // 订单量
    actualGrossProfit: string; // 实际毛利
    actualPurchaseCost: string; // 实际采购成本
    actualLogisticsCost: string; // 实际物流成本
    expectedGrossProfit: string; // 预期毛利
    expectedPurchaseCost: string; // 预估采购成本
    expectedLogisticsCost: string; // 预估物流成本
    storageCost: string; // 仓储成本
    expectedRefundCost: string; // 预估退款成本
    otherCost: string; // 其他成本（丢件漏件、不良品）
    storageBacklogCost: string; // 仓库积压成本
    onsaleGoodsNum: number; // 在架商品数
    saledGoodsNum: number; // 有销量商品数
}

export interface IMonitorOrderReq {
    channel_source?: string;
    channel_merchant_name?: string;
    confirm_time_start: number;
    confirm_time_end: number;
}

export interface IMonitorPurchaseOrderReq {
    order_time_start: number;
    order_time_end: number;
}

export interface IMonitorOrderItem {
    cancelNumBeforeOutbound: number;
    cancelNumChannel: number;
    confirmTime: number;
    dayNum: number;
    outboundNum: number;
    totalNum: number;
}

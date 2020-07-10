import { failureReasonCode } from '@/enums/OrderEnum';

export interface IPadSimilarBody {
    platform: 'pdd';
    goods_id: string;
    sku_id: string;
    type: '1' | '2';
    origin_purchase_plan_id: string;
}

export interface IPagination {
    page?: number;
    page_count?: number;
}

export interface IPendingOrderSearch extends IPagination {
    order_goods_id?: string[];
    product_id?: string[];
    sku_id?: string[];
    channel_source?: number;
    order_time_start?: number;
    order_time_end?: number;
    product_shop?: string[];
}

export interface IPendingOrderItem {
    [key: string]: any;
}

export interface IWaitPaySearch extends IPagination {
    purchase_order_sn?: string;
    purchase_parent_order_sn?: string;
    purchase_platform?: number;
    purchase_order_stime?: number;
    purchase_order_etime?: number;
    product_shop?: string[];
}

export declare interface IWaitPayOrderItem {
    purchase_pay_url: string;
    purchase_total_amount: string;
    purchase_parent_order_sn: string;
    purchase_order_time: string;
    parent_purchase_pay_status_desc: string;
    purchase_plan_id: string;
    purchase_order_sn: string;
    purchase_order_status: string;
    purchase_order_status_desc: string;
    purchase_pay_status: string;
    purchase_pay_status_desc: string;
    order_goods_id: string;
    _rowspan?: number;
    _checked?: boolean;
    _childIds?: string[];
}

export interface IWaitShipSearch extends IPagination {
    order_goods_id?: string;
    purchase_platform_order_id_list?: string[];
    product_id?: string;
    channel_source?: number;
    order_goods_status?: number;
    purchase_order_status?: number;
    platform_order_time_start?: number;
    platform_order_time_end?: number;
    order_create_time_start?: number;
    order_create_time_end?: number;
    product_shop?: string[];
}

export interface IWaitShipOrderItem {
    platformOrderTime: string;
    purchasePlatformOrderId: string;
    purchaseAmount: string;
    orderGoodsStatus: string;
    purchaseOrderStatus: string;
    purchaseOrderShippingStatus: string;
    purchasePlanId: string;
    orderGoodsId: string;
    orderCreateTime: string;
    productId: string;
    // purchasewaybillNo: string;
    channelSource: string;
    purchasePlatform: string;
}

export interface INotWarehouseSearch extends IPagination {
    order_goods_id?: string;
    purchase_platform_order_id_list?: string[];
    product_id?: string;
    purchase_waybill_no?: string;
    channel_source?: number;
    order_goods_status?: number;
    purchase_order_status?: number;
    platform_order_time_start?: number;
    platform_order_time_end?: number;
    product_shop?: string[];
}

export interface INotWarehouseOrderItem {
    [key: string]: any;
}

export interface IWarehouseNotShipSearch extends IPagination {
    order_goods_id?: string[];
    product_id?: string[];
    purchase_waybill_no?: string[];
    channel_source?: number;
    storage_time_start?: number;
    storage_time_end?: number;
    product_shop?: string[];
}

export interface IWarehouseNotShipOrderItem {
    [key: string]: any;
}

export interface IHistorySimilar {
    productSkuStyle: string;
    commoditySkuId: string;
    productId: string;
    substituteSuccessRate: string;
}

export interface ISimilarInfoResponse {
    status: 0 | 1 | 2 | 3 | 4;
    purchaseInfo: {
        productImageUrl: string;
        productName: string;
        productId: string;
        commoditySkuId: string;
        platform: string;
        goodsId: string;
        skuId: string;
        productSkuStyle: string;
        purchaseFailCode: failureReasonCode;
        orderGoods: {
            commodityId: string;
        };
        planId: string;
        failReason: string;
    };
    originOrderInfo: {
        skuImageUrl: string;
        productId: string;
        skuId: string;
        productTitle: string;
        productOptionValue: string;
        commodityId: string;
    };
    historySimilarGoodsInfo: Array<IHistorySimilar>;
}

export interface IChannelSourceResponse {
    [key: string]: string;
}

export interface IReviewSearch extends IPagination {
    order_time_start?: number;
    order_time_end?: number;
    order_goods_id?: string[];
    product_shop?: string[];
    channel_order_goods_sn?: string;
}

export interface IReviewOrderItem {
    createTime: string;
    orderGoodsId: string;
    productImage: string;
    productStyle: string;
    goodsNumber: number;
    freight: string;
    goodsAmount: string;
    productShop: string;
    channelOrderGoodsSn: string;
    productName: string;
    productId: string;
    commodityId: string;
    threeLevelCatogryCode?: number;
}

export declare interface IPlatformItem {
    name: string;
    value: string;
    children?: IPlatformItem[];
}

export interface IPurchaseLog {
    taskTime: string;
    status: string;
    allPurchase: string;
    needPurchase: string;
    effePurchase: string;
    succPurchase: string;
    failPurchase: string;
}

interface IPurchasePlan {
    commoditySkuId: string;
    createTime: string;
    lastUpdateTime: string;
    orderGoodsId: string;
    payUrl: string;
    platformOrderTime: string;
    productPrice: string;
    purchaseAmount: string;
    purchaseFailCode: string;
    purchaseFailReason: string;
    purchaseNormalPrice: string;
    purchaseNumber: number;
    purchaseOrderPayStatus: number;
    purchaseOrderShippingStatus: number;
    purchaseOrderStatus: number;
    purchasePlanId: string;
    purchasePlatform: string;
    purchasePlatformOrderId: string;
    purchasePlatformParentOrderId: string;
    reserveStatus: number;
    taskId: string;
    cancelType: string;
}

interface IOrderItemExtend {
    commoditySkuId?: string;
    createTime?: string;
    inInventoryStatus?: number;
    orderGoodsId?: string;
    payTime?: string;
    platformOrderTime?: string;
    platformSendOrderTime?: string;
    productCatId?: string;
    productId?: string;
    productImageUrl?: string;
    productName?: string;
    productPddMerchantName?: string;
    productPrice?: string;
    productSkuStyle?: string;
    purchaseAmount?: string;
    purchaseCancelStatus?: number;
    purchaseFailCode?: string;
    purchaseFailReason?: string;
    purchaseNumber?: number;
    purchaseOrderPayStatus?: number;
    purchaseOrderShippingStatus?: number;
    purchaseOrderStatus?: number;
    purchasePlanId?: string;
    purchasePlatform?: string;
    purchasePlatformGoodsId?: string;
    purchasePlatformGoodsName?: string;
    purchasePlatformGroupId?: string;
    purchasePlatformMerchantId?: string;
    purchasePlatformOrderId?: string;
    purchasePlatformSku?: string;
    reserveStatus?: number;

    // 待支付中新增属性
    purchaseOrderTime?: string;
    purchaseParentOrderSn?: string;
    purchasePayStatusDesc?: string;
    purchasePayUrl?: string;
    purchaseTotalAmount?: string;
}

interface PayOrderPurchase {
    purchasePlanId: string;
    purchaseOrderSn: string;
    purchaseOrderStatus: number;
    purchaseOrderStatusDesc: string;
    purchasePayStatusDesc: string;
    purchasePayStatus: number;
    orderCreateTime: string;
    commodityId: string;
    productName: string;
    saleGoodsNumber: number;
    freight: string;
    saleGoodsAmount: string;
    purchaseGoodsNumber: number;
    purchaseGoodsAmount: string;
    productShop: string;
    reserveStatus: number;
    purchasePlanStatus: number;
    orderGoodsId: string;
    lastWaybillNo: string;
    createTime: string;
    lastUpdateTime: string;
    cancelType: string;
}

export interface IOrderGood {
    channelMerchantId: string;
    channelOrderGoodsSn: string;
    commodityId: string;
    createTime: string;
    freight: string;
    goodsAmount: string;
    goodsNumber: number;
    lastUpdateTime: string;
    orderAddressUpdatedStatus: number;
    orderGoodsId: string;
    orderGoodsShippingStatus: number;
    orderGoodsPurchasePlan?: Array<IPurchasePlan>;
    orderGoodsStatus: number;
    orderId: string;
    productId: string;
    productImage: string;
    productName: string;
    productPlatform: string;
    productShop: string;
    productStyle: string;
    skuId: string;
}

export interface IOrderItem extends IOrderItemExtend {
    orderGods: {
        isOfflinePurchase: 0 | 1;
        isReplaceDelivery: 0 | 1;
    };
    orderGoods: IOrderGood | IOrderGood[]; // 父订单时是数组
    orderInfo: {
        channelMerchantId: string;
        channelMerchantName: string;
        channelOrderSn: string;
        channelSource: string;
        confirmTime: string;
        createTime: string;
        currency: string;
        freight: string;
        lastUpdateTime: string;
        orderAddress: {
            orderId: string;
            consignee: string;
            country: string;
            province: string;
            tel: string;
            zipCode: string;
        };
        orderAmount: string;
        orderId: string;
        orderStatus: number;
        orderTime: string;
    };

    // 待支付
    unpaidPurchaseOrderGoodsResult?: Array<PayOrderPurchase>;
}

export type IFlatOrderItem = IOrderItem['orderGods'] &
    Partial<IOrderGood> &
    Partial<IOrderItem['orderInfo']> &
    Partial<IPurchasePlan> &
    Partial<PayOrderPurchase> &
    IOrderItemExtend;

export type CombineRowItem = {
    __rowspan: number;
    __key?: any;
};

export declare interface ISkuStyle {
    [key: string]: string;
}

export declare interface IGoodsDetail {
    product_id: string;
    goods_img: string;
    title: string;
    sku_style?: ISkuStyle[];
    sku_sn?: string;
    sku_img?: string;
    commodity_sku_id?: string;
}

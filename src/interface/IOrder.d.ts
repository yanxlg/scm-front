import { failureReasonCode } from '@/enums/OrderEnum';

export interface IPadSimilarBody {
    platform: 'pdd';
    goods_id: string;
    sku_id: string;
    type: '1' | '2';
    order_goods_id: string;
    origin_purchase_plan_id: string;
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
    };
    originOrderInfo: {
        skuImageUrl: string;
        productId: string;
        skuId: string;
        productTitle: string;
        productOptionValue: string;
    };
    historySimilarGoodsInfo: Array<IHistorySimilar>;
}

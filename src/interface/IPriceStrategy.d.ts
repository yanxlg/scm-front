import { EditEnum } from '@/enums/PriceStrategyEnum';
import { IRequestPagination1 } from './IGlobal';

export type IEdiyKey = EditEnum.DEFAULT | EditEnum.ADD | EditEnum.UPDATE;

export type ISalePriceListReq = {
    enable_source?: string;
    enable_platform?: string;
    enable_merchant?: string;
    product_tags?: string;
    min_origin_price?: number;
    max_origin_price?: number;
} & IRequestPagination1;

export interface ISellItem {
    rule_name: string;
    enable_source: string;
    enable_platform: string;
    enable_merchant: string;
    product_tags: string;
    min_origin_price: string;
    max_origin_price: string;
    param_price_multiply: string;
    param_price_add: string;
    param_shipping_fee_multiply: string;
    effect_count: string;
    order: string;
    is_enable: string;
    id: string;
    shipping_fee_rules: string;
}

export interface ISaveSalePriceRuleReq {
    rule_id?: string;
    rule_name?: string;
    action?: 'new' | 'update';
    enable_source: string;
    enable_platform: string;
    enable_merchant: string;
    product_tags: string;
    min_origin_price: string;
    max_origin_price: string;
    order: string;
    param_price_multiply: string;
    param_price_add: string;
    param_shipping_fee_multiply: string;
    is_enable: '1' | '0'; // 1-启用，0-禁用
    comment: string;
}

export interface IWeightConfigItem {
    min_weight: number;
    max_weight: number;
    param_add: number;
    param_devide: number;
    param_multiply: number;
}

export type IShippingFeeRuleReq = {
    card_name?: string;
} & IRequestPagination1;

export type IShippingFeeRuleRes = {
    id: string;
    rule_name: string;
    product_tags: string;
    min_weight: string;
    max_weight: string;
    lower_shipping_card: string;
    upper_shipping_card: string;
    support_country_count: number;
    support_country: string[];
    order: number;
    product_count: number;
    is_enable: number;
};

export type ISaveShippingFeeRuleReq = {
    action?: string;
    product_tags: string;
    min_weight: string;
    max_weight: string;
    order: number;
    comment: string;
    lower_shipping_card: string;
    upper_shipping_card: string;
    is_enable: string;
    rule_id?: number;
    rule_name?: string;
};

export type IShippingCardListReq = {
    card_name?: string;
    country_code?: string;
} & IRequestPagination1;

export type IShippingCardListRes = {
    card_name: string;
    country_code: string;
    WeightConfig: IWeightConfigItem[];
};

export type IStartStrategyUpdateReq = {
    first_cat: string;
    second_cat: string;
    third_cat: string;
    enable_platform: string;
    enable_merchant: string;
    // shipping_fee_country: string;
    // type: string;
    product_tags?: string;
    min_origin_price?: string;
    max_origin_price?: string;
};

export type ICatagoryWeightListReq = {
    first_category?: string;
    second_category?: string;
    third_category?: string;
} & IRequestPagination1;

export type ICatagoryWeightListRes = {
    firstCategoryName: string;
    secondCategoryName: string;
    thirdCategoryName: string;
    thirdCategoryId: number;
    estimateWeight: string;
    avgWeight: string;
};

export type ICatagoryWeightLogReq = {
    third_category_id: string;
} & IRequestPagination1;

export type ICatagoryWeightLogRes = {
    operateContent: string;
    operatePeople: string;
    createTime: string;
};

export type IUpdateRecoreItem = {
    operate_info: string;
    operator: string;
    operate_time: string;
};

export type ISaleAndShippingOperateReq = {
    log_type: 'shipping_fee' | 'sale_price';
    rule_id: string;
};

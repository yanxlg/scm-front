import { EditEnum } from '@/enums/PriceStrategyEnum';
import { IRequestPagination1 } from './IGlobal';

export type IEdiyKey = EditEnum.DEFAULT | EditEnum.ADD | EditEnum.UPDATE;

export interface ISellItem {
    [key: string]: any;
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
    id: number;
    product_tags: string;
    min_weight: number;
    max_weight: number;
    lower_shipping_card: string;
    upper_shipping_card: string;
    support_country_count: number;
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
    rule_id?: number;
    rule_name?: string;
    enable: string;
};

export type IShippingCardListReq = {
    card_name?: string;
    country_code?: string;
} & IRequestPagination1;

export type IShippingCardListRes = {
    card_name: string;
    country_code: string;
    weight_config: IWeightConfigItem[];
};

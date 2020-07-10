import { RequestPagination, IRequestPagination } from '@/interface/IGlobal';
import React from 'react';

export type ICustomListQuery = {
    one_cat_id?: string;
    two_cat_id?: string;
    three_cat_id?: string;
    country_code?: string;
} & RequestPagination;

export declare interface ICustomItem {
    one_cat_id?: string;
    two_cat_id?: string;
    three_cat_id?: string;
    one_cat_name?: string;
    two_cat_name?: string;
    three_cat_name?: string;
    weight?: string;
    country_name?: string;
    country_code?: string;
    customs_code?: string;
    length?: string;
    width?: string;
    height?: string;
    is_electricity?: boolean;
    is_metal?: boolean;
    is_liquid?: boolean;
    is_combustible?: boolean;
    is_powder?: boolean;
    is_battery?: boolean;
    is_perfume?: boolean;
    is_food?: boolean;
    is_paste?: boolean;
    oneCatName?: string;
    oneCatId?: string;
    twoCatId?: string;
    twoCatName?: string;
    threeCatId?: string;
    threeCatName?: string;
    customsCode?: string;
    countryName?: string;
    isElectricity?: boolean;
    isMetal?: boolean;
    isLiquid?: boolean;
    isCombustible?: boolean;
    isPowder?: boolean;
    isBattery?: boolean;
    isPerfume?: boolean;
    isFood?: boolean;
    isPaste?: boolean;
}

export declare interface ICountryItem {
    code: string;
    name: string;
}

export declare interface IAttrItem {
    key: string;
    name: string;
    description: string;
}

export interface ICookieItem {
    account_id: string;
    phone: string;
    cookie: string;
    status: number;
}

export interface ICookieResponse {
    list: ICookieItem[];
}

export interface ICookieBody {
    account_id: string;
    cookie: string;
}

export interface IFileItem {
    id: string;
    object_url: string;
    filename: string;
    module: string;
    status: string;
    params: string;
    fields: string;
    percent: string;
    username: string;
    create_time: string;
    last_update_time: string;
    filesize: string;
}

export interface IPriceStrategy {
    first_purchase_crawler_price_condition: number;
    first_sale_crawler_price_value: number;
    first_fix_price_value: number;
    middle_condition: number;
    second_purchase_crawler_price_condition: number;
    second_sale_crawler_price_value: number;
    second_fix_price_value: number;
}

export interface IPriceStrategyItem {
    before_strategy_content: {
        first_purchase_crawler_price_condition: number;
        first_sale_crawler_price_value: number;
        first_fix_price_value: number;
        middle_condition: number;
        second_purchase_crawler_price_condition: number;
        second_sale_crawler_price_value: number;
        second_fix_price_value: number;
    };
    end_strategy_content: {
        first_purchase_crawler_price_condition: number;
        first_sale_crawler_price_value: number;
        first_fix_price_value: number;
        middle_condition: number;
        second_purchase_crawler_price_condition: number;
        second_sale_crawler_price_value: number;
        second_fix_price_value: number;
    };
    strategy_type: '1';
    operator: string;
    updated_time: string;
}

export type IOfflinePurchaseQuery = {
    commodity_ids?: string;
    commodity_sku_ids?: string;
} & IRequestPagination;

export interface IOfflinePurchaseReqData {
    commodity_id: string;
    commodity_sku_id: string;
}

export interface IOfflinePurchaseItem {
    id: string;
    commodity_id: string;
    commodity_sku_id: string;
}

export interface IOfflinePurchaseDetail {
    commodity_id: string;
    commodity_sku_id: string;
    variant_image: string;
    goods_name: string;
    sku_style: string;
    sku_inventory: string;
}

export interface IReplaceBody {
    sale_commodity_ids?: string;
    sale_commodity_sku_ids?: string;
    outbound_commodity_ids?: string;
    outbound_commodity_sku_ids?: string;
}

export interface IReplaceStoreOutItem {
    id: string;
    sale_commodity_id?: string;
    sale_commodity_sku_id?: string;
    outbound_commodity_id?: string;
    outbound_commodity_sku_id?: string;
    outbound_score?: string;
}

export interface ReplaceItem {
    sale: {
        commodity_id: string;
        commodity_sku_id: string;
        variant_image: string;
        goods_name: string;
        sku_style: string;
        sku_inventory: string;
    };
    outbound: {
        commodity_id: string;
        commodity_sku_id: string;
        variant_image: string;
        goods_name: string;
        sku_style: string;
        sku_inventory: string;
    };
}

export interface IGetStoreBlacklistReq {
    purchase_channel: string;
    merchant_id?: string[];
}

export interface IStoreBlacklistItem {
    merchant_id: string;
    purchase_channel: string;
    operator: string;
    created_time: string;
    black_store_reason: string;
}

export interface ISaveBlackStoreReq {
    purchase_channel: string;
    merchant_id: string[];
    black_store_reason: string;
}

export interface IDeleteBlackStoreReq {
    purchase_channel: string;
    merchant_id: string[];
}

export interface IGetOrderConfigListReq {
    first_cat_id?: string;
    second_cat_id?: string;
    third_cat_id?: string;
}

export interface IOrderConfigItem {
    id: string;
    first_cat_id: string;
    second_cat_id: string;
    third_cat_id: string;
    status: string;
    create_time: string;
    last_update_time: string;
    operator: string;
    remark: string;
}

export interface IAddOrderConfigReq {
    first_cat_id: string;
    second_cat_id?: string;
    third_cat_id?: string;
    remark?: string;
}

export interface IAccount {
    id: string;
    username: string;
    real_name: string;
    create_user: string;
    create_time: string;
    status: '1' | '2';
    roles: string[];
}

export interface IPermissionItem {
    data: {
        id: string;
        name: string;
        pid: string;
    };
    children: Array<IPermissionItem>;
}

export interface IPermissionTree {
    title: string;
    key: string;
    children: IPermissionTree[];
}

export interface IRole {
    create_time: string;
    create_user: string;
    description: string;
    id: string;
    name: string;
    status: '1' | '2';
    users: string[];
}

export interface IAccountDetail {
    create_time: string;
    create_user: string;
    id: string;
    real_name: string;
    role_ids: string[];
    status: '1' | '2';
    username: string;
}

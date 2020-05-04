import { RequestPagination } from '@/interface/IGlobal';

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

export declare interface IPublishInterceptItem {
    name: string;
    checked: boolean;
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
    purchase_crawler_price_condition: string; // 1---<，2---=，3--->，4---<=，5--->=
    sale_crawler_price_value: string;
    middle_condition: string; //1且，2或
    purchase_minus_sale_crawler_price_condition: string; // 1---<，2---=，3--->，4---<=，5--->=
    fix_price_value: string;
}

export interface IPriceStrategyItem {
    before_strategy_content: {
        purchase_crawler_price_condition: number;
        sale_crawler_price_value: number;
        middle_condition: number;
        purchase_minus_sale_crawler_price_condition: number;
        fix_price_value: number;
    };
    end_strategy_content: {
        purchase_crawler_price_condition: number;
        sale_crawler_price_value: number;
        middle_condition: number;
        purchase_minus_sale_crawler_price_condition: number;
        fix_price_value: number;
    };
    strategy_type: '1';
    operator: string;
    updated_time: string;
}

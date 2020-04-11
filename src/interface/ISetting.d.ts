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

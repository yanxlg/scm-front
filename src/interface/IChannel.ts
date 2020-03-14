/**
 * 渠道商品库接口
 */
import { ProductStatusCode } from '@/config/dictionaries/Product';
import { IBoolean } from './IGlobal';

export type IChannelProductListBody = {
    onshelf_time_start?: number;
    onshelf_time_end?: number;
    commodity_id?: string;
    vova_virtual_id?: string;
    product_id?: string;
    level_one_category?: string;
    level_two_category?: string;
    sales_volume?: number;
    shop_name?: string;
    product_status?: string;
};

export interface IChannelProductListItem {
    shop_name: string;
    virtual_id: string;
    main_image: string;
    commodity_id: string;
    product_id: string;
    sales_volume: number;
    evaluate_volume: number;
    average_score: number;
    level_one_category: string;
    level_two_category: string;
    product_status: ProductStatusCode; // 字典表
    shipping_refund_rate: number;
    non_shipping_refund_rate: number;
    vova_product_link: string;
    sku_count: number;
}

export interface IChannelProductListResponse {
    total: number;
    list: IChannelProductListItem[];
}

export declare interface IChannelCategoryItem {
    platform_cate_id: number;
    platform_cate_name: string;
    children?: IChannelCategoryItem[];
}

export type IChannelCategoryResponse = IChannelCategoryItem[];

export declare interface IChannelChangedProperty {
    property: string;
    count: number;
}
export interface IChannelChangedPropertiesResponse {
    changed_property_list: IChannelChangedProperty[];
}

export type IChannelShelveStateBody =
    | {
          type: 'onsale';
          info: {
              onsale: {
                  task_body: {
                      product_id: string;
                      commodity_id: string;
                      sale_domain: string;
                  };
              };
          };
      }
    | {
          type: 'offsale';
          info: {
              offsale: {
                  task_body: {
                      product_id: string;
                      commodity_id: string;
                      sale_domain: string;
                  };
              };
          };
      };

export interface IChannelProductVersionQuery {
    start_time?: number;
    end_time?: number;
    virtual_id?: string;
}

export declare interface IChannelProductVersion {
    vova_virtual_id: number;
    product_id: number;
    commodity_id: number;
    sku_info: ISku[];
    product_main_pic: string;
    lower_shelf: IBoolean;
    upper_shelf: IBoolean;
    goods_title: string;
    product_description: string;
    sku_pics_volume: number;
    apply_time: number;
    push_time: number;
    operationer: string;
    operation_time: number;
    is_version_applied: IBoolean;
}

export type IChannelProductVersionResponse = IChannelProductVersion[];

export interface IChannelProductDetailQuery {
    product_id: string;
    channel?: string;
}

export interface ISku {
    sku_price?: string;
    sku_inventory?: string;
    sku_style?: string;

    // 另一个接口字段？？重复？？
    sku_name?: string;
    sku_image?: string;
    specs?: Array<{
        name: string;
        value: string;
    }>;
    price?: string;
    shipping_fee?: string;
    storage?: string;

    // 另一个接口字段？？重复？？
    sku?: string;
    shop_price?: number;
}

export interface IChannelProductDetailResponse {
    product_id: string;
    product_name: string;
    main_image: string;
    product_description: string;
    commodity_id: string;
    category_level_1?: string;
    category_level_2?: string;
    category_level_3?: string;
    spider_product_id: string;
    sku_list?: ISku[];
}

export declare interface ISkuBody {
    sku: string;
    shop_price: number;
    shipping_fee: number;
    storage: number;
}

export interface IEditChannelProductDetailBody {
    product_id: string;
    sku_list: ISkuBody[];
}

export type IActiveChannelProductVersionBody = Array<{
    virtual_id: number;
    product_id: number;
}>;

export interface IRegionShippingFeeBody {
    product_id: string;
    page?: number;
    page_count?: number;
}

export interface IRegionShippingFeeItem {
    country: string;
    country_code: string;
    country_name: string;
    fee: number;
    weight: number;
}

export interface IRegionShippingFeeResponse {
    total: number;
    page: string;
    fee: IRegionShippingFeeItem[];
}

export interface IGoodsDetailBody {
    product_id: string;
    channel: string;
}

export interface IGoodsDetailResponse {
    product_name: string;
    product_description: string;
    main_image: string;
    product_id: string;
    commodity_id: string;
    spider_product_id: string;
    category_level_1: string;
    category_level_2: string;
    category_level_3: string;
}

export interface IGoodsSkuBody {
    product_id: string;
    channel: string;
    page: number;
    page_count: number;
}

export interface ISpecsItem {
    name: string;
    value: string;
}

export interface IGoodsSkuItem {
    sku_name: string;
    sku_image: string;
    price: string;
    shipping_fee: string;
    storage: string;
    specs: ISpecsItem[];
    adjust_price: string;
    adjust_reason: string;
    serial?: number;
}

export interface IGoodsSkuResponse {
    total: string;
    sku_list: IGoodsSkuItem[];
}

export interface IEditSkuItem {
    sku: string;
    adjustment_price: string;
    adjustment_reason: string;
}

export interface IEditSkuBody {
    sku_list: IEditSkuItem[];
}

export interface IEditSkuResponse {
    execute_status: string;
}

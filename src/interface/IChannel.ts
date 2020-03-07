/**
 * 渠道商品库接口
 */
import { IRequestPagination1 } from '@/interface/IGlobal';
import { ProductStatusCode } from '@/config/dictionaries/Product';

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
} & IRequestPagination1;

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
    id: number;
    name: string;
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

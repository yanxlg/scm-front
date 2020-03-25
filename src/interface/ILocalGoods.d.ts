/**
 * 本地商品库接口
 */
export interface ICatagoryItem {
    id?: string;
    name?: string;
}

export interface IOnsaleItem {
    onsale_channel: string;
    onsale_time: number;
    status_label: string;
}

export interface ISkuStyleItem {
    option: string;
    value: string;
}

export interface ISkuItem {
    is_default?: number;
    sku_img?: string;
    sku_inventory?: string;
    sku_price?: string;
    sku_sn?: string;
    sku_style?: ISkuStyleItem[];
    sku_weight?: string;
}

export interface IGoodsListQuery {
    task_number?: string[]; // 任务 id
    store_id?: string[]; // 店铺 ID
    commodity_id?: number[]; // Commodity_ID
    inventory_status?: number; // 库存
    version_status?: number; // 版本更新
    first_catagory?: number; // 一级类目
    second_catagory?: number; // 二级类目
    third_catagory?: number; // 三级类目
    min_sale?: number; // 销量最小
    max_sale?: number; // 销量最大值
    min_sku?: number; // sku数量最小值
    max_sku?: number; // sku最大值
    min_price?: number; // 价格范围最小值
    max_price?: number; // 价格范围最大值
    min_comment?: number; // 评论数量最小值
    product_status?: string; // 版本状态
}

export interface IGoodsList {
    brand: string;
    comments: number;
    commodity_id: string;
    create_time: number;
    description: string;
    first_catagory: ICatagoryItem; // | [],
    second_catagory: ICatagoryItem; // | [],
    third_catagory: ICatagoryItem; // | [],
    goods_img: string;
    goods_status: string;
    hasnew_version: number;
    inventory_status: number;
    onsale_info: IOnsaleItem[];
    product_id: string;
    product_sn: string;
    sales_volume: number;
    sku_image: string[];
    sku_number: number;
    store_id: string;
    store_name: string;
    title: string;
    update_time: number;
    worm_goods_id: string;
    worm_goodsinfo_link: string;
    worm_task_id: string;
    sku_info: ISkuItem[];
    price_min: number;
    price_max: number;
    shipping_fee_min: number;
    shipping_fee_max: number;

}

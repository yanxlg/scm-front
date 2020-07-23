/**
 * 本地商品库接口
 */
export interface ISearchPageParams {
    page?: number;
    page_count?: number;
}

export interface ICatagoryItem {
    id?: string;
    name?: string;
    children?: ICatagoryItem[];
}

// 上架信息
export interface IPublishItem {
    createTime: string;
    lastUpdateTime: string;
    productId: string;
    publishChannel: string;
    publishStatus: number;
    publishStore: string;
    serialNum?: number;
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
    sku_style?: any[];
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
    publish_status: IPublishItem[];
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
    tags: string[];
    multiple_price: string;
    source_channel: string;
    _type?: string;
    origin?: string;
    is_sell_out?: string;
    is_presale?: string;
    is_oversea?: string;
    is_not_mergepay?: string;
    is_blacklist_shop?: string;
}

export type IGoodsAndSkuItem = IGoodsList & ISkuItem;

/*** 商品版本 ***/

export interface IOnsaleItem {
    onsale_channel: string;
    onsale_time: number;
}

export interface IGoodsVersionSkuItem {
    origin_sku_id?: string;
    sku_id?: string;
    sku_inventory?: string;
    sku_price?: string;
    sku_style?: any[];
    sku_weight?: string;
}

export interface IGoodsVersionItem {
    comments: string;
    description: string;
    goods_img: string;
    goods_status: string;
    inventory_status: number;
    onsale_info: IOnsaleItem[];
    product_id: string;
    sales_volume: string;
    sku_image: string[];
    sku_info: IGoodsVersionSkuItem[];
    sku_number: number;
    store_id: string;
    store_name: string;
    tags: string[];
    first_catagory: ICatagoryItem;
    second_catagory: ICatagoryItem;
    third_catagory: ICatagoryItem;
    title: string;
    update_time: number;
    worm_goods_id: string;
    worm_goodsinfo_link: string;
    worm_task_id: string;
    price_min: string;
    price_max: string;
    shipping_fee_min: string;
    shipping_fee_max: string;
    commodity_id?: string;
    _update_time?: string;
    source_channel: string;
}

export type IGoodsVersionAndSkuItem = IGoodsVersionItem & IGoodsVersionSkuItem;

export interface IGoodsVersionInfo {
    title: string;
    product_id: string;
    goods_img: string;
    first_catagory: ICatagoryItem;
    second_catagory: ICatagoryItem;
    third_catagory: ICatagoryItem;
    worm_goodsinfo_link: string;
    worm_goods_id: string;
    _update_time: string;
}

export interface IGoodsEditItem {
    product_id: string;
    title: string;
    description: string;
    first_catagory: ICatagoryItem;
    second_catagory: ICatagoryItem;
    third_catagory: ICatagoryItem;
    goods_img: string;
    sku_image: string[];
}

export interface IGoodsLockItem {
    image_is_lock?: boolean;
    description_is_lock?: boolean;
    title_is_lock?: boolean;
    sku_is_lock?: boolean;
    category_is_lock?: boolean;
    price_threshold?: number;
}

export interface ISkuInfo {
    tags: string[];
    commodity_id: string;
    product_id: string;
    goods_img: string;
    title: string;
    worm_goodsinfo_link: string;
    worm_goods_id: string;
    first_catagory: ICatagoryItem;
    second_catagory: ICatagoryItem;
    third_catagory: ICatagoryItem;
}

export interface ICurrentGoodsItem {
    [key: string]: any;
}

export interface IGood {
    commodityId: string;
    commoditySkuId: string;
    price: string;
    productId: string;
    productTitle: string;
    quantity: string;
    shippingFee: string;
    sku: string;
    skuImage: {
        url: string;
    };
    tags: string[];
    topCatId: string;
    variantId: string;
    weight: string;
    productOptionValue: Array<{
        option: { text: string };
        value: {
            text: string;
        };
    }>;
}

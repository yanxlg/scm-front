export interface IQueryGoodsSelectionListReq {
    merchant_id?: string;
    cat_id?: string;
    commodity_id?: string;
    start_date?: number;
    end_date?: number;
    product_tag?: string;
    lower_price?: number;
    upper_price?: number;
    lower_order?: number;
    upper_order?: number;
    model_type?: string;
    page?: number;
    limit?: number;
}

export interface ISelectionGoodsItem {
    comment_number: number;
    commodity_id: string;
    is_vova_old: number;
    last_7day_sale_order: number;
    last_day_sale_order: number;
    last_price_change_day: string;
    lat_day_sale_order_change: number;
    lower_profit: string;
    main_image: string;
    merchant_id: string;
    model: string;
    product_link: string;
    product_tag: string[];
    sale_number: number;
    sale_price: string;
    sale_price_change: number;
    title: string;
    total_sale_order: string;
    upper_profit: string;
    is_on_sale: number;
    origin_price: string;
    sale_platform_commodity_id: string;
}

export interface IGoodsDateItem {
    date: string;
    profit: string;
    sale_order: string;
    sale_price: string;
}

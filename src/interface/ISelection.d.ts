export interface IQueryGoodsSelectionListReq {
    merchant_id: string;
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
    // commodity_id: string;
    // merchant_id: string;
    // model: string;
}

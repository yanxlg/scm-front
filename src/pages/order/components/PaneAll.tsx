export declare interface ISkuStyle {
    [key: string]: string;
}

export declare interface IGoodsDetail {
    product_id: string;
    goods_img: string;
    title: string;
    sku_style?: ISkuStyle[];
    sku_sn?: string;
    sku_img?: string;
    commodity_sku_id?: string;
}

export declare interface IChildOrderItem {
    [key: string]: any;
}

export declare interface IParentOrderItem {
    [key: string]: any;
}

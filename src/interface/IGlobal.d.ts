export interface IRequestPagination1 {
    page: number;
    page_count: number;
}

export interface IRequestPagination2 {
    page: number;
    page_number: number;
}
export type IRequestPagination = IRequestPagination1 | IRequestPagination2;

export type RequestPagination = {
    pageNumber: number;
    pageSize: number;
};

export interface IResponse<T> {
    code: number;
    message: string;
    data: T;
}

export type IPaginationResponse<T> = {
    total?: number;
    all_count?: number;
    list: T[];
    [key: string]: any;
};

export type IBoolean = 0 | 1;

export interface IShopItem {
    merchant_id: string;
    merchant_name: string;
    merchant_platform: string;
}

export type ISHopList = IShopItem[];

export declare interface ICheckedBtnItem {
    name: string;
    checked: boolean;
    originChecked?: boolean;
    type?: 0 | 1 | 2;
}

export interface IExportExcelReqData {
    module: number;
    query: any;
    fields: string[];
    type?: number;
    filename?: string;
}

export interface IOnsaleInterceptStoreRes {
    purchase_channel: string;
    support_merchant_id: string[];
}

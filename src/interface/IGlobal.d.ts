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

export interface IPaginationResponse<T> {
    total: number;
    list: T[];
    [key: string]: any;
}

export type IBoolean = 0 | 1;

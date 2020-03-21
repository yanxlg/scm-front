export interface IRequestPagination1 {
    page: number;
    page_count: number;
}

export interface IRequestPagination2 {
    page: number;
    page_number: number;
}
export type IRequestPagination = IRequestPagination1 | IRequestPagination2;

export interface IResponse<T> {
    code: number;
    message: string;
    data: T;
}

export interface IPaginationResponse1<T> {
    all_count: number;
    list: T;
}

export type IPaginationResponse<T> = IPaginationResponse1<T>;

export type IBoolean = 0 | 1;

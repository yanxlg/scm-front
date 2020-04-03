// import { IRequestPagination1 } from './IGlobal';

export type ITagStatus = 'ENABLED' | 'DISABLED';

export declare interface IGetTagsListRequest {
    page?: number;
    page_count?: number;
    is_active?: ITagStatus;
}

export declare interface ITagItem {
    name: string;
    tagId: string;
    isActive: ITagStatus;
    _loading?: boolean;
}

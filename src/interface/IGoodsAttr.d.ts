// import { IRequestPagination1 } from './IGlobal';

export type ITagStatus = 'ENABLED' | 'DISABLED';

export type ITagOpsType = 'add' | 'edit' | 'delete'; // | 'add-delete';

export declare interface IGetTagsListRequest {
    page?: number;
    page_count?: number;
    is_active?: ITagStatus;
}

export declare interface ITagItem {
    name: string;
    tagId?: string;
    keyWords?: string;
    isActive?: string;
    type?: ITagOpsType;
    page?: number;
}

import { RequestPagination } from '@/interface/IGlobal';

export type ICustomDeclarationListQuery = {
    category_level_one?: string;
    category_level_two?: string;
    category_level_three?: string;
} & RequestPagination;

export declare interface ICustomDeclarationListItem {
    category_level_one: string;
    category_level_two: string;
    category_level_three: string;
    weight: string;
    country: string;
    customs_code: string;
    length: string;
    width: string;
    height: string;
    is_electricity: string;
    is_metal: string;
    is_fluid: string;
    is_burn: string;
    is_powder: string;
    is_pure_electric: string;
    is_perfume: string;
    is_food: string;
    is_paste: string;
}

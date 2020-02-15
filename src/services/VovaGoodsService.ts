import request from '@/utils/request';
import { ApiPathEnum } from '@/enums/ApiPathEnum';

export declare interface IFilterParams {
    page: number;
    page_count: number;
    onshelf_time_satrt: number;
    onshelf_time_end: number;
    commodity_id: string;          // commodity_id
    vova_virtual_id: string;       // 虚拟 ID
    product_id: string;            // product_id
    level_one_category: string;    // 一级类目
    level_two_category: string;    // 二级类目
    sales_volume: number;          // 销量
    shop_name: string;             // 店铺名称
    product_status: string;        //上架状态
}


export async function getVovaGoodsList(params: IFilterParams) {
    return request.post(ApiPathEnum.getVovaGoodsList, {
        params: params
    });
}

export async function getChangedProperties() {
    return request.get(ApiPathEnum.getChangedProperties);
}

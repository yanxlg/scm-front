import request from '@/utils/request';
import { ApiPathEnum } from '@/enums/ApiPathEnum';

export declare interface IFilterParams {
    page: number;
    page_count: number;
    task_number?: string;                // 任务 id
    store_id?: string;                   // 店铺 ID
    commodity_id?: string;               // Commodity_ID
    inventory_status?: string;           // 库存
    version_status?: string;             // 版本更新
    first_catagory?: string;             // 一级类目
    second_catagory?: string;            // 二级类目
    third_catagory?: string;             // 三级类目
    min_sale?: number | undefined;       // 销量最小
    max_sale?: number | undefined;       // 销量最大值
    min_sku?: number | undefined;        // sku数量最小值
    max_sku?: number | undefined;        // sku最大值
    min_price?: number | undefined;      // 价格范围最小值
    max_price?: number | undefined;      // 价格范围最大值
    min_comment?: number | undefined;    // 评论数量最小值
}

declare interface IImgEditData {
    pic: string[];
}

declare interface IOnsaleParams {
    scm_goods_id: string[];
}

declare interface IGoodsDeleteParams {
    product_ids: string[];
}

declare interface IGoodsEditData {
    product_id: string;
    title?: string;
    description?: string;
}

declare interface IGoodsSalesParams {
    product_id: string;
}

declare interface IGoodsVersionParams {
    start_time: string;
    end_time: string;
    commodity_id: number;
}

export async function getGoodsList(params: IFilterParams) {
    return request.get(ApiPathEnum.getGoodsList, {
        // requestType: 'form',
        params: params
    });
}

export async function putGoodsPicEdit(data: IImgEditData) {
    return request.put(ApiPathEnum.putGoodsPicEdit, {
        requestType: 'form',
        data
    })
}

// formData
export async function postGoodsPicUpload(data: any) {
    return request.post(ApiPathEnum.postGoodsPicUpload, {
        data
    })
}

// 一键上架
export async function getGoodsOnsale(params: IOnsaleParams) {
    return request.get(ApiPathEnum.getGoodsOnsale, {
        params
    })
}

// 删除
export async function getGoodsDelete(params: IGoodsDeleteParams) {
    return request.get(ApiPathEnum.getGoodsDelete, {
        params
    })
}

// 商品编辑
export async function putGoodsEdit(data: IGoodsEditData) {
    return request.put(ApiPathEnum.putGoodsEdit, {
        data
    })
}

// 查询商品上架信息
export async function getGoodsSales(params: IGoodsSalesParams) {
    return request.get(ApiPathEnum.getGoodsSales, {
        params
    })
}

// 
export async function getGoodsVersion(params: IGoodsVersionParams) {
    return request.get(ApiPathEnum.getGoodsVersion, {
        params: params
    });
}

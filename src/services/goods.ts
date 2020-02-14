import request from '@/utils/request';
import { ApiPathEnum } from '@/enums/ApiPathEnum';

declare interface IFilterParams {
    page: number;
    page_count: number;
    task_number?: string;       // 任务 id
    store_id?: string;          // 店铺 ID
    scm_goods_sn?: string;      // 中台商品 SN
    first_catagory?: string;    // 一级类目
    second_catagory?: string;   // 二级类目
    sale_status?: string;       // 上架状态
    min_sale?: number;          // 销量最小
    max_sale?: number;          // 销量最大值
    min_inventory?: number;     // 库存最小值
    max_inventory?: number;     // 库存最大值
    min_sku?: number;           // sku数量最小值
    max_sku?: number;           // sku最大值
    min_price?: number;         // 价格范围最小值
    max_price?: number;         // 价格范围最大值
    min_comment?: number;       // 评论数量最小值
}

declare interface IImgEditData {
    pic: string[];
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

export async function getGoodsVersionList(params: IFilterParams) {
    return request.get(ApiPathEnum.getGoodsVersionList, {
        requestType: 'form',
        params: params
    });
}

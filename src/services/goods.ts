import request from '@/utils/request';
import { LocalApiPath } from '@/config/api/LocalApiPath';

export declare interface IFilterParams {
    page?: number;
    page_count?: number;
    task_number?: string[]; // 任务 id
    store_id?: string[]; // 店铺 ID
    commodity_id?: number[]; // Commodity_ID
    inventory_status?: number | undefined; // 库存
    version_status?: number | undefined; // 版本更新
    first_catagory?: number | undefined; // 一级类目
    second_catagory?: number | undefined; // 二级类目
    third_catagory?: number | undefined; // 三级类目
    min_sale?: number | undefined; // 销量最小
    max_sale?: number | undefined; // 销量最大值
    min_sku?: number | undefined; // sku数量最小值
    max_sku?: number | undefined; // sku最大值
    min_price?: number | undefined; // 价格范围最小值
    max_price?: number | undefined; // 价格范围最大值
    min_comment?: number | undefined; // 评论数量最小值
    product_status?: string | undefined; // 版本状态
}

declare interface IImgEditData {
    pic_url: string[];
    product_id: string;
}

declare interface IOnsaleData {
    scm_goods_id: string[];
}

declare interface IGoodsDeleteData {
    commodity_ids: string[];
}

declare interface IProductId {
    product_id: string;
}

declare interface IGoodsVersionParams {
    page: number;
    page_count: number;
    start_time?: number | undefined;
    end_time?: number | undefined;
    commodity_id: string;
    product_status?: number[];
}

export declare interface IGoodsEditImgItem {
    type: 'new' | 'old';
    is_default?: 0 | 1;
    url: string;
    position?: number;
    alt?: string;
    width?: number;
    height?: number;
}

export declare interface IGoodsEditData {
    product_id: string;
    title: string;
    description: string;
    cat_id: number;
    imgs: IGoodsEditImgItem[];
}

declare interface ISkuParams {
    page: number;
    page_count: number;
    product_id: string;
}

export async function getGoodsList(params: IFilterParams) {
    return request.post(LocalApiPath.getGoodsList, {
        // requestType: 'form',
        data: params,
    });
}

export async function postGoodsExports(data: IFilterParams) {
    return request
        .post(LocalApiPath.postGoodsExports, {
            // requestType: 'form',
            data,
            responseType: 'blob',
            parseResponse: false,
        })
        .then(response => {
            const disposition = response.headers.get('content-disposition');
            const fileName = decodeURI(
                disposition.substring(disposition.indexOf('filename=') + 9, disposition.length),
            );
            response.blob().then((blob: Blob) => {
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', fileName);
                document.body.appendChild(link);
                link.click();
                link.remove();
            });
        });
}

export async function putGoodsPicEdit(data: IImgEditData) {
    return request.put(LocalApiPath.putGoodsPicEdit, {
        requestType: 'json',
        data,
    });
}

// formData
export async function postGoodsPicUpload(data: any) {
    return request.post(LocalApiPath.postGoodsPicUpload, {
        data,
    });
}

// 一键上架
export async function postGoodsOnsale(data: IOnsaleData) {
    return request.post(LocalApiPath.getGoodsOnsale, {
        data,
    });
}

// 查询商品一键上架
export async function getAllGoodsOnsale(params: IFilterParams) {
    return request.get(LocalApiPath.getAllGoodsOnsale, {
        params,
    });
}

// 删除
export async function getGoodsDelete(data: IGoodsDeleteData) {
    // console.log('data', data);
    return request.post(LocalApiPath.getGoodsDelete, {
        requestType: 'json',
        data,
    });
}

// 商品编辑
export async function putGoodsEdit(data: IGoodsEditData) {
    return request.put(LocalApiPath.putGoodsEdit, {
        data,
    });
}

// 查询商品上架信息
export async function getGoodsSales(params: IProductId) {
    return request.get(LocalApiPath.getGoodsSales, {
        params,
    });
}

// 获取所有
export async function getCatagoryList() {
    return request.get(LocalApiPath.getCatagoryList);
}

// 获取商品版本
export async function getGoodsVersion(params: IGoodsVersionParams) {
    return request.get(LocalApiPath.getGoodsVersion, {
        params: params,
    });
}

// 下载商品版本excel
export async function postGoodsVersionExport(data: IGoodsVersionParams) {
    return request
        .get(LocalApiPath.postGoodsVersionExport, {
            // requestType: 'form',
            params: data,
            // data,
            responseType: 'blob',
            parseResponse: false,
        })
        .then(response => {
            const disposition = response.headers.get('content-disposition');
            const fileName = decodeURI(
                disposition.substring(disposition.indexOf('filename=') + 9, disposition.length),
            );
            response.blob().then((blob: Blob) => {
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', fileName);
                document.body.appendChild(link);
                link.click();
                link.remove();
            });
        });
}

// 忽略版本
export async function postGoodsIgnoreVersion(data: IProductId) {
    return request.post(LocalApiPath.postGoodsIgnoreVersion, {
        data,
    });
}

// 获取sku列表分页
export async function getGoodsSkuList(params: ISkuParams) {
    return request.get(`/api/v1/goods/skus/${params.product_id}`, {
        params,
    });
}

import request from '@/utils/request';
import { LocalApiPath } from '@/config/api/LocalApiPath';
import { IResponse, IPaginationResponse } from '@/interface/IGlobal';
import { IGoodsList, ICatagoryItem } from '@/interface/ILocalGoods';
import { IOptionItem } from 'react-components/es/JsonForm/items/Select';

export declare interface IFilterParams {
    page?: number;
    page_count?: number;
    task_number?: string[]; // 任务 id
    store_id?: string[]; // 店铺 ID
    commodity_id?: number[]; // Commodity_ID
    inventory_status?: number; // 库存
    version_status?: number; // 版本更新
    first_catagory?: number; // 一级类目
    second_catagory?: number; // 二级类目
    third_catagory?: number; // 三级类目
    min_sale?: number; // 销量最小
    max_sale?: number; // 销量最大值
    min_sku?: number; // sku数量最小值
    max_sku?: number; // sku最大值
    min_price?: number; // 价格范围最小值
    max_price?: number; // 价格范围最大值
    min_comment?: number; // 评论数量最小值
    product_status?: string; // 版本状态
    // product_sn?: string;
    merchants_id?: string;
}

declare interface IImgEditData {
    pic_url: string[];
    product_id: string;
}

declare interface IOnsaleData {
    scm_goods_id: string[];
    merchants_id?: string;
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

export declare interface ISkuParams {
    page: number;
    page_count?: number;
    product_id?: string;
    variantids?: string;
}

// 兼容SearchForm数据结构 { name: '', value: '' }

export async function getGoodsList(params: IFilterParams) {
    return request.post<IResponse<IPaginationResponse<IGoodsList>>>(LocalApiPath.getGoodsList, {
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

function convertCategory(data: ICatagoryItem[]): IOptionItem[] {
    return data.map(({ name, id, children }) => {
        return {
            name: name as string,
            value: id as string,
            ...(children ? { children: convertCategory(children) } : undefined),
        };
    });
}

// 获取所有
export async function getCatagoryList() {
    return request.get(LocalApiPath.getCatagoryList).then(res => {
        const { data } = res;
        return {
            list: data,
            convertList: convertCategory(data),
        };
    });
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

// 首次合并商品
export async function postGoodsMerge(data: {
    main_commodity_id: string;
    merge_commodity_ids: string[];
}) {
    return request.post(LocalApiPath.postGoodsMerge, {
        data,
    });
}

// 设置主商品
export async function putGoodsMergeMain(data: { product_sn: string; main_commodity_id: string }) {
    return request.put(LocalApiPath.putGoodsMergeMain, {
        data,
    });
}

// 删除关联商品
export async function delGoodsMergeDelete(data: { product_sn: string; commodity_ids: string[] }) {
    return request.delete(LocalApiPath.delGoodsMergeDelete, {
        data,
    });
}

// 查询合并商品列表
export async function getGoodsMergeList(product_sn: string) {
    return request.get(LocalApiPath.getGoodsMergeList.replace(':id', product_sn));
}

// 合并商品后新增关联
export async function putGoodsMergeAdd(data: { product_sn: string; commodity_ids: string[] }) {
    return request.put(LocalApiPath.putGoodsMergeAdd, {
        data,
    });
}

// 获取所有
export async function getGoodsStatusList() {
    return request.get(LocalApiPath.getGoodsStatusList).then((res: any) => {
        // console.log('getGoodsStatusList', res);
        // // const { data } = res;
        // // return {
        // //     list: data,
        // //     convertList: convertCategory(data),
        // // };
        // return res
        return res.data.result.map((item: any) => ({
            name: item.msg,
            value: item.code,
        }));
    });
}

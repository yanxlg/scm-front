import { IApiParams } from '@/pages/goods/channel/components/VersionSearch';
import request from '@/utils/request';
import { ChannelApiPath } from '@/config/api/ChannelApiPath';
import {
    IChannelProductListBody,
    IChannelProductListResponse,
    IChannelCategoryResponse,
    IChannelChangedPropertiesResponse,
    IChannelShelveStateBody,
} from '@/interface/IChannel';
import { IResponse } from '@/interface/IGlobal';

export async function queryGoodsVersion(params?: IApiParams) {
    return request.get(ChannelApiPath.QueryGoodsVersion, {
        params: params,
    });
}

export async function queryGoodsDetail(params: { product_id: string; channel?: string }) {
    return request.get(ChannelApiPath.QueryGoodsDetail, {
        params: params,
    });
}

export async function editGoodsDetail(params: { product_id: string; sku_list: string }) {
    return request.put(ChannelApiPath.EditGoodsDetail, {
        data: params,
    });
}

export async function exportVovaGoodsVersion(data?: IApiParams) {
    return request
        .post(ChannelApiPath.ExportGoodsVersion, {
            data: data,
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

export async function activeVovaGoodsVersion(
    params: Array<{
        virtual_id: number;
        product_id: number;
    }>,
) {
    return request.post(ChannelApiPath.ActiveGoodsVersion, {
        data: params,
    });
}

export async function clearGoodsVersionRecord() {
    return request.post(ChannelApiPath.CleanChangedProperties);
}

export declare interface IFilterParams {
    page: number;
    page_count: number;
    onshelf_time_start: number;
    onshelf_time_end: number;
    commodity_id: string; // commodity_id
    vova_virtual_id: string; // 虚拟 ID
    product_id: string; // product_id
    level_one_category: string; // 一级类目
    level_two_category: string; // 二级类目
    sales_volume: number; // 销量
    shop_name: string; // 店铺名称
    product_status: string; //上架状态
}

export async function queryChannelGoodsList(data: IChannelProductListBody) {
    return request.post<IResponse<IChannelProductListResponse>>(ChannelApiPath.QueryGoodsList, {
        requestType: 'json',
        data,
    });
}

export async function queryChannelCategory() {
    return request.get<IResponse<IChannelCategoryResponse>>(ChannelApiPath.QueryCategory);
}

// 获取数据/状态更新数据
export async function queryChannelChangedProperties() {
    return request.get<IResponse<IChannelChangedPropertiesResponse>>(
        ChannelApiPath.QueryChangedProperties,
    );
}

// 商品上下架操作
export async function updateChannelShelveState(data: IChannelShelveStateBody) {
    return request.put<IResponse<null>>(ChannelApiPath.UpdateShelveState, {
        data,
    });
}

export async function exportChannelProductList(data: IFilterParams) {
    return request
        .post(ChannelApiPath.ExportGoodsList, {
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

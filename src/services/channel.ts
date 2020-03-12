import request from '@/utils/request';
import { ChannelApiPath } from '@/config/api/ChannelApiPath';
import {
    IChannelProductListBody,
    IChannelProductListResponse,
    IChannelCategoryResponse,
    IChannelChangedPropertiesResponse,
    IChannelShelveStateBody,
    IChannelProductVersionQuery,
    IChannelProductVersionResponse,
    IChannelProductDetailQuery,
    IChannelProductDetailResponse,
    IEditChannelProductDetailBody,
    IActiveChannelProductVersionBody,
    IRegionShippingFeeBody,
    IRegionShippingFeeResponse,
    IGoodsDetailBody,
    IGoodsDetailResponse,
    IGoodsSkuBody,
    IGoodsSkuResponse,
    IEditSkuBody,
} from '@/interface/IChannel';
import { IRequestPagination1, IResponse } from '@/interface/IGlobal';
import { downloadExcel } from '@/utils/common';

export async function queryChannelProductVersion(query?: IChannelProductVersionQuery) {
    return request.get<IResponse<IChannelProductVersionResponse>>(
        ChannelApiPath.QueryProductVersion,
        {
            params: query,
        },
    );
}

export async function queryChannelProductDetail(query: IChannelProductDetailQuery) {
    return request.get<IResponse<IChannelProductDetailResponse>>(
        ChannelApiPath.QueryProductDetail,
        {
            params: query,
        },
    );
}

export async function editChannelProductDetail(body: IEditChannelProductDetailBody) {
    return request.put<IResponse<null>>(ChannelApiPath.EditProductDetail, {
        data: body,
    });
}

export async function exportChannelProductVersion(data?: IChannelProductVersionQuery) {
    return request
        .post(ChannelApiPath.ExportProductVersion, {
            data: data,
            responseType: 'blob',
            parseResponse: false,
        })
        .then(downloadExcel);
}

export async function activeChannelProductVersion(body: IActiveChannelProductVersionBody) {
    return request.post<IResponse<null>>(ChannelApiPath.ActiveProductVersion, {
        data: body,
    });
}

export async function cleanChannelChangedProperties() {
    return request.post<IResponse<null>>(ChannelApiPath.CleanChangedProperties);
}

export async function queryChannelGoodsList(data: IChannelProductListBody & IRequestPagination1) {
    return request.post<IResponse<IChannelProductListResponse>>(ChannelApiPath.QueryProductList, {
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

export async function exportChannelProductList(
    data: IChannelProductListBody & IRequestPagination1,
) {
    return request
        .post(ChannelApiPath.ExportProductList, {
            data,
            responseType: 'blob',
            parseResponse: false,
        })
        .then(downloadExcel);
}

// 查询国家运费
export async function queryRegionShippingFee(data: IRegionShippingFeeBody) {
    return request.post<IResponse<IRegionShippingFeeResponse>>(ChannelApiPath.QueryRegionShippingFee, {
        data,
    });
}

// 查询商品详情
export async function queryGoodsDetail(params: IGoodsDetailBody) {
    return request.get<IResponse<IGoodsDetailResponse>>(ChannelApiPath.QueryGoodsDetail, {
        params,
    });
}

// 查询商品sku
export async function queryGoodsSkuList(data: IGoodsSkuBody) {
    return request.post<IResponse<IGoodsSkuResponse>>(ChannelApiPath.QueryGoodsSkuList, {
        data,
    });
}

// 编辑sku价格
export async function editSkuPrice(data: IEditSkuBody[]) {
    return request.put<IResponse<null>>(ChannelApiPath.EditSkuPrice, {
        data,
    });
}



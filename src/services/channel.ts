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
    IEditSkuResponse,
    ISHopList,
    ILogItem,
} from '@/interface/IChannel';
import { IResponse, RequestPagination } from '@/interface/IGlobal';
import { downloadExcel } from '@/utils/common';
import { singlePromiseWrap, transPaginationRequest, transPaginationResponse } from '@/utils/utils';
import { EmptyObject } from '@/config/global';
import { IOptionItem } from 'react-components/es/JsonForm/items/Select';

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

export async function queryChannelGoodsList(data: IChannelProductListBody & RequestPagination) {
    return request.post<IResponse<IChannelProductListResponse>>(ChannelApiPath.QueryProductList, {
        requestType: 'json',
        data: transPaginationRequest(data),
    });
}

function convertChannelCategory(data: IChannelCategoryResponse): IOptionItem[] {
    return data.map(({ platform_cate_id, platform_cate_name, children }) => {
        return {
            value: String(platform_cate_id),
            name: platform_cate_name,
            ...(children ? { children: convertChannelCategory(children) } : undefined),
        };
    });
}

export const queryChannelCategory = singlePromiseWrap(() => {
    return request
        .get<IResponse<IChannelCategoryResponse>>(ChannelApiPath.QueryCategory)
        .then(({ data = [] } = EmptyObject) => {
            return convertChannelCategory(data);
        })
        .catch(() => {
            return [];
        });
});

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
        skipResponseInterceptors: true,
    });
}

export async function exportChannelProductList(data: IChannelProductListBody) {
    return request.post(ChannelApiPath.ExportProductList, {
        data: { ...data },
    });
}

// 查询国家运费
export async function queryRegionShippingFee(data: IRegionShippingFeeBody & RequestPagination) {
    return request
        .post<IResponse<IRegionShippingFeeResponse>>(ChannelApiPath.QueryRegionShippingFee, {
            data: transPaginationRequest(data),
        })
        .then(transPaginationResponse);
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
export async function editSkuPrice(data: IEditSkuBody) {
    return request.put<IResponse<IEditSkuResponse>>(ChannelApiPath.EditSkuPrice, {
        data,
    });
}

export const queryShopList = singlePromiseWrap(() => {
    return request.get<IResponse<ISHopList>>(ChannelApiPath.QueryShopList);
});

export async function queryOnOffLog(product_ids: string) {
    return request.post<IResponse<ILogItem[]>>(ChannelApiPath.QueryOnOffLog, {
        data: {
            product_ids,
        },
    });
}

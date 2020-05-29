import request from '@/utils/request';
import { GoodsAttrApiPath } from '@/config/api/GoodsAttrApiPath';
import { IResponse, IPaginationResponse } from '@/interface/IGlobal';
import { IGetTagsListRequest, ITagItem } from '@/interface/IGoodsAttr';
import { singlePromiseWrap } from '@/utils/utils';

export async function getTagsList(params: IGetTagsListRequest = { page: 1, page_count: 10000 }) {
    return request.get<IResponse<IPaginationResponse<any>>>(GoodsAttrApiPath.getTagsList, {
        params,
    });
}

// 获取当前激活的标签
export const getEnabledTagsList = singlePromiseWrap(() => {
    return getTagsList({
        page: 1,
        page_count: 10000,
        is_active: 'ENABLED',
    });
});

export async function addTag(name: string) {
    return request.post<IResponse<any>>(GoodsAttrApiPath.addTag, {
        data: {
            name,
        },
    });
}

export async function enabledTag(name: string) {
    return request.put<IResponse<any>>(GoodsAttrApiPath.enabledTag.replace(':name', name));
}

export async function deleteTag(name: string) {
    return request.delete<IResponse<any>>(GoodsAttrApiPath.deleteTag.replace(':name', name));
}

export async function setCommodityTag(data: { tag_name: string[]; commodity_id: string }) {
    return request.post<IResponse<any>>(GoodsAttrApiPath.setCommodityTag, {
        data,
    });
}

export async function setCommoditySkuTag(data: {
    tag_name: string[];
    commodity_sku_id: string;
    commodity_id: string;
}) {
    return request.post<IResponse<any>>(GoodsAttrApiPath.setCommoditySkuTag, {
        data,
    });
}

export async function putBatchUpdateTags(data: { tag_list: ITagItem[] }) {
    return request.put<IResponse<any>>(GoodsAttrApiPath.putBatchUpdateTags, {
        data,
    });
}

export async function getBatchUpdateProgress() {
    return request.get<IResponse<any>>(GoodsAttrApiPath.getBatchUpdateProgress);
}

export async function getInterceptTagList() {
    return request.get<IResponse<any>>(GoodsAttrApiPath.getInterceptTagList);
}

export async function setInterceptTagList(
    data: Array<{
        keywords: string;
        type: 0 | 1 | 2;
    }>,
) {
    return request.post<IResponse<any>>(GoodsAttrApiPath.setInterceptTagList, {
        data: data,
    });
}

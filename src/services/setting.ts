import { transPaginationRequest } from '@/utils/utils';
import request from '@/utils/request';
import { IPaginationResponse, IRequestPagination1, IResponse } from '@/interface/IGlobal';
import {
    ICountryItem,
    ICustomItem,
    ICustomListQuery,
    ICookieBody,
    ICookieResponse,
    IPriceStrategy,
    IPriceStrategyItem,
    IOfflinePurchaseDetail,
    IOfflinePurchaseQuery,
    IOfflinePurchaseReqData,
    IOfflinePurchaseItem,
    IReplaceBody,
    IReplaceStoreOutItem,
    ReplaceItem,
    IStoreBlacklistItem,
    IGetStoreBlacklistReq,
    ISaveBlackStoreReq,
    IDeleteBlackStoreReq,
    IAccount,
} from '@/interface/ISetting';
import { SettingApiPath } from '@/config/api/SettingApiPath';
import { EmptyObject } from '@/config/global';
import { IOptionItem } from 'react-components/es/JsonForm/items/Select';
import { api } from 'react-components';
import { IPaginationResponse as PaginationResponse } from 'react-components/es/hooks/useList';
import { FetchFactory } from '@/hooks/useFetch';

export async function queryCustomList(query: ICustomListQuery) {
    const params = transPaginationRequest(query);
    return request.get<IResponse<IPaginationResponse<ICustomItem>>>(
        SettingApiPath.QueryCustomDeclarationList,
        {
            params: params,
        },
    );
}

function convertCountry(data: ICountryItem[]): IOptionItem[] {
    return data.map(({ name, code }) => {
        return {
            name: name,
            value: code,
        };
    });
}

export async function queryCountryList() {
    return request
        .get<IResponse<ICountryItem[]>>(SettingApiPath.QueryCountryList)
        .then(({ data = [] } = EmptyObject) => {
            return convertCountry(data);
        })
        .catch(() => {
            return [];
        });
}

export async function updateCustom(data: ICustomItem) {
    return request.post(SettingApiPath.UpdateCustom, {
        data: data,
    });
}

export async function queryCookies() {
    return request.get<IResponse<ICookieResponse>>(SettingApiPath.QueryCookie);
}

export async function saveCookie(data: ICookieBody) {
    return request.post(SettingApiPath.UpdateCookie, {
        data: data,
    });
}

export function queryDownloadList({
    size,
    id,
    filename,
    status,
    ...extra
}: {
    size?: number;
    id?: string;
    filename?: string;
    status?: number;
}) {
    return api.post(SettingApiPath.ExportList, {
        data: {
            page_size: size,
            id,
            filename,
            status,
            ...extra,
        },
    });
}

export function retryExport(id: string) {
    return request.get(SettingApiPath.RetryExport, {
        params: {
            id,
        },
        skipResponseInterceptors: true,
    });
}

export function deleteExport(id: string) {
    return request.get(SettingApiPath.DeleteExport, {
        params: {
            id: id,
        },
        skipResponseInterceptors: true,
    });
}

export function updateExport(id: string) {
    return request.get(SettingApiPath.UpdateExport, {
        params: {
            id: id,
        },
        skipResponseInterceptors: true,
    });
}

export function queryPriceStrategy(merchant_id: string) {
    return request.get<IResponse<IPriceStrategy | null>>(SettingApiPath.QueryPriceStrategy, {
        params: {
            strategy_type: 1,
            merchant_id: merchant_id,
        },
    });
}

export function updatePriceStrategy(data: {
    merchant_id: number;
    purchase_crawler_price_condition: number;
    sale_crawler_price_value: number;
    middle_condition: number;
    purchase_minus_sale_crawler_price_condition: number;
    fix_price_value: number;
}) {
    return request.post(SettingApiPath.UpdatePriceStrategy, {
        data: data,
    });
}

export function queryPriceStrategyHistory(params: any) {
    return api.get<IResponse<PaginationResponse<IPriceStrategyItem>>>(
        SettingApiPath.QueryPriceStrategyHistory,
        {
            params: params,
        },
    );
}

export function queryReplaceStoreOutList({
    type,
    ...data
}: IReplaceBody & IRequestPagination1 & { type?: string }) {
    return api.post<IResponse<PaginationResponse<IReplaceStoreOutItem>>>(
        SettingApiPath.QueryReplaceList,
        {
            data: {
                ...data,
            },
        },
    );
}

export function deleteReplaceStoreOutList(id: string) {
    return request.delete(SettingApiPath.DeleteReplaceList.replace('{id}', id), {
        data: {
            id,
        },
    });
}

export function addReplaceStoreOutList({
    outbound_score,
    ...extra
}: Partial<IReplaceStoreOutItem>) {
    return request.post(SettingApiPath.AddReplaceList, {
        data: {
            ...extra,
            outbound_score: Number(outbound_score),
        },
    });
}

export function updateReplaceStoreOutList({ outbound_score, ...extra }: IReplaceStoreOutItem) {
    return request.put(SettingApiPath.EditReplaceList.replace('{id}', extra.id), {
        data: {
            ...extra,
            outbound_score: Number(outbound_score),
        },
    });
}

export function queryReplaceStoreOut(fetch: FetchFactory, id: string) {
    return fetch.get<IResponse<ReplaceItem>>(SettingApiPath.QueryReplace.replace('{id}', id), {
        params: {
            id,
        },
    });
}

export function queryOfflinePurchaseList(data: IOfflinePurchaseQuery) {
    return api.post<IResponse<PaginationResponse<IOfflinePurchaseItem>>>(
        SettingApiPath.QueryOfflinePurchaseList,
        {
            data,
        },
    );
}

export function queryOfflinePurchaseInfo(id: string) {
    return request.get<IResponse<IOfflinePurchaseDetail>>(
        SettingApiPath.QueryOfflinePurchaseInfo.replace(':id', id),
    );
}

export function addOfflinePurchase(data: IOfflinePurchaseReqData) {
    return request.post(SettingApiPath.AddOfflinePurchase, {
        data,
    });
}

export function updateOfflinePurchase(id: string, data: IOfflinePurchaseReqData) {
    return request.put(SettingApiPath.UpdateOfflinePurchase.replace(':id', id), {
        data,
    });
}

export function delOfflinePurchase(id: string) {
    return request.delete(SettingApiPath.DelOfflinePurchase.replace(':id', id));
}

/*** 采购店铺黑名单 ***/
export function getStoreBlacklist(data: IGetStoreBlacklistReq) {
    return api.post<IResponse<PaginationResponse<IStoreBlacklistItem>>>(
        SettingApiPath.getStoreBlacklist,
        {
            data,
        },
    );
}

export function saveBlackStore(data: ISaveBlackStoreReq) {
    return request.post(SettingApiPath.saveBlackStore, {
        data,
    });
}

export function deleteBlackStore(data: IDeleteBlackStoreReq) {
    return request.post(SettingApiPath.deleteBlackStore, {
        data,
    });
}

export function queryAccountList(data: {
    user_id?: string;
    username?: string;
    role_id?: number;
    create_user?: string;
    status?: number;
    create_time_start?: number;
    create_time_end?: number;
    page: number;
    page_count: number;
}) {
    return api.post<IResponse<PaginationResponse<IAccount>>>(SettingApiPath.queryAccount, {
        data,
    });
}

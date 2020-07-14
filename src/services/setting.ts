import { singlePromiseWrap, transPaginationRequest } from '@/utils/utils';
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
    IGetOrderConfigListReq,
    IOrderConfigItem,
    IAddOrderConfigReq,
    IAccount,
    IPermissionItem,
    IPermissionTree,
    IRole,
    IAccountDetail,
    IVirtualDeliverySignListReq,
    IVirtualDeliverySignItem,
    IAddVirtualDeliverySignListReq,
} from '@/interface/ISetting';
import { SettingApiPath } from '@/config/api/SettingApiPath';
import { EmptyObject } from '@/config/global';
import { IOptionItem } from 'react-components/es/JsonForm/items/Select';
import { api } from 'react-components';
import { IPaginationResponse as PaginationResponse } from 'react-components/es/hooks/useList';
import { FetchFactory } from '@/hooks/useFetch';
import { GlobalApiPath } from '@/config/api/Global';

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

/*** 订单审核配置 ***/
export function getOrderConfigList(data: IGetOrderConfigListReq) {
    return api.post<IResponse<PaginationResponse<IOrderConfigItem>>>(
        SettingApiPath.QueryOrderConfigList,
        {
            data,
        },
    );
}

export function addOrderConfig(data: IAddOrderConfigReq) {
    return request.post(SettingApiPath.AddOrderConfig, {
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
    return api.post<IResponse<PaginationResponse<IAccount>>>(SettingApiPath.queryAccountList, {
        data,
    });
}

export function addAccount(data: {
    username: string;
    real_name: string;
    password: string;
    status: 0 | 1;
    roles: number[];
}) {
    return request.post(SettingApiPath.addAccount, {
        data: data,
    });
}

const parsePermissionTree = (
    item: IPermissionItem,
    keysList?: string[],
    pArray?: string[],
    parentMap?: Map<string | number, (string | number)[]>,
): IPermissionTree => {
    const { data, children } = item;
    if (keysList) {
        keysList.push(data.id);
    }
    if (parentMap && pArray && pArray.length > 0) {
        parentMap.set(data.id, Array.from(pArray));
    }
    if (pArray) {
        pArray = ([] as string[]).concat(pArray).concat(data.id);
    }
    return {
        title: data.name,
        key: data.id,
        children: children.map(child => parsePermissionTree(child, keysList, pArray, parentMap)),
    };
};

export function queryPermissionTree() {
    let flatKeys: string[] = [];
    return request
        .get<
            IResponse<{
                pageTree: { [key: string]: IPermissionItem };
                dataTree: { [key: string]: IPermissionItem };
            }>
        >(SettingApiPath.queryPermissionTree)
        .then(({ data: { pageTree, dataTree } }) => {
            let treeArr: IPermissionTree[] = [];
            let keysArr: Array<string[]> = [];
            let parentMap = new Map<string | number, (string | number)[]>();
            for (let index in pageTree) {
                let keysList: string[] = [];
                treeArr.push(parsePermissionTree(pageTree[index], keysList, [], parentMap));
                keysArr.push(keysList);
                flatKeys.push(...keysList);
            }

            let dataList: IPermissionTree[] = [];
            for (let index in dataTree) {
                const treeItems = dataTree[index]?.children || [];
                treeItems.forEach(treeItem => {
                    dataList.push(parsePermissionTree(treeItem));
                });
            }
            return { pTree: treeArr, flatKeys, keysArr, dataTree: dataList, parentMap };
        });
}

export function updateAccount(
    id: string,
    data: { real_name: string; password: string; status: 1 | 0; roles: number[] },
) {
    return request.put(SettingApiPath.updateAccount.replace('{id}', id), {
        data: data,
    });
}

export function queryAccount(id: string) {
    return request.get<IResponse<IAccountDetail>>(SettingApiPath.queryAccount.replace('{id}', id));
}

export function queryRoleList(data: {
    name?: string;
    create_user?: string;
    status?: number;
    create_time_start?: number;
    create_time_end?: number;
    page: number;
    page_count: number;
}) {
    return api.post<IResponse<PaginationResponse<IRole>>>(SettingApiPath.queryRoleList, {
        data,
    });
}

export function delOrderConfig(id: string) {
    return request.get(SettingApiPath.DelOrderConfig, {
        params: {
            id,
        },
    });
}

export function addRole(data: { name: string; description: string; role_auths: number[] }) {
    return request.post(SettingApiPath.addRole, {
        data,
    });
}
export function editRole(
    id: string,
    data: { name: string; description: string; role_auths: number[] },
) {
    return request.put(SettingApiPath.editRole.replace('{id}', id), {
        data,
    });
}

export const queryAccountCreator = singlePromiseWrap(() => {
    return request
        .get<IResponse<Array<string>>>(SettingApiPath.queryAccountCreator.replace('{type}', '1'))
        .then(({ data }) => {
            return data.map(name => ({
                name: name,
                value: name,
            }));
        });
});

export const queryRoleCreator = singlePromiseWrap(() => {
    return request
        .get<IResponse<Array<string>>>(SettingApiPath.queryAccountCreator.replace('{type}', '2'))
        .then(({ data }) => {
            return data.map(name => ({
                name: name,
                value: name,
            }));
        });
});

export const queryRolePermission = (roles: (number | string)[]) => {
    return request.get<IResponse<Array<IPermissionItem['data']>>>(
        SettingApiPath.queryRolePermission.replace('{role_ids}', roles.join(',')),
    );
};

export function deleteRole(id: string) {
    return request.delete(SettingApiPath.deleteRole.replace('{id}', id));
}

export function updateRoleStatus(id: string, status: number) {
    return request.delete(SettingApiPath.updateRoleStatus.replace('{id}', id), {
        data: {
            status,
        },
    });
}

export function updateAccountStatus(id: string, status: number) {
    return request.delete(SettingApiPath.updateAccountStatus.replace('{id}', id), {
        data: {
            status,
        },
    });
}

/*** 虚假发货标记配置 ***/
export function queryVirtualDeliverySignList(data: IVirtualDeliverySignListReq) {
    return api.post<IResponse<PaginationResponse<IVirtualDeliverySignItem>>>(
        SettingApiPath.queryVirtualDeliverySignList,
        {
            data,
        },
    );
}

export function addVirtualDeliverySign(data: IAddVirtualDeliverySignListReq) {
    return request.post(SettingApiPath.addVirtualDeliverySign, {
        data,
    });
}

export function deleteVirtualDeliverySign(id: string) {
    return request.post(SettingApiPath.deleteVirtualDeliverySign, {
        data: {
            abnormal_key: id,
        },
    });
}

export function queryVirtualDeliveryCondition() {
    return request.get(SettingApiPath.queryVirtualDeliveryCondition);
}

import { transPaginationRequest } from '@/utils/utils';
import request from '@/utils/request';
import { IPaginationResponse, IResponse } from '@/interface/IGlobal';
import {
    ICookieItem,
    ICountryItem,
    ICustomItem,
    ICustomListQuery,
    ICookieBody,
    ICookieResponse,
} from '@/interface/ISetting';
import { SettingApiPath } from '@/config/api/SettingApiPath';
import { EmptyObject } from '@/config/global';
import { IOptionItem } from 'react-components/es/JsonForm/items/Select';
import { api } from 'react-components';

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

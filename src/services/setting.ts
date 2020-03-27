import { transPaginationRequest } from '@/utils/utils';
import request from '@/utils/request';
import { IPaginationResponse, IResponse } from '@/interface/IGlobal';
import { ICustomDeclarationListItem, ICustomDeclarationListQuery } from '@/interface/ISetting';
import { SettingApiPath } from '@/config/api/SettingApiPath';

export async function queryCustomDeclarationList(query: ICustomDeclarationListQuery) {
    const params = transPaginationRequest(query);
    return request.get<IResponse<IPaginationResponse<ICustomDeclarationListItem>>>(
        SettingApiPath.QueryCustomDeclarationList,
        {
            params: params,
        },
    );
}

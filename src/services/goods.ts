import request from '@/utils/request';
import { ApiPathEnum } from '@/enums/ApiPathEnum';

declare interface IFilterParams {
    page: number;
    size: number;
}

export async function getGoodsList(params: IFilterParams) {
    return request.get(ApiPathEnum.getGoodsList, {
        requestType: 'form',
        params: params
    });
}

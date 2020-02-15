import request, { errorHandlerFactory } from '@/utils/request';
import { ApiPathEnum } from '@/enums/ApiPathEnum';
import { IFormData } from '@/pages/goods/vova/components/VersionSearch';

export async function queryGoodsVersion(params?: IFormData) {
    return request.get(ApiPathEnum.QueryGoodsVersion, {
        params: params,
    });
}


export async function queryGoodsDetail(params:{product_id:number; channel?:string;}) {
    return request.get(ApiPathEnum.QueryGoodsDetail,{
        params: params,
    })
}

export async function editGoodsDetail(params:{
    goods_id:number;
    sku_list:string;
}) {
    return request.put(ApiPathEnum.EditGoodsDetail,{
        data:params
    })
}

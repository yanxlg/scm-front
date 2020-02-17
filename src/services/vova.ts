import { IApiParams } from '@/pages/goods/vova/components/VersionSearch';
import request from '@/utils/request';
import { ApiPathEnum } from '@/enums/ApiPathEnum';

export async function queryGoodsVersion(params?: IApiParams) {
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



export async function exportVovaGoodsVersion(data?:IApiParams) {
    return request.post(ApiPathEnum.ExportVovaGoodsVersion, {
        data:data,
        responseType:"blob",
        parseResponse:false
    }).then((response)=>{
        const disposition = response.headers.get('content-disposition');
        const fileName = decodeURI(disposition.substring(disposition.indexOf('filename=')+9, disposition.length));
        response.blob().then((blob:Blob)=>{
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', fileName);
            document.body.appendChild(link);
            link.click();
            link.remove();
        })
    });
}



export async function activeVovaGoodsVersion(params:Array<{
    virtual_id:number,
    product_id:number
}>) {
    return request.post(ApiPathEnum.ActiveVovaGoodsVersion,{
        data:params
    });
}


export async function clearGoodsVersionRecord() {
    return request.post(ApiPathEnum.ClearGoodsVersionRecord);
}

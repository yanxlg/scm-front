import request from '@/utils/request';
import { ApiPathEnum } from '@/enums/ApiPathEnum';

export declare interface IFilterParam {
    page: number;
    page_count: number;
    onshelf_time_satrt: number;
    onshelf_time_end: number;
    commodity_id: string;          // commodity_id
    vova_virtual_id: string;       // 虚拟 ID
    product_id: string;            // product_id
    level_one_category: string;    // 一级类目
    level_two_category: string;    // 二级类目
    sales_volume: number;          // 销量
    shop_name: string;             // 店铺名称
    product_status: string;        //上架状态
}

declare interface goodsSalesParam {
    type: string;
    info: {
        product_id: string;
        commodity_id: string;
        sale_domain: string;
    }
}

declare interface IExportData {

}

// 查询vova商品列表数据
export async function getVovaGoodsList(params: IFilterParam) {
    return request.post(ApiPathEnum.getVovaGoodsList, {
        params: params
    });
}

export async function getSearchConditionOptions() {
    return request.get(ApiPathEnum.getSearchConditionOptions);
}

// 获取数据/状态更新数据
export async function getVovaChangedProperties() {
    return request.get(ApiPathEnum.getVovaChangedProperties);
}

// 商品上下架操作
export async function putVovaGoodsSales(data: goodsSalesParam) {
    return request.put(ApiPathEnum.putVovaGoodsSales, {
        data
    });
}

// 下载vova商品列表excel
export async function postVovaGoodsListExport(data: IExportData) {
    return request.post(ApiPathEnum.postGoodsVersionExport, {
        data,
        responseType:"blob",
        parseResponse: false
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

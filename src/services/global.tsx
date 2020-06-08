import { singlePromiseWrap } from '@/utils/utils';
import request from '@/utils/request';
import { IResponse, ISHopList, IExportExcelReqData } from '@/interface/IGlobal';
import { GlobalApiPath } from '@/config/api/Global';
import { IGood } from '@/interface/ILocalGoods';

export function downloadFile(url: string) {
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.src = url;
    document.body.appendChild(iframe);
}

export const queryShopList = singlePromiseWrap(() => {
    return request.get<IResponse<ISHopList>>(GlobalApiPath.QueryShopList);
});

export const queryShopFilterList = singlePromiseWrap(() => {
    return queryShopList()
        .then(({ data }) => {
            let shopMap: { [key: string]: any } = {};
            data.forEach(shop => {
                const { merchant_id, merchant_name, merchant_platform } = shop;
                if (shopMap[merchant_platform]) {
                    shopMap[merchant_platform] = ([] as Array<any>)
                        .concat(shopMap[merchant_platform])
                        .concat({
                            name: merchant_name,
                            value: merchant_id,
                        });
                } else {
                    shopMap[merchant_platform] = ([] as Array<any>).concat({
                        name: merchant_name,
                        value: merchant_id,
                    });
                }
            });

            let list = [];
            for (let platform in shopMap) {
                if (shopMap.hasOwnProperty(platform)) {
                    list.push({
                        name: platform,
                        value: platform,
                        children: shopMap[platform],
                    });
                }
            }
            return list;
        })
        .catch(() => {
            return [];
        });
});

export function exportExcel(data: IExportExcelReqData) {
    return request.post(GlobalApiPath.ExportExcel, {
        data,
    });
}

export const queryGoodsSourceList = singlePromiseWrap(() => {
    return request.get(GlobalApiPath.QuerySelectList.replace(':id', '1')).then(res => {
        const { data } = res;
        if (data) {
            return Object.keys(data).map(key => ({
                name: data[key],
                value: key,
            }));
        }
        return [];
    });
});

export const queryWarehourseById = (id: string) => {
    return request.get<
        IResponse<{
            address1: string;
            address2: string;
            city: string;
            consignee: string;
            country: string;
            country_code: string;
            phone_number: string;
            province: string;
            zip_code: string;
        }>
    >(GlobalApiPath.QueryWarehourse.replace(':warehourse_id', id));
};

export const queryGoodBySkuId = (commodity_sku_id: string) => {
    return request.post<IResponse<IGood>>(GlobalApiPath.QueryGoodBySkuId, {
        data: {
            commodity_sku_id: commodity_sku_id,
        },
    });
};

import { singlePromiseWrap } from '@/utils/utils';
import request from '@/utils/request';
import { IResponse, ISHopList, IExportExcelReqData } from '@/interface/IGlobal';
import { GlobalApiPath } from '@/config/api/Global';
import { downloadExcel } from '@/utils/common';
import { message } from 'antd';

// 1--品类预估模板下载，2---运费价卡模板下载
type IDownloadFileType = '1' | '2';

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

export function downloadTemplateFile(type: IDownloadFileType) {
    return request
        .get(GlobalApiPath.downloadTemplateFile, {
            params: {
                type,
            },
            responseType: 'blob',
            parseResponse: false,
            // skipResponseInterceptors: true,
        })
        .then(downloadExcel)
        .catch(err => {
            message.error('下载文件失败');
        });
}

export const getPurchasePlatform = singlePromiseWrap(() => {
    return request.get(GlobalApiPath.getPurchasePlatform).then(res => {
        // console.log('getPurchasePlatform', res);
        if (res.data) {
            return res.data.map((name: string) => ({
                name: name,
                value: name,
            }));
        }
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

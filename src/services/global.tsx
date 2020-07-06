import { singlePromiseWrap } from '@/utils/utils';
import request from '@/utils/request';
import {
    IResponse,
    ISHopList,
    IExportExcelReqData,
    IOnsaleInterceptStoreRes,
} from '@/interface/IGlobal';
import { GlobalApiPath } from '@/config/api/Global';
import { downloadExcel } from '@/utils/common';
import { message } from 'antd';
import { IGood } from '@/interface/ILocalGoods';
import { ISimpleRole } from '@/models/account';
import User from '@/storage/User';

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

export const queryGoodsSourceList = singlePromiseWrap<
    Array<{
        name: string;
        value: string;
    }>
>(() => {
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

export const queryOnsaleInterceptStore = (purchase_channel?: string) => {
    return request
        .get<IResponse<IOnsaleInterceptStoreRes[]>>(GlobalApiPath.QueryOnsaleInterceptStore, {
            params: {
                purchase_channel,
            },
        })
        .then(({ data }) => {
            return (data[0]?.support_merchant_id ?? []).map(val => String(val));
        });
};

export function queryRoleSimpleList() {
    return request
        .get<
            IResponse<
                Array<{
                    id: string;
                    name: string;
                }>
            >
        >(GlobalApiPath.querySimpleRoleList)
        .then(({ data }) => {
            return data.map(({ id, name }) => ({
                name: name,
                value: id,
            }));
        });
}

export function loginUser(data: { username: string; password: string }) {
    return request.post<IResponse<string>>(GlobalApiPath.login, {
        data: data,
    });
}

declare interface IItem {
    data: string;
    id: string;
    method: string;
    name: string;
    pid: string;
    type: string; // 1:数据权限，2：页面权限
    children?: IItem[];
}

export function queryUserPermission() {
    return request.get<
        IResponse<
            Array<{
                data: string;
                id: string;
                method: string;
                name: string;
                pid: string;
                type: string; // 1:数据权限，2：页面权限
            }>
        >
    >(GlobalApiPath.queryPermissionList);
}

export function logout() {
    return request.post(GlobalApiPath.logout).then(() => {
        User.clearToken();
    });
}

export function updatePwd(oldPassword: string, newPassword: string) {
    return request.put(GlobalApiPath.updatePwd, {
        data: {
            oldPassword,
            newPassword,
        },
    });
}

export function getFilterShopNames(selected?: string[]) {
    return new Promise<string[] | undefined>(resolve => {
        if (!selected || selected.length === 0) {
            return queryShopList().then(({ data: merchantList }) => {
                // 做权限过滤
                const dData = User.dData || [];
                const list = merchantList.filter((item: any) => {
                    return dData.indexOf(item.merchant_name) > -1;
                });
                resolve(list.map((item: any) => item.merchant_name) as string[]);
            });
        } else {
            resolve(selected);
        }
    });
}

export function getFilterShopIds(selected?: string[]) {
    return new Promise<string[] | undefined>(resolve => {
        if (!selected || selected.length === 0) {
            return queryShopList().then(({ data: merchantList }) => {
                // 做权限过滤
                const dData = User.dData || [];
                const list = merchantList.filter((item: any) => {
                    return dData.indexOf(item.merchant_name) > -1;
                });
                resolve(list.map((item: any) => item.merchant_id) as string[]);
            });
        } else {
            resolve(selected);
        }
    });
}

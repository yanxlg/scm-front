import { api } from 'react-components';
import request from '@/utils/request';
import { IResponse, IRequestPagination1 } from '@/interface/IGlobal';
import {
    IPurchaseAbnormalItem,
    IPurchaseAbnormalReq,
    IRejectAbnormalOrderReq,
    IDiscardAbnormalOrderReq,
    ICorrelateWaybillReq,
    IApplyPurchaseRefundReq,
    IAddressConfig,
    IPurchaseStatics,
    IReturnStatics,
    IReturnInfo,
    IReturnItem,
    IAbnormalContext,
    IQueryStrategyExceptionRes,
} from '@/interface/IPurchase';
import { PurchaseApiPath } from '@/config/api/PurchaseApiPath';
import { IPurchaseItem, IPurchasePlain } from '@/interface/IPurchase';
import { IPaginationResponse } from 'react-components/lib/hooks/useList';
import { singlePromiseWrap } from '@/utils/utils';

export function getAbnormalAllList(data: IPurchaseAbnormalReq & IRequestPagination1) {
    // <IResponse<IPurchaseAbnormalItem>>
    return api.post(PurchaseApiPath.getAbnormalAllList, {
        data,
    }); //.then(transPaginationResponse);;
}

export function setCorrelateWaybill(data: ICorrelateWaybillReq) {
    return request.post(PurchaseApiPath.setCorrelateWaybill, {
        data,
    });
}

export function setRejectAbnormalOrder(data: IRejectAbnormalOrderReq) {
    return request.post(PurchaseApiPath.setDiscardAbnormalOrder, {
        data,
    });
}

export function setDiscardAbnormalOrder(data: IDiscardAbnormalOrderReq) {
    return request.post(PurchaseApiPath.setDiscardAbnormalOrder, {
        data,
    });
}

export function applyPurchaseRefund(data: IApplyPurchaseRefundReq) {
    return request.post(PurchaseApiPath.applyPurchaseRefund, {
        data,
    });
}

export function getExceptionCount(params = { exec_more_time: 24 }) {
    return request.get(PurchaseApiPath.getExceptionCount, {
        params,
    });
}

export function downloadExcel(data: any) {
    return request.post(PurchaseApiPath.downloadExcel, {
        data,
    });
}

export const queryPurchaseList = (data: any) => {
    return api.post<IResponse<IPaginationResponse<IPurchaseItem>>>(PurchaseApiPath.QueryList, {
        data: {
            ...data,
        },
    });
};

export const queryReturnList = (data: any) => {
    return api.post<IResponse<IPaginationResponse<IReturnItem>>>(PurchaseApiPath.QueryReturnList, {
        data: {
            ...data,
        },
    });
};

export const queryReturnStatic = () => {
    return api.get<IResponse<IReturnStatics>>(PurchaseApiPath.QueryReturnStatic);
};

export const queryAddressConfig = () => {
    return api.get<IResponse<IAddressConfig>>(PurchaseApiPath.QueryAddressConfig);
};

export const addReturn = (data: any) => {
    return api.post(PurchaseApiPath.AddReturn, {
        data: data,
    });
};

export const cancelReturnOrder = (purchase_order_goods_return_id: string) => {
    return api.post(PurchaseApiPath.CancelReturn, {
        data: {
            purchase_order_goods_return_id,
        },
    });
};

export const queryPurchaseStatic = () => {
    return api.get<IResponse<IPurchaseStatics>>(PurchaseApiPath.QueryPurchaseStatic);
};

export const exportReturnList = (data: any) => {
    return api.post(PurchaseApiPath.Export, {
        data: {
            module: 6,
            ...data,
        },
    });
};

export const exportPurchaseList = (data: any) => {
    return api.post(PurchaseApiPath.Export, {
        data: {
            module: 7,
            ...data,
        },
    });
};

export const queryPurchasePlainList = (data: any) => {
    return api.post<IResponse<IPaginationResponse<IPurchasePlain>>>(
        PurchaseApiPath.QueryPurchasePlainList,
        {
            data: {
                ...data,
            },
        },
    );
};
export function getPurchaseGoodsInfo(id: string) {
    return request.get(PurchaseApiPath.getPurchaseGoodsInfo.replace(':id', id));
}

export function applyReturn(purchase_order_goods_id: string) {
    return api.post(PurchaseApiPath.ApplyReturn, {
        data: {
            purchase_order_goods_id,
        },
    });
}

export function queryReturnInfo(purchase_order_goods_id: string) {
    return api.get<IResponse<IReturnInfo>>(PurchaseApiPath.QueryReturnInfo, {
        params: {
            purchase_order_goods_id,
        },
    });
}

export function addWaybill(data: any) {
    return api.post(PurchaseApiPath.AddWaybill, {
        data: data,
    });
}

export function createPurchase(data: {
    purchase_manager: string;
    purchase_platform: string;
    purchase_merchant_name: string;
    purchase_order_goods_sn: string;
    warehouse_id: number;
    product_id: string;
    commodity_sku_id: string;
    shop_price: number;
    goods_number: number;
}) {
    return request.post(PurchaseApiPath.CreatePurchase, {
        data: {
            purchase_currency: 'RMB',
            ...data,
        },
    });
}

export function cancelPurchaseByUser(purchase_order_goods_id: string) {
    return request.delete(PurchaseApiPath.CancelPurchaseByUser, {
        data: {
            purchase_order_goods_id: purchase_order_goods_id,
        },
    });
}

export function endPurchaseByUser(purchase_order_goods_id: string) {
    return request.post(PurchaseApiPath.EndPurchaseByUser, {
        data: { purchase_order_goods_id },
    });
}

export const queryStrategyException = singlePromiseWrap(() => {
    return request
        .get<IResponse<IQueryStrategyExceptionRes>>(PurchaseApiPath.QueryStrategyException)
        .then(({ data }) => {
            const { exception_code, ...rest } = data;
            return {
                exception_code: exception_code?.map(({ name, code }) => ({
                    name,
                    value: code,
                })),
                ...rest,
            };
        });
});

export function finishPurchaseExceptionOrder(waybill_exception_sn: string[]) {
    return request.post(PurchaseApiPath.FinishPurchaseExceptionOrder, {
        data: {
            waybill_exception_sn,
        },
    });
}

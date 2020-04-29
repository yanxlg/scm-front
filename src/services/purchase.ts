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
} from '@/interface/IPurchase';
import { PurchaseApiPath } from '@/config/api/PurchaseApiPath';
import { IPurchaseItem, IPurchasePlain } from '@/interface/IPurchase';
import { IPaginationResponse } from 'react-components/lib/hooks/useList';

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
    return api.post(PurchaseApiPath.QueryReturnList, {
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

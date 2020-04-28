import { api } from 'react-components';
import request from '@/utils/request';
import { IPaginationResponse, IResponse, IRequestPagination1 } from '@/interface/IGlobal';
import {
    IPurchaseAbnormalItem,
    IPurchaseAbnormalReq,
    IRejectAbnormalOrderReq,
    IDiscardAbnormalOrderReq,
    ICorrelateWaybillReq,
    IApplyPurchaseRefundReq,
} from '@/interface/IPurchase';
import { PurchaseApiPath } from '@/config/api/PurchaseApiPath';
import { transPaginationResponse } from '@/utils/utils';

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

// getExceptionCount
export function getExceptionCount(params = { exec_more_time: 24 }) {
    return request.get(PurchaseApiPath.getExceptionCount, {
        params,
    });
}

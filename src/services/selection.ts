import request from '@/utils/request';
import { SelectionApiPath } from '@/config/api/SelectionApiPath';
import { IQueryGoodsSelectionListReq } from '@/interface/ISelection';

export function queryGoodsSelectionList(data: IQueryGoodsSelectionListReq) {
    return request.post(SelectionApiPath.QueryGoodsSelectionList, {
        data,
    });
}

export function deleteGoodsSelection(data: { commodity_id: string; merchant_id: string }) {
    return request.delete(SelectionApiPath.DeleteGoodsSelection, {
        data,
    });
}

export function exportGoodsSelection(data: any) {
    return request.post(SelectionApiPath.ExportGoodsSelection, {
        data,
    });
}

export function queryGoodsSelectionDetail(params: { commodity_id: string; merchant_id: string }) {
    return request.get(SelectionApiPath.QueryGoodsSelectionDetail, {
        params,
    });
}

export function onsaleGoodsSelection(params: { commodity_id: string; merchant_id: string }) {
    return request.get(SelectionApiPath.OnsaleGoodsSelection, {
        params,
    });
}

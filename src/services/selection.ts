import request from '@/utils/request';
import { SelectionApiPath } from '@/config/api/SelectionApiPath';
import {
    IQueryGoodsSelectionListReq,
    ISelectionGoodsItem,
    IGoodsDateItem,
} from '@/interface/ISelection';
import { IResponse } from '@/interface/IGlobal';

export function queryGoodsSelectionList(data: IQueryGoodsSelectionListReq) {
    return request.post<IResponse<{ model_list: ISelectionGoodsItem[]; total: string }>>(
        SelectionApiPath.QueryGoodsSelectionList,
        {
            data,
        },
    );
}

export function deleteGoodsSelection(data: {
    commodity_id: string;
    merchant_id: string;
    start_date: number;
    end_date: number;
}) {
    return request.post(SelectionApiPath.DeleteGoodsSelection, {
        data,
    });
}

export function exportGoodsSelection(data: IQueryGoodsSelectionListReq) {
    return request.post(SelectionApiPath.ExportGoodsSelection, {
        data,
    });
}

export function queryGoodsSelectionDetail(data: { commodity_id: string; merchant_id: string }) {
    return request.post<
        IResponse<{ explosion_day: string[]; history_detail: { [key: string]: IGoodsDateItem } }>
    >(SelectionApiPath.QueryGoodsSelectionDetail, {
        data,
    });
}

export function onsaleGoodsSelection(params: { commodity_id: string; merchant_id: string }) {
    return request.get(SelectionApiPath.OnsaleGoodsSelection, {
        params,
    });
}

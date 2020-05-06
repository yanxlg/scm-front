import request from '@/utils/request';
import { StockApiPathEnum } from '@/config/api/StockApiPathEnum';
import { IPaginationResponse, IResponse, RequestPagination } from '@/interface/IGlobal';
import { transPaginationRequest } from '@/utils/utils';
import {
    IStockINFormData,
    IStockInItem,
    IStockOUTFormData,
    IStockOutItem,
    IStockRequest,
    IStockItem,
} from '@/interface/IStock';
import { IPurchaseItem } from '@/interface/IPurchase';
import { EmptyObject } from '@/config/global';

export function queryInList(data: IStockINFormData & RequestPagination) {
    return request.post<IResponse<IPaginationResponse<IStockInItem>>>(
        StockApiPathEnum.QueryInList,
        {
            data: transPaginationRequest(data),
        },
    );
}

export function queryOutList(data: IStockOUTFormData & RequestPagination) {
    return request
        .post<IResponse<IPaginationResponse<IStockOutItem>>>(StockApiPathEnum.QueryOutList, {
            data: transPaginationRequest(data),
        })
        .then(({ data: { list = [], ...extra } }) => {
            let _list: IStockOutItem[] = [];
            list.forEach(source => {
                const { orderGoods = [] } = source;
                if (orderGoods && orderGoods.length > 0) {
                    orderGoods.map((info, index) => {
                        _list.push({
                            ...source,
                            ...info,
                            rowSpan: index === 0 ? orderGoods.length : 0,
                        });
                    });
                } else {
                    _list.push({
                        ...source,
                        rowSpan: 1,
                    });
                }
            });
            return {
                data: {
                    list: _list,
                    ...extra,
                },
            };
        });
}

export function exportInList(data: IStockINFormData) {
    return request.post(StockApiPathEnum.ExportInList, {
        data: data,
    });
}

export function exportOutList(data: IStockOUTFormData) {
    return request.post(StockApiPathEnum.ExportOutList, {
        data: data,
    });
}

export function queryStockList(data: IStockRequest & RequestPagination) {
    return request.post<IResponse<IPaginationResponse<IStockItem>>>(
        StockApiPathEnum.QueryStockList,
        {
            data: transPaginationRequest(data),
        },
    );
}

export function exportStockList(data: IStockRequest) {
    return request.post(StockApiPathEnum.ExportStockList, {
        data: data,
    });
}

export function syncStock() {
    return request.post(StockApiPathEnum.SyncStock);
}

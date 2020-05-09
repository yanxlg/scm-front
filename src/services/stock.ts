import request from '@/utils/request';
import { StockApiPathEnum } from '@/config/api/StockApiPathEnum';
import {
    IStockINFormData,
    IStockInItem,
    IStockOUTFormData,
    IStockOutItem,
    IStockRequest,
    IStockItem,
    Ilogistic,
} from '@/interface/IStock';
import { IPaginationResponse, IResponse } from 'react-components/es/hooks/useList';
import { IRequestPagination1 } from '@/interface/IGlobal';
import { api } from 'react-components';
import { singlePromiseWrap } from '@/utils/utils';
import { ISHopList } from '@/interface/IChannel';
import { ChannelApiPath } from '@/config/api/ChannelApiPath';

export function queryInList(data: IStockINFormData & IRequestPagination1) {
    return api.post<IResponse<IPaginationResponse<IStockInItem>>>(StockApiPathEnum.QueryInList, {
        data: data,
    });
}

export function queryOutList(data: IStockOUTFormData & IRequestPagination1) {
    return api
        .post<IResponse<IPaginationResponse<IStockOutItem>>>(StockApiPathEnum.QueryOutList, {
            data: data,
        })
        .then(({ data: { list = [], ...extra }, ...others }) => {
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
                ...others,
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

export function queryStockList(data: IStockRequest & IRequestPagination1) {
    return api.post<IResponse<IPaginationResponse<IStockItem>>>(StockApiPathEnum.QueryStockList, {
        data: data,
    });
}

export function exportStockList(data: IStockRequest) {
    return request.post(StockApiPathEnum.ExportStockList, {
        data: data,
    });
}

export function syncStock() {
    return request.post(StockApiPathEnum.SyncStock);
}

export const queryLogistics = singlePromiseWrap(() => {
    return request.get<IResponse<Ilogistic[]>>(StockApiPathEnum.QueryLogistics);
});

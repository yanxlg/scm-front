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

export function queryInList(data: IStockINFormData & RequestPagination) {
    return request.post<IResponse<IPaginationResponse<IStockInItem>>>(
        StockApiPathEnum.QueryInList,
        {
            data: transPaginationRequest(data),
        },
    );
}

export function queryOutList(data: IStockOUTFormData & RequestPagination) {
    return request.post<IResponse<IPaginationResponse<IStockOutItem>>>(
        StockApiPathEnum.QueryOutList,
        {
            data: transPaginationRequest(data),
        },
    );
}

export function exportInList(data: IStockINFormData) {
    return request
        .post(StockApiPathEnum.ExportInList, {
            data: data,
            responseType: 'blob',
            parseResponse: false,
        })
        .then(response => {
            const disposition = response.headers.get('content-disposition');
            const fileName = decodeURI(
                disposition.substring(disposition.indexOf('filename=') + 9, disposition.length),
            );
            response.blob().then((blob: Blob) => {
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', fileName);
                document.body.appendChild(link);
                link.click();
                link.remove();
            });
        });
}

export function exportOutList(data: IStockOUTFormData) {
    return request
        .post(StockApiPathEnum.ExportOutList, {
            data: data,
            responseType: 'blob',
            parseResponse: false,
        })
        .then(response => {
            const disposition = response.headers.get('content-disposition');
            const fileName = decodeURI(
                disposition.substring(disposition.indexOf('filename=') + 9, disposition.length),
            );
            response.blob().then((blob: Blob) => {
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', fileName);
                document.body.appendChild(link);
                link.click();
                link.remove();
            });
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
    return request
        .post(StockApiPathEnum.ExportStockList, {
            data: data,
            responseType: 'blob',
            parseResponse: false,
        })
        .then(response => {
            const disposition = response.headers.get('content-disposition');
            const fileName = decodeURI(
                disposition.substring(disposition.indexOf('filename=') + 9, disposition.length),
            );
            response.blob().then((blob: Blob) => {
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', fileName);
                document.body.appendChild(link);
                link.click();
                link.remove();
            });
        });
}

export function syncStock() {
    return request.post(StockApiPathEnum.SyncStock);
}

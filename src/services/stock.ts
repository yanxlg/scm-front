import { IStockINFormData, IStockOUTFormData } from '@/pages/stock/components/InOutStock';
import request from '@/utils/request';
import { StockApiPathEnum } from '@/config/api/StockApiPathEnum';
import { IRequestPagination } from '@/interface/IGlobal';
import { IStockFormData } from '@/pages/stock/components/StockControl';
import Stock from '@/pages/stock';
import { StockType } from '@/config/dictionaries/Stock';

export function queryInList(data: IStockINFormData) {
    return request.post(StockApiPathEnum.QueryInList, {
        data: data,
    });
}

export function queryOutList(data: IStockOUTFormData) {
    return request.post(StockApiPathEnum.QueryOutList, {
        data: data,
    });
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

export function queryStockList(data: IStockFormData) {
    return request.post(StockApiPathEnum.QueryStockList, {
        data: data,
    });
}

export function exportStockList(data: IStockFormData) {
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

import { IStockIOFormData } from '@/pages/stock/components/InOutStock';
import request from '@/utils/request';
import { StockApiPathEnum } from '@/config/api/StockApiPathEnum';
import { IRequestPagination } from '@/interface/IGlobal';
import { IStockFormData } from '@/pages/stock/components/StockControl';
import Stock from '@/pages/stock';
import { StockType } from '@/config/dictionaries/Stock';

export function queryIOList(data: IStockIOFormData & IRequestPagination) {
    const { type } = data;
    return type === StockType.In ? queryInList(data) : queryOutList(data);
}
export function queryInList(data: IStockIOFormData & IRequestPagination) {
    return request.post(StockApiPathEnum.QueryInList, {
        data: data,
    });
}

export function queryOutList(data: IStockIOFormData & IRequestPagination) {
    return request.post(StockApiPathEnum.QueryOutList, {
        data: data,
    });
}

export function exportIOList(data: IStockIOFormData) {
    return request
        .get(StockApiPathEnum.ExportIOList, {
            params: data,
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

export function queryStockList(data: IStockFormData & IRequestPagination) {
    return request.post(StockApiPathEnum.QueryStockList, {
        data: data,
    });
}

export function exportStockList(data: IStockFormData) {
    return request
        .get(StockApiPathEnum.ExportStockList, {
            params: data,
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

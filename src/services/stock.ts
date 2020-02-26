import { IFormData } from '@/pages/stock/components/InOutStock';
import request from '@/utils/request';
import { StockApiPathEnum } from '@/enums/StockApiPathEnum';
import { IRequestPagination } from '@/interface/IGlobal';

export function queryIOList(data: IFormData & IRequestPagination) {
    return request.post(StockApiPathEnum.QueryIOList, {
        data: data,
    });
}

export function exportIOList(data: IFormData) {
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

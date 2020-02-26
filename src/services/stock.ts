import { IFormData } from '@/pages/stock/components/InOutStock';
import request from '@/utils/request';
import { StockApiPathEnum } from '@/enums/StockApiPathEnum';

export function queryIOList(data: IFormData) {
    return request.post(StockApiPathEnum.QueryIOList, {
        data: data,
    });
}

import { IFormData } from '@/pages/stock/components/InOutStock';
import request from '@/utils/request';
import { StockApiPathEnum } from '@/enums/StockApiPathEnum';
import { IRequestPagination } from '@/interface/IGlobal';

export function queryIOList(data: IFormData & IRequestPagination) {
    return request.post(StockApiPathEnum.QueryIOList, {
        data: data,
    });
}

import { api } from 'react-components';
import { IPaginationResponse, IResponse } from '@/interface/IGlobal';
import { IPurchaseAbnormalRes } from '@/interface/IPurchase';
import { PurchaseApiPath } from '@/config/api/PurchaseApiPath';
import { transPaginationResponse } from '@/utils/utils';

export function getAbnormalAllList(params: any = { page: 1, page_number: 50 }) {
    // <IResponse<IPurchaseAbnormalRes>>
    return api.get(PurchaseApiPath.getAbnormalAllList, {
        params,
    }); //.then(transPaginationResponse);;
}

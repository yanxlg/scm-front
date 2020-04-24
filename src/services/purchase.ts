import { api } from 'react-components';
import { PurchaseApiPath } from '@/config/api/PurchaseApiPath';

export const queryPurchaseList = () => {
    return api.get(PurchaseApiPath.QueryList, {
        data: {},
    });
};

import { api } from 'react-components';
import { PurchaseApiPath } from '@/config/api/PurchaseApiPath';
import { IAddressConfig, IPurchaseStatics, IReturnStatics } from '@/interface/IPurchase';
import { IResponse } from '@/interface/IGlobal';

export const queryPurchaseList = (data: any) => {
    return api.post(PurchaseApiPath.QueryList, {
        data: {
            ...data,
        },
    });
};

export const queryReturnList = (data: any) => {
    const { time_type, ...extra } = data;
    return api.post(PurchaseApiPath.QueryReturnList, {
        data: {
            ...extra,
            time_type: time_type ? time_type[0] : undefined,
        },
    });
};

export const queryReturnStatic = () => {
    return api.get<IResponse<IReturnStatics>>(PurchaseApiPath.QueryReturnStatic);
};

export const queryAddressConfig = () => {
    return api.get<IResponse<IAddressConfig>>(PurchaseApiPath.QueryAddressConfig);
};

export const addReturn = (data: any) => {
    return api.post(PurchaseApiPath.AddReturn, {
        data: data,
    });
};

export const cancelReturnOrder = (purchase_order_goods_return_id: string) => {
    return api.post(PurchaseApiPath.CancelReturn, {
        data: {
            purchase_order_goods_return_id,
        },
    });
};

export const queryPurchaseStatic = () => {
    return api.get<IResponse<IPurchaseStatics>>(PurchaseApiPath.QueryPurchaseStatic);
};

export const exportReturnList = (data: any) => {
    return api.post(PurchaseApiPath.Export, {
        data: {
            module: 6,
            ...data,
        },
    });
};

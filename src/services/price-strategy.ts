import request from '@/utils/request';
import { getEnabledTagsList } from './goods-attr';
import { PriceStrategyApiPath } from '@/config/api/PriceStrategyApiPath';
import {
    IShippingCardListReq,
    IShippingCardListRes,
    IShippingFeeRuleReq,
    IShippingFeeRuleRes,
    ISaveShippingFeeRuleReq,
} from '@/interface/IPriceStrategy';
import { api } from 'react-components';
import { IResponse, IPaginationResponse } from 'react-components/lib/hooks/useList';

// 获取所有的商品标签
export function getAllGoodsTagList() {
    return getEnabledTagsList().then(({ data }) => {
        // console.log('getEnabledTagsList', res);
        return (
            data?.tags.map((item: any) => ({
                name: item.name,
                value: item.name,
            })) ?? []
        );
    });
}

// 获取所有的运费价卡名称
export function getShippingCardNameList() {
    return request.get(PriceStrategyApiPath.getShippingCardNameList).then(res => {
        const list = res?.data?.shipping_card_name_list ?? [];
        return list.map((name: string) => ({
            name: name,
            value: name,
        }));
    });
}

// 获取运费价卡 => 国家
export function getShippingCardCountry(names: string) {
    return request
        .get(PriceStrategyApiPath.getShippingCardCountry, {
            params: { card_name: names },
        })
        .then(res => {
            const list = res?.data?.country_code ?? [];
            return list.map((name: string) => ({
                name: name,
                value: name,
            }));
        });
}

// 获取运费规则列表
export function getShippingFeeRuleList(params: IShippingFeeRuleReq) {
    return api.get<IResponse<IPaginationResponse<IShippingFeeRuleRes>>>(
        PriceStrategyApiPath.getShippingFeeRuleList,
        {
            params,
        },
    );
}

// 保存和更新运费规则
export function saveShippingFeeRule(data: ISaveShippingFeeRuleReq) {
    return request.post(PriceStrategyApiPath.saveShippingFeeRule, {
        data,
    });
}

// 获取运费价卡列表
export function getShippingCardList(params: IShippingCardListReq) {
    return api.get<IResponse<IPaginationResponse<IShippingCardListRes>>>(
        PriceStrategyApiPath.getShippingCardList,
        {
            params,
        },
    );
}

// 保存和更新运费价卡
export function saveShippingCard(data: FormData) {
    return request.post(PriceStrategyApiPath.saveShippingCard, {
        data,
    });
}

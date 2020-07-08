import request from '@/utils/request';
import { getEnabledTagsList } from './goods-attr';
import { PriceStrategyApiPath } from '@/config/api/PriceStrategyApiPath';
import {
    IShippingCardListReq,
    IShippingCardListRes,
    IShippingFeeRuleReq,
    IShippingFeeRuleRes,
    ISaveShippingFeeRuleReq,
    IStartStrategyUpdateReq,
    ICatagoryWeightListReq,
    ICatagoryWeightListRes,
    ICatagoryWeightLogReq,
    ICatagoryWeightLogRes,
    ISaveSalePriceRuleReq,
    ISaleAndShippingOperateReq,
    IUpdateRecoreItem,
    ISellItem,
    ISalePriceListReq,
} from '@/interface/IPriceStrategy';
import { api } from 'react-components';
import { IResponse, IPaginationResponse } from 'react-components/es/hooks/useList';
import { getCatagoryList } from './goods';
import { getFilterShopIds, getFilterShopNames } from '@/services/global';
import { OrderApiPath } from '@/config/api/OrderApiPath';
import { ApiService } from 'react-components/es/api';
import { IOrderItem } from '@/interface/IOrder';

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

// 售价和运费修改日志
export function getSaleAndShippingOperateLog(params: ISaleAndShippingOperateReq) {
    return request.get(PriceStrategyApiPath.getSaleAndShippingOperateLog, {
        params,
    });
}

// 获取运费规则列表
export function getSalePriceList(params: ISalePriceListReq) {
    const { enable_merchant } = params;
    return {
        request: () =>
            getFilterShopIds(enable_merchant?.split(',')).then(enable_merchant => {
                return request.get(PriceStrategyApiPath.getSalePriceList, {
                    params: {
                        ...params,
                        enable_merchant: enable_merchant?.join(','),
                    },
                });
            }),
        cancel: () => {},
    } as ApiService<IResponse<IPaginationResponse<ISellItem>>>;
}

// 保存售价调整规则
export function saveSalePriceRule(data: ISaveSalePriceRuleReq) {
    return request.post(PriceStrategyApiPath.saveSalePriceRule, {
        data,
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

// 更新商品售价(圈定范围)
export function startPriceStrategyUpdate(data: IStartStrategyUpdateReq) {
    return request.post(PriceStrategyApiPath.startPriceStrategyUpdate, {
        data,
    });
}

// 获取品类预估重量列表
export function getCatagoryWeightList(params: ICatagoryWeightListReq) {
    return api.get<IResponse<IPaginationResponse<ICatagoryWeightListRes>>>(
        PriceStrategyApiPath.getCatagoryWeightList,
        {
            params,
        },
    );
}

// 品类预估重量保存
export function saveCatagoryWeight(data: FormData) {
    return request.post(PriceStrategyApiPath.saveCatagoryWeight, {
        data,
    });
}

// 品类预估重量日志
export function getCatagoryWeightLog(params: ICatagoryWeightLogReq) {
    return request
        .get<IResponse<IPaginationResponse<ICatagoryWeightLogRes>>>(
            PriceStrategyApiPath.getCatagoryWeightLog,
            {
                params,
            },
        )
        .then(({ data }) => {
            const { list, total } = data;
            return {
                list: list.map(({ operateContent, operatePeople, createTime }) => ({
                    operate_info: operateContent,
                    operator: operatePeople,
                    operate_time: createTime,
                })),
                total,
            };
        });
}

// 查询运费规则详情
export function getShippingFeeRuleConfig(id: string) {
    return request.get(PriceStrategyApiPath.getShippingFeeRuleConfig, {
        params: {
            id,
        },
    });
}

// 查询运费规则详情
export function getSalePriceRuleConfig(id: string) {
    return request.get(PriceStrategyApiPath.getSalePriceRuleConfig, {
        params: {
            id,
        },
    });
}

// 查询运费价卡对应的详情
export function getShippingCartDetail(card_name: string) {
    return request.get(PriceStrategyApiPath.getShippingCartDetail, {
        params: {
            card_name,
        },
    });
}

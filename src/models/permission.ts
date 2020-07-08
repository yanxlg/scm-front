import { Subscription, Reducer, Effect } from 'umi';
import { queryShopList } from '@/services/global';
import User from '@/storage/User';

interface IMerchantItem {
    name: string;
    value: string;
    disabled?: boolean;
    id?: string;
}

type IChannelMerchantTree = IMerchantItem & {
    children: Array<IMerchantItem>;
};

export interface PermissionModelState {
    merchantList?: Array<IMerchantItem>;
    channelMerchantTree?: Array<IChannelMerchantTree>;
    filterList?: Array<IChannelMerchantTree>;
    _merchantList?: Array<IMerchantItem>;
}

export interface PermissionModeType {
    namespace: 'permission';
    state: PermissionModelState;
    reducers: {
        update: Reducer<PermissionModelState>;
        refresh: Reducer<PermissionModelState>;
    };
    subscriptions?: {
        [key: string]: Subscription;
    };
    effects?: {
        queryMerchantList: Effect;
        refreshPermission: Effect;
    };
}

const PermissionModel: PermissionModeType = {
    namespace: 'permission',
    state: {},
    effects: {
        *queryMerchantList(action, { call, put }) {
            yield put({
                type: 'update',
                merchantList: undefined,
                channelMerchantTree: undefined,
                _merchantList: undefined,
            }); // 初始化，loading显示
            // 获取list
            try {
                const { data } = yield call(queryShopList); // 需要做权限过滤
                // 做权限过滤
                const dData = User.dData || [];
                const list = data.map((item: any) => {
                    return {
                        merchant_platform: item.merchant_platform,
                        name: item.merchant_name,
                        value: item.merchant_name,
                        id: item.merchant_id,
                        disabled: dData.indexOf(item.merchant_name) === -1,
                    };
                });

                const channelList: IChannelMerchantTree[] = [];
                const filterList: IChannelMerchantTree[] = [];
                const obj: any = {};
                let shopMap: { [key: string]: any } = {};

                list.forEach((item: any) => {
                    const { merchant_platform, value, name, id, disabled } = item;
                    const nameList = obj[merchant_platform];
                    !nameList && (obj[merchant_platform] = []);
                    obj[merchant_platform].push({
                        name: name,
                        value: value,
                        disabled: disabled,
                    });

                    if (shopMap[merchant_platform]) {
                        shopMap[merchant_platform] = ([] as Array<any>)
                            .concat(shopMap[merchant_platform])
                            .concat({
                                name: name,
                                value: id,
                                disabled: disabled,
                            });
                    } else {
                        shopMap[merchant_platform] = ([] as Array<any>).concat({
                            name: name,
                            value: id,
                            disabled: disabled,
                        });
                    }
                });
                Object.keys(obj).forEach(platform => {
                    const item: IChannelMerchantTree = {
                        name: platform,
                        value: platform,
                        children: obj[platform],
                    };
                    channelList.push(item);
                });

                for (let platform in shopMap) {
                    if (shopMap.hasOwnProperty(platform)) {
                        filterList.push({
                            name: platform,
                            value: platform,
                            children: shopMap[platform],
                        });
                    }
                }

                yield put({
                    type: 'update',
                    merchantList: list,
                    channelMerchantTree: channelList,
                    filterList: filterList,
                    _merchantList: data,
                });
            } catch (e) {
                yield put({
                    type: 'update',
                    merchantList: [],
                    channelMerchantTree: [],
                    _merchantList: [],
                });
            }
        },
        *refreshPermission(action, { call, put }) {
            yield put({ type: 'refresh' });
        },
    },
    reducers: {
        update(state, { merchantList, channelMerchantTree, filterList, _merchantList }) {
            return { ...state, merchantList, channelMerchantTree, filterList, _merchantList };
        },
        refresh(state) {
            // 刷新merchantList
            const { _merchantList } = state!;
            if (_merchantList && _merchantList.length) {
                const dData = User.dData || [];
                const list = _merchantList.map((item: any) => {
                    return {
                        merchant_platform: item.merchant_platform,
                        name: item.merchant_name,
                        value: item.merchant_name,
                        id: item.merchant_id,
                        disabled: dData.indexOf(item.merchant_name) === -1,
                    };
                });
                const channelList: IChannelMerchantTree[] = [];
                const filterList: IChannelMerchantTree[] = [];
                const obj: any = {};
                let shopMap: { [key: string]: any } = {};

                list.forEach((item: any) => {
                    const { merchant_platform, name, value, id, disabled } = item;
                    const nameList = obj[merchant_platform];
                    !nameList && (obj[merchant_platform] = []);
                    obj[merchant_platform].push({
                        name: name,
                        value: value,
                        disabled: disabled,
                    });

                    if (shopMap[merchant_platform]) {
                        shopMap[merchant_platform] = ([] as Array<any>)
                            .concat(shopMap[merchant_platform])
                            .concat({
                                name: name,
                                value: id,
                                disabled: disabled,
                            });
                    } else {
                        shopMap[merchant_platform] = ([] as Array<any>).concat({
                            name: name,
                            value: id,
                            disabled: disabled,
                        });
                    }
                });
                Object.keys(obj).forEach(platform => {
                    const item: IChannelMerchantTree = {
                        name: platform,
                        value: platform,
                        children: obj[platform],
                    };
                    channelList.push(item);
                });

                for (let platform in shopMap) {
                    if (shopMap.hasOwnProperty(platform)) {
                        filterList.push({
                            name: platform,
                            value: platform,
                            children: shopMap[platform],
                        });
                    }
                }
                return {
                    ...state,
                    merchantList: list,
                    channelMerchantTree: channelList,
                    filterList,
                };
            }
            return state!;
        },
    },
};

export default PermissionModel;

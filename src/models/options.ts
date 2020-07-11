import { Reducer } from 'redux';
import { Effect, Subscription } from '@@/plugin-dva/connect';
import { IOptionItem } from 'react-components/es/JsonForm/items/v2/Select';
import { queryChannels } from '@/services/global';
import { iterator } from 'react-components/es/utils/iterator';
import { queryErrorCodeConditions } from '@/services/setting';
import { ConnectState } from '@/models/connect';

export interface OptionsModelState {
    purchaseChannel?: IOptionItem[];

    platformErrorCode?: Array<IOptionItem>;
    platformErrorLabel?: Array<IOptionItem>;
    platformErrorMap?: { [key: string]: string };
    platformErrorList?: Array<IOptionItem>;
    orderErrorCode?: Array<IOptionItem>;
    channelErrorCode?: Array<IOptionItem>;
    channelErrorLabel?: Array<IOptionItem>;
}

export interface OptionsModelType {
    namespace: 'options';
    state: OptionsModelState;
    reducers: {
        update: Reducer<OptionsModelState>;
    };
    subscriptions?: {
        [key: string]: Subscription;
    };
    effects?: {
        channel: Effect;
        queryErrorCode: Effect;
        purchaseError: Effect;
    };
}

const OptionsModel: OptionsModelType = {
    namespace: 'options',
    state: {},
    effects: {
        /**
         * 采购渠道字典
         * @param action
         * @param call
         * @param put
         */
        *channel(action, { call, put }) {
            yield put({
                type: 'update',
                purchaseChannel: undefined,
            });
            try {
                const { data } = yield call(queryChannels);
                const list = iterator(data, (key, value) => {
                    return {
                        label: value,
                        value: key,
                    };
                });
                yield put({
                    type: 'update',
                    purchaseChannel: list,
                });
            } catch (e) {
                yield put({
                    type: 'update',
                    purchaseChannel: [],
                });
            }
        },
        /**
         * 中台采购错误码配置页面字典
         * @param action
         * @param call
         * @param put
         */
        *queryErrorCode(action, { call, put }) {
            const {
                data: { middle_info, order_code, channel_code, channel_text },
            } = yield call(queryErrorCodeConditions, 1);
            let platformErrorCodeSet = new Set();
            let platformErrorLabelSet = new Set();
            let platformErrorMap: { [key: string]: string } = {};
            middle_info.forEach(({ middle_code = '', middle_text = '' }) => {
                platformErrorCodeSet.add(middle_code);
                if (middle_text) {
                    platformErrorLabelSet.add(middle_text);
                }
                platformErrorMap[middle_code] = middle_text;
            });
            yield put({
                type: 'update',
                platformErrorCode: Array.from(platformErrorCodeSet).map(value => ({
                    label: value,
                    value,
                })),
                platformErrorLabel: Array.from(platformErrorLabelSet).map(value => ({
                    label: value,
                    value,
                })),
                orderErrorCode: order_code.map((value: string) => ({ label: value, value: value })),
                channelErrorCode: channel_code.map((value: string) => ({
                    label: value,
                    value: value,
                })),
                channelErrorLabel: channel_text.filter(Boolean).map((value: string) => ({
                    label: value,
                    value: value,
                })),
                platformErrorMap,
            });
        },
        /**
         * 中台采购错误码字典
         * @param action
         * @param call
         * @param put
         * @param select
         */
        *purchaseError(action, { call, put, select }) {
            // 如果已经存在则不调用接口
            const oldValue = yield select((state: ConnectState) => state.options.platformErrorList);
            if (oldValue && oldValue.length) {
                return;
            }
            const {
                data: { middle_info },
            } = yield call(queryErrorCodeConditions);
            let platformErrorList: Array<IOptionItem> = [];
            let platformErrorMap: { [key: string]: string } = {};
            middle_info.forEach(({ middle_code = '', middle_text = '' }) => {
                platformErrorList.push({
                    label: middle_text,
                    value: middle_code,
                });
                platformErrorMap[middle_code] = middle_text;
            });
            yield put({
                type: 'update',
                platformErrorList,
                platformErrorMap,
            });
        },
    },
    reducers: {
        update(state, { type, ...merge }) {
            return {
                ...state,
                ...merge,
            };
        },
    },
};

export default OptionsModel;

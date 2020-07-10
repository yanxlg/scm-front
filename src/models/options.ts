import { Reducer } from 'redux';
import { Effect, Subscription } from '@@/plugin-dva/connect';
import { IOptionItem } from 'react-components/es/JsonForm/items/v2/Select';
import { queryChannels } from '@/services/global';
import { iterator } from 'react-components/es/utils/iterator';
import { queryErrorCodeConditions } from '@/services/setting';

export interface OptionsModelState {
    purchaseChannel?: IOptionItem[];

    platformErrorCode?: Array<IOptionItem>;
    platformErrorLabel?: Array<IOptionItem>;
    platformErrorMap?: { [key: string]: string };
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
    };
}

const OptionsModel: OptionsModelType = {
    namespace: 'options',
    state: {},
    effects: {
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
        *queryErrorCode(action, { call, put }) {
            const {
                data: { middle_info, order_code, channel_code, channel_text },
            } = yield call(queryErrorCodeConditions);
            let platformErrorCodeSet = new Set();
            let platformErrorLabelSet = new Set();
            let platformErrorMap: { [key: string]: string } = {};
            middle_info.forEach(({ middle_code, middle_text }) => {
                platformErrorCodeSet.add(middle_code);
                platformErrorLabelSet.add(middle_text);
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
                channelErrorLabel: channel_text.map((value: string) => ({
                    label: value,
                    value: value,
                })),
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

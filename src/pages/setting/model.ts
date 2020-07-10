import { Subscription, Reducer } from 'umi';
import { IOptionItem } from 'react-components/es/JsonForm/items/Select';
import { Effect } from '@@/plugin-dva/connect';
import { queryErrorCodeConditions } from '@/services/setting';

export interface SettingModeState {
    platformErrorCode?: Array<IOptionItem>;
    platformErrorLabel?: Array<IOptionItem>;
    orderErrorCode?: Array<IOptionItem>;
    channelErrorCode?: Array<IOptionItem>;
    channelErrorLabel?: Array<IOptionItem>;
}

export interface SettingModeType {
    namespace: 'setting';
    state: SettingModeState;
    reducers: {
        update: Reducer<SettingModeState>;
    };
    subscriptions?: {
        [key: string]: Subscription;
    };
    effects?: {
        queryErrorCode: Effect;
    };
}

const SettingModel: SettingModeType = {
    namespace: 'setting',
    state: {},
    effects: {
        *queryErrorCode(action, { call, put }) {
            const {
                data: { middle_code, middle_text, order_code, channel_code, channel_text },
            } = yield call(queryErrorCodeConditions);
            yield put({
                type: 'update',
                platformErrorCode: middle_code.map((value: string) => ({
                    name: value,
                    value: value,
                })),
                platformErrorLabel: middle_text.map((value: string) => ({
                    name: value,
                    value: value,
                })),
                orderErrorCode: order_code.map((value: string) => ({ name: value, value: value })),
                channelErrorCode: channel_code.map((value: string) => ({
                    name: value,
                    value: value,
                })),
                channelErrorLabel: channel_text.map((value: string) => ({
                    name: value,
                    value: value,
                })),
            });
        },
    },
    reducers: {
        update(
            state,
            {
                platformErrorCode,
                platformErrorLabel,
                orderErrorCode,
                channelErrorCode,
                channelErrorLabel,
            },
        ) {
            return {
                ...state,
                platformErrorCode,
                platformErrorLabel,
                orderErrorCode,
                channelErrorCode,
                channelErrorLabel,
            };
        },
    },
};

export default SettingModel;

import { Subscription, Reducer } from 'umi';
import { IOptionItem } from 'react-components/es/JsonForm/items/Select';
import { Effect } from '@@/plugin-dva/connect';

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
        *queryErrorCode(action, { call, put }) {},
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

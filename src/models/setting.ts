import { Subscription, Reducer, Effect, Action } from 'umi';

interface TableConfig {
    hideKeys?: string[];
    sortKeys?: string[];
}

export interface SettingModelState {
    table: {
        [key: string]: TableConfig;
    };
}

export interface SettingModeType {
    namespace: 'setting';
    state: SettingModelState;
    reducers: {
        updateTableConfig: Reducer<
            SettingModelState,
            {
                key: string;
                config: TableConfig;
            } & Action
        >;
    };
    subscriptions?: {
        [key: string]: Subscription;
    };
    effects?: {
        queryRoleSimpleList: Effect;
    };
}

const SettingModel: SettingModeType = {
    namespace: 'setting',
    state: {
        table: {},
    },
    reducers: {
        updateTableConfig(
            state,
            { key, config: { sortKeys: nextSortKeys, hideKeys: nextHideKeys } },
        ) {
            const hideKeys = state?.table?.[key]?.hideKeys;
            const sortKeys = state?.table?.[key]?.sortKeys;
            return {
                ...state,
                table: {
                    ...state?.table,
                    [key]: {
                        sortKeys: nextSortKeys || sortKeys,
                        hideKeys: nextHideKeys || hideKeys,
                    },
                },
            };
        },
    },
};

export default SettingModel;

import { AnyAction, Dispatch, Reducer } from 'redux';
import { History } from 'history';

export interface GlobalModelState {
    collapsed?: boolean;
    queryData?: {
        [key: string]: any;
    };
}

export interface GlobalModelType {
    namespace: 'global';
    state: GlobalModelState;
    reducers: {
        changeLayoutCollapsed: Reducer<GlobalModelState>;
        cacheQueryData: Reducer<GlobalModelState>;
    };
    subscriptions?: {
        [key: string]: (params: {
            dispatch: Dispatch<AnyAction>;
            history: History;
        }) => (() => void) | void;
    };
}

const GlobalModel: GlobalModelType = {
    namespace: 'global',
    state: {
        collapsed: false,
        queryData: {},
    },
    /*   subscriptions: {
        history({ dispatch, history }) {
            return history.listen(() => {
                dispatch({
                    type: 'cacheQueryData',
                    queryData: undefined,
                });
            });
        },
    },*/
    reducers: {
        changeLayoutCollapsed(state = { collapsed: true }, { payload }): GlobalModelState {
            return {
                ...state,
                collapsed: payload,
            };
        },
        cacheQueryData(state = {}, { queryData }) {
            return {
                ...state,
                queryData: queryData,
            };
        },
    },
};

export default GlobalModel;

'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const GlobalModel = {
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
        changeLayoutCollapsed(state = { collapsed: true }, { payload }) {
            return Object.assign(Object.assign({}, state), { collapsed: payload });
        },
        cacheQueryData(state = {}, { queryData }) {
            return Object.assign(Object.assign({}, state), { queryData: queryData });
        },
    },
};
exports.default = GlobalModel;
//# sourceMappingURL=global.js.map

import { Subscription, Reducer, Effect } from 'umi';
import { queryRoleSimpleList } from '@/services/global';

export interface ISimpleRole {
    value: string;
    name: string;
}

export interface AccountModelState {
    roleSimpleList?: ISimpleRole[];
    roleSimpleNameList?: ISimpleRole[];
}

export interface AccountModeType {
    namespace: 'account';
    state: AccountModelState;
    reducers: {
        update: Reducer<AccountModelState>;
    };
    subscriptions?: {
        [key: string]: Subscription;
    };
    effects?: {
        queryRoleSimpleList: Effect;
    };
}

const AccountModel: AccountModeType = {
    namespace: 'account',
    state: {},
    effects: {
        *queryRoleSimpleList(action, { call, put }) {
            yield put({ type: 'update', roleSimpleList: undefined }); // 初始化，loading显示
            // 获取list
            try {
                const data = yield call(queryRoleSimpleList);
                yield put({ type: 'update', roleSimpleList: data });
            } catch (e) {
                yield put({ type: 'update', roleSimpleList: [] });
            }
        },
    },
    reducers: {
        update(state, { roleSimpleList }) {
            return {
                ...state,
                roleSimpleList,
                roleSimpleNameList: roleSimpleList?.map(
                    ({ name, value }: { name: string; value: string }) => ({
                        name: name,
                        value: name,
                    }),
                ),
            };
        },
    },
};

export default AccountModel;

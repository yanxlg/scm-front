import { AnyAction, Dispatch } from 'redux';
import { MenuDataItem } from '@ant-design/pro-layout';
import { RouterTypes } from 'umi';
import { GlobalModelState } from './global';

export { GlobalModelState };

export interface ConnectState {
    global: GlobalModelState;
}

export interface Route extends MenuDataItem {
    routes?: Route[];
}

/**
 * @type T: Params matched in dynamic routing
 */
export interface ConnectProps<T = {}> extends Partial<RouterTypes<Route, T>> {
    dispatch?: Dispatch<AnyAction>;
}

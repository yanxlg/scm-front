import { AnyAction, Dispatch } from 'redux';
import { MenuDataItem } from '@ant-design/pro-layout';
import { GlobalModelState } from './global';
import { RouterTypes } from '@ant-design/pro-layout/es/typings';

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
export interface ConnectProps<T = {}> extends Partial<RouterTypes<T>> {
    dispatch?: Dispatch<AnyAction>;
}

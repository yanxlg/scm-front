import { GlobalModelState } from './global';
import { AccountModelState } from '@/models/account';
import { PermissionModelState } from '@/models/permission';
import { OptionsModelState } from '@/models/options';

export { GlobalModelState };

export interface ConnectState {
    global: GlobalModelState;
    account: AccountModelState;
    permission: PermissionModelState;
    options: OptionsModelState;
}

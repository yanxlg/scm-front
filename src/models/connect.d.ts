import { GlobalModelState } from './global';
import { AccountModelState } from '@/models/account';
import { PermissionModelState } from '@/models/permission';

export interface ConnectState {
    global: GlobalModelState;
    account: AccountModelState;
    permission: PermissionModelState;
}

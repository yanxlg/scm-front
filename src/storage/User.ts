import { IPermissionTree } from 'rc-permission/es/Provider';

declare interface IUser {
    userName?: string;
    password?: string;
    token?: string;
    pData?: IPermissionTree;
}
/**
 * 用户信息管理类，跟localStorage进行绑定
 */
class User {
    private static _user: IUser;
    public static get localUser(): IUser {
        if (this._user) {
            return this._user;
        }
        try {
            this._user = JSON.parse(localStorage.getItem('_user') || '{}');
            return this._user;
        } catch (e) {
            return {};
        }
    }
    public static setUser(user: IUser) {
        this._user = user;
        localStorage.setItem('_user', JSON.stringify(this._user));
    }
    public static updatePData(pData: IPermissionTree) {
        this._user.pData = pData;
        this.setUser(this._user);
    }
    public static get userName() {
        return this.localUser.userName;
    }
    public static get password() {
        return this.localUser.password;
    }
    public static get token() {
        return this.localUser.token;
    }
    public static get pData() {
        return this.localUser.pData;
    }
    public static clear() {
        this._user = (undefined as unknown) as IUser;
        localStorage.removeItem('_user');
    }
    public static clearToken() {
        this._user.token = undefined;
        this.setUser(this._user);
    }
}

export default User;

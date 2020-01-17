/**
 * 登录权限路由，如果页面需要控制登录权限则在yaml注释中配置该路由
 * 该路由仅拦截本地登录校验，无法判断登录过期，合法问题，此类问题在请求拦截器中处理
 */

import React from "react";
import {router} from "dva";
import {  RouteProps } from 'dva/router';
import User from '@/storage/User';

const {Route, Redirect} = router;

const AuthRouter:React.FC<RouteProps> = (props) => {
    return User.token?<Route {...props} /> : <Redirect to="/login" />
};

export default AuthRouter;

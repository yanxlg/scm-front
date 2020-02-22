/**
 * 登录权限路由，如果页面需要控制登录权限则在yaml注释中配置该路由
 * 该路由仅拦截本地登录校验，无法判断登录过期，合法问题，此类问题在请求拦截器中处理
 */

import React, { useEffect, useMemo } from 'react';
import {router} from "dva";
import {  RouteProps } from 'dva/router';
import { getCookie } from '@/utils/common';

const {Route} = router;

const cookie = getCookie("JSESSIONID");

const Login:React.FC = ()=>{
    useEffect(()=>{
        window.location.href="https://cas-t.vova.com.hk/cas/login?service=https://scm-front-t.vova.com.hk/auth/cas_login";
    },[]);
    return useMemo(()=>{
        return <div/>
    },[]);
};

const AuthRouter:React.FC<RouteProps> = (props) => {
    return cookie?<Route {...props} /> : <Login/>
};

export default AuthRouter;

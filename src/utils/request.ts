/**
 * request 网络请求工具
 * 更详细的 api 文档: https://github.com/umijs/umi-request
 */

import User from '@/storage/User';
import { request } from 'react-components';
import { history } from '@@/core/history';
import { RequestOptionsInit } from 'umi-request';

// 全局拦截器
request.interceptors.request.use((url: string, options: RequestOptionsInit) => {
    if (User.token) {
        options.headers = Object.assign({}, options.headers, {
            Authorization: User.token,
        });
    }
    return {
        url,
        options,
    };
});

request.interceptors.response.use((response, options) => {
    const { status } = response;
    if (status === 401) {
        User.clear();
        history.replace('/login');
        throw response;
    }
    if (status === 403) {
        // 前端有权限，api没权限，刷新前端权限数据
    }
    return response;
});

if (!User.token && !/^\/login/.test(window.location.pathname)) {
    history.replace('/login');
}

export default request;

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

if (!User.token && !/^\/login/.test(window.location.pathname)) {
    history.replace('/login');
}

request.interceptors.response.use((response, options) => {
    const { status } = response;
    if (status === 401) {
        User.clearToken();
        history.replace(`/login?redirect=${window.location.href}`);
        throw response;
    }
    return response;
});

export default request;

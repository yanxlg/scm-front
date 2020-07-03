/**
 * request 网络请求工具
 * 更详细的 api 文档: https://github.com/umijs/umi-request
 */

import User from '@/storage/User';
import { request } from 'react-components';
import { history } from '@@/core/history';
import { RequestOptionsInit, ResponseError } from 'umi-request';
import { message } from 'antd';

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
        // 原来应该有问题
        throw {
            type: 'AuthorizationError',
            data: response.body,
        };
    }
    if (status === 403) {
        let skipResponseInterceptors = options?.skipResponseInterceptors;
        if (skipResponseInterceptors) {
            // 需要提示权限问题
            message.error(`403：用户得到授权，但是访问是被禁止的。`); // 强制提示权限错误
        }
    }
    return response;
});

export default request;

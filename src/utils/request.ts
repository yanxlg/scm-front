/**
 * request 网络请求工具
 * 更详细的 api 文档: https://github.com/umijs/umi-request
 */

import User from '@/storage/User';
import { request } from 'react-components';
import { RequestOptionsInit } from 'umi-request';

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

export default request;

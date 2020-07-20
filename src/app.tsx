import formatter from 'react-components/es/utils/formatter';
import { arrayNumber, firstNumber, multipleToArray, plainToArr } from '@/utils/formatter';
import 'nprogress/nprogress.css';
import NProgress from 'nprogress';
import { Modal, Tooltip } from 'antd';
import { loadingConfig } from '@/loading';
import React from 'react';
import { PermissionProvider } from 'rc-permission';
import User from '@/storage/User';
import { history } from '@@/core/history';
import Page from '@/pages/403';
import DragAndDrop from '../../react-components/src/FitTable/DragDropProvider';
NProgress.configure({ showSpinner: false });

const develop = process.env.NODE_ENV !== 'production';

export const dva = {
    config: {
        onError(err: ErrorEvent) {
            err.preventDefault();
        },
    },
    plugins: develop ? [require('dva-logger')()] : [],
};

// performance
window.addEventListener('load', function() {
    const performance = window.performance;
    if (performance) {
        let e: any = performance.getEntriesByType('navigation')[0];
        let r = 0;
        e || (r = (e = performance.timing).navigationStart);
        const n = [
            {
                key: 'Redirect',
                desc: '\u7f51\u9875\u91cd\u5b9a\u5411\u7684\u8017\u65f6',
                value: e.redirectEnd - e.redirectStart,
            },
            {
                key: 'AppCache',
                desc: '\u68c0\u67e5\u672c\u5730\u7f13\u5b58\u7684\u8017\u65f6',
                value: e.domainLookupStart - e.fetchStart,
            },
            {
                key: 'DNS',
                desc: 'DNS\u67e5\u8be2\u7684\u8017\u65f6',
                value: e.domainLookupEnd - e.domainLookupStart,
            },
            {
                key: 'TCP',
                desc: 'TCP\u8fde\u63a5\u7684\u8017\u65f6',
                value: e.connectEnd - e.connectStart,
            },
            {
                key: 'Waiting(TTFB)',
                desc:
                    '\u4ece\u5ba2\u6237\u7aef\u53d1\u8d77\u8bf7\u6c42\u5230\u63a5\u6536\u5230\u54cd\u5e94\u7684\u65f6\u95f4 / Time To First Byte',
                value: e.responseStart - e.requestStart,
            },
            {
                key: 'Content Download',
                desc: '\u4e0b\u8f7d\u670d\u52a1\u7aef\u8fd4\u56de\u6570\u636e\u7684\u65f6\u95f4',
                value: e.responseEnd - e.responseStart,
            },
            {
                key: 'HTTP Total Time',
                desc: 'http\u8bf7\u6c42\u603b\u8017\u65f6',
                value: e.responseEnd - e.requestStart,
            },
            {
                key: 'DOMContentLoaded',
                desc: 'dom\u52a0\u8f7d\u5b8c\u6210\u7684\u65f6\u95f4',
                value: e.domContentLoadedEventEnd - r,
            },
            {
                key: 'Loaded',
                desc: '\u9875\u9762load\u7684\u603b\u8017\u65f6',
                value: e.loadEventEnd - r,
            },
        ];
        // tslint:disable-next-line:no-console
        console && console.table && console.table(n);
    }
});

// formatter 扩展

declare module 'react-components' {
    interface Formatters {
        multipleToArray: typeof multipleToArray;
        firstNumber: typeof firstNumber;
        arrayNumber: typeof arrayNumber;
        plainToArr: typeof plainToArr;
    }
}
formatter.extend({
    multipleToArray: multipleToArray,
    firstNumber: firstNumber,
    arrayNumber: arrayNumber,
    plainToArr: plainToArr,
});

// 进度条精度优化
export function onRouteChange({
    location,
    routes,
    action,
}: {
    location: Location;
    routes: any[];
    action: string;
}) {
    Modal.destroyAll();
    // 滚动条自动滚动到顶部
    if (loadingConfig.timer) {
        clearTimeout(loadingConfig.timer);
        loadingConfig.timer = undefined;
        NProgress.remove();
    }
    NProgress.start();
    NProgress.inc();
    loadingConfig.timer = window.setTimeout(() => {
        NProgress.done();
        loadingConfig.timer = undefined;
    }, 200 + Math.floor(Math.random() * 300));
}

export const rootContainer = (container: any) => {
    return React.createElement(
        PermissionProvider,
        {
            format: 'flat',
            checkLogin: () => !!User.token,
            history: history,
            Page_403: <Page />,
            pTree: User.pData, // 缓存权限列表
            toolTipWrap: <Tooltip title="" trigger={'click'} />,
            defaultToolTip: '账号无此权限，请联系管理员！',
        },
        container,
    );
};

/*export function render(oldRender: any) {
    // 使用原有权限，同时刷新权限
    queryUserPermission().then(({ data }) => {
        const pData: IPermissionTree = {};
        data.forEach(item => {
            pData[item.data] = {};
        });
        User.updatePData(pData);
    });
}*/

// 动态权限路由配置
/*let extraRoutes;
export function patchRoutes({ routes }) {
    merge(routes, extraRoutes);
}
export function render() {
    fetch('/api/routes').then(res => {
        extraRoutes = res.routes;
    });
}*/

// service worker
window.addEventListener('load', function() {
    // tslint:disable-next-line:no-console
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker
            .register('/sw.js')
            .then(function(reg) {
                reg.onupdatefound = function() {
                    const installingWorker = reg.installing;
                    if (installingWorker) {
                        installingWorker.onstatechange = function() {
                            switch (installingWorker.state) {
                                case 'installed':
                                    if (navigator.serviceWorker.controller) {
                                        // tslint:disable-next-line:no-console
                                        console.log('New or updated content is available.');
                                    } else {
                                        // tslint:disable-next-line:no-console
                                        console.log('Content is now available offline!');
                                    }
                                    break;
                                case 'redundant':
                                    // tslint:disable-next-line:no-console
                                    console.error(
                                        'The installing service worker became redundant.',
                                    );
                                    break;
                            }
                        };
                    }
                };
            })
            .catch(function(e) {
                // tslint:disable-next-line:no-console
                console.error('Error during service worker registration:', e);
            });
    }
});

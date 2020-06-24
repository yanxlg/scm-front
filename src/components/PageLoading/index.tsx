import React, { useEffect, useMemo } from 'react';
import { PageLoading } from '@ant-design/pro-layout';
import NProgress from 'nprogress';
import { loadingConfig } from '@/loading';

export default () => {
    useEffect(() => {
        if (loadingConfig.timer) {
            clearTimeout(loadingConfig.timer);
            loadingConfig.timer = undefined;
        }
        return () => {
            // render结束，关闭进度
            loadingConfig.timer = window.setTimeout(() => {
                NProgress.done(); // 强制结束
            }, 200 + Math.floor(Math.random() * 300));
        };
    }, []);
    return useMemo(() => <PageLoading />, []);
};

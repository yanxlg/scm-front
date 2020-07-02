import React, { useContext, useEffect } from 'react';
import BasicLayout from './BasicLayout';
import { queryUserPermission } from '@/services/global';
import { IPermissionTree } from 'rc-permission/es/Provider';
import User from '@/storage/User';
import { PermissionContext } from 'rc-permission';

export default function(props: any) {
    const pathname = props.location.pathname;
    const { updateTree } = useContext(PermissionContext);
    useEffect(() => {
        // 刷新权限
        if (!/^\/login/.test(pathname)) {
            // 更新权限
            queryUserPermission().then(({ data }) => {
                const pData: IPermissionTree = {};
                data.forEach(item => {
                    pData[item.data] = {};
                });
                User.updatePData(pData);
                updateTree(pData);
            });
        }
    }, []);

    if (/^\/login/.test(pathname) || pathname === '/404' || pathname === '/500') {
        return props.children;
    }
    return <BasicLayout {...props} />;
}

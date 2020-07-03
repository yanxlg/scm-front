import React, { useContext, useEffect } from 'react';
import BasicLayout from './BasicLayout';
import { queryUserPermission } from '@/services/global';
import { IPermissionTree } from 'rc-permission/es/Provider';
import User from '@/storage/User';
import { PermissionContext } from 'rc-permission';
import { useDispatch } from '@@/plugin-dva/exports';

export default function(props: any) {
    const pathname = props.location.pathname;
    const { updateTree } = useContext(PermissionContext);
    const dispatch = useDispatch();

    useEffect(() => {
        // 刷新权限
        if (!/^\/login/.test(pathname)) {
            // 更新权限
            queryUserPermission().then(({ data }) => {
                const pData: IPermissionTree = {};
                const oldDData = User.dData;
                const dataPermission: string[] = [];
                data.forEach(item => {
                    if (item.type === '2') {
                        pData[item.data] = {};
                    } else if (item.type === '1') {
                        dataPermission.push(item.data);
                    }
                });
                User.updatePData(pData);
                updateTree(pData);
                if (JSON.stringify(oldDData) !== JSON.stringify(dataPermission)) {
                    User.updateDData(dataPermission); // 数据权限，需要刷新数据权限中所有数据
                    dispatch({
                        type: 'permission/refreshPermission',
                    });
                }
            });
        }
    }, []);

    if (/^\/login/.test(pathname) || pathname === '/404' || pathname === '/500') {
        return props.children;
    }
    return <BasicLayout {...props} />;
}

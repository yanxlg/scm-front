import React, { useContext } from 'react';
import { Redirect } from 'react-router';
import menus from '@/config/menu';
import { PermissionContext } from 'rc-permission';
import { IPermissionTree } from 'rc-permission/es/Provider';

let routes: Array<{
    path: string;
    pid?: string;
}> = [];

menus.forEach(({ path, children, pid, hideInMenu }, index) => {
    if (path !== '/' && !hideInMenu) {
        if (children && children.length) {
            routes.push(...children.filter(child => !child.hideInMenu));
        } else {
            routes.push({
                path,
                pid,
            });
        }
    }
});

const getPermissionRoot = (pTree?: IPermissionTree) => {
    let path,
        i = 0,
        length = routes.length;
    while (!path && i < length) {
        const route = routes[i];
        if (route.pid === void 0 || (pTree && pTree[route.pid])) {
            path = route.path;
        } else {
            i++;
        }
    }
    return path || '/403';
};

const Index: React.FC = () => {
    const { pTree } = useContext(PermissionContext);
    const path = getPermissionRoot(pTree);
    return <Redirect to={path} />;
};

export default Index;

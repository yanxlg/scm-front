import React from 'react';

import styles from './_index.less';
import { Breadcrumb, Button } from 'antd';
import { genBreadcrumbProps } from '@ant-design/pro-layout/es/utils/getBreadcrumbProps';
import { BasicLayoutProps, getMenuData, MenuDataItem } from '@ant-design/pro-layout';
import CopyLink from '@/components/copyLink';
import { matchPath } from 'dva/router';

export type SiderTheme = 'light' | 'dark';
export interface GlobalHeaderRightProps extends BasicLayoutProps {
    theme?: SiderTheme;
    layout?: 'sidemenu' | 'topmenu';
    breadcrumb?: {
        [path: string]: MenuDataItem;
    };
}

const GlobalHeaderRight: React.FC<GlobalHeaderRightProps> = props => {
    const { route = {}, menu, formatMessage, menuDataRender, itemRender } = props;
    const { routes = [] } = route;
    const { breadcrumbMap, breadcrumb } = getMenuData(routes, menu, formatMessage, menuDataRender);
    const breadcrumbData = genBreadcrumbProps(
        Object.assign({}, props, {
            breadcrumbMap: breadcrumbMap,
        }),
    );
    const currentRoute = routes.find(_ =>
        matchPath(props.location!.pathname!, {
            path: _.path,
            exact: _.exact,
        }),
    );
    const routePath = currentRoute?.path;
    const menuConfig = routePath ? breadcrumb[routePath] : undefined;
    const copyLink = menuConfig?.copyLink ?? false;
    return (
        <div>
            {breadcrumbData ? (
                <Breadcrumb
                    className={styles.breadcrumb}
                    routes={breadcrumbData}
                    itemRender={itemRender}
                />
            ) : null}
            <div className={styles.right}>
                用户名，
                <Button
                    type="link"
                    className="padding-none"
                    onClick={() => {
                        // alert('退出');
                    }}
                >
                    退出
                </Button>
            </div>
            {copyLink && <CopyLink />}
        </div>
    );
};

export default GlobalHeaderRight;

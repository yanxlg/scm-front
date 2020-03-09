import React from 'react';

import styles from './_index.less';
import { Breadcrumb, Button } from 'antd';
import { genBreadcrumbProps } from '@ant-design/pro-layout/es/utils/getBreadcrumbProps';
import { BasicLayoutProps, getMenuData, MenuDataItem } from '@ant-design/pro-layout';
import CopyLink from '@/components/copyLink';
import { matchPath } from 'dva/router';
import { connect } from 'dva';
import { ConnectState } from '@/models/connect';

export type SiderTheme = 'light' | 'dark';
export interface GlobalHeaderRightProps extends BasicLayoutProps {
    theme?: SiderTheme;
    layout?: 'sidemenu' | 'topmenu';
    breadcrumb?: {
        [path: string]: MenuDataItem;
    };
    queryData?: { [key: string]: any };
}

const GlobalHeaderRight: React.FC<GlobalHeaderRightProps> = props => {
    const { route = {}, menu, formatMessage, menuDataRender, itemRender, queryData } = props;
    const { routes = [] } = route;
    const { breadcrumbMap } = getMenuData(routes, menu, formatMessage, menuDataRender);
    const breadcrumbData = genBreadcrumbProps(
        Object.assign({}, props, {
            breadcrumbMap: breadcrumbMap,
        }),
    );
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
            {queryData ? <CopyLink /> : null}
        </div>
    );
};

export default connect(({ global }: ConnectState) => ({
    queryData: global.queryData,
}))(GlobalHeaderRight);

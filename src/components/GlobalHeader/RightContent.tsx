import React from 'react';

import styles from './index.less';
import { Breadcrumb } from 'antd';
import { genBreadcrumbProps } from '@ant-design/pro-layout/es/utils/getBreadcrumbProps';
import { BasicLayoutProps, getMenuData, MenuDataItem } from '@ant-design/pro-layout';

export type SiderTheme = 'light' | 'dark';
export interface GlobalHeaderRightProps extends BasicLayoutProps{
    theme?: SiderTheme;
    layout?: 'sidemenu' | 'topmenu';
    breadcrumb?: {
        [path: string]: MenuDataItem;
    };
}

const GlobalHeaderRight: React.FC<GlobalHeaderRightProps> = props => {
    const { theme, layout } = props;
    let className = styles.right;
    if (theme === 'dark' && layout === 'topmenu') {
        className = `${styles.right}  ${styles.dark}`;
    }
    const {route={},menu,formatMessage,menuDataRender,itemRender} = props;
    const { routes = [] } = route;
    const {breadcrumbMap} = getMenuData(routes,menu,formatMessage,menuDataRender);
    const breadcrumbData = genBreadcrumbProps(Object.assign({},props,{
        breadcrumbMap:breadcrumbMap
    }));
    return (
      <div>
          {
              breadcrumbData ? <Breadcrumb className={styles.breadcrumb} routes={breadcrumbData} itemRender={itemRender}/> : null}
          <div className={className}>
              用户名，退出
          </div>
      </div>
    );
};

export default GlobalHeaderRight

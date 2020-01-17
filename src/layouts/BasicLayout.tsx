/**
 * Ant Design Pro v4 use `@ant-design/pro-layout` to handle Layout.
 * You can view component api by:
 * https://github.com/ant-design/ant-design-pro-layout
 */
import ProLayout, {
    MenuDataItem,
    BasicLayoutProps as ProLayoutProps,
    Settings,
} from '@ant-design/pro-layout';
import React, { useEffect } from 'react';
import Link from 'umi/link';
import { Dispatch } from 'redux';
import { connect } from 'dva';
import RightContent from '@/components/GlobalHeader/RightContent';
import { ConnectState } from '@/models/connect';
import logo from '../assets/logo.svg';

export interface BasicLayoutProps extends ProLayoutProps {
    breadcrumbNameMap: {
        [path: string]: MenuDataItem;
    };
    settings: Settings;
    dispatch: Dispatch;
}

const BasicLayout: React.FC<BasicLayoutProps> = props => {
    const { dispatch, children, settings, user } = props;
    /**
     * constructor
     */

/*    useEffect(() => {
        if (!user.isLogin && dispatch) {
            dispatch({
                type: 'user/getUserAndMenu',
            });
            dispatch({
                type: 'settings/getSetting',
            });
        }
    }, []);*/
    /**
     * init variables
     */

    const handleMenuCollapse = (payload: boolean): void => {
        if (dispatch) {
            dispatch({
                type: 'global/changeLayoutCollapsed',
                payload,
            });
        }
    };

    return (
        <ProLayout
            multiple={false}
            logo={logo}
            onCollapse={handleMenuCollapse}
            menuItemRender={(menuItemProps, defaultDom) => {
                if (menuItemProps.isUrl) {
                    return defaultDom;
                }

                return <Link to={menuItemProps.path}>{defaultDom}</Link>;
            }}
            breadcrumbRender={(routers = []) => {
                return [
                    {
                        path: '/',
                        breadcrumbName: '首页',
                    },
                    ...routers,
                ];
            }}
            itemRender={(route, params, routes) => {
                const last = routes.indexOf(route) === routes.length - 1;

                if (route.path === '/') {
                    return null;
                } // 删除首页

                return !last ? (
                    <Link to={route.path}>{route.breadcrumbName}</Link>
                ) : (
                    <span>{route.breadcrumbName}</span>
                );
            }}
            footerRender={false}
            menuDataRender={() =>[]}
            rightContentRender={rightProps => <RightContent {...rightProps} />}
            {...props}
            {...settings}
        >
            {children}
        </ProLayout>
    );
};

export default connect(({ global, user }: ConnectState) => ({
    collapsed: global.collapsed,
    user,
}))(BasicLayout);

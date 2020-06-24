import ProLayout, {
    MenuDataItem,
    BasicLayoutProps as ProLayoutProps,
} from '@ant-design/pro-layout';
import React, { useCallback, useMemo } from 'react';
import { Link } from 'umi';
import { Dispatch } from 'redux';
import RightContent from '@/components/GlobalHeader/RightContent';
import { ConnectState } from '@/models/connect';
import logo from '../assets/logo.png';
import MenuData from '@/config/menu';
import '@/styles/menu.less';
import '@/styles/index.less';
import { useDispatch, useSelector } from '@@/plugin-dva/exports';
import { shallowEqual } from 'react-redux';

export interface BasicLayoutProps extends ProLayoutProps {
    breadcrumbNameMap: {
        [path: string]: MenuDataItem;
    };
    dispatch: Dispatch;
}

const MenuDataList = MenuData.map(item => {
    // filter
    return item as any;
});

const BasicLayout: React.FC<BasicLayoutProps> = props => {
    const dispatch = useDispatch();
    const collapsed = useSelector((state: ConnectState) => state.global.collapsed, shallowEqual);

    const handleMenuCollapse = useCallback((payload: boolean): void => {
        dispatch({
            type: 'global/changeLayoutCollapsed',
            payload,
        });
    }, []);

    return useMemo(() => {
        return (
            <ProLayout
                collapsed={collapsed}
                multiple={false}
                menu={{ locale: false }}
                logo={<img src={logo} className="menu-logo" alt="" />}
                title="供应链中台"
                onCollapse={handleMenuCollapse}
                menuItemRender={(menuItemProps, defaultDom) => {
                    if (menuItemProps.isUrl) {
                        return defaultDom;
                    }

                    return <Link to={menuItemProps.path!}>{defaultDom}</Link>;
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
                    const first = routes.indexOf(route) === 0;

                    if (route.path === '/') {
                        return null;
                    } // 删除首页

                    return !last && !first ? (
                        <Link to={route.path}>{route.breadcrumbName}</Link>
                    ) : (
                        <span>{route.breadcrumbName}</span>
                    );
                }}
                footerRender={false}
                menuDataRender={() => MenuDataList}
                rightContentRender={rightProps => <RightContent {...rightProps} />}
                fixSiderbar={true}
                fixedHeader={true}
                // links={[<div key="1" className="menu-link">草稿箱（9999999）</div>]}
                {...props}
            />
        );
    }, [props, collapsed]);
};

export default BasicLayout;

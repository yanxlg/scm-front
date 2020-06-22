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
import 'nprogress/nprogress.css';
import '@/styles/menu.less';
import '@/styles/index.less';
import { useDispatch, useSelector } from '@@/plugin-dva/exports';
import { Modal } from 'antd';
import NProgress from 'nprogress';
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

NProgress.configure({ showSpinner: false });

let timer: number | undefined = undefined;

const BasicLayout: React.FC<BasicLayoutProps> = props => {
    const dispatch = useDispatch();
    const collapsed = useSelector((state: ConnectState) => state.global.collapsed, shallowEqual);

    const handleMenuCollapse = useCallback((payload: boolean): void => {
        dispatch({
            type: 'global/changeLayoutCollapsed',
            payload,
        });
    }, []);

    const onPageChange = useCallback(() => {
        Modal.destroyAll();
        // 滚动条自动滚动到顶部
        if (timer) {
            clearTimeout(timer);
            timer = undefined;
            NProgress.remove();
        }
        NProgress.start();
        NProgress.inc();
        timer = window.setTimeout(() => {
            NProgress.done();
            timer = undefined;
        }, 200 + Math.floor(Math.random() * 300));
    }, []);

    return useMemo(() => {
        return (
            <ProLayout
                onPageChange={onPageChange}
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

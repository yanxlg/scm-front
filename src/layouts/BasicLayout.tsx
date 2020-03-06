import ProLayout, {
    MenuDataItem,
    BasicLayoutProps as ProLayoutProps,
} from '@ant-design/pro-layout';
import React from 'react';
import Link from 'umi/link';
import { Dispatch } from 'redux';
import { connect } from 'dva';
import RightContent from '@/components/GlobalHeader/RightContent';
import { ConnectState } from '@/models/connect';
import logo from '../assets/logo.png';
import MenuData from '@/config/menu';
import 'nprogress/nprogress.css';
import '@/styles/menu.less';

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

class BasicLayout extends React.PureComponent<BasicLayoutProps> {
    private handleMenuCollapse = (payload: boolean): void => {
        const { dispatch } = this.props;
        if (dispatch) {
            dispatch({
                type: 'global/changeLayoutCollapsed',
                payload,
            });
        }
    };

    render() {
        const { children, dispatch, ...props } = this.props;
        return (
            <ProLayout
                multiple={false}
                logo={<img src={logo} className="menu-logo" alt="" />}
                title="供应链中台"
                onCollapse={this.handleMenuCollapse}
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
            >
                {children}
            </ProLayout>
        );
    }
}

export default connect(({ global }: ConnectState) => ({
    collapsed: global.collapsed,
}))(BasicLayout);

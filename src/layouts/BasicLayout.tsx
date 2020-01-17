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
import logo from '../assets/logo.svg';
import MenuData from "@/config/menu.json";

export interface BasicLayoutProps extends ProLayoutProps {
    breadcrumbNameMap: {
        [path: string]: MenuDataItem;
    };
    dispatch: Dispatch;
}

class BasicLayout extends React.PureComponent<BasicLayoutProps>{
    private handleMenuCollapse = (payload: boolean): void => {
        const {dispatch} = this.props;
        if (dispatch) {
            dispatch({
                type: 'global/changeLayoutCollapsed',
                payload,
            });
        }
    };
    render(){
        const {children,dispatch,...props} = this.props;
        return (
            <ProLayout
                multiple={false}
                logo={logo}
                onCollapse={this.handleMenuCollapse}
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
                menuDataRender={() =>MenuData}
                rightContentRender={rightProps => <RightContent {...rightProps} />}
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

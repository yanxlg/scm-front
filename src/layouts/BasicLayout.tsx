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
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import "@/styles/menu.less";

export interface BasicLayoutProps extends ProLayoutProps {
    breadcrumbNameMap: {
        [path: string]: MenuDataItem;
    };
    dispatch: Dispatch;
}


let timer:number|undefined = undefined;
NProgress.configure({ showSpinner: false });

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
    public static getDerivedStateFromProps(nextProps:BasicLayoutProps){
        if(timer){
            clearTimeout(timer);
            timer = undefined;
            NProgress.remove();
        }
        NProgress.start();
        NProgress.inc();
        timer=window.setTimeout(()=>{
            NProgress.done();
        },200+Math.floor(Math.random()*300));
    }
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

                    return !last&&!first ? (
                        <Link to={route.path}>{route.breadcrumbName}</Link>
                    ) : (
                        <span>{route.breadcrumbName}</span>
                    );
                }}
                footerRender={false}
                menuDataRender={() =>MenuData}
                rightContentRender={rightProps => <RightContent {...rightProps} />}
                fixSiderbar={true}
                fixedHeader={true}
                links={[<div key="1" className="menu-link">草稿箱（9999999）</div>]}
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

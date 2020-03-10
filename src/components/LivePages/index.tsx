import React from 'react';

import { matchPath } from 'dva/router';
import { RouteComponentProps } from 'react-router';

import styles from './_index.less';

declare interface IRouter {
    path: string;
    extract?: boolean;
    component: React.ComponentType<RouteComponentProps<any>> | React.ComponentType<any>;
}

declare interface ILivePagesProps extends RouteComponentProps {
    routers: IRouter[];
}

declare interface IRouterListItem extends IRouter, RouteComponentProps {}

class LivePages extends React.PureComponent<ILivePagesProps> {
    private routerList: IRouterListItem[] = [];
    private getRouterList() {
        const { routers, location, history, ...props } = this.props;
        let activeIndex: number | undefined = undefined;
        routers.forEach((router, index) => {
            const match = matchPath(location.pathname, router);
            const route = this.routerList[index] || { ...router };
            if (match) {
                route.match = match;
                if (activeIndex === void 0) {
                    activeIndex = index;
                }
            }
            route.location = location;
            route.history = history;
            this.routerList[index] = { ...route, ...props };
        });
        return {
            routerList: this.routerList,
            activeIndex,
        };
    }
    render() {
        const { activeIndex, routerList } = this.getRouterList();
        return (
            <React.Fragment>
                {routerList.map(({ component: Component, path, ...props }, index) => {
                    return (
                        <div
                            key={path}
                            className={activeIndex === index ? styles.pageShow : styles.pageHide}
                        >
                            <Component {...props} />
                        </div>
                    );
                })}
            </React.Fragment>
        );
    }
}

export { LivePages };

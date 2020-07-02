import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Container from '@/components/Container';
import { Tabs } from 'antd';
import AllList from './components/return/all';
import PendingSigned from '@/pages/purchase/components/return/pendingSigned';
import PendingOut from '@/pages/purchase/components/return/pendingOut';
import Over from '@/pages/purchase/components/return/over';
import { queryReturnStatic } from '@/services/purchase';
import { IReturnStatics } from '@/interface/IPurchase';
import { PermissionRouterWrap, PermissionComponent } from 'rc-permission';
import ForbiddenComponent from '@/components/ForbiddenComponent';
const TabPane = Tabs.TabPane;

const List = () => {
    const [statics, setStatics] = useState<IReturnStatics>({});
    const request = queryReturnStatic();

    const getStatics = useCallback(() => {
        request.request().then(({ data }) => {
            setStatics(data);
        });
    }, []);

    useEffect(() => {
        getStatics();
        return () => {
            request.cancel();
        };
    }, []);

    const getStaticsNumber = useCallback((num?: number) => {
        return num === void 0 ? '' : `（${num}）`;
    }, []);

    return useMemo(() => {
        const { total, wait_outbound_total, wait_delivery_total, finished_total } = statics;
        return (
            <Container>
                <Tabs
                    className="tabs-margin-none"
                    defaultActiveKey="1"
                    type="card"
                    children={[
                        <TabPane tab={`全部${getStaticsNumber(total)}`} key="1">
                            <PermissionComponent
                                pid="purchase/return/tab"
                                fallback={() => <ForbiddenComponent />}
                            >
                                <AllList reloadStatics={getStatics} />
                            </PermissionComponent>
                        </TabPane>,
                        <TabPane tab={`待出库${getStaticsNumber(wait_outbound_total)}`} key="2">
                            <PermissionComponent
                                pid="purchase/return/tab"
                                fallback={() => <ForbiddenComponent />}
                            >
                                <PendingOut />
                            </PermissionComponent>
                        </TabPane>,
                        <TabPane tab={`待收货${getStaticsNumber(wait_delivery_total)}`} key="3">
                            <PermissionComponent
                                pid="purchase/return/tab"
                                fallback={() => <ForbiddenComponent />}
                            >
                                <PendingSigned />
                            </PermissionComponent>
                        </TabPane>,
                        <TabPane tab={`已完结${getStaticsNumber(finished_total)}`} key="4">
                            <PermissionComponent
                                pid="purchase/return/tab"
                                fallback={() => <ForbiddenComponent />}
                            >
                                <Over />
                            </PermissionComponent>
                        </TabPane>,
                    ]}
                />
            </Container>
        );
    }, [statics]);
};

export default PermissionRouterWrap(List, {
    login: true,
    pid: 'purchase/return',
});

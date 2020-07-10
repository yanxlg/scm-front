import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Container from '@/components/Container';
import { Tabs } from 'antd';
import AllList from '@/pages/purchase/components/list/all';
import PendingShipped from '@/pages/purchase/components/list/pendingShipped';
import PendingSigned from '@/pages/purchase/components/list/pendingSigned';
import PendingStorage from './components/list/pendingStorage';
import Warehousing from './components/list/warehousing';
import Over from './components/list/over';
import Return from './components/list/return';
import { IPurchaseStatics } from '@/interface/IPurchase';
import { queryPurchaseStatic } from '@/services/purchase';
import { PermissionRouterWrap, PermissionComponent } from 'rc-permission';
import ForbiddenComponent from '@/components/ForbiddenComponent';
const TabPane = Tabs.TabPane;

const List = () => {
    const [statics, setStatics] = useState<IPurchaseStatics>({});
    const request = queryPurchaseStatic();

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
        const {
            all_total,
            finish_total,
            wait_in_total,
            wait_send_total,
            wait_recieve_total,
            some_in_total,
            purchase_refund_total,
        } = statics;
        return (
            <Container>
                <Tabs
                    className="tabs-margin-none"
                    defaultActiveKey="1"
                    type="card"
                    children={[
                        <TabPane tab={`全部${getStaticsNumber(all_total)}`} key="1">
                            <PermissionComponent
                                pid="purchase/list/tab"
                                fallback={() => <ForbiddenComponent />}
                            >
                                <AllList />
                            </PermissionComponent>
                        </TabPane>,
                        <TabPane tab={`待发货${getStaticsNumber(wait_send_total)}`} key="2">
                            <PermissionComponent
                                pid="purchase/list/tab"
                                fallback={() => <ForbiddenComponent />}
                            >
                                <PendingShipped />
                            </PermissionComponent>
                        </TabPane>,
                        <TabPane tab={`待签收${getStaticsNumber(wait_recieve_total)}`} key="3">
                            <PermissionComponent
                                pid="purchase/list/tab"
                                fallback={() => <ForbiddenComponent />}
                            >
                                <PendingSigned />
                            </PermissionComponent>
                        </TabPane>,
                        <TabPane tab={`待入库${getStaticsNumber(wait_in_total)}`} key="4">
                            <PermissionComponent
                                pid="purchase/list/tab"
                                fallback={() => <ForbiddenComponent />}
                            >
                                <PendingStorage />
                            </PermissionComponent>
                        </TabPane>,
                        <TabPane tab={`部分入库${getStaticsNumber(some_in_total)}`} key="5">
                            <PermissionComponent
                                pid="purchase/list/tab"
                                fallback={() => <ForbiddenComponent />}
                            >
                                <Warehousing />
                            </PermissionComponent>
                        </TabPane>,
                        <TabPane tab={`已完结${getStaticsNumber(finish_total)}`} key="6">
                            <PermissionComponent
                                pid="purchase/list/tab"
                                fallback={() => <ForbiddenComponent />}
                            >
                                <Over />
                            </PermissionComponent>
                        </TabPane>,
                        <TabPane tab={`采购退款${getStaticsNumber(purchase_refund_total)}`} key="7">
                            <PermissionComponent
                                pid="purchase/list/tab"
                                fallback={() => <ForbiddenComponent />}
                            >
                                <Return />
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
    pid: 'purchase/list',
});

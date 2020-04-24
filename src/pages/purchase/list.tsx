import React, { useMemo } from 'react';
import Container from '@/components/Container';
import { Tabs } from 'antd';
import AllList from '@/pages/purchase/components/list/all';
import PendingShipped from '@/pages/purchase/components/list/pendingShipped';
import PendingSigned from '@/pages/purchase/components/list/pendingSigned';
import PendingStorage from './components/list/pendingStorage';
import Warehousing from './components/list/warehousing';
import Over from './components/list/over';
import Return from './components/list/return';
const TabPane = Tabs.TabPane;

const List = () => {
    return useMemo(() => {
        return (
            <Container>
                <Tabs
                    className="tabs-margin-none"
                    defaultActiveKey="1"
                    type="card"
                    children={[
                        <TabPane tab="全部" key="1">
                            <AllList />
                        </TabPane>,
                        <TabPane tab="待发货" key="2">
                            <PendingShipped />
                        </TabPane>,
                        <TabPane tab="待签收" key="3">
                            <PendingSigned />
                        </TabPane>,
                        <TabPane tab="待入库" key="4">
                            <PendingStorage />
                        </TabPane>,
                        <TabPane tab="部分入库" key="5">
                            <Warehousing />
                        </TabPane>,
                        <TabPane tab="已完结" key="6">
                            <Over />
                        </TabPane>,
                        <TabPane tab="采购退款" key="7">
                            <Return />
                        </TabPane>,
                    ]}
                />
            </Container>
        );
    }, []);
};

export default List;

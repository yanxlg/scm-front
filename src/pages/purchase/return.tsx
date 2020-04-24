import React, { useMemo } from 'react';
import Container from '@/components/Container';
import { Tabs } from 'antd';
import AllList from './components/return/all';
import PendingSigned from '@/pages/purchase/components/return/pendingSigned';
import PendingOut from '@/pages/purchase/components/return/pendingOut';
import Over from '@/pages/purchase/components/return/over';
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
                        <TabPane tab="待出库" key="2">
                            <PendingOut />
                        </TabPane>,
                        <TabPane tab="待收货" key="3">
                            <PendingSigned />
                        </TabPane>,
                        <TabPane tab="已完结" key="4">
                            <Over />
                        </TabPane>,
                    ]}
                />
            </Container>
        );
    }, []);
};

export default List;

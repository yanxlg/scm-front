import React, { useMemo } from 'react';
import { Tabs } from 'antd';
import Container from '@/components/Container';
import PaneAbnormalAll from './components/PaneAbnormalAll';

const { TabPane } = Tabs;

const Purchase: React.FC = props => {
    return useMemo(() => {
        return (
            <Container>
                <Tabs defaultActiveKey="1" type="card">
                    <TabPane tab="全部" key="1">
                        <PaneAbnormalAll />
                    </TabPane>
                    <TabPane tab="待处理" key="2">
                        Content of card tab 2
                    </TabPane>
                    <TabPane tab="处理中" key="3">
                        Content of card tab 3
                    </TabPane>
                    <TabPane tab="已完结" key="4">
                        Content of card tab 4
                    </TabPane>
                </Tabs>
            </Container>
        );
    }, []);
};

export default Purchase;

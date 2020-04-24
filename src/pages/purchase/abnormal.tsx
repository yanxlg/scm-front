import React, { useMemo } from 'react';
import { Tabs } from 'antd';
import Container from '@/components/Container';
import PaneAbnormalAll from './components/PaneAbnormalAll';
import PaneAbnormalPending from './components/PaneAbnormalPending';
import PaneAbnormalProcessing from './components/PaneAbnormalProcessing';
import PaneAbnormalEnd from './components/PaneAbnormalEnd';

const { TabPane } = Tabs;

const Purchase: React.FC = props => {
    return useMemo(() => {
        return (
            <Container>
                <Tabs defaultActiveKey="3" type="card">
                    <TabPane tab="全部" key="1">
                        <PaneAbnormalAll />
                    </TabPane>
                    <TabPane tab="待处理" key="2">
                        <PaneAbnormalPending />
                    </TabPane>
                    <TabPane tab="处理中" key="3">
                        <PaneAbnormalProcessing />
                    </TabPane>
                    <TabPane tab="已完结" key="4">
                        <PaneAbnormalEnd />
                    </TabPane>
                </Tabs>
            </Container>
        );
    }, []);
};

export default Purchase;

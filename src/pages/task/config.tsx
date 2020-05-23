import React, { useMemo } from 'react';
import { Tabs } from 'antd';
import HotGather from '@/pages/task/components/editor/HotGather';
import '@/styles/index.less';
import TimerUpdate from '@/pages/task/components/editor/TimerUpdate';
import AutoPurchaseTask from '@/pages/task/components/editor/AutoPurchaseTask';
import Container from '@/components/Container';
import { VoVaGather } from '@/pages/task/components/editor/VoVaGather';

const { TabPane } = Tabs;

const Config: React.FC = () => {
    return useMemo(() => {
        return (
            <Container>
                <Tabs
                    className="tabs-margin-none"
                    defaultActiveKey="1"
                    type="card"
                    children={[
                        /*<TabPane tab="指定URL采集" key="1">
                            <URLGather />
                        </TabPane>,*/
                        <TabPane tab="PDD热销款采集" key="1">
                            <HotGather />
                        </TabPane>,
                        <TabPane tab="vova商品采集" key="2">
                            <VoVaGather />
                        </TabPane>,
                        <TabPane tab="定时商品更新" key="3">
                            <TimerUpdate />
                        </TabPane>,
                        <TabPane tab="自动采购任务" key="4">
                            <AutoPurchaseTask />
                        </TabPane>,
                    ]}
                />
            </Container>
        );
    }, []);
};

export default Config;

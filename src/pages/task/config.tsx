import React, { useCallback, useMemo, useState } from 'react';
import { Tabs } from 'antd';
import HotGather from '@/pages/task/components/HotGather';
import '@/styles/index.less';
import URLGather from '@/pages/task/components/URLGather';
import TimerUpdate from '@/pages/task/components/TimerUpdate';
import AutoPurchaseTask from '@/pages/task/components/AutoPurchaseTask';

const { TabPane } = Tabs;

const Config: React.FC = (props: {}) => {
    const [activeKey, setActiveKey] = useState('2');
    const onChange = useCallback((activeKey: string) => setActiveKey(activeKey), []);
    return useMemo(() => {
        return (
            <div className="container">
                <Tabs
                    className="tabs-margin-none"
                    onChange={onChange}
                    activeKey={activeKey}
                    type="card"
                    children={[
                        <TabPane tab="指定URL采集" key="1">
                            <URLGather />
                        </TabPane>,
                        <TabPane tab="热销款采集" key="2">
                            <HotGather />
                        </TabPane>,
                        <TabPane tab="定时商品更新" key="3">
                            <TimerUpdate />
                        </TabPane>,
                        <TabPane tab="自动采购任务" key="4">
                            <AutoPurchaseTask />
                        </TabPane>,
                    ]}
                />
            </div>
        );
    }, [activeKey, props]);
};

export default Config;

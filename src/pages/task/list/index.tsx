import React, { useCallback, useMemo, useState } from 'react';
import { Tabs } from 'antd';
import ALLTaskPage from '@/pages/task/components/ALLTaskPage';
import '@/styles/index.less';
import { TaskStatus } from '@/enums/StatusEnum';

const { TabPane } = Tabs;

const Index: React.FC = (props: {}) => {
    const [activeKey, setActiveKey] = useState('1');
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
                        <TabPane tab="全部任务" key="1">
                            <ALLTaskPage />
                        </TabPane>,
                        <TabPane tab="未执行" key="2">
                            <ALLTaskPage task_status={TaskStatus.UnExecuted} />
                        </TabPane>,
                        <TabPane tab="执行中" key="3">
                            <ALLTaskPage task_status={TaskStatus.Executing} />
                        </TabPane>,
                        <TabPane tab="已执行" key="4">
                            <ALLTaskPage task_status={TaskStatus.Executed} />
                        </TabPane>,
                        <TabPane tab="执行失败" key="5">
                            <ALLTaskPage task_status={TaskStatus.Failed} />
                        </TabPane>,
                        <TabPane tab="已终止" key="6">
                            <ALLTaskPage task_status={TaskStatus.Terminated} />
                        </TabPane>,
                    ]}
                />
            </div>
        );
    }, [activeKey, props]);
};

export default Index;

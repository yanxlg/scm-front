import React, { useCallback, useMemo, useState } from 'react';
import { Tabs } from 'antd';
import ALLTaskPage from '@/pages/task/components/ALLTaskPage';
import '@/styles/index.less';
import { TaskStatusEnum } from '@/enums/StatusEnum';
import { RouteComponentProps } from 'dva/router';
import { ITaskListQuery } from '@/interface/ITask';

const { TabPane } = Tabs;

type LocalPageProps = RouteComponentProps<{}, any, ITaskListQuery>;

const Index: React.FC<LocalPageProps> = props => {
    const [activeKey, setActiveKey] = useState('1');
    const [countArr, setCountArr] = useState<number[]>([]);
    const onChange = useCallback((activeKey: string) => setActiveKey(activeKey), []);
    return useMemo(() => {
        const initialValues = props.location.state;
        const [count1, count2, count3, count4, count5, count6] = countArr;
        return (
            <div className="container">
                <Tabs
                    className="tabs-margin-none"
                    onChange={onChange}
                    activeKey={activeKey}
                    type="card"
                    children={[
                        <TabPane tab={`全部任务${count1 === void 0 ? '' : `(${count1})`}`} key="1">
                            <ALLTaskPage initialValues={initialValues} setCountArr={setCountArr} />
                        </TabPane>,
                        <TabPane tab={`未执行${count1 === void 0 ? '' : `(${count2})`}`} key="2">
                            <ALLTaskPage
                                task_status={TaskStatusEnum.UnExecuted}
                                setCountArr={setCountArr}
                            />
                        </TabPane>,
                        <TabPane tab={`执行中${count1 === void 0 ? '' : `(${count3})`}`} key="3">
                            <ALLTaskPage
                                task_status={TaskStatusEnum.Executing}
                                setCountArr={setCountArr}
                            />
                        </TabPane>,
                        <TabPane tab={`已发送${count1 === void 0 ? '' : `(${count4})`}`} key="4">
                            <ALLTaskPage
                                task_status={TaskStatusEnum.Executed}
                                setCountArr={setCountArr}
                            />
                        </TabPane>,
                        <TabPane tab={`执行失败${count1 === void 0 ? '' : `(${count5})`}`} key="5">
                            <ALLTaskPage
                                task_status={TaskStatusEnum.Failed}
                                setCountArr={setCountArr}
                            />
                        </TabPane>,
                        <TabPane tab={`已终止${count1 === void 0 ? '' : `(${count6})`}`} key="6">
                            <ALLTaskPage
                                task_status={TaskStatusEnum.Terminated}
                                setCountArr={setCountArr}
                            />
                        </TabPane>,
                    ]}
                />
            </div>
        );
    }, [activeKey, props, countArr]);
};

export default Index;

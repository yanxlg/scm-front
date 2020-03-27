import React, { useMemo, useState } from 'react';
import { Tabs } from 'antd';
import '@/styles/index.less';
import { TaskStatusEnum } from '@/enums/StatusEnum';
import { RouteComponentProps } from 'react-router';
import { ITaskListQuery } from '@/interface/ITask';
import queryString from 'query-string';
import TaskListTab from '@/pages/task/components/TaskListTab';
import Container from '@/components/Container';

const { TabPane } = Tabs;

type LocalPageProps = RouteComponentProps<{}, any, ITaskListQuery>;

const Index: React.FC<LocalPageProps> = props => {
    const [countArr, setCountArr] = useState<number[]>([]);
    const { query } = queryString.parseUrl(window.location.href);
    const defaultActiveKey = ((query.tabKey ?? '1') as unknown) as string;

    return useMemo(() => {
        const initialValues = props.location.state;
        const [count1, count2, count3, count4, count5, count6] = countArr;
        return (
            <Container>
                <Tabs
                    defaultActiveKey={defaultActiveKey}
                    className="tabs-margin-none"
                    type="card"
                    children={[
                        <TabPane tab={`全部列表${count1 === void 0 ? '' : `(${count1})`}`} key="1">
                            <TaskListTab initialValues={initialValues} setCountArr={setCountArr} />
                        </TabPane>,
                        <TabPane tab={`待执行${count1 === void 0 ? '' : `(${count2})`}`} key="2">
                            <TaskListTab
                                task_status={TaskStatusEnum.ToBeExecuted}
                                setCountArr={setCountArr}
                            />
                        </TabPane>,
                        <TabPane tab={`执行中${count1 === void 0 ? '' : `(${count3})`}`} key="3">
                            <TaskListTab
                                task_status={TaskStatusEnum.Executing}
                                setCountArr={setCountArr}
                            />
                        </TabPane>,
                        <TabPane tab={`执行成功${count1 === void 0 ? '' : `(${count4})`}`} key="4">
                            <TaskListTab
                                task_status={TaskStatusEnum.Success}
                                setCountArr={setCountArr}
                            />
                        </TabPane>,
                        <TabPane tab={`执行失败${count1 === void 0 ? '' : `(${count5})`}`} key="5">
                            <TaskListTab
                                task_status={TaskStatusEnum.Failed}
                                setCountArr={setCountArr}
                            />
                        </TabPane>,
                        <TabPane tab={`已终止${count1 === void 0 ? '' : `(${count6})`}`} key="6">
                            <TaskListTab
                                task_status={TaskStatusEnum.Terminated}
                                setCountArr={setCountArr}
                            />
                        </TabPane>,
                    ]}
                />
            </Container>
        );
    }, [props, countArr]);
};

export default Index;

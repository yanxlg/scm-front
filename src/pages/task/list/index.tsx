import React, { useMemo, useState } from 'react';
import { Tabs } from 'antd';
import '@/styles/index.less';
import { TaskStatusEnum } from '@/enums/StatusEnum';
import { RouteComponentProps } from 'react-router';
import { ITaskListQuery } from '@/interface/ITask';
import queryString from 'query-string';
import TaskListTab from '@/pages/task/components/TaskListTab';
import Container from '@/components/Container';
import { PermissionRouterWrap, PermissionComponent } from 'rc-permission';
import ForbiddenComponent from '@/components/ForbiddenComponent';

const { TabPane } = Tabs;

type LocalPageProps = RouteComponentProps<{}, any, Partial<ITaskListQuery>>;

const Index: React.FC<LocalPageProps> = props => {
    const [countArr, setCountArr] = useState<number[]>([]);
    const { query } = queryString.parseUrl(window.location.href);
    const defaultActiveKey = ((query.tabKey ?? '1') as unknown) as string;

    return useMemo(() => {
        const initialValues = props.location.state;
        props.history.replace(window.location.pathname, {}); // 重置state
        const [count1, count2, count3, count4, count5, count6] = countArr;
        return (
            <Container>
                <Tabs defaultActiveKey={defaultActiveKey} className="tabs-margin-none" type="card">
                    <TabPane tab={`全部列表${count1 === void 0 ? '' : `(${count1})`}`} key="1">
                        <PermissionComponent
                            pid="task/list/all_tab"
                            fallback={() => <ForbiddenComponent />}
                        >
                            <TaskListTab initialValues={initialValues} setCountArr={setCountArr} />
                        </PermissionComponent>
                    </TabPane>
                    <TabPane tab={`待执行${count1 === void 0 ? '' : `(${count2})`}`} key="2">
                        <PermissionComponent
                            pid="task/list/pending_tab"
                            fallback={() => <ForbiddenComponent />}
                        >
                            <TaskListTab
                                task_status={TaskStatusEnum.ToBeExecuted}
                                setCountArr={setCountArr}
                            />
                        </PermissionComponent>
                    </TabPane>
                    <TabPane tab={`执行中${count1 === void 0 ? '' : `(${count3})`}`} key="3">
                        <PermissionComponent
                            pid="task/list/executing_tab"
                            fallback={() => <ForbiddenComponent />}
                        >
                            <TaskListTab
                                task_status={TaskStatusEnum.Executing}
                                setCountArr={setCountArr}
                            />
                        </PermissionComponent>
                    </TabPane>
                    <TabPane tab={`执行成功${count1 === void 0 ? '' : `(${count4})`}`} key="4">
                        <PermissionComponent
                            pid="task/list/executed_tab"
                            fallback={() => <ForbiddenComponent />}
                        >
                            <TaskListTab
                                task_status={TaskStatusEnum.Success}
                                setCountArr={setCountArr}
                            />
                        </PermissionComponent>
                    </TabPane>
                    <TabPane tab={`执行失败${count1 === void 0 ? '' : `(${count5})`}`} key="5">
                        <PermissionComponent
                            pid="task/list/failed_tab"
                            fallback={() => <ForbiddenComponent />}
                        >
                            <TaskListTab
                                task_status={TaskStatusEnum.Failed}
                                setCountArr={setCountArr}
                            />
                        </PermissionComponent>
                    </TabPane>
                    <TabPane tab={`已终止${count1 === void 0 ? '' : `(${count6})`}`} key="6">
                        <PermissionComponent
                            pid="task/list/terminate_tab"
                            fallback={() => <ForbiddenComponent />}
                        >
                            <TaskListTab
                                task_status={TaskStatusEnum.Terminated}
                                setCountArr={setCountArr}
                            />
                        </PermissionComponent>
                    </TabPane>
                </Tabs>
            </Container>
        );
    }, [props, countArr]);
};

export default PermissionRouterWrap(Index, {
    login: true,
    pid: 'task/list',
});

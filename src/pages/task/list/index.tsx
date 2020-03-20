import React, { useMemo, useState } from 'react';
import { Tabs } from 'antd';
import ALLTaskPage from '@/pages/task/components/ALLTaskPage';
import '@/styles/index.less';
import { TaskStatusEnum } from '@/enums/StatusEnum';
import { RouteComponentProps } from 'react-router';
import { ITaskListQuery } from '@/interface/ITask';
import queryString from 'query-string';

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
            <Tabs
                defaultActiveKey={defaultActiveKey}
                className="tabs-margin-none"
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
        );
    }, [props, countArr]);
};

export default Index;

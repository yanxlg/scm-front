import React, { useCallback, useMemo, useRef, useState } from 'react';
import { Card, Tabs } from 'antd';
import '@/styles/index.less';
import '@/styles/task.less';
import '@/styles/card.less';
import { TaskTypeCode, TaskTypeEnum } from '@/enums/StatusEnum';
import CopyLink from '@/components/copyLink';
import { RouteComponentProps } from 'react-router';
import formStyles from 'react-components/es/JsonForm/_form.less';
import styles from '@/styles/_index.less';
import TaskInfo from '@/pages/task/components/detail/TaskInfo';
import TaskProgress  from '../components/detail/TaskProgress';
import { TaskStaticRef } from '../components/detail/TaskStatic';
import { LoadingButton } from 'react-components';

const { TabPane } = Tabs;

const Task_id: React.FC<RouteComponentProps<{ task_id: string }>> = ({ match }) => {
    const [taskType, setTaskType] = useState<TaskTypeCode | undefined | -1>(); // -1 表示异常
    const taskId = Number(match.params.task_id);
    const getCopiedLinkQuery = useCallback(() => {
        return {};
    }, []);

    const contentRef1 = useRef<TaskStaticRef>(null);
    const contentRef2 = useRef<TaskStaticRef>(null);

    const defaultActiveKey = useRef<string>('1');

    const onActiveKeyChange = useCallback((activeKey: string) => {
        defaultActiveKey.current = activeKey;
    }, []);

    const onReload = useCallback(() => {
        if (taskType === TaskTypeEnum.Grounding || taskType === TaskTypeEnum.Gather) {
            return contentRef1.current?.reload()??Promise.resolve();
        } else {
            if (defaultActiveKey.current === '1') {
                return contentRef1.current?.reload()??Promise.resolve();
            } else {
                return contentRef2.current?.reload()??Promise.resolve();
            }
        }
    }, [taskType]);

    return useMemo(() => {
        return (
            <div className={styles.transparent}>
                <TaskInfo task_id={taskId} setTaskType={setTaskType} />
                <Card
                    className={formStyles.formItem}
                    title="任务进度"
                    loading={taskType === void 0}
                    extra={
                        <LoadingButton
                            type="link"
                            size="small"
                            onClick={onReload}
                            disabled={taskType === void 0}
                        >
                            刷新
                        </LoadingButton>
                    }
                >
                    {taskType === TaskTypeEnum.Grounding || taskType === TaskTypeEnum.Gather ? (
                        <TaskProgress
                            staticRef={contentRef1}
                            task_id={taskId}
                            task_type={taskType as TaskTypeCode}
                        />
                    ) : (
                        <Tabs
                            defaultActiveKey={defaultActiveKey.current}
                            type="card"
                            onChange={onActiveKeyChange}
                            children={[
                                <TabPane tab="采集任务" key="1">
                                    <TaskProgress
                                        staticRef={contentRef1}
                                        task_id={taskId}
                                        task_type={taskType as TaskTypeCode}
                                        collect_onsale_type={1}
                                    />
                                </TabPane>,
                                <TabPane tab="上架任务" key="2">
                                    <TaskProgress
                                        staticRef={contentRef2}
                                        task_id={taskId}
                                        task_type={taskType as TaskTypeCode}
                                        collect_onsale_type={2}
                                    />
                                </TabPane>,
                            ]}
                        />
                    )}
                </Card>
                <CopyLink getCopiedLinkQuery={getCopiedLinkQuery} />
            </div>
        );
    }, [taskType]);
};

export default Task_id;

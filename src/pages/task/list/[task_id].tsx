import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Button, Card, Descriptions, Modal, Tabs, Spin, Select, Popover } from 'antd';
import '@/styles/index.less';
import '@/styles/form.less';
import '@/styles/task.less';
import '@/styles/card.less';
import {
     TaskTypeCode,
    TaskTypeEnum,
} from '@/enums/StatusEnum';
import CopyLink from '@/components/copyLink';
import { RouteComponentProps } from 'react-router';
import formStyles from '@/styles/_form.less';
import styles from '@/styles/_index.less';
import TaskInfo from '@/pages/task/components/detail/TaskInfo';
import TaskProgress from '../components/detail/TaskProgress';

const { TabPane } = Tabs;

const Task_id: React.FC<RouteComponentProps<{ task_id: string }>> = ({ match }) => {
    const [taskType,setTaskType] = useState<TaskTypeCode|undefined|-1>(); // -1 表示异常
    const taskId = Number(match.params.task_id);
    const getCopiedLinkQuery = useCallback(() => {
        return {};
    }, []);

    const tab = useCallback((collect_onsale_type?:1|2)=>{
        if(taskType === TaskTypeEnum.Gather || taskType === TaskTypeEnum.Grounding || taskType === TaskTypeEnum.GatherGrounding){
            return <TaskProgress task_id={taskId} task_type={taskType as TaskTypeCode} collect_onsale_type={collect_onsale_type}/>
        }
        return null;
    },[taskType]);

    return useMemo(() => {
        return (
            <div className={styles.transparent}>
                <TaskInfo task_id={taskId} setTaskType={setTaskType}/>
                <Card className={formStyles.formItem} title="任务进度" loading={taskType===void 0}>
                    {
                        taskType === TaskTypeEnum.Grounding||taskType === TaskTypeEnum.Gather?tab():
                            <Tabs
                                defaultActiveKey="1"
                                type="card"
                                children={[
                                    <TabPane tab="采集任务" key="1">{tab(1)}
                                    </TabPane>,
                                    <TabPane tab="上架任务" key="2">
                                        {tab(2)}
                                    </TabPane>,
                                ]}
                            />
                    }
                </Card>
                <CopyLink getCopiedLinkQuery={getCopiedLinkQuery} />
            </div>
        );
    }, [taskType]);
};

export default Task_id;

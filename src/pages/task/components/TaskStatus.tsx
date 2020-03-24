import React, { useMemo } from 'react';
import { TaskStatusCode, TaskStatusEnum, TaskStatusMap } from '@/enums/StatusEnum';
import {
    CheckCircleOutlined,
    ClockCircleOutlined,
    CloseCircleOutlined,
    InfoCircleOutlined,
} from '@ant-design/icons';
import { Progress } from 'antd';

declare interface TaskStatusProps {
    status: TaskStatusCode;
}
const TaskStatus: React.FC<TaskStatusProps> = ({ status }) => {
    const percent = useMemo(() => {
        return 50 + Math.ceil(Math.random() * 50);
    }, []);

    return useMemo(() => {
        if (status === TaskStatusEnum.UnExecuted) {
            return (
                <div>
                    <ClockCircleOutlined />
                    {TaskStatusMap[(status as unknown) as TaskStatusCode]}
                </div>
            );
        }
        if (status === TaskStatusEnum.Finished) {
            return (
                <div>
                    <CheckCircleOutlined />
                    {TaskStatusMap[(status as unknown) as TaskStatusCode]}
                </div>
            );
        }
        if (status === TaskStatusEnum.Failed) {
            return (
                <div>
                    <CloseCircleOutlined />
                    {TaskStatusMap[(status as unknown) as TaskStatusCode]}
                </div>
            );
        }
        if (status === TaskStatusEnum.Terminated) {
            return (
                <div>
                    <InfoCircleOutlined />
                    {TaskStatusMap[(status as unknown) as TaskStatusCode]}
                </div>
            );
        }
        if (status === TaskStatusEnum.Executing) {
            return (
                <div>
                    <Progress
                        className="task-progress-circle"
                        width={20}
                        strokeWidth={15}
                        strokeLinecap="round"
                        type="circle"
                        percent={percent}
                        status={'normal'}
                        format={() => ''}
                    />
                    {TaskStatusMap[(status as unknown) as TaskStatusCode]}
                </div>
            );
        }
        return <div>{TaskStatusMap[(status as unknown) as TaskStatusCode]}</div>;
    }, [status]);
};

export default TaskStatus;

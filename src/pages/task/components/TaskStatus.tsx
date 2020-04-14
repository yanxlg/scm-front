import React, { useMemo } from 'react';
import { TaskStatusCode, TaskStatusEnum, TaskStatusMap } from '@/enums/StatusEnum';
import {
    CheckCircleFilled,
    CloseCircleFilled,
    ClockCircleFilled,
    InfoCircleFilled,
} from '@ant-design/icons';
import { Progress } from 'antd';
import taskStyle from '@/styles/_task.less';

declare interface TaskStatusProps {
    status: TaskStatusCode;
}
const TaskStatus: React.FC<TaskStatusProps> = ({ status }) => {
    const percent = useMemo(() => {
        return 50 + Math.ceil(Math.random() * 50);
    }, []);

    return useMemo(() => {
        if (status === TaskStatusEnum.ToBeExecuted) {
            return (
                <div>
                    <ClockCircleFilled className={taskStyle.waitIcon} />
                    <span className={taskStyle.taskStatusText}>
                        {TaskStatusMap[(status as unknown) as TaskStatusCode]}
                    </span>
                </div>
            );
        }
        if (status === TaskStatusEnum.Success) {
            return (
                <div>
                    <CheckCircleFilled className={taskStyle.successIcon} />
                    <span className={taskStyle.taskStatusText}>
                        {TaskStatusMap[(status as unknown) as TaskStatusCode]}
                    </span>
                </div>
            );
        }
        if (status === TaskStatusEnum.Failed) {
            return (
                <div>
                    <CloseCircleFilled className={taskStyle.errorIcon} />
                    <span className={taskStyle.taskStatusText}>
                        {TaskStatusMap[(status as unknown) as TaskStatusCode]}
                    </span>
                </div>
            );
        }
        if (status === TaskStatusEnum.Terminated) {
            return (
                <div>
                    <InfoCircleFilled className={taskStyle.warnIcon} />
                    <span className={taskStyle.taskStatusText}>
                        {TaskStatusMap[(status as unknown) as TaskStatusCode]}
                    </span>
                </div>
            );
        }
        if (status === TaskStatusEnum.Executing) {
            return (
                <div>
                    <Progress
                        className={taskStyle.progressIcon}
                        strokeLinecap="round"
                        width={14}
                        strokeWidth={14}
                        type="circle"
                        percent={percent}
                        status={'normal'}
                        format={() => ''}
                    />
                    <span className={taskStyle.taskStatusText}>
                        {TaskStatusMap[(status as unknown) as TaskStatusCode]}
                    </span>
                </div>
            );
        }
        return (
            <div>
                <span className={taskStyle.taskStatusText}>
                    {TaskStatusMap[(status as unknown) as TaskStatusCode]}
                </span>
            </div>
        );
    }, [status]);
};

export default TaskStatus;

import React, { useCallback, useMemo } from 'react';
import router from 'umi/router';
import '@/styles/modal.less';
import { Button } from 'antd';
import { ITaskCreatedResponse } from '@/interface/ITask';
import { TaskTypeMap } from '@/enums/StatusEnum';

declare interface ITaskListProps {
    list: ITaskCreatedResponse;
}

const GatherSuccessModal: React.FC<ITaskListProps> = ({ list }) => {
    const onClick = useCallback(() => {
        router.push({
            pathname: '/goods/local',
            state: {
                task_id: list.task_id,
            },
        });
    }, []);
    return useMemo(() => {
        return (
            <div>
                <div className="config-modal-title">任务创建成功</div>
                <div className="config-modal-title">
                    【{TaskTypeMap[list.task_type]}】ID：{list.task_id}
                </div>
                <Button type="primary" onClick={onClick} className="config-modal-btn">
                    查看任务进度
                </Button>
                <div className="config-modal-tip">任务执行结果可在本地产品库查看</div>
            </div>
        );
    }, [list]);
};

export default GatherSuccessModal;

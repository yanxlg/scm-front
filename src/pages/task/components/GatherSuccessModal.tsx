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
            pathname: '/task/list',
            state: {
                task_sn: list.task_sn,
            },
        });
    }, []);
    return useMemo(() => {
        return (
            <div>
                <div className="config-modal-title">任务创建成功</div>
                <div className="config-modal-title">
                    【{TaskTypeMap[list.task_type]}】SN：{list.task_sn}
                </div>
                <Button type="primary" onClick={onClick} className="config-modal-btn">
                    查看任务进度
                </Button>
                <div className="config-modal-tip">任务执行结果可在【本地产品库】查看</div>
            </div>
        );
    }, [list]);
};

export default GatherSuccessModal;

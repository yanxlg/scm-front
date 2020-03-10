import React, { useCallback, useMemo } from 'react';
import { history } from 'umi';
import { Button, Modal } from 'antd';
import { ITaskCreatedResponse } from '@/interface/ITask';
import { TaskTypeMap } from '@/enums/StatusEnum';
import '@/styles/modal.less';

declare interface ITaskListProps {
    result: ITaskCreatedResponse;
}

const GatherSuccessModal: React.FC<ITaskListProps> = ({ result }) => {
    const onClick = useCallback(() => {
        history.push({
            pathname: '/task/list',
            state: {
                task_sn: result.task_sn,
            },
        });
    }, []);
    return useMemo(() => {
        return (
            <div>
                <div className="config-modal-title">任务创建成功</div>
                <div className="config-modal-title">
                    【{TaskTypeMap[result.task_type]}】SN：{result.task_sn}
                </div>
                <Button type="primary" onClick={onClick} className="config-modal-btn">
                    查看任务进度
                </Button>
                <div className="config-modal-tip">任务执行结果可在【本地产品库】查看</div>
            </div>
        );
    }, [result]);
};

export function showSuccessModal(response: ITaskCreatedResponse) {
    Modal.info({
        content: <GatherSuccessModal result={response} />,
        className: 'modal-empty',
        icon: null,
        maskClosable: true,
    });
}

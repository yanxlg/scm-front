import React, { useCallback, useMemo } from 'react';
import router from 'umi/router';
import '@/styles/modal.less';
import { Button } from 'antd';

declare interface ITaskListProps {
    list: Array<{
        type: string;
        task_id: string;
    }>;
}

const GatherSuccessModal: React.FC<{ taskId: number; onClick: () => void }> = ({
    taskId,
    onClick,
}) => {
    const goToLocalGoods = useCallback(() => {
        router.push('/goods/local');
    }, []);
    return useMemo(() => {
        return (
            <div>
                <div className="config-modal-title">采集任务已创建</div>
                <div className="config-modal-title">任务ID: {taskId}</div>
                <Button type="primary" onClick={onClick} className="config-modal-btn">
                    查看任务进度
                </Button>
                <div className="config-modal-tip">
                    任务执行结果可在<a onClick={goToLocalGoods}>本地产品库</a>查看
                </div>
            </div>
        );
    }, [taskId]);
};

export default GatherSuccessModal;

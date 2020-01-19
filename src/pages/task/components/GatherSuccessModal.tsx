import React, { useCallback, useMemo } from 'react';
import { Button } from 'antd';
import router from 'umi/router';
import "@/styles/modal.less";

const GatherSuccessModal:React.FC<{taskId:string;onClick:()=>void}> = ({taskId,onClick})=>{
    const goToLocalGoods = useCallback(()=>{
        router.push("/goods/local");
    },[]);
    return useMemo(()=>{
        return (
            <div>
                <div className="config-modal-title">
                    采集任务已创建
                </div>
                <div className="config-modal-title">
                    任务ID: {taskId}
                </div>
                <Button type="primary" onClick={onClick} className="config-modal-btn">查看任务详情</Button>
                <div className="config-modal-tip">
                    任务执行结果可在<a onClick={goToLocalGoods}>本地产品库</a>查看
                </div>
            </div>
        )
    },[taskId])
};

export default GatherSuccessModal;

import React, { useCallback, useMemo } from 'react';
import { Button } from 'antd';
import router from 'umi/router';
import "@/styles/modal.less";

const GatherFailureModal:React.FC<{onClick:()=>void}> = ({onClick})=>{
  /*  const goToDrafts = useCallback(()=>{
        router.push("/config/drafts");
    },[]);*/
    return useMemo(()=>{
        return (
            <div>
                <div className="config-modal-title">
                    采集任务创建失败
                </div>
                <div className="config-modal-title">
                    请重新尝试
                </div>
                <Button onClick={onClick} type="primary" className="config-modal-btn">重新创建任务</Button>
             {/*   <div className="config-modal-tip">
                    任务配置内容可在<a onClick={goToDrafts}>草稿箱</a>查看
                </div>*/}
            </div>
        )
    },[])
};

export default GatherFailureModal;

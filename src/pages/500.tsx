import React, { useCallback, useMemo } from 'react';
import {Result, Button} from "antd";
import router from 'umi/router';


const Page:React.FC=()=>{
    const goToHome = useCallback(()=>router.replace("/"),[]);
    return (
        useMemo(()=>{
            return (
                <Result
                    status="500"
                    title="500"
                    subTitle="抱歉，服务器出错了。"
                    extra={<Button type="primary" onClick={goToHome}>返回首页</Button>}
                />
            )
        },[])
    )
};

export default Page;

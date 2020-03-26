import React, { useCallback, useMemo } from 'react';
import { Result, Button } from 'antd';
import { history } from 'umi';

const Page: React.FC = () => {
    const goToHome = useCallback(() => history.replace('/'), []);
    return useMemo(() => {
        return (
            <Result
                status="403"
                title="403"
                subTitle="抱歉，你无权访问该页面。"
                extra={
                    <Button type="primary" onClick={goToHome}>
                        返回首页
                    </Button>
                }
            />
        );
    }, []);
};

export default Page;

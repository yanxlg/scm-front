import React, { useCallback, useMemo } from 'react';
import { Result, Button } from 'antd';
import { history } from 'umi';

const Page: React.FC = () => {
    const goToHome = useCallback(() => history.replace('/'), []);
    return useMemo(() => {
        return (
            <Result
                status="404"
                title="404"
                subTitle="抱歉，你访问的页面不存在。"
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

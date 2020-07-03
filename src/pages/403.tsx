import React, { useCallback, useMemo } from 'react';
import { Result } from 'antd';
import { history } from 'umi';
import { logout } from '@/services/global';
import { LoadingButton } from 'react-components';

const Page: React.FC = () => {
    const onLogout = useCallback(() => {
        return logout().then(() => {
            history.replace('/login');
        });
    }, []);

    return useMemo(() => {
        return (
            <Result
                status="403"
                title="403"
                subTitle="抱歉，你无权访问该页面。"
                extra={
                    <LoadingButton type="primary" onClick={onLogout}>
                        切换账号
                    </LoadingButton>
                }
            />
        );
    }, []);
};

export default Page;

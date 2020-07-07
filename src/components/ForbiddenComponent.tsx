import React, { useMemo } from 'react';
import { Result } from 'antd';

const ForbiddenComponent: React.FC = () => {
    return useMemo(() => {
        return <Result status="403" title="403" subTitle="抱歉，你无权访问该页面。" />;
    }, []);
};

export default ForbiddenComponent;

import React, { useMemo } from 'react';
import { LockOutlined, UnlockOutlined } from '@ant-design/icons';

interface IProps {
    isLock: boolean | undefined;
    className?: string;
}

const Lock: React.FC<IProps> = ({ isLock, ...restProps }) => {
    return useMemo(() => {
        return isLock ? <LockOutlined {...restProps} /> : <UnlockOutlined {...restProps} />;
    }, [isLock]);
};

export default Lock;

import React, { useMemo } from 'react';
import './iconfont.css';

const Icon: React.FC<{ type: string; className?: string }> = ({ type, className = '' }) => {
    return useMemo(() => {
        return <span className={`${className} scm scm-${type}`} />;
    }, [type, className]);
};

export default Icon;

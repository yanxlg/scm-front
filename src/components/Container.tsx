import React, { useMemo } from 'react';
import styles from '@/styles/_index.less';

declare interface ListContainerProps {
    className?: string;
}

const Container: React.FC<ListContainerProps> = ({ className, children }) => {
    return useMemo(() => {
        return <div className={[styles.container, className].join(' ')}>{children}</div>;
    }, [children]);
};

export default Container;

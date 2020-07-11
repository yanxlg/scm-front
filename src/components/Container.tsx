import React, { useMemo } from 'react';
import styles from '@/styles/_index.less';
import classNames from 'classnames';

declare interface ListContainerProps {
    className?: string;
    absolute?: boolean;
}

const Container: React.FC<ListContainerProps> = ({ className, children, absolute }) => {
    return useMemo(() => {
        return (
            <div
                className={classNames([
                    styles.container,
                    className,
                    {
                        [styles.containerAbs]: absolute,
                    },
                ])}
            >
                {children}
            </div>
        );
    }, [children]);
};

export default Container;

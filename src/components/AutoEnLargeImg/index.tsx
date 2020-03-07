import React, { useMemo } from 'react';
import { Popover } from 'antd';
import styles from './_index.less';

declare interface IAutoEnLargeImgProps {
    className?: string;
    enLargeClassName?: string;
    src?: string;
}

const AutoEnLargeImg: React.FC<IAutoEnLargeImgProps> = ({
    className = '',
    enLargeClassName = '',
    src,
}) => {
    return useMemo(() => {
        return src ? (
            <Popover
                placement="right"
                content={
                    <img
                        src={src.replace('150_150', '240_240')}
                        alt=""
                        className={`${styles.enlarge} ${enLargeClassName}`}
                    />
                }
                title={null}
                autoAdjustOverflow={true}
            >
                <img src={src} className={className} alt="" />
            </Popover>
        ) : null;
    }, [className, enLargeClassName, src]);
};

export default AutoEnLargeImg;

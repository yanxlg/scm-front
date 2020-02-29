import React, { useMemo } from 'react';
import { Tooltip } from 'antd';

declare interface IAutoEnLargeImgProps {
    className?: string;
    tipClassName?: string;
    largeImgClassName?: string;
    url?: string;
}

const AutoEnLargeImg: React.FC<IAutoEnLargeImgProps> = ({
    className,
    tipClassName,
    largeImgClassName,
    url,
}) => {
    return useMemo(() => {
        return url ? (
            <Tooltip
                placement="right"
                title={
                    <img
                        src={url.replace('150_150', '240_240')}
                        alt=""
                        className={largeImgClassName}
                    />
                }
                overlayClassName={tipClassName}
            >
                <img src={url} className={className} alt="" />
            </Tooltip>
        ) : null;
    }, [className, tipClassName, largeImgClassName, url]);
};

export default AutoEnLargeImg;

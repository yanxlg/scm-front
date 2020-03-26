import React, { useCallback, useMemo, useState } from 'react';
import { Button } from 'antd';
import { ButtonProps } from 'antd/lib/button/button';

declare interface ILoadingButtonProps extends ButtonProps {
    onClick: (event: React.MouseEvent<HTMLButtonElement>) => Promise<any>;
}

const LoadingButton: React.FC<ILoadingButtonProps> = props => {
    const [loading, setLoading] = useState(false);
    const onClick = useCallback(
        (event: React.MouseEvent<HTMLButtonElement>) => {
            setLoading(true);
            props?.onClick(event).finally(() => {
                setLoading(false);
            });
        },
        [props.onClick],
    );
    const currentLoading = props.loading || loading;
    return useMemo(() => {
        return <Button {...props} loading={currentLoading} onClick={onClick} />;
    }, [props, currentLoading, onClick]);
};

export default LoadingButton;

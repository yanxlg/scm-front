import React, { useCallback, useMemo, useRef, useState } from 'react';
import { Switch } from 'antd';
import { SwitchProps } from 'antd/lib/switch';

declare interface LoadingSwitchProps extends SwitchProps {
    onClick: (checked: boolean, event: MouseEvent) => Promise<boolean>;
}

const LoadingSwitch: React.FC<LoadingSwitchProps> = ({ onClick, checked, ...props }) => {
    const checkedRef = useRef<boolean | undefined>(checked);
    useMemo(() => {
        checkedRef.current = checked;
    }, [checked]);

    const [loading, setLoading] = useState(false);
    const onRealChange = useCallback((checked: boolean, event: MouseEvent) => {
        setLoading(true);
        onClick?.(checked, event)
            .then((checked: boolean) => {
                checkedRef.current = checked;
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);
    return useMemo(() => {
        return (
            <Switch
                {...props}
                loading={loading}
                onChange={onRealChange}
                checked={checkedRef.current}
            />
        );
    }, [props, loading]);
};

export default LoadingSwitch;

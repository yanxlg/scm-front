import React, { useCallback, useMemo, useRef, useState } from 'react';
import { Switch } from 'antd';
import { SwitchProps } from 'antd/lib/switch';

declare interface LoadingSwitchProps extends SwitchProps {
    onClick: (checked: boolean, event: MouseEvent) => Promise<boolean> | void;
}

const LoadingSwitch: React.FC<LoadingSwitchProps> = ({ onClick, checked, ...props }) => {
    const checkedRef = useRef<boolean | undefined>(checked);
    useMemo(() => {
        checkedRef.current = checked;
    }, [checked]);

    const [loading, setLoading] = useState(false);
    const onRealChange = useCallback((checked: boolean, event: MouseEvent) => {
        // @ts-ignore
        if (props['_privateClick']) {
            // fix with permission component
            onClick?.(checked, event);
        } else if (onClick) {
            setLoading(true);
            const result = onClick(checked, event);
            if (result) {
                result
                    .then((checked: boolean) => {
                        checkedRef.current = checked;
                    })
                    .finally(() => {
                        setLoading(false);
                    });
            } else {
                setLoading(false);
            }
        }
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

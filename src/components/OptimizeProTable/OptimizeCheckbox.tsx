/**提供自我管控的Checkbox**/
import React, {
    forwardRef,
    ForwardRefRenderFunction,
    useCallback,
    useEffect,
    useImperativeHandle,
    useMemo,
    useRef,
    useState,
} from 'react';
import { Checkbox } from 'antd';
import { CheckboxProps } from 'antd/lib/checkbox/Checkbox';
import { CheckboxChangeEvent } from 'antd/es/checkbox';

export interface OptimizeCheckboxRef {
    updateChecked: (checked: boolean) => void;
    setIndeterminate: () => void;
    getValue: () => any;
    getValues: () => { value: any; checked: boolean };
}

const OptimizeCheckbox: ForwardRefRenderFunction<
    OptimizeCheckboxRef,
    Omit<CheckboxProps, 'checked'> & {
        componentWillUnMont: (value: string) => void;
    }
> = ({ componentWillUnMont, onChange, ...props }, ref) => {
    let [state, setState] = useState<{ checked: boolean; indeterminate: boolean }>({
        checked: false,
        indeterminate: false,
    });

    useImperativeHandle(
        ref,
        () => {
            return {
                updateChecked: (checked: boolean) => {
                    setState({
                        checked: checked,
                        indeterminate: false,
                    });
                },
                setIndeterminate: () => {
                    setState({
                        checked: false,
                        indeterminate: true,
                    });
                },
                getValue: () => props.value,
                getValues: () => {
                    return {
                        value: props.value,
                        checked: state.checked,
                    };
                },
            };
        },
        [state.checked],
    );

    useEffect(() => {
        return () => {
            componentWillUnMont(props.value);
            setState = () => {};
        };
    }, []);

    const onInnerChange = useCallback(
        (e: CheckboxChangeEvent) => {
            const checked = e.target.checked;
            setState({ checked: checked, indeterminate: false });
            onChange && onChange(e);
        },
        [onChange],
    );
    const { checked, indeterminate } = state;

    return useMemo(() => {
        return (
            <Checkbox
                {...props}
                checked={checked}
                indeterminate={indeterminate}
                onChange={onInnerChange}
            />
        );
    }, [checked, indeterminate, onChange]);
};

export default forwardRef(OptimizeCheckbox);

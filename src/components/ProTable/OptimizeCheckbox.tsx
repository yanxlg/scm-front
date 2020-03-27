/**提供自我管控的Checkbox**/
import React, {
    forwardRef,
    ForwardRefRenderFunction,
    useCallback,
    useImperativeHandle,
    useMemo,
    useRef,
    useState,
} from 'react';
import { Checkbox } from 'antd';
import { CheckboxProps } from 'antd/lib/checkbox/Checkbox';
import { CheckboxChangeEvent } from 'antd/es/checkbox';
import ReactDOM from 'react-dom';

export interface OptimizeCheckboxRef {
    updateChecked: (checked: boolean) => void;
    setIndeterminate: () => void;
    getValue: () => any;
    getValues: () => { value: any; checked: boolean };
    getElement: () => void;
}

const OptimizeCheckbox: ForwardRefRenderFunction<
    OptimizeCheckboxRef,
    Omit<CheckboxProps, 'checked'>
> = ({ onChange, ...props }, ref) => {
    const [state, setState] = useState<{ checked: boolean; indeterminate: boolean }>({
        checked: false,
        indeterminate: false,
    });

    const refObject = useRef<any>();

    useImperativeHandle(
        ref,
        () => {
            return {
                updateChecked: (checked: boolean) => {
                    console.log(checked);
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
                getElement: () => {
                    console.log(refObject);
                },
            };
        },
        [state.checked],
    );

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
        console.log(checked, indeterminate);
        return (
            <span ref={refObject}>
                <Checkbox
                    {...props}
                    checked={checked}
                    indeterminate={indeterminate}
                    onChange={onInnerChange}
                />
            </span>
        );
    }, [checked, indeterminate, onChange]);
};

export default forwardRef(OptimizeCheckbox);

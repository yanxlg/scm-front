import React from 'react';
import { InputNumber } from 'antd';
import { InputNumberProps } from 'antd/lib/input-number';

const intFormatter = (value?: string | number) =>
    typeof value === 'number' ? String(value) : value ? (/^\d+/.exec(value) || [''])[0] : '';

const positiveIntFormatter = (value?: string | number) =>
    typeof value === 'number' ? String(value) : value ? (/^[1-9]\d*/.exec(value) || [''])[0] : '';

declare interface IIntegerInputProps extends InputNumberProps {
    positive?: boolean; // 正整数
}

const IntegerInput: React.FC<IIntegerInputProps> = ({ positive, ...props }) => {
    return (
        <InputNumber
            {...props}
            min={0}
            formatter={positive ? positiveIntFormatter : intFormatter}
        />
    );
};

export default IntegerInput;

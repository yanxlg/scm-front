import React from 'react';
import { InputNumber } from 'antd';
import { InputNumberProps } from 'antd/lib/input-number';

const numberFormatter = (value?: string | number) =>
    typeof value === 'number'
        ? String(value)
        : value
        ? (/^\d+(\.\d*)?/.exec(value) || [''])[0]
        : '';

const NumberInput: React.FC<InputNumberProps> = props => {
    return <InputNumber {...props} min={0} formatter={numberFormatter} />;
};

export default NumberInput;

import React from 'react';
import { InputNumber } from 'antd';
import { InputNumberProps } from 'antd/lib/input-number';

const intFormatter = (value?: string | number) =>
    typeof value === 'number' ? String(value) : value ? (/^\d+/.exec(value) || [''])[0] : '';

const IntegerInput: React.FC<InputNumberProps> = props => {
    return <InputNumber {...props} min={0} formatter={intFormatter} />;
};

export default IntegerInput;

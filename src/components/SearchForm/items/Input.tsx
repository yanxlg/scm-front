import { Form, Input } from 'antd';
import React, { useMemo } from 'react';
import { CustomFormProps, FormItemName } from '@/components/SearchForm';
import { FormInstance, Rule } from 'antd/es/form';
import IntegerInput from '@/components/IntegerInput';
import NumberInput from '@/components/NumberInput';
import { FormItemLabelProps } from 'antd/es/form/FormItemLabel';
import { transNullValue, transNumber } from '@/utils/transform';

export type InputType = 'input' | 'integer' | 'number';
const typeList = ['input', 'integer', 'number'];

export type InputFormatter = 'number';

export type InputProps = FormItemLabelProps &
    CustomFormProps & {
        form: FormInstance;
        type: InputType;
        placeholder?: string;
        className?: string;
        formItemClassName?: string;
        onChange?: (name: FormItemName, form: FormInstance) => void; // change监听，支持外部执行表单操作，可以实现关联筛选，重置等操作
        name: FormItemName;
        formatter?: InputFormatter;
        rules?: Rule[];
    };

const FormInput = (props: InputProps) => {
    const {
        name,
        placeholder,
        label,
        className,
        formItemClassName,
        onChange,
        labelClassName,
        form,
        type,
        rules,
    } = props;
    const eventProps = useMemo(() => {
        return onChange
            ? {
                  onChange: () => {
                      onChange(name as FormItemName, form);
                  },
              }
            : {};
    }, []);

    return useMemo(() => {
        return (
            <Form.Item
                className={formItemClassName}
                name={name}
                label={<span className={labelClassName}>{label}</span>}
                rules={rules}
            >
                {type === 'integer' ? (
                    <IntegerInput
                        min={0}
                        placeholder={placeholder}
                        className={className}
                        {...eventProps}
                    />
                ) : type === 'number' ? (
                    <NumberInput
                        min={0}
                        placeholder={placeholder}
                        className={className}
                        {...eventProps}
                    />
                ) : (
                    <Input placeholder={placeholder} className={className} {...eventProps} />
                )}
            </Form.Item>
        );
    }, []);
};

FormInput.typeList = typeList;

FormInput.formatter = (formatter?: InputFormatter) => {
    return formatter ? (formatter === 'number' ? transNumber : transNullValue) : transNullValue;
};

export default FormInput;

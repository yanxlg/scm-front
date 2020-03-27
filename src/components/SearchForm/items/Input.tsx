import { Form } from 'antd';
import React, { useMemo } from 'react';
import { CustomFormProps, FormItemName } from '@/components/SearchForm';
import { FormInstance, Rule } from 'antd/es/form';
import { FormItemLabelProps } from 'antd/es/form/FormItemLabel';
import { transNullValue, transNumber } from '@/utils/transform';
import RichInput, { RichType } from '@/components/Input/RichInput';
import { InputProps as AntInputProps } from 'antd/es/input';

export type InputType = RichType;
const typeList = ['input', 'integer', 'number', 'positiveInteger'];

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
    } & Omit<AntInputProps, 'type' | 'size' | 'onPressEnter' | 'form'>;

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
        ..._props
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
                <RichInput
                    placeholder={placeholder}
                    className={className}
                    {..._props}
                    {...eventProps}
                    richType={type}
                />
            </Form.Item>
        );
    }, []);
};

FormInput.typeList = typeList;

FormInput.formatter = (formatter?: InputFormatter) => {
    return formatter ? (formatter === 'number' ? transNumber : transNullValue) : transNullValue;
};

export default FormInput;
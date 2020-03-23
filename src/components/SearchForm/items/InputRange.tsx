import React, { useMemo } from 'react';
import { Form, InputNumber } from 'antd';
import { CustomFormProps, FormItemName } from '@/components/SearchForm';
import { FormItemLabelProps } from 'antd/es/form/FormItemLabel';
import { FormInstance, Rule } from 'antd/es/form';
import formStyles from '@/styles/_form.less';
import styles from '@/styles/_index.less';
import { transNullValue } from '@/utils/transform';

export type InputRangeType = 'inputRange';
const typeList = ['inputRange'];

export type InputRangeProps = FormItemLabelProps &
    CustomFormProps & {
        form: FormInstance;
        type: InputRangeType;
        placeholder?: string;
        className?: string;
        formItemClassName?: string;
        onChange?: (name: FormItemName, form: FormInstance) => void; // change监听，支持外部执行表单操作，可以实现关联筛选，重置等操作
        name: [FormItemName, FormItemName];
        formatter?: any;
        rules?: [Rule[], Rule[]];
    };

const FormInputRange = (props: InputRangeProps) => {
    const {
        label,
        className,
        name: [name1, name2],
        formItemClassName,
        onChange,
        labelClassName = '',
        form,
        rules,
    } = props;

    const event1Props = useMemo(() => {
        return onChange
            ? {
                  onChange: () => {
                      onChange(name1 as FormItemName, form);
                  },
              }
            : {};
    }, []);

    const event2Props = useMemo(() => {
        return onChange
            ? {
                  onChange: () => {
                      onChange(name2 as FormItemName, form);
                  },
              }
            : {};
    }, []);

    return useMemo(() => {
        const itemClassName = [
            formStyles.formInline,
            styles.inlineBlock,
            styles.marginNone,
            styles.verticalMiddle,
        ].join(' ');
        return (
            <Form.Item
                label={<span className={labelClassName}>{label}</span>}
                className={`${formItemClassName}`}
            >
                <Form.Item
                    shouldUpdate={(prevValues, currentValues) =>
                        prevValues[name2] !== currentValues[name2]
                    }
                    className={itemClassName}
                >
                    <Form.Item
                        name={name1}
                        className={styles.marginNone}
                        rules={rules?.[0]}
                    >
                        <InputNumber
                            min={0}
                            precision={0}
                            className={className}
                            {...event1Props}
                        />
                    </Form.Item>
                </Form.Item>
                <span className={[formStyles.formColon, styles.verticalMiddle].join(' ')}>-</span>
                <Form.Item
                    className={itemClassName}
                    shouldUpdate={(prevValues, currentValues) =>
                        prevValues[name1] !== currentValues[name1]
                    }
                >
                    <Form.Item
                        name={name2}
                        className={styles.marginNone}
                        rules={rules?.[1]}
                    >
                        <InputNumber
                            min={0}
                            precision={0}
                            className={className}
                            {...event2Props}
                        />
                    </Form.Item>
                </Form.Item>
            </Form.Item>
        );
    }, []);
};

FormInputRange.typeList = typeList;

FormInputRange.formatter = () => {
    return transNullValue;
};

export default FormInputRange;


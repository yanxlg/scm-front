import React from 'react';
import { Form as AntdForm } from 'antd';
import { FormItemProps } from 'antd/lib/form/FormItem';
import {
    FormComponentProps,
    ValidationRule,
    FormProps,
    GetFieldDecoratorOptions, ValidateFieldsOptions,
} from 'antd/lib/form/Form';

class FormItem extends React.PureComponent<ProFormItemProps, any> {
    getFieldError = () => {
        const { isFieldTouched, getFieldError } = this.props.form;
        const { name, initValidate } = this.props;
        if (initValidate) {
            if (isFieldTouched(name)) {
                return getFieldError(name);
            }
            const errors = getFieldError(name);
            if (errors) {
                const filterErrors = errors.filter((item: any) => {
                    return /^\[submit\]/.test(item);
                });
                return filterErrors.length > 0
                    ? filterErrors.map((item: any) => {
                          return item.splice(0, 8);
                      })
                    : null;
            }
            return null;
        }
        return getFieldError(name);
    };
    getErrorHelp = () => {
        const error = this.getFieldError();
        return error ? { help: error } : { help: '' };
    };

    render() {
        const {
            name,
            form,
            children,
            rules,
            validateTrigger,
            initialValue,
            getValueFromEvent,
            normalize,
            trigger = 'onChange',
            validateFirst = true,
            valuePropName = 'value',
            ...props
        } = this.props;
        const { getFieldDecorator } = form;
        const mixProps = Object.assign(this.getErrorHelp(), props);
        return (
            <AntdForm.Item {...mixProps}>
                {getFieldDecorator(name, {
                    validateFirst: validateFirst,
                    validateTrigger: validateTrigger || ['onBlur', 'onChange'],
                    rules: rules,
                    initialValue,
                    getValueFromEvent,
                    normalize,
                    trigger,
                    valuePropName,
                })(children)}
            </AntdForm.Item>
        );
    }
}

class BaseForm<T extends FormComponentProps, S = {}, SS = any> extends React.PureComponent<
    T,
    S,
    SS
> {
    hasErrors = () => {
        const { getFieldsError } = this.props.form;
        const fieldsError = getFieldsError();
        return Object.keys(fieldsError).some(field => fieldsError[field]);
    };
    getFieldError = (name: string) => {
        const { isFieldTouched, getFieldError } = this.props.form;
        return isFieldTouched(name) && getFieldError(name);
    };
    getErrorHelp = (name: string) => {
        const error = this.getFieldError(name);
        return error ? { help: error } : { help: '' };
    };
    getValues = (fieldsName?: string[]) => this.props.form.getFieldsValue(fieldsName);
    validate = (options?: ValidateFieldsOptions)=>{
        return new Promise((resolve,reject)=>{
            this.props.form.validateFieldsAndScroll(
                {
                    first: true,
                    force: true,
                    ...options
                },
                (err, values) => {
                    if (!err) {
                        resolve(values);
                    }else{
                        reject()
                    }
                },
            );
        });
    }
}

export declare interface ProFormItemProps
    extends FormItemProps,
        FormComponentProps,
        GetFieldDecoratorOptions {
    name: string;
    rules?: ValidationRule[];
    initValidate?: boolean;
    validateTrigger?: string;
}

export declare interface ProFormProps extends FormProps {
    initValidate?: boolean;
}

class Form extends React.PureComponent<ProFormProps, any> {
    static BaseForm = BaseForm;
    static Item = FormItem;
    static create = AntdForm.create;
    componentDidMount() {
/*        const { initValidate } = this.props;
        if (initValidate && this.props.form) {
            this.props.form.validateFieldsAndScroll(
                {
                    first: true,
                    force: true,
                },
                () => {},
            );
        }*/
    }

    render() {
        const { initValidate, ...props } = this.props;
        return <AntdForm {...props} />;
    }
}

export { Form };

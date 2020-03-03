import React, { ReactNode, RefObject } from 'react';
import { Checkbox, DatePicker, Form, Input, InputNumber, Select } from 'antd';
import { FormProps } from 'antd/lib/form/Form';
import { FormItemLabelProps } from 'antd/es/form/FormItemLabel';
import { FormInstance } from 'antd/es/form';
import NumberInput from '@/components/NumberInput';
import IntegerInput from '@/components/IntegerInput';

const { Option } = Select;

declare interface IOptionItem {
    name: string;
    value: string | number;
}

export interface IFieldItem extends FormItemLabelProps {
    type: 'input' | 'select' | 'checkbox' | 'datePicker' | 'dateRanger' | 'number' | 'integer';
    name: string | [string, string];
    placeholder?: string;
    optionList?: IOptionItem[];
    className?: string;
    formItemClassName?: string;
    onChange?(status: boolean): void;
}

declare interface IJsonFormProps extends FormProps {
    fieldList: IFieldItem[];
    labelClassName?: string;
    appendChildren?: ReactNode;
    formRef?: RefObject<FormInstance>;
    initialValues?: object;
}

export default class JsonForm extends React.PureComponent<IJsonFormProps> {
    private formRef: RefObject<FormInstance> = React.createRef();
    private addFormItem = (field: IFieldItem) => {
        switch (field.type) {
            case 'input':
                return this.addInput(field);
            case 'select':
                return this.addSelect(field);
            case 'checkbox':
                return this.addCheckbox(field);
            case 'datePicker':
                return this.addDatePicker(field);
            case 'dateRanger':
                return this.addDateRanger(field);
            case 'integer':
                return this.addInteger(field);
            case 'number':
                return this.addNumber(field);
            default:
                return null;
        }
    };
    private addNumber = (field: IFieldItem) => {
        const { name, placeholder, label, className, formItemClassName } = field;
        const { labelClassName } = this.props;
        return (
            <Form.Item
                className={formItemClassName}
                name={name}
                label={<span className={labelClassName}>{label}</span>}
            >
                <NumberInput min={0} placeholder={placeholder} className={className} />
            </Form.Item>
        );
    };
    private addInteger = (field: IFieldItem) => {
        const { name, placeholder, label, className, formItemClassName } = field;
        const { labelClassName } = this.props;
        return (
            <Form.Item
                className={formItemClassName}
                name={name}
                label={<span className={labelClassName}>{label}</span>}
            >
                <IntegerInput min={0} placeholder={placeholder} className={className} />
            </Form.Item>
        );
    };

    private addDateRanger = (field: IFieldItem) => {
        const { labelClassName = '' } = this.props;
        const {
            label,
            className,
            name: [name1, name2],
            formItemClassName,
        } = field;
        return (
            <Form.Item
                label={<span className={labelClassName}>{label}</span>}
                className={formItemClassName}
            >
                <Form.Item
                    noStyle={true}
                    shouldUpdate={(prevValues, currentValues) =>
                        prevValues[name2] !== currentValues[name2]
                    }
                >
                    {({ getFieldValue }) => {
                        const endTime = getFieldValue(name2);
                        return (
                            <Form.Item name={name1} noStyle={true}>
                                <DatePicker
                                    disabledDate={currentDate =>
                                        currentDate
                                            ? endTime
                                                ? currentDate.isAfter(endTime)
                                                : false
                                            : false
                                    }
                                    className={className}
                                />
                            </Form.Item>
                        );
                    }}
                </Form.Item>
                <span className="config-colon">-</span>
                <Form.Item
                    noStyle={true}
                    shouldUpdate={(prevValues, currentValues) =>
                        prevValues[name1] !== currentValues[name1]
                    }
                >
                    {({ getFieldValue }) => {
                        const startTime = getFieldValue(name1);
                        return (
                            <Form.Item name={name2} noStyle={true}>
                                <DatePicker
                                    disabledDate={currentDate =>
                                        currentDate
                                            ? startTime
                                                ? currentDate.isBefore(startTime)
                                                : false
                                            : false
                                    }
                                    className={className}
                                />
                            </Form.Item>
                        );
                    }}
                </Form.Item>
            </Form.Item>
        );
    };

    private addInput = (field: IFieldItem) => {
        const { name, placeholder, label, className, formItemClassName } = field;
        const { labelClassName } = this.props;
        return (
            <Form.Item
                className={formItemClassName}
                name={name}
                label={<span className={labelClassName}>{label}</span>}
            >
                <Input placeholder={placeholder} className={className} />
            </Form.Item>
        );
    };

    private addSelect = (field: IFieldItem) => {
        const { name, optionList, label, className, formItemClassName } = field;
        const { labelClassName } = this.props;
        return (
            <Form.Item
                name={name}
                className={formItemClassName}
                label={<span className={labelClassName}>{label}</span>}
            >
                <Select className={className}>
                    {optionList!.map(item => (
                        <Option key={item.value} value={item.value}>
                            {item.name}
                        </Option>
                    ))}
                </Select>
            </Form.Item>
        );
    };

    private addDatePicker = (field: IFieldItem) => {
        const { name, placeholder, label, className, formItemClassName } = field;
        const { labelClassName } = this.props;
        return (
            <Form.Item
                name={name}
                className={formItemClassName}
                label={<span className={labelClassName}>{label}</span>}
            >
                <DatePicker className={className} placeholder={placeholder} />
            </Form.Item>
        );
    };

    private addCheckbox = (field: IFieldItem) => {
        const { name, label, formItemClassName, className, onChange } = field;
        return (
            <Form.Item name={name} className={formItemClassName} valuePropName="checked">
                <Checkbox onChange={e => onChange && onChange(e.target.checked)} className={className}>{label}</Checkbox>
            </Form.Item>
        );
    };

    public getFieldsValue = () => {
        const { formRef = this.formRef } = this.props;
        return formRef.current!.getFieldsValue();
    };

    render() {
        const {
            fieldList,
            labelClassName,
            appendChildren,
            formRef = this.formRef,
            ...props
        } = this.props;
        return (
            <Form layout="inline" {...props} ref={formRef}>
                {fieldList.map(field => this.addFormItem(field))}
                {appendChildren}
            </Form>
        );
    }
}

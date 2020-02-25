import React from 'react';
import { Form, Input, Checkbox, Select, DatePicker } from 'antd';
import { FormProps } from 'antd/lib/form/Form';
import { FormItemLabelProps } from 'antd/es/form/FormItemLabel';

const { Option } = Select;

declare interface IOptionItem {
    name: string;
    value: string;
}

export interface IFieldItem extends FormItemLabelProps {
    type: 'input' | 'select' | 'checkbox' | 'datePicker' | 'dateRanger';
    name: string | [string, string];
    placeholder?: string;
    optionList?: IOptionItem[];
    className?: string;
    formItemClassName?: string;
}

declare interface IJsonFormProps extends FormProps {
    fieldList: IFieldItem[];
    labelClassName?: string;
}

export default class JsonForm extends React.PureComponent<IJsonFormProps> {
    addFormItem = (field: IFieldItem) => {
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
            default:
                return null;
        }
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

    addInput = (field: IFieldItem) => {
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

    addSelect = (field: IFieldItem) => {
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

    addDatePicker = (field: IFieldItem) => {
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

    addCheckbox = (field: IFieldItem) => {
        const { name, label, formItemClassName, className } = field;
        return (
            <Form.Item name={name} className={formItemClassName}>
                <Checkbox className={className}>{label}</Checkbox>
            </Form.Item>
        );
    };

    render() {
        const { fieldList, labelClassName, ...props } = this.props;

        return (
            <Form layout="inline" {...props}>
                {fieldList.map(field => this.addFormItem(field))}
            </Form>
        );
    }
}

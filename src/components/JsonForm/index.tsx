import React, { RefObject } from 'react';
import { Checkbox, DatePicker, Form, Input, Select } from 'antd';
import { FormProps } from 'antd/lib/form/Form';
import { FormItemLabelProps } from 'antd/es/form/FormItemLabel';
import { FormInstance } from 'antd/es/form';

import NumberInput from '@/components/NumberInput';
import IntegerInput from '@/components/IntegerInput';
import moment, { Moment } from 'moment';
import { transNumber, transNullValue } from '@/utils/transform';
import { transEndDate, transStartDate } from '@/utils/date';

const { Option } = Select;

declare interface IOptionItem {
    name: string;
    value: string;
}

export interface IFieldItem extends FormItemLabelProps {
    type: 'input' | 'select' | 'checkbox' | 'datePicker' | 'dateRanger' | 'number' | 'integer';
    name: string | [string, string];
    placeholder?: string;
    optionList?: IOptionItem[];
    className?: string;
    formItemClassName?: string;
    dateBeginWith?: string[];
    dateEndWith?: string[];
    formatter?: formatter;
}

declare interface IJsonFormProps extends FormProps {
    fieldList: IFieldItem[];
    labelClassName?: string;
    formRef?: RefObject<FormInstance>;
}

type formatter = 'number' | 'start_date' | 'end_date';

export default class JsonForm extends React.PureComponent<IJsonFormProps> {
    private formRef: RefObject<FormInstance> = React.createRef();
    private disabledStartDate = (dateBeginWith?: string[]) => {
        if (!dateBeginWith || dateBeginWith.length === 0) {
            return undefined;
        }
        return (startTime: Moment | null) => {
            let timeMax: number | undefined = undefined;
            // 取最小值=> endOf('d');
            dateBeginWith.map(dependence => {
                const date =
                    dependence === 'now'
                        ? moment()
                        : this.formRef.current!.getFieldValue(dependence);
                if (date) {
                    const time = date.startOf('day').valueOf();
                    if ((timeMax && time < timeMax) || timeMax === void 0) {
                        timeMax = time;
                    }
                }
            });
            if (!startTime || timeMax === void 0) {
                return false;
            }
            return startTime.startOf('day').valueOf() < timeMax;
        };
    };
    private disabledEndDate = (dateEndWith?: string[]) => {
        if (!dateEndWith || dateEndWith.length === 0) {
            return undefined;
        }
        return (endTime: Moment | null) => {
            let timeMax: number | undefined = undefined;
            // 取最大值=> startOf('d');
            dateEndWith.map(dependence => {
                const date =
                    dependence === 'now'
                        ? moment()
                        : this.formRef.current!.getFieldValue(dependence);
                if (date) {
                    const time = date.endOf('day').valueOf();
                    if ((timeMax && time < timeMax) || timeMax === void 0) {
                        timeMax = time;
                    }
                }
            });
            if (!endTime || timeMax === void 0) {
                return false;
            }
            return timeMax < endTime.endOf('day').valueOf();
        };
    };

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
        const {
            name,
            placeholder,
            label,
            className,
            formItemClassName,
            dateBeginWith,
            dateEndWith,
        } = field;
        const { labelClassName } = this.props;
        const disabledDate = dateBeginWith
            ? this.disabledStartDate(dateBeginWith)
            : dateEndWith
            ? this.disabledEndDate(dateEndWith)
            : undefined;
        return (
            <Form.Item
                name={name}
                className={formItemClassName}
                label={<span className={labelClassName}>{label}</span>}
            >
                <DatePicker
                    className={className}
                    placeholder={placeholder}
                    disabledDate={disabledDate}
                />
            </Form.Item>
        );
    };

    private addCheckbox = (field: IFieldItem) => {
        const { name, label, formItemClassName, className } = field;
        return (
            <Form.Item name={name} className={formItemClassName}>
                <Checkbox className={className}>{label}</Checkbox>
            </Form.Item>
        );
    };

    public getFieldsValue = () => {
        const { formRef = this.formRef } = this.props;
        const originValues = formRef.current!.getFieldsValue();
        return this.formatter(originValues);
    };

    private getFormatCallback = (format?: formatter) => {
        return format
            ? format === 'number'
                ? transNumber
                : format === 'start_date'
                ? transStartDate
                : format === 'end_date'
                ? transEndDate
                : transNullValue
            : transNullValue;
    };
    private formatter = (originValues: { [name: string]: any }) => {
        let formattedValues: { [name: string]: any } = {};
        for (let key in originValues) {
            if (originValues.hasOwnProperty(key)) {
                const format = this.formatterMap.get(key);
                const formatCallback = this.getFormatCallback(format);
                formattedValues[key] = formatCallback(originValues[key]);
            }
        }
        return formattedValues;
    };
    private formatterMap = new Map<string, formatter>();
    private resetFormatterMap = () => {
        const { fieldList } = this.props;
        fieldList.forEach(({ name, formatter }) => {
            if (formatter) {
                if (typeof name === 'string') {
                    this.formatterMap.set(name, formatter);
                } else {
                    name.forEach(item => {
                        this.formatterMap.set(item, formatter);
                    });
                }
            }
        });
    };
    componentDidMount(): void {
        this.resetFormatterMap();
    }
    componentDidUpdate(
        prevProps: Readonly<IJsonFormProps>,
        prevState: Readonly<{}>,
        snapshot?: any,
    ): void {
        if (prevProps.fieldList !== this.props.fieldList) {
            this.resetFormatterMap();
        }
    }

    render() {
        const {
            fieldList,
            labelClassName,
            children,
            formRef = this.formRef,
            ...props
        } = this.props;
        return (
            <Form layout="inline" {...props} ref={formRef}>
                {fieldList.map(field => this.addFormItem(field))}
                {children}
            </Form>
        );
    }
}

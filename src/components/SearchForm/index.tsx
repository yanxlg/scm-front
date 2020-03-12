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
import '@/styles/form.less';
import '@/styles/index.less';
import '@/styles/config.less';

const { Option } = Select;

declare interface IOptionItem {
    name: string;
    value: string | number;
    [key: string]: any;
}

type formatter = 'number' | 'start_date' | 'end_date';

type FormItemName = string;

type setStateFunc = <K extends keyof ISearchFormState>(
    state:
        | ((
              prevState: Readonly<ISearchFormState>,
              props: Readonly<ISearchFormProps>,
          ) => Pick<ISearchFormState, K> | ISearchFormState | null)
        | (Pick<ISearchFormState, K> | ISearchFormState | null),
    callback?: () => void,
) => void;

type SingleField = {
    type: 'input' | 'select' | 'checkbox' | 'datePicker' | 'number' | 'integer';
    name: FormItemName;
    formatter?: formatter;
};

type DoubleFields = {
    type: 'dateRanger';
    name: [FormItemName, FormItemName];
    formatter?: [formatter, formatter];
};

export type IFieldItem = FormItemLabelProps & {
    placeholder?: string;
    optionList?: IOptionItem[] | (() => Promise<IOptionItem[]>); // 支持异步获取
    syncDefaultOption?: IOptionItem; // 异步获取options是默认选项，通常用于胚子'全部'
    optionListDependence?: {
        name: FormItemName; // 异步存储在state中的数据
        key: string; // 关联key
        convert?: (item: any) => IOptionItem;
    };
    className?: string;
    formItemClassName?: string;
    dateBeginWith?: Array<FormItemName | 'now'>;
    dateEndWith?: Array<FormItemName | 'now'>;
    onChange?: (name: FormItemName, form: FormInstance, setState: setStateFunc) => void; // change监听，支持外部执行表单操作，可以实现关联筛选，重置等操作
} & (SingleField | DoubleFields);

declare interface ISearchFormProps extends FormProps {
    fieldList: IFieldItem[];
    labelClassName?: string;
    formRef?: RefObject<FormInstance>;
}

declare interface ISearchFormState {
    optionMap: {
        [key: string]: IOptionItem[];
    };
}

export default class SearchForm extends React.PureComponent<ISearchFormProps, ISearchFormState> {
    private formRef: RefObject<FormInstance> = React.createRef();
    private formatterMap = new Map<string, formatter>();

    constructor(props: ISearchFormProps) {
        super(props);
        this.state = {
            optionMap: {},
        };
    }

    private loadOptions = () => {
        const { fieldList } = this.props;
        fieldList.forEach(field => {
            if (field.type === 'select') {
                const optionList = field.optionList;
                if (typeof optionList === 'function') {
                    const name = field.name as string;
                    optionList()
                        .then(optionList => {
                            this.setState(({ optionMap, ...state }) => {
                                return {
                                    ...state,
                                    optionMap: {
                                        ...optionMap,
                                        [name]: optionList,
                                    },
                                };
                            });
                        })
                        .catch(() => {
                            this.setState(({ optionMap, ...state }) => {
                                return {
                                    ...state,
                                    optionMap: {
                                        ...optionMap,
                                        [name]: [],
                                    },
                                };
                            });
                        });
                }
            }
        });
    };
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
        const { name, placeholder, label, className, formItemClassName, onChange } = field;
        const { labelClassName } = this.props;
        const eventProps = onChange
            ? {
                  onChange: () => {
                      onChange(
                          name as FormItemName,
                          this.formRef.current!,
                          this.setState as setStateFunc,
                      );
                  },
              }
            : {};
        return (
            <Form.Item
                key={String(name)}
                className={formItemClassName}
                name={name}
                label={<span className={labelClassName}>{label}</span>}
            >
                <NumberInput
                    min={0}
                    placeholder={placeholder}
                    className={className}
                    {...eventProps}
                />
            </Form.Item>
        );
    };
    private addInteger = (field: IFieldItem) => {
        const { name, placeholder, label, className, formItemClassName, onChange } = field;
        const { labelClassName } = this.props;
        const eventProps = onChange
            ? {
                  onChange: () => {
                      onChange(
                          name as FormItemName,
                          this.formRef.current!,
                          this.setState as setStateFunc,
                      );
                  },
              }
            : {};
        return (
            <Form.Item
                key={String(name)}
                className={formItemClassName}
                name={name}
                label={<span className={labelClassName}>{label}</span>}
            >
                <IntegerInput
                    min={0}
                    placeholder={placeholder}
                    className={className}
                    {...eventProps}
                />
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
            onChange,
        } = field;
        const event1Props = onChange
            ? {
                  onChange: () => {
                      onChange(
                          name1 as FormItemName,
                          this.formRef.current!,
                          this.setState as setStateFunc,
                      );
                  },
              }
            : {};
        const event2Props = onChange
            ? {
                  onChange: () => {
                      onChange(
                          name2 as FormItemName,
                          this.formRef.current!,
                          this.setState as setStateFunc,
                      );
                  },
              }
            : {};
        return (
            <Form.Item
                key={String([name1, name2])}
                label={<span className={labelClassName}>{label}</span>}
                className={`${formItemClassName}`}
            >
                <Form.Item
                    shouldUpdate={(prevValues, currentValues) =>
                        prevValues[name2] !== currentValues[name2]
                    }
                    className="form-item-inline inline-block margin-none vertical-middle"
                >
                    {({ getFieldValue }) => {
                        const endTime = getFieldValue(name2);
                        return (
                            <Form.Item name={name1} className="margin-none">
                                <DatePicker
                                    disabledDate={currentDate =>
                                        currentDate
                                            ? endTime
                                                ? currentDate.isAfter(endTime)
                                                : false
                                            : false
                                    }
                                    className={className}
                                    {...event1Props}
                                />
                            </Form.Item>
                        );
                    }}
                </Form.Item>
                <span className="config-colon vertical-middle">-</span>
                <Form.Item
                    className="form-item-inline inline-block vertical-middle margin-none"
                    shouldUpdate={(prevValues, currentValues) =>
                        prevValues[name1] !== currentValues[name1]
                    }
                >
                    {({ getFieldValue }) => {
                        const startTime = getFieldValue(name1);
                        return (
                            <Form.Item name={name2} className="margin-none">
                                <DatePicker
                                    disabledDate={currentDate =>
                                        currentDate
                                            ? startTime
                                                ? currentDate.isBefore(startTime)
                                                : false
                                            : false
                                    }
                                    className={className}
                                    {...event2Props}
                                />
                            </Form.Item>
                        );
                    }}
                </Form.Item>
            </Form.Item>
        );
    };

    private addInput = (field: IFieldItem) => {
        const { name, placeholder, label, className, formItemClassName, onChange } = field;
        const { labelClassName } = this.props;
        const eventProps = onChange
            ? {
                  onChange: () => {
                      onChange(
                          name as FormItemName,
                          this.formRef.current!,
                          this.setState as setStateFunc,
                      );
                  },
              }
            : {};
        return (
            <Form.Item
                key={String(name)}
                className={formItemClassName}
                name={name}
                label={<span className={labelClassName}>{label}</span>}
            >
                <Input placeholder={placeholder} className={className} {...eventProps} />
            </Form.Item>
        );
    };

    private getOptionList(field: IFieldItem): { loading: boolean; optionList: IOptionItem[] } {
        const { name, optionList, optionListDependence } = field;
        const isFunction = typeof optionList === 'function';
        if (isFunction) {
            const { optionMap } = this.state;
            const syncOptionList = optionMap[name as string];
            const loading = isFunction && !syncOptionList;
            const mergeList = syncOptionList || ([] as IOptionItem[]);
            return {
                loading: loading,
                optionList: mergeList,
            };
        } else if (optionList === void 0) {
            if (optionListDependence) {
                const { name: dependenceName, key: dependenceKey, convert } = optionListDependence;
                const { optionMap } = this.state;
                const form = this.formRef.current;
                const dependenceValue = form?.getFieldValue(dependenceName);
                const parentList = optionMap[dependenceName];
                const parentItem = parentList?.find(({ value }) => value === dependenceValue);
                const dependenceList = parentItem?.[dependenceKey] ?? undefined;
                const convertList = dependenceList?.map((item: any) =>
                    convert ? convert(item) : item,
                );
                const loading = !parentList;
                const mergeList = convertList || ([] as IOptionItem[]);
                return {
                    loading: loading,
                    optionList: mergeList,
                };
            } else {
                return {
                    loading: false,
                    optionList: [] as IOptionItem[],
                };
            }
        } else {
            return {
                loading: false,
                optionList: (optionList || []) as IOptionItem[],
            };
        }
    }

    private addSelect = (field: IFieldItem) => {
        const {
            name,
            label,
            className,
            formItemClassName,
            syncDefaultOption,
            optionListDependence,
            onChange,
        } = field;
        const { labelClassName } = this.props;
        const eventProps = onChange
            ? {
                  onChange: () => {
                      onChange(
                          name as FormItemName,
                          this.formRef.current!,
                          this.setState as setStateFunc,
                      );
                  },
              }
            : {};

        if (optionListDependence === void 0) {
            const { loading, optionList } = this.getOptionList(field);
            return (
                <Form.Item
                    key={String(name)}
                    name={name}
                    className={formItemClassName}
                    label={<span className={labelClassName}>{label}</span>}
                >
                    <Select className={className} loading={loading} {...eventProps}>
                        {syncDefaultOption ? (
                            <Option value={syncDefaultOption.value}>
                                {syncDefaultOption.name}
                            </Option>
                        ) : null}
                        {optionList!.map(item => (
                            <Option key={item.value} value={item.value}>
                                {item.name}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>
            );
        } else {
            return (
                <Form.Item
                    key={String(name)}
                    noStyle={true}
                    shouldUpdate={(prevValues, currentValues) =>
                        prevValues[optionListDependence?.name] !==
                        currentValues[optionListDependence?.name]
                    }
                >
                    {({ getFieldValue }) => {
                        const { loading, optionList } = this.getOptionList(field);
                        return (
                            <Form.Item
                                name={name}
                                className={formItemClassName}
                                label={<span className={labelClassName}>{label}</span>}
                            >
                                <Select className={className} loading={loading} {...eventProps}>
                                    {syncDefaultOption ? (
                                        <Option value={syncDefaultOption.value}>
                                            {syncDefaultOption.name}
                                        </Option>
                                    ) : null}
                                    {optionList!.map(item => (
                                        <Option key={item.value} value={item.value}>
                                            {item.name}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        );
                    }}
                </Form.Item>
            );
        }
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
            onChange,
        } = field;
        const { labelClassName } = this.props;
        const disabledDate = dateBeginWith
            ? this.disabledStartDate(dateBeginWith)
            : dateEndWith
            ? this.disabledEndDate(dateEndWith)
            : undefined;
        const eventProps = onChange
            ? {
                  onChange: () => {
                      onChange(
                          name as FormItemName,
                          this.formRef.current!,
                          this.setState as setStateFunc,
                      );
                  },
              }
            : {};
        return (
            <Form.Item
                key={String(name)}
                name={name}
                className={formItemClassName}
                label={<span className={labelClassName}>{label}</span>}
            >
                <DatePicker
                    className={className}
                    placeholder={placeholder}
                    disabledDate={disabledDate}
                    {...eventProps}
                />
            </Form.Item>
        );
    };

    private addCheckbox = (field: IFieldItem) => {
        const { name, label, formItemClassName, className, onChange } = field;
        const eventProps = onChange
            ? {
                  onChange: () => {
                      onChange(
                          name as FormItemName,
                          this.formRef.current!,
                          this.setState as setStateFunc,
                      );
                  },
              }
            : {};
        return (
            <Form.Item
                key={String(name)}
                name={name}
                className={formItemClassName}
                valuePropName="checked"
            >
                <Checkbox className={className} {...eventProps}>
                    {label}
                </Checkbox>
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

    private resetFormatterMap = () => {
        const { fieldList } = this.props;
        this.formatterMap.clear();
        fieldList.forEach(({ name, formatter }) => {
            if (formatter) {
                if (typeof name === 'string') {
                    this.formatterMap.set(name, formatter as formatter);
                } else {
                    name.forEach((item, index) => {
                        this.formatterMap.set(item, (formatter as [formatter, formatter])[index]);
                    });
                }
            }
        });
    };
    componentDidMount(): void {
        this.resetFormatterMap();
        this.loadOptions();
    }

    componentDidUpdate(
        prevProps: Readonly<ISearchFormProps>,
        prevState: Readonly<{}>,
        snapshot?: any,
    ): void {
        if (prevProps.fieldList !== this.props.fieldList) {
            this.resetFormatterMap();
            this.loadOptions();
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

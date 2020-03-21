import React, {
    forwardRef,
    ForwardRefRenderFunction,
    useCallback,
    useImperativeHandle,
    useMemo,
} from 'react';
import { Form } from 'antd';
import { FormProps } from 'antd/lib/form/Form';
import FormInput, {
    InputType,
    InputProps,
    InputFormatter,
} from '@/components/SearchForm/items/Input';
import FormSelect, {
    SelectType,
    SelectProps,
    SelectFormatter,
} from '@/components/SearchForm/items/Select';
import FormCheckbox, { CheckboxType, CheckboxProps } from '@/components/SearchForm/items/Checkbox';
import FormDatePicker, {
    DatePickerProps,
    DatePickerType,
    DatePickerFormatter,
} from '@/components/SearchForm/items/DatePicker';
import FormDateRanger, {
    DateRangerType,
    DateRangerProps,
    DateRangerFormatter,
} from '@/components/SearchForm/items/DateRanger';
import { Store, ValidateFields } from 'rc-field-form/lib/interface';
import { FormInstance } from 'antd/es/form';

export declare interface CustomFormProps {
    labelClassName?: string;
}

export type FormField = (
    | Omit<InputProps, 'form'>
    | Omit<SelectProps, 'form'>
    | Omit<CheckboxProps, 'form'>
    | Omit<DatePickerProps, 'form'>
    | Omit<DateRangerProps, 'form'>
) & {
    form?: FormInstance;
};

declare interface SearchFormProps extends FormProps, CustomFormProps {
    fieldList: Array<FormField>;
}

export type FormItemName = string;

export declare interface CustomFormProps {
    labelClassName?: string;
}

export interface SearchFormRef {
    getFieldsValue: () => Store;
    validateFields: ValidateFields;
}

const SearchForm: ForwardRefRenderFunction<SearchFormRef, SearchFormProps> = (
    { fieldList, ...props },
    ref,
) => {
    const [form] = Form.useForm();

    const getValues = useCallback(() => {
        let values: Store = {};
        fieldList.map(({ type, name, formatter }) => {
            if (FormInput.typeList.includes(type)) {
                values[name as string] = FormInput.formatter(formatter as InputFormatter)(
                    form.getFieldValue(name),
                );
            } else if (FormSelect.typeList.includes(type)) {
                values[name as string] = FormSelect.formatter(formatter as SelectFormatter)(
                    form.getFieldValue(name),
                );
            } else if (FormDateRanger.typeList.includes(type)) {
                const [name1, name2] = name;
                values[name1] = FormDateRanger.formatter(formatter?.[0] as DateRangerFormatter)(
                    form.getFieldValue(name1),
                );
                values[name2] = FormDateRanger.formatter(formatter?.[1] as DateRangerFormatter)(
                    form.getFieldValue(name2),
                );
            } else if (FormDatePicker.typeList.includes(type)) {
                values[name as string] = FormDatePicker.formatter(formatter as DatePickerFormatter)(
                    form.getFieldValue(name),
                );
            } else {
                return form.getFieldValue(name);
            }
        });
        return values;
    }, [fieldList]);

    useImperativeHandle(
        ref,
        () => {
            return {
                getFieldsValue: getValues,
                validateFields: () => {
                    return form.validateFields().then(() => {
                        return getValues();
                    });
                },
            };
        },
        [],
    );
    return useMemo(() => {
        const { labelClassName, children, ..._props } = props;
        return (
            <Form layout="inline" {..._props} form={form}>
                {fieldList.map(({ type, ...field }) => {
                    if (FormInput.typeList.includes(type)) {
                        return (
                            <FormInput
                                key={String(field.name)}
                                {...(field as InputProps)}
                                type={type as InputType}
                                labelClassName={labelClassName}
                                form={form}
                            />
                        );
                    }
                    if (FormSelect.typeList.includes(type)) {
                        return (
                            <FormSelect
                                key={String(field.name)}
                                {...(field as SelectProps)}
                                type={type as SelectType}
                                labelClassName={labelClassName}
                                form={form}
                            />
                        );
                    }
                    if (FormCheckbox.typeList.includes(type)) {
                        return (
                            <FormCheckbox
                                key={String(field.name)}
                                {...(field as CheckboxProps)}
                                type={type as CheckboxType}
                                labelClassName={labelClassName}
                                form={form}
                            />
                        );
                    }
                    if (FormDatePicker.typeList.includes(type)) {
                        return (
                            <FormDatePicker
                                key={String(field.name)}
                                {...(field as DatePickerProps)}
                                type={type as DatePickerType}
                                labelClassName={labelClassName}
                                form={form}
                            />
                        );
                    }
                    if (FormDateRanger.typeList.includes(type)) {
                        return (
                            <FormDateRanger
                                key={String(field.name)}
                                {...(field as DateRangerProps)}
                                type={type as DateRangerType}
                                labelClassName={labelClassName}
                                form={form}
                            />
                        );
                    }
                    return null;
                })}
                {children}
            </Form>
        );
    }, [fieldList]);
};

const exportComponent = forwardRef(SearchForm);

export default exportComponent;

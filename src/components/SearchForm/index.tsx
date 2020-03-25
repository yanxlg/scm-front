import React, {
    forwardRef,
    ForwardRefRenderFunction,
    useCallback,
    useImperativeHandle,
    useMemo,
    useRef,
    useState,
} from 'react';
import { Button, Form } from 'antd';
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
import RcResizeObserver from 'rc-resize-observer';

import '@/styles/index.less';
import { UpOutlined, DownOutlined } from '@ant-design/icons';

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
    rowHeight?: number; // 行高，默认为60
    defaultCollapse?: boolean; // 初始状态，默认为true
    enableCollapse?: boolean; // 默认为true
}

export type FormItemName = string;

export declare interface CustomFormProps {
    labelClassName?: string;
}

export interface SearchFormRef {
    getFieldsValue: () => Store;
    validateFields: ValidateFields;
}

const SearchForm: ForwardRefRenderFunction<SearchFormRef, SearchFormProps> = (props, ref) => {
    const {
        fieldList,
        children,
        labelClassName,
        rowHeight = 56,
        defaultCollapse = true,
        enableCollapse = true,
        ..._props
    } = props;

    const [collapse, setCollapse] = useState<boolean>(defaultCollapse);

    const [collapseBtnVisible, setCollapseBtnVisible] = useState(false);

    const [form] = Form.useForm();

    const wrapRef = useRef<HTMLDivElement>(null);
    const btnWrap = useRef<HTMLDivElement>(null);

    const [formHeight, setFormHeight] = useState<number | undefined>(
        defaultCollapse ? rowHeight : undefined,
    );

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

    const onCollapseChange = useCallback(() => {
        // 需要判断当前元素位置
        setCollapse(!collapse);
    }, [collapse]);

    const equalSize = useCallback((size, value) => {
        return Math.abs(value - size) <= 1;
    }, []);

    const onResize = useCallback(({ height, width }) => {
        if (enableCollapse) {
            const btnWrapOffsetLeft = btnWrap.current!.offsetLeft;
            if (btnWrapOffsetLeft === 0) {
                // 按钮换行了
                if (equalSize(height, rowHeight * 2)) {
                    setFormHeight(rowHeight);
                    setCollapseBtnVisible(false);
                    return;
                }
            }
            if (equalSize(height, rowHeight)) {
                setCollapseBtnVisible(false);
                setFormHeight(height);
                return;
            }
            setFormHeight(height);
            setCollapseBtnVisible(true);
        }
    }, []);

    const collapseBtn = useMemo(() => {
        if (enableCollapse) {
            return (
                <div
                    ref={btnWrap}
                    style={{
                        display: 'flex',
                        flex: collapse ? 1 : 0,
                        justifyContent: 'flex-end',
                        visibility: collapseBtnVisible ? 'visible' : 'hidden',
                    }}
                >
                    <Button
                        type="link"
                        className="form-item"
                        style={{ float: 'right' }}
                        onClick={onCollapseChange}
                    >
                        {collapse ? (
                            <>
                                收起至一行
                                <UpOutlined />
                            </>
                        ) : (
                            <>
                                展开
                                <DownOutlined />
                            </>
                        )}
                    </Button>
                </div>
            );
        } else {
            return null;
        }
    }, [collapseBtnVisible, collapse]);

    const fromItemList = useMemo(() => {
        return fieldList.map(({ type, ...field }) => {
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
        });
    }, [fieldList]);

    const formContent = useMemo(() => {
        if (collapse) {
            return (
                <>
                    {fromItemList}
                    {children}
                    {collapseBtn}
                </>
            );
        } else {
            return (
                <div className="flex flex-1">
                    <div className="flex-1 flex-row" style={{ flexWrap: 'wrap' }}>
                        {fromItemList}
                    </div>
                    {children}
                    {collapseBtn}
                </div>
            );
        }
    }, [fieldList, children, collapse, collapseBtnVisible]);

    const formComponent = useMemo(() => {
        return (
            <RcResizeObserver onResize={onResize}>
                <div>
                    <Form layout="inline" {..._props} form={form}>
                        {formContent}
                    </Form>
                </div>
            </RcResizeObserver>
        );
    }, [fieldList, collapseBtnVisible, collapse, children]);

    return useMemo(() => {
        const style = enableCollapse
            ? collapse
                ? {
                      overflow: 'hidden',
                      height: formHeight,
                  }
                : {
                      overflow: 'hidden',
                      height: rowHeight,
                  }
            : {};

        return (
            <div ref={wrapRef} style={style}>
                {formComponent}
            </div>
        );
    }, [formHeight, fieldList, collapseBtnVisible, collapse, children]);
};

const exportComponent = forwardRef(SearchForm);

export default exportComponent;

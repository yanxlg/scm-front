import React, { useCallback, useMemo } from 'react';
import { Select, Radio, Form } from 'antd';
import { SelectProps } from 'antd/es/select';
import { IOptionItem } from 'react-components/es/JsonForm/items/Select';
import { FormInstance, FormItemProps } from 'antd/lib/form';
import { FormItemLabelProps } from 'antd/es/form/FormItemLabel';

const { Option } = Select;

type IProps = {
    // label: string;
    name: string;
    optionList: IOptionItem[];
    dependencies?: string[];
    form: FormInstance;
    onChange?(): void;
    rules?: any[];
} & SelectProps<string> &
    FormItemLabelProps;

const MultipleSelect: React.FC<IProps> = ({
    label,
    optionList,
    name,
    form,
    dependencies,
    rules,
    maxTagCount = 4,
    placeholder = '请选择',
    mode = 'multiple',
    onChange,
    ...resetProps
}) => {
    const eventProps = useMemo(() => {
        return onChange
            ? {
                  onChange: () => {
                      onChange();
                  },
              }
            : {};
    }, []);

    const getOptionList = useCallback(() => {
        if (!dependencies) {
            return optionList;
        }
        let parentList: IOptionItem[] = [...optionList];
        for (let i = 0; i < dependencies.length; i++) {
            const currentName = dependencies[i];
            const vals = form.getFieldValue(currentName);
            if (vals && vals.length > 0) {
                const checkedList = parentList.filter(({ value }) => vals.indexOf(value) > -1);
                let childrenList: IOptionItem[] = [];
                checkedList.forEach(
                    ({ children }) => (childrenList = childrenList.concat(children || [])),
                );
                parentList = childrenList;
            } else {
                parentList = [];
                break;
            }
        }
        return parentList;
    }, [optionList, dependencies]);

    const dropdownRender = useCallback(
        (menu: React.ReactElement): React.ReactElement => {
            const list = getOptionList();
            if (list.length) {
                return (
                    <div>
                        <Radio.Group style={{ display: 'flex', padding: '5px 0' }} value="">
                            <Radio.Button
                                value="1"
                                style={{ flex: 1, textAlign: 'center' }}
                                onClick={() => {
                                    form?.setFieldsValue({
                                        [name]: list.map(item => item.value),
                                    });
                                    onChange && onChange();
                                }}
                            >
                                全选
                            </Radio.Button>
                            <Radio.Button
                                value="0"
                                style={{ flex: 1, textAlign: 'center' }}
                                onClick={() => {
                                    form?.setFieldsValue({
                                        [name]: [],
                                    });
                                    onChange && onChange();
                                }}
                            >
                                取消全选
                            </Radio.Button>
                        </Radio.Group>
                        {menu}
                    </div>
                );
            }
            return menu;
        },
        [getOptionList, name],
    );

    return (
        <Form.Item
            noStyle={true}
            dependencies={dependencies}
            shouldUpdate={(prevValues, currentValues) => {
                if (!dependencies) {
                    return false;
                }
                let updated = false;
                let i = 0;
                let length = dependencies.length;
                while (!updated && i < length) {
                    const dependenceName = dependencies[i];
                    updated = prevValues[dependenceName] !== currentValues[dependenceName];
                    i++;
                }
                return updated;
            }}
        >
            {() => {
                const list = getOptionList();
                return (
                    <Form.Item label={label} name={name} rules={rules}>
                        <Select
                            mode={mode}
                            maxTagCount={maxTagCount}
                            placeholder={placeholder}
                            dropdownRender={dropdownRender}
                            {...eventProps}
                            {...resetProps}
                        >
                            {list.map(({ name, value }) => (
                                <Option key={value} value={value}>
                                    {name}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>
                );
            }}
        </Form.Item>
    );
};

export default React.memo(MultipleSelect);

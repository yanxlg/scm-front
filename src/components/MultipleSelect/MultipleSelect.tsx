import React, { useCallback, useMemo } from 'react';
import { Select, Radio } from 'antd';
import { SelectProps } from 'antd/es/select';
import { IOptionItem } from 'react-components/lib/JsonForm/items/Select';
import { FormInstance } from 'antd/lib/form';

const { Option } = Select;

type IProps = {
    name: string;
    optionList: IOptionItem[];
    dependNameList?: string[];
    form: FormInstance;
    onChange?(): void;
} & SelectProps<string>;
// Omit<SelectProps<string>, 'onChange'>

const MultipleSelect: React.FC<IProps> = ({
    optionList,
    name,
    form,
    dependNameList,
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

    const list = useMemo(() => {
        if (!dependNameList) {
            return optionList;
        }
        let parentList: IOptionItem[] = [...optionList];
        for (let i = 0; i < dependNameList.length; i++) {
            const currentName = dependNameList[i];
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
        // return optionList;
    }, [optionList, dependNameList]);

    const dropdownRender = useCallback(
        (menu: React.ReactElement): React.ReactElement => {
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
                                    // const { onChange } = resetProps;
                                    // onChange && onChange();
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
                                    // onChange && onChange();
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
        [list, name, resetProps],
    );

    return (
        <Select
            mode={mode}
            placeholder={placeholder}
            {...eventProps}
            dropdownRender={dropdownRender}
            {...resetProps}
        >
            {list.map(({ name, value }) => (
                <Option key={name} value={value}>
                    {name}
                </Option>
            ))}
        </Select>
    );
};

export default React.memo(MultipleSelect);

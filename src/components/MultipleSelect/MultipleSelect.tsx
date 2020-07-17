import React, { useCallback, useMemo } from 'react';
import { TreeSelect, Form } from 'antd';
import { IOptionItem } from 'react-components/lib/JsonForm/items/Select';
import { FormInstance } from 'antd/lib/form';
import { FormItemLabelProps } from 'antd/es/form/FormItemLabel';
import { TreeSelectProps } from 'antd/es/tree-select';

import formStyles from 'react-components/es/JsonForm/_form.less';

type IProps = {
    // label: string;
    name: string;
    optionList: IOptionItem[];
    dependencies?: string[];
    form: FormInstance;
    onChange?(): void;
    rules?: any[];
} & TreeSelectProps<string> &
    FormItemLabelProps;

const MultipleSelect: React.FC<IProps> = ({
    label,
    optionList,
    name,
    form,
    dependencies,
    rules,
    treeCheckable = true,
    treeDefaultExpandAll = true,
    maxTagCount = 6,
    treeNodeLabelProp = 'name',
    placeholder = '请选择',
    dropdownClassName = formStyles.customTreeSelect,
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

    const getTreeData = useCallback((optionList: IOptionItem[]) => {
        if (optionList.length === 0) {
            return [];
        }
        return [
            {
                name: '全部',
                value: 'all',
                children: optionList.map(({ name, value, disabled }) => ({
                    name,
                    value,
                    disabled,
                })),
            },
        ];
    }, []);

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
                const treeData = getTreeData(list);
                return (
                    <Form.Item name={name} label={label} rules={rules}>
                        <TreeSelect
                            treeNodeLabelProp="name"
                            treeData={treeData}
                            treeCheckable={treeCheckable}
                            maxTagCount={maxTagCount}
                            treeDefaultExpandAll={treeDefaultExpandAll}
                            placeholder={placeholder}
                            dropdownClassName={dropdownClassName}
                            {...eventProps}
                            {...resetProps}
                        />
                    </Form.Item>
                );
            }}
        </Form.Item>
    );
};

export default React.memo(MultipleSelect);

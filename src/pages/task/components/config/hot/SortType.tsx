import React, { useMemo } from 'react';
import { FormInstance } from 'antd/es/form';
import { Form, Select } from 'antd';
import { HotTaskRange } from '@/enums/StatusEnum';
import formStyles from 'react-components/es/JsonForm/_form.less';
import { TaskChannelEnum } from '@/config/dictionaries/Task';
import { IPDDSortItem } from '@/interface/ITask';
import classNames from 'classnames';

declare interface SortTypeProps {
    form: FormInstance;
    listSort: IPDDSortItem[];
    merchantSort: IPDDSortItem[];
    sortLoading: boolean;
}

const { Option } = Select;

const SortType: React.FC<SortTypeProps> = ({ form, listSort, merchantSort, sortLoading }) => {
    return useMemo(() => {
        return (
            <Form.Item
                noStyle={true}
                shouldUpdate={(prevValues, currentValues) =>
                    prevValues.channel !== currentValues.channel
                }
            >
                {({ getFieldValue }) => {
                    return (
                        <Form.Item
                            noStyle={true}
                            shouldUpdate={(prevValues, currentValues) =>
                                prevValues.range !== currentValues.range
                            }
                        >
                            {({ getFieldValue }) => {
                                const range = getFieldValue('range');
                                const list =
                                    range === HotTaskRange.fullStack ? listSort : merchantSort;
                                return (
                                    <Form.Item
                                        validateTrigger={'onBlur'}
                                        name="sort_type"
                                        label="排序类型"
                                        className={formStyles.formItem}
                                        rules={[
                                            {
                                                required: true,
                                                message: '请选择排序类型',
                                            },
                                        ]}
                                    >
                                        <Select loading={sortLoading} className="picker-default">
                                            {list.map(sort => {
                                                return (
                                                    <Option key={sort.value} value={sort.value}>
                                                        {sort.display}
                                                    </Option>
                                                );
                                            })}
                                        </Select>
                                    </Form.Item>
                                );
                            }}
                        </Form.Item>
                    );
                }}
            </Form.Item>
        );
    }, [sortLoading, merchantSort, listSort]);
};

export default SortType;

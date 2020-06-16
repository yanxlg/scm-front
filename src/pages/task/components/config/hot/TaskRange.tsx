import React, { useCallback, useMemo } from 'react';
import { FormInstance } from 'antd/es/form';
import { Form, Radio } from 'antd';
import { HotTaskRange } from '@/enums/StatusEnum';
import { IntegerInput, RichInput } from 'react-components';
import { RadioChangeEvent } from 'antd/lib/radio/interface';
import formStyles from 'react-components/es/JsonForm/_form.less';
import classNames from 'classnames';

declare interface TaskRangeProps {
    form: FormInstance;
    onTaskRangeChange: (value: HotTaskRange) => void;
}

const TaskRange: React.FC<TaskRangeProps> = ({ form, onTaskRangeChange }) => {
    const taskRangeChange = useCallback(
        (e: RadioChangeEvent) => {
            const value = e.target.value;
            if (value !== HotTaskRange.store) {
                form.resetFields(['shopId']);
            } else {
                form.resetFields([
                    'category_level_one',
                    'category_level_two',
                    'category_level_three',
                ]);
            }
            onTaskRangeChange(value);
        },
        [onTaskRangeChange],
    );

    return useMemo(() => {
        return (
            <>
                <Form.Item
                    label="任务范围"
                    name="range"
                    className={classNames(
                        formStyles.formItem,
                        formStyles.formHorizon,
                        formStyles.formHorizonAlways,
                    )}
                    required={true}
                >
                    <Radio.Group onChange={taskRangeChange}>
                        <Radio value={HotTaskRange.fullStack}>全站</Radio>
                        <Radio value={HotTaskRange.all}>全部店铺</Radio>
                        <Radio value={HotTaskRange.store}>指定店铺</Radio>
                    </Radio.Group>
                </Form.Item>
                <Form.Item
                    noStyle={true}
                    shouldUpdate={(prevValues, currentValues) =>
                        prevValues.range !== currentValues.range
                    }
                >
                    {({ getFieldValue }) => {
                        const range = getFieldValue('range');
                        const required = range === HotTaskRange.store;
                        return (
                            <Form.Item
                                className={classNames(
                                    formStyles.formRequiredAbsolute,
                                    formStyles.formItem,
                                    formStyles.formHorizon,
                                )}
                                validateTrigger={'onBlur'}
                                label="店铺ID"
                                name="shopId"
                                rules={[
                                    {
                                        required: required,
                                        message: '请输入店铺ID',
                                    },
                                ]}
                            >
                                <RichInput
                                    richType="numberSplit"
                                    placeholder={'请输入'}
                                    className={classNames(formStyles.formItemDefault)}
                                    disabled={!required}
                                />
                            </Form.Item>
                        );
                    }}
                </Form.Item>
            </>
        );
    }, [onTaskRangeChange]);
};

export default TaskRange;

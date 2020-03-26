import React, { useCallback, useMemo } from 'react';
import { FormInstance } from 'antd/es/form';
import { Form, Radio } from 'antd';
import { HotTaskRange } from '@/enums/StatusEnum';
import IntegerInput from '@/components/Input/IntegerInput';
import { RadioChangeEvent } from 'antd/lib/radio/interface';

declare interface TaskRangeProps {
    form: FormInstance;
    onTaskRangeChange: (value: HotTaskRange) => void;
}

const TaskRange: React.FC<TaskRangeProps> = ({ form, onTaskRangeChange }) => {
    const taskRangeChange = useCallback(
        (e: RadioChangeEvent) => {
            const value = e.target.value;
            if (value === HotTaskRange.fullStack) {
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
                    className="form-item form-item-inline form-item-horizon form-horizon-always"
                    required={true}
                >
                    <Radio.Group onChange={taskRangeChange}>
                        <Radio value={HotTaskRange.fullStack}>全站</Radio>
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
                                className="form-required-absolute form-item form-item-inline form-item-horizon"
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
                                <IntegerInput
                                    min={0}
                                    placeholder={'请输入'}
                                    className="input-default input-handler"
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

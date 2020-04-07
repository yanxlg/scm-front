import React, { useCallback, useMemo } from 'react';
import { DatePicker, Form, Radio, Select } from 'antd';
import { TaskExecuteType, TaskIntervalConfigType } from '@/enums/StatusEnum';
import locale from 'antd/es/date-picker/locale/zh_CN';
import { IntegerInput, RichInput } from 'react-components';
import moment, { Moment } from 'moment';
import { FormInstance } from 'antd/es/form';
import formStyles from 'react-components/es/JsonForm/_form.less';
import classNames from 'classnames';

declare interface TaskCycleProps {
    form: FormInstance;
}

const TaskCycle: React.FC<TaskCycleProps> = ({ form }) => {
    const resetTaskTypeError = useCallback(() => {
        form.resetFields(['task_end_time', 'task_start_time', 'day', 'second', 'taskIntervalType']);
    }, []);

    const checkDate = useCallback((type: any, value: Moment) => {
        const taskType = form.getFieldValue('task_type');
        if (!value || taskType === TaskExecuteType.interval) {
            return Promise.resolve();
        }
        const now = moment();
        if (value.isAfter(now)) {
            return Promise.resolve();
        } else {
            return Promise.reject('开始时间不能早于当前时间');
        }
    }, []);

    const checkStartDate = useCallback((type: any, value: Moment) => {
        const taskType = form.getFieldValue('task_type');
        if (!value || taskType === TaskExecuteType.once) {
            return Promise.resolve();
        }
        const endDate = form.getFieldValue('task_end_time');
        const now = moment();
        if (value.isAfter(now)) {
            if (endDate && value.isSameOrAfter(endDate)) {
                return Promise.reject('开始时间不能晚于结束时间');
            }
            return Promise.resolve();
        } else {
            return Promise.reject('开始时间不能早于当前时间');
        }
    }, []);

    const checkEndDate = useCallback((type: any, value: Moment) => {
        const taskType = form.getFieldValue('task_type');
        if (!value || taskType === TaskExecuteType.once) {
            return Promise.resolve();
        }
        const startDate = form.getFieldValue('task_start_time');
        const { taskIntervalType, day = 0, second = 0 } = form.getFieldsValue([
            'taskIntervalType',
            'day',
            'second',
        ]);
        const offsetSeconds =
            taskIntervalType === TaskIntervalConfigType.day ? day * 60 * 60 * 24 : second;

        const now = moment();
        if (value.isAfter(now)) {
            if (startDate) {
                if (value.isSameOrBefore(startDate)) {
                    return Promise.reject('结束时间不能早于开始时间');
                }
                if (value.unix() - startDate.unix() <= offsetSeconds) {
                    return Promise.reject('开始和结束时间的间隔必须大于时间间隔');
                }
            }
            return Promise.resolve();
        } else {
            return Promise.reject('结束时间不能早于当前时间');
        }
    }, []);

    const disabledStartDate = useCallback((startTime: Moment | null) => {
        const taskType = form.getFieldValue('task_type');
        const endTime =
            taskType === TaskExecuteType.interval ? form.getFieldValue('task_end_time') : null;
        if (!startTime) {
            return false;
        }
        const startValue = startTime.valueOf();
        const currentDay = moment().startOf('day');
        if (!endTime) {
            return startTime < currentDay;
        }
        return startValue > endTime.clone().endOf('day') || startTime < currentDay;
    }, []);

    const disabledEndDate = useCallback((endTime: Moment | null) => {
        const startTime = form.getFieldValue('task_start_time');
        if (!endTime) {
            return false;
        }
        const endValue = endTime.valueOf();
        const currentDay = moment().startOf('day');
        if (!startTime) {
            return endTime < currentDay;
        }
        return startTime.clone().startOf('day') > endValue || endTime < currentDay;
    }, []);

    return useMemo(() => {
        return (
            <>
                <Form.Item
                    label="任务周期"
                    name="task_type"
                    className={formStyles.formItem}
                    required={true}
                >
                    <Select onChange={resetTaskTypeError} className="picker-default">
                        <Select.Option value={TaskExecuteType.once}>单次任务</Select.Option>
                        <Select.Option value={TaskExecuteType.interval}>定时任务</Select.Option>
                    </Select>
                </Form.Item>

                <Form.Item
                    noStyle={true}
                    shouldUpdate={(prevValues, currentValues) =>
                        prevValues.task_type !== currentValues.task_type
                    }
                >
                    {({ getFieldValue }) => {
                        const taskType = getFieldValue('task_type');
                        if (taskType === TaskExecuteType.once) {
                            return (
                                <Form.Item
                                    validateTrigger={'onBlur'}
                                    label="开始时间"
                                    name="task_start_time"
                                    className={classNames(
                                        formStyles.formItem,
                                        formStyles.formRequiredHide,
                                    )}
                                    required={true}
                                    rules={[
                                        {
                                            validator: checkDate,
                                        },
                                    ]}
                                >
                                    <DatePicker
                                        className="picker-default"
                                        locale={locale}
                                        showTime={true}
                                        disabled={taskType !== TaskExecuteType.once}
                                        placeholder="立即开始"
                                        disabledDate={disabledStartDate}
                                    />
                                </Form.Item>
                            );
                        }
                        return (
                            <React.Fragment>
                                <div>
                                    <Form.Item
                                        label="开始时间"
                                        validateTrigger={'onChange'}
                                        className={classNames(
                                            formStyles.formItem,
                                            formStyles.formHorizon,
                                        )}
                                        name="task_start_time"
                                        dependencies={['task_end_time']}
                                        rules={[
                                            {
                                                required: true,
                                                message: '请选择开始时间',
                                            },
                                            {
                                                validator: checkStartDate,
                                            },
                                        ]}
                                    >
                                        <DatePicker
                                            locale={locale}
                                            showTime={true}
                                            disabledDate={disabledStartDate}
                                        />
                                    </Form.Item>
                                    <Form.Item
                                        validateTrigger={'onChange'}
                                        label="结束时间"
                                        name="task_end_time"
                                        dependencies={['task_start_time']}
                                        className={classNames(
                                            formStyles.formItem,
                                            formStyles.formHorizon,
                                        )}
                                        rules={[
                                            {
                                                required: true,
                                                message: '请选择结束时间',
                                            },
                                            {
                                                validator: checkEndDate,
                                            },
                                        ]}
                                    >
                                        <DatePicker
                                            locale={locale}
                                            showTime={true}
                                            disabledDate={disabledEndDate}
                                        />
                                    </Form.Item>
                                </div>
                                <Form.Item
                                    validateTrigger={'onBlur'}
                                    label="任务间隔"
                                    name="taskIntervalType"
                                    className={formStyles.formItem}
                                    required={true}
                                >
                                    <Radio.Group>
                                        <Radio value={TaskIntervalConfigType.day}>
                                            <div className="inline-block vertical-middle">
                                                <Form.Item
                                                    className={classNames(
                                                        formStyles.formItemClean,
                                                        formStyles.flexInline,
                                                    )}
                                                    shouldUpdate={(prevValues, currentValues) =>
                                                        prevValues.taskIntervalType !==
                                                        currentValues.taskIntervalType
                                                    }
                                                >
                                                    {({ getFieldValue }) => {
                                                        const taskIntervalType = getFieldValue(
                                                            'taskIntervalType',
                                                        );
                                                        return (
                                                            <React.Fragment>
                                                                <Form.Item
                                                                    validateTrigger={'onBlur'}
                                                                    name="day"
                                                                    className={classNames(
                                                                        formStyles.formItemClean,
                                                                        formStyles.inlineBlock,
                                                                        formStyles.verticalMiddle,
                                                                    )}
                                                                    rules={[
                                                                        {
                                                                            required:
                                                                                taskIntervalType ===
                                                                                TaskIntervalConfigType.day,
                                                                            message:
                                                                                '请输入间隔天数',
                                                                        },
                                                                    ]}
                                                                >
                                                                    <RichInput
                                                                        richType="positiveInteger"
                                                                        className="input-small"
                                                                        disabled={
                                                                            taskIntervalType !==
                                                                            TaskIntervalConfigType.day
                                                                        }
                                                                    />
                                                                </Form.Item>
                                                                <span
                                                                    className={classNames(
                                                                        formStyles.formUnit,
                                                                        formStyles.inlineBlock,
                                                                        formStyles.verticalMiddle,
                                                                    )}
                                                                >
                                                                    天
                                                                </span>
                                                            </React.Fragment>
                                                        );
                                                    }}
                                                </Form.Item>
                                            </div>
                                        </Radio>
                                        <Radio value={TaskIntervalConfigType.second}>
                                            <div
                                                className={classNames(
                                                    formStyles.inlineBlock,
                                                    formStyles.verticalMiddle,
                                                )}
                                            >
                                                <Form.Item
                                                    className={classNames(
                                                        formStyles.formItemClean,
                                                        formStyles.flexInline,
                                                    )}
                                                    shouldUpdate={(prevValues, currentValues) =>
                                                        prevValues.taskIntervalType !==
                                                        currentValues.taskIntervalType
                                                    }
                                                >
                                                    {({ getFieldValue }) => {
                                                        const taskIntervalType = getFieldValue(
                                                            'taskIntervalType',
                                                        );
                                                        return (
                                                            <React.Fragment>
                                                                <Form.Item
                                                                    validateTrigger={'onBlur'}
                                                                    name="second"
                                                                    rules={[
                                                                        {
                                                                            required:
                                                                                taskIntervalType ===
                                                                                TaskIntervalConfigType.second,
                                                                            message:
                                                                                '请输入间隔秒数',
                                                                        },
                                                                    ]}
                                                                    className={classNames(
                                                                        formStyles.formItemClean,
                                                                        formStyles.inlineBlock,
                                                                        formStyles.verticalMiddle,
                                                                    )}
                                                                >
                                                                    <RichInput
                                                                        richType="positiveInteger"
                                                                        className="input-small"
                                                                        disabled={
                                                                            taskIntervalType !==
                                                                            TaskIntervalConfigType.second
                                                                        }
                                                                    />
                                                                </Form.Item>
                                                                <span
                                                                    className={classNames(
                                                                        formStyles.formUnit,
                                                                        formStyles.inlineBlock,
                                                                        formStyles.verticalMiddle,
                                                                    )}
                                                                >
                                                                    秒
                                                                </span>
                                                            </React.Fragment>
                                                        );
                                                    }}
                                                </Form.Item>
                                            </div>
                                        </Radio>
                                    </Radio.Group>
                                </Form.Item>
                            </React.Fragment>
                        );
                    }}
                </Form.Item>
            </>
        );
    }, []);
};

export default TaskCycle;

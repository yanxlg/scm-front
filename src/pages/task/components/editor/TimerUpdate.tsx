import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { DatePicker, Input, Radio, Form, Spin, Checkbox } from 'antd';
import '@/styles/config.less';
import { addPDDTimerUpdateTask, queryTaskDetail } from '@/services/task';
import { showSuccessModal } from '@/pages/task/components/modal/GatherSuccessModal';
import { showFailureModal } from '@/pages/task/components/modal/GatherFailureModal';
import {
    TaskIntervalConfigType,
    TaskStatusCode,
    PUTaskRangeType,
    UpdateItemType,
} from '@/enums/StatusEnum';
import { LoadingButton, RichInput } from 'react-components';
import locale from 'antd/es/date-picker/locale/zh_CN';
import { ITaskDetailInfo, IPUTaskBody } from '@/interface/ITask';
import { scrollToFirstError } from '@/utils/common';
import { EmptyObject } from '@/config/global';
import formStyles from 'react-components/es/JsonForm/_form.less';
import classNames from 'classnames';
import { dateToUnix } from 'react-components/es/utils/date';
import dayjs, { Dayjs } from 'dayjs';

declare interface IFormData extends IPUTaskBody {
    taskIntervalType?: TaskIntervalConfigType;
    day: number;
    second: number;
    update_item: UpdateItemType;
}

declare interface ITimerUpdateProps {
    taskId?: number;
}

const convertDetail = (info: ITaskDetailInfo) => {
    const {
        update_type = PUTaskRangeType.AllOnShelves,
        task_end_time,
        task_start_time,
        time_interval,
        ...extra
    } = info;
    const isDay = time_interval && time_interval % 86400 === 0;
    return {
        range: update_type,
        taskIntervalType: time_interval
            ? isDay
                ? TaskIntervalConfigType.day
                : TaskIntervalConfigType.second
            : TaskIntervalConfigType.day,
        task_start_time: task_start_time ? dayjs(task_start_time * 1000) : undefined,
        task_end_time: task_end_time ? dayjs(task_end_time * 1000) : undefined,
        day: isDay ? time_interval! / 86400 : undefined,
        second: time_interval && !isDay ? time_interval : undefined,
        ...extra,
    };
};

const convertFormData = (values: IFormData) => {
    const {
        ranges,
        day = 0,
        second,
        taskIntervalType,
        task_end_time,
        task_start_time,
        task_name,
        update_item,
    } = values;
    return {
        task_name,
        ranges: ranges,
        update_item,
        task_start_time: dateToUnix(task_start_time),
        task_end_time: dateToUnix(task_end_time),
        task_interval_seconds:
            taskIntervalType === TaskIntervalConfigType.second
                ? Number(second)
                : day * 60 * 60 * 24,
    };
};

const TimerUpdate: React.FC<ITimerUpdateProps> = ({ taskId }) => {
    const [form] = Form.useForm();
    const [queryLoading, setQueryLoading] = useState(taskId !== void 0);
    const [status, setStatus] = useState<TaskStatusCode>(); // 详情保留字段
    const [successTimes, setSuccessTimes] = useState<number>(); // 详情保留字段
    const [failTimes, setFailTimes] = useState<number>(); // 详情保留字段

    useEffect(() => {
        if (taskId !== void 0) {
            queryTaskDetail(taskId)
                .then(({ data: { task_detail_info = {} } = {} } = EmptyObject) => {
                    const initValues = convertDetail(task_detail_info as ITaskDetailInfo);
                    const { success, fail, status } = initValues;
                    form.setFieldsValue({
                        ...initValues,
                    });
                    setStatus(status);
                    setSuccessTimes(success);
                    setFailTimes(fail);
                })
                .finally(() => {
                    setQueryLoading(false);
                });
        }
    }, []);

    const onCreate = useCallback(() => {
        return form
            .validateFields()
            .then((values: any) => {
                const params = convertFormData(values);
                return addPDDTimerUpdateTask(params)
                    .then(({ data = EmptyObject } = EmptyObject) => {
                        form.resetFields();
                        showSuccessModal(data);
                    })
                    .catch(() => {
                        showFailureModal();
                    });
            })
            .catch(({ errorFields }) => {
                scrollToFirstError(form, errorFields);
            });
    }, []);

    const checkStartDate = useCallback((type: any, value: Dayjs) => {
        if (!value) {
            return Promise.resolve();
        }
        const endDate = form.getFieldValue('task_end_time');
        const now = dayjs();
        if (value.isAfter(now)) {
            if (endDate && value.isSameOrAfter(endDate)) {
                return Promise.reject('开始时间不能晚于结束时间');
            }
            return Promise.resolve();
        } else {
            return Promise.reject('开始时间不能早于当前时间');
        }
    }, []);

    const checkEndDate = useCallback((type: any, value: Dayjs) => {
        if (!value) {
            return Promise.resolve();
        }
        const startDate = form!.getFieldValue('timerStartTime');
        const now = dayjs();
        if (value.isAfter(now)) {
            if (startDate && value.isSameOrBefore(startDate)) {
                return Promise.reject('结束时间不能早于开始时间');
            }
            return Promise.resolve();
        } else {
            return Promise.reject('结束时间不能早于当前时间');
        }
    }, []);

    const disabledStartDate = useCallback((startTime: Dayjs | null) => {
        const endTime = form.getFieldValue('task_end_time');
        if (!startTime) {
            return false;
        }
        const startValue = startTime.valueOf();
        const currentDay = dayjs().startOf('day');
        if (!endTime) {
            return startTime < currentDay;
        }
        return startValue > endTime.clone().endOf('day') || startTime < currentDay;
    }, []);

    const disabledEndDate = useCallback((endTime: Dayjs | null) => {
        const startTime = form.getFieldValue('task_start_time');
        if (!endTime) {
            return false;
        }
        const endValue = endTime.valueOf();
        const currentDay = dayjs().startOf('day');
        if (!startTime) {
            return endTime < currentDay;
        }
        return startTime.clone().startOf('day') > endValue || endTime < currentDay;
    }, []);
    const edit = taskId !== void 0;

    return useMemo(() => {
        return (
            <Spin spinning={queryLoading} tip="Loading...">
                <Form
                    form={form}
                    className={classNames(formStyles.formHelpAbsolute, formStyles.formContainer)}
                    layout="horizontal"
                    autoComplete={'off'}
                    initialValues={{
                        ranges: [PUTaskRangeType.HasSales],
                        taskIntervalType: TaskIntervalConfigType.day,
                        day: 1,
                        update_item: UpdateItemType.All,
                    }}
                >
                    <Form.Item
                        className={formStyles.formItem}
                        validateTrigger={'onBlur'}
                        name="task_name"
                        label="任务名称"
                        validateFirst={true}
                        rules={[
                            {
                                required: true,
                                message: '请输入任务名称',
                            },
                        ]}
                    >
                        <Input className="picker-default" />
                    </Form.Item>
                    <Form.Item
                        validateTrigger={'onBlur'}
                        name="ranges"
                        label="商品条件"
                        className={formStyles.formItem}
                        rules={[
                            {
                                required: true,
                                message: '请选择商品条件',
                            },
                        ]}
                    >
                        <Checkbox.Group>
                            <Checkbox value={PUTaskRangeType.HasSales}>有销量商品</Checkbox>
                            <Checkbox value={PUTaskRangeType.AllOnShelves}>在架商品</Checkbox>
                            <Checkbox value={PUTaskRangeType.NoSalesOff}>未在架商品</Checkbox>
                            {/*
                            <Checkbox value={PUTaskRangeType.HasSalesOn}>有销量在架商品</Checkbox>
                            <Checkbox value={PUTaskRangeType.NoSalesOn}>无销量在架商品</Checkbox>
                            <Checkbox value={PUTaskRangeType.HasSalesOff}>有销量下架商品</Checkbox>
                            <Checkbox value={PUTaskRangeType.NoSalesOff}>无销量下架商品</Checkbox>*/}
                        </Checkbox.Group>
                    </Form.Item>
                    <Form.Item
                        validateTrigger={'onBlur'}
                        name="update_item"
                        label="更新字段"
                        required={true}
                        className={formStyles.formItem}
                    >
                        <Radio.Group>
                            <Radio value={UpdateItemType.All}>全部</Radio>
                            <Radio value={UpdateItemType.IgnoreImage}>不含图片</Radio>
                        </Radio.Group>
                    </Form.Item>
                    <div>
                        <Form.Item
                            label="开始时间"
                            validateTrigger={'onChange'}
                            className={classNames(formStyles.formItem, formStyles.formHorizon)}
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
                                className="picker-default"
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
                            className={classNames(formStyles.formItem, formStyles.formHorizon)}
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
                                className="picker-default"
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
                                                                message: '请输入间隔天数',
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
                                                                message: '请输入间隔秒数',
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
                    <div className={formStyles.formNextCard}>
                        <LoadingButton type="primary" className="btn-default" onClick={onCreate}>
                            {edit ? '创建新任务' : '创建任务'}
                        </LoadingButton>
                    </div>
                </Form>
            </Spin>
        );
    }, [queryLoading, edit]);
};

export default TimerUpdate;

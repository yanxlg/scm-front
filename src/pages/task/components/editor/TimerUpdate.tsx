import React, { RefObject } from 'react';
import { BindAll } from 'lodash-decorators';
import { Button, DatePicker, Input, Radio, Form, Spin, Select } from 'antd';
import '@/styles/config.less';
import '@/styles/form.less';
import moment, { Moment } from 'moment';
import { FormInstance } from 'antd/es/form';
import { addPDDTimerUpdateTask, queryTaskDetail } from '@/services/task';
import { showSuccessModal } from '@/pages/task/components/modal/GatherSuccessModal';
import { showFailureModal } from '@/pages/task/components/modal/GatherFailureModal';
import { TaskIntervalConfigType, TaskStatusCode, PUTaskRangeType } from '@/enums/StatusEnum';
import { IntegerInput } from 'react-components';
import locale from 'antd/es/date-picker/locale/zh_CN';
import { ITaskDetailInfo, IPUTaskBody } from '@/interface/ITask';
import { dateToUnix } from '@/utils/date';
import { scrollToFirstError } from '@/utils/common';
import { EmptyObject } from '@/config/global';

declare interface IFormData extends IPUTaskBody {
    taskIntervalType?: TaskIntervalConfigType;
    day: number;
    second: number;
}

declare interface ITimerUpdateProps {
    taskId?: number;
}

declare interface ITimerUpdateState {
    createLoading: boolean;
    queryLoading: boolean;
    status?: TaskStatusCode;
    successTimes?: number;
    failTimes?: number;
}

@BindAll()
class TimerUpdate extends React.PureComponent<ITimerUpdateProps, ITimerUpdateState> {
    private formRef: RefObject<FormInstance> = React.createRef();
    constructor(props: ITimerUpdateProps) {
        super(props);
        this.state = {
            createLoading: false,
            queryLoading: props.taskId !== void 0,
        };
    }
    componentDidMount(): void {
        const { taskId } = this.props;
        if (taskId !== void 0) {
            queryTaskDetail(taskId).then(
                ({ data: { task_detail_info = {} } = {} } = EmptyObject) => {
                    const initValues = this.convertDetail(task_detail_info as ITaskDetailInfo);
                    const { success, fail, status } = initValues;
                    this.formRef.current!.setFieldsValue({
                        ...initValues,
                    });
                    this.setState({
                        queryLoading: false,
                        status: status,
                        successTimes: success,
                        failTimes: fail,
                    });
                },
            );
        }
    }

    private convertDetail(info: ITaskDetailInfo) {
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
            task_start_time: task_start_time ? moment(task_start_time * 1000) : undefined,
            task_end_time: task_end_time ? moment(task_end_time * 1000) : undefined,
            day: isDay ? time_interval! / 86400 : undefined,
            second: time_interval && !isDay ? time_interval : undefined,
            ...extra,
        };
    }

    private convertFormData(values: IFormData) {
        const {
            range,
            day = 0,
            second,
            taskIntervalType,
            task_end_time,
            task_start_time,
            task_name,
        } = values;
        return {
            task_name,
            range,
            task_start_time: dateToUnix(task_start_time),
            task_end_time: dateToUnix(task_end_time),
            task_interval_seconds:
                taskIntervalType === TaskIntervalConfigType.second ? second : day * 60 * 60 * 24,
        };
    }

    private onCreate() {
        this.formRef
            .current!.validateFields()
            .then((values: any) => {
                const params = this.convertFormData(values);
                this.setState({
                    createLoading: true,
                });
                addPDDTimerUpdateTask(params)
                    .then(({ data = EmptyObject } = EmptyObject) => {
                        this.formRef.current!.resetFields();
                        showSuccessModal(data);
                    })
                    .catch(() => {
                        showFailureModal();
                    })
                    .finally(() => {
                        this.setState({
                            createLoading: false,
                        });
                    });
            })
            .catch(({ errorFields }) => {
                scrollToFirstError(this.formRef.current!, errorFields);
            });
    }

    private checkStartDate(type: any, value: Moment) {
        if (!value) {
            return Promise.resolve();
        }
        const endDate = this.formRef.current!.getFieldValue('task_end_time');
        const now = moment();
        if (value.isAfter(now)) {
            if (endDate && value.isSameOrAfter(endDate)) {
                return Promise.reject('开始时间不能晚于结束时间');
            }
            return Promise.resolve();
        } else {
            return Promise.reject('开始时间不能早于当前时间');
        }
    }

    private checkEndDate(type: any, value: Moment) {
        if (!value) {
            return Promise.resolve();
        }
        const startDate = this.formRef.current!.getFieldValue('timerStartTime');
        const now = moment();
        if (value.isAfter(now)) {
            if (startDate && value.isSameOrBefore(startDate)) {
                return Promise.reject('结束时间不能早于开始时间');
            }
            return Promise.resolve();
        } else {
            return Promise.reject('结束时间不能早于当前时间');
        }
    }

    private disabledStartDate(startTime: Moment | null) {
        const endTime = this.formRef.current!.getFieldValue('task_end_time');
        if (!startTime) {
            return false;
        }
        const startValue = startTime.valueOf();
        const currentDay = moment().startOf('day');
        if (!endTime) {
            return startTime < currentDay;
        }
        return startValue > endTime.clone().endOf('day') || startTime < currentDay;
    }

    private disabledEndDate(endTime: Moment | null) {
        const startTime = this.formRef.current!.getFieldValue('task_start_time');
        if (!endTime) {
            return false;
        }
        const endValue = endTime.valueOf();
        const currentDay = moment().startOf('day');
        if (!startTime) {
            return endTime < currentDay;
        }
        return startTime.clone().startOf('day') > endValue || endTime < currentDay;
    }
    render() {
        const { createLoading, queryLoading } = this.state;
        const { taskId } = this.props;
        const edit = taskId !== void 0;
        return (
            <Spin spinning={queryLoading} tip="Loading...">
                <Form
                    ref={this.formRef}
                    className="form-help-absolute"
                    layout="horizontal"
                    autoComplete={'off'}
                    initialValues={{
                        range: PUTaskRangeType.AllOnShelves,
                        taskIntervalType: TaskIntervalConfigType.day,
                        day: 1,
                    }}
                >
                    <Form.Item
                        className="form-item form-item-inline"
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
                        name="range"
                        label="商品范围"
                        required={true}
                        className="form-item form-item-inline"
                    >
                        <Select className="picker-default">
                            <Select.Option value={PUTaskRangeType.AllOnShelves}>
                                全部已上架商品
                            </Select.Option>
                            <Select.Option value={PUTaskRangeType.HasSales}>
                                有销量的已上架商品
                            </Select.Option>
                        </Select>
                    </Form.Item>
                    <div>
                        <Form.Item
                            label="开始时间"
                            validateTrigger={'onChange'}
                            className="form-item-inline form-item-horizon form-item"
                            name="task_start_time"
                            dependencies={['task_end_time']}
                            rules={[
                                {
                                    required: true,
                                    message: '请选择开始时间',
                                },
                                {
                                    validator: this.checkStartDate,
                                },
                            ]}
                        >
                            <DatePicker
                                className="picker-default"
                                locale={locale}
                                showTime={true}
                                disabledDate={this.disabledStartDate}
                            />
                        </Form.Item>
                        <Form.Item
                            validateTrigger={'onChange'}
                            label="结束时间"
                            name="task_end_time"
                            dependencies={['task_start_time']}
                            className="form-item-inline form-item-horizon form-item"
                            rules={[
                                {
                                    required: true,
                                    message: '请选择结束时间',
                                },
                                {
                                    validator: this.checkEndDate,
                                },
                            ]}
                        >
                            <DatePicker
                                className="picker-default"
                                locale={locale}
                                showTime={true}
                                disabledDate={this.disabledEndDate}
                            />
                        </Form.Item>
                    </div>
                    <Form.Item
                        validateTrigger={'onBlur'}
                        label="任务间隔"
                        name="taskIntervalType"
                        className="form-item-inline form-item"
                        required={true}
                    >
                        <Radio.Group>
                            <Radio value={TaskIntervalConfigType.day}>
                                <div className="inline-block vertical-middle">
                                    <Form.Item
                                        className="form-item-inline flex-inline"
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
                                                        className="form-item-inline inline-block vertical-middle"
                                                        rules={[
                                                            {
                                                                required:
                                                                    taskIntervalType ===
                                                                    TaskIntervalConfigType.day,
                                                                message: '请输入间隔天数',
                                                            },
                                                        ]}
                                                    >
                                                        <IntegerInput
                                                            positive={true}
                                                            className="input-small input-handler"
                                                            disabled={
                                                                taskIntervalType !==
                                                                TaskIntervalConfigType.day
                                                            }
                                                        />
                                                    </Form.Item>
                                                    <span className="form-unit inline-block vertical-middle">
                                                        天
                                                    </span>
                                                </React.Fragment>
                                            );
                                        }}
                                    </Form.Item>
                                </div>
                            </Radio>
                            <Radio value={TaskIntervalConfigType.second}>
                                <div className="inline-block vertical-middle">
                                    <Form.Item
                                        className="form-item-inline flex-inline"
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
                                                        className="form-item-inline inline-block vertical-middle"
                                                    >
                                                        <IntegerInput
                                                            positive={true}
                                                            className="input-small input-handler"
                                                            disabled={
                                                                taskIntervalType !==
                                                                TaskIntervalConfigType.second
                                                            }
                                                        />
                                                    </Form.Item>
                                                    <span className="form-unit inline-block vertical-middle">
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
                    <div className="form-item">
                        <Button
                            loading={createLoading}
                            type="primary"
                            className="btn-default"
                            onClick={this.onCreate}
                        >
                            {edit ? '创建新任务' : '创建任务'}
                        </Button>
                    </div>
                </Form>
            </Spin>
        );
    }
}

export default TimerUpdate;

import React, { RefObject } from 'react';
import { BindAll } from 'lodash-decorators';
import { Button, Card, DatePicker, Input, Radio, Form, Modal, Spin } from 'antd';
import '@/styles/config.less';
import '@/styles/form.less';
import moment, { Moment } from 'moment';
import { FormInstance } from 'antd/es/form';
import { addPDDTimerUpdateTask, queryTaskDetail } from '@/services/task';
import GatherSuccessModal from '@/pages/task/components/GatherSuccessModal';
import GatherFailureModal from '@/pages/task/components/GatherFailureModal';
import {
    TaskIntervalConfigType,
    TaskStatusMap,
    TimerUpdateTaskRangeType,
} from '@/enums/StatusEnum';
import IntegerInput from '@/components/IntegerInput';

declare interface IFormData {
    task_name: string;
    range: TimerUpdateTaskRangeType;
    task_start_time?: Moment;
    task_end_time?: Moment;
    taskIntervalType?: TaskIntervalConfigType;
    day?: number; // 调用接口前需要进行处理 && 编辑数据源需要处理
    second?: number; // 调用接口前需要进行处理 && 编辑数据源需要处理
}

declare interface ITimerUpdateProps {
    taskId?: number;
}

declare interface ITimerUpdateState {
    createLoading: boolean;
    queryLoading: boolean;
    status?: string;
    successTimes?: number;
    failTimes?: number;
}

declare interface ITaskDetail {
    update_type: TimerUpdateTaskRangeType;
    task_id: string;
    task_name: string;
    execute_count: string;
    task_start_time: number;
    task_end_time: number;
    time_interval: number;
    status: string;
    success: number;
    fail: number;
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
            queryTaskDetail(taskId).then(({ data: { task_detail_info = {} } = {} } = {}) => {
                const initValues = this.convertDetail(task_detail_info);
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
            });
        }
    }

    private convertDetail(info: ITaskDetail) {
        const { update_type, task_end_time, task_start_time, time_interval, ...extra } = info;
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
            task_start_time: task_start_time?.unix() ?? undefined,
            task_end_time: task_end_time?.unix() ?? undefined,
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
                    .then(({ data: { task_id = -1 } = {} } = {}) => {
                        this.formRef.current!.resetFields();
                        Modal.info({
                            content: (
                                <GatherSuccessModal
                                    taskId={task_id}
                                    onClick={() => {
                                        Modal.destroyAll();
                                        Modal.info({
                                            content: <TimerUpdate taskId={task_id} />,
                                            className: 'modal-empty config-modal-hot',
                                            icon: null,
                                            maskClosable: true,
                                        });
                                    }}
                                />
                            ),
                            className: 'modal-empty',
                            icon: null,
                            maskClosable: true,
                        });
                    })
                    .catch(() => {
                        Modal.info({
                            content: (
                                <GatherFailureModal
                                    onClick={() => {
                                        Modal.destroyAll();
                                        this.onCreate();
                                    }}
                                />
                            ),
                            className: 'modal-empty',
                            icon: null,
                            maskClosable: true,
                        });
                    })
                    .finally(() => {
                        this.setState({
                            createLoading: false,
                        });
                    });
            })
            .catch(({ errorFields }) => {
                this.formRef.current!.scrollToField(errorFields[0].name, {
                    scrollMode: 'if-needed',
                    behavior: actions => {
                        if (!actions || actions.length === 0) {
                            return;
                        }
                        const [{ top }] = actions;
                        const to = Math.max(top - 80, 0);
                        window.scrollTo({
                            top: to,
                            behavior: 'smooth',
                        });
                    },
                });
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
        const { createLoading, queryLoading, status, successTimes, failTimes } = this.state;
        const { taskId } = this.props;
        const edit = taskId !== void 0;
        return (
            <Spin spinning={queryLoading} tip="Loading...">
                {edit && (
                    <React.Fragment>
                        <div className="config-task-label">任务ID：{taskId}</div>
                        <div className="config-task-label">
                            任务状态: {TaskStatusMap[status ?? '']}
                        </div>
                        <div className="config-task-label">执行成功：{successTimes}次</div>
                        <div className="config-task-label">执行失败：{failTimes}次</div>
                    </React.Fragment>
                )}
                <Form
                    ref={this.formRef}
                    className="form-help-absolute"
                    layout="horizontal"
                    autoComplete={'off'}
                    initialValues={{
                        range: TimerUpdateTaskRangeType.AllOnShelves,
                        taskIntervalType: TaskIntervalConfigType.day,
                        day: 1,
                    }}
                >
                    <Form.Item
                        className="form-item"
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
                        <Input className="input-default" />
                    </Form.Item>
                    <Card
                        className="form-item"
                        title={<span className="form-required">定时更新配置：</span>}
                    >
                        <Form.Item
                            validateTrigger={'onBlur'}
                            name="range"
                            label="商品范围"
                            required={true}
                        >
                            <Radio.Group>
                                <Radio value={TimerUpdateTaskRangeType.AllOnShelves}>
                                    全部已上架商品
                                </Radio>
                                <Radio value={TimerUpdateTaskRangeType.HasSales}>
                                    有销量的已上架商品
                                </Radio>
                            </Radio.Group>
                        </Form.Item>
                        <Form.Item
                            label="任务执行时间"
                            className="form-item-inline"
                            colon={false}
                            required={true}
                        >
                            <Form.Item
                                label="开始时间"
                                validateTrigger={'onChange'}
                                className="form-item-inline"
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
                                <DatePicker showTime={true} disabledDate={this.disabledStartDate} />
                            </Form.Item>
                            <Form.Item
                                validateTrigger={'onChange'}
                                label="结束时间"
                                name="task_end_time"
                                dependencies={['task_start_time']}
                                className="form-item form-item-inline"
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
                                <DatePicker showTime={true} disabledDate={this.disabledEndDate} />
                            </Form.Item>
                        </Form.Item>
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
                                            noStyle={true}
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
                                                    <Form.Item className="form-item-inline">
                                                        <Form.Item
                                                            noStyle={true}
                                                            validateTrigger={'onBlur'}
                                                            name="day"
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
                                                                min={0}
                                                                className="input-small input-handler"
                                                                disabled={
                                                                    taskIntervalType !==
                                                                    TaskIntervalConfigType.day
                                                                }
                                                            />
                                                        </Form.Item>
                                                        <span className="form-unit">天</span>
                                                    </Form.Item>
                                                );
                                            }}
                                        </Form.Item>
                                    </div>
                                </Radio>
                                <Radio value={TaskIntervalConfigType.second}>
                                    <div className="inline-block vertical-middle">
                                        <Form.Item
                                            noStyle={true}
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
                                                    <Form.Item className="form-item-inline">
                                                        <Form.Item
                                                            noStyle={true}
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
                                                            className="inline-block"
                                                        >
                                                            <IntegerInput
                                                                min={0}
                                                                className="input-small input-handler"
                                                                disabled={
                                                                    taskIntervalType !==
                                                                    TaskIntervalConfigType.second
                                                                }
                                                            />
                                                        </Form.Item>
                                                        <span className="form-unit">秒</span>
                                                    </Form.Item>
                                                );
                                            }}
                                        </Form.Item>
                                    </div>
                                </Radio>
                            </Radio.Group>
                        </Form.Item>
                    </Card>
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

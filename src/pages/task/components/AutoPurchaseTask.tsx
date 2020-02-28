import React, { RefObject, useCallback } from 'react';
import { BindAll } from 'lodash-decorators';
import { Button, Card, DatePicker, Input, Radio, Form, Modal, Spin, TimePicker } from 'antd';
import '@/styles/config.less';
import '@/styles/form.less';
import '@/styles/task.less';
import moment, { Moment } from 'moment';
import { FormInstance } from 'antd/es/form';
import { addPDDTimerUpdateTask, queryTaskDetail } from '@/services/task';
import GatherSuccessModal from '@/pages/task/components/GatherSuccessModal';
import GatherFailureModal from '@/pages/task/components/GatherFailureModal';
import {
    AutoPurchaseTaskType,
    TaskExecuteType,
    TaskIntervalConfigType,
    TaskStatusMap,
    TimerUpdateTaskRangeType,
} from '@/enums/StatusEnum';
import { PlusCircleOutlined } from '@ant-design/icons';

declare interface IFormData {
    task_name: string;
    times: Array<Moment | undefined>;
    type: AutoPurchaseTaskType;
}

declare interface IAutoPurchaseTaskProps {
    taskId?: number;
}

declare interface IAutoPurchaseTaskState {
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
class AutoPurchaseTask extends React.PureComponent<IAutoPurchaseTaskProps, IAutoPurchaseTaskState> {
    private formRef: RefObject<FormInstance> = React.createRef();
    constructor(props: IAutoPurchaseTaskProps) {
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
                                            content: <AutoPurchaseTask taskId={task_id} />,
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

    private checkDate(type: any, value: Moment) {
        if (!value) {
            return Promise.resolve();
        }
        const now = moment();
        if (value.isAfter(now)) {
            return Promise.resolve();
        } else {
            return Promise.reject('开始时间不能早于当前时间');
        }
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
                        type: AutoPurchaseTaskType.EveryDay,
                        purchase_times: [undefined],
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
                        title={<span className="form-required">定时采购时间：</span>}
                    >
                        <Form.List name="purchase_times">
                            {(fields, { add, remove }) => {
                                return fields.map((field, index) => {
                                    if (index === 0) {
                                        return (
                                            <Form.Item
                                                key={field.key}
                                                label={`采购时间${index + 1}`}
                                                className={`form-item-inline form-item-horizon ${
                                                    index > 0 ? 'form-item task-require' : ''
                                                }`}
                                            >
                                                <Form.Item
                                                    {...field}
                                                    label={`采购时间${index + 1}`}
                                                    validateTrigger={['onChange']}
                                                    noStyle={true}
                                                    rules={[
                                                        {
                                                            required: index === 0,
                                                            message: '请选择时间',
                                                        },
                                                        {
                                                            validator: this.checkDate,
                                                        },
                                                    ]}
                                                >
                                                    <TimePicker
                                                        placeholder="请选择时间"
                                                        disabledDate={this.disabledStartDate}
                                                    />
                                                </Form.Item>
                                                <PlusCircleOutlined
                                                    className="task-add"
                                                    onClick={() => {
                                                        add();
                                                    }}
                                                />
                                            </Form.Item>
                                        );
                                    }
                                    return (
                                        <Form.Item
                                            key={field.key}
                                            {...field}
                                            label={`采购时间${index + 1}`}
                                            validateTrigger={['onChange']}
                                            className={`form-item-inline ${
                                                index > 0 ? 'form-item task-require' : ''
                                            }`}
                                            rules={[
                                                {
                                                    required: index === 0,
                                                    message: '请选择时间',
                                                },
                                                {
                                                    validator: this.checkDate,
                                                },
                                            ]}
                                        >
                                            <TimePicker
                                                placeholder="请选择时间"
                                                disabledDate={this.disabledStartDate}
                                            />
                                        </Form.Item>
                                    );
                                });
                            }}
                        </Form.List>
                        <Form.Item
                            validateTrigger={'onBlur'}
                            className="form-item form-item-inline"
                            name="type"
                            label="任务周期"
                            required={true}
                        >
                            <Radio.Group>
                                <Radio value={AutoPurchaseTaskType.EveryDay}>每天</Radio>
                                <Radio value={AutoPurchaseTaskType.OnlyOnce}>只执行一次</Radio>
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

export default AutoPurchaseTask;

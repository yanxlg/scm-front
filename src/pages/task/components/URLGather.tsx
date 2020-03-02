import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Button, DatePicker, Form, Input, Modal, Spin } from 'antd';
import '@/styles/config.less';
import '@/styles/form.less';
import moment, { Moment } from 'moment';
import { parseText, stringifyText } from '@/utils/common';
import { addPddURLTask, IPddHotTaskParams, queryTaskDetail } from '@/services/task';
import GatherSuccessModal from '@/pages/task/components/GatherSuccessModal';
import GatherFailureModal from '@/pages/task/components/GatherFailureModal';
import { isUrl } from '@/utils/validate';
import { TaskExecuteType, TaskIntervalConfigType, TaskStatusMap } from '@/enums/StatusEnum';
import locale from 'antd/es/date-picker/locale/zh_CN';

declare interface IFormData {
    urls?: string;
    task_name: string;
    task_start_time?: Moment;
}

declare interface IURLGatherProps {
    taskId?: number;
}

const URLGather: React.FC<IURLGatherProps> = ({ taskId }) => {
    const [form] = Form.useForm();
    const [gatherLoading, setGatherLoading] = useState(false);
    const [groundLoading, setGroundLoading] = useState(false);
    const [queryLoading, setQueryLoading] = useState(taskId !== void 0);
    const [taskStatus, setTaskStatus] = useState<string | undefined>();
    const [successTimes, setSuccessTimes] = useState<number | undefined>();
    const [failTimes, setFailTimes] = useState<number | undefined>();

    const convertDetail = useCallback((info: IPddHotTaskParams) => {
        const {
            range,
            task_end_time,
            task_start_time,
            task_interval_seconds,
            urls,
            ...extra
        } = info;
        return {
            task_start_time: task_start_time ? moment(task_start_time * 1000) : undefined,
            urls: parseText(urls),
            ...extra,
        };
    }, []);
    const convertFormData = useCallback((values: IFormData) => {
        const { urls = '', task_start_time, ...extra } = values;
        // 如果单次任务且无时间，则需要设置is_immediately_execute为true

        return {
            ...extra,
            urls: stringifyText(urls),
            is_immediately_execute: !task_start_time,
            task_start_time: task_start_time?.unix() ?? undefined,
            task_type: TaskExecuteType.once,
        };
    }, []);

    useEffect(() => {
        if (taskId !== void 0) {
            queryTaskDetail(taskId).then(({ data: { task_detail_info = {} } = {} } = {}) => {
                const initValues = convertDetail(task_detail_info);
                const { status, success, fail } = initValues;
                form.setFieldsValue({
                    ...initValues,
                });
                setQueryLoading(false);
                setTaskStatus(status);
                setSuccessTimes(success);
                setFailTimes(fail);
            });
        }
    }, []);

    const onGather = useCallback((is_upper_shelf: boolean = false) => {
        form.validateFields()
            .then((values: any) => {
                const params = convertFormData(values);
                setGatherLoading(!is_upper_shelf);
                setGroundLoading(is_upper_shelf);
                addPddURLTask(
                    Object.assign({}, params, {
                        is_upper_shelf: is_upper_shelf,
                    }),
                )
                    .then(({ data: { task_id = -1 } = {} } = {}) => {
                        form.resetFields();
                        Modal.info({
                            content: (
                                <GatherSuccessModal
                                    taskId={task_id}
                                    onClick={() => {
                                        Modal.destroyAll();
                                        Modal.info({
                                            content: <URLGather taskId={task_id} />,
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
                                        onGather(is_upper_shelf);
                                    }}
                                />
                            ),
                            className: 'modal-empty',
                            icon: null,
                            maskClosable: true,
                        });
                    })
                    .finally(() => {
                        setGroundLoading(false);
                        setGatherLoading(false);
                    });
            })
            .catch(({ errorFields }) => {
                form.scrollToField(errorFields[0].name, {
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
    }, []);

    const onStartGather = useCallback(() => {
        onGather();
    }, []);

    const onAcquisitionRack = useCallback(() => {
        onGather(true);
    }, []);

    const disabledStartDate = useCallback((startTime: Moment | null) => {
        if (!startTime) {
            return false;
        }
        const startValue = startTime.valueOf();
        const currentDay = moment().startOf('day');
        return startTime < currentDay;
    }, []);

    const checkUrl = useCallback((type: any, value) => {
        if (!value) {
            return Promise.resolve();
        }
        const urls = stringifyText(value);
        const urlList = urls.split(',');
        if (urlList.find(url => !isUrl(url))) {
            return Promise.reject('输入的URL不合法，请检查并输入正确的URL');
        }
        return Promise.resolve();
    }, []);

    const checkDate = useCallback((type: any, value: Moment) => {
        if (!value) {
            return Promise.resolve();
        }
        const now = moment();
        if (value.isAfter(now)) {
            return Promise.resolve();
        } else {
            return Promise.reject('开始时间不能早于当前时间');
        }
    }, []);
    return useMemo(() => {
        const edit = taskId !== void 0;
        return (
            <Spin spinning={queryLoading} tip="Loading...">
                {edit && (
                    <React.Fragment>
                        <div className="config-task-label">任务ID：{taskId}</div>
                        <div className="config-task-label">
                            任务状态: {TaskStatusMap[taskStatus ?? '']}
                        </div>
                        <div className="config-task-label">执行成功：{successTimes}次</div>
                        <div className="config-task-label">执行失败：{failTimes}次</div>
                    </React.Fragment>
                )}
                <Form
                    form={form}
                    layout="horizontal"
                    autoComplete={'off'}
                    className="form-help-absolute"
                    initialValues={{
                        taskIntervalType: TaskIntervalConfigType.day,
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
                    <Form.Item
                        className="form-item form-control-full"
                        validateTrigger={'onBlur'}
                        name="urls"
                        required={true}
                        label={<span />}
                        colon={false}
                        validateFirst={true}
                        rules={[
                            {
                                required: true,
                                whitespace: true,
                                message: '请输入PDD商品详情链接',
                            },
                            {
                                validator: checkUrl,
                            },
                        ]}
                    >
                        <Input.TextArea
                            spellCheck={'false'}
                            className="config-textarea flex-1"
                            placeholder="请输入PDD商品详情链接，一行一个，多个URL以回车隔开"
                        />
                    </Form.Item>
                    <Form.Item
                        validateTrigger={'onBlur'}
                        label="开始时间"
                        name="task_start_time"
                        className="form-item-inline form-item"
                        rules={[
                            {
                                validator: checkDate,
                            },
                        ]}
                    >
                        <DatePicker
                            locale={locale}
                            showTime={true}
                            disabledDate={disabledStartDate}
                            placeholder="立即开始"
                        />
                    </Form.Item>
                    <div className="form-item">
                        <Button
                            loading={gatherLoading}
                            type="primary"
                            className="btn-default"
                            onClick={onStartGather}
                        >
                            {edit ? '创建新任务' : '开始采集'}
                        </Button>
                        <Button
                            loading={groundLoading}
                            type="primary"
                            className="btn-default"
                            onClick={onAcquisitionRack}
                        >
                            {edit ? '创建任务且上架' : '一键采集上架'}
                        </Button>
                    </div>
                </Form>
            </Spin>
        );
    }, [taskId, gatherLoading, groundLoading, queryLoading, taskStatus, successTimes, failTimes]);
};

export default URLGather;

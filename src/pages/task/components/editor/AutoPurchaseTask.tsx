import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { DatePicker, Form, Input, Radio, Spin, TimePicker } from 'antd';
import '@/styles/config.less';
import '@/styles/task.less';
import moment, { Moment } from 'moment';
import { addAutoPurchaseTask, queryPurchaseIds, queryTaskDetail } from '@/services/task';
import { showSuccessModal } from '@/pages/task/components/modal/GatherSuccessModal';
import { showFailureModal } from '@/pages/task/components/modal/GatherFailureModal';
import { AutoPurchaseTaskType, TaskStatusCode, TaskStatusMap } from '@/enums/StatusEnum';
import { PlusCircleOutlined } from '@ant-design/icons';
import { transStartDate } from 'react-components/es/JsonForm';
import locale from 'antd/es/date-picker/locale/zh_CN';
import { IResponse } from '@/interface/IGlobal';
import { ITaskDetailResponse } from '@/interface/ITask';
import { scrollToFirstError } from '@/utils/common';
import { EmptyObject } from '@/config/global';
import formStyles from 'react-components/es/JsonForm/_form.less';
import classNames from 'classnames';
import { LoadingButton } from 'react-components';

declare interface IFormData {
    task_name: string;
    purchase_times: Array<Moment | undefined>;
    type: AutoPurchaseTaskType;
    dateRange?: [Moment, Moment];
}

declare interface IAutoPurchaseTaskProps {
    taskId?: number;
}

function disabledDate(current: Moment) {
    return current && current < moment().startOf('day');
}

const convertFormData = (values: IFormData) => {
    const { task_name, purchase_times, type, dateRange } = values;
    return {
        task_name,
        type,
        task_start_time:
            type === AutoPurchaseTaskType.EveryDay ? transStartDate(dateRange![0]) : undefined,
        task_end_time:
            type === AutoPurchaseTaskType.EveryDay ? transStartDate(dateRange![1]) : undefined,
        purchase_times: purchase_times
            .filter(date => date)
            .map(date =>
                date!.format(
                    type === AutoPurchaseTaskType.EveryDay ? 'hh:mm:ss' : 'YYYY-MM-DD HH:mm:ss',
                ),
            ),
    };
};

const AutoPurchaseTask: React.FC<IAutoPurchaseTaskProps> = ({ taskId }) => {
    const [form] = Form.useForm();
    const [queryLoading, setQueryLoading] = useState(taskId !== void 0);
    const [idList, setIdList] = useState<string[]>([]);
    const [status, setStatus] = useState<TaskStatusCode>(); // 详情保留字段
    const [successTimes, setSuccessTimes] = useState<number>(); // 详情保留字段
    const [failTimes, setFailTimes] = useState<number>(); // 详情保留字段

    useEffect(() => {
        if (taskId !== void 0) {
            Promise.all<IResponse<ITaskDetailResponse>, IResponse<any>>([
                queryTaskDetail(taskId),
                queryPurchaseIds(taskId),
            ])
                .then(
                    ([
                        { data: { task_detail_info = {} } = {} } = {},
                        { data: { order_id_list = [] } = {} } = {},
                    ]) => {
                        const { success, fail, status } = task_detail_info;
                        setSuccessTimes(success);
                        setFailTimes(fail);
                        setStatus(status);
                        setIdList(order_id_list);
                    },
                )
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
                return addAutoPurchaseTask(params)
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

    const checkDate = useCallback((type: any, value: Moment) => {
        if (!value) {
            return Promise.resolve();
        }
        const now = moment();
        if (value.isAfter(now)) {
            return Promise.resolve();
        } else {
            return Promise.reject('任务时间不能早于当前时间');
        }
    }, []);

    const checkTime = useCallback((type: any, value: Moment) => {
        const dateRange = form.getFieldValue('dateRange');
        if (dateRange && value) {
            const [startDate] = dateRange;
            const nowDate = moment();
            let clone = startDate.clone();
            clone
                .hour(value.hour())
                .minute(value.minute())
                .second(value.second())
                .millisecond(0);
            if (clone.isSameOrBefore(nowDate)) {
                return Promise.reject('任务时间不能早于当前时间');
            }
        }
        return Promise.resolve();
    }, []);

    const onTypeChange = useCallback(() => {
        form.resetFields(['purchase_times', 'dateRange']);
    }, []);

    const edit = taskId !== void 0;

    return useMemo(() => {
        if (edit) {
            return (
                <Spin spinning={queryLoading} tip="Loading...">
                    <div className="config-task-label">任务ID：{taskId}</div>
                    <div className="config-task-label">任务状态: {TaskStatusMap[status!]}</div>
                    <div className="config-task-label">执行成功：{successTimes}次</div>
                    <div className="config-task-label">执行失败：{failTimes}次</div>
                    <div className="task-id-title">中台订单id({idList.length})</div>
                    <div>
                        {idList.map(id => {
                            return (
                                <div key={id} className="task-id-item">
                                    {id}
                                </div>
                            );
                        })}
                    </div>
                </Spin>
            );
        }
        return (
            <Form
                form={form}
                className={classNames(formStyles.formHelpAbsolute, formStyles.formContainer)}
                layout="horizontal"
                autoComplete={'off'}
                initialValues={{
                    type: AutoPurchaseTaskType.EveryDay,
                    purchase_times: [undefined],
                    dateRange: null,
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
                    <Input className="input-default" />
                </Form.Item>
                <Form.Item
                    validateTrigger={'onBlur'}
                    className={formStyles.formItem}
                    name="type"
                    label="任务周期"
                    required={true}
                >
                    <Radio.Group onChange={onTypeChange}>
                        <Form.Item
                            className={classNames(
                                formStyles.formItemClean,
                                formStyles.formHorizon,
                                formStyles.verticalMiddle,
                            )}
                        >
                            <Radio value={AutoPurchaseTaskType.EveryDay}>每天</Radio>
                            <Form.Item
                                noStyle={true}
                                shouldUpdate={(prevValues, curValues) =>
                                    prevValues.type !== curValues.type
                                }
                            >
                                {({ getFieldValue }) => {
                                    const type = getFieldValue('type');
                                    const disabled = type === AutoPurchaseTaskType.OnlyOnce;
                                    return (
                                        <Form.Item
                                            colon={false}
                                            className={classNames(
                                                formStyles.formItemClean,
                                                formStyles.formHorizon,
                                                formStyles.verticalMiddle,
                                            )}
                                            name="dateRange"
                                            rules={[
                                                {
                                                    required: !disabled,
                                                    message: '请选择任务执行时间段',
                                                },
                                            ]}
                                        >
                                            <DatePicker.RangePicker
                                                locale={locale}
                                                allowEmpty={[disabled, disabled]}
                                                disabled={[disabled, disabled]}
                                                disabledDate={disabledDate}
                                            />
                                        </Form.Item>
                                    );
                                }}
                            </Form.Item>
                        </Form.Item>
                        <Radio
                            className={formStyles.verticalMiddle}
                            value={AutoPurchaseTaskType.OnlyOnce}
                        >
                            只执行一次
                        </Radio>
                    </Radio.Group>
                </Form.Item>
                <Form.List name="purchase_times">
                    {(fields, { add, remove }) => {
                        return fields.map((field, index) => {
                            return (
                                <Form.Item
                                    key={field.key}
                                    label={`采购时间${index + 1}`}
                                    className={classNames(
                                        formStyles.formItemClean,
                                        formStyles.formItem,
                                        index > 0 ? 'task-require' : formStyles.formHorizon,
                                    )}
                                    required={index === 0}
                                >
                                    <Form.Item
                                        noStyle={true}
                                        shouldUpdate={(prevValues, curValues) =>
                                            prevValues.type !== curValues.type
                                        }
                                    >
                                        {({ getFieldValue }) => {
                                            const type = getFieldValue('type');
                                            if (type === AutoPurchaseTaskType.EveryDay) {
                                                return (
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
                                                                validator: checkTime,
                                                            },
                                                        ]}
                                                    >
                                                        <TimePicker
                                                            locale={locale}
                                                            className="task-picker-time"
                                                            placeholder="请选择时间"
                                                        />
                                                    </Form.Item>
                                                );
                                            } else {
                                                return (
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
                                                                validator: checkDate,
                                                            },
                                                        ]}
                                                    >
                                                        <DatePicker
                                                            locale={locale}
                                                            placeholder="请选择时间"
                                                            className="task-picker-time"
                                                            showTime={true}
                                                            disabledDate={disabledDate}
                                                        />
                                                    </Form.Item>
                                                );
                                            }
                                        }}
                                    </Form.Item>
                                    {index === 0 ? (
                                        <PlusCircleOutlined
                                            className="task-add"
                                            onClick={() => {
                                                add();
                                            }}
                                        />
                                    ) : (
                                        <span />
                                    )}
                                </Form.Item>
                            );
                        });
                    }}
                </Form.List>
                <div className={formStyles.formNextCard}>
                    <LoadingButton type="primary" className="btn-default" onClick={onCreate}>
                        创建任务
                    </LoadingButton>
                </div>
            </Form>
        );
    }, [edit, queryLoading]);
};

export default AutoPurchaseTask;

import React, { RefObject } from 'react';
import { BindAll } from 'lodash-decorators';
import { Button, Card, DatePicker, Form, Input, Radio, Spin, TimePicker } from 'antd';
import '@/styles/config.less';
import '@/styles/task.less';
import moment, { Moment } from 'moment';
import { FormInstance } from 'antd/es/form';
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

declare interface IFormData {
    task_name: string;
    purchase_times: Array<Moment | undefined>;
    type: AutoPurchaseTaskType;
    dateRange?: [Moment, Moment];
}

declare interface IAutoPurchaseTaskProps {
    taskId?: number;
}

declare interface IAutoPurchaseTaskState {
    createLoading: boolean;
    queryLoading: boolean;
    status?: TaskStatusCode;
    successTimes?: number;
    failTimes?: number;
    idList: string[];
}

function disabledDate(current: Moment) {
    return current && current < moment().startOf('day');
}

@BindAll()
class AutoPurchaseTask extends React.PureComponent<IAutoPurchaseTaskProps, IAutoPurchaseTaskState> {
    private formRef: RefObject<FormInstance> = React.createRef();

    constructor(props: IAutoPurchaseTaskProps) {
        super(props);
        this.state = {
            createLoading: false,
            queryLoading: props.taskId !== void 0,
            idList: [],
        };
    }

    componentDidMount(): void {
        const { taskId } = this.props;
        if (taskId !== void 0) {
            Promise.all<IResponse<ITaskDetailResponse>, IResponse<any>>([
                queryTaskDetail(taskId),
                queryPurchaseIds(taskId),
            ]).then(
                ([
                    { data: { task_detail_info = {} } = {} } = {},
                    { data: { order_id_list = [] } = {} } = {},
                ]) => {
                    const { success, fail, status } = task_detail_info;
                    this.setState({
                        queryLoading: false,
                        status: status,
                        successTimes: success,
                        failTimes: fail,
                        idList: order_id_list,
                    });
                },
            );
        }
    }

    private convertFormData(values: IFormData) {
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
    }

    private onCreate() {
        this.formRef
            .current!.validateFields()
            .then((values: any) => {
                const params = this.convertFormData(values);
                this.setState({
                    createLoading: true,
                });
                addAutoPurchaseTask(params)
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

    private checkDate(type: any, value: Moment) {
        if (!value) {
            return Promise.resolve();
        }
        const now = moment();
        if (value.isAfter(now)) {
            return Promise.resolve();
        } else {
            return Promise.reject('任务时间不能早于当前时间');
        }
    }

    private checkTime(type: any, value: Moment) {
        const dateRange = this.formRef.current!.getFieldValue('dateRange');
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
    }

    private onTypeChange() {
        this.formRef.current!.resetFields(['purchase_times', 'dateRange']);
    }

    render() {
        const {
            createLoading,
            queryLoading,
            status,
            successTimes,
            failTimes,
            idList = [],
        } = this.state;
        const { taskId } = this.props;
        const edit = taskId !== void 0;
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
                ref={this.formRef}
                className={formStyles.formHelpAbsolute}
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
                <Card className={formStyles.formNextCard} title={<span>定时采购时间：</span>}>
                    <Form.Item
                        validateTrigger={'onBlur'}
                        className={formStyles.formItemClean}
                        name="type"
                        label="任务周期"
                        required={true}
                    >
                        <Radio.Group onChange={this.onTypeChange}>
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
                                                                    validator: this.checkTime,
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
                                                                    validator: this.checkDate,
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
                </Card>
                <div className={formStyles.formNextCard}>
                    <Button
                        loading={createLoading}
                        type="primary"
                        className="btn-default"
                        onClick={this.onCreate}
                    >
                        创建任务
                    </Button>
                </div>
            </Form>
        );
    }
}

export default AutoPurchaseTask;

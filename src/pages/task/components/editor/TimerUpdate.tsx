import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { DatePicker, Input, Radio, Form, Spin, TreeSelect } from 'antd';
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
import { queryGoodsSourceList } from '@/services/global';
import { EmptyArray } from 'react-components/es/utils';
import { PermissionComponent } from 'rc-permission';
import { StoreValue, Store } from 'antd/es/form/interface';
import SalesRange from '../config/hot/SalesRange';
import PriceRange from '../config/hot/PriceRange';
import { toNumber } from '@/utils/utils';

declare interface IFormData extends IPUTaskBody {
    taskIntervalType?: TaskIntervalConfigType;
    day: number;
    second: number;
    update_item: UpdateItemType;
    channel: string;
    channel_type: string;
    source_price_min?: string;
    source_price_max?: string;
    source_sales_max?: string;
    source_sales_min?: string;
    channel_sales_min?: string;
    channel_sales_max?: string;
}

declare interface ITimerUpdateProps {
    taskId?: number;
}

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
        channel,
        channel_type,
        source_price_min,
        source_price_max,
        source_sales_max,
        source_sales_min,
        channel_sales_min,
        channel_sales_max,
    } = values;
    return {
        platform: channel,
        task_name,
        channel_type,
        source_price_min: toNumber(source_price_min),
        source_price_max: toNumber(source_price_max),
        source_sales_max: toNumber(source_sales_max),
        source_sales_min: toNumber(source_sales_min),
        channel_sales_min: toNumber(channel_sales_min),
        channel_sales_max: toNumber(channel_sales_max),
        ranges: ranges ? (Array.isArray(ranges) ? ranges : [ranges]) : undefined,
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

    const [channelList, setChannelList] = useState<
        Array<{
            name: string;
            value: string;
        }>
    >([]);

    useEffect(() => {
        queryGoodsSourceList().then((list = EmptyArray) => {
            setChannelList(list);
        });
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
    }, [channelList]);

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

    const g_normalise = useCallback((list: Array<{ name: string; value: string }>) => {
        return (value: StoreValue, prevValue: StoreValue, prevValues: Store) => {
            const defaultValue = '';
            if (
                value === defaultValue ||
                (Array.isArray(value) && value.indexOf(defaultValue) > -1)
            ) {
                return list.map(({ value }) => value);
            } else {
                return value;
            }
        };
    }, []);

    return useMemo(() => {
        return (
            <Form
                form={form}
                className={classNames(formStyles.formHelpAbsolute, formStyles.formContainer)}
                layout="horizontal"
                autoComplete={'off'}
                initialValues={{
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
                    className={formStyles.formItem}
                    validateTrigger={'onBlur'}
                    name="channel"
                    label="商品渠道"
                    validateFirst={true}
                    rules={[
                        {
                            required: true,
                            message: '请选择商品渠道',
                        },
                    ]}
                    normalize={g_normalise(channelList)}
                >
                    <TreeSelect
                        className="picker-default"
                        treeNodeLabelProp="name"
                        treeCheckable={true}
                        treeDefaultExpandAll={true}
                        showArrow={true}
                        showCheckedStrategy={'SHOW_PARENT'}
                        treeNodeFilterProp={'title'}
                        dropdownClassName={formStyles.customTreeSelect}
                        choiceTransitionName={''} //禁用动画
                        loading={!channelList.length}
                        placeholder="请选择"
                        treeData={[
                            {
                                name: '全部',
                                value: '',
                                children: channelList,
                            },
                        ]}
                    />
                </Form.Item>
                <Form.Item
                    validateTrigger={'onBlur'}
                    name="channel_type"
                    label="商品条件"
                    className={formStyles.formItem}
                    rules={[
                        {
                            required: true,
                            message: '请选择商品条件',
                        },
                    ]}
                    initialValue="source_channel"
                >
                    <Radio.Group>
                        <Radio value="source_channel">渠道商品条件</Radio>
                        <Radio value="sale_channel">爬虫商品条件</Radio>
                    </Radio.Group>
                </Form.Item>
                <div style={{ backgroundColor: 'rgba(0,0,0,0.1)', display: 'inline-flex' }}>
                    <Form.Item
                        noStyle={true}
                        shouldUpdate={(prevValues, currentValues) => {
                            return prevValues['channel_type'] !== currentValues['channel_type'];
                        }}
                    >
                        {({ getFieldValue }) => {
                            const type = getFieldValue('channel_type');
                            if (type === 'sale_channel') {
                                return (
                                    <>
                                        <PriceRange
                                            form={form}
                                            label="爬虫价格"
                                            name={['source_price_min', 'source_price_max']}
                                        />
                                        <SalesRange
                                            form={form}
                                            label="爬虫销量"
                                            name={['source_sales_min', 'source_sales_max']}
                                        />
                                    </>
                                );
                            } else {
                                return (
                                    <>
                                        <Form.Item
                                            validateTrigger={'onBlur'}
                                            name="ranges"
                                            className={formStyles.formItem}
                                            initialValue={PUTaskRangeType.HasSales}
                                            rules={[
                                                {
                                                    required: true,
                                                    message: '请选择商品条件',
                                                },
                                            ]}
                                        >
                                            <Radio.Group>
                                                <Radio value={PUTaskRangeType.HasSales}>
                                                    有销量商品
                                                </Radio>
                                                <Radio value={PUTaskRangeType.AllOnShelves}>
                                                    在架商品
                                                </Radio>
                                                <Radio value={PUTaskRangeType.NoSalesOff}>
                                                    未在架商品
                                                </Radio>
                                            </Radio.Group>
                                        </Form.Item>
                                        <Form.Item
                                            noStyle={true}
                                            shouldUpdate={(prevValues, currentValues) => {
                                                return (
                                                    prevValues['ranges'] !== currentValues['ranges']
                                                );
                                            }}
                                        >
                                            {({ getFieldValue }) => {
                                                const ranges = getFieldValue('ranges');
                                                if (ranges === PUTaskRangeType.HasSales) {
                                                    return (
                                                        <SalesRange
                                                            form={form}
                                                            label="渠道销量"
                                                            name={[
                                                                'channel_sales_min',
                                                                'channel_sales_max',
                                                            ]}
                                                        />
                                                    );
                                                } else {
                                                    return null;
                                                }
                                            }}
                                        </Form.Item>
                                    </>
                                );
                            }
                        }}
                    </Form.Item>
                </div>

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
                                        const taskIntervalType = getFieldValue('taskIntervalType');
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
                                        const taskIntervalType = getFieldValue('taskIntervalType');
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
                    <PermissionComponent pid={'task/config/update'} control={'tooltip'}>
                        <LoadingButton type="primary" className="btn-default" onClick={onCreate}>
                            {edit ? '创建新任务' : '创建任务'}
                        </LoadingButton>
                    </PermissionComponent>
                </div>
            </Form>
        );
    }, [edit, channelList]);
};

export default TimerUpdate;

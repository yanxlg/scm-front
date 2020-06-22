import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Button, Input, Select, Spin, Tooltip, Form } from 'antd';
import '@/styles/config.less';
import '@/styles/modal.less';
import formStyles from 'react-components/es/JsonForm/_form.less';
import { showFailureModal } from '@/pages/task/components/modal/GatherFailureModal';
import { addPddHotTask, querySortCondition, queryTaskDetail } from '@/services/task';
import { showSuccessModal } from '@/pages/task/components/modal/GatherSuccessModal';
import { QuestionCircleOutlined } from '@ant-design/icons';
import {
    HotTaskRange,
    TaskExecuteType,
    TaskIntervalConfigType,
    HotTaskFilterType,
} from '@/enums/StatusEnum';
import { RichInput } from 'react-components';
import { IHotTaskBody, IPDDSortItem, ITaskDetailInfo } from '@/interface/ITask';
import { scrollToFirstError } from '@/utils/common';
import { EmptyObject } from '@/config/global';
import ReptileCondition, { ReptileConditionRef } from '../config/hot/ReptileCondition';
import TaskRange from '@/pages/task/components/config/hot/TaskRange';
import TaskCycle from '@/pages/task/components/config/hot/TaskCycle';
import PriceRange from '@/pages/task/components/config/hot/PriceRange';
import SalesRange from '@/pages/task/components/config/hot/SalesRange';
import { TaskChannelCode, TaskChannelEnum } from '@/config/dictionaries/Task';
import SortType from '@/pages/task/components/config/hot/SortType';
import MerchantListModal from '@/pages/goods/components/MerchantListModal';
import { LoadingButton } from 'react-components';
import classNames from 'classnames';
import { dateToUnix } from 'react-components/es/utils/date';
import dayjs from 'dayjs';
import { queryGoodsSourceList } from '@/services/global';
import { EmptyArray } from 'react-components/es/utils';

export declare interface IFormData extends IHotTaskBody {
    shopId: number; // 调用接口前需要进行处理 && 编辑数据源需要处理
    taskIntervalType?: TaskIntervalConfigType; // 调用接口前需要进行处理 && 编辑数据源需要处理
    day?: number; // 调用接口前需要进行处理 && 编辑数据源需要处理
    second?: number; // 调用接口前需要进行处理 && 编辑数据源需要处理
    filterType?: HotTaskFilterType;
}

declare interface IHotGatherProps {
    taskId?: number;
}

const HotGather: React.FC<IHotGatherProps> = ({ taskId }) => {
    const [queryLoading, setQueryLoading] = useState(false);
    const [listSort, setListSort] = useState<IPDDSortItem[]>([]);
    const [merchantSort, setMerchantSort] = useState<IPDDSortItem[]>([]);
    const [sortLoading, setSortLoading] = useState(true);
    const reptileRef = useRef<ReptileConditionRef>(null);
    const [isUpperShelf, setIsUpperShelf] = useState<boolean | undefined>(undefined);

    const [channelList, setChannelList] = useState<
        Array<{
            name: string;
            value: string;
        }>
    >([]);

    const [merchantModal, setMerchantModal] = useState(false);

    const [form] = Form.useForm();

    const edit = taskId !== void 0;

    useEffect(() => {
        queryGoodsSourceList().then((list = EmptyArray) => {
            const _list = list.filter(({ value }) => value === TaskChannelEnum.PDD);
            setChannelList(_list);
            form.setFieldsValue({
                channel: _list[0].value,
            });
        });
    }, []);

    useEffect(() => {
        if (edit) {
            // 查询详情
            queryDetail();
        }

        querySortCondition()
            .then(
                ([
                    {
                        data: { sortCondition: listSort = [] },
                    },
                    {
                        data: { sortCondition: merchantSort = [] },
                    },
                ]) => {
                    setListSort(listSort);
                    setMerchantSort(merchantSort);
                    if (!edit) {
                        // 默认选中第一个
                        const range = form.getFieldValue('range');
                        if (range === HotTaskRange.fullStack) {
                            form.setFieldsValue({
                                sort_type: listSort[0]?.value,
                            });
                        } else {
                            form.setFieldsValue({
                                sort_type: merchantSort[0]?.value,
                            });
                        }
                    }
                },
            )
            .finally(() => {
                setSortLoading(false);
            });
    }, []);

    const convertDetail = useCallback((info: ITaskDetailInfo) => {
        const {
            shopId,
            task_type,
            task_end_time,
            task_start_time,
            task_interval_seconds,
            keywords,
            category_level_one = '',
            category_level_two = '',
            category_level_three = '',
            execute_count,
            sub_cat_id,
            range,
            ...extra
        } = info;
        const taskType =
            Number(execute_count) === TaskExecuteType.once
                ? TaskExecuteType.once
                : TaskExecuteType.interval;
        const isDay = task_interval_seconds && task_interval_seconds % 86400 === 0;
        return {
            keywords,
            category_level_one: category_level_one.split(','),
            category_level_two: category_level_two.split(','),
            category_level_three: category_level_three.split(','),
            range: range,
            shopId: shopId,
            task_end_time:
                taskType === TaskExecuteType.interval && task_end_time
                    ? dayjs(task_end_time * 1000)
                    : undefined,
            taskIntervalType: task_interval_seconds
                ? isDay
                    ? TaskIntervalConfigType.day
                    : TaskIntervalConfigType.second
                : TaskIntervalConfigType.day,
            task_start_time: task_start_time ? dayjs(task_start_time * 1000) : undefined,
            task_type: taskType,
            day: isDay ? task_interval_seconds! / 86400 : undefined,
            second: task_interval_seconds && !isDay ? task_interval_seconds : undefined,
            filterType:
                range === HotTaskRange.fullStack
                    ? keywords
                        ? HotTaskFilterType.ByKeywords
                        : HotTaskFilterType.ByCategory
                    : HotTaskFilterType.ByKeywords,
            ...extra,
        };
    }, []);

    const queryDetail = useCallback(() => {
        setQueryLoading(true);
        queryTaskDetail(taskId!)
            .then(({ data: { task_detail_info = {} } = {} } = EmptyObject) => {
                const initValues = convertDetail(task_detail_info as ITaskDetailInfo);
                setIsUpperShelf(task_detail_info.is_upper_shelf);
                form.setFieldsValue({
                    ...initValues,
                });
            })
            .finally(() => {
                setQueryLoading(false);
            });
    }, []);

    const taskRangeChange = useCallback(
        (value: HotTaskRange) => {
            if (value === HotTaskRange.fullStack) {
                // 全站
                form.setFieldsValue({
                    sort_type: listSort[0]?.value ?? '',
                });
            } else {
                form.setFieldsValue({
                    filterType: HotTaskFilterType.ByKeywords,
                    sort_type: merchantSort[0]?.value ?? '',
                });
            }
        },
        [listSort, merchantSort],
    );

    const taskChannelChange = useCallback(
        (value: TaskChannelCode) => {
            if (value === TaskChannelEnum.PDD) {
                const taskRange = form.getFieldValue('range');
                if (taskRange === HotTaskRange.fullStack) {
                    // 全站
                    form.setFieldsValue({
                        sort_type: listSort[0]?.value ?? '',
                    });
                } else {
                    form.setFieldsValue({
                        filterType: HotTaskFilterType.ByKeywords,
                        sort_type: merchantSort[0]?.value ?? '',
                    });
                }
            }
        },
        [listSort, merchantSort],
    );

    const convertFormData = useCallback((values: IFormData) => {
        const {
            range,
            shopId,
            task_start_time,
            day = 0,
            second,
            taskIntervalType,
            task_type,
            task_end_time,
            category_level_one,
            category_level_two,
            category_level_three,
            filterType,
            ...extra
        } = values;
        return {
            ...extra,
            task_type,
            range: range === HotTaskRange.store ? shopId : range,
            category_level_one:
                range === HotTaskRange.fullStack ? category_level_one?.toString() : undefined,
            category_level_two:
                range === HotTaskRange.fullStack ? category_level_two?.toString() : undefined,
            category_level_three:
                range === HotTaskRange.fullStack ? category_level_three?.toString() : undefined,
            is_immediately_execute: task_type === TaskExecuteType.once && !task_start_time,
            task_start_time: dateToUnix(task_start_time),
            ...(task_type === TaskExecuteType.once
                ? {}
                : {
                      task_interval_seconds:
                          taskIntervalType === TaskIntervalConfigType.second
                              ? second
                              : day * 60 * 60 * 24,
                  }),
            task_end_time:
                task_type === TaskExecuteType.interval ? dateToUnix(task_end_time) : undefined,
        };
    }, []);
    const onGather = useCallback(() => {
        return form
            .validateFields()
            .then((values: any) => {
                const params = convertFormData(values);
                return addPddHotTask(
                    Object.assign({}, params, {
                        is_upper_shelf: false,
                    }),
                )
                    .then(({ data = EmptyObject } = EmptyObject) => {
                        form.resetFields();
                        reptileRef.current!.reset();
                        form.setFieldsValue({
                            sort_type: listSort[0]?.value ?? '',
                            channel: channelList[0]?.value,
                        });
                        showSuccessModal(data);
                    })
                    .catch(() => {
                        showFailureModal();
                    });
            })
            .catch(({ errorFields }) => {
                scrollToFirstError(form, errorFields);
            });
    }, [channelList, listSort]);

    const onGatherOn = useCallback(() => {
        form.validateFields()
            .then((values: any) => {
                setMerchantModal(true);
            })
            .catch(({ errorFields }) => {
                scrollToFirstError(form, errorFields);
            });
    }, []);

    const closeMerChantModal = useCallback(() => {
        setMerchantModal(false);
    }, []);

    const onGatherOnOKey = useCallback(
        (merchant_ids: string[]) => {
            const values = form.getFieldsValue() as IFormData;
            const params = convertFormData(values);
            return addPddHotTask(
                Object.assign(
                    {
                        merchants_id: merchant_ids.join(','),
                    },
                    params,
                    {
                        is_upper_shelf: true,
                    },
                ),
            )
                .then(({ data = EmptyObject } = EmptyObject) => {
                    form.resetFields();
                    reptileRef.current!.reset();
                    form.setFieldsValue({
                        sort_type: listSort[0]?.value ?? '',
                        channel: channelList[0]?.value,
                    });
                    showSuccessModal(data);
                })
                .catch(() => {
                    showFailureModal();
                });
        },
        [listSort, channelList],
    );

    const modals = useMemo(() => {
        return (
            <MerchantListModal
                visible={merchantModal}
                onOKey={onGatherOnOKey}
                onCancel={closeMerChantModal}
            />
        );
    }, [merchantModal, listSort, channelList]);

    const body = useMemo(() => {
        return (
            <Spin spinning={queryLoading} tip="Loading...">
                <Form
                    className={classNames(formStyles.formHelpAbsolute, formStyles.formContainer)}
                    layout="horizontal"
                    autoComplete={'off'}
                    form={form}
                    initialValues={{
                        range: HotTaskRange.fullStack,
                        task_type: TaskExecuteType.once,
                        taskIntervalType: TaskIntervalConfigType.day,
                        filterType: HotTaskFilterType.ByCategory,
                        day: 1,
                        grab_page_count: 20,
                        grab_count_max: 10000,
                    }}
                >
                    <Form.Item
                        className={edit ? '' : formStyles.formItem}
                        validateTrigger={'onBlur'}
                        name="task_name"
                        label="任务名称"
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
                        label="任务渠道"
                        rules={[
                            {
                                required: true,
                                message: '请选择任务渠道',
                            },
                        ]}
                    >
                        <Select className="picker-default" onChange={taskChannelChange}>
                            {channelList.map(({ name, value }) => {
                                return (
                                    <Select.Option value={value} key={value}>
                                        {name}
                                    </Select.Option>
                                );
                            })}
                        </Select>
                    </Form.Item>
                    <TaskRange form={form} onTaskRangeChange={taskRangeChange} />
                    <SortType
                        form={form}
                        listSort={listSort}
                        merchantSort={merchantSort}
                        sortLoading={sortLoading}
                    />
                    <ReptileCondition form={form} ref={reptileRef} />
                    <div>
                        <Form.Item
                            validateTrigger={'onBlur'}
                            name="grab_page_count"
                            label="爬取页数"
                            className={classNames(formStyles.formItem, formStyles.formHorizon)}
                            rules={[
                                {
                                    required: true,
                                    message: '请输入爬取页数',
                                },
                            ]}
                        >
                            <RichInput richType="positiveInteger" className="picker-default" />
                        </Form.Item>
                        <Form.Item
                            validateTrigger={'onBlur'}
                            name="grab_count_max"
                            className={classNames(formStyles.formItem, formStyles.formHorizon)}
                            label={
                                <span>
                                    爬取数量
                                    <Tooltip
                                        placement="bottom"
                                        title="各指定类目筛选前可爬取的最大数量"
                                    >
                                        <QuestionCircleOutlined className="config-ques" />
                                    </Tooltip>
                                </span>
                            }
                            rules={[
                                {
                                    required: true,
                                    message: '请输入爬取数量',
                                },
                            ]}
                        >
                            <RichInput richType="positiveInteger" className="picker-default" />
                        </Form.Item>
                    </div>
                    <div>
                        <SalesRange form={form} />
                        <PriceRange form={form} />
                    </div>
                    <TaskCycle form={form} />
                    <div className={formStyles.formItem}>
                        {edit ? (
                            isUpperShelf === false ? (
                                <LoadingButton
                                    onClick={onGather}
                                    type="primary"
                                    className="btn-default"
                                >
                                    {edit ? '创建新采集任务' : '开始采集'}
                                </LoadingButton>
                            ) : null
                        ) : (
                            <LoadingButton
                                onClick={onGather}
                                type="primary"
                                className="btn-default"
                            >
                                开始采集
                            </LoadingButton>
                        )}
                        {edit ? (
                            isUpperShelf === false ? null : (
                                <Button onClick={onGatherOn} type="primary" className="btn-default">
                                    创建新采集上架任务
                                </Button>
                            )
                        ) : (
                            <Button type="primary" className="btn-default" onClick={onGatherOn}>
                                一键采集上架
                            </Button>
                        )}
                    </div>
                </Form>
            </Spin>
        );
    }, [queryLoading, sortLoading, channelList]);

    return (
        <>
            {body}
            {modals}
        </>
    );
};

export default HotGather;

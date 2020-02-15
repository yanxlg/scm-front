import React from 'react';
import { Form } from '@/components/Form';
import { Bind } from 'lodash-decorators';
import { FormComponentProps } from 'antd/lib/form';
import {
    Button,
    Card,
    DatePicker,
    Icon,
    Input,
    InputNumber,
    Modal,
    Radio,
    Select,
    Spin,
    Tooltip,
} from 'antd';
import '@/styles/config.less';
import '@/styles/form.less';
import '@/styles/modal.less';
import GatherFailureModal from '@/pages/task/components/GatherFailureModal';
import { TaskIntervalType, TaskRange, TaskType } from '@/enums/ConfigEnum';
import {
    addPddHotTask,
    IPddHotTaskParams,
    queryCategory,
    querySortCondition,
    queryTaskDetail,
} from '@/services/task';
import GatherSuccessModal from '@/pages/task/components/GatherSuccessModal';
import { numberFormatter } from '@/utils/common';
import moment, { Moment } from 'moment';

export declare interface IFormData {
    range?: TaskRange; // 调用接口前需要进行处理 && 编辑数据源需要处理
    shopId?: number; // 调用接口前需要进行处理 && 编辑数据源需要处理
    category_level_one?: string;
    category_level_two?: string;
    sort_type?: string;
    keywords?: string;
    task_type?: TaskType;
    taskIntervalType?: TaskIntervalType; // 调用接口前需要进行处理 && 编辑数据源需要处理
    sales_volume_min?: number;
    sales_volume_max?: number;
    price_min?: number;
    price_max?: number;
    grab_page_count?: number;
    grab_count_max?: number;
    onceStartTime?: Moment; // 单次任务开始时间，提交及编辑时需要进行数据处理
    timerStartTime?: Moment; // 定时任务开始时间，提交及编辑时需要进行数据处理
    task_end_time?: Moment;
    day?: number; // 调用接口前需要进行处理 && 编辑数据源需要处理
    second?: number; // 调用接口前需要进行处理 && 编辑数据源需要处理
    task_name?: string;
}

declare interface IHotGatherProps extends FormComponentProps<IFormData> {
    taskId?: number;
}

declare interface IHotGatherState {
    gatherLoading: boolean;
    groundLoading: boolean;
    queryLoading: boolean;
    taskType?: TaskType;
    successTimes?: number;
    failTimes?: number;

    pddCategory: IPDDCategory;
    categoryLoading: boolean;
    sortCondition: Array<IPDDSortItem>;
    sortLoading: boolean;
}

declare interface IPDDCategoryItem {
    platform_cate_id: string;
    platform_cate_name: string;
    children?: Array<IPDDCategoryItem>;
}

type IPDDCategory = Array<IPDDCategoryItem>;

declare interface IPDDSortItem {
    display: string;
    value: string;
}

const Option = Select.Option;

class _HotGather extends Form.BaseForm<IHotGatherProps, IHotGatherState> {
    constructor(props: IHotGatherProps) {
        super(props);
        this.state = {
            gatherLoading: false,
            groundLoading: false,
            queryLoading: props.taskId !== void 0,
            pddCategory: [],
            categoryLoading: true,
            sortCondition: [],
            sortLoading: true,
        };
    }

    componentDidMount(): void {
        const { taskId } = this.props;
        if (taskId !== void 0) {
            queryTaskDetail(taskId).then(({ data: { task_detail_info = {} } = {} } = {}) => {
                const initValues = this.convertDetail(task_detail_info);
                const { task_type, success, fail } = initValues;
                this.props.form.setFieldsValue({
                    ...initValues,
                });
                this.setState({
                    queryLoading: false,
                    taskType: task_type,
                    successTimes: success,
                    failTimes: fail,
                });
            });
        }
        // query category
        this.queryCategory();
        this.querySortCondition();
    }

    @Bind
    private querySortCondition() {
        querySortCondition()
            .then(({ data: { sortCondition } }) => {
                this.setState({
                    sortLoading: false,
                    sortCondition: sortCondition,
                });
            })
            .catch(() => {
                this.setState({
                    sortLoading: false,
                });
            });
    }

    @Bind
    private queryCategory() {
        queryCategory()
            .then(({ data }) => {
                this.setState({
                    categoryLoading: false,
                    pddCategory: data,
                });
            })
            .catch(() => {
                this.setState({
                    categoryLoading: false,
                });
            });
    }

    @Bind
    private convertDetail(info: IPddHotTaskParams) {
        const {
            range,
            task_type,
            task_end_time,
            task_start_time,
            task_interval_seconds,
            ...extra
        } = info;
        const isDay = task_interval_seconds && task_interval_seconds % 86400 === 0;
        return {
            range: range === TaskRange.fullStack ? range : TaskRange.store,
            shopId: range !== TaskRange.fullStack ? range : undefined,
            task_end_time: task_end_time ? moment(task_end_time*1000) : undefined,
            taskIntervalType: task_interval_seconds
                ? isDay
                    ? TaskIntervalType.day
                    : TaskIntervalType.second
                : TaskIntervalType.day,
            onceStartTime:
                task_type === TaskType.once && task_start_time
                    ? moment(task_start_time*1000)
                    : undefined,
            timerStartTime:
                task_type === TaskType.interval && task_start_time
                    ? moment(task_start_time*1000)
                    : undefined,
            task_type,
            day: isDay ? task_interval_seconds! / 86400 : undefined,
            second: task_interval_seconds && !isDay ? task_interval_seconds : undefined,
            ...extra,
        };
    }

    @Bind
    private convertFormData(values: IFormData) {
        const {
            range,
            shopId,
            onceStartTime,
            timerStartTime,
            day = 0,
            second,
            taskIntervalType,
            task_type,
            task_end_time,
            ...extra
        } = values;
        return {
            ...extra,
            task_type,
            range: range === TaskRange.store ? shopId : range,
            is_immediately_execute: task_type === TaskType.once && !onceStartTime,
            task_start_time:
                task_type === TaskType.once
                    ? onceStartTime?.unix() ?? undefined
                    : timerStartTime?.unix() ?? undefined,
            ...(task_type === TaskType.once
                ? {}
                : {
                      task_interval_seconds:
                          taskIntervalType === TaskIntervalType.second
                              ? second
                              : day * 60 * 60 * 24,
                  }),
            task_end_time: task_end_time?.unix() ?? undefined,
        };
    }

    @Bind
    private onGather(is_upper_shelf: boolean = false) {
        this.validate({
            scroll: {
                offsetTop: 80,
            },
        }).then((values: any) => {
            const params = this.convertFormData(values);
            this.setState(
                is_upper_shelf
                    ? {
                          groundLoading: true,
                          gatherLoading: false,
                      }
                    : {
                          gatherLoading: true,
                          groundLoading: false,
                      },
            );
            addPddHotTask(
                Object.assign({}, params, {
                    is_upper_shelf: is_upper_shelf,
                }),
            )
                .then(({ data: { task_id = -1 } = {} } = {}) => {
                    Modal.info({
                        content: (
                            <GatherSuccessModal
                                taskId={task_id}
                                onClick={() => {
                                    Modal.destroyAll();
                                    alert('任务详情');
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
                                    this.onGather(is_upper_shelf);
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
                        gatherLoading: false,
                        groundLoading: false,
                    });
                });
        });
    }

    @Bind
    private onStartGather() {
        this.onGather();
    }

    @Bind
    private onAcquisitionRack() {
        this.onGather(true);
    }

    @Bind
    private onCategoryChange() {
        this.props.form.resetFields(['category_level_two']);
    }

    render() {
        const { form, taskId } = this.props;
        const edit = taskId !== void 0;
        const formData = form.getFieldsValue();
        const { range, task_type, taskIntervalType } = formData;
        const {
            gatherLoading,
            groundLoading,
            queryLoading,
            taskType,
            failTimes,
            successTimes,
            pddCategory = [],
            categoryLoading,
            sortLoading,
            sortCondition = [],
        } = this.state;
        const childCategory =
            pddCategory.find(category => {
                return category.platform_cate_id === formData.category_level_one;
            })?.children || [];
        return (
            <Spin spinning={queryLoading} tip="Loading...">
                {edit && (
                    <React.Fragment>
                        <div className="config-task-label">任务ID：{taskId}</div>
                        <div className="config-task-label">任务状态: {taskType}</div>
                        <div className="config-task-label">执行成功：{successTimes}次</div>
                        <div className="config-task-label">执行失败：{failTimes}次</div>
                    </React.Fragment>
                )}
                <Form className="form-help-absolute" layout="inline" autoComplete={'off'}>
                    <Form.Item
                        className="block form-item"
                        validateTrigger={'onBlur'}
                        form={form}
                        name="task_name"
                        label="任务名称"
                    >
                        <Input className="input-default" />
                    </Form.Item>
                    <Card
                        className="config-card"
                        title={<span className="ant-form-item-required">任务范围：</span>}
                    >
                        <Form.Item
                            validateTrigger={'onBlur'}
                            form={form}
                            name="range"
                            initialValue={TaskRange.fullStack}
                        >
                            <Radio.Group>
                                <Radio className="block" value={TaskRange.fullStack}>
                                    全站
                                </Radio>
                                <div className="block form-item">
                                    <Radio className="vertical-middle" value={TaskRange.store}>
                                        指定店铺
                                    </Radio>
                                    <Form.Item
                                        className="vertical-middle"
                                        validateTrigger={'onBlur'}
                                        form={form}
                                        label="店铺ID"
                                        name="shopId"
                                        rules={[
                                            {
                                                required: range === 'shop',
                                                message: '请输入店铺ID',
                                            },
                                        ]}
                                    >
                                        <InputNumber
                                            min={0}
                                            placeholder={'请输入'}
                                            className="input-default input-handler"
                                            formatter={numberFormatter}
                                            disabled={range !== TaskRange.store}
                                        />
                                    </Form.Item>
                                </div>
                            </Radio.Group>
                        </Form.Item>
                    </Card>
                    <Card className="config-card" title="指定类目/关键词：">
                        <Form.Item
                            validateTrigger={'onBlur'}
                            form={form}
                            name="category_level_one"
                            label="一级类目"
                        >
                            <Select
                                loading={categoryLoading}
                                className="select-default"
                                onChange={this.onCategoryChange}
                            >
                                {pddCategory.map(category => {
                                    return (
                                        <Option
                                            key={category.platform_cate_id}
                                            value={category.platform_cate_id}
                                        >
                                            {category.platform_cate_name}
                                        </Option>
                                    );
                                })}
                            </Select>
                        </Form.Item>
                        <Form.Item
                            validateTrigger={'onBlur'}
                            form={form}
                            name="category_level_two"
                            label="二级类目"
                        >
                            <Select loading={categoryLoading} className="select-default">
                                {childCategory.map(category => {
                                    return (
                                        <Option
                                            key={category.platform_cate_id}
                                            value={category.platform_cate_id}
                                        >
                                            {category.platform_cate_name}
                                        </Option>
                                    );
                                })}
                            </Select>
                        </Form.Item>
                        <Form.Item
                            validateTrigger={'onBlur'}
                            form={form}
                            name="sort_type"
                            label="排序类型"
                        >
                            <Select loading={sortLoading} className="select-default">
                                {sortCondition.map(sort => {
                                    return (
                                        <Option key={sort.value} value={sort.value}>
                                            {sort.display}
                                        </Option>
                                    );
                                })}
                            </Select>
                        </Form.Item>
                        <Form.Item
                            className="block form-item"
                            validateTrigger={'onBlur'}
                            form={form}
                            name="keywords"
                            label="关&ensp;键&ensp;词"
                        >
                            <Input
                                className="input-large"
                                spellCheck={'false'}
                                placeholder="iPhone XR，国行，白"
                            />
                        </Form.Item>
                    </Card>
                    <Card className="config-card" title="设置商品条件：">
                        <div className="block">
                            <div className="inline-block">
                                <Form.Item
                                    className="margin-none"
                                    validateTrigger={'onBlur'}
                                    form={form}
                                    name="sales_volume_min"
                                    label="销&emsp;&emsp;量"
                                >
                                    <InputNumber
                                        min={0}
                                        className="input-small input-handler"
                                        formatter={numberFormatter}
                                    />
                                </Form.Item>
                                <span className="ant-col ant-form-item-label config-colon">-</span>
                                <Form.Item
                                    validateTrigger={'onBlur'}
                                    form={form}
                                    name="sales_volume_max"
                                >
                                    <InputNumber
                                        min={0}
                                        className="input-small input-handler"
                                        formatter={numberFormatter}
                                    />
                                </Form.Item>
                            </div>
                            <div className="inline-block">
                                <Form.Item
                                    className="margin-none"
                                    validateTrigger={'onBlur'}
                                    form={form}
                                    name="price_min"
                                    label="价格范围(￥)"
                                >
                                    <InputNumber
                                        min={0}
                                        className="input-small input-handler"
                                        formatter={numberFormatter}
                                    />
                                </Form.Item>
                                <span className="ant-col ant-form-item-label config-colon">-</span>
                                <Form.Item validateTrigger={'onBlur'} form={form} name="price_max">
                                    <InputNumber
                                        min={0}
                                        className="input-small input-handler"
                                        formatter={numberFormatter}
                                    />
                                </Form.Item>
                            </div>
                        </div>
                        <div className="block form-item">
                            <Form.Item
                                validateTrigger={'onBlur'}
                                form={form}
                                name="grab_page_count"
                                label="爬取页数"
                            >
                                <InputNumber
                                    min={0}
                                    className="config-input-pages input-handler"
                                    formatter={numberFormatter}
                                    width={200}
                                />
                            </Form.Item>
                            <Form.Item
                                validateTrigger={'onBlur'}
                                form={form}
                                name="grab_count_max"
                                label={
                                    <span>
                                        爬取数量
                                        <Tooltip
                                            placement="bottom"
                                            title="各指定类目筛选前可爬取的最大数量"
                                        >
                                            <Icon type="question-circle" className="config-ques" />
                                        </Tooltip>
                                    </span>
                                }
                            >
                                <InputNumber
                                    min={0}
                                    className="config-input-count input-handler"
                                    formatter={numberFormatter}
                                />
                            </Form.Item>
                        </div>
                    </Card>
                    <Card
                        className="config-card"
                        title={<span className="ant-form-item-required">任务类型：</span>}
                    >
                        <Form.Item
                            validateTrigger={'onBlur'}
                            form={form}
                            name="task_type"
                            initialValue={TaskType.once}
                        >
                            <Radio.Group>
                                <div className="block">
                                    <Radio className="vertical-middle" value={TaskType.once}>
                                        单次任务
                                    </Radio>
                                    <Form.Item
                                        className="vertical-middle"
                                        validateTrigger={'onBlur'}
                                        form={form}
                                        label="开始时间"
                                        name="onceStartTime"
                                    >
                                        <DatePicker
                                            showTime={true}
                                            placeholder={'立即开始'}
                                            disabled={task_type !== TaskType.once}
                                        />
                                    </Form.Item>
                                </div>
                                <div className="form-item">
                                    <Radio className="vertical-middle" value={TaskType.interval}>
                                        定时任务
                                    </Radio>
                                    <Form.Item
                                        className="vertical-middle"
                                        validateTrigger={'onBlur'}
                                        form={form}
                                        label="开始时间"
                                        name="timerStartTime"
                                    >
                                        <DatePicker
                                            showTime={true}
                                            disabled={task_type !== TaskType.interval}
                                        />
                                    </Form.Item>
                                    <Form.Item
                                        className="vertical-middle"
                                        validateTrigger={'onBlur'}
                                        form={form}
                                        label="结束时间"
                                        name="task_end_time"
                                    >
                                        <DatePicker
                                            showTime={true}
                                            disabled={task_type !== TaskType.interval}
                                        />
                                    </Form.Item>
                                    <Form.Item
                                        className="vertical-middle"
                                        validateTrigger={'onBlur'}
                                        form={form}
                                        label="任务间隔"
                                        name="taskIntervalType"
                                        initialValue={TaskIntervalType.day}
                                    >
                                        <Radio.Group disabled={task_type !== TaskType.interval}>
                                            <Radio value={TaskIntervalType.day}>
                                                <Form.Item
                                                    className="vertical-middle"
                                                    validateTrigger={'onBlur'}
                                                    form={form}
                                                    name="day"
                                                >
                                                    <InputNumber
                                                        min={0}
                                                        className="input-small input-handler"
                                                        formatter={numberFormatter}
                                                        disabled={
                                                            task_type !== TaskType.interval ||
                                                            taskIntervalType !==
                                                                TaskIntervalType.day
                                                        }
                                                    />
                                                </Form.Item>
                                                天
                                            </Radio>
                                            <Radio value={TaskIntervalType.second}>
                                                <Form.Item
                                                    className="vertical-middle"
                                                    validateTrigger={'onBlur'}
                                                    form={form}
                                                    name="second"
                                                >
                                                    <InputNumber
                                                        min={0}
                                                        className="input-small input-handler"
                                                        formatter={numberFormatter}
                                                        disabled={
                                                            task_type !== TaskType.interval ||
                                                            taskIntervalType !==
                                                                TaskIntervalType.second
                                                        }
                                                    />
                                                </Form.Item>
                                                秒
                                            </Radio>
                                        </Radio.Group>
                                    </Form.Item>
                                </div>
                            </Radio.Group>
                        </Form.Item>
                    </Card>
                    <div className="form-item">
                        <Button
                            loading={gatherLoading}
                            type="primary"
                            className="btn-default"
                            onClick={this.onStartGather}
                        >
                            {edit ? '创建新任务' : '开始采集'}
                        </Button>
                        <Button
                            loading={groundLoading}
                            type="primary"
                            className="btn-default"
                            onClick={this.onAcquisitionRack}
                        >
                            {edit ? '创建任务且上架' : '一键采集上架'}
                        </Button>
                    </div>
                </Form>
            </Spin>
        );
    }
}

const HotGather = Form.create<IHotGatherProps>()(_HotGather);

export default HotGather;

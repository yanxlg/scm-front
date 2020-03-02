import React, { RefObject, useCallback } from 'react';
import { BindAll } from 'lodash-decorators';
import {
    Button,
    Card,
    DatePicker,
    Input,
    Modal,
    Radio,
    Select,
    Spin,
    Tooltip,
    Form,
    TreeSelect,
} from 'antd';
import '@/styles/config.less';
import '@/styles/form.less';
import '@/styles/modal.less';
import GatherFailureModal from '@/pages/task/components/GatherFailureModal';
import {
    addPddHotTask,
    IPddHotTaskParams,
    queryCategory,
    querySortCondition,
    queryTaskDetail,
} from '@/services/task';
import GatherSuccessModal from '@/pages/task/components/GatherSuccessModal';
import moment, { Moment } from 'moment';
import { isNull } from '@/utils/validate';
import { FormInstance } from 'antd/es/form';
import { QuestionCircleOutlined } from '@ant-design/icons/lib';
import { RadioChangeEvent } from 'antd/lib/radio/interface';
import {
    TaskStatusMap,
    HotTaskRange,
    TaskExecuteType,
    TaskIntervalConfigType,
    HotTaskFilterType,
} from '@/enums/StatusEnum';
import IntegerInput from '@/components/IntegerInput';
import { doc } from 'prettier';
import concat = doc.builders.concat;

export declare interface IFormData {
    range?: HotTaskRange; // 调用接口前需要进行处理 && 编辑数据源需要处理
    shopId?: number; // 调用接口前需要进行处理 && 编辑数据源需要处理
    category_level_one?: string[] | string;
    category_level_two?: string[] | string;
    category_level_three?: string[] | string;
    sort_type?: string;
    keywords?: string;
    task_type?: TaskExecuteType;
    taskIntervalType?: TaskIntervalConfigType; // 调用接口前需要进行处理 && 编辑数据源需要处理
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
    filterType?: HotTaskFilterType;
}

declare interface IHotGatherProps {
    taskId?: number;
}

declare interface IHotGatherState {
    gatherLoading: boolean;
    groundLoading: boolean;
    queryLoading: boolean;
    status?: string;
    successTimes?: number;
    failTimes?: number;

    pddCategory: IPDDCategory;
    categoryLoading: boolean;
    listSort: Array<IPDDSortItem>;
    merchantSort: Array<IPDDSortItem>;
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

@BindAll()
class HotGather extends React.PureComponent<IHotGatherProps, IHotGatherState> {
    private formRef: RefObject<FormInstance> = React.createRef();

    constructor(props: IHotGatherProps) {
        super(props);
        this.state = {
            gatherLoading: false,
            groundLoading: false,
            queryLoading: props.taskId !== void 0,
            pddCategory: [],
            categoryLoading: true,
            listSort: [],
            merchantSort: [],
            sortLoading: true,
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
        // query category
        this.queryCategory();
        this.querySortCondition();
    }

    private querySortCondition() {
        Promise.all([querySortCondition('list'), querySortCondition('merchant')])
            .then(
                ([
                    {
                        data: { sortCondition: listSort = [] },
                    },
                    {
                        data: { sortCondition: merchantSort = [] },
                    },
                ]) => {
                    this.setState({
                        sortLoading: false,
                        listSort: listSort,
                        merchantSort: merchantSort,
                    });
                    if (this.props.taskId === void 0) {
                        // 设置默认排序类型
                        const range = this.formRef.current!.getFieldValue('range');
                        if (range === HotTaskRange.fullStack) {
                            this.formRef.current!.setFieldsValue({
                                sort_type: listSort[0]?.value,
                            });
                        } else {
                            this.formRef.current!.setFieldsValue({
                                sort_type: merchantSort[0]?.value,
                            });
                        }
                    }
                },
            )
            .catch(() => {
                this.setState({
                    sortLoading: false,
                });
            });
    }

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

    private convertDetail(info: IPddHotTaskParams) {
        const {
            range,
            task_type,
            task_end_time,
            task_start_time,
            task_interval_seconds,
            keywords,
            category_level_one = '',
            category_level_two = '',
            category_level_three = '',
            ...extra
        } = info;
        const taskType =
            (task_type as any) === '单次任务' ? TaskExecuteType.once : TaskExecuteType.interval;
        const isDay = task_interval_seconds && task_interval_seconds % 86400 === 0;
        return {
            keywords,
            category_level_one: category_level_one.split(','),
            category_level_two: category_level_two.split(','),
            category_level_three: category_level_three.split(','),
            range: range === HotTaskRange.fullStack ? range : HotTaskRange.store,
            shopId: range !== HotTaskRange.fullStack ? range : undefined,
            task_end_time:
                taskType === TaskExecuteType.interval && task_end_time
                    ? moment(task_end_time * 1000)
                    : undefined,
            taskIntervalType: task_interval_seconds
                ? isDay
                    ? TaskIntervalConfigType.day
                    : TaskIntervalConfigType.second
                : TaskIntervalConfigType.day,
            onceStartTime:
                taskType === TaskExecuteType.once && task_start_time
                    ? moment(task_start_time * 1000)
                    : undefined,
            timerStartTime:
                taskType === TaskExecuteType.interval && task_start_time
                    ? moment(task_start_time * 1000)
                    : undefined,
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
    }

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
                range === HotTaskRange.fullStack
                    ? typeof category_level_one === 'string'
                        ? category_level_one
                        : category_level_one?.join(',')
                    : undefined,
            category_level_two:
                range === HotTaskRange.fullStack
                    ? typeof category_level_two === 'string'
                        ? category_level_two
                        : category_level_two?.join(',')
                    : undefined,
            category_level_three:
                range === HotTaskRange.fullStack
                    ? typeof category_level_three === 'string'
                        ? category_level_three
                        : category_level_three?.join(',')
                    : undefined,
            is_immediately_execute: task_type === TaskExecuteType.once && !onceStartTime,
            task_start_time:
                task_type === TaskExecuteType.once
                    ? onceStartTime?.unix() ?? undefined
                    : timerStartTime?.unix() ?? undefined,
            ...(task_type === TaskExecuteType.once
                ? {}
                : {
                      task_interval_seconds:
                          taskIntervalType === TaskIntervalConfigType.second
                              ? second
                              : day * 60 * 60 * 24,
                  }),
            task_end_time:
                task_type === TaskExecuteType.interval
                    ? task_end_time?.unix() ?? undefined
                    : undefined,
        };
    }

    private onGather(is_upper_shelf: boolean = false) {
        this.formRef
            .current!.validateFields()
            .then((values: any) => {
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
                        this.formRef.current!.resetFields();
                        Modal.info({
                            content: (
                                <GatherSuccessModal
                                    taskId={task_id}
                                    onClick={() => {
                                        Modal.destroyAll();
                                        Modal.info({
                                            content: <HotGather taskId={task_id} />,
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

    private onStartGather() {
        this.onGather();
    }

    private onAcquisitionRack() {
        this.onGather(true);
    }

    private onFirstCategoryChange() {
        this.formRef.current!.resetFields(['category_level_two', 'category_level_three']);
    }

    private onSecondCategoryChange() {
        this.formRef.current!.resetFields(['category_level_three']);
    }

    private checkMinSaleNum(rule: any, value: any) {
        const { sales_volume_max } = this.formRef.current!.getFieldsValue(['sales_volume_max']);
        if (
            !isNull(sales_volume_max) &&
            !isNull(value) &&
            Number(value) > Number(sales_volume_max)
        ) {
            return Promise.reject('最小销量不能大于最大销量');
        }
        return Promise.resolve();
    }

    private checkMaxSaleNum(rule: any, value: any) {
        const { sales_volume_min } = this.formRef.current!.getFieldsValue(['sales_volume_min']);
        if (
            !isNull(sales_volume_min) &&
            !isNull(value) &&
            Number(value) < Number(sales_volume_min)
        ) {
            return Promise.reject('最大销量不能小于最小销量');
        }
        return Promise.resolve();
    }

    private checkMinPrice(rule: any, value: any) {
        const { price_max } = this.formRef.current!.getFieldsValue(['price_max']);
        if (!isNull(price_max) && !isNull(value) && Number(value) > Number(price_max)) {
            return Promise.reject('最小价格不能大于最大价格');
        }
        return Promise.resolve();
    }

    private checkMaxPrice(rule: any, value: any) {
        const { price_min } = this.formRef.current!.getFieldsValue(['price_min']);
        if (!isNull(price_min) && !isNull(value) && Number(value) < Number(price_min)) {
            return Promise.reject('最大价格不能小于最小价格');
        }
        return Promise.resolve();
    }

    private disabledStartDate(startTime: Moment | null) {
        const taskType = this.formRef.current!.getFieldValue('task_type');
        const endTime =
            taskType === TaskExecuteType.interval
                ? this.formRef.current!.getFieldValue('task_end_time')
                : null;
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
        const startTime = this.formRef.current!.getFieldValue('timerStartTime');
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

    private resetTaskTypeError() {
        this.formRef.current!.setFields([
            {
                name: 'onceStartTime',
                errors: [],
            },
            {
                name: 'timerStartTime',
                errors: [],
            },
            {
                name: 'task_end_time',
                errors: [],
            },
        ]);
    }

    private checkDate(type: any, value: Moment) {
        const taskType = this.formRef.current!.getFieldValue('task_type');
        if (!value || taskType === TaskExecuteType.interval) {
            return Promise.resolve();
        }
        const now = moment();
        if (value.isAfter(now)) {
            return Promise.resolve();
        } else {
            return Promise.reject('开始时间不能早于当前时间');
        }
    }

    private checkStartDate(type: any, value: Moment) {
        const taskType = this.formRef.current!.getFieldValue('task_type');
        if (!value || taskType === TaskExecuteType.once) {
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
        const taskType = this.formRef.current!.getFieldValue('task_type');
        if (!value || taskType === TaskExecuteType.once) {
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

    private taskRangeChange(e: RadioChangeEvent) {
        const value = e.target.value;
        if (value === HotTaskRange.fullStack) {
            // 全站
            this.formRef.current!.resetFields(['shopId']);
            this.formRef.current!.setFieldsValue({
                sort_type: this.state.listSort[0].value,
            });
        } else {
            this.formRef.current!.resetFields([
                'category_level_one',
                'category_level_two',
                'category_level_three',
            ]);
            this.formRef.current!.setFieldsValue({
                filterType: HotTaskFilterType.ByKeywords,
                sort_type: this.state.merchantSort[0].value,
            });
        }
    }

    private onFilterTypeChange(e: RadioChangeEvent) {
        const value = e.target.value;
        if (value === HotTaskFilterType.ByCategory) {
            // 类目筛选
            this.formRef.current!.resetFields(['keywords']);
        } else {
            this.formRef.current!.resetFields([
                'category_level_one',
                'category_level_two',
                'category_level_three',
            ]);
        }
    }

    private getTreeNodeList(firstFilterIds?: string[], secondFilterIds?: string[]) {
        const { pddCategory = [] } = this.state;
        const filterType =
            this.formRef.current?.getFieldValue('filterType') ?? HotTaskFilterType.ByCategory;
        if (filterType === HotTaskFilterType.ByKeywords) {
            const form = this.formRef.current;
            if (form) {
                form.setFieldsValue({
                    category_level_one: undefined,
                    category_level_two: undefined,
                    category_level_three: undefined,
                });
            }
            return [];
        }
        let idArr: string[] = [];
        let childrenArr: any[] = [];
        let ids = '';
        const firstFilterIdArray =
            firstFilterIds && firstFilterIds.length === 1
                ? firstFilterIds[0].split(',')
                : firstFilterIds;
        const secondFilterIdArray =
            secondFilterIds && secondFilterIds.length === 1
                ? secondFilterIds[0].split(',')
                : secondFilterIds;
        if (!firstFilterIdArray) {
            pddCategory.forEach(category => {
                idArr.push(category.platform_cate_id);
                childrenArr.push({
                    title: category.platform_cate_name,
                    value: category.platform_cate_id,
                    key: category.platform_cate_id,
                });
            });
            ids = idArr.join(',');
            const form = this.formRef.current;
            if (form) {
                const category_level_one = form.getFieldValue('category_level_one');
                if (!category_level_one || category_level_one.length === 0) {
                    form.setFieldsValue({
                        category_level_one: ids,
                    });
                }
            }
            return [
                {
                    title: '全选',
                    value: ids,
                    key: ids,
                    children: childrenArr,
                },
            ];
        }
        if (!secondFilterIdArray) {
            pddCategory
                .filter(category => {
                    return firstFilterIdArray.indexOf(category.platform_cate_id) > -1;
                })
                .forEach(({ children = [] }) => {
                    children.forEach(category => {
                        idArr.push(category.platform_cate_id);
                        childrenArr.push({
                            title: category.platform_cate_name,
                            value: category.platform_cate_id,
                            key: category.platform_cate_id,
                        });
                    });
                });
            ids = idArr.join(',');
            const form = this.formRef.current;
            const hasChildren = ids.length > 0;
            if (form) {
                const category_level_two = form.getFieldValue('category_level_two');
                if (!category_level_two || category_level_two.length === 0) {
                    form.setFieldsValue({
                        category_level_two: hasChildren ? ids : undefined,
                    });
                }
            }
            return hasChildren
                ? [
                      {
                          title: '全选',
                          value: ids,
                          key: ids,
                          children: childrenArr,
                      },
                  ]
                : [];
        }
        pddCategory
            .filter(category => {
                return firstFilterIdArray.indexOf(category.platform_cate_id) > -1;
            })
            .forEach(({ children = [] }) => {
                children
                    .filter(category => {
                        return secondFilterIdArray.indexOf(category.platform_cate_id) > -1;
                    })
                    .forEach(({ children = [] }) => {
                        children.forEach(category => {
                            idArr.push(category.platform_cate_id);
                            childrenArr.push({
                                title: category.platform_cate_name,
                                value: category.platform_cate_id,
                                key: category.platform_cate_id,
                            });
                        });
                    });
            });
        ids = idArr.join(',');
        const hasChildren = ids.length > 0;
        const form = this.formRef.current;
        if (form) {
            const category_level_three = form.getFieldValue('category_level_three');
            if (!category_level_three || category_level_three.length === 0) {
                form.setFieldsValue({
                    category_level_three: hasChildren ? ids : undefined,
                });
            }
        }
        return hasChildren
            ? [
                  {
                      title: '全选',
                      value: ids,
                      key: ids,
                      children: childrenArr,
                  },
              ]
            : [];
    }

    private checkSecondCategory() {
        const {
            category_level_one = [],
            category_level_two = [],
            filterType,
        } = this.formRef.current!.getFieldsValue([
            'category_level_one',
            'category_level_two',
            'filterType',
        ]);
        if (filterType === HotTaskFilterType.ByKeywords) {
            return Promise.resolve();
        }
        const firstIds =
            typeof category_level_one === 'string'
                ? category_level_one.split(',')
                : category_level_one.length === 1
                ? category_level_one[0].split(',')
                : category_level_one;
        let validate = false;
        const { pddCategory = [] } = this.state;
        let firstCategoryList: any[] = [];

        pddCategory.forEach(first => {
            if (firstIds.indexOf(first.platform_cate_id) > -1) {
                firstCategoryList.push(first);
            }
        });

        const mergeList = ([] as any[]).concat(firstCategoryList);

        const length = mergeList.length;

        let i = 0;
        while (!validate && i < length) {
            const cur = mergeList[i];
            const children = cur.children;
            if (!children || children!.length === 0) {
                validate = true;
            }
            i++;
        }

        if (validate || (category_level_two && category_level_two.length > 0)) {
            return Promise.resolve();
        }

        return Promise.reject('必须选择二级分类');
    }
    private checkLastCategory() {
        const {
            category_level_one = [],
            category_level_two = [],
            category_level_three = [],
            filterType,
        } = this.formRef.current!.getFieldsValue([
            'category_level_one',
            'category_level_two',
            'category_level_three',
            'filterType',
        ]);
        if (filterType === HotTaskFilterType.ByKeywords) {
            return Promise.resolve();
        }
        const firstIds =
            typeof category_level_one === 'string'
                ? category_level_one.split(',')
                : category_level_one.length === 1
                ? category_level_one[0].split(',')
                : category_level_one;
        const secondIds =
            typeof category_level_two === 'string'
                ? category_level_two.split(',')
                : category_level_two.length === 1
                ? category_level_two[0].split(',')
                : category_level_two;
        let validate = false;
        const { pddCategory = [] } = this.state;
        let firstCategoryList: any[] = [];
        let secondCategory: any[] = [];

        pddCategory.forEach(first => {
            if (firstIds.indexOf(first.platform_cate_id) > -1) {
                firstCategoryList.push(first);
            }
            first.children?.forEach(second => {
                if (secondIds.indexOf(second.platform_cate_id) > -1) {
                    secondCategory.push(second);
                }
            });
        });

        const mergeList = ([] as any[]).concat(firstCategoryList).concat(secondCategory);

        const length = mergeList.length;

        let i = 0;
        while (!validate && i < length) {
            const cur = mergeList[i];
            const children = cur.children;
            if (!children || children!.length === 0) {
                validate = true;
            }
            i++;
        }

        if (
            validate ||
            (category_level_three && category_level_three.length > 0) ||
            !category_level_two ||
            category_level_two.length === 0
        ) {
            return Promise.resolve();
        }
        return Promise.reject('必须选择三级分类');
    }

    render() {
        const { taskId } = this.props;
        const edit = taskId !== void 0;
        const {
            gatherLoading,
            groundLoading,
            queryLoading,
            status,
            failTimes,
            successTimes,
            categoryLoading,
            sortLoading,
            listSort = [],
            merchantSort = [],
        } = this.state;

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
                    className="form-help-absolute"
                    layout="horizontal"
                    autoComplete={'off'}
                    ref={this.formRef}
                    initialValues={{
                        range: HotTaskRange.fullStack,
                        task_type: TaskExecuteType.once,
                        taskIntervalType: TaskIntervalConfigType.day,
                        filterType: HotTaskFilterType.ByCategory,
                        day: 1,
                    }}
                >
                    <Form.Item
                        className="form-item"
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
                        <Input className="input-default" />
                    </Form.Item>
                    <Card
                        className="form-item"
                        title={<span className="form-required">任务范围：</span>}
                    >
                        <Form.Item validateTrigger={'onBlur'} name="range" noStyle={true}>
                            <Radio.Group onChange={this.taskRangeChange}>
                                <Radio className="block" value={HotTaskRange.fullStack}>
                                    全站
                                </Radio>
                                <Form.Item
                                    className="form-item form-item-inline"
                                    label={<Radio value={HotTaskRange.store}>指定店铺</Radio>}
                                    colon={false}
                                >
                                    <Form.Item
                                        noStyle={true}
                                        shouldUpdate={(prevValues, currentValues) =>
                                            prevValues.range !== currentValues.range
                                        }
                                    >
                                        {({ getFieldValue }) => {
                                            const range = getFieldValue('range');
                                            return (
                                                <Form.Item
                                                    className="form-required-absolute form-item-inline"
                                                    validateTrigger={'onBlur'}
                                                    label="店铺ID"
                                                    name="shopId"
                                                    rules={[
                                                        {
                                                            required: range === HotTaskRange.store,
                                                            message: '请输入店铺ID',
                                                        },
                                                    ]}
                                                >
                                                    <IntegerInput
                                                        min={0}
                                                        placeholder={'请输入'}
                                                        className="input-default input-handler"
                                                        disabled={range !== HotTaskRange.store}
                                                    />
                                                </Form.Item>
                                            );
                                        }}
                                    </Form.Item>
                                </Form.Item>
                            </Radio.Group>
                        </Form.Item>
                    </Card>
                    <Card className="form-item" title="指定类目/关键词：">
                        <div>
                            <Form.Item validateTrigger={'onBlur'} name="filterType" noStyle={true}>
                                <Radio.Group onChange={this.onFilterTypeChange}>
                                    <Form.Item
                                        noStyle={true}
                                        shouldUpdate={(prevValues, currentValues) =>
                                            prevValues.range !== currentValues.range
                                        }
                                    >
                                        {({ getFieldValue }) => {
                                            const range = getFieldValue('range');
                                            return (
                                                <Form.Item
                                                    className="form-item-inline"
                                                    label={
                                                        <Radio
                                                            disabled={range === HotTaskRange.store}
                                                            value={HotTaskFilterType.ByCategory}
                                                        />
                                                    }
                                                    colon={false}
                                                >
                                                    <Form.Item
                                                        noStyle={true}
                                                        shouldUpdate={(prevValues, currentValues) =>
                                                            prevValues.range !==
                                                                currentValues.range ||
                                                            prevValues.filterType !==
                                                                currentValues.filterType
                                                        }
                                                    >
                                                        {({ getFieldValue }) => {
                                                            const range = getFieldValue('range');
                                                            const filterType = getFieldValue(
                                                                'filterType',
                                                            );
                                                            const treData = this.getTreeNodeList();
                                                            return (
                                                                <Form.Item
                                                                    validateTrigger={'onBlur'}
                                                                    name="category_level_one"
                                                                    label="一级类目"
                                                                    className="form-item-horizon form-item-inline form-required-absolute"
                                                                    validateFirst={true}
                                                                    rules={[
                                                                        {
                                                                            required:
                                                                                filterType ===
                                                                                HotTaskFilterType.ByCategory,
                                                                            message:
                                                                                '必须选择一级分类',
                                                                        },
                                                                    ]}
                                                                >
                                                                    <TreeSelect
                                                                        onChange={
                                                                            this
                                                                                .onFirstCategoryChange
                                                                        }
                                                                        disabled={
                                                                            range ===
                                                                                HotTaskRange.store ||
                                                                            filterType ===
                                                                                HotTaskFilterType.ByKeywords
                                                                        }
                                                                        loading={categoryLoading}
                                                                        showArrow={true}
                                                                        className="select-default"
                                                                        showCheckedStrategy={
                                                                            'SHOW_PARENT'
                                                                        }
                                                                        showSearch={true}
                                                                        treeDefaultExpandAll={true}
                                                                        treeCheckable={true}
                                                                        treeData={treData}
                                                                    />
                                                                </Form.Item>
                                                            );
                                                        }}
                                                    </Form.Item>

                                                    <Form.Item
                                                        noStyle={true}
                                                        shouldUpdate={(prevValues, currentValues) =>
                                                            prevValues.category_level_one !==
                                                                currentValues.category_level_one ||
                                                            prevValues.range !==
                                                                currentValues.range ||
                                                            prevValues.filterType !==
                                                                currentValues.filterType
                                                        }
                                                    >
                                                        {({ getFieldValue }) => {
                                                            const levelOne = getFieldValue(
                                                                'category_level_one',
                                                            );
                                                            const range = getFieldValue('range');
                                                            const filterType = getFieldValue(
                                                                'filterType',
                                                            );
                                                            const treData = this.getTreeNodeList(
                                                                levelOne || [],
                                                            );

                                                            return (
                                                                <Form.Item
                                                                    validateTrigger={'onBlur'}
                                                                    name="category_level_two"
                                                                    label="二级类目"
                                                                    className="form-item-horizon form-item-inline form-required-absolute"
                                                                    rules={[
                                                                        {
                                                                            validator: this
                                                                                .checkSecondCategory,
                                                                        },
                                                                    ]}
                                                                >
                                                                    <TreeSelect
                                                                        disabled={
                                                                            range ===
                                                                                HotTaskRange.store ||
                                                                            filterType ===
                                                                                HotTaskFilterType.ByKeywords
                                                                        }
                                                                        loading={categoryLoading}
                                                                        className="select-default"
                                                                        onChange={
                                                                            this
                                                                                .onSecondCategoryChange
                                                                        }
                                                                        showArrow={true}
                                                                        showCheckedStrategy={
                                                                            'SHOW_PARENT'
                                                                        }
                                                                        showSearch={true}
                                                                        treeDefaultExpandAll={true}
                                                                        treeCheckable={true}
                                                                        treeData={treData}
                                                                    />
                                                                </Form.Item>
                                                            );
                                                        }}
                                                    </Form.Item>
                                                    <Form.Item
                                                        noStyle={true}
                                                        shouldUpdate={(prevValues, currentValues) =>
                                                            prevValues.category_level_two !==
                                                                currentValues.category_level_two ||
                                                            prevValues.range !==
                                                                currentValues.range ||
                                                            prevValues.filterType !==
                                                                currentValues.filterType
                                                        }
                                                    >
                                                        {({ getFieldValue }) => {
                                                            const levelOne = getFieldValue(
                                                                'category_level_one',
                                                            );
                                                            const range = getFieldValue('range');
                                                            const filterType = getFieldValue(
                                                                'filterType',
                                                            );
                                                            const parentLevel = getFieldValue(
                                                                'category_level_two',
                                                            );
                                                            const treData = this.getTreeNodeList(
                                                                levelOne || [],
                                                                parentLevel || [],
                                                            );
                                                            return (
                                                                <Form.Item
                                                                    validateTrigger={'onBlur'}
                                                                    name="category_level_three"
                                                                    label="三级类目"
                                                                    className="form-item-horizon form-item-inline form-required-absolute"
                                                                    rules={[
                                                                        {
                                                                            validator: this
                                                                                .checkLastCategory,
                                                                        },
                                                                    ]}
                                                                >
                                                                    <TreeSelect
                                                                        disabled={
                                                                            range ===
                                                                                HotTaskRange.store ||
                                                                            filterType ===
                                                                                HotTaskFilterType.ByKeywords
                                                                        }
                                                                        loading={categoryLoading}
                                                                        className="select-default"
                                                                        showArrow={true}
                                                                        showCheckedStrategy={
                                                                            'SHOW_PARENT'
                                                                        }
                                                                        showSearch={true}
                                                                        treeDefaultExpandAll={true}
                                                                        treeCheckable={true}
                                                                        treeData={treData}
                                                                    />
                                                                </Form.Item>
                                                            );
                                                        }}
                                                    </Form.Item>
                                                </Form.Item>
                                            );
                                        }}
                                    </Form.Item>

                                    <Form.Item
                                        className="form-item form-item-inline"
                                        label={<Radio value={HotTaskFilterType.ByKeywords} />}
                                        colon={false}
                                    >
                                        <Form.Item
                                            noStyle={true}
                                            shouldUpdate={(prevValues, currentValues) =>
                                                prevValues.filterType !== currentValues.filterType
                                            }
                                        >
                                            {({ getFieldValue }) => {
                                                const filterType = getFieldValue('filterType');
                                                return (
                                                    <Form.Item
                                                        className="form-item-horizon form-item-inline"
                                                        validateTrigger={'onBlur'}
                                                        name="keywords"
                                                        label="关&ensp;键&ensp;词"
                                                    >
                                                        <Input
                                                            disabled={
                                                                filterType ===
                                                                HotTaskFilterType.ByCategory
                                                            }
                                                            className="input-large"
                                                            spellCheck={'false'}
                                                            placeholder="iPhone XR，国行，白"
                                                        />
                                                    </Form.Item>
                                                );
                                            }}
                                        </Form.Item>
                                    </Form.Item>
                                </Radio.Group>
                            </Form.Item>
                        </div>
                        <div className="config-radio">
                            <Form.Item
                                noStyle={true}
                                shouldUpdate={(prevValues, currentValues) =>
                                    prevValues.range !== currentValues.range
                                }
                            >
                                {({ getFieldValue }) => {
                                    const range = getFieldValue('range');
                                    const list =
                                        range === HotTaskRange.fullStack ? listSort : merchantSort;
                                    return (
                                        <Form.Item
                                            validateTrigger={'onBlur'}
                                            name="sort_type"
                                            label="排序类型"
                                            className="form-item-horizon form-item-inline form-item"
                                        >
                                            <Select
                                                loading={sortLoading}
                                                className="select-default"
                                            >
                                                {list.map(sort => {
                                                    return (
                                                        <Option key={sort.value} value={sort.value}>
                                                            {sort.display}
                                                        </Option>
                                                    );
                                                })}
                                            </Select>
                                        </Form.Item>
                                    );
                                }}
                            </Form.Item>
                        </div>
                    </Card>
                    <Card className="form-item" title="设置商品条件：">
                        <div>
                            <Form.Item
                                className="form-item-horizon form-item-inline"
                                label="销&emsp;&emsp;量"
                            >
                                <Form.Item
                                    noStyle={true}
                                    validateTrigger={'onBlur'}
                                    name="sales_volume_min"
                                    rules={[
                                        {
                                            validator: this.checkMinSaleNum,
                                        },
                                    ]}
                                >
                                    <IntegerInput min={0} className="input-small input-handler" />
                                </Form.Item>
                                <span className="config-colon">-</span>
                                <Form.Item
                                    noStyle={true}
                                    validateTrigger={'onBlur'}
                                    name="sales_volume_max"
                                    rules={[
                                        {
                                            validator: this.checkMaxSaleNum,
                                        },
                                    ]}
                                >
                                    <IntegerInput min={0} className="input-small input-handler" />
                                </Form.Item>
                            </Form.Item>
                            <Form.Item
                                className="form-item-horizon form-item-inline"
                                label="价格范围(￥)"
                            >
                                <Form.Item
                                    noStyle={true}
                                    validateTrigger={'onBlur'}
                                    name="price_min"
                                    rules={[
                                        {
                                            validator: this.checkMinPrice,
                                        },
                                    ]}
                                >
                                    <IntegerInput min={0} className="input-small input-handler" />
                                </Form.Item>
                                <span className="config-colon">-</span>
                                <Form.Item
                                    noStyle={true}
                                    validateTrigger={'onBlur'}
                                    name="price_max"
                                    rules={[
                                        {
                                            validator: this.checkMaxPrice,
                                        },
                                    ]}
                                >
                                    <IntegerInput min={0} className="input-small input-handler" />
                                </Form.Item>
                            </Form.Item>
                        </div>
                        <div className="form-item">
                            <Form.Item
                                validateTrigger={'onBlur'}
                                name="grab_page_count"
                                label="爬取页数"
                                className="form-item-horizon form-item-inline"
                            >
                                <IntegerInput
                                    min={0}
                                    placeholder="默认值：20"
                                    className="config-input-pages input-handler"
                                />
                            </Form.Item>
                            <Form.Item
                                validateTrigger={'onBlur'}
                                name="grab_count_max"
                                className="form-item-horizon form-item-inline"
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
                            >
                                <IntegerInput
                                    placeholder="默认值：10000"
                                    min={0}
                                    className="config-input-count input-handler"
                                />
                            </Form.Item>
                        </div>
                    </Card>
                    <Card
                        className="form-item"
                        title={<span className="form-required">任务类型：</span>}
                    >
                        <Form.Item
                            validateTrigger={'onBlur'}
                            name="task_type"
                            className="form-item-inline"
                        >
                            <Radio.Group onChange={this.resetTaskTypeError}>
                                <Form.Item
                                    label={<Radio value={TaskExecuteType.once}>单次任务</Radio>}
                                    colon={false}
                                >
                                    <Form.Item
                                        noStyle={true}
                                        shouldUpdate={(prevValues, currentValues) =>
                                            prevValues.task_type !== currentValues.task_type
                                        }
                                    >
                                        {({ getFieldValue }) => {
                                            const taskType = getFieldValue('task_type');
                                            return (
                                                <Form.Item
                                                    validateTrigger={'onBlur'}
                                                    label="开始时间"
                                                    name="onceStartTime"
                                                    className="form-item-inline"
                                                    rules={[
                                                        {
                                                            validator: this.checkDate,
                                                        },
                                                    ]}
                                                >
                                                    <DatePicker
                                                        showTime={true}
                                                        disabled={taskType !== TaskExecuteType.once}
                                                        placeholder="立即开始"
                                                        disabledDate={this.disabledStartDate}
                                                    />
                                                </Form.Item>
                                            );
                                        }}
                                    </Form.Item>
                                </Form.Item>
                                <Form.Item
                                    label={<Radio value={TaskExecuteType.interval}>定时任务</Radio>}
                                    className="form-item-inline"
                                    colon={false}
                                >
                                    <Form.Item
                                        noStyle={true}
                                        shouldUpdate={(prevValues, currentValues) =>
                                            prevValues.task_type !== currentValues.task_type
                                        }
                                    >
                                        {({ getFieldValue }) => {
                                            const taskType = getFieldValue('task_type');
                                            return (
                                                <React.Fragment>
                                                    <Form.Item
                                                        label="开始时间"
                                                        validateTrigger={'onChange'}
                                                        className="form-required-absolute form-item-inline"
                                                        name="timerStartTime"
                                                        dependencies={['task_end_time']}
                                                        rules={[
                                                            {
                                                                required:
                                                                    taskType ===
                                                                    TaskExecuteType.interval,
                                                                message: '请选择开始时间',
                                                            },
                                                            {
                                                                validator: this.checkStartDate,
                                                            },
                                                        ]}
                                                    >
                                                        <DatePicker
                                                            showTime={true}
                                                            disabled={
                                                                taskType !==
                                                                TaskExecuteType.interval
                                                            }
                                                            disabledDate={this.disabledStartDate}
                                                        />
                                                    </Form.Item>
                                                    <Form.Item
                                                        validateTrigger={'onChange'}
                                                        label="结束时间"
                                                        name="task_end_time"
                                                        dependencies={['timerStartTime']}
                                                        className="form-required-absolute form-item form-item-inline"
                                                        rules={[
                                                            {
                                                                required:
                                                                    taskType ===
                                                                    TaskExecuteType.interval,
                                                                message: '请选择结束时间',
                                                            },
                                                            {
                                                                validator: this.checkEndDate,
                                                            },
                                                        ]}
                                                    >
                                                        <DatePicker
                                                            showTime={true}
                                                            disabled={
                                                                taskType !==
                                                                TaskExecuteType.interval
                                                            }
                                                            disabledDate={this.disabledEndDate}
                                                        />
                                                    </Form.Item>
                                                    <Form.Item
                                                        validateTrigger={'onBlur'}
                                                        label="任务间隔"
                                                        name="taskIntervalType"
                                                        className="form-required-absolute form-item-inline form-item"
                                                        required={
                                                            taskType === TaskExecuteType.interval
                                                        }
                                                    >
                                                        <Radio.Group
                                                            disabled={
                                                                taskType !==
                                                                TaskExecuteType.interval
                                                            }
                                                        >
                                                            <Radio
                                                                value={TaskIntervalConfigType.day}
                                                            >
                                                                <div className="inline-block vertical-middle">
                                                                    <Form.Item
                                                                        noStyle={true}
                                                                        shouldUpdate={(
                                                                            prevValues,
                                                                            currentValues,
                                                                        ) =>
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
                                                                                        noStyle={
                                                                                            true
                                                                                        }
                                                                                        validateTrigger={
                                                                                            'onBlur'
                                                                                        }
                                                                                        name="day"
                                                                                        rules={[
                                                                                            {
                                                                                                required:
                                                                                                    taskType ===
                                                                                                        TaskExecuteType.interval &&
                                                                                                    taskIntervalType ===
                                                                                                        TaskIntervalConfigType.day,
                                                                                                message:
                                                                                                    '请输入间隔天数',
                                                                                            },
                                                                                        ]}
                                                                                    >
                                                                                        <IntegerInput
                                                                                            min={0}
                                                                                            className="input-small input-handler"
                                                                                            disabled={
                                                                                                taskType !==
                                                                                                    TaskExecuteType.interval ||
                                                                                                taskIntervalType !==
                                                                                                    TaskIntervalConfigType.day
                                                                                            }
                                                                                        />
                                                                                    </Form.Item>
                                                                                    <span className="form-unit">
                                                                                        天
                                                                                    </span>
                                                                                </Form.Item>
                                                                            );
                                                                        }}
                                                                    </Form.Item>
                                                                </div>
                                                            </Radio>
                                                            <Radio
                                                                value={
                                                                    TaskIntervalConfigType.second
                                                                }
                                                            >
                                                                <div className="inline-block vertical-middle">
                                                                    <Form.Item
                                                                        noStyle={true}
                                                                        shouldUpdate={(
                                                                            prevValues,
                                                                            currentValues,
                                                                        ) =>
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
                                                                                        noStyle={
                                                                                            true
                                                                                        }
                                                                                        validateTrigger={
                                                                                            'onBlur'
                                                                                        }
                                                                                        name="second"
                                                                                        rules={[
                                                                                            {
                                                                                                required:
                                                                                                    taskType ===
                                                                                                        TaskExecuteType.interval &&
                                                                                                    taskIntervalType ===
                                                                                                        TaskIntervalConfigType.second,
                                                                                                message:
                                                                                                    '请输入间隔秒数',
                                                                                            },
                                                                                        ]}
                                                                                        className="inline-block"
                                                                                    >
                                                                                        <IntegerInput
                                                                                            min={0}
                                                                                            className="input-small input-handler"
                                                                                            disabled={
                                                                                                taskType !==
                                                                                                    TaskExecuteType.interval ||
                                                                                                taskIntervalType !==
                                                                                                    TaskIntervalConfigType.second
                                                                                            }
                                                                                        />
                                                                                    </Form.Item>
                                                                                    <span className="form-unit">
                                                                                        秒
                                                                                    </span>
                                                                                </Form.Item>
                                                                            );
                                                                        }}
                                                                    </Form.Item>
                                                                </div>
                                                            </Radio>
                                                        </Radio.Group>
                                                    </Form.Item>
                                                </React.Fragment>
                                            );
                                        }}
                                    </Form.Item>
                                </Form.Item>
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

export default HotGather;

import React, { RefObject } from 'react';
import { BindAll } from 'lodash-decorators';
import { Button, DatePicker, Input, Radio, Select, Spin, Tooltip, Form, TreeSelect } from 'antd';
import '@/styles/config.less';
import '@/styles/form.less';
import '@/styles/modal.less';
import { showFailureModal } from '@/pages/task/components/modal/GatherFailureModal';
import { addPddHotTask, queryCategory, querySortCondition, queryTaskDetail } from '@/services/task';
import { showSuccessModal } from '@/pages/task/components/modal/GatherSuccessModal';
import moment, { Moment } from 'moment';
import { isNull } from '@/utils/validate';
import { FormInstance } from 'antd/es/form';
import { QuestionCircleOutlined } from '@ant-design/icons/lib';
import { RadioChangeEvent } from 'antd/lib/radio/interface';
import {
    HotTaskRange,
    TaskExecuteType,
    TaskIntervalConfigType,
    HotTaskFilterType,
} from '@/enums/StatusEnum';
import IntegerInput from '@/components/IntegerInput';
import locale from 'antd/es/date-picker/locale/zh_CN';
import { TreeNodeNormal } from 'antd/es/tree/Tree';
import { EmptyObject } from '@/enums/ConfigEnum';
import {
    IHotTaskBody,
    IPDDCategoryResponse,
    IPDDSortItem,
    ITaskDetailInfo,
} from '@/interface/ITask';
import { dateToUnix } from '@/utils/date';
import { scrollToFirstError } from '@/utils/common';

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

declare interface IHotGatherState {
    gatherLoading: boolean;
    groundLoading: boolean;
    queryLoading: boolean;

    pddCategory: IPDDCategoryResponse;
    categoryLoading: boolean;
    listSort: Array<IPDDSortItem>;
    merchantSort: Array<IPDDSortItem>;
    sortLoading: boolean;
    firstTreeData: Array<TreeNodeNormal>;
    middleTreeData: Array<TreeNodeNormal>;
    lastTreeData: Array<TreeNodeNormal>;
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
            firstTreeData: [],
            middleTreeData: [],
            lastTreeData: [],
        };
    }

    componentDidMount(): void {
        const { taskId } = this.props;
        if (taskId !== void 0) {
            Promise.all([this.queryDetail(taskId), this.queryCategory()]).then(
                ([{ category_level_one = [], category_level_two = [] }, data]) => {
                    const firstTreeData = this.getTreeNodeList(data);
                    const middleTreeData = this.getTreeNodeList(data, category_level_one);
                    const lastTreeData = this.getTreeNodeList(
                        data,
                        category_level_one,
                        category_level_two,
                    );
                    this.setState({
                        categoryLoading: false,
                        pddCategory: data,
                        firstTreeData,
                        middleTreeData,
                        lastTreeData,
                    });
                },
            );
        } else {
            // query category
            this.initCategory();
        }
        this.querySortCondition();
    }

    private queryDetail(taskId: number) {
        return queryTaskDetail(taskId)
            .then(({ data: { task_detail_info = {} } = {} } = EmptyObject) => {
                const initValues = this.convertDetail(task_detail_info as ITaskDetailInfo);
                this.formRef.current?.setFieldsValue({
                    ...initValues,
                });
                this.setState({
                    queryLoading: false,
                });
                return initValues;
            })
            .catch(() => {
                this.setState({
                    queryLoading: false,
                });
                return {} as any;
            });
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
                            this.formRef.current?.setFieldsValue({
                                sort_type: listSort[0]?.value,
                            });
                        } else {
                            this.formRef.current?.setFieldsValue({
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
        return queryCategory()
            .then(({ data }) => {
                this.setState({
                    categoryLoading: false,
                    pddCategory: data,
                });
                return data;
            })
            .catch(() => {
                this.setState({
                    categoryLoading: false,
                });
                return [];
            });
    }
    private initCategory() {
        this.queryCategory().then(data => {
            if (data && data.length > 0) {
                // calc treeData
                const firstTreeData = this.getTreeNodeList(data);
                const firstInitId = firstTreeData[0]?.key ?? '';
                const middleTreeData = this.getTreeNodeList(data, [firstInitId]);
                const middleInitId = middleTreeData[0]?.key ?? '';
                const lastTreeData = this.getTreeNodeList(data, [firstInitId], [middleInitId]);
                const lastInitId = lastTreeData[0]?.key ?? '';
                this.setState({
                    categoryLoading: false,
                    pddCategory: data,
                    firstTreeData,
                    middleTreeData,
                    lastTreeData,
                });
                this.formRef.current?.setFieldsValue({
                    category_level_one: firstInitId ? [firstInitId] : [],
                    category_level_two: middleInitId ? [middleInitId] : [],
                    category_level_three: lastInitId ? [lastInitId] : [],
                });
            }
        });
    }
    private getCategoryIdList(categoryIds?: string[]) {
        return categoryIds && categoryIds.length === 1 ? categoryIds[0].split(',') : categoryIds;
    }

    private getTreeNodeList(
        pddCategory: IPDDCategoryResponse,
        firstFilterIds?: string[],
        secondFilterIds?: string[],
    ) {
        // 不能调用setFieldsValue方法重置，会重复render
        if (pddCategory.length === 0) {
            return [];
        }
        let idArr: string[] = [];
        let childrenArr: any[] = [];
        let ids = '';
        const firstFilterIdArray = this.getCategoryIdList(firstFilterIds);
        const secondFilterIdArray = this.getCategoryIdList(secondFilterIds);
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
            const hasChildren = ids.length > 0;
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
            const hasChildren = ids.length > 0;
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

    private convertDetail(info: ITaskDetailInfo) {
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
            task_start_time:
                taskType === TaskExecuteType.once && task_start_time
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
                    .then(({ data = EmptyObject } = EmptyObject) => {
                        this.formRef.current?.resetFields();
                        showSuccessModal(data);
                    })
                    .catch(() => {
                        showFailureModal();
                    })
                    .finally(() => {
                        this.setState({
                            gatherLoading: false,
                            groundLoading: false,
                        });
                    });
            })
            .catch(({ errorFields }) => {
                scrollToFirstError(this.formRef.current!, errorFields);
            });
    }

    private onStartGather() {
        this.onGather();
    }

    private onAcquisitionRack() {
        this.onGather(true);
    }

    private onFirstCategoryChange(value: string[]) {
        // 重新计算level_2,level_3 数据
        const levelOne = value || [];
        const middleTreeData = this.getTreeNodeList(this.state.pddCategory, levelOne);
        const middleInitId = middleTreeData[0]?.key || '';
        const lastTreeData = this.getTreeNodeList(this.state.pddCategory, levelOne, [middleInitId]);
        const lastInitId = lastTreeData[0]?.key || '';
        this.setState({
            middleTreeData,
            lastTreeData,
        });
        this.formRef.current?.setFieldsValue({
            category_level_two: middleInitId ? [middleInitId] : [],
            category_level_three: lastInitId ? [lastInitId] : [],
        });
    }

    private onMiddleCategoryChange(value: string[]) {
        // 重新计算level_2,level_3 数据

        const middleLevel = value || [];
        const firstInitId = this.formRef.current!.getFieldValue('category_level_one') || [];

        const lastTreeData = this.getTreeNodeList(this.state.pddCategory, firstInitId, middleLevel);
        const lastInitId = lastTreeData[0]?.key || '';
        this.setState({
            lastTreeData,
        });
        this.formRef.current?.setFieldsValue({
            category_level_three: lastInitId ? [lastInitId] : [],
        });
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
        // 重置所有管控字段
        this.formRef.current?.resetFields([
            'task_end_time',
            'task_start_time',
            'day',
            'second',
            'taskIntervalType',
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
            this.formRef.current?.resetFields(['shopId']);
            this.formRef.current?.setFieldsValue({
                sort_type: this.state.listSort[0].value,
            });
        } else {
            this.formRef.current?.resetFields([
                'category_level_one',
                'category_level_two',
                'category_level_three',
            ]);
            this.formRef.current?.setFieldsValue({
                filterType: HotTaskFilterType.ByKeywords,
                sort_type: this.state.merchantSort[0].value,
            });
        }
    }

    private onFilterTypeChange(value: number) {
        if (value === HotTaskFilterType.ByKeywords) {
            this.formRef.current?.resetFields([
                'category_level_one',
                'category_level_two',
                'category_level_three',
                'keywords',
            ]);
        } else {
            // 重新计算
            const data = this.state.pddCategory;
            const firstTreeData = this.getTreeNodeList(data);
            const firstInitId = firstTreeData[0]?.key ?? '';
            const middleTreeData = this.getTreeNodeList(data, [firstInitId]);
            const middleInitId = middleTreeData[0]?.key ?? '';
            const lastTreeData = this.getTreeNodeList(data, [firstInitId], [middleInitId]);
            const lastInitId = lastTreeData[0]?.key ?? '';
            this.setState({
                firstTreeData,
                middleTreeData,
                lastTreeData,
            });
            this.formRef.current?.setFieldsValue({
                category_level_one: firstInitId ? [firstInitId] : [],
                category_level_two: middleInitId ? [middleInitId] : [],
                category_level_three: lastInitId ? [lastInitId] : [],
            });
        }
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
            categoryLoading,
            sortLoading,
            listSort = [],
            merchantSort = [],
            firstTreeData,
            middleTreeData,
            lastTreeData,
        } = this.state;

        return (
            <Spin spinning={queryLoading} tip="Loading...">
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
                        grab_page_count: 20,
                        grab_count_max: 10000,
                    }}
                >
                    <Form.Item
                        className="form-item form-item-inline"
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
                        label="任务范围"
                        name="range"
                        className="form-item form-item-inline form-item-horizon"
                        required={true}
                    >
                        <Radio.Group onChange={this.taskRangeChange}>
                            <Radio value={HotTaskRange.fullStack}>全站</Radio>
                            {/*<Radio value={HotTaskRange.store}>指定店铺</Radio>*/}
                        </Radio.Group>
                    </Form.Item>
                    {/*<Form.Item
                        noStyle={true}
                        shouldUpdate={(prevValues, currentValues) =>
                            prevValues.range !== currentValues.range
                        }
                    >
                        {({ getFieldValue }) => {
                            const range = getFieldValue('range');
                            const required = range === HotTaskRange.store;
                            return (
                                <Form.Item
                                    className="form-required-absolute form-item form-item-inline form-item-horizon"
                                    validateTrigger={'onBlur'}
                                    label="店铺ID"
                                    name="shopId"
                                    rules={[
                                        {
                                            required: required,
                                            message: '请输入店铺ID',
                                        },
                                    ]}
                                >
                                    <IntegerInput
                                        min={0}
                                        placeholder={'请输入'}
                                        className="input-default input-handler"
                                        disabled={!required}
                                    />
                                </Form.Item>
                            );
                        }}
                    </Form.Item>*/}

                    <Form.Item
                        noStyle={true}
                        shouldUpdate={(prevValues, currentValues) =>
                            prevValues.range !== currentValues.range
                        }
                    >
                        {({ getFieldValue }) => {
                            const range = getFieldValue('range');
                            const list = range === HotTaskRange.fullStack ? listSort : merchantSort;
                            return (
                                <Form.Item
                                    validateTrigger={'onBlur'}
                                    name="sort_type"
                                    label="排序类型"
                                    className="form-item-horizon form-item-inline form-item"
                                    rules={[
                                        {
                                            required: true,
                                            message: '请选择排序类型',
                                        },
                                    ]}
                                >
                                    <Select loading={sortLoading} className="picker-default">
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
                    <Form.Item
                        label="爬虫条件"
                        name="filterType"
                        className="form-item form-item-inline"
                        rules={[
                            {
                                required: true,
                                message: '请选择爬虫条件',
                            },
                        ]}
                    >
                        <Select onChange={this.onFilterTypeChange} className="picker-default">
                            <Select.Option value={HotTaskFilterType.ByCategory}>
                                指定分类
                            </Select.Option>
                            <Select.Option value={HotTaskFilterType.ByKeywords}>
                                指定关键词
                            </Select.Option>
                        </Select>
                    </Form.Item>

                    <Form.Item
                        noStyle={true}
                        shouldUpdate={(prevValues, currentValues) =>
                            prevValues.filterType !== currentValues.filterType
                        }
                    >
                        {({ getFieldValue }) => {
                            const filterType = getFieldValue('filterType');
                            if (filterType === HotTaskFilterType.ByKeywords) {
                                return (
                                    <Form.Item
                                        className="form-item form-item-inline"
                                        validateTrigger={'onBlur'}
                                        name="keywords"
                                        label="关&ensp;键&ensp;词"
                                    >
                                        <Input
                                            className="input-large"
                                            spellCheck={'false'}
                                            placeholder="iPhone XR，国行，白"
                                        />
                                    </Form.Item>
                                );
                            }
                            return (
                                <Form.Item noStyle={true}>
                                    <Form.Item
                                        validateTrigger={'onBlur'}
                                        name="category_level_one"
                                        label="一级类目"
                                        className="form-item form-item-horizon form-item-inline config-hot-category"
                                        validateFirst={true}
                                        rules={[
                                            {
                                                required: true,
                                                message: '必须选择一级分类',
                                            },
                                        ]}
                                    >
                                        <TreeSelect
                                            treeNodeFilterProp="title"
                                            onChange={this.onFirstCategoryChange}
                                            loading={categoryLoading}
                                            showArrow={true}
                                            className="picker-default"
                                            showCheckedStrategy={'SHOW_PARENT'}
                                            showSearch={true}
                                            treeDefaultExpandAll={true}
                                            treeCheckable={true}
                                            treeData={firstTreeData}
                                            maxTagCount={10}
                                        />
                                    </Form.Item>
                                    <Form.Item
                                        validateTrigger={'onBlur'}
                                        name="category_level_two"
                                        label="二级类目"
                                        className="form-item form-item-horizon form-item-inline form-required-absolute config-hot-category"
                                        rules={[
                                            {
                                                validator: this.checkSecondCategory,
                                            },
                                        ]}
                                    >
                                        <TreeSelect
                                            treeNodeFilterProp="title"
                                            loading={categoryLoading}
                                            className="picker-default"
                                            onChange={this.onMiddleCategoryChange}
                                            showArrow={true}
                                            showCheckedStrategy={'SHOW_PARENT'}
                                            showSearch={true}
                                            treeDefaultExpandAll={true}
                                            treeCheckable={true}
                                            treeData={middleTreeData}
                                            maxTagCount={10}
                                        />
                                    </Form.Item>
                                    <Form.Item
                                        validateTrigger={'onBlur'}
                                        name="category_level_three"
                                        label="三级类目"
                                        className="form-item form-item-horizon form-item-inline form-required-absolute"
                                        rules={[
                                            {
                                                validator: this.checkLastCategory,
                                            },
                                        ]}
                                    >
                                        <TreeSelect
                                            treeNodeFilterProp="title"
                                            loading={categoryLoading}
                                            className="picker-default"
                                            showArrow={true}
                                            showCheckedStrategy={'SHOW_PARENT'}
                                            showSearch={true}
                                            treeDefaultExpandAll={true}
                                            treeCheckable={true}
                                            treeData={lastTreeData}
                                            maxTagCount={10}
                                        />
                                    </Form.Item>
                                </Form.Item>
                            );
                        }}
                    </Form.Item>
                    <div>
                        <Form.Item
                            validateTrigger={'onBlur'}
                            name="grab_page_count"
                            label="爬取页数"
                            className="form-item form-item-horizon form-item-inline"
                            rules={[
                                {
                                    required: true,
                                    message: '请输入爬取页数',
                                },
                            ]}
                        >
                            <IntegerInput
                                positive={true}
                                className="picker-default input-handler"
                            />
                        </Form.Item>
                        <Form.Item
                            validateTrigger={'onBlur'}
                            name="grab_count_max"
                            className="form-item form-item-horizon form-item-inline"
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
                            <IntegerInput
                                positive={true}
                                className="picker-default input-handler"
                            />
                        </Form.Item>
                    </div>
                    <div>
                        <div className="flex-inline flex-align form-item">
                            <Form.Item
                                label="销量区间"
                                required={true}
                                className="form-item-inline flex-inline form-required-hide"
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
                                className="form-item-inline form-item-horizon"
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
                        </div>
                        <div className="flex-inline flex-align form-item">
                            <Form.Item
                                label="价格区间(￥)"
                                validateTrigger={'onBlur'}
                                name="price_min"
                                required={true}
                                className="form-item-inline flex-inline form-required-hide"
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
                                className="form-item-inline form-item-horizon"
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
                        </div>
                    </div>
                    <Form.Item
                        label="任务周期"
                        name="task_type"
                        className="form-item form-item-inline"
                        required={true}
                    >
                        <Select onChange={this.resetTaskTypeError} className="picker-default">
                            <Select.Option value={TaskExecuteType.once}>单次任务</Select.Option>
                            <Select.Option value={TaskExecuteType.interval}>定时任务</Select.Option>
                        </Select>
                    </Form.Item>

                    <Form.Item
                        noStyle={true}
                        shouldUpdate={(prevValues, currentValues) =>
                            prevValues.task_type !== currentValues.task_type
                        }
                    >
                        {({ getFieldValue }) => {
                            const taskType = getFieldValue('task_type');
                            if (taskType === TaskExecuteType.once) {
                                return (
                                    <Form.Item
                                        validateTrigger={'onBlur'}
                                        label="开始时间"
                                        name="task_start_time"
                                        className="form-item-inline form-item form-required-hide"
                                        required={true}
                                        rules={[
                                            {
                                                validator: this.checkDate,
                                            },
                                        ]}
                                    >
                                        <DatePicker
                                            className="picker-default"
                                            locale={locale}
                                            showTime={true}
                                            disabled={taskType !== TaskExecuteType.once}
                                            placeholder="立即开始"
                                            disabledDate={this.disabledStartDate}
                                        />
                                    </Form.Item>
                                );
                            }
                            return (
                                <React.Fragment>
                                    <div>
                                        <Form.Item
                                            label="开始时间"
                                            validateTrigger={'onChange'}
                                            className="form-item-inline form-item form-item-horizon"
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
                                                locale={locale}
                                                showTime={true}
                                                disabledDate={this.disabledStartDate}
                                            />
                                        </Form.Item>
                                        <Form.Item
                                            validateTrigger={'onChange'}
                                            label="结束时间"
                                            name="task_end_time"
                                            dependencies={['timerStartTime']}
                                            className="form-item form-item-inline form-item-horizon"
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
                                                                                message:
                                                                                    '请输入间隔天数',
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
                                                                                message:
                                                                                    '请输入间隔秒数',
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
                                </React.Fragment>
                            );
                        }}
                    </Form.Item>

                    <div className="form-item">
                        <Button
                            loading={gatherLoading}
                            type="primary"
                            className="btn-default"
                            onClick={this.onStartGather}
                        >
                            {edit ? '创建新采集任务' : '开始采集'}
                        </Button>
                        {/*    <Button
                            loading={groundLoading}
                            type="primary"
                            className="btn-default"
                            onClick={this.onAcquisitionRack}
                        >
                            {edit ? '创建任务且上架' : '一键采集上架'}
                        </Button>*/}
                    </div>
                </Form>
            </Spin>
        );
    }
}

export default HotGather;

import React, { RefObject, useCallback } from 'react';
import { Bind } from 'lodash-decorators';
import {
    Button,
    Card,
    DatePicker,
    Input,
    InputNumber,
    Modal,
    Radio,
    Select,
    Spin,
    Tooltip,
    Form
} from 'antd';
import '@/styles/config.less';
import '@/styles/form.less';
import '@/styles/modal.less';
import GatherFailureModal from '@/pages/task/components/GatherFailureModal';
import { TaskIntervalType, TaskRange, TaskStatus, TaskStatusList, TaskType } from '@/enums/ConfigEnum';
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
import { validateNull } from '@/utils/validate';
import { FormInstance } from 'antd/es/form';
import { QuestionCircleOutlined } from '@ant-design/icons/lib';


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




class HotGather extends React.PureComponent<IHotGatherProps,IHotGatherState>{
    private formRef:RefObject<FormInstance> = React.createRef();
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
                const { success, fail,status } = initValues;
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
        const taskType = (task_type as any) === "单次任务"?TaskType.once:TaskType.interval;
        const isDay = task_interval_seconds && task_interval_seconds % 86400 === 0;
        return {
            range: range === TaskRange.fullStack ? range : TaskRange.store,
            shopId: range !== TaskRange.fullStack ? range : undefined,
            task_end_time: taskType===TaskType.interval && task_end_time ? moment(task_end_time*1000) : undefined,
            taskIntervalType: task_interval_seconds
                ? isDay
                    ? TaskIntervalType.day
                    : TaskIntervalType.second
                : TaskIntervalType.day,
            onceStartTime:
                taskType === TaskType.once && task_start_time
                    ? moment(task_start_time*1000)
                    : undefined,
            timerStartTime:
                taskType === TaskType.interval && task_start_time
                    ? moment(task_start_time*1000)
                    : undefined,
            task_type:taskType,
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
            task_end_time: task_type === TaskType.interval?task_end_time?.unix() ?? undefined:undefined,
        };
    }

    @Bind
    private onGather(is_upper_shelf: boolean = false) {
        this.formRef.current!.validateFields().then((values: any) => {
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
        }).catch(({errorFields})=>{
            this.formRef.current!.scrollToField(errorFields[0].name,{
                scrollMode: 'if-needed',
                behavior: (actions) => {
                    if(!actions || actions.length ===0){
                        return;
                    }
                    const [{top}] = actions;
                    const to = Math.max(top - 80,0);
                    window.scrollTo({
                        top:to,
                        behavior:"smooth"
                    });
                },
            })
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
        this.formRef.current!.resetFields(['category_level_two']);
    }

    @Bind
    private checkMinSaleNum(rule:any,value:any){
        const { sales_volume_max } = this.formRef.current!.getFieldsValue(["sales_volume_max"]);
        if(!validateNull(sales_volume_max) && !validateNull(value) && Number(value) > Number(sales_volume_max)){
            return Promise.reject("最小销量不能大于最大销量");
        }
        return Promise.resolve();
    }

    @Bind
    private checkMaxSaleNum(rule:any,value:any){
        const { sales_volume_min } = this.formRef.current!.getFieldsValue(["sales_volume_min"]);
        if(!validateNull(sales_volume_min) && !validateNull(value) && Number(value) < Number(sales_volume_min)){
            return Promise.reject("最大销量不能小于最小销量");
        }
        return Promise.resolve();
    }

    @Bind
    private checkMinPrice(rule:any,value:any){
        const { price_max } = this.formRef.current!.getFieldsValue(["price_max"]);
        if(!validateNull(price_max) && !validateNull(value) && Number(value) > Number(price_max)){
            return Promise.reject("最小价格不能大于最大价格");
        }
        return Promise.resolve();
    }

    @Bind
    private checkMaxPrice(rule:any,value:any){
        const { price_min } = this.formRef.current!.getFieldsValue(["price_min"]);
        if(!validateNull(price_min) && !validateNull(value) && Number(value) < Number(price_min)){
            return Promise.reject("最大价格不能小于最小价格");
        }
        return Promise.resolve();
    }

    @Bind
    private disabledStartDate(startTime: Moment | null){
        const endTime = this.formRef.current!.getFieldValue('task_end_time');
        if (!startTime) {
            return false;
        }
        const startValue = startTime.valueOf();
        const currentDay = moment().startOf('day');
        if (!endTime) {
            return startTime < currentDay;
        }
        return startValue > endTime.endOf('day') || startTime < currentDay;
    }

    @Bind
    private disabledEndDate(endTime: Moment | null){
        const startTime = this.formRef.current!.getFieldValue('timerStartTime');
        if (!endTime) {
            return false;
        }
        const endValue = endTime.valueOf();
        const currentDay = moment().startOf('day');
        if (!startTime) {
            return endTime < currentDay;
        }
        return startTime.startOf('day') > endValue || endTime < currentDay;
    }

    @Bind
    private checkDate(type:any,value:Moment){
        const taskType = this.formRef.current!.getFieldValue("task_type");
        if(!value || taskType === TaskType.interval){
            return Promise.resolve();
        }
        const now = moment();
        if(value.isAfter(now)){
            return Promise.resolve();
        }else{
            return Promise.reject("开始时间不能早于当前时间");
        }
    }

    @Bind
    private checkStartDate(type:any,value:Moment){
        const taskType = this.formRef.current!.getFieldValue("task_type");
        if(!value || taskType === TaskType.once){
            return Promise.resolve();
        }
        const endDate = this.formRef.current!.getFieldValue("task_end_time");
        const now = moment();
        if(value.isAfter(now)){
            if(endDate && value.isSameOrAfter(endDate)){
                return Promise.reject("开始时间不能晚于结束时间");
            }
            return Promise.resolve();
        }else{
            return Promise.reject("开始时间不能早于当前时间");
        }
    }

    @Bind
    private checkEndDate(type:any,value:Moment){
        const taskType = this.formRef.current!.getFieldValue("task_type");
        if(!value || taskType === TaskType.once){
            return Promise.resolve();
        }
        const startDate = this.formRef.current!.getFieldValue("timerStartTime");
        const now = moment();
        if(value.isAfter(now)){
            if(startDate && value.isSameOrBefore(startDate)){
                return Promise.reject("结束时间不能早于开始时间");
            }
            return Promise.resolve();
        }else{
            return Promise.reject("结束时间不能早于当前时间");
        }
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
            pddCategory = [],
            categoryLoading,
            sortLoading,
            sortCondition = [],
        } = this.state;

        return (
            <Spin spinning={queryLoading} tip="Loading...">
                {edit && (
                    <React.Fragment>
                        <div className="config-task-label">任务ID：{taskId}</div>
                        <div className="config-task-label">任务状态: {TaskStatusList[status??""]}</div>
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
                        range:TaskRange.fullStack,
                        task_type:TaskType.once,
                        taskIntervalType:TaskIntervalType.day
                    }}
                >
                    <Form.Item
                        className="form-item"
                        validateTrigger={'onBlur'}
                        name="task_name"
                        label="任务名称"
                        rules={[{
                            required:true,
                            message:"请输入任务名称"
                        }]}
                    >
                        <Input className="input-default" />
                    </Form.Item>
                    <Card
                        className="form-item"
                        title={<span className="form-required">任务范围：</span>}
                    >
                        <Form.Item
                            validateTrigger={'onBlur'}
                            name="range"
                            noStyle={true}
                        >
                            <Radio.Group>
                                <Radio className="block" value={TaskRange.fullStack}>
                                    全站
                                </Radio>
                                <Form.Item className="form-item form-item-inline" label={<Radio value={TaskRange.store}>指定店铺</Radio>} colon={false}>
                                    <Form.Item
                                        noStyle={true}
                                        shouldUpdate={
                                            (prevValues, currentValues) =>
                                                prevValues.range !== currentValues.range
                                        }
                                    >
                                        {
                                            ({getFieldValue})=>{
                                                const range = getFieldValue("range");
                                                return (
                                                    <Form.Item
                                                        className="form-required-absolute form-item-inline"
                                                        validateTrigger={'onBlur'}
                                                        label="店铺ID"
                                                        name="shopId"
                                                        rules={[
                                                            {
                                                                required: range === TaskRange.store,
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
                                                )
                                            }
                                        }
                                    </Form.Item>
                                </Form.Item>
                            </Radio.Group>
                        </Form.Item>
                    </Card>
                    <Card className="form-item" title="指定类目/关键词：">
                        <div>
                            <Form.Item
                                validateTrigger={'onBlur'}
                                name="category_level_one"
                                label="一级类目"
                                className="form-item-horizon"
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
                                noStyle={true}
                                shouldUpdate={
                                    (prevValues, currentValues) =>
                                        prevValues.category_level_one !== currentValues.category_level_one
                                }
                            >
                                {
                                    ({getFieldValue})=>{
                                        const levelOne = getFieldValue("category_level_one");
                                        const childCategory =
                                            pddCategory.find(category => {
                                                return category.platform_cate_id === levelOne;
                                            })?.children || [];
                                        return (
                                            <Form.Item
                                                validateTrigger={'onBlur'}
                                                name="category_level_two"
                                                label="二级类目"
                                                className="form-item-horizon"
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
                                        )
                                    }
                                }
                            </Form.Item>
                            <Form.Item
                                validateTrigger={'onBlur'}
                                name="sort_type"
                                label="排序类型"
                                className="form-item-horizon"
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
                        </div>
                        <Form.Item
                            className="form-item-inline"
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
                    </Card>
                    <Card className="form-item" title="设置商品条件：">
                        <div>
                            <Form.Item className="form-item-horizon form-item-inline" label="销&emsp;&emsp;量">
                                <Form.Item
                                    noStyle={true}
                                    validateTrigger={'onBlur'}
                                    name="sales_volume_min"
                                    rules={[{
                                        validator:this.checkMinSaleNum
                                    }]}
                                >
                                    <InputNumber
                                        min={0}
                                        className="input-small input-handler"
                                        formatter={numberFormatter}
                                    />
                                </Form.Item>
                                <span className="config-colon">-</span>
                                <Form.Item
                                    noStyle={true}
                                    validateTrigger={'onBlur'}
                                    name="sales_volume_max"
                                    rules={[{
                                        validator:this.checkMaxSaleNum
                                    }]}
                                >
                                    <InputNumber
                                        min={0}
                                        className="input-small input-handler"
                                        formatter={numberFormatter}
                                    />
                                </Form.Item>
                            </Form.Item>
                            <Form.Item className="form-item-horizon form-item-inline" label="价格范围(￥)">
                                <Form.Item
                                    noStyle={true}
                                    validateTrigger={'onBlur'}
                                    name="price_min"
                                    rules={[{
                                        validator:this.checkMinPrice
                                    }]}
                                >
                                    <InputNumber
                                        min={0}
                                        className="input-small input-handler"
                                        formatter={numberFormatter}
                                    />
                                </Form.Item>
                                <span className="config-colon">-</span>
                                <Form.Item
                                    noStyle={true}
                                    validateTrigger={'onBlur'}
                                    name="price_max"
                                    rules={[{
                                        validator:this.checkMaxPrice
                                    }]}
                                >
                                    <InputNumber
                                        min={0}
                                        className="input-small input-handler"
                                        formatter={numberFormatter}
                                    />
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
                                <InputNumber
                                    min={0}
                                    className="config-input-pages input-handler"
                                    formatter={numberFormatter}
                                    width={200}
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
                                            <QuestionCircleOutlined className="config-ques"/>
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
                        className="form-item"
                        title={<span className="form-required">任务类型：</span>}
                    >
                        <Form.Item
                            validateTrigger={'onBlur'}
                            name="task_type"
                            className="form-item-inline"
                        >
                            <Radio.Group>
                                <Form.Item label={<Radio value={TaskType.once}>单次任务</Radio>} colon={false}>
                                    <Form.Item
                                        noStyle={true}
                                        shouldUpdate={
                                            (prevValues, currentValues) =>
                                                prevValues.task_type !== currentValues.task_type
                                        }
                                    >
                                        {
                                            ({getFieldValue})=>{
                                                const taskType = getFieldValue("task_type");
                                                return (
                                                    <Form.Item
                                                        validateTrigger={'onBlur'}
                                                        label="开始时间"
                                                        name="onceStartTime"
                                                        className="form-item-inline"
                                                        rules={[{
                                                            validator:this.checkDate
                                                        }]}
                                                    >
                                                        <DatePicker
                                                            showTime={true}
                                                            disabled={taskType !== TaskType.once}
                                                            placeholder="立即开始"
                                                            disabledDate={this.disabledStartDate}
                                                        />
                                                    </Form.Item>
                                                )
                                            }
                                        }
                                    </Form.Item>
                                </Form.Item>
                                <Form.Item label={<Radio value={TaskType.interval}>定时任务</Radio>} className="form-item-inline" colon={false}>
                                    <Form.Item
                                        noStyle={true}
                                        shouldUpdate={
                                            (prevValues, currentValues) =>
                                                prevValues.task_type !== currentValues.task_type
                                        }
                                    >
                                        {
                                            ({ getFieldValue }) => {
                                                const taskType = getFieldValue("task_type");
                                                return (
                                                    <React.Fragment>
                                                        <Form.Item
                                                            label="开始时间"
                                                            validateTrigger={'onChange'}
                                                            className="form-required-absolute"
                                                            name="timerStartTime"
                                                            rules={[{
                                                                required:taskType === TaskType.interval,
                                                                message:"请选择开始时间",
                                                            },{
                                                                validator:this.checkStartDate
                                                            }]}
                                                        >
                                                            <DatePicker
                                                                showTime={true}
                                                                disabled={taskType !== TaskType.interval}
                                                                disabledDate={this.disabledStartDate}
                                                            />
                                                        </Form.Item>
                                                        <Form.Item
                                                            validateTrigger={'onChange'}
                                                            label="结束时间"
                                                            name="task_end_time"
                                                            className="form-required-absolute form-item"
                                                            rules={[{
                                                                required: taskType === TaskType.interval,
                                                                message: "请选择结束时间"
                                                            },{
                                                                validator:this.checkEndDate
                                                            }]}
                                                        >
                                                            <DatePicker
                                                                showTime={true}
                                                                disabled={taskType !== TaskType.interval}
                                                                disabledDate={this.disabledEndDate}
                                                            />
                                                        </Form.Item>
                                                        <Form.Item
                                                            validateTrigger={'onBlur'}
                                                            label="任务间隔"
                                                            name="taskIntervalType"
                                                            className="form-required-absolute form-item-inline form-item"
                                                            required={taskType === TaskType.interval}
                                                        >
                                                            <Radio.Group disabled={taskType !== TaskType.interval}>
                                                                <Radio value={TaskIntervalType.day}>
                                                                    <div className="inline-block vertical-middle">
                                                                        <Form.Item
                                                                            noStyle={true}
                                                                            shouldUpdate={
                                                                                (prevValues, currentValues) =>
                                                                                    prevValues.taskIntervalType!==currentValues.taskIntervalType
                                                                            }
                                                                        >
                                                                            {
                                                                                ({getFieldValue})=>{
                                                                                    const taskIntervalType = getFieldValue("taskIntervalType");
                                                                                    return (
                                                                                        <Form.Item className="form-item-inline">
                                                                                            <Form.Item
                                                                                                noStyle={true}
                                                                                                validateTrigger={'onBlur'}
                                                                                                name="day"
                                                                                                rules={[{
                                                                                                    required:taskType === TaskType.interval && taskIntervalType === TaskIntervalType.day,
                                                                                                    message:"请输入间隔天数"
                                                                                                }]}
                                                                                            >
                                                                                                <InputNumber
                                                                                                    min={0}
                                                                                                    className="input-small input-handler"
                                                                                                    formatter={numberFormatter}
                                                                                                    disabled={
                                                                                                        taskType !== TaskType.interval ||
                                                                                                        taskIntervalType !==
                                                                                                        TaskIntervalType.day
                                                                                                    }
                                                                                                />
                                                                                            </Form.Item>
                                                                                            <span className="form-unit">
                                                                                                            天
                                                                                                        </span>
                                                                                        </Form.Item>

                                                                                    )
                                                                                }
                                                                            }
                                                                        </Form.Item>
                                                                    </div>
                                                                </Radio>
                                                                <Radio value={TaskIntervalType.second}>
                                                                    <div className="inline-block vertical-middle">
                                                                        <Form.Item
                                                                            noStyle={true}
                                                                            shouldUpdate={
                                                                                (prevValues, currentValues) =>
                                                                                    prevValues.taskIntervalType!==currentValues.taskIntervalType
                                                                            }
                                                                        >
                                                                            {
                                                                                ({getFieldValue})=> {
                                                                                    const taskIntervalType = getFieldValue("taskIntervalType");
                                                                                    return (
                                                                                        <Form.Item className="form-item-inline">
                                                                                            <Form.Item
                                                                                                noStyle={true}
                                                                                                validateTrigger={'onBlur'}
                                                                                                name="second"
                                                                                                rules={[{
                                                                                                    required:taskType === TaskType.interval && taskIntervalType === TaskIntervalType.second,
                                                                                                    message:"请输入间隔秒数"
                                                                                                }]}
                                                                                                className="inline-block"
                                                                                            >
                                                                                                <InputNumber
                                                                                                    min={0}
                                                                                                    className="input-small input-handler"
                                                                                                    formatter={numberFormatter}
                                                                                                    disabled={
                                                                                                        taskType !== TaskType.interval ||
                                                                                                        taskIntervalType !==
                                                                                                        TaskIntervalType.second
                                                                                                    }
                                                                                                />
                                                                                            </Form.Item>
                                                                                            <span className="form-unit">秒</span>
                                                                                        </Form.Item>
                                                                                    )
                                                                                }
                                                                            }
                                                                        </Form.Item>
                                                                    </div>
                                                                </Radio>
                                                            </Radio.Group>
                                                        </Form.Item>
                                                    </React.Fragment>
                                                )
                                            }
                                        }
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

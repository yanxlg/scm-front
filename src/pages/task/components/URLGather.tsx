import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Button, Card, DatePicker, Input, InputNumber, Modal, Radio, Spin, Form } from 'antd';
import '@/styles/config.less';
import '@/styles/form.less';
import { TaskIntervalType, TaskType } from '@/enums/ConfigEnum';
import moment, { Moment } from 'moment';
import { numberFormatter, parseText, stringifyText } from '@/utils/common';
import { addPddURLTask, IPddHotTaskParams, queryTaskDetail } from '@/services/task';
import GatherSuccessModal from '@/pages/task/components/GatherSuccessModal';
import GatherFailureModal from '@/pages/task/components/GatherFailureModal';
import { validateUrl } from '@/utils/validate';

declare interface IFormData {
    urls?: string;
    task_name: string;
    task_type: TaskType;
    taskIntervalType?: TaskIntervalType; // 调用接口前需要进行处理 && 编辑数据源需要处理
    onceStartTime?: Moment; // 调用接口前需要进行处理 && 编辑数据源需要处理
    timerStartTime?: Moment; // 调用接口前需要进行处理 && 编辑数据源需要处理
    task_end_time?: Moment;
    day?: number; // 调用接口前需要进行处理 && 编辑数据源需要处理
    second?: number; // 调用接口前需要进行处理 && 编辑数据源需要处理
}

declare interface IURLGatherProps{
    taskId?: number;
}

declare interface IHotGatherState {
    gatherLoading: boolean;
    groundLoading: boolean;
    queryLoading: boolean;
    taskType?: TaskType;
    successTimes?: number;
    failTimes?: number;
}

const URLGather:React.FC<IURLGatherProps>=({taskId})=>{

    const [form] = Form.useForm();
    const [gatherLoading,setGatherLoading] = useState(false);
    const [groundLoading,setGroundLoading] = useState(false);
    const [queryLoading,setQueryLoading] = useState(taskId !== void 0);
    const [taskType,setTaskType] = useState<TaskType|undefined>();
    const [successTimes,setSuccessTimes] = useState<number|undefined>();
    const [failTimes,setFailTimes] = useState<number|undefined>();

    const convertDetail = useCallback((info: IPddHotTaskParams) => {
        const {
            range,
            task_type,
            task_end_time,
            task_start_time,
            task_interval_seconds,
            urls,
            ...extra
        } = info;
        const isDay = task_interval_seconds && task_interval_seconds % 86400 === 0;
        return {
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
            urls: parseText(urls),
            ...extra,
        };
    },[]);
    const convertFormData=useCallback((values: IFormData)=>{
        const {
            urls = '',
            onceStartTime,
            timerStartTime,
            day = 0,
            second,
            taskIntervalType,
            task_type,
            task_end_time,
            ...extra
        } = values;
        // 如果单次任务且无时间，则需要设置is_immediately_execute为true

        return {
            ...extra,
            urls: stringifyText(urls),
            task_type,
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
    },[]);

    useEffect(()=>{
        if (taskId !== void 0) {
            queryTaskDetail(taskId).then(({ data: { task_detail_info = {} } = {} } = {}) => {
                const initValues = convertDetail(task_detail_info);
                const { task_type, success, fail } = initValues;
                form.setFieldsValue({
                    ...initValues,
                });
                setQueryLoading(false);
                setTaskType(task_type);
                setSuccessTimes(success);
                setFailTimes(fail);
            });
        }
    },[]);

    const onGather = useCallback((is_upper_shelf: boolean = false) => {
        form.validateFields().then((values: any) => {
            const params = convertFormData(values);
            setGatherLoading(!is_upper_shelf);
            setGroundLoading(is_upper_shelf);
            addPddURLTask(
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
        }).catch(({errorFields})=>{
            form.scrollToField(errorFields[0].name,{
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
    },[]);

    const onStartGather = useCallback(() => {
        onGather();
    },[]);

    const onAcquisitionRack = useCallback(() => {
        onGather(true);
    },[]);

    const disabledStartDate = useCallback((startTime: Moment | null) => {
        const endTime = form.getFieldValue('task_end_time');
        if (!startTime) {
            return false;
        }
        const startValue = startTime.valueOf();
        const currentValue = moment().valueOf();
        if (!endTime) {
            return startValue < currentValue;
        }
        return startValue > endTime.valueOf() || startValue < currentValue;
    },[]);

    const disabledEndDate = useCallback((endTime: Moment | null) => {
        const startTime = form.getFieldValue('timerStartTime');
        if (!endTime) {
            return false;
        }
        const endValue = endTime.valueOf();
        const currentValue = moment().valueOf();
        if (!startTime) {
            return endValue < currentValue;
        }
        return startTime.valueOf() > endValue || endValue < currentValue;
    },[]);

    const checkUrl = useCallback((type:any,value) => {
        if(!value){
            return Promise.resolve();
        }
        const urls = stringifyText(value);
        const urlList = urls.split(",");
        if(urlList.find(url=>!validateUrl(url))){
            return Promise.reject("输入的URL不合法，请检查并输入正确的URL");
        }
        return Promise.resolve();
    },[]);

    const checkDate = useCallback((type:any,value:Moment) => {
        if(!value){
            return Promise.resolve();
        }
        const now = moment();
        if(value.isAfter(now)){
            return Promise.resolve();
        }else{
            return Promise.reject("选择的时间不能早于当前时间");
        }
    },[]);

    return useMemo(()=>{
        const edit = taskId !== void 0;
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
                <Form
                    form={form}
                    layout="horizontal"
                    autoComplete={'off'}
                    className="form-help-absolute"
                    initialValues={{
                        taskIntervalType:TaskIntervalType.day,
                        task_type:TaskType.once
                    }}
                >
                    <Form.Item
                        className="form-item"
                        validateTrigger={'onBlur'}
                        name="task_name"
                        label="任务名称"
                        validateFirst={true}
                        rules={[{
                            required:true,
                            message:"请输入任务名称"
                        }]}
                    >
                        <Input className="input-default" />
                    </Form.Item>
                    <Form.Item
                        className="form-item form-control-full"
                        validateTrigger={'onBlur'}
                        name="urls"
                        required={true}
                        label={<span/>}
                        colon={false}
                        validateFirst={true}
                        rules={[{
                            required:true,
                            whitespace:true,
                            message:"请输入PDD商品详情链接"
                        },{
                            validator:checkUrl,
                        }]}
                    >
                        <Input.TextArea
                            spellCheck={'false'}
                            className="config-textarea flex-1"
                            placeholder="请输入PDD商品详情链接，一行一个，多个URL以回车隔开"
                        />
                    </Form.Item>
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
                                                            validator:checkDate,
                                                        }]}
                                                    >
                                                        <DatePicker
                                                            showTime={true}
                                                            disabled={taskType !== TaskType.once}
                                                            placeholder="立即开始"
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
                                                                validator:checkDate,
                                                            }]}
                                                        >
                                                            <DatePicker
                                                                showTime={true}
                                                                disabled={taskType !== TaskType.interval}
                                                                disabledDate={disabledStartDate}
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
                                                                validator:checkDate,
                                                            }]}
                                                        >
                                                            <DatePicker
                                                                showTime={true}
                                                                disabled={taskType !== TaskType.interval}
                                                                disabledDate={disabledEndDate}
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
    },[taskId,gatherLoading,groundLoading,queryLoading,taskType,successTimes,failTimes])
};


export default URLGather;

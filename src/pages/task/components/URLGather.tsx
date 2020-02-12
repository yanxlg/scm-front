import React from 'react';
import { Form } from '@/components/Form';
import {Bind} from 'lodash-decorators';
import { FormComponentProps } from 'antd/lib/form';
import { Button, Card, DatePicker, Icon, Input, InputNumber, Modal, Radio, Select, Spin, Tooltip } from 'antd';
import "@/styles/config.less";
import "@/styles/form.less";
import { TaskIntervalType, TaskRange, TaskType } from '@/enums/ConfigEnum';
import moment, { Moment } from 'moment';
import { numberFormatter, parseText, stringifyText } from '@/utils/common';
import { addPddURLTask, IPddHotTaskParams, queryTaskDetail } from '@/services/task';
import GatherSuccessModal from '@/pages/task/components/GatherSuccessModal';
import GatherFailureModal from '@/pages/task/components/GatherFailureModal';


declare interface IFormData {
    urls?: string;
    task_name:string;
    task_type:TaskType;
    taskIntervalType?:TaskIntervalType;// 调用接口前需要进行处理 && 编辑数据源需要处理
    onceStartTime?:Moment;// 调用接口前需要进行处理 && 编辑数据源需要处理
    timerStartTime?:Moment;// 调用接口前需要进行处理 && 编辑数据源需要处理
    task_end_time?:Moment;
    day?:number;// 调用接口前需要进行处理 && 编辑数据源需要处理
    second?:number;// 调用接口前需要进行处理 && 编辑数据源需要处理
}

declare interface IURLGatherProps extends FormComponentProps<IFormData>{
    taskId?:number;
}

declare interface IHotGatherState {
    gatherLoading:boolean;
    groundLoading:boolean;
    queryLoading:boolean;
    taskType?:TaskType;
    successTimes?:number;
    failTimes?:number;
}


class _URLGather extends Form.BaseForm<IURLGatherProps,IHotGatherState>{
    constructor(props:IURLGatherProps){
        super(props);
        this.state={
            gatherLoading:false,
            groundLoading:false,
            queryLoading:props.taskId!==void 0
        }
    }
    componentDidMount(): void {
        const {taskId} = this.props;
        if(taskId!==void 0){
            queryTaskDetail(taskId).then(({data:{task_detail_info={}}={}}={})=>{
                const initValues = this.convertDetail(task_detail_info);
                const {task_type,success,fail} = initValues;
                this.props.form.setFieldsValue({
                    ...initValues
                });
                this.setState({
                    queryLoading:false,
                    taskType:task_type,
                    successTimes:success,
                    failTimes:fail
                })
            })
        }
    }
    @Bind
    private convertDetail(info:IPddHotTaskParams){
        const {range,task_type,task_end_time,task_start_time,task_interval_seconds,urls,...extra} = info;
        const isDay = task_interval_seconds&&task_interval_seconds%86400 ===0;
        return {
            task_end_time:task_end_time?moment(task_end_time):undefined,
            taskIntervalType:task_interval_seconds?isDay?TaskIntervalType.day:TaskIntervalType.second:TaskIntervalType.day,
            onceStartTime:task_type === TaskType.once&&task_start_time?moment(task_start_time):undefined,
            timerStartTime:task_type === TaskType.interval&&task_start_time?moment(task_start_time):undefined,
            task_type,
            day:isDay?task_interval_seconds!/86400:undefined,
            second:task_interval_seconds&&!isDay?task_interval_seconds:undefined,
            urls:parseText(urls),
            ...extra
        }
    }
    @Bind
    private convertFormData(values:IFormData){
        const {urls="",onceStartTime,timerStartTime,day=0,second,taskIntervalType,task_type,task_end_time,...extra} = values;
        return {
            ...extra,
            urls:stringifyText(urls),
            task_type,
            task_start_time:task_type===TaskType.once?
                onceStartTime?.valueOf()??undefined:
                timerStartTime?.valueOf()??undefined,
            ...task_type===TaskType.once?{}:{
                task_interval_seconds:taskIntervalType===TaskIntervalType.second?second:day*60*60*24
            },
            task_end_time:task_end_time?.valueOf()??undefined
        }
    }
    @Bind
    private onGather(is_upper_shelf:boolean=false){
        this.validate({
            scroll:{
                offsetTop:80
            }
        }).then((values:any)=>{
            const params = this.convertFormData(values);
            this.setState(is_upper_shelf?{
                groundLoading:true,
                gatherLoading:false,
            }:{
                gatherLoading:true,
                groundLoading:false
            });
            addPddURLTask(Object.assign({},params,{
                is_upper_shelf:is_upper_shelf
            })).then(({data:{task_id=-1}={}}={})=>{
                Modal.info({
                    content:<GatherSuccessModal taskId={task_id} onClick={()=>{
                        Modal.destroyAll();
                        alert("任务详情");
                    }}/>,
                    className:"modal-empty",
                    icon:null,
                    maskClosable:true
                });
            }).catch(()=>{
                Modal.info({
                    content:<GatherFailureModal onClick={()=>{
                        Modal.destroyAll();
                        this.onGather(is_upper_shelf);
                    }}/>,
                    className:"modal-empty",
                    icon:null,
                    maskClosable:true
                });
            }).finally(()=>{
                this.setState({
                    gatherLoading:false,
                    groundLoading:false
                })
            });
        });
    }
    @Bind
    private onStartGather(){
        this.onGather();
    }
    @Bind
    private onAcquisitionRack(){
        this.onGather(true);
    }
    render(){
        const {form, taskId} = this.props;
        const edit = taskId!==void 0;
        const formData = form.getFieldsValue();
        const {task_type, taskIntervalType} = formData;
        const { gatherLoading, groundLoading, queryLoading, taskType, failTimes, successTimes } = this.state;
        return (
            <Spin spinning={queryLoading} tip="Loading...">
                {
                    edit&&(
                        <React.Fragment>
                            <div className="config-task-label">
                                任务ID：{taskId}
                            </div>
                            <div className="config-task-label">
                                任务状态: {taskType}
                            </div>
                            <div className="config-task-label">
                                执行成功：{successTimes}次
                            </div>
                            <div className="config-task-label">
                                执行失败：{failTimes}次
                            </div>
                        </React.Fragment>
                    )
                }
                <Form layout="inline" autoComplete={'off'}>
                    {
                        edit&&(
                            <Form.Item className="block form-item" validateTrigger={'onBlur'} form={form} name="task_name" label="任务名称">
                                <Input className="input-default"/>
                            </Form.Item>
                        )
                    }
                    <Form.Item className="config-card form-item-block" validateTrigger={'onBlur'} form={form} name="urls">
                        <Input.TextArea spellCheck={'false'} className="config-textarea" placeholder="请输入PDD商品详情链接，一行一个，多个URL以回车隔开"/>
                    </Form.Item>
                    <Card className="config-card" title={<span className="ant-form-item-required">任务类型：</span>}>
                        <Form.Item validateTrigger={'onBlur'} form={form} name="task_type" initialValue={TaskType.once}>
                            <Radio.Group>
                                <div className="block">
                                    <Radio className="vertical-middle" value={TaskType.once}>
                                        单次任务
                                    </Radio>
                                    <Form.Item className="vertical-middle" validateTrigger={'onBlur'} form={form} label="开始时间" name="onceStartTime">
                                        <DatePicker showTime={true} disabled={task_type!==TaskType.once} placeholder="立即开始"/>
                                    </Form.Item>
                                </div>
                                <div className="form-item">
                                    <Radio className="vertical-middle" value={TaskType.interval}>
                                        定时任务
                                    </Radio>
                                    <Form.Item className="vertical-middle" validateTrigger={'onBlur'} form={form} label="开始时间" name="timerStartTime">
                                        <DatePicker showTime={true} disabled={task_type!==TaskType.interval}/>
                                    </Form.Item>
                                    <Form.Item className="vertical-middle" validateTrigger={'onBlur'} form={form} label="结束时间" name="task_end_time">
                                        <DatePicker showTime={true} disabled={task_type!==TaskType.interval}/>
                                    </Form.Item>
                                    <Form.Item className="vertical-middle" validateTrigger={'onBlur'} form={form} label="任务间隔" name="taskIntervalType" initialValue="day">
                                        <Radio.Group disabled={task_type!==TaskType.interval}>
                                            <Radio value="day">
                                                <Form.Item className="vertical-middle" validateTrigger={'onBlur'} form={form} name="day">
                                                    <InputNumber min={0} className="input-small input-handler" formatter={numberFormatter} disabled={task_type!==TaskType.interval||taskIntervalType!==TaskIntervalType.day}/>
                                                </Form.Item>
                                                天
                                            </Radio>
                                            <Radio value="src">
                                                <Form.Item className="vertical-middle" validateTrigger={'onBlur'} form={form} name="second">
                                                    <InputNumber min={0} className="input-small input-handler" formatter={numberFormatter} disabled={task_type!==TaskType.interval||taskIntervalType!==TaskIntervalType.second}/>
                                                </Form.Item>
                                                秒
                                            </Radio>
                                        </Radio.Group>
                                    </Form.Item>
                                </div>
                            </Radio.Group>
                        </Form.Item>
                    </Card>
                    {
                        !edit&&(
                            <Form.Item className="block form-item" validateTrigger={'onBlur'} form={form} name="task_name" label="任务名称">
                                <Input className="input-default"/>
                            </Form.Item>
                        )
                    }
                    <div className="form-item">
                        <Button loading={gatherLoading} type="primary" className="btn-default" onClick={this.onStartGather}>
                            {
                                edit?"创建新任务":"开始采集"
                            }
                        </Button>
                        <Button loading={groundLoading} type="primary" className="btn-default" onClick={this.onAcquisitionRack}>
                            {
                                edit?"创建任务且上架":"一键采集上架"
                            }
                        </Button>
                    </div>
                </Form>
            </Spin>
        )
    }
}

const URLGather = Form.create<IURLGatherProps>()(_URLGather);


export default URLGather;
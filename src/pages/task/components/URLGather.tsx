import React from 'react';
import { Form } from '@/components/Form';
import {Bind} from 'lodash-decorators';
import { FormComponentProps } from 'antd/lib/form';
import { Button, Card, Icon, Input, Radio, Select, Tooltip } from 'antd';
import "@/styles/config.less";
import "@/styles/form.less";


declare interface IFormData {
    url?: string;
    taskType?:"once"|"timer";
    taskInterval?:"day"|"sec";
    onceStartTime?:string;
    timerStartTime?:string;
    timerEndTime?:string;
    day?:number;
    second?:number;
}

declare interface IURLGatherProps extends FormComponentProps<IFormData>{

}



class _URLGather extends Form.BaseForm<IURLGatherProps>{
    @Bind
    private onStartGather(){
        this.validate({
            scroll:{
                offsetTop:80
            }
        }).then(()=>{
            // send api
        });
    }
    @Bind
    private onAcquisitionRack(){
        this.validate({
            scroll:{
                offsetTop:80
            }
        }).then(()=>{
            // send api
        });
    }
    render(){
        const {form} = this.props;
        const formData = form.getFieldsValue();
        const {taskType, taskInterval} = formData;
        return (
            <React.Fragment>
                <Form layout="inline" autoComplete={'off'}>
                    <Form.Item className="config-card form-item-block" validateTrigger={'onBlur'} form={form} name="url">
                        <Input.TextArea spellCheck={'false'} className="config-textarea" placeholder="请输入PDD商品详情链接，一行一个，多个URL以回车隔开"/>
                    </Form.Item>
                    <Card className="config-card" title={<span className="ant-form-item-required">任务类型：</span>}>
                        <Form.Item validateTrigger={'onBlur'} form={form} name="taskType" initialValue="once">
                            <Radio.Group>
                                <div className="block">
                                    <Radio value="once">
                                        单次任务
                                    </Radio>
                                    <Form.Item className="vertical-middle" validateTrigger={'onBlur'} form={form} label="开始时间" name="onceStartTime">
                                        <Input type="text" placeholder={'请输入'} disabled={taskType!=="once"}/>
                                    </Form.Item>
                                </div>
                                <div className="form-item">
                                    <Radio value="timer">
                                        定时任务
                                    </Radio>
                                    <Form.Item className="vertical-middle" validateTrigger={'onBlur'} form={form} label="开始时间" name="timerStartTime">
                                        <Input type="text" placeholder={'请输入'} disabled={taskType!=="timer"}/>
                                    </Form.Item>
                                    <Form.Item className="vertical-middle" validateTrigger={'onBlur'} form={form} label="结束时间" name="timerEndTime">
                                        <Input type="text" placeholder={'请输入'} disabled={taskType!=="timer"}/>
                                    </Form.Item>
                                    <Form.Item className="vertical-middle" validateTrigger={'onBlur'} form={form} label="任务间隔" name="taskInterval" initialValue="day">
                                        <Radio.Group disabled={taskType!=="timer"}>
                                            <Radio value="day">
                                                <Form.Item className="vertical-middle" validateTrigger={'onBlur'} form={form} name="day">
                                                    <Input type="text" placeholder={'请输入'} disabled={taskType!=="timer"||taskInterval!=="day"}/>
                                                </Form.Item>
                                                天
                                            </Radio>
                                            <Radio value="src">
                                                <Form.Item className="vertical-middle" validateTrigger={'onBlur'} form={form} name="second">
                                                    <Input type="text" placeholder={'请输入'} disabled={taskType!=="timer"||taskInterval!=="src"}/>
                                                </Form.Item>
                                                秒
                                            </Radio>
                                        </Radio.Group>
                                    </Form.Item>
                                </div>
                            </Radio.Group>
                        </Form.Item>
                    </Card>
                    <Form.Item className="block form-item" validateTrigger={'onBlur'} form={form} name="taskName" label="任务名称">
                        <Input className="input-default"/>
                    </Form.Item>
                    <div className="form-item">
                        <Button type="primary" className="btn-default" onClick={this.onStartGather}>
                            开始采集
                        </Button>
                        <Button type="primary" className="btn-default" onClick={this.onAcquisitionRack}>
                            一键采集上架
                        </Button>
                    </div>
                </Form>
            </React.Fragment>
        )
    }
}

const URLGather = Form.create<IURLGatherProps>()(_URLGather);


export default URLGather;

import React from 'react';
import { Form } from '@/components/Form';
import {Bind} from 'lodash-decorators';
import { FormComponentProps } from 'antd/lib/form';
import { Button, Card, Icon, Input, Modal, Radio, Select, Tooltip } from 'antd';
import "@/styles/config.less";
import "@/styles/form.less";
import "@/styles/modal.less";
import GatherSuccessModal from '@/pages/task/components/GatherSuccessModal';
import GatherFailureModal from '@/pages/task/components/GatherFailureModal';


export declare interface IFormData {
    scope?: "fullStack"|"shop";
    shopId?:string;
    level1?:string;
    level2?:string;
    sortType?:string;
    keywords?:string;
    taskType?:"once"|"timer";
    taskInterval?:"day"|"sec";
    salesMin?:number;
    salesMax?:number;
    stockMin?:number;
    stockMax?:number;
    skuMin?:number;
    skuMax?:number;
    commentsNum?:number;
    priceMin?:number;
    priceMax?:number;
    pages?:number;
    count?:number;
    onceStartTime?:string;
    timerStartTime?:string;
    timerEndTime?:string;
    day?:number;
    second?:number;
    taskName?:string;
}

declare interface IHotGatherProps extends FormComponentProps<IFormData>{

}

const Option = Select.Option;

class _HotGather extends Form.BaseForm<IHotGatherProps>{
    @Bind
    private onStartGather(){
        this.validate({
            scroll:{
                offsetTop:80
            }
        }).then(()=>{
            // send api
        });

        Modal.info({
            content:<GatherSuccessModal taskId="01" onClick={()=>{}}/>,
            className:"modal-empty",
            icon:null,
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
        Modal.info({
            content:<GatherFailureModal onClick={()=>{}}/>,
            className:"modal-empty",
            icon:null,
        });
    }
    render(){
        const {form} = this.props;
        const formData = form.getFieldsValue();
        const {scope, taskType, taskInterval} = formData;
        return (
            <Form className="form-help-absolute" layout="inline" autoComplete={'off'}>
                <Card className="config-card" title={<span className="ant-form-item-required">任务范围：</span>}>
                    <Form.Item validateTrigger={'onBlur'} form={form} name="scope" initialValue="fullStack">
                        <Radio.Group>
                            <Radio className="block" value="fullStack">
                                全站
                            </Radio>
                            <div className="block form-item">
                                <Radio className="vertical-middle" value="shop">
                                    指定店铺
                                </Radio>
                                <Form.Item className="vertical-middle" validateTrigger={'onBlur'} form={form} label="店铺ID" name="shopId" rules={[{
                                    required:scope==="shop",
                                    message:"请输入店铺ID"
                                }]}>
                                    <Input type="text" placeholder={'请输入'} disabled={scope!=="shop"}/>
                                </Form.Item>
                            </div>
                        </Radio.Group>
                    </Form.Item>
                </Card>
                <Card className="config-card" title="指定类目/关键词：">
                    <Form.Item  validateTrigger={'onBlur'} form={form} name="level1" label="一级类目">
                        <Select className="select-default">
                            <Option value="1">女装</Option>
                            <Option value="2">男装</Option>
                            <Option value="3">鞋子</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item validateTrigger={'onBlur'} form={form} name="level2" label="二级类目">
                        <Select className="select-default">
                            <Option value="1">女装</Option>
                            <Option value="2">男装</Option>
                            <Option value="3">鞋子</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item validateTrigger={'onBlur'} form={form} name="sortType" label="排序类型">
                        <Select className="select-default">
                            <Option value="1">女装</Option>
                            <Option value="2">男装</Option>
                            <Option value="3">鞋子</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item className="block form-item" validateTrigger={'onBlur'} form={form} name="keywords" label="关&ensp;键&ensp;词">
                        <Input className="input-large"/>
                    </Form.Item>
                </Card>
                <Card className="config-card" title="设置商品条件：">
                    <div className="block">
                        <div className="inline-block">
                            <Form.Item className="margin-none" validateTrigger={'onBlur'} form={form} name="salesMin" label="销量">
                                <Input className="input-small"/>
                            </Form.Item>
                            <span className="ant-col ant-form-item-label config-colon">-</span>
                            <Form.Item validateTrigger={'onBlur'} form={form} name="salesMax">
                                <Input className="input-small"/>
                            </Form.Item>
                        </div>
                        <div className="inline-block">
                            <Form.Item className="margin-none" validateTrigger={'onBlur'} form={form} name="stockMin" label="库存">
                                <Input className="input-small"/>
                            </Form.Item>
                            <span className="ant-col ant-form-item-label config-colon">-</span>
                            <Form.Item validateTrigger={'onBlur'} form={form} name="stockMax">
                                <Input className="input-small"/>
                            </Form.Item>
                        </div>
                        <div className="inline-block">
                            <Form.Item className="margin-none" validateTrigger={'onBlur'} form={form} name="skuMin" label="sku数量">
                                <Input className="input-small"/>
                            </Form.Item>
                            <span className="ant-col ant-form-item-label config-colon">-</span>
                            <Form.Item validateTrigger={'onBlur'} form={form} name="skuMax">
                                <Input className="input-small"/>
                            </Form.Item>
                        </div>
                    </div>
                    <div className="block form-item">
                        <Form.Item validateTrigger={'onBlur'} form={form} name="commentsNum" label="评论数量>=">
                            <Input/>
                        </Form.Item>
                        <Form.Item className="margin-none" validateTrigger={'onBlur'} form={form} name="priceMin" label="价格范围（￥）">
                            <Input className="input-small"/>
                        </Form.Item>
                        <span className="ant-col ant-form-item-label config-colon">-</span>
                        <Form.Item validateTrigger={'onBlur'} form={form} name="priceMax">
                            <Input className="input-small"/>
                        </Form.Item>
                    </div>
                    <div className="block form-item">
                        <Form.Item validateTrigger={'onBlur'} form={form} name="pages" label="爬取页数">
                            <Input/>
                        </Form.Item>
                        <Form.Item validateTrigger={'onBlur'} form={form} name="count" label={
                            <span>爬取数量<Tooltip placement="bottom" title="各指定类目筛选前可爬取的最大数量"><Icon type="question-circle" /></Tooltip></span>
                        }>
                            <Input/>
                        </Form.Item>
                    </div>
                </Card>
                <Card className="config-card" title={<span className="ant-form-item-required">任务类型：</span>}>
                    <Form.Item validateTrigger={'onBlur'} form={form} name="taskType" initialValue="once">
                        <Radio.Group>
                            <div className="block">
                                <Radio value="once">
                                    单次任务
                                </Radio>
                                <Form.Item className="vertical-middle" validateTrigger={'onBlur'} form={form} label="开始时间" name="onceStartTime">
                                    <Input type="text" placeholder={'立即开始'} disabled={taskType!=="once"}/>
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
        )
    }
}

const HotGather = Form.create<IHotGatherProps>()(_HotGather);


export default HotGather;

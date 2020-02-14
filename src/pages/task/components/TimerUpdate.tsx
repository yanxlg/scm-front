import React from 'react';
import { Form } from '@/components/Form';
import {Bind} from 'lodash-decorators';
import { FormComponentProps } from 'antd/lib/form';
import { Button, Card, DatePicker, Icon, Input, InputNumber, Radio } from 'antd';
import "@/styles/config.less";
import "@/styles/form.less";
import { TaskGoodsArea } from '@/enums/ConfigEnum';
import { Moment } from 'moment';
import { numberFormatter } from '@/utils/common';



declare interface IFormData {
    task_name:string;
    goods_area:TaskGoodsArea;
    task_start_time?:Moment;
    day?:number;// 调用接口前需要进行处理 && 编辑数据源需要处理
}

declare interface ITimerUpdateProps extends FormComponentProps<IFormData>{
}

declare interface ITimerUpdateState {
    createLoading:boolean;
}

class _TimerUpdate extends Form.BaseForm<ITimerUpdateProps,ITimerUpdateState>{
    constructor(props:ITimerUpdateProps) {
        super(props);
        this.state={
            createLoading:false
        }
    }
    @Bind
    private onCreate(){
        this.setState({
            createLoading:true
        })
    }
    render(){
        const {form} = this.props;
        const {createLoading} = this.state;
        return (
            <Form layout="inline" autoComplete={'off'}>
                <Form.Item className="block form-item" validateTrigger={'onBlur'} form={form} name="task_name" label="任务名称">
                    <Input className="input-default"/>
                </Form.Item>
                <Card className="config-card" title={<span className="ant-form-item-required">定时更新配置：</span>}>
                    <Form.Item validateTrigger={'onBlur'} form={form} name="goods_area" label="商品范围" initialValue={TaskGoodsArea.All}>
                        <Radio.Group>
                            <Radio value={TaskGoodsArea.All}>
                                定时任务
                            </Radio>
                            <Radio value={TaskGoodsArea.AllOnShelves}>
                                全部已上架商品
                            </Radio>
                            <Radio value={TaskGoodsArea.HasSales}>
                                有销量的已上架商品
                            </Radio>
                        </Radio.Group>
                    </Form.Item>
                    <div className="block form-item">
                        <Form.Item validateTrigger={'onBlur'} form={form} name="task_start_time" label="任务执行时间">
                            <DatePicker showTime={true}/>
                        </Form.Item>
                        <Form.Item validateTrigger={'onBlur'} form={form} name="day" label="任务间隔">
                            <InputNumber min={0} className="config-input-count input-handler" formatter={numberFormatter} />
                        </Form.Item>
                        <label className="ant-form-item-label config-label-after">
                            天
                        </label>
                    </div>
                </Card>
                <div className="form-item">
                    <Button loading={createLoading} type="primary" className="btn-default" onClick={this.onCreate}>
                        创建任务
                    </Button>
                </div>
            </Form>
        )
    }
}

const TimerUpdate = Form.create<ITimerUpdateProps>()(_TimerUpdate);


export default TimerUpdate;

import React, { RefObject } from 'react';
import { Bind } from 'lodash-decorators';
import { Button, Card, DatePicker, Input, InputNumber, Radio, Form } from 'antd';
import '@/styles/config.less';
import '@/styles/form.less';
import { TaskGoodsArea } from '@/enums/ConfigEnum';
import { Moment } from 'moment';
import { intFormatter } from '@/utils/common';
import { FormInstance } from 'antd/es/form';

declare interface IFormData {
    task_name: string;
    goods_area: TaskGoodsArea;
    task_start_time?: Moment;
    day?: number; // 调用接口前需要进行处理 && 编辑数据源需要处理
}

declare interface ITimerUpdateProps {}

declare interface ITimerUpdateState {
    createLoading: boolean;
}

class TimerUpdate extends React.PureComponent<ITimerUpdateProps, ITimerUpdateState> {
    private formRef: RefObject<FormInstance> = React.createRef();
    constructor(props: ITimerUpdateProps) {
        super(props);
        this.state = {
            createLoading: false,
        };
    }
    @Bind
    private onCreate() {
        this.setState({
            createLoading: true,
        });
    }
    render() {
        const { createLoading } = this.state;
        return (
            <Form
                ref={this.formRef}
                layout="horizontal"
                autoComplete={'off'}
                initialValues={{
                    goods_area: TaskGoodsArea.All,
                }}
            >
                <Form.Item
                    className="form-item"
                    validateTrigger={'onBlur'}
                    name="task_name"
                    label="任务名称"
                    validateFirst={true}
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
                    title={<span className="form-required">定时更新配置：</span>}
                >
                    <Form.Item validateTrigger={'onBlur'} name="goods_area" label="商品范围">
                        <Radio.Group>
                            <Radio value={TaskGoodsArea.All}>定时任务</Radio>
                            <Radio value={TaskGoodsArea.AllOnShelves}>全部已上架商品</Radio>
                            <Radio value={TaskGoodsArea.HasSales}>有销量的已上架商品</Radio>
                        </Radio.Group>
                    </Form.Item>
                    <Form.Item
                        validateTrigger={'onBlur'}
                        name="task_start_time"
                        label="任务执行时间"
                    >
                        <DatePicker showTime={true} />
                    </Form.Item>
                    <Form.Item label="任务间隔" className="form-item-inline">
                        <Form.Item noStyle={true} name="day">
                            <InputNumber
                                min={0}
                                className="config-input-count input-handler"
                                formatter={intFormatter}
                            />
                        </Form.Item>
                        <label className="form-unit">天</label>
                    </Form.Item>
                </Card>
                <div className="form-item">
                    <Button
                        loading={createLoading}
                        type="primary"
                        className="btn-default"
                        onClick={this.onCreate}
                    >
                        创建任务
                    </Button>
                </div>
            </Form>
        );
    }
}

export default TimerUpdate;

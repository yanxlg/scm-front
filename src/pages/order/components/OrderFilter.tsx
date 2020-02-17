import React from 'react';
import { Form, DatePicker, Input, Select } from 'antd';
import { FormComponentProps } from 'antd/es/form';
import { Moment } from 'moment';

const { Option } = Select;

declare interface IOrderFilterProps extends FormComponentProps {

}

declare interface ILabelProps {
    text: string;
}

function Label(props: ILabelProps) {
    return <span className="order-label">{props.text}</span>
}

class OrderFilter extends React.PureComponent<IOrderFilterProps> {
    constructor(props: IOrderFilterProps) {
        super(props);
    }

    private disabledStartDate = (startTime: Moment | null) => {
        const { form } = this.props;
        const endTime = form.getFieldValue('order_confirm_time2');
        if (!startTime || !endTime) {
            return false;
        }
        return startTime.valueOf() > endTime.valueOf();
    }

    private disabledEndDate = (endTime: Moment | null) => {
        const { form } = this.props;
        const startTime = form.getFieldValue('order_confirm_time1');
        if (!endTime || !startTime) {
            return false;
        }
        return startTime.valueOf() > endTime.valueOf();
    }

    getValues = () => {
        const { form } = this.props;
        // console.log('getValues', form.getFieldsValue());
    }

    render() {

        const { form } = this.props;
        const { getFieldDecorator } = form;

        return (
            <Form layout="inline">
                <Form.Item 
                    className="margin-none" 
                    label={<Label text="确认订单时间"/>}
                >
                    {
                        getFieldDecorator('order_confirm_time1')(
                            <DatePicker
                                className="order-input" 
                                placeholder="开始时间"
                                disabledDate={this.disabledStartDate}
                            />
                        )
                    }
                </Form.Item>
                <span className="ant-form-item-label order-division">-</span>
                <Form.Item>
                    {
                        getFieldDecorator('order_confirm_time2')(
                            <DatePicker
                                className="order-input" 
                                placeholder="结束时间"
                                disabledDate={this.disabledEndDate}
                            />
                        )
                    }
                </Form.Item>
                <Form.Item label={<Label text="中台商品ID"/>}>
                    {
                        getFieldDecorator('commodity_id', {
                            initialValue: ''
                        })(
                            <Input
                                className="order-input"  
                                placeholder="请输入中台商品ID"

                            />
                        )
                    }
                </Form.Item>
                <Form.Item label={<Label text="中台订单ID"/>}>
                    {
                        getFieldDecorator('middleground_order_id', {
                            initialValue: ''
                        })(
                            <Input
                                className="order-input"  
                                placeholder="请输入中台订单ID"

                            />
                        )
                    }
                </Form.Item>
                <Form.Item label={<Label text="渠道商品ID"/>}>
                    {
                        getFieldDecorator('channel_goods_id', {
                            initialValue: ''
                        })(
                            <Input
                                className="order-input"  
                                placeholder="请输入渠道商品ID"

                            />
                        )
                    }
                </Form.Item>
                <Form.Item label={<Label text="渠道订单号"/>}>
                    {
                        getFieldDecorator('channel_order_number', {
                            initialValue: ''
                        })(
                            <Input
                                className="order-input"  
                                placeholder="请输入渠道订单号"

                            />
                        )
                    }
                </Form.Item>
                <Form.Item label={<Label text="中台订单状态"/>}>
                    {
                        getFieldDecorator('middleground_order_status', {
                            initialValue: ''
                        })(
                            <Select className="order-input">
                                <Option value="">全部</Option>
                                <Option value="0">已确定</Option>
                                <Option value="1">已取消</Option>
                            </Select>
                        )
                    }
                </Form.Item>
                <Form.Item label={<Label text="采购订单状态"/>}>
                    {
                        getFieldDecorator('purchase_order_status', {
                            initialValue: ''
                        })(
                            <Select className="order-input">
                                <Option value="">全部</Option>
                                <Option value="0">未拍单</Option>
                                <Option value="1">已拍单</Option>
                                <Option value="2">已删除</Option>
                                <Option value="3">已取消</Option>
                                <Option value="4">拍单失败</Option>
                            </Select>
                        )
                    }
                </Form.Item>
                <Form.Item label={<Label text="采购支付状态"/>}>
                    {
                        getFieldDecorator('purchase_payment_status', {
                            initialValue: ''
                        })(
                            <Select className="order-input">
                                <Option value="">全部</Option>
                                <Option value="0">未付款</Option>
                                <Option value="1">已付款</Option>
                                <Option value="2">待退款</Option>
                                <Option value="3">已退款</Option>
                                <Option value="4">待审核</Option>
                            </Select>
                        )
                    }
                </Form.Item>
                <Form.Item label={<Label text="采购配送状态"/>}>
                    {
                        getFieldDecorator('purchase_delivery_status', {
                            initialValue: ''
                        })(
                            <Select className="order-input">
                                <Option value="">全部</Option>
                                <Option value="0">未发货</Option>
                                <Option value="1">已发货</Option>
                                <Option value="2">已签收</Option>
                            </Select>
                        )
                    }
                </Form.Item>
                <Form.Item label={<Label text="渠道订单状态"/>}>
                    {
                        getFieldDecorator('channel_order_status', {
                            initialValue: ''
                        })(
                            <Select className="order-input">
                                <Option value="">全部</Option>
                                <Option value="0">已确认</Option>
                                <Option value="1">已取消</Option>
                            </Select>
                        )
                    }
                </Form.Item>
                <Form.Item  label={<Label text="渠道发货状态"/>}>
                    {
                        getFieldDecorator('channel_shipments_status', {
                            initialValue: ''
                        })(
                            <Select className="order-input">
                                <Option value="">全部</Option>
                                <Option value="0">已发货</Option>
                                <Option value="1">未发货</Option>
                            </Select>
                        )
                    }
                </Form.Item>
            </Form>
        )
    }
}

const FormWrapOrderFilter = Form.create<IOrderFilterProps>({name: 'orderFilter'})(OrderFilter);

export default FormWrapOrderFilter;

export { OrderFilter };

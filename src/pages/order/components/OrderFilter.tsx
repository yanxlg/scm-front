import React, { RefObject } from 'react';
import { Form, DatePicker, Input, Select } from 'antd';
import { FormInstance } from 'antd/es/form';
// import { FormComponentProps } from 'antd/es/form';
import { Dayjs } from 'dayjs';

const { Option } = Select;

// declare interface IOrderFilterProps {

// }

declare interface ILabelProps {
    text: string;
}

function Label(props: ILabelProps) {
    return <span className="order-label">{props.text}</span>;
}

// <IOrderFilterProps>
class OrderFilter extends React.PureComponent {
    formRef: RefObject<FormInstance> = React.createRef();

    // constructor(props: IOrderFilterProps) {
    //     super(props);
    // }

    private disabledStartDate = (startTime: Dayjs | null) => {
        // const { form } = this.props;
        // const endTime = form.getFieldValue('order_confirm_time2');
        // if (!startTime || !endTime) {
        //     return false;
        // }
        // return startTime.valueOf() > endTime.valueOf();
    };

    private disabledEndDate = (endTime: Dayjs | null) => {
        // const { form } = this.props;
        // const startTime = form.getFieldValue('order_confirm_time1');
        // if (!endTime || !startTime) {
        //     return false;
        // }
        // return startTime.valueOf() > endTime.valueOf();
    };

    getValues = () => {
        // const { form } = this.props;
        // console.log('getValues', this.formRef.current!.getFieldsValue());
        return this.formRef.current!.getFieldsValue();
    };

    render() {
        const initialValues = {
            purchase_order_status: '',
            middleground_order_status: '',
            middleground_order_logistics_status: '',
            purchase_payment_status: '',
            purchase_delivery_status: '',
            channel_order_status: '',
            channel_shipments_status: '',
        };

        return (
            <Form layout="inline" ref={this.formRef} initialValues={initialValues}>
                <Form.Item
                    name="order_time"
                    className="order-form-item"
                    label={<Label text="订单时间" />}
                >
                    <DatePicker
                        className="order-input"
                        placeholder="订单时间"
                        // disabledDate={this.disabledStartDate}
                    />
                </Form.Item>
                <Form.Item
                    name="order_confirm_time1"
                    className="order-form-item order-time"
                    label={<Label text="确认订单时间" />}
                >
                    <DatePicker
                        className="order-date-picker"
                        placeholder="开始时间"
                        // disabledDate={this.disabledStartDate}
                    />
                </Form.Item>
                <span className="ant-form-item-label order-division">-</span>
                <Form.Item name="order_confirm_time2" className="order-form-item">
                    <DatePicker
                        className="order-date-picker"
                        placeholder="结束时间"
                        // disabledDate={this.disabledEndDate}
                    />
                </Form.Item>
                <Form.Item
                    name="commodity_id"
                    className="order-form-item"
                    label={<Label text="中台商品ID" />}
                >
                    <Input className="order-input" placeholder="请输入中台商品ID" />
                </Form.Item>
                <Form.Item
                    name="middleground_order_id"
                    className="order-form-item"
                    label={<Label text="中台订单ID" />}
                >
                    <Input className="order-input" placeholder="请输入中台订单ID" />
                </Form.Item>
                <Form.Item
                    name="channel_goods_id"
                    className="order-form-item"
                    label={<Label text="渠道商品ID" />}
                >
                    <Input className="order-input" placeholder="请输入渠道商品ID" />
                </Form.Item>
                <Form.Item
                    name="channel_order_number"
                    className="order-form-item"
                    label={<Label text="渠道订单号" />}
                >
                    <Input className="order-input" placeholder="请输入渠道订单号" />
                </Form.Item>
                <Form.Item
                    name="purchase_order_status"
                    className="order-form-item"
                    label={<Label text="采购计划状态" />}
                >
                    <Select className="order-input">
                        <Option value="">全部</Option>
                        <Option value="0">未拍单</Option>
                        <Option value="1">已拍单</Option>
                        <Option value="2">已删除</Option>
                        <Option value="3">已取消</Option>
                        <Option value="4">拍单失败</Option>
                    </Select>
                </Form.Item>
                <Form.Item
                    name="middleground_order_status"
                    className="order-form-item"
                    label={<Label text="中台订单状态" />}
                >
                    <Select className="order-input">
                        <Option value="">全部</Option>
                        <Option value="0">已确定</Option>
                        <Option value="1">已取消</Option>
                    </Select>
                </Form.Item>
                <Form.Item
                    name="middleground_order_logistics_status"
                    className="order-form-item"
                    label={<Label text="中台订单物流状态" />}
                >
                    <Select className="order-input">
                        <Option value="">全部</Option>
                        <Option value="0">未配送</Option>
                        <Option value="1">已配送</Option>
                        <Option value="2">已入库</Option>
                        <Option value="3">已出库</Option>
                        <Option value="4">尾程已揽收</Option>
                        <Option value="5">已妥投</Option>
                        <Option value="6">已妥投未入库</Option>
                    </Select>
                </Form.Item>
                <Form.Item
                    name="purchase_payment_status"
                    className="order-form-item"
                    label={<Label text="采购支付状态" />}
                >
                    <Select className="order-input">
                        <Option value="">全部</Option>
                        <Option value="0">未付款</Option>
                        <Option value="1">已付款</Option>
                        <Option value="2">待退款</Option>
                        <Option value="3">已退款</Option>
                        <Option value="4">待审核</Option>
                    </Select>
                </Form.Item>
                <Form.Item
                    name="purchase_delivery_status"
                    className="order-form-item"
                    label={<Label text="采购配送状态" />}
                >
                    <Select className="order-input">
                        <Option value="">全部</Option>
                        <Option value="0">未发货</Option>
                        <Option value="1">已发货</Option>
                        <Option value="2">已签收</Option>
                    </Select>
                </Form.Item>
                <Form.Item
                    name="channel_order_status"
                    className="order-form-item"
                    label={<Label text="渠道订单状态" />}
                >
                    <Select className="order-input">
                        <Option value="">全部</Option>
                        <Option value="0">已确认</Option>
                        <Option value="1">已取消</Option>
                    </Select>
                </Form.Item>
                <Form.Item
                    name="channel_shipments_status"
                    className="order-form-item"
                    label={<Label text="渠道发货状态" />}
                >
                    <Select className="order-input">
                        <Option value="">全部</Option>
                        <Option value="0">已发货</Option>
                        <Option value="1">未发货</Option>
                    </Select>
                </Form.Item>
            </Form>
        );
    }
}

// const FormWrapOrderFilter = Form.create<IOrderFilterProps>({name: 'orderFilter'})(OrderFilter);

// export default FormWrapOrderFilter;

// export { OrderFilter };
export default OrderFilter;

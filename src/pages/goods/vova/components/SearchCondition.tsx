import React, { PureComponent } from 'react';
import { Button, Card, Input, DatePicker, Select, InputNumber, Col } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import { Form } from '@/components/Form';
import { numberFormatter } from '@/utils/common';

declare interface SdProps extends FormComponentProps<any> {
    onSearch: Function;
}

declare interface SdState {}

const { RangePicker } = DatePicker;
const Option = Select.Option;

export default class SearchCondition extends Form.BaseForm<SdProps, SdState> {
    constructor(props: SdProps) {
        super(props);
    }

    onSearch = () => {
        this.props.onSearch();
    };

    onExport = () => {};

    render() {
        const { form } = this.props;
        return (
            <Card className="condition-card">
                <div className="form-item">
                    <Form.Item validateTrigger={'onBlur'} form={form} name="time" label="时间">
                        <RangePicker showTime={true} format="YYYY-MM-DD HH:mm:ss" />
                    </Form.Item>
                    <Form.Item
                        validateTrigger={'onBlur'}
                        form={form}
                        name="commondity_id"
                        label="Commodity_ID"
                    >
                        <Input className="input-default input-handler" />
                    </Form.Item>
                    <Form.Item
                        validateTrigger={'onBlur'}
                        form={form}
                        name="virtual_goods_id"
                        label="虚拟ID"
                    >
                        <Input className="input-small input-handler" />
                    </Form.Item>
                    <Form.Item
                        validateTrigger={'onBlur'}
                        form={form}
                        name="product_id"
                        label="product_id"
                    >
                        <Input className="input-small input-handler" />
                    </Form.Item>
                </div>
                <div className="form-item">
                    <Form.Item validateTrigger={'onBlur'} form={form} name="volume" label="销量">
                        <Select className="select-default" defaultValue="">
                            <Option value="">日销量大于10</Option>
                            <Option value="1">日销量大于100</Option>
                            <Option value="2">日销量大于500</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item
                        validateTrigger={'onBlur'}
                        form={form}
                        name="shop_name"
                        label="店铺名"
                    >
                        <Input className="input-small input-handler" style={{ width: 130 }} />
                    </Form.Item>
                    <Form.Item
                        validateTrigger={'onBlur'}
                        form={form}
                        name="category_level_one"
                        label="一级类目"
                    >
                        <Select className="select-default">
                            <Option value="1">女装</Option>
                            <Option value="2">男装</Option>
                            <Option value="3">鞋子</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item
                        validateTrigger={'onBlur'}
                        form={form}
                        name="category_level_two"
                        label="二级类目"
                    >
                        <Select className="select-default">
                            <Option value="1">女装</Option>
                            <Option value="2">男装</Option>
                            <Option value="3">鞋子</Option>
                        </Select>
                    </Form.Item>
                </div>
                <div className="form-item">
                    <Form.Item
                        validateTrigger={'onBlur'}
                        form={form}
                        name="goods_id"
                        label="商品状态"
                    >
                        <Select className="select-default">
                            <Option value="1">all</Option>
                            <Option value="2">在架</Option>
                            <Option value="3">已下架</Option>
                        </Select>
                    </Form.Item>
                    <Button type="primary" className="btn-default" onClick={this.onSearch}>
                        查询
                    </Button>
                    <Button type="primary" className="btn-default" onClick={this.onExport}>
                        导出
                    </Button>
                </div>
            </Card>
        );
    }
}

import React, { PureComponent } from 'react'
import { Button, Card, Input, DatePicker, Select, InputNumber, Col } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import { Form } from '@/components/Form';

declare interface SdProps extends FormComponentProps<any> {
    searchOptions: SelectOptionsItem[];
    onSearch: Function;
    toggleExcelDialog: Function;
}

declare interface SdState {
    levelTwoOptions: SelectOptionsItem[];
}

declare interface SdState {
    volumes: Array<SelectOptionsItem>;
    goodsStatus: Array<SelectOptionsItem>;
}

export declare interface SelectOptionsItem {
    id: string;
    name: string;
    children?: SelectOptionsItem[];
}

const Option = Select.Option;

export default class SearchCondition extends Form.BaseForm<SdProps, SdState> {
    constructor(props: SdProps) {
        super(props);
        this.state = {
            levelTwoOptions: [],
            volumes: [{
                id: '1',
                name: '日销量大于10',
            }, {
                id: '2',
                name: '日销量大于50',
            }, {
                id: '3',
                name: '日销量大于100',
            }, {
                id: '4',
                name: '周销量大于100',
            }, {
                id: '5',
                name: '周销量大于200',
            }, {
                id: '6',
                name: '周销量大于500',
            }, {
                id: '7',
                name: '月销量大于100',
            }, {
                id: '8',
                name: '月销量大于500',
            }, {
                id: '9',
                name: '月销量大于100',
            }, {
                id: '100',
                name: 'all',
            }],
            goodsStatus: [{
                id: '1',
                name: '已上架',
            }, {
                id: '2',
                name: '待上架',
            }, {
                id: '3',
                name: '已下架',
            }, {
                id: '100',
                name: 'all',
            }]
        };
    }

    onSearch = () => {
        this.props.onSearch();
    }

    // 导出
    toggleExcelDialog = () => {
        this.props.toggleExcelDialog(true);
    }

    // 选中一级类目
    onLevelOneChange = value => {
        if (value) {
            const { searchOptions } = this.props;
            const levelTwoOptions = searchOptions.filter(item => {
                return item.id === value;
            })[0].children as SelectOptionsItem;
            this.setState({
                levelTwoOptions: levelTwoOptions
            });
        } else {
            this.setState({
                levelTwoOptions: []
            });
            this.props.form.setFieldsValue({
                level_two_category: ''
              });
        }
        
        
        
    }

    validateEndTime = (current, type) => {
        
    }

    render() {
        const { form, searchOptions } = this.props;
        const { volumes, goodsStatus, levelTwoOptions } = this.state;
        const { onshelf_time_satrt, onshelf_time_end } = form.getFieldsValue();
        return (
            <Card className="condition-card">
                <div className="form-item">
                    <div className="inline-block">
                        {/* <DatePicker
                            showTime={true}
                            format="YYYY-MM-DD HH:mm:ss"
                        /> */}
                        <Form.Item
                            className="margin-none"
                            form={form}
                            name="onshelf_time_satrt"
                            label="时间"
                        >
                            <DatePicker
                                showTime={true}
                                disabledDate={currentDate =>
                                    currentDate
                                        ? onshelf_time_end
                                            ? currentDate.isAfter(onshelf_time_end)
                                            : false
                                        : false
                                }
                                className="picker-small"
                            />
                        </Form.Item>
                        <span className="ant-col ant-form-item-label config-colon">-</span>
                        <Form.Item form={form} name="onshelf_time_end">
                            <DatePicker
                                showTime={true}
                                disabledDate={currentDate =>
                                    currentDate
                                        ? onshelf_time_satrt
                                            ? currentDate.isBefore(onshelf_time_satrt)
                                            : false
                                        : false
                                }
                                className="picker-small"
                            />
                        </Form.Item>
                    </div>
                    <Form.Item validateTrigger={'onBlur'} form={form} name="commondity_id" label="Commodity_ID">
                        <Input className="input-default input-handler" />
                    </Form.Item>
                    <Form.Item validateTrigger={'onBlur'} form={form} name="virtual_goods_id" label="虚拟ID">
                        <Input className="input-small input-handler" />
                    </Form.Item>
                    <Form.Item validateTrigger={'onBlur'} form={form} name="product_id" label="product_id">
                        <Input className="input-small input-handler" />
                    </Form.Item>
                </div>
                <div className="form-item">
                    <Form.Item validateTrigger={'onBlur'} form={form} name="sales_volume" label="销量">
                        <Select className="select-default">
                            {
                                volumes.map(item => (
                                    <Option value={item.id}>{item.name}</Option>
                                ))
                            }
                        </Select>
                    </Form.Item>
                    <Form.Item validateTrigger={'onBlur'} form={form} name="shop_name" label="店铺名">
                        <Input className="input-small input-handler" style={{width: 130}} />
                    </Form.Item>
                    <Form.Item validateTrigger={'onBlur'} form={form} initialValue="" name="level_one_category" label="一级类目">
                        <Select className="select-default" onChange={this.onLevelOneChange}>
                            <Option value="">全部</Option>
                            {
                                searchOptions.map(item => (
                                    <Option value={item.id}>{item.name}</Option>
                                ))
                            }
                        </Select>
                    </Form.Item>
                    <Form.Item validateTrigger={'onBlur'} initialValue="" form={form} name="level_two_category" label="二级类目">
                        <Select className="select-default">
                            <Option value="">全部</Option>
                            {
                                levelTwoOptions.map(item => (
                                    <Option value={item.id}>{item.name}</Option>
                                ))
                            }
                        </Select>
                    </Form.Item>
                </div>
                <div className="form-item">
                    <Form.Item validateTrigger={'onBlur'} form={form} name="product_status" label="商品状态">
                        <Select className="select-default">
                            {
                                goodsStatus.map(item => (
                                    <Option value={item.id}>{item.name}</Option>
                                ))
                            }
                        </Select>
                    </Form.Item>
                    <Button type="primary" className="btn-default" onClick={this.onSearch}>
                        查询
                    </Button>
                    <Button type="primary" className="btn-default" onClick={this.toggleExcelDialog}>
                        导出
                    </Button>
                </div>
            </Card>
        )
    }
}

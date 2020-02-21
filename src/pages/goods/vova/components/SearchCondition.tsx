import React, { RefObject } from 'react';
import { Button, Card, Input, DatePicker, Select, Form } from 'antd';
import { FormInstance } from 'antd/es/form';
import {Bind} from 'lodash-decorators';

declare interface SdProps{
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

export default class SearchCondition extends React.PureComponent<SdProps, SdState> {
    private formRef:RefObject<FormInstance> = React.createRef();
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
    onLevelOneChange = (value:string) => {
        if (value) {
            const { searchOptions } = this.props;
            const levelTwoOptions = searchOptions.filter(item => {
                return item.id === value;
            })[0].children as SelectOptionsItem[];
            this.setState({
                levelTwoOptions: levelTwoOptions
            });
        } else {
            this.setState({
                levelTwoOptions: []
            });
            this.formRef.current!.setFieldsValue({
                level_two_category: ''
              });
        }
    }

    @Bind
    public getFieldsValue(){
        return this.formRef.current!.getFieldsValue();
    }

    render() {
        const { searchOptions } = this.props;
        const { volumes, goodsStatus, levelTwoOptions } = this.state;
        return (
            <Card className="condition-card">
                <Form
                    ref={this.formRef}
                    className="form-help-absolute"
                    layout="inline"
                    autoComplete={'off'}
                    initialValues={{
                        level_one_category:"",
                        level_two_category:""
                    }}
                >
                    <Form.Item
                        label="时间"
                        className="form-item"
                    >
                        <Form.Item
                            noStyle={true}
                            shouldUpdate={
                                (prevValues, currentValues) =>
                                    prevValues.onshelf_time_end !== currentValues.onshelf_time_end
                            }
                        >
                            {
                                ({getFieldValue})=>{
                                    const onshelf_time_end = getFieldValue("onshelf_time_end");
                                    return (
                                        <Form.Item
                                            name="onshelf_time_satrt"
                                            noStyle={true}
                                        >
                                            <DatePicker
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
                                    )
                                }
                            }
                        </Form.Item>
                        <span className="config-colon">-</span>
                        <Form.Item
                            noStyle={true}
                            shouldUpdate={
                                (prevValues, currentValues) =>
                                    prevValues.onshelf_time_satrt !== currentValues.onshelf_time_satrt
                            }
                        >
                            {
                                ({getFieldValue})=>{
                                    const onshelf_time_satrt = getFieldValue("onshelf_time_satrt");
                                    return (
                                        <Form.Item
                                            name="onshelf_time_end"
                                            noStyle={true}
                                        >
                                            <DatePicker
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
                                    )
                                }
                            }
                        </Form.Item>
                    </Form.Item>

                    <Form.Item className="form-item" validateTrigger={'onBlur'} name="commondity_id" label="Commodity_ID">
                        <Input className="input-default input-handler" />
                    </Form.Item>

                    <Form.Item className="form-item" validateTrigger={'onBlur'} name="virtual_goods_id" label="虚拟ID">
                        <Input className="input-default input-handler" />
                    </Form.Item>

                    <Form.Item className="form-item" validateTrigger={'onBlur'} name="product_id" label="product_id">
                        <Input className="input-default input-handler" />
                    </Form.Item>

                    <Form.Item className="form-item" validateTrigger={'onBlur'} name="sales_volume" label="销量">
                        <Select className="select-default">
                            {
                                volumes.map(item => (
                                    <Option value={item.id}>{item.name}</Option>
                                ))
                            }
                        </Select>
                    </Form.Item>
                    <Form.Item className="form-item" validateTrigger={'onBlur'} name="shop_name" label="店铺名">
                        <Input className="input-small input-handler" style={{width: 130}} />
                    </Form.Item>
                    <Form.Item className="form-item" validateTrigger={'onBlur'} name="level_one_category" label="一级类目">
                        <Select className="select-default" onChange={this.onLevelOneChange}>
                            <Option value="">全部</Option>
                            {
                                searchOptions.map(item => (
                                    <Option value={item.id}>{item.name}</Option>
                                ))
                            }
                        </Select>
                    </Form.Item>
                    <Form.Item className="form-item" validateTrigger={'onBlur'} name="level_two_category" label="二级类目">
                        <Select className="select-default">
                            <Option value="">全部</Option>
                            {
                                levelTwoOptions.map(item => (
                                    <Option value={item.id}>{item.name}</Option>
                                ))
                            }
                        </Select>
                    </Form.Item>
                    <Form.Item validateTrigger={'onBlur'} className="form-item" name="product_status" label="商品状态">
                        <Select className="select-default">
                            {
                                goodsStatus.map(item => (
                                    <Option value={item.id}>{item.name}</Option>
                                ))
                            }
                        </Select>
                    </Form.Item>
                    <Button type="primary" className="btn-group vertical-middle form-item" onClick={this.onSearch}>
                        查询
                    </Button>
                    <Button type="primary" className="btn-group vertical-middle form-item" onClick={this.toggleExcelDialog}>
                        导出
                    </Button>
                </Form>
            </Card>
        )
    }
}

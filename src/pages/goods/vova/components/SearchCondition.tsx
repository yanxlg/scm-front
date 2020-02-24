import React, { RefObject } from 'react';
import { Button, Card, Input, DatePicker, Select, Form } from 'antd';
import { FormInstance } from 'antd/es/form';
import {Bind} from 'lodash-decorators';
import { getSearchConditionOptions, IFilterParams } from '@/services/VovaGoodsService';
import { transEndDate, transStartDate } from '@/utils/date';

declare interface ISearchProps{
    onSearch: Function;
    toggleExcelDialog: Function;
}

declare interface SelectOptionsItem{
    id:string;
    name:string;
    children?:SelectOptionsItem[];
}

declare interface ISearchState {
    categoryLoading:boolean;
    searchOptions: SelectOptionsItem[];
}

const Option = Select.Option;


const salesVolumeList=[{
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
}];

const goodsStatusList = [{
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
}];



export default class SearchCondition extends React.PureComponent<ISearchProps, ISearchState> {
    private formRef:RefObject<FormInstance> = React.createRef();
    constructor(props: ISearchProps) {
        super(props);
        this.state = {
            categoryLoading:true,
            searchOptions:[],
        };
    }

    componentDidMount(): void {
        this.queryCategory();
    }

    @Bind
    private queryCategory() {
        getSearchConditionOptions().then(({data=[]}) => {
            this.setState({
                categoryLoading: false,
                searchOptions: data,
            });
        }).catch(()=>{
            this.setState({
                categoryLoading: false,
            });
        });
    }
    @Bind
    private onSearch(){
        this.props.onSearch();
    }

    @Bind
    private toggleExcelDialog(){
        this.props.toggleExcelDialog(true);
    }

    @Bind
    public getFieldsValue(){
        const {onshelf_time_satrt,onshelf_time_end,...values} = this.formRef.current!.getFieldsValue();
        return {
            ...values,
            onshelf_time_satrt:transStartDate(onshelf_time_satrt),
            onshelf_time_end:transEndDate(onshelf_time_end)
        } as IFilterParams
    }

    render() {
        const { searchOptions,categoryLoading } = this.state;
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
                                salesVolumeList.map(item => (
                                    <Option value={item.id}>{item.name}</Option>
                                ))
                            }
                        </Select>
                    </Form.Item>
                    <Form.Item className="form-item" validateTrigger={'onBlur'} name="shop_name" label="店铺名">
                        <Input className="input-default input-handler"/>
                    </Form.Item>

                    <Form.Item className="form-item" validateTrigger={'onBlur'} name="level_one_category" label="一级类目">
                        <Select loading={categoryLoading} className="select-default">
                            <Option value="">全部</Option>
                            {
                                searchOptions.map(item => (
                                    <Option value={item.id}>{item.name}</Option>
                                ))
                            }
                        </Select>
                    </Form.Item>
                    <Form.Item
                        noStyle={true}
                        shouldUpdate={
                            (prevValues, currentValues) =>
                                prevValues.level_one_category !== currentValues.level_one_category
                        }
                    >
                        {
                            ({getFieldValue})=>{
                                const levelOne = getFieldValue("level_one_category");
                                const childCategory =
                                    searchOptions.find(category => {
                                        return category.id === levelOne;
                                    })?.children || [];
                                return (
                                    <Form.Item
                                        validateTrigger={'onBlur'}
                                        name="level_two_category"
                                        label="二级类目"
                                        className="form-item"
                                    >
                                        <Select loading={categoryLoading} className="select-default">
                                            <Option value="">全部</Option>
                                            {childCategory.map(category => {
                                                return (
                                                    <Option
                                                        key={category.id}
                                                        value={category.id}
                                                    >
                                                        {category.name}
                                                    </Option>
                                                );
                                            })}
                                        </Select>
                                    </Form.Item>
                                )
                            }
                        }
                    </Form.Item>
                    <Form.Item validateTrigger={'onBlur'} className="form-item" name="product_status" label="商品状态">
                        <Select className="select-default">
                            {
                                goodsStatusList.map(item => (
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

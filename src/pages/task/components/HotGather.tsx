import React from 'react';
import { Form } from '@/components/Form';
import {Bind} from 'lodash-decorators';
import { FormComponentProps } from 'antd/lib/form';
import { Card, Input, Radio, Select } from 'antd';
import "@/styles/config.less";
import "@/styles/form.less";


declare interface IFormData {
    scope?: "fullStack"|"shop";
    shopId?:string;
    level1?:string;
    level2?:string;
    sortType?:string;
    keywords?:string;
}

declare interface IHotGatherProps extends FormComponentProps<IFormData>{

}


const Option = Select.Option;

const HotGather = Form.create<IHotGatherProps>()(class A extends Form.BaseForm<IHotGatherProps>{
    render(){
        return (
            <React.Fragment>
                <Form layout="inline" autoComplete={'off'}>
                    <Card className="config-card" title={<span className="ant-form-item-required">任务范围：</span>}>
                        <Form.Item validateTrigger={'onBlur'} form={this.props.form} name="scope" initialValue="fullStack">
                            <Radio.Group>
                                <Radio className="block" value="fullStack">
                                    全站
                                </Radio>
                                <div className="block form-item">
                                    <Radio className="vertical-middle" value="shop">
                                        指定店铺
                                    </Radio>
                                    <Form.Item className="vertical-middle" validateTrigger={'onBlur'} form={this.props.form} label="店铺ID" name="shopId">
                                        <Input type="text" placeholder={'请输入'}/>
                                    </Form.Item>
                                </div>
                            </Radio.Group>
                        </Form.Item>
                    </Card>
                    <Card className="config-card" title="指定类目/关键词：">
                        <Form.Item  validateTrigger={'onBlur'} form={this.props.form} name="level1" label="一级类目">
                            <Select className="select-default">
                                <Option value="1">女装</Option>
                                <Option value="2">男装</Option>
                                <Option value="3">鞋子</Option>
                            </Select>
                        </Form.Item>
                        <Form.Item validateTrigger={'onBlur'} form={this.props.form} name="level2" label="二级类目">
                            <Select className="select-default">
                                <Option value="1">女装</Option>
                                <Option value="2">男装</Option>
                                <Option value="3">鞋子</Option>
                            </Select>
                        </Form.Item>
                        <Form.Item validateTrigger={'onBlur'} form={this.props.form} name="sortType" label="排序类型">
                            <Select className="select-default">
                                <Option value="1">女装</Option>
                                <Option value="2">男装</Option>
                                <Option value="3">鞋子</Option>
                            </Select>
                        </Form.Item>
                        <Form.Item className="block form-item" validateTrigger={'onBlur'} form={this.props.form} name="keywords" label="关键词">
                            <Input className="input-large"/>
                        </Form.Item>
                    </Card>
                    <Card className="config-card" title="设置商品条件：">
                        <Form.Item validateTrigger={'onBlur'} form={this.props.form} name="level1" label="销量">
                            <Input className="input-small"/>
                        </Form.Item>
                        <span className="ant-col ant-form-item-label">-</span>
                        <Form.Item validateTrigger={'onBlur'} form={this.props.form} name="level1">
                            <Input className="input-small"/>
                        </Form.Item>

                        <Form.Item validateTrigger={'onBlur'} form={this.props.form} name="level1" label="库存">
                            <Input className="input-small"/>
                        </Form.Item>
                        <span className="ant-col ant-form-item-label">-</span>
                        <Form.Item validateTrigger={'onBlur'} form={this.props.form} name="level1">
                            <Input className="input-small"/>
                        </Form.Item>

                        <Form.Item validateTrigger={'onBlur'} form={this.props.form} name="level1" label="sku数量">
                            <Input className="input-small"/>
                        </Form.Item>
                        <span className="ant-col ant-form-item-label">-</span>
                        <Form.Item validateTrigger={'onBlur'} form={this.props.form} name="level1">
                            <Input className="input-small"/>
                        </Form.Item>
                        <div className="block">
                            <Form.Item validateTrigger={'onBlur'} form={this.props.form} name="level1" label="评论数量>=">
                                <Input/>
                            </Form.Item>

                            <Form.Item validateTrigger={'onBlur'} form={this.props.form} name="level1" label="价格范围（￥）">
                                <Input className="input-small"/>
                            </Form.Item>
                            <span className="ant-col ant-form-item-label">-</span>
                            <Form.Item validateTrigger={'onBlur'} form={this.props.form} name="level1">
                                <Input className="input-small"/>
                            </Form.Item>
                        </div>
                        <div className="block">
                            <Form.Item validateTrigger={'onBlur'} form={this.props.form} name="level1" label="爬取页数">
                                <Input/>
                            </Form.Item>
                            <Form.Item validateTrigger={'onBlur'} form={this.props.form} name="level1" label="爬取数量">
                                <Input/>
                            </Form.Item>
                        </div>
                    </Card>
                    <Card className="config-card" title={<span className="ant-form-item-required">任务类型：</span>}>
                        <Form.Item validateTrigger={'onBlur'} form={this.props.form} name="scope" initialValue="fullStack">
                            <Radio.Group>
                                <Radio className="block" value="fullStack">
                                    单次任务
                                    <Form.Item className="vertical-middle" validateTrigger={'onBlur'} form={this.props.form} label="开始时间" name="shopId">
                                        <Input type="text" placeholder={'请输入'}/>
                                    </Form.Item>
                                </Radio>
                                <div className="form-item">
                                    <Radio value="shop">
                                        定时任务
                                    </Radio>
                                    <Form.Item className="vertical-middle" validateTrigger={'onBlur'} form={this.props.form} label="开始时间" name="shopId">
                                        <Input type="text" placeholder={'请输入'}/>
                                    </Form.Item>
                                    <Form.Item className="vertical-middle" validateTrigger={'onBlur'} form={this.props.form} label="结束时间" name="shopId">
                                        <Input type="text" placeholder={'请输入'}/>
                                    </Form.Item>
                                    <Form.Item className="vertical-middle" validateTrigger={'onBlur'} form={this.props.form} label="任务间隔" name="shopId">
                                        <Radio.Group>
                                            <Radio value="fullStack">
                                                <Form.Item className="vertical-middle" validateTrigger={'onBlur'} form={this.props.form} name="shopId">
                                                    <Input type="text" placeholder={'请输入'}/>
                                                </Form.Item>
                                                天
                                            </Radio>
                                            <Radio value="fullStack">
                                                <Form.Item className="vertical-middle" validateTrigger={'onBlur'} form={this.props.form} name="shopId">
                                                    <Input type="text" placeholder={'请输入'}/>
                                                </Form.Item>
                                                秒
                                            </Radio>
                                        </Radio.Group>
                                    </Form.Item>
                                </div>
                            </Radio.Group>
                        </Form.Item>
                    </Card>
                  {/*  <Button
                        type="primary"
                        className="activity-view-search vova-btn-search"
                        onClick={this.onSearch}
                    >
                        查询
                    </Button>*/}
                </Form>
            </React.Fragment>
        )
    }
});


export default HotGather;

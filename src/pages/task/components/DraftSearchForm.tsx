import React from 'react';
import { Form } from '@/components/Form';
import { Input, Select } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import "@/styles/config.less";

declare interface IFormData {
    taskName?:string;
    scope?:string;
    taskStatus?:string;
    createStartTime?:string;
    createEndTime?:string;
}

declare interface ITaskSearchProps extends FormComponentProps<IFormData>{
}

const Option = Select.Option;

class _DraftSearch extends Form.BaseForm<ITaskSearchProps>{
    render(){
        const {form} = this.props;
        return (
            <React.Fragment>
                <Form className="config-card" layout="inline" autoComplete={'off'}>
                    <Form.Item form={form} name="taskId" label="任务名称">
                        <Input className="input-default" />
                    </Form.Item>
                    <Form.Item form={form} name="scope" label="任务范围">
                        <Select className="select-default">
                            <Option value="1">女装</Option>
                            <Option value="2">男装</Option>
                            <Option value="3">鞋子</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item form={form} name="taskStatus" label="任务状态">
                        <Select className="select-default">
                            <Option value="1">女装</Option>
                            <Option value="2">男装</Option>
                            <Option value="3">鞋子</Option>
                        </Select>
                    </Form.Item>
                    <div className="inline-block">
                        <Form.Item className="margin-none" form={form} name="createStartTime" label="任务创建时间">
                            <Input className="input-small"/>
                        </Form.Item>
                        <span className="ant-col ant-form-item-label config-colon">-</span>
                        <Form.Item form={form} name="createEndTime">
                            <Input className="input-small"/>
                        </Form.Item>
                    </div>
                </Form>
            </React.Fragment>
        )
    }
}

const DraftSearch = Form.create<ITaskSearchProps>()(_DraftSearch);

export default DraftSearch;

export {_DraftSearch};

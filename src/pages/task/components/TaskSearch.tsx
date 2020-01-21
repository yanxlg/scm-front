import React from 'react';
import { Form } from '@/components/Form';
import { Input, Select } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import "@/styles/config.less";

export declare interface IFormData {
    task_id?:string;
    task_name?:string;
    task_range?:string;
    task_status?:string;
    task_begin_time?:string;
    task_end_time?:string;
    task_create_time1?:string;
    task_create_time2?:string;
}

declare interface ITaskSearchProps extends FormComponentProps<IFormData>{
}

const Option = Select.Option;

class _TaskSearch extends Form.BaseForm<ITaskSearchProps>{
    render(){
        const {form} = this.props;
        return (
            <React.Fragment>
                <Form className="config-card" layout="inline" autoComplete={'off'}>
                    <Form.Item form={form} name="task_id" label="任务ID">
                        <Input className="input-default" />
                    </Form.Item>
                    <Form.Item form={form} name="task_name" label="任务名称">
                        <Input className="input-default" />
                    </Form.Item>
                    <Form.Item form={form} name="task_range" label="任务范围">
                        <Select className="select-default">
                            <Option value="1">女装</Option>
                            <Option value="2">男装</Option>
                            <Option value="3">鞋子</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item form={form} name="task_status" label="任务状态">
                        <Select className="select-default">
                            <Option value="1">女装</Option>
                            <Option value="2">男装</Option>
                            <Option value="3">鞋子</Option>
                        </Select>
                    </Form.Item>
                    <div className="inline-block">
                        <Form.Item className="margin-none" form={form} name="task_begin_time" label="任务开始时间">
                            <Input className="input-small"/>
                        </Form.Item>
                        <span className="ant-col ant-form-item-label config-colon">-</span>
                        <Form.Item form={form} name="task_end_time">
                            <Input className="input-small"/>
                        </Form.Item>
                    </div>
                    <div className="inline-block">
                        <Form.Item className="margin-none" form={form} name="task_create_time1" label="任务创建时间">
                            <Input className="input-small"/>
                        </Form.Item>
                        <span className="ant-col ant-form-item-label config-colon">-</span>
                        <Form.Item form={form} name="task_create_time2">
                            <Input className="input-small"/>
                        </Form.Item>
                    </div>
                </Form>
            </React.Fragment>
        )
    }
}

const TaskSearch = Form.create<ITaskSearchProps>()(_TaskSearch);

export default TaskSearch;

export {_TaskSearch};

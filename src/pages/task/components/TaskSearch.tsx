import React from 'react';
import { Form } from '@/components/Form';
import { DatePicker, Input, Select } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import '@/styles/config.less';
import { TaskRangeList, TaskStatus, TaskStatusList, TaskType } from '@/enums/ConfigEnum';
import { Bind } from 'lodash-decorators';
import moment, { Moment } from 'moment';

export declare interface IFormData {
    task_id?: string;
    task_name?: string;
    task_range?: string;
    task_status?: string;
    task_begin_time?: string;
    task_end_time?: string;
    task_create_time1?: string;
    task_create_time2?: string;
}

declare interface ITaskSearchProps extends FormComponentProps<IFormData> {
    task_status: TaskStatus;
}

const Option = Select.Option;

class _TaskSearch extends Form.BaseForm<ITaskSearchProps> {
    @Bind
    private disabledStartDate(startTime: Moment | null) {
        const { form } = this.props;
        const endTime = form.getFieldValue('task_end_time');
        if (!startTime || !endTime) {
            return false;
        }
        return startTime.valueOf() > endTime.valueOf();
    }

    @Bind
    private disabledEndDate(endTime: Moment | null) {
        const { form } = this.props;
        const startTime = form.getFieldValue('task_begin_time');
        if (!endTime || !startTime) {
            return false;
        }
        return startTime.valueOf() > endTime.valueOf();
    }

    @Bind
    private disabledCreateStartDate(startTime: Moment | null) {
        const { form } = this.props;
        const endTime = form.getFieldValue('task_create_time2');
        if (!startTime || !endTime) {
            return false;
        }
        return startTime.valueOf() > endTime.valueOf();
    }

    @Bind
    private disabledCreateEndDate(endTime: Moment | null) {
        const { form } = this.props;
        const startTime = form.getFieldValue('task_create_time1');
        if (!endTime || !startTime) {
            return false;
        }
        return startTime.valueOf() > endTime.valueOf();
    }
    render() {
        const { form, task_status } = this.props;

        const taskRangeSelections=[];
        for (let key in TaskRangeList){
            const value = Number(key);
            taskRangeSelections.push(<Option key={value} value={value}>{TaskRangeList[value]}</Option>);
        }
        const taskStatusSelections=[];
        for (let key in TaskStatusList){
            const value = Number(key);
            taskStatusSelections.push(<Option key={value} value={value}>{TaskStatusList[value]}</Option>);
        }

        return (
            <React.Fragment>
                <Form className="config-card" layout="inline" autoComplete={'off'}>
                    <Form.Item form={form} name="task_id" label="任务&emsp;ID">
                        <Input className="input-equal-date" />
                    </Form.Item>
                    <Form.Item form={form} name="task_name" label="任务名称">
                        <Input className="input-equal-date" />
                    </Form.Item>
                    <Form.Item form={form} name="task_range" label="任务范围" initialValue={1}>
                        <Select className="select-equal-date">
                            {
                                taskRangeSelections
                            }
                        </Select>
                    </Form.Item>
                    {task_status === TaskStatus.All && (
                        <Form.Item form={form} name="task_status" label="任务状态" initialValue={0}>
                            <Select className="select-equal-date">
                                {
                                    taskStatusSelections
                                }
                            </Select>
                        </Form.Item>
                    )}
                    <div className="inline-block">
                        <Form.Item
                            className="margin-none"
                            form={form}
                            name="task_begin_time"
                            label="开始时间"
                        >
                            <DatePicker
                                className="input-small"
                                disabledDate={this.disabledStartDate}
                            />
                        </Form.Item>
                        <span className="ant-col ant-form-item-label config-colon">-</span>
                        <Form.Item form={form} name="task_end_time">
                            <DatePicker
                                className="input-small"
                                disabledDate={this.disabledEndDate}
                            />
                        </Form.Item>
                    </div>
                    <div className="inline-block">
                        <Form.Item
                            className="margin-none"
                            form={form}
                            name="task_create_time1"
                            label="创建时间"
                        >
                            <DatePicker
                                className="input-small"
                                disabledDate={this.disabledCreateStartDate}
                            />
                        </Form.Item>
                        <span className="ant-col ant-form-item-label config-colon">-</span>
                        <Form.Item form={form} name="task_create_time2">
                            <DatePicker
                                className="input-small"
                                disabledDate={this.disabledCreateEndDate}
                            />
                        </Form.Item>
                    </div>
                </Form>
            </React.Fragment>
        );
    }
}

const TaskSearch = Form.create<ITaskSearchProps>()(_TaskSearch);

export default TaskSearch;

export { _TaskSearch };

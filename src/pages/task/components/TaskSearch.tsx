import React, { RefObject } from 'react';
import { DatePicker, Input, Select, Form } from 'antd';
import '@/styles/config.less';
import '@/styles/task.less';
import { TaskRangeList, TaskStatus, TaskStatusList, TaskType } from '@/enums/ConfigEnum';
import { Bind } from 'lodash-decorators';
import { Moment } from 'moment';
import { transEndDate, transStartDate } from '@/utils/date';
import { FormInstance } from 'antd/es/form';

export declare interface IFormData {
    task_id?: string;
    task_name?: string;
    task_range?: string;
    task_status?: string;
    task_begin_time?: number;
    task_end_time?: number;
    task_create_time1?: number;
    task_create_time2?: number;
}

declare interface ITaskSearchProps{
    task_status: TaskStatus;
}

const Option = Select.Option;

class TaskSearch extends React.PureComponent<ITaskSearchProps> {
    private formRef:RefObject<FormInstance> = React.createRef();
    @Bind
    private disabledStartDate(startTime: Moment | null) {
        const endTime = this.formRef.current!.getFieldValue('task_end_time');
        if (!startTime || !endTime) {
            return false;
        }
        return startTime.valueOf() > endTime.valueOf();
    }

    @Bind
    private disabledEndDate(endTime: Moment | null) {
        const startTime = this.formRef.current!.getFieldValue('task_begin_time');
        if (!endTime || !startTime) {
            return false;
        }
        return startTime.valueOf() > endTime.valueOf();
    }

    @Bind
    private disabledCreateStartDate(startTime: Moment | null) {
        const endTime = this.formRef.current!.getFieldValue('task_create_time2');
        if (!startTime || !endTime) {
            return false;
        }
        return startTime.valueOf() > endTime.valueOf();
    }

    @Bind
    private disabledCreateEndDate(endTime: Moment | null) {
        const startTime = this.formRef.current!.getFieldValue('task_create_time1');
        if (!endTime || !startTime) {
            return false;
        }
        return startTime.valueOf() > endTime.valueOf();
    }

    @Bind
    public getFieldsValue(fieldsName?:string[]){
        const {task_begin_time,task_end_time,task_create_time1,task_create_time2,...extra} = this.formRef.current!.getFieldsValue(fieldsName);
        return {
            ...extra,
            task_begin_time:transStartDate(task_begin_time),
            task_end_time:transEndDate(task_end_time),
            task_create_time1:transStartDate(task_create_time1),
            task_create_time2:transEndDate(task_create_time2)
        }
    }
    render() {
        const { task_status } = this.props;

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
                <Form
                    ref={this.formRef}
                    layout="inline"
                    autoComplete={'off'}
                    initialValues={{
                        task_range:1,
                        task_status:0
                    }}
                >
                    <Form.Item
                        name="task_id"
                        label={<span>任务<span className="task-justify-1">ID</span></span>}
                        className="form-item"
                    >
                        <Input className="input-equal-date" />
                    </Form.Item>
                    <Form.Item
                        name="task_name"
                        label="任务名称"
                        className="form-item"
                    >
                        <Input className="input-equal-date" />
                    </Form.Item>
                    <Form.Item
                        name="task_range"
                        label="任务范围"
                        className="form-item"
                    >
                        <Select className="select-equal-date">
                            {
                                taskRangeSelections
                            }
                        </Select>
                    </Form.Item>
                    {task_status === TaskStatus.All && (
                        <Form.Item
                            name="task_status"
                            label="任务状态"
                            className="form-item"
                        >
                            <Select className="select-equal-date">
                                {
                                    taskStatusSelections
                                }
                            </Select>
                        </Form.Item>
                    )}
                    <Form.Item
                       label="开始时间"
                       className="form-item"
                    >
                        <Form.Item
                            name="task_begin_time"
                            noStyle={true}
                        >
                            <DatePicker
                                className="picker-small"
                                disabledDate={this.disabledStartDate}
                            />
                        </Form.Item>
                        <span className="config-colon">-</span>
                        <Form.Item
                            name="task_end_time"
                            noStyle={true}
                        >
                            <DatePicker
                                className="picker-small"
                                disabledDate={this.disabledEndDate}
                            />
                        </Form.Item>
                    </Form.Item>
                    <Form.Item
                        label="创建时间"
                        className="form-item"
                    >
                        <Form.Item
                            name="task_create_time1"
                            noStyle={true}
                        >
                            <DatePicker
                                className="picker-small"
                                disabledDate={this.disabledCreateStartDate}
                            />
                        </Form.Item>
                        <span className="config-colon">-</span>
                        <Form.Item
                            name="task_create_time2"
                            noStyle={true}
                        >
                            <DatePicker
                                className="picker-small"
                                disabledDate={this.disabledCreateEndDate}
                            />
                        </Form.Item>
                    </Form.Item>
                </Form>
            </React.Fragment>
        );
    }
}

export default TaskSearch;

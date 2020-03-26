import React, { RefObject } from 'react';
import { Input, Select, Form } from 'antd';
import '@/styles/config.less';
import { FormInstance } from 'antd/es/form';

declare interface ITaskSearchProps {}

const Option = Select.Option;

class DraftSearch extends React.PureComponent<ITaskSearchProps> {
    private formRef: RefObject<FormInstance> = React.createRef();
    render() {
        return (
            <React.Fragment>
                <Form layout="inline" autoComplete={'off'} ref={this.formRef}>
                    <Form.Item className="form-item" name="taskId" label="任务名称">
                        <Input className="input-default" />
                    </Form.Item>
                    <Form.Item className="form-item" name="scope" label="任务范围">
                        <Select className="select-default">
                            <Option value="1">女装</Option>
                            <Option value="2">男装</Option>
                            <Option value="3">鞋子</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item className="form-item" name="taskStatus" label="任务状态">
                        <Select className="select-default">
                            <Option value="1">女装</Option>
                            <Option value="2">男装</Option>
                            <Option value="3">鞋子</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item label="任务创建时间" className="form-item">
                        <Form.Item noStyle={true} name="createStartTime">
                            <Input className="input-small" />
                        </Form.Item>
                        <span className="config-colon">-</span>
                        <Form.Item noStyle={true} name="createEndTime">
                            <Input className="input-small" />
                        </Form.Item>
                    </Form.Item>
                </Form>
            </React.Fragment>
        );
    }
}

export default DraftSearch;

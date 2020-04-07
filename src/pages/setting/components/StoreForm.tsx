import React, { RefObject } from 'react';
import { Bind } from 'lodash-decorators';
import { Button, Card, Divider, Input, Form } from 'antd';
import '@/styles/setting.less';
import { FormInstance } from 'antd/es/form';
import { IntegerInput } from 'react-components';

declare interface IStore {
    name?: string;
    id?: number;
    link?: string;
}

export declare interface IFormData {
    list: IStore[];
}

declare interface IStoreFormProps {}

declare interface IStoreFormState {
    gatherLoading: boolean;
    groundLoading: boolean;
    list: number[];
}

class StoreForm extends React.PureComponent<IStoreFormProps, IStoreFormState> {
    private formRef: RefObject<FormInstance> = React.createRef();
    constructor(props: IStoreFormProps) {
        super(props);
        this.state = {
            gatherLoading: false,
            groundLoading: false,
            list: [1],
        };
    }
    @Bind
    private convertFormData(values: IFormData) {
        /*   const {range,shopId,onceStartTime,timerStartTime,day=0,second,taskIntervalType,task_type,task_end_time,...extra} = values;
        return {
            ...extra,
            task_type,
            range:range===TaskRange.store?shopId:range,
            task_start_time:task_type===TaskType.once?
                onceStartTime?.valueOf()??undefined:
                timerStartTime?.valueOf()??undefined,
            ...task_type===TaskType.once?{}:{
                task_interval_seconds:taskIntervalType===TaskIntervalType.second?second:day*60*60*24
            },
            task_end_time:task_end_time?.valueOf()??undefined
        }*/
        return values;
    }
    @Bind
    private onGather(is_upper_shelf: boolean = false) {}
    @Bind
    private onStartGather() {
        this.onGather();
    }
    @Bind
    private onAcquisitionRack() {
        this.onGather(true);
    }
    render() {
        const { gatherLoading, groundLoading, list } = this.state;
        return (
            <Form className="form-help-absolute" layout="horizontal" autoComplete={'off'}>
                {list.map((item: any, index: number) => {
                    return (
                        <Card key={index} className="setting-card card-divider">
                            <Divider orientation="left">{`关联店铺${index + 1}`}：</Divider>
                            <Form.Item
                                className="block form-item"
                                validateTrigger={'onBlur'}
                                name={`list[${index}].name`}
                                label="店铺名称"
                            >
                                <Input
                                    type="text"
                                    className="input-large"
                                    spellCheck={'false'}
                                    placeholder=""
                                />
                            </Form.Item>
                            <Form.Item
                                className="block form-item"
                                validateTrigger={'onBlur'}
                                name={`list[${index}].id`}
                                label="店铺&emsp;ID"
                            >
                                <IntegerInput min={0} className="input-large input-handler" />
                            </Form.Item>
                            <Form.Item
                                className="block form-item"
                                validateTrigger={'onBlur'}
                                name={`list[${index}].link`}
                                label="店铺链接"
                            >
                                <Input
                                    className="input-large"
                                    spellCheck={'false'}
                                    placeholder=""
                                />
                            </Form.Item>
                        </Card>
                    );
                })}
                <div className="form-item">
                    <Button
                        loading={gatherLoading}
                        type="primary"
                        className="btn-default"
                        onClick={this.onStartGather}
                    >
                        开始采集
                    </Button>
                    <Button
                        loading={groundLoading}
                        type="primary"
                        className="btn-default"
                        onClick={this.onAcquisitionRack}
                    >
                        一键采集上架
                    </Button>
                </div>
            </Form>
        );
    }
}

export default StoreForm;

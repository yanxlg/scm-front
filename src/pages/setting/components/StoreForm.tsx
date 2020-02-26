import React, { RefObject } from 'react';
import { Bind } from 'lodash-decorators';
import { Button, Card, Divider, Input, InputNumber, Modal, Form } from 'antd';
import '@/styles/setting.less';
import '@/styles/form.less';
import GatherFailureModal from '@/pages/task/components/GatherFailureModal';
import { addPddHotTask } from '@/services/task';
import GatherSuccessModal from '@/pages/task/components/GatherSuccessModal';
import { intFormatter } from '@/utils/common';
import { FormInstance } from 'antd/es/form';

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
    private onGather(is_upper_shelf: boolean = false) {
        this.formRef
            .current!.validateFields()
            .then((values: any) => {
                const params = this.convertFormData(values);
                this.setState(
                    is_upper_shelf
                        ? {
                              groundLoading: true,
                              gatherLoading: false,
                          }
                        : {
                              gatherLoading: true,
                              groundLoading: false,
                          },
                );
                addPddHotTask(
                    Object.assign({}, params, {
                        is_upper_shelf: is_upper_shelf,
                    }),
                )
                    .then(({ data: { task_id = -1 } = {} } = {}) => {
                        Modal.info({
                            content: (
                                <GatherSuccessModal
                                    taskId={task_id}
                                    onClick={() => {
                                        Modal.destroyAll();
                                    }}
                                />
                            ),
                            className: 'modal-empty',
                            icon: null,
                            maskClosable: true,
                        });
                    })
                    .catch(() => {
                        Modal.info({
                            content: (
                                <GatherFailureModal
                                    onClick={() => {
                                        Modal.destroyAll();
                                        this.onGather(is_upper_shelf);
                                    }}
                                />
                            ),
                            className: 'modal-empty',
                            icon: null,
                            maskClosable: true,
                        });
                    })
                    .finally(() => {
                        this.setState({
                            gatherLoading: false,
                            groundLoading: false,
                        });
                    });
            })
            .catch(({ errorFields }) => {
                this.formRef.current!.scrollToField(errorFields[0].name, {
                    scrollMode: 'if-needed',
                    behavior: actions => {
                        if (!actions || actions.length === 0) {
                            return;
                        }
                        const [{ top }] = actions;
                        const to = Math.max(top - 80, 0);
                        window.scrollTo({
                            top: to,
                            behavior: 'smooth',
                        });
                    },
                });
            });
    }
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
                                <InputNumber
                                    min={0}
                                    className="input-large input-handler"
                                    formatter={intFormatter}
                                />
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

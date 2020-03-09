import React from 'react';
import { Button, Card, Descriptions, Modal, Steps, Tabs, Spin } from 'antd';
import SubTaskView from '@/pages/task/components/SubTaskView';
import '@/styles/index.less';
import '@/styles/form.less';
import '@/styles/task.less';
import '@/styles/card.less';
import { RouteComponentProps } from 'dva/router';
import { queryTaskDetail } from '@/services/task';
import { Bind } from 'lodash-decorators';
import { ITaskDetailInfo } from '@/interface/ITask';
import {
    TaskExecuteType,
    TaskRangeEnum,
    TaskRangeMap,
    TaskStatusMap,
    TaskTypeEnum,
    TaskTypeMap,
} from '@/enums/StatusEnum';
import URLGather from '@/pages/task/components/editor/URLGather';
import HotGather from '../components/editor/HotGather';
import { utcToLocal } from '@/utils/date';
import TimerUpdate from '../components/editor/TimerUpdate';
import { EmptyObject } from '@/config/global';

const { TabPane } = Tabs;
const { Step } = Steps;

type TaskDetailPageProps = RouteComponentProps<{ id: string }>;

declare interface ITaskDetailPagePropsState {
    detail?: ITaskDetailInfo;
    loading: boolean;
}

class TaskDetailPage extends React.PureComponent<TaskDetailPageProps, ITaskDetailPagePropsState> {
    private readonly taskId: number;
    constructor(props: TaskDetailPageProps) {
        super(props);
        this.taskId = Number(props.match.params.id);
        this.state = {
            loading: true,
        };
    }
    @Bind
    private queryDetail(taskId: number) {
        queryTaskDetail(taskId)
            .then(({ data: { task_detail_info = EmptyObject } = {} } = EmptyObject) => {
                this.setState({
                    detail: task_detail_info,
                });
            })
            .finally(() => {
                this.setState({
                    loading: false,
                });
            });
    }
    @Bind
    private copyTask() {
        // task_range 分别弹不同的弹窗
        const task_id = this.taskId;
        const { detail = EmptyObject } = this.state;
        const { sub_cat_id } = detail!;
        switch (sub_cat_id) {
            case TaskRangeEnum.URL:
                // url
                Modal.info({
                    content: <URLGather taskId={task_id} />,
                    className: 'modal-empty config-modal-hot',
                    icon: null,
                    maskClosable: true,
                });
                break;
            case TaskRangeEnum.FullStack:
            case TaskRangeEnum.Store:
                Modal.info({
                    content: <HotGather taskId={task_id} />,
                    className: 'modal-empty config-modal-hot',
                    icon: null,
                    maskClosable: true,
                });
                break;
            case TaskRangeEnum.AllOnShelf:
            case TaskRangeEnum.SalesOnShelves:
                Modal.info({
                    content: <TimerUpdate taskId={task_id} />,
                    className: 'modal-empty config-modal-hot',
                    icon: null,
                    maskClosable: true,
                });
                break;
            /*       case '4':
            case '5':
                Modal.info({
                    content: <TimerUpdate taskId={task_id} />,
                    className: 'modal-empty config-modal-hot',
                    icon: null,
                    maskClosable: true,
                });
                break;
            case '6':
                Modal.info({
                    content: <AutoPurchaseTask taskId={task_id} />,
                    className: 'modal-empty config-modal-hot',
                    icon: null,
                    maskClosable: true,
                });
                break;*/
            default:
                break;
        }
    }
    componentDidMount(): void {
        this.queryDetail(this.taskId);
    }

    private getTimeIntervalString(time_interval?: number) {
        if (time_interval === void 0) {
            return '--';
        }
        const timeInterval = Number(time_interval);
        const isDay = timeInterval % 86400 === 0;
        return time_interval === void 0
            ? undefined
            : isDay
            ? `${timeInterval / 86400}天`
            : `${timeInterval}秒`;
    }
    render() {
        const { detail = {} as ITaskDetailInfo, loading } = this.state;
        const category = detail.category_level_one;
        const {
            task_name = '',
            task_type,
            sub_cat_id,
            time_interval,
            status,
            sort_type_name,
            cat_name,
            task_cycle,
            price_min,
            price_max,
            sales_volume_min,
            sales_volume_max,
            task_end_time,
            task_start_time,
        } = detail;
        return (
            <div className="body-transparent">
                <Card
                    loading={loading}
                    title={
                        <Spin spinning={loading}>
                            {task_name
                                ? `【${TaskTypeMap[task_type!] ?? ''}】${task_name} - ${
                                      task_cycle === TaskExecuteType.once ? '单次' : '定时'
                                  } - ${this.taskId} - ${TaskStatusMap[status] ?? ''}`
                                : null}
                        </Spin>
                    }
                    className="card-nobody"
                />
                <Card className="task-body">
                    <Card loading={loading}>
                        {/* <div className="flex">
                            <div className="task-progress-tag">
                                任 务
                                <br />进 度
                            </div>
                            <Steps size="small" current={1} className="flex-1">
                                <Step title="任务创建" description="子任务id: 3333" />
                                <Step title="上架中" />
                                <Step title="上架完成" />
                            </Steps>
                            <Button type="primary" ghost={true} size="large" className="task-btn">
                                查看任务进度
                            </Button>
                        </div>*/}
                        {task_type === TaskTypeEnum.Gather ? (
                            <Descriptions column={1} className="task-desc" size="small">
                                <Descriptions.Item label="任务SN">
                                    {detail.task_sn}
                                </Descriptions.Item>
                                <Descriptions.Item label="任务名称">
                                    {detail.task_name}
                                </Descriptions.Item>
                                <Descriptions.Item label="任务范围">
                                    {TaskRangeMap[sub_cat_id]}
                                </Descriptions.Item>
                                <Descriptions.Item label="排序类型">
                                    {sort_type_name}
                                </Descriptions.Item>
                                <Descriptions.Item label="爬虫条件">
                                    {category ? '指定类目' : '指定关键词'}
                                </Descriptions.Item>
                                {category ? (
                                    <Descriptions.Item label="类目">{cat_name}</Descriptions.Item>
                                ) : (
                                    <Descriptions.Item label="关键词">
                                        {detail.keywords}
                                    </Descriptions.Item>
                                )}
                                <Descriptions.Item label="爬取页数">
                                    {detail.grab_page_count}
                                </Descriptions.Item>
                                <Descriptions.Item label="爬取数量">
                                    {detail.grab_count_max}
                                </Descriptions.Item>
                                <Descriptions.Item label="销量区间">
                                    {sales_volume_min === void 0
                                        ? '--'
                                        : `${sales_volume_min}-${sales_volume_max}`}
                                </Descriptions.Item>
                                <Descriptions.Item label="价格区间(￥)">
                                    {price_min === void 0 ? '--' : `${price_min}-${price_max}`}
                                </Descriptions.Item>
                                <Descriptions.Item label="任务周期">
                                    {task_cycle === TaskExecuteType.once
                                        ? '一次性任务'
                                        : '定时任务'}
                                </Descriptions.Item>
                                <Descriptions.Item label="任务开始时间">
                                    {utcToLocal(task_start_time)}
                                </Descriptions.Item>
                                {task_cycle === TaskExecuteType.once ? null : (
                                    <Descriptions.Item label="任务结束时间">
                                        {utcToLocal(task_end_time)}
                                    </Descriptions.Item>
                                )}
                                {task_cycle === TaskExecuteType.once ? null : (
                                    <Descriptions.Item label="任务间隔">
                                        {this.getTimeIntervalString(time_interval)}
                                    </Descriptions.Item>
                                )}
                            </Descriptions>
                        ) : task_type === TaskTypeEnum.Grounding ? (
                            <Descriptions column={1} className="task-desc">
                                <Descriptions.Item label="任务SN">
                                    {detail.task_sn}
                                </Descriptions.Item>
                                <Descriptions.Item label="任务名称">
                                    {detail.task_name}
                                </Descriptions.Item>
                                <Descriptions.Item label="任务范围">
                                    {TaskRangeMap[sub_cat_id]}
                                </Descriptions.Item>
                                <Descriptions.Item label="任务周期">
                                    {task_cycle === TaskExecuteType.once
                                        ? '一次性任务'
                                        : '定时任务'}
                                </Descriptions.Item>
                                <Descriptions.Item label="任务开始时间">
                                    {utcToLocal(task_start_time)}
                                </Descriptions.Item>
                            </Descriptions>
                        ) : task_type === TaskTypeEnum.Update ? (
                            <Descriptions column={1} className="task-desc">
                                <Descriptions.Item label="任务SN">
                                    {detail.task_sn}
                                </Descriptions.Item>
                                <Descriptions.Item label="任务名称">
                                    {detail.task_name}
                                </Descriptions.Item>
                                <Descriptions.Item label="商品范围">
                                    {TaskRangeMap[sub_cat_id]
                                        ? `${TaskRangeMap[sub_cat_id]}商品`
                                        : ''}
                                </Descriptions.Item>
                                <Descriptions.Item label="任务时间">
                                    {utcToLocal(task_start_time)} - {utcToLocal(task_end_time)}
                                </Descriptions.Item>
                                <Descriptions.Item label="任务间隔">
                                    {this.getTimeIntervalString(time_interval)}
                                </Descriptions.Item>
                            </Descriptions>
                        ) : null}
                        {(task_type === TaskTypeEnum.Gather ||
                            task_type === TaskTypeEnum.Update) && (
                            <Button
                                className="task-btn-copy"
                                type="primary"
                                size="large"
                                ghost={true}
                                onClick={this.copyTask}
                            >
                                复制创建新任务
                            </Button>
                        )}
                    </Card>
                    <Tabs
                        className="tabs-margin-none form-item"
                        type="card"
                        defaultActiveKey="1"
                        children={[
                            <TabPane tab="子任务进度" key="1">
                                <SubTaskView task_Id={this.taskId} task_type={task_type} />
                            </TabPane>,
                            /*<TabPane tab="任务日志" key="2">
                                <TaskLogView task_Id={this.taskId} />
                            </TabPane>,*/
                        ]}
                    />
                </Card>
            </div>
        );
    }
}

export default TaskDetailPage;

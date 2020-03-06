import React from 'react';
import { Button, Card, Descriptions, Modal, Steps, Tabs } from 'antd';
import SubTaskView from '@/pages/task/components/SubTaskView';
import '@/styles/index.less';
import '@/styles/form.less';
import '@/styles/task.less';
import '@/styles/card.less';
import { RouteComponentProps } from 'dva/router';
import { queryTaskDetail } from '@/services/task';
import { Bind } from 'lodash-decorators';
import { ITaskDetailInfo } from '@/interface/ITask';
import { TaskExecuteType } from '@/enums/StatusEnum';
import { EmptyObject } from '@/enums/ConfigEnum';
import GatherSuccessModal from '@/pages/task/components/modal/GatherSuccessModal';
import URLGather from '@/pages/task/components/editor/URLGather';
import HotGather from '../components/editor/HotGather';
import TimerUpdate from '../components/editor/TimerUpdate';
import AutoPurchaseTask from '@/pages/task/components/editor/AutoPurchaseTask';

const { TabPane } = Tabs;
const { Step } = Steps;

type TaskDetailPageProps = RouteComponentProps<{ id: string }>;

declare interface ITaskDetailPagePropsState {
    detail?: ITaskDetailInfo;
}

class TaskDetailPage extends React.PureComponent<TaskDetailPageProps, ITaskDetailPagePropsState> {
    private readonly taskId: number;
    constructor(props: TaskDetailPageProps) {
        super(props);
        this.taskId = Number(props.match.params.id);
        this.state = {};
    }
    @Bind
    private queryDetail(taskId: number) {
        queryTaskDetail(taskId).then(
            ({ data: { task_detail_info = EmptyObject } = {} } = EmptyObject) => {
                this.setState({
                    detail: task_detail_info,
                });
            },
        );
    }
    @Bind
    private copyTask() {
        // task_range 分别弹不同的弹窗
        const task_id = this.taskId;
        const { detail = EmptyObject } = this.state;
        const { task_range } = detail!;
        switch (task_range) {
            case '1':
                // url
                Modal.info({
                    content: <URLGather taskId={task_id} />,
                    className: 'modal-empty config-modal-hot',
                    icon: null,
                    maskClosable: true,
                });
                break;
            case '2':
            case '3':
                Modal.info({
                    content: <HotGather taskId={task_id} />,
                    className: 'modal-empty config-modal-hot',
                    icon: null,
                    maskClosable: true,
                });
                break;
            case '4':
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
                break;
            default:
                break;
        }
    }
    componentDidMount(): void {
        this.queryDetail(this.taskId);
    }

    render() {
        const { detail = {} as ITaskDetailInfo } = this.state;
        const type = detail.type;
        const category = detail.category_level_one;
        return (
            <div className="body-transparent">
                <Card title="【采集任务】啦啦啦 - 定时 - 333 - 执行中" className="card-nobody" />
                <Card className="form-item">
                    <Card>
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
                        {type === 0 ? (
                            <Descriptions column={1} className="form-item task-desc">
                                <Descriptions.Item label="任务SN">
                                    {detail.task_sn}
                                </Descriptions.Item>
                                <Descriptions.Item label="任务名称">
                                    {detail.task_name}
                                </Descriptions.Item>
                                <Descriptions.Item label="任务范围">
                                    {detail.range === 0 ? '全站' : '指定店铺'}
                                </Descriptions.Item>
                                <Descriptions.Item label="排序类型">empty</Descriptions.Item>
                                <Descriptions.Item label="爬虫条件">
                                    {category ? '指定类目' : '指定关键词'}
                                </Descriptions.Item>
                                {category ? (
                                    <Descriptions.Item label="类目">
                                        {detail.keywords}
                                    </Descriptions.Item>
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
                                    {detail.sales_volume_min}-{detail.sales_volume_max}
                                </Descriptions.Item>
                                <Descriptions.Item label="价格区间(￥)">
                                    {detail.price_min}-{detail.price_min}
                                </Descriptions.Item>
                                <Descriptions.Item label="任务周期">
                                    {detail.task_type === TaskExecuteType.once
                                        ? '一次性任务'
                                        : '定时任务'}
                                </Descriptions.Item>
                                <Descriptions.Item label="任务开始时间">
                                    {detail.task_start_time}
                                </Descriptions.Item>
                            </Descriptions>
                        ) : type === 1 ? (
                            <Descriptions column={1} className="form-item task-desc">
                                <Descriptions.Item label="任务SN">
                                    {detail.task_sn}
                                </Descriptions.Item>
                                <Descriptions.Item label="任务名称">
                                    {detail.task_name}
                                </Descriptions.Item>
                                <Descriptions.Item label="任务范围">
                                    {detail.update_type === 2 ? '' : '指定店铺'}
                                </Descriptions.Item>
                                <Descriptions.Item label="任务周期">
                                    {detail.task_type === TaskExecuteType.once
                                        ? '一次性任务'
                                        : '定时任务'}
                                </Descriptions.Item>
                                <Descriptions.Item label="任务开始时间">
                                    {detail.task_start_time}
                                </Descriptions.Item>
                            </Descriptions>
                        ) : type === 2 ? (
                            <Descriptions column={1} className="form-item task-desc">
                                <Descriptions.Item label="任务SN">
                                    {detail.task_sn}
                                </Descriptions.Item>
                                <Descriptions.Item label="任务名称">
                                    {detail.task_name}
                                </Descriptions.Item>
                                <Descriptions.Item label="商品范围">
                                    {detail.update_type === 2
                                        ? '全部已上架商品'
                                        : '有销量的已上架商品'}
                                </Descriptions.Item>
                                <Descriptions.Item label="任务时间">
                                    {detail.task_start_time}
                                </Descriptions.Item>
                                <Descriptions.Item label="任务间隔">
                                    {detail.time_interval}
                                </Descriptions.Item>
                            </Descriptions>
                        ) : null}
                        <Button
                            className="task-btn-copy"
                            type="primary"
                            size="large"
                            ghost={true}
                            onClick={this.copyTask}
                        >
                            复制创建新任务
                        </Button>
                    </Card>
                    <Tabs
                        className="tabs-margin-none form-item"
                        type="card"
                        defaultActiveKey="1"
                        children={[
                            <TabPane tab="子任务进度" key="1">
                                <SubTaskView task_Id={this.taskId} />
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

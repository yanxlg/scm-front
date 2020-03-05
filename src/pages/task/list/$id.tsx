import React from 'react';
import { Button, Card, Descriptions, Steps, Tabs } from 'antd';
import TaskLogView from '@/pages/task/components/TaskLogView';
import SubTaskView from '@/pages/task/components/SubTaskView';
import '@/styles/index.less';
import '@/styles/form.less';
import '@/styles/task.less';
import '@/styles/card.less';
import { RouteComponentProps } from 'dva/router';
import { queryTaskDetail } from '@/services/task';
import { Bind } from 'lodash-decorators';
import { ITaskDetail } from '@/interface/ITask';
import { TaskExecuteType } from '@/enums/StatusEnum';

const { TabPane } = Tabs;
const { Step } = Steps;

type TaskDetailPageProps = RouteComponentProps<{ id: string }>;

declare interface ITaskDetailPagePropsState {
    detail?: ITaskDetail;
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
        queryTaskDetail(taskId).then(({ data: { task_detail_info = {} } = {} } = {}) => {
            this.setState({
                detail: task_detail_info,
            });
        });
    }
    componentDidMount(): void {
        this.queryDetail(this.taskId);
    }

    render() {
        const { detail = {} as ITaskDetail } = this.state;
        return (
            <div className="body-transparent">
                <Card title="【采集任务】啦啦啦 - 定时 - 333 - 执行中" className="card-nobody" />
                <Card className="form-item">
                    <Card>
                        <div className="flex">
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
                        </div>

                        <Descriptions column={1} className="form-item task-desc">
                            <Descriptions.Item label="任务SN">{detail.task_sn}</Descriptions.Item>
                            <Descriptions.Item label="任务名称">
                                {detail.task_name}
                            </Descriptions.Item>
                            <Descriptions.Item label="任务范围">
                                Hangzhou, Zhejiang
                            </Descriptions.Item>
                            <Descriptions.Item label="排序类型">empty</Descriptions.Item>
                            <Descriptions.Item label="爬虫条件">
                                No. 18, Wantang Road, Xihu District, Hangzhou, Zhejiang, China
                            </Descriptions.Item>
                            <Descriptions.Item label="关键词">{detail.keywords}</Descriptions.Item>
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
                        <Button className="task-btn-copy" type="primary" size="large" ghost={true}>
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
                            <TabPane tab="任务日志" key="2">
                                <TaskLogView task_Id={this.taskId} />
                            </TabPane>,
                        ]}
                    />
                </Card>
            </div>
        );
    }
}

export default TaskDetailPage;

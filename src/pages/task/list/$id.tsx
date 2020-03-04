import React from 'react';
import { Card, Steps, Tabs, Descriptions, Button } from 'antd';
import TaskLogView from '@/pages/task/components/TaskLogView';
import SubTaskView from '@/pages/task/components/SubTaskView';
import '@/styles/index.less';
import '@/styles/form.less';
import '@/styles/task.less';
import { RouteComponentProps } from 'dva/router';

const { TabPane } = Tabs;
const { Step } = Steps;

type TaskDetailPageProps = RouteComponentProps<{ id: string }>;

class TaskDetailPage extends React.PureComponent<TaskDetailPageProps> {
    private readonly taskId: number;
    constructor(props: TaskDetailPageProps) {
        super(props);
        this.taskId = Number(props.match.params.id);
    }
    componentDidMount(): void {}

    render() {
        return (
            <div>
                <Card>【采集任务】啦啦啦 - 定时 - 333 - 执行中</Card>
                <Card>
                    <Card>
                        <div className="flex">
                            <div className="task-progress-tag">任务进度</div>
                            <Steps current={1}>
                                <Step title="Finished" description="This is a description." />
                                <Step
                                    title="In Progress"
                                    subTitle="Left 00:00:08"
                                    description="This is a description."
                                />
                                <Step title="Waiting" description="This is a description." />
                            </Steps>
                            <Button>查看任务进度</Button>
                        </div>

                        <Descriptions column={1}>
                            <Descriptions.Item label="任务SN">Zhou Maomao</Descriptions.Item>
                            <Descriptions.Item label="任务名称">1810000000</Descriptions.Item>
                            <Descriptions.Item label="任务范围">
                                Hangzhou, Zhejiang
                            </Descriptions.Item>
                            <Descriptions.Item label="排序类型">empty</Descriptions.Item>
                            <Descriptions.Item label="爬虫条件">
                                No. 18, Wantang Road, Xihu District, Hangzhou, Zhejiang, China
                            </Descriptions.Item>
                            <Descriptions.Item label="关键词">
                                No. 18, Wantang Road, Xihu District, Hangzhou, Zhejiang, China
                            </Descriptions.Item>
                            <Descriptions.Item label="爬取页数">
                                No. 18, Wantang Road, Xihu District, Hangzhou, Zhejiang, China
                            </Descriptions.Item>
                            <Descriptions.Item label="爬取数量">
                                No. 18, Wantang Road, Xihu District, Hangzhou, Zhejiang, China
                            </Descriptions.Item>
                            <Descriptions.Item label="销量区间">
                                No. 18, Wantang Road, Xihu District, Hangzhou, Zhejiang, China
                            </Descriptions.Item>
                            <Descriptions.Item label="价格区间(￥)">
                                No. 18, Wantang Road, Xihu District, Hangzhou, Zhejiang, China
                            </Descriptions.Item>
                            <Descriptions.Item label="任务周期">
                                No. 18, Wantang Road, Xihu District, Hangzhou, Zhejiang, China
                            </Descriptions.Item>
                            <Descriptions.Item label="任务开始时间">
                                No. 18, Wantang Road, Xihu District, Hangzhou, Zhejiang, China
                            </Descriptions.Item>
                        </Descriptions>
                        <Button>复制创建新任务</Button>
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

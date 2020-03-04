import React from 'react';
import '@/styles/task.less';
import { Card, Tabs } from 'antd';
import HotGather from '@/pages/task/components/HotGather';
import TimerUpdate from '@/pages/task/components/TimerUpdate';

const { TabPane } = Tabs;

class TaskDetailPage extends React.PureComponent {
    render() {
        return (
            <div>
                <Card>【采集任务】啦啦啦 - 定时 - 333 - 执行中</Card>
                <Card>
                    <Card>
                        <div>任务SN：</div>
                        <div>任务名称：</div>
                        <div>任务范围：</div>
                        <div>排序类型：</div>
                        <div>爬虫条件：</div>
                        <div>关键词：</div>
                        <div>爬取页数：</div>
                        <div>爬取数量：</div>
                        <div>销量区间：</div>
                        <div>价格区间(￥)：</div>
                        <div>任务周期：</div>
                        <div>任务开始时间：</div>
                    </Card>
                    <Tabs
                        className="tabs-margin-none"
                        activeKey={'1'}
                        type="card"
                        children={[
                            <TabPane tab="子任务进度" key="1">
                                <div>子任务进度</div>
                            </TabPane>,
                            <TabPane tab="任务日志" key="2">
                                <div>任务日志</div>
                            </TabPane>,
                        ]}
                    />
                </Card>
            </div>
        );
    }
}

export default TaskDetailPage;

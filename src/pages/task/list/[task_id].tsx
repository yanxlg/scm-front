import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Button, Card, Descriptions, Modal, Tabs, Spin } from 'antd';
import SubTaskView from '@/pages/task/components/SubTaskView';
import '@/styles/index.less';
import '@/styles/form.less';
import '@/styles/task.less';
import '@/styles/card.less';
import { queryTaskDetail } from '@/services/task';
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
import CopyLink from '@/components/copyLink';
import { RouteComponentProps } from 'react-router';
import formStyles from '@/styles/_form.less';
import taskStyle from '@/styles/_task.less';
import styles from '@/styles/_index.less';
import TaskProgress from '@/pages/task/components/detail/TskProgress';

const { TabPane } = Tabs;

const Task_id: React.FC<RouteComponentProps<{ id: string }>> = ({ match }) => {
    const [loading, setLoading] = useState(false);
    const [detail, setDetail] = useState<ITaskDetailInfo>(EmptyObject);
    const taskId = Number(match.params.id);

    useEffect(() => {
        setLoading(true);
        queryTaskDetail(taskId)
            .then(({ data: { task_detail_info = EmptyObject } = {} } = EmptyObject) => {
                setDetail(task_detail_info);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    const getTimeIntervalString = useCallback((time_interval?: number) => {
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
    }, []);

    const getCopiedLinkQuery = useCallback(() => {
        return {};
    }, []);

    const copyTask = useCallback(() => {
        // task_range 分别弹不同的弹窗
        const { sub_cat_id } = detail;
        const task_id = Number(taskId);
        switch (Number(sub_cat_id)) {
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
            default:
                break;
        }
    }, [detail]);

    const cardContent = useMemo(() => {
        if (loading) {
            return null;
        }
        const {
            task_type,
            task_sn,
            task_name,
            sub_cat_id,
            sort_type_name,
            category_level_one,
            cat_name,
            sales_volume_min,
            sales_volume_max,
            price_min,
            price_max,
            task_cycle,
            task_start_time,
            task_end_time,
            time_interval,
        } = detail;
        if (task_type === TaskTypeEnum.Gather) {
            return (
                <Descriptions column={1} className="task-desc" size="small">
                    <Descriptions.Item label="任务SN">{task_sn || '--'}</Descriptions.Item>
                    <Descriptions.Item label="任务名称">{task_name || '--'}</Descriptions.Item>
                    <Descriptions.Item label="任务范围">
                        {TaskRangeMap[sub_cat_id] || '--'}
                    </Descriptions.Item>
                    <Descriptions.Item label="排序类型">{sort_type_name || '--'}</Descriptions.Item>
                    <Descriptions.Item label="爬虫条件">
                        {category_level_one ? '指定类目' : '指定关键词'}
                    </Descriptions.Item>
                    {category_level_one ? (
                        <Descriptions.Item label="类目">{cat_name || '--'}</Descriptions.Item>
                    ) : (
                        <Descriptions.Item label="关键词">
                            {detail.keywords || '--'}
                        </Descriptions.Item>
                    )}
                    <Descriptions.Item label="爬取页数">
                        {detail.grab_page_count || '--'}
                    </Descriptions.Item>
                    <Descriptions.Item label="爬取数量">
                        {detail.grab_count_max || '--'}
                    </Descriptions.Item>
                    <Descriptions.Item label="销量区间">
                        {`${sales_volume_min || 0}-${sales_volume_max || '+∞'}`}
                    </Descriptions.Item>
                    <Descriptions.Item label="价格区间(￥)">
                        {`${price_min || 0}-${price_max || '+∞'}`}
                    </Descriptions.Item>
                    <Descriptions.Item label="任务周期">
                        {task_cycle === TaskExecuteType.once ? '一次性任务' : '定时任务'}
                    </Descriptions.Item>
                    <Descriptions.Item label="任务开始时间">
                        {utcToLocal(task_start_time) || '--'}
                    </Descriptions.Item>
                    {task_cycle === TaskExecuteType.once ? null : (
                        <Descriptions.Item label="任务结束时间">
                            {utcToLocal(task_end_time) || '--'}
                        </Descriptions.Item>
                    )}
                    {task_cycle === TaskExecuteType.once ? null : (
                        <Descriptions.Item label="任务间隔">
                            {getTimeIntervalString(time_interval)}
                        </Descriptions.Item>
                    )}
                </Descriptions>
            );
        }
        if (task_type === TaskTypeEnum.Grounding) {
            return (
                <Descriptions column={1} className="task-desc">
                    <Descriptions.Item label="任务SN">{detail.task_sn || '--'}</Descriptions.Item>
                    <Descriptions.Item label="任务名称">
                        {detail.task_name || '--'}
                    </Descriptions.Item>
                    <Descriptions.Item label="任务范围">
                        {TaskRangeMap[sub_cat_id] || '--'}
                    </Descriptions.Item>
                    <Descriptions.Item label="任务周期">
                        {task_cycle === TaskExecuteType.once ? '一次性任务' : '定时任务'}
                    </Descriptions.Item>
                    <Descriptions.Item label="任务开始时间">
                        {utcToLocal(task_start_time) || '--'}
                    </Descriptions.Item>
                </Descriptions>
            );
        }
        if (task_type === TaskTypeEnum.Update) {
            return (
                <Descriptions column={1} className="task-desc">
                    <Descriptions.Item label="任务SN">{detail.task_sn || '--'}</Descriptions.Item>
                    <Descriptions.Item label="任务名称">
                        {detail.task_name || '--'}
                    </Descriptions.Item>
                    <Descriptions.Item label="商品范围">
                        {TaskRangeMap[sub_cat_id] ? `${TaskRangeMap[sub_cat_id]}商品` : ''}
                    </Descriptions.Item>
                    <Descriptions.Item label="任务时间">
                        {utcToLocal(task_start_time)} - {utcToLocal(task_end_time)}
                    </Descriptions.Item>
                    <Descriptions.Item label="任务间隔">
                        {getTimeIntervalString(time_interval)}
                    </Descriptions.Item>
                </Descriptions>
            );
        }
        if (task_type) {
            return <div>努力集成中，敬请期待...</div>;
        }
        return <div>数据异常，请排查...</div>;
    }, [detail]);

    const detailComponent = useMemo(() => {
        const { task_type, task_name, status } = detail;
        const title = `【${TaskTypeMap[task_type!] ?? ''}】${task_name}-${TaskStatusMap[status] ??
            ''}`;
        return (
            <Card
                loading={loading}
                title={loading ? '加载中...' : task_type ? title : '异常'}
                className={taskStyle.taskDetailCard}
            >
                {cardContent}
            </Card>
        );
    }, [loading]);

    return useMemo(() => {
        const { task_type } = detail;

        return (
            <div className={styles.transparent}>
                {detailComponent}
                <Card className={formStyles.formItem} title="任务进度">
                    <TaskProgress/>
                    <Tabs
                        className="tabs-margin-none form-item"
                        type="card"
                        defaultActiveKey="1"
                        children={[
                            <TabPane tab="子任务进度" key="1">
                                <SubTaskView task_Id={taskId as number} task_type={task_type} />
                            </TabPane>,
                            /*<TabPane tab="任务日志" key="2">
                                <TaskLogView task_Id={this.taskId} />
                            </TabPane>,*/
                        ]}
                    />
                </Card>
                <CopyLink getCopiedLinkQuery={getCopiedLinkQuery} />
            </div>
        );
    }, [loading]);
};

export default Task_id;

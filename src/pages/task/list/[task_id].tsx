import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Button, Card, Descriptions, Modal, Tabs, Spin, Select, Popover } from 'antd';
import '@/styles/index.less';
import '@/styles/form.less';
import '@/styles/task.less';
import '@/styles/card.less';
import btnStyles from '@/styles/_btn.less';
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
import TaskIdList from '@/pages/task/components/detail/TaskIdList';

const { TabPane } = Tabs;

const Task_id: React.FC<RouteComponentProps<{ task_id: string }>> = ({ match }) => {
    const [loading, setLoading] = useState(false);
    const [detail, setDetail] = useState<ITaskDetailInfo>(EmptyObject);
    const taskId = Number(match.params.task_id);
    const containerRef = useRef<HTMLDivElement>(null);

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
            cate_name_one,
            cate_name_two,
            cate_name_three,
            sales_volume_min,
            sales_volume_max,
            price_min,
            price_max,
            task_cycle,
            task_start_time,
            task_end_time,
            time_interval,
            task_channel,
        } = detail;
        if (task_type === TaskTypeEnum.Gather) {
            return (
                <Descriptions column={3} className="task-desc" size="small">
                    <Descriptions.Item label="任务SN" span={1}>
                        {task_sn || '--'}
                    </Descriptions.Item>
                    <Descriptions.Item label="任务名称" span={1}>
                        {task_name || '--'}
                    </Descriptions.Item>
                    <Descriptions.Item label="任务渠道" span={1}>
                        {task_channel || '--'}
                    </Descriptions.Item>
                    <Descriptions.Item label="任务范围" span={1}>
                        {TaskRangeMap[sub_cat_id] || '--'}
                    </Descriptions.Item>
                    <Descriptions.Item label="排序类型" span={1}>
                        {sort_type_name || '--'}
                    </Descriptions.Item>
                    <Descriptions.Item label="爬虫条件" span={1}>
                        {category_level_one ? '指定类目' : '指定关键词'}
                    </Descriptions.Item>
                    {category_level_one ? (
                        <>
                            <Descriptions.Item label="一级类目">
                                {cate_name_one || '--'}
                            </Descriptions.Item>
                            <Descriptions.Item label="二级类目">
                                {cate_name_two || '--'}
                            </Descriptions.Item>
                            <Descriptions.Item label="三级类目">
                                {cate_name_three || '--'}
                            </Descriptions.Item>
                        </>
                    ) : (
                        <Descriptions.Item label="关键词" span={3}>
                            {detail.keywords || '--'}
                        </Descriptions.Item>
                    )}
                    <Descriptions.Item label="爬取页数" span={1}>
                        {detail.grab_page_count || '--'}
                    </Descriptions.Item>
                    <Descriptions.Item label="爬取数量" span={1}>
                        {detail.grab_count_max || '--'}
                    </Descriptions.Item>
                    <Descriptions.Item label="销量区间" span={1}>
                        {`${sales_volume_min || 0}-${sales_volume_max || '+∞'}`}
                    </Descriptions.Item>
                    <Descriptions.Item label="价格区间(￥)" span={1}>
                        {`${price_min || 0}-${price_max || '+∞'}`}
                    </Descriptions.Item>
                    <Descriptions.Item label="任务周期" span={1}>
                        {task_cycle === TaskExecuteType.once ? '一次性任务' : '定时任务'}
                    </Descriptions.Item>
                    <Descriptions.Item label="任务开始时间" span={1}>
                        {utcToLocal(task_start_time) || '--'}
                    </Descriptions.Item>
                    {task_cycle === TaskExecuteType.once ? null : (
                        <Descriptions.Item label="任务结束时间" span={1}>
                            {utcToLocal(task_end_time) || '--'}
                        </Descriptions.Item>
                    )}
                    {task_cycle === TaskExecuteType.once ? null : (
                        <Descriptions.Item label="任务间隔" span={1}>
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
    }, [loading]);

    const detailComponent = useMemo(() => {
        const { task_type, task_name, status } = detail;
        const title = `【${TaskTypeMap[task_type!] ?? ''}】${task_name}-${TaskStatusMap[status] ??
            ''}`;
        return (
            <Card
                loading={loading}
                title={loading ? '加载中...' : task_type !== void 0 ? title : '异常'}
                className={taskStyle.taskDetailCard}
                extra={
                    <Button className={btnStyles.btnLink} type="link" onClick={copyTask}>
                        复制创建新任务
                    </Button>
                }
            >
                {cardContent}
            </Card>
        );
    }, [loading]);

    const dropdownRender = useCallback(() => {
        return <div />;
    }, []);

    const getPopupContainer = useCallback(() => {
        return containerRef.current as HTMLDivElement;
    }, []);

    return useMemo(() => {
        return (
            <div className={styles.transparent}>
                {detailComponent}
                <Card className={formStyles.formItem} title="任务进度">
                    <div className={styles.relative} ref={containerRef}>
                        <Popover
                            placement="bottomLeft"
                            getPopupContainer={getPopupContainer}
                            title={undefined}
                            content={<TaskIdList task_id={taskId} />}
                            overlayStyle={{ width: '100%' }}
                            trigger="click"
                        >
                            <Select placeholder="全部子任务" dropdownRender={dropdownRender} />
                        </Popover>
                    </div>
                    <TaskProgress />
                </Card>
                <CopyLink getCopiedLinkQuery={getCopiedLinkQuery} />
            </div>
        );
    }, [loading]);
};

export default Task_id;

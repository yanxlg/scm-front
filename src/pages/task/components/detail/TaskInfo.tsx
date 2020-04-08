import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { queryTaskDetail } from '@/services/task';
import { EmptyObject } from '@/config/global';
import { ITaskDetailInfo } from '@/interface/ITask';
import {
    isGatherTask,
    TaskExecuteType,
    TaskRangeMap,
    TaskStatusMap,
    TaskTypeCode,
    TaskTypeEnum,
    TaskTypeMap,
    isUrlTask,
    isGoodsUpdateTask,
} from '@/enums/StatusEnum';
import { Button, Card, Descriptions, Modal } from 'antd';
import taskStyle from '@/styles/_task.less';
import btnStyles from '@/styles/_btn.less';
import URLGather from '@/pages/task/components/editor/URLGather';
import HotGather from '@/pages/task/components/editor/HotGather';
import TimerUpdate from '@/pages/task/components/editor/TimerUpdate';
import { utcToLocal } from '@/utils/date';

declare interface TaskInfoProps {
    task_id: number;
    setTaskType: (taskType: TaskTypeCode | undefined | -1) => void;
}

const TaskInfo: React.FC<TaskInfoProps> = ({ task_id, setTaskType }) => {
    const [loading, setLoading] = useState(false);
    const [detail, setDetail] = useState<ITaskDetailInfo>(EmptyObject);

    useEffect(() => {
        setLoading(true);
        queryTaskDetail(task_id)
            .then(({ data: { task_detail_info = EmptyObject } = {} } = EmptyObject) => {
                setDetail(task_detail_info);
                const { task_type = -1 } = task_detail_info;
                setTaskType(task_type);
            })
            .catch(() => {
                setTaskType(-1);
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

    const copyTask = useCallback(() => {
        // task_range 分别弹不同的弹窗
        const { sub_cat_id } = detail;
        const taskId = Number(task_id);

        if (isUrlTask(sub_cat_id)) {
            Modal.info({
                content: <URLGather taskId={taskId} />,
                className: 'modal-empty config-modal-hot',
                icon: null,
                maskClosable: true,
            });
        } else if (isGatherTask(sub_cat_id)) {
            Modal.info({
                content: <HotGather taskId={taskId} />,
                className: 'modal-empty config-modal-hot',
                icon: null,
                maskClosable: true,
            });
        } else if (isGoodsUpdateTask(sub_cat_id)) {
            Modal.info({
                content: <TimerUpdate taskId={taskId} />,
                className: 'modal-empty config-modal-hot',
                icon: null,
                maskClosable: true,
            });
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
        if (task_type === TaskTypeEnum.Gather || task_type === TaskTypeEnum.GatherGrounding) {
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
                    <Descriptions.Item label="任务排序" span={1}>
                        {sort_type_name || '--'}
                    </Descriptions.Item>
                    <Descriptions.Item label="爬虫条件" span={1}>
                        {category_level_one ? '指定类目' : '指定关键词'}
                    </Descriptions.Item>
                    {category_level_one ? (
                        <>
                            <Descriptions.Item label="一级类目" span={3}>
                                {cate_name_one || '--'}
                            </Descriptions.Item>
                            <Descriptions.Item label="二级类目" span={3}>
                                {cate_name_two || '--'}
                            </Descriptions.Item>
                            <Descriptions.Item label="三级类目" span={3}>
                                {cate_name_three || '--'}
                            </Descriptions.Item>
                        </>
                    ) : (
                        <Descriptions.Item label="关键词" span={1}>
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
                        {task_cycle === TaskExecuteType.once ? '单次' : '定时'}
                    </Descriptions.Item>
                    <Descriptions.Item label="任务时间" span={1}>
                        {utcToLocal(task_start_time) || '--'}
                    </Descriptions.Item>
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
                <Descriptions column={3} size="small">
                    <Descriptions.Item label="任务SN">{detail.task_sn || '--'}</Descriptions.Item>
                    <Descriptions.Item label="任务名称">
                        {detail.task_name || '--'}
                    </Descriptions.Item>
                    <Descriptions.Item label="任务类型">商品上架</Descriptions.Item>
                    <Descriptions.Item label="任务周期">
                        {task_cycle === TaskExecuteType.once ? '单次' : '定时'}
                    </Descriptions.Item>
                    <Descriptions.Item label="任务时间">
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

    return useMemo(() => {
        const { task_type, task_name, status } = detail;
        const title = `【${TaskTypeMap[task_type!] ?? ''}】${task_name}-${TaskStatusMap[status] ??
            ''}`;
        return (
            <Card
                loading={loading}
                title={loading ? '加载中...' : task_type !== void 0 ? title : '异常'}
                className={taskStyle.taskDetailCard}
                extra={
                    task_type === TaskTypeEnum.GatherGrounding ||
                    task_type === TaskTypeEnum.Gather ? (
                        <Button className={btnStyles.btnLink} type="link" onClick={copyTask}>
                            复制创建新任务
                        </Button>
                    ) : null
                }
            >
                {cardContent}
            </Card>
        );
    }, [loading]);
};

export default TaskInfo;

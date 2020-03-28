import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import styles from '@/styles/_index.less';
import taskStyles from '@/styles/_task.less';
import { Popover, Select } from 'antd';
import TaskIdList from '@/pages/task/components/detail/TaskIdList';
import { TaskTypeCode } from '@/enums/StatusEnum';
import { querySubTaskIdList } from '@/services/task';
import { ISubTaskIdItem } from '@/interface/ITask';
import TaskStatic from './TaskStatic';
import classNames from 'classnames';

declare interface TaskProgressProps {
    task_id: number;
    task_type: TaskTypeCode;
    collect_onsale_type?: 1 | 2;
}
const TaskProgress: React.FC<TaskProgressProps> = ({ task_id, task_type, collect_onsale_type }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [loading, setLoading] = useState(true);
    const [dataSet, setDataSet] = useState<ISubTaskIdItem[]>([]);

    const [checkedIds, setCheckedIds] = useState<string[]>([]); // 真实ids

    const [visible, setVisible] = useState(false);

    useEffect(() => {
        querySubTaskIdList({
            task_id,
            pageSize: 10000,
            pageNumber: 1,
        })
            .then(({ data = [] }) => {
                setDataSet(data);
                setCheckedIds(data.map(data => data.plan_id)); // 默认全选
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    const getPopupContainer = useCallback(() => {
        return containerRef.current as HTMLDivElement;
    }, []);
    const dropdownRender = useCallback(() => {
        return <div />;
    }, []);

    const onSubmit = useCallback((ids: string[]) => {
        setCheckedIds(ids);
        setVisible(false);
    }, []);

    const setPopOverVisible = useCallback(() => {
        setVisible(true);
    }, []);

    const setPopOverHide = useCallback(() => {
        setVisible(false);
    }, [checkedIds.join('')]);

    const onVisibleChange = useCallback((visible: boolean) => {
        if (!visible) {
            setPopOverHide();
        }
    }, []);

    return useMemo(() => {
        return (
            <>
                <div
                    className={classNames(styles.relative, taskStyles.taskDetailContent)}
                    ref={containerRef}
                >
                    <Popover
                        visible={visible}
                        placement="bottomLeft"
                        getPopupContainer={getPopupContainer}
                        title={undefined}
                        onVisibleChange={onVisibleChange}
                        destroyTooltipOnHide={true}
                        content={
                            <TaskIdList
                                checkedIds={checkedIds}
                                dataSet={dataSet}
                                onSubmit={onSubmit}
                                onCancel={setPopOverHide}
                            />
                        }
                        overlayStyle={{ width: '100%' }}
                        trigger={'click'}
                    >
                        <Select
                            placeholder="全部子任务"
                            dropdownRender={dropdownRender}
                            onClick={setPopOverVisible}
                            loading={loading}
                            disabled={loading}
                            dropdownClassName={styles.none}
                        />
                    </Popover>
                </div>
                {checkedIds.length === 0 ? null : (
                    <TaskStatic
                        checkedIds={checkedIds}
                        task_id={task_id}
                        task_type={task_type}
                        collect_onsale_type={collect_onsale_type}
                    />
                )}
            </>
        );
    }, [loading, visible, checkedIds.join('')]);
};

export default TaskProgress;

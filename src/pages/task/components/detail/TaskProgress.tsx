import React, {
    forwardRef,
    ForwardRefRenderFunction,
    RefObject,
    useCallback,
    useEffect,
    useImperativeHandle,
    useMemo,
    useRef,
    useState,
} from 'react';
import styles from '@/styles/_index.less';
import taskStyles from '@/styles/_task.less';
import { Popover, Select } from 'antd';
import TaskIdList from '@/pages/task/components/detail/TaskIdList';
import { TaskTypeCode } from '@/enums/StatusEnum';
import { querySubTaskIdList } from '@/services/task';
import { ISubTaskIdItem } from '@/interface/ITask';
import TaskStatic, { TaskStaticRef } from './TaskStatic';
import classNames from 'classnames';
import { isZero } from '@/utils/utils';

declare interface TaskProgressProps {
    task_id: number;
    task_type: TaskTypeCode;
    collect_onsale_type?: 1 | 2;
    staticRef: RefObject<TaskStaticRef>;
}

const TaskProgress: React.FC<TaskProgressProps> = ({
    task_id,
    task_type,
    collect_onsale_type,
    staticRef,
}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [loading, setLoading] = useState(true);
    const [dataSet, setDataSet] = useState<ISubTaskIdItem[]>([]);
    const [failCount, setFailCount] = useState<string | undefined>();

    const [checkedIds, setCheckedIds] = useState<string[] | undefined>(undefined); // 真实ids

    const [visible, setVisible] = useState(false);

    useEffect(() => {
        querySubTaskIdList({
            task_id,
            pageSize: 10000,
            pageNumber: 1,
        })
            .then(({ data: { list = [], fail_count = '0' } }) => {
                setDataSet(list);
                setFailCount(fail_count);
                setCheckedIds(list.map(item => item.plan_id)); // 默认全选
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

    const idsKey = checkedIds?.join('');

    const setPopOverHide = useCallback(() => {
        setVisible(false);
    }, [idsKey]);

    const onVisibleChange = useCallback((visible: boolean) => {
        if (!visible) {
            setPopOverHide();
        }
    }, []);

    return useMemo(() => {
        const checkedAll = checkedIds === void 0 || checkedIds.length === dataSet.length;
        const placeholder = checkedAll ? '全部子任务' : checkedIds!.join(',');
        return (
            <>
                <div
                    className={classNames(styles.relative, taskStyles.taskDetailContent)}
                    ref={containerRef}
                >
                    <div>
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
                                placeholder={placeholder}
                                dropdownRender={dropdownRender}
                                onClick={setPopOverVisible}
                                loading={loading}
                                disabled={loading}
                                dropdownClassName={styles.none}
                                open={visible}
                                className={taskStyles.taskIdsSelect}
                            />
                        </Popover>
                        {failCount !== void 0 && !isZero(failCount) ? (
                            <div
                                className={classNames(
                                    taskStyles.errorText,
                                    styles.inlineBlock,
                                    styles.verticalMiddle,
                                )}
                            >
                                *{failCount}个子任务列表爬取异常
                            </div>
                        ) : null}
                    </div>
                    <TaskStatic
                        ref={staticRef}
                        checkedIds={checkedAll ? undefined : checkedIds}
                        task_id={task_id}
                        task_type={task_type}
                        collect_onsale_type={collect_onsale_type}
                    />
                </div>
            </>
        );
    }, [loading, visible, idsKey]);
};

export default TaskProgress;

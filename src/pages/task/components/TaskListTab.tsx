import React, { ReactText, useCallback, useEffect, useMemo, useRef } from 'react';
import { ITaskListItem, ITaskListQuery, ITaskListExtraData } from '@/interface/ITask';
import { Button, message } from 'antd';
import {
    isGoodsUpdateType,
    TaskRangeCode,
    TaskRangeMap,
    TaskStatusCode,
    TaskStatusEnum,
    TaskStatusList,
    TaskTypeCode,
    TaskTypeEnum,
    TaskTypeList,
    TaskTypeMap,
    PUTaskRangeTypeMap,
} from '@/enums/StatusEnum';
import { utcToLocal } from 'react-components/es/utils/date';
import { unixToEndDate, unixToStartDate } from 'react-components/es/utils/date';
import FitTable from '../../../../../react-components/src/FitTable2';
import { JsonFormRef, FormField } from 'react-components/es/JsonForm';
import { JsonForm } from 'react-components';
import { useList } from '@/utils/hooks';
import { getTaskList, deleteTasks, activeTasks, reTryTasks, abortTasks } from '@/services/task';
import { history } from '@@/core/history';
import { LoadingButton } from 'react-components';
import queryString from 'query-string';
import CopyLink from '@/components/copyLink';
import { defaultPageNumber, defaultPageSize } from '@/config/global';
import { PopConfirmLoadingButton } from 'react-components';
import btnStyle from '@/styles/_btn.less';
import TaskStatus from './TaskStatus';
import {
    isOnceTask,
    TaskChannelCode,
    TaskChannelEnum,
    TaskChannelMap,
} from '@/config/dictionaries/Task';
import { isEmptyObject } from '@/utils/utils';
import { ColumnType, TableProps } from 'antd/es/table';
import formStyles from 'react-components/es/JsonForm/_form.less';
import { queryGoodsSourceList } from '@/services/global';
import { EmptyArray } from 'react-components/es/utils';
import { PermissionComponent } from 'rc-permission';
import useTableSetting from '../../../hooks/useTableSetting';

declare interface TaskListTabProps {
    task_status?: TaskStatusEnum;
    initialValues?: Partial<ITaskListQuery>;
    setCountArr: (count: number[]) => void;
}

const scroll: TableProps<ITaskListItem>['scroll'] = { x: true, scrollToFirstRowOnChange: true };

const TaskListTab: React.FC<TaskListTabProps> = ({ task_status, initialValues, setCountArr }) => {
    const searchRef = useRef<JsonFormRef>(null);
    const {
        pageSize: page_size,
        pageNumber: page_number,
        ...defaultInitialValues
    } = useMemo(() => {
        // copy link 解析
        const { query, url } = queryString.parseUrl(window.location.href);
        if (!isEmptyObject(query)) {
            window.history.replaceState({}, '', url);
        }
        const routeInitialValues = initialValues ?? {}; // 路由初始参数
        const {
            pageNumber = defaultPageNumber,
            pageSize = defaultPageSize,
            task_id = '',
            task_sn = '',
            task_status = '',
            task_name = '',
            task_type = '',
            task_begin_time = 0,
            task_end_time = 0,
        } = query;
        return {
            pageNumber: Number(pageNumber),
            pageSize: Number(pageSize),
            task_id,
            task_sn,
            task_status,
            task_name,
            task_type,
            task_begin_time: unixToStartDate(Number(task_begin_time)),
            task_end_time: unixToEndDate(Number(task_end_time)),
            ...routeInitialValues,
        };
    }, []);

    const {
        query,
        loading,
        pageNumber,
        pageSize,
        dataSource,
        extraData,
        total,
        onSearch,
        onReload,
        onChange,
        selectedRowKeys,
        setSelectedRowKeys,
    } = useList<ITaskListItem, ITaskListQuery, ITaskListExtraData>({
        queryList: getTaskList,
        formRef: searchRef,
        extraQuery: {
            task_status: task_status,
        },
        defaultState: {
            pageSize: page_size,
            pageNumber: page_number,
        },
    });

    const getCopiedLinkQuery = useCallback(() => {
        return {
            ...query,
            tabKey:
                task_status === void 0
                    ? '1'
                    : task_status === TaskStatusEnum.ToBeExecuted
                    ? '2'
                    : task_status === TaskStatusEnum.Executing
                    ? '3'
                    : task_status === TaskStatusEnum.Success
                    ? '4'
                    : task_status === TaskStatusEnum.Failed
                    ? 5
                    : '6',
        };
    }, [loading]);

    const viewTaskDetail = useCallback((task_id: number) => {
        history.push(`/task/list/${task_id}`);
    }, []);

    const viewTaskResult = useCallback((task_id: number) => {
        history.push({
            pathname: '/goods/local',
            state: {
                task_id,
            },
        });
    }, []);

    const activeTask = useCallback((task_id: number) => {
        return activeTasks(String(task_id)).then(() => {
            message.success('任务已开始执行');
            onReload();
        });
    }, []);

    const reTryTask = useCallback((task_id: number) => {
        return reTryTasks(String(task_id)).then(() => {
            message.success('任务已尝试重新执行');
            onReload();
        });
    }, []);

    const abortTask = useCallback((task_id: number) => {
        return abortTasks(String(task_id)).then(() => {
            message.success('任务已终止!');
            onReload();
        });
    }, []);

    const columns = useMemo(() => {
        return [
            {
                title: '操作',
                dataIndex: 'operation',
                align: 'center',
                fixed: 'left',
                width: '150px',
                render: (_, record: ITaskListItem) => {
                    const statusCode = Number(record.status);
                    const task_id = record.task_id;
                    const onceTask = isOnceTask(record.execute_count);
                    const taskType = record.task_type;
                    const channel = record.channel;
                    return (
                        <>
                            {(taskType === TaskTypeEnum.Gather &&
                                String(channel) === TaskChannelEnum.PDD) ||
                            taskType === TaskTypeEnum.Grounding ||
                            (taskType === TaskTypeEnum.GatherGrounding &&
                                String(channel) === TaskChannelEnum.PDD) ? (
                                <Button type="link" onClick={() => viewTaskDetail(task_id)}>
                                    查看详情
                                </Button>
                            ) : null}
                            {statusCode === TaskStatusEnum.ToBeExecuted ? (
                                <PermissionComponent pid="task/active" control="tooltip">
                                    <LoadingButton type="link" onClick={() => activeTask(task_id)}>
                                        立即执行
                                    </LoadingButton>
                                </PermissionComponent>
                            ) : null}
                            {statusCode === TaskStatusEnum.Failed && onceTask ? (
                                <PermissionComponent pid="task/retry" control="tooltip">
                                    <LoadingButton type="link" onClick={() => reTryTask(task_id)}>
                                        重试任务
                                    </LoadingButton>
                                </PermissionComponent>
                            ) : null}
                            {statusCode === TaskStatusEnum.ToBeExecuted ||
                            statusCode === TaskStatusEnum.Executing ? (
                                <PermissionComponent pid="task/termination" control="tooltip">
                                    <LoadingButton
                                        onClick={() => abortTask(task_id)}
                                        type="link"
                                        className={btnStyle.btnSilver}
                                    >
                                        终止任务
                                    </LoadingButton>
                                </PermissionComponent>
                            ) : null}
                        </>
                    );
                },
            },
            {
                title: '任务ID',
                width: '100px',
                fixed: 'left',
                dataIndex: 'task_id',
                align: 'center',
            },
            {
                title: '任务SN',
                width: '200px',
                fixed: 'left',
                dataIndex: 'task_sn',
                align: 'center',
            },
            {
                title: '任务名称',
                dataIndex: 'task_name',
                width: '178px',
                align: 'center',
            },
            {
                title: '任务状态',
                dataIndex: 'status',
                width: '130px',
                align: 'center',
                render: (status: string, record) => {
                    // 目前只有采集任务支持查看结果
                    const statusCode = Number(status) as TaskStatusCode;
                    const { result = 0, task_type } = record;

                    return (
                        <>
                            <TaskStatus status={statusCode} />
                            {task_type !== TaskTypeEnum.Gather ||
                            status === '0' ||
                            status === '1' ||
                            result < 1 ? null : (
                                <Button type="link" onClick={() => viewTaskResult(record.task_id)}>
                                    查看结果
                                </Button>
                            )}
                        </>
                    );
                },
            },
            {
                title: '任务渠道',
                dataIndex: 'channel',
                width: '223px',
                align: 'center',
                render: (text: TaskChannelCode) => TaskChannelMap[text] || '--',
            },
            {
                title: '任务类型',
                dataIndex: 'task_type',
                width: '223px',
                align: 'center',
                render: (text: TaskTypeCode) => TaskTypeMap[text],
            },
            {
                title: '任务范围',
                dataIndex: 'task_range',
                width: '182px',
                align: 'center',
                render: (text: TaskRangeCode, record) => {
                    const _range = record.range;
                    const range = isGoodsUpdateType(text)
                        ? record.update_type?.map(code => PUTaskRangeTypeMap[code])?.join(';')
                        : _range === 'all'
                        ? '全部店铺'
                        : TaskRangeMap[text];
                    return range || '--';
                },
            },
            {
                title: '任务周期',
                dataIndex: 'execute_count',
                width: '223px',
                align: 'center',
                render: (count: string) => (isOnceTask(count) ? '单次' : '定时'),
            },
            {
                title: '创建时间',
                dataIndex: 'create_time',
                width: '223px',
                align: 'center',
                render: (dateString: string) => utcToLocal(dateString),
            },
            {
                title: '开始时间',
                dataIndex: 'start_time',
                width: '223px',
                align: 'center',
                render: (dateString: string) => utcToLocal(dateString),
            },
            {
                title: '结束时间',
                dataIndex: 'end_time',
                width: '200px',
                align: 'center',
                render: (dateString: string) => utcToLocal(dateString),
            },
        ] as ColumnType<ITaskListItem>[];
    }, []);

    const fieldList = useMemo<FormField[]>(() => {
        if (task_status === void 0) {
            return [
                {
                    label: (
                        <span>
                            任务<span className="task-justify-1">ID</span>
                        </span>
                    ),
                    type: 'input',
                    name: 'task_id',
                },
                {
                    label: (
                        <span>
                            任务<span className="task-justify-1">SN</span>
                        </span>
                    ),
                    type: 'number',
                    name: 'task_sn',
                },
                {
                    label: '任务状态',
                    type: 'select',
                    name: 'task_status',
                    formatter: 'number',
                    optionList: [
                        {
                            name: '全部',
                            value: '',
                        },
                    ].concat(
                        TaskStatusList.map(({ id, name }) => {
                            return {
                                name,
                                value: id,
                            };
                        }),
                    ),
                },
                {
                    label: '任务名称',
                    type: 'input',
                    name: 'task_name',
                },
                {
                    label: '任务渠道',
                    type: 'select',
                    name: 'channel',
                    formatter: 'number',
                    syncDefaultOption: {
                        name: '全部',
                        value: '',
                    },
                    optionList: () =>
                        queryGoodsSourceList().then((list = EmptyArray) => {
                            return list.map(({ name, value }) => {
                                return {
                                    name,
                                    value,
                                };
                            });
                        }),
                },
                {
                    label: '任务类型',
                    type: 'select',
                    name: 'task_type',
                    formatter: 'number',
                    optionList: [
                        {
                            name: '全部',
                            value: '',
                        },
                    ].concat(
                        TaskTypeList.map(({ id, name }) => {
                            return {
                                name,
                                value: id,
                            };
                        }),
                    ),
                },
                {
                    label: '开始时间',
                    type: 'datePicker',
                    name: 'task_begin_time',
                    formatter: 'start_date',
                    dateEndWith: ['task_end_time'],
                },
                {
                    label: '结束时间',
                    type: 'datePicker',
                    name: 'task_end_time',
                    formatter: 'end_date',
                    dateBeginWith: ['task_begin_time'],
                },
            ];
        } else {
            return [
                {
                    label: (
                        <span>
                            任务<span className="task-justify-1">ID</span>
                        </span>
                    ),
                    type: 'input',
                    name: 'task_id',
                },
                {
                    label: (
                        <span>
                            任务<span className="task-justify-1">SN</span>
                        </span>
                    ),
                    type: 'number',
                    name: 'task_sn',
                },
                {
                    label: '任务名称',
                    type: 'input',
                    name: 'task_name',
                },
                {
                    label: '任务渠道',
                    type: 'select',
                    name: 'channel',
                    formatter: 'number',
                    syncDefaultOption: {
                        name: '全部',
                        value: '',
                    },
                    optionList: () =>
                        queryGoodsSourceList().then((list = EmptyArray) => {
                            return list.map(({ name, value }) => {
                                return {
                                    name,
                                    value,
                                };
                            });
                        }),
                },
                {
                    label: '任务类型',
                    type: 'select',
                    name: 'task_type',
                    formatter: 'number',
                    optionList: [
                        {
                            name: '全部',
                            value: '',
                        },
                    ].concat(
                        TaskTypeList.map(({ id, name }) => {
                            return {
                                name,
                                value: id,
                            };
                        }),
                    ),
                },
                {
                    label: '开始时间',
                    type: 'datePicker',
                    name: 'task_begin_time',
                    dateEndWith: ['task_end_time'],
                    formatter: 'start_date',
                },
                {
                    label: '结束时间',
                    type: 'datePicker',
                    name: 'task_end_time',
                    dateBeginWith: ['task_begin_time'],
                    formatter: 'end_date',
                },
            ];
        }
    }, []);

    const formInitialValues = useMemo(() => {
        return task_status === void 0
            ? { task_status: '', channel: '', task_type: '', ...defaultInitialValues }
            : { task_type: '', channel: '', ...defaultInitialValues };
    }, []);

    useEffect(() => {
        if (extraData !== void 0) {
            const {
                task_total_num,
                task_wait_execute_num,
                task_executing_num,
                task_executed_num,
                task_executed_fail_num,
                task_termination_num,
            } = extraData;
            setCountArr([
                task_total_num,
                task_wait_execute_num,
                task_executing_num,
                task_executed_num,
                task_executed_fail_num,
                task_termination_num,
            ]);
        }
    }, [extraData]);

    const deleteTaskList = useCallback(() => {
        return deleteTasks(selectedRowKeys.join(',')).then(() => {
            message.success('任务删除成功!');
            onReload();
        });
    }, [selectedRowKeys]);

    const onSelectedRowKeysChange = useCallback((selectedKeys: ReactText[]) => {
        setSelectedRowKeys(selectedKeys as string[]);
    }, []);

    const rowSelection = useMemo(() => {
        return {
            fixed: true,
            columnWidth: '50px',
            selectedRowKeys: selectedRowKeys,
            onChange: onSelectedRowKeysChange,
        };
    }, [selectedRowKeys]);

    const pagination = useMemo(() => {
        return {
            total: total,
            current: pageNumber,
            pageSize: pageSize,
            showSizeChanger: true,
            position: ['topRight', 'bottomRight'],
        } as any;
    }, [loading]);

    const toolBarRender = useCallback(() => {
        const size = selectedRowKeys.length;
        return [
            <PermissionComponent pid="task/delete" key="delete" control="tooltip">
                <PopConfirmLoadingButton
                    buttonProps={{
                        danger: true,
                        disabled: size === 0,
                        children: '删除任务',
                        className: formStyles.formBtn,
                    }}
                    popConfirmProps={{
                        title: '确定要删除选中的任务吗?',
                        okText: '确定',
                        cancelText: '取消',
                        disabled: size === 0,
                        onConfirm: deleteTaskList,
                    }}
                />
            </PermissionComponent>,
        ];
    }, [selectedRowKeys]);

    const { hideKeys, sortKeys, updateHideKeys, updateSortKeys } = useTableSetting('/task/all');

    const table = useMemo(() => {
        return (
            <FitTable<ITaskListItem>
                bordered={true}
                rowKey="task_id"
                hideKeys={hideKeys}
                sortKeys={sortKeys}
                onHideKeysChange={updateHideKeys}
                onSortKeysChange={updateSortKeys}
                rowSelection={rowSelection}
                scroll={scroll}
                bottom={60}
                minHeight={500}
                pagination={pagination}
                columns={columns}
                dataSource={dataSource}
                loading={loading}
                onChange={onChange}
                toolBarRender={toolBarRender}
                columnsSettingRender={true}
            />
        );
    }, [loading, selectedRowKeys, hideKeys, sortKeys]);

    const search = useMemo(() => {
        return (
            <JsonForm ref={searchRef} fieldList={fieldList} initialValues={formInitialValues}>
                <div>
                    <LoadingButton onClick={onSearch} className={formStyles.formBtn} type="primary">
                        查询
                    </LoadingButton>
                    <LoadingButton onClick={onReload} className={formStyles.formBtn}>
                        刷新
                    </LoadingButton>
                </div>
            </JsonForm>
        );
    }, [selectedRowKeys]);

    return useMemo(() => {
        return (
            <div>
                {search}
                {table}
                <CopyLink getCopiedLinkQuery={getCopiedLinkQuery} />
            </div>
        );
    }, [loading, selectedRowKeys, hideKeys, sortKeys]);
};

export default TaskListTab;

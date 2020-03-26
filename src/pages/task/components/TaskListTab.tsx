import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { ProColumns } from '@ant-design/pro-table';
import { ITaskListItem, ITaskListQuery, ITaskListExtraData } from '@/interface/ITask';
import { Button, message } from 'antd';
import {
    TaskRangeCode,
    TaskRangeMap,
    TaskStatusCode,
    TaskStatusEnum,
    TaskStatusList,
    TaskTypeCode,
    TaskTypeEnum,
    TaskTypeList,
    TaskTypeMap,
} from '@/enums/StatusEnum';
import { convertEndDate, convertStartDate, utcToLocal } from '@/utils/date';
import ProTable from '@/components/ProTable';
import SearchForm, { FormField, SearchFormRef } from '@/components/SearchForm';
import { useList } from '@/utils/hooks';
import { getTaskList, deleteTasks, activeTasks, reTryTasks, abortTasks } from '@/services/task';
import { history } from '@@/core/history';
import { SearchOutlined } from '@ant-design/icons';
import LoadingButton from '@/components/LoadingButton';
import queryString from 'query-string';
import CopyLink from '@/components/copyLink';
import { defaultPageNumber, defaultPageSize, EmptyObject } from '@/config/global';
import PopConfirmLoadingButton from '@/components/PopConfirmLoadingButton';
import btnStyle from '@/styles/_btn.less';
import TaskStatus from './TaskStatus';
import {
    isOnceTask,
    TaskChannelCode,
    TaskChannelList,
    TaskChannelMap,
} from '@/config/dictionaries/Task';
import { isEmptyObject } from '@/utils/utils';

declare interface TaskListTabProps {
    task_status?: TaskStatusEnum;
    initialValues?: ITaskListQuery;
    setCountArr: (count: number[]) => void;
}

const TaskListTab: React.FC<TaskListTabProps> = ({ task_status, initialValues, setCountArr }) => {
    const searchRef = useRef<SearchFormRef>(null);
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

        const routeInitialValues = initialValues ?? {};
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
            ...routeInitialValues,
            pageNumber: Number(pageNumber),
            pageSize: Number(pageSize),
            task_id,
            task_sn,
            task_status,
            task_name,
            task_type,
            task_begin_time: convertStartDate(Number(task_begin_time)),
            task_end_time: convertEndDate(Number(task_end_time)),
        };
    }, []);

    const {
        query,
        loading,
        pageNumber,
        pageSize,
        dataSource,
        extraData,
        selectedRowKeys,
        total,
        onSearch,
        onReload,
        onChange,
        setSelectedRowKeys,
    } = useList<ITaskListItem, ITaskListQuery, ITaskListExtraData>(
        getTaskList,
        searchRef,
        {
            task_status: task_status,
        },
        {
            pageSize: page_size,
            pageNumber: page_number,
        },
    );

    const getCopiedLinkQuery = useCallback(() => {
        return Object.assign({}, query, {
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
        });
    }, [query]);

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
                    return (
                        <>
                            <Button type="link" onClick={() => viewTaskDetail(task_id)}>
                                查看详情
                            </Button>
                            {statusCode === TaskStatusEnum.ToBeExecuted ? (
                                <LoadingButton type="link" onClick={() => activeTask(task_id)}>
                                    立即执行
                                </LoadingButton>
                            ) : null}
                            {statusCode === TaskStatusEnum.Failed && onceTask ? (
                                <LoadingButton type="link" onClick={() => reTryTask(task_id)}>
                                    重试任务
                                </LoadingButton>
                            ) : null}
                            {statusCode === TaskStatusEnum.ToBeExecuted ||
                            statusCode === TaskStatusEnum.Executing ? (
                                <LoadingButton
                                    onClick={() => abortTask(task_id)}
                                    type="link"
                                    className={btnStyle.btnSilver}
                                >
                                    终止任务
                                </LoadingButton>
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
                render: (text: TaskChannelCode) => TaskChannelMap[text] || '——',
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
                render: (text: TaskRangeCode) => TaskRangeMap[text],
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
        ] as ProColumns<ITaskListItem>[];
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
                    className: 'input-default',
                    formItemClassName: 'form-item',
                },
                {
                    label: (
                        <span>
                            任务<span className="task-justify-1">SN</span>
                        </span>
                    ),
                    type: 'number',
                    name: 'task_sn',
                    className: 'input-default input-handler',
                    formItemClassName: 'form-item',
                    formatter: 'number',
                },
                {
                    label: '任务状态',
                    type: 'select',
                    name: 'task_status',
                    className: 'select-default',
                    formItemClassName: 'form-item',
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
                    className: 'input-default',
                    formItemClassName: 'form-item',
                },
                {
                    label: '任务渠道',
                    type: 'select',
                    name: 'channel',
                    className: 'select-default',
                    formItemClassName: 'form-item',
                    formatter: 'number',
                    optionList: [
                        {
                            name: '全部',
                            value: '',
                        },
                    ].concat(
                        TaskChannelList.map(({ id, name }) => {
                            return {
                                name,
                                value: id,
                            };
                        }),
                    ),
                },
                {
                    label: '任务类型',
                    type: 'select',
                    name: 'task_type',
                    className: 'select-default',
                    formItemClassName: 'form-item',
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
                    className: 'input-default',
                    formItemClassName: 'form-item',
                    formatter: 'start_date',
                    dateEndWith: ['task_end_time'],
                },
                {
                    label: '结束时间',
                    type: 'datePicker',
                    name: 'task_end_time',
                    className: 'input-default',
                    formItemClassName: 'form-item',
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
                    className: 'input-default',
                    formItemClassName: 'form-item',
                },
                {
                    label: (
                        <span>
                            任务<span className="task-justify-1">SN</span>
                        </span>
                    ),
                    type: 'number',
                    name: 'task_sn',
                    className: 'input-default input-handler',
                    formItemClassName: 'form-item',
                    formatter: 'number',
                },
                {
                    label: '任务名称',
                    type: 'input',
                    name: 'task_name',
                    className: 'input-default',
                    formItemClassName: 'form-item',
                },
                {
                    label: '任务渠道',
                    type: 'select',
                    name: 'channel',
                    className: 'select-default',
                    formItemClassName: 'form-item',
                    formatter: 'number',
                    optionList: [
                        {
                            name: '全部',
                            value: '',
                        },
                    ].concat(
                        TaskChannelList.map(({ id, name }) => {
                            return {
                                name,
                                value: id,
                            };
                        }),
                    ),
                },
                {
                    label: '任务类型',
                    type: 'select',
                    name: 'task_type',
                    className: 'select-default',
                    formItemClassName: 'form-item',
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
                    className: 'input-default',
                    formItemClassName: 'form-item',
                    dateEndWith: ['task_end_time'],
                    formatter: 'start_date',
                },
                {
                    label: '结束时间',
                    type: 'datePicker',
                    name: 'task_end_time',
                    className: 'input-default',
                    formItemClassName: 'form-item',
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

    const onSelectChange = useCallback((selectedRowKeys: React.Key[]) => {
        setSelectedRowKeys(selectedRowKeys as string[]);
    }, []);

    const rowSelection = useMemo(() => {
        return {
            fixed: true,
            columnWidth: '50px',
            selectedRowKeys: selectedRowKeys,
            onChange: onSelectChange,
        };
    }, [selectedRowKeys]);

    return useMemo(() => {
        const selectTaskSize = selectedRowKeys.length;
        return (
            <div>
                <SearchForm ref={searchRef} fieldList={fieldList} initialValues={formInitialValues}>
                    <LoadingButton
                        className="form-item"
                        onClick={onSearch}
                        type="primary"
                        icon={<SearchOutlined />}
                    >
                        查询
                    </LoadingButton>
                </SearchForm>
                <ProTable<ITaskListItem>
                    search={false}
                    headerTitle="查询表格"
                    rowKey="task_id"
                    rowSelection={rowSelection}
                    scroll={{ x: true, scrollToFirstRowOnChange: true }}
                    bottom={60}
                    minHeight={500}
                    pagination={{
                        total: total,
                        current: pageNumber,
                        pageSize: pageSize,
                        showSizeChanger: true,
                    }}
                    toolBarRender={(action, { selectedRows }) => [
                        <PopConfirmLoadingButton
                            key="delete"
                            buttonProps={{
                                danger: true,
                                type: 'link',
                                className: 'btn-clear btn-group',
                                disabled: selectTaskSize === 0,
                                children: '删除任务',
                            }}
                            popConfirmProps={{
                                title: '确定要删除选中的任务吗?',
                                okText: '确定',
                                cancelText: '取消',
                                disabled: selectTaskSize === 0,
                                onConfirm: deleteTaskList,
                            }}
                        />,
                    ]}
                    tableAlertRender={false}
                    columns={columns}
                    dataSource={dataSource}
                    loading={loading}
                    onChange={onChange}
                    options={{
                        density: true,
                        fullScreen: true,
                        reload: onReload,
                        setting: true,
                    }}
                />
                <CopyLink getCopiedLinkQuery={getCopiedLinkQuery} />
            </div>
        );
    }, [loading, selectedRowKeys]);
};

export default TaskListTab;

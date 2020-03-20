import React, { useCallback, useMemo } from 'react';
import { Button, Pagination, Table } from 'antd';
import { queryTaskProgressList } from '@/services/task';
import { BindAll } from 'lodash-decorators';
import { showTaskProgressModal } from '@/pages/task/components/modal/TaskProgressModal';
import { ColumnProps } from 'antd/es/table';
import { ITaskProgressItem } from '@/interface/ITask';
import {
    TaskTypeCode,
    TaskCreateStatusMap,
    TaskCreateStatusCode,
    TaskStatusMap,
    TaskStatusCode,
} from '@/enums/StatusEnum';
import { utcToLocal } from '@/utils/date';
import '@/styles/config.less';
import '@/styles/modal.less';
import '@/styles/form.less';
import '@/styles/task.less';
import { EmptyObject } from '@/config/global';
import { useList } from '@/utils/hooks';

declare interface ISubTaskViewProps {
    task_Id: number;
    task_type?: TaskTypeCode;
}

declare interface ISubTaskViewState {
    total: number;
    pageNumber: number;
    page: number;
    list: ITaskProgressItem[];
    loading: boolean;
}

const SubTaskView: React.FC<ISubTaskViewProps> = props => {
    const { loading, pageNumber, pageSize, dataSource, total, onChange } = useList(
        queryTaskProgressList,
        undefined,
        'page_number',
        undefined,
        undefined,
        {
            task_id: props.task_Id,
        },
    );

    const showTotal = useCallback((total: number) => {
        return <span className="data-grid-total">共有{total}条</span>;
    }, []);

    const showSubTaskProgressModal = useCallback(
        (record: ITaskProgressItem) => {
            showTaskProgressModal(Object.assign({}, record, { task_type: props.task_type }));
        },
        [props.task_type],
    );

    const columns = useMemo<ColumnProps<ITaskProgressItem>[] | undefined>(() => {
        const task_type = props.task_type;
        if (task_type === void 0) {
            return undefined;
        }
        if (task_type === 0) {
            return [
                {
                    title: '子任务ID',
                    width: '100px',
                    dataIndex: 'sub_task_id',
                    align: 'center',
                },
                {
                    title: '任务开始时间',
                    width: '100px',
                    dataIndex: 'start_time',
                    align: 'center',
                    render: timestamp => utcToLocal(timestamp),
                },
                {
                    title: '任务结束时间',
                    width: '100px',
                    dataIndex: 'end_time',
                    align: 'center',
                    render: timestamp => utcToLocal(timestamp),
                },
                {
                    title: '任务创建状态',
                    width: '100px',
                    dataIndex: 'create_status',
                    align: 'center',
                    render: (status: TaskCreateStatusCode) => TaskCreateStatusMap[status],
                },
                {
                    title: '采集状态',
                    width: '100px',
                    dataIndex: 'status',
                    align: 'center',
                    render: (status: TaskStatusCode) => TaskStatusMap[status],
                },
                {
                    title: '已入库商品数',
                    width: '100px',
                    dataIndex: 'progress',
                    align: 'center',
                },
                {
                    title: '操作',
                    width: '126px',
                    dataIndex: 'action',
                    align: 'center',
                    render: (_, record) => (
                        <Button onClick={() => showSubTaskProgressModal(record)}>
                            查看任务进度
                        </Button>
                    ),
                },
            ];
        }
        if (task_type === 1) {
            return [
                {
                    title: '子任务ID',
                    width: '100px',
                    dataIndex: 'sub_task_id',
                    align: 'center',
                },
                {
                    title: '任务开始时间',
                    width: '100px',
                    dataIndex: 'start_time',
                    align: 'center',
                    render: timestamp => utcToLocal(timestamp),
                },
                {
                    title: '任务结束时间',
                    width: '100px',
                    dataIndex: 'end_time',
                    align: 'center',
                    render: timestamp => utcToLocal(timestamp),
                },
                {
                    title: '任务创建状态',
                    width: '100px',
                    dataIndex: 'create_status',
                    align: 'center',
                    render: (status: TaskCreateStatusCode) => TaskCreateStatusMap[status],
                },
                {
                    title: '上架状态',
                    width: '100px',
                    dataIndex: 'status',
                    align: 'center',
                    render: (status: TaskStatusCode) => TaskStatusMap[status],
                },
                {
                    title: '已上架的商品数',
                    width: '100px',
                    dataIndex: 'progress',
                    align: 'center',
                },
                {
                    title: '操作',
                    width: '126px',
                    dataIndex: 'action',
                    align: 'center',
                    render: (_, record) => (
                        <Button onClick={() => showSubTaskProgressModal(record)}>
                            查看任务进度
                        </Button>
                    ),
                },
            ];
        }
        return [
            {
                title: '子任务ID',
                width: '100px',
                dataIndex: 'sub_task_id',
                align: 'center',
            },
            {
                title: '任务开始时间',
                width: '100px',
                dataIndex: 'start_time',
                align: 'center',
                render: timestamp => utcToLocal(timestamp),
            },
            {
                title: '任务结束时间',
                width: '100px',
                dataIndex: 'end_time',
                align: 'center',
                render: timestamp => utcToLocal(timestamp),
            },
            {
                title: '任务创建状态',
                width: '100px',
                dataIndex: 'create_status',
                align: 'center',
                render: (status: TaskCreateStatusCode) => TaskCreateStatusMap[status],
            },
            {
                title: '更新状态',
                width: '100px',
                dataIndex: 'status',
                align: 'center',
                render: (status: TaskStatusCode) => TaskStatusMap[status],
            },
            {
                title: '已更新的商品数',
                width: '100px',
                dataIndex: 'progress',
                align: 'center',
            },
            {
                title: '操作',
                width: '126px',
                dataIndex: 'action',
                align: 'center',
                render: (_, record) => (
                    <Button onClick={() => showSubTaskProgressModal(record)}>查看任务进度</Button>
                ),
            },
        ];
    }, [props.task_type]);

    const onShowSizeChange = useCallback((page: number, size: number) => {
        onChange(
            {
                current: page,
                pageSize: size,
            },
            undefined,
            undefined,
        );
    }, []);

    const onPageChange = useCallback((page: number, pageSize?: number) => {
        onChange(
            {
                current: page,
                pageSize: pageSize,
            },
            undefined,
            undefined,
        );
    }, []);

    return useMemo(() => {
        return (
            <div>
                <Table
                    rowKey="sub_task_id"
                    columns={columns}
                    dataSource={dataSource}
                    pagination={false}
                    loading={loading}
                    scroll={{ y: 280 }}
                />
                <Pagination
                    className="form-item"
                    pageSize={pageSize}
                    current={pageNumber}
                    total={total}
                    pageSizeOptions={['50', '100', '500', '1000']}
                    onChange={onPageChange}
                    onShowSizeChange={onShowSizeChange}
                    showSizeChanger={true}
                    showQuickJumper={{
                        goButton: <Button className="btn-go">Go</Button>,
                    }}
                    showLessItems={true}
                    showTotal={showTotal}
                />
            </div>
        );
    }, [loading, pageSize]);
};

export default SubTaskView;

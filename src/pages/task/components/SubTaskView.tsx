import React from 'react';
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

@BindAll()
class SubTaskView extends React.PureComponent<ISubTaskViewProps, ISubTaskViewState> {
    constructor(props: ISubTaskViewProps) {
        super(props);
        this.state = {
            pageNumber: 50,
            page: 1,
            total: 0,
            list: [],
            loading: false,
        };
    }
    componentDidMount(): void {
        this.queryList();
    }
    private showSubTaskProgressModal(record: ITaskProgressItem) {
        showTaskProgressModal(Object.assign({}, record, { task_type: this.props.task_type }));
    }
    private gatherColumns: ColumnProps<ITaskProgressItem>[] = [
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
                <Button onClick={() => this.showSubTaskProgressModal(record)}>查看任务进度</Button>
            ),
        },
    ];
    private groundingColumns: ColumnProps<ITaskProgressItem>[] = [
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
                <Button onClick={() => this.showSubTaskProgressModal(record)}>查看任务进度</Button>
            ),
        },
    ];
    private updateColumns: ColumnProps<ITaskProgressItem>[] = [
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
                <Button onClick={() => this.showSubTaskProgressModal(record)}>查看任务进度</Button>
            ),
        },
    ];
    private showTotal(total: number) {
        return <span className="data-grid-total">共有{total}条</span>;
    }
    private onPageChange(page: number, pageSize?: number) {
        this.queryList({
            page: page,
        });
    }
    private onShowSizeChange(page: number, size: number) {
        this.queryList({
            page: page,
            page_number: size,
        });
    }
    private queryList(params: { page?: number; page_number?: number } = {}) {
        const { page = this.state.page, page_number = this.state.pageNumber } = params;
        this.setState({
            loading: true,
        });
        queryTaskProgressList({
            page: page,
            page_number: page_number,
            task_id: this.props.task_Id,
        })
            .then(({ data: { list = [], total = 0 } = EmptyObject }) => {
                this.setState({
                    list,
                    total,
                    page: page,
                    pageNumber: page_number,
                });
            })
            .finally(() => {
                this.setState({
                    loading: false,
                });
            });
    }
    render() {
        const { list, page, pageNumber, total, loading } = this.state;
        const { task_type } = this.props;
        return (
            <div>
                <Table
                    rowKey="order_goods_sn"
                    columns={
                        task_type === void 0
                            ? undefined
                            : task_type === 0
                            ? this.gatherColumns
                            : task_type === 1
                            ? this.groundingColumns
                            : this.updateColumns
                    }
                    dataSource={list}
                    pagination={false}
                    loading={loading}
                    scroll={{ y: 280 }}
                />
                <Pagination
                    className="form-item"
                    pageSize={pageNumber}
                    current={page}
                    total={total}
                    pageSizeOptions={['50', '100', '500', '1000']}
                    onChange={this.onPageChange}
                    onShowSizeChange={this.onShowSizeChange}
                    showSizeChanger={true}
                    showQuickJumper={{
                        goButton: <Button className="btn-go">Go</Button>,
                    }}
                    showLessItems={true}
                    showTotal={this.showTotal}
                />
            </div>
        );
    }
}

export default SubTaskView;

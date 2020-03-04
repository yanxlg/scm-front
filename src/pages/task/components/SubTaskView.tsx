import React from 'react';
import { Button, Modal, Pagination, Table } from 'antd';
import { querySubTaskProgress } from '@/services/task';
import { BindAll } from 'lodash-decorators';
import '@/styles/config.less';
import '@/styles/modal.less';
import TaskProgressModal from '@/pages/task/components/TaskProgressModal';
import { TaskTypeEnum } from '@/enums/StatusEnum';
import { ColumnProps } from 'antd/es/table';

declare interface ISubTaskViewProps {
    task_Id: number;
}

declare interface ITaskItem {
    sub_task_id: number;
    start_time: number;
    end_time: number;
    create_status: 0 | 1;
    status: 0 | 1;
    incoming_num: number;
    grab_num: number;
    transform_incoming_num: number;
    incoming_fail_num: number;
    progress: number;
    task_type: TaskTypeEnum;
}

declare interface ISubTaskViewState {
    total: number;
    pageNumber: number;
    page: number;
    list: ITaskItem[];
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
    private showSubTaskProgressModal(record: ITaskItem) {
        Modal.info({
            content: (
                <TaskProgressModal sub_task_id={record.sub_task_id} task_type={record.task_type} />
            ),
            className: 'modal-empty',
            icon: null,
            maskClosable: true,
        });
    }
    private columns: ColumnProps<ITaskItem>[] = [
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
        },
        {
            title: '任务创建状态',
            width: '100px',
            dataIndex: 'create_status',
            align: 'center',
        },
        {
            title: '上架状态',
            width: '100px',
            dataIndex: 'status',
            align: 'center',
        },
        {
            title: '已入库的商品数',
            width: '100px',
            dataIndex: 'node',
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
        querySubTaskProgress({
            page: page,
            page_number: page_number,
            task_id: this.props.task_Id,
        })
            .then(({ data: { list = [], total = 0 } = {} }) => {
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
        return (
            <div>
                <Table
                    rowKey="order_goods_sn"
                    columns={this.columns}
                    dataSource={list}
                    pagination={false}
                    loading={loading}
                    scroll={{ y: 280 }}
                />
                <Pagination
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

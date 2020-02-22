import React, { RefObject } from 'react';
import TaskSearch from '@/pages/task/components/TaskSearch';
import { Button, message, Modal, Pagination } from 'antd';
import { ColumnProps } from 'antd/es/table';
import TaskLogView from '@/pages/task/components/TaskLogView';
import '@/styles/config.less';
import '@/styles/table.less';
import { getTaskList, deleteTasks, activeTasks } from '@/services/task';
import { BindAll } from 'lodash-decorators';
import { FitTable } from '@/components/FitTable';
import { TaskRangeList, TaskStatus, TaskStatusList, TaskType } from '@/enums/ConfigEnum';
import HotGather from '@/pages/task/components/HotGather';
import URLGather from '@/pages/task/components/URLGather';
import router from 'umi/router';
import { utcToLocal } from '@/utils/date';
import { ExclamationCircleOutlined } from '@ant-design/icons';

declare interface IALLTaskPageState {
    selectedRowKeys: string[];
    dataLoading: boolean;
    dataSet: IDataItem[];
    searchLoading: boolean;
    pageNumber: number;
    page: number;
    total: number;
    deleteLoading: boolean;
    activeLoading:boolean;
}

declare interface IDataItem {
    task_id: number;
    task_name: string;
    task_range: string;
    task_type: number;
    start_time: string;
    status: number;
    create_time: string;
}

declare interface IALLTaskPageProps {
    task_status?: TaskStatus;
}

@BindAll()
class ALLTaskPage extends React.PureComponent<IALLTaskPageProps, IALLTaskPageState> {
    private searchRef: RefObject<TaskSearch> = React.createRef();
    constructor(props: IALLTaskPageProps) {
        super(props);
        this.state = {
            selectedRowKeys: [],
            dataLoading: false,
            searchLoading: false,
            deleteLoading: false,
            activeLoading: false,
            dataSet: [],
            pageNumber: 50,
            page: 1,
            total: 0,
        };
    }
    componentDidMount(): void {
        this.queryList();
    }

    private onSearch(){
        this.queryList({
            searchLoading: true,
            page: 1,
        });
    };
    private queryList(
        params: { page?: number; page_number?: number; searchLoading?: boolean } = {},
    ) {
        const {
            page = this.state.page,
            page_number = this.state.pageNumber,
            searchLoading = false,
        } = params;
        const values = this.searchRef.current!.getFieldsValue();
        this.setState({
            dataLoading: true,
            searchLoading,
        });
        getTaskList({
            task_status:this.props.task_status,
            page: page,
            page_number: page_number,
            ...values,
        })
            .then(({ data: { task_info = [], total = 0 } = {} } = {}) => {
                this.setState({
                    page: page,
                    pageNumber: page_number,
                    dataSet: task_info,
                    total,
                });
            })
            .finally(() => {
                this.setState({
                    dataLoading: false,
                    searchLoading: false,
                });
            });
    }

    private getColumns(): ColumnProps<IDataItem>[] {
        const { page, pageNumber } = this.state;
        const { task_status } = this.props;
        const columns: ColumnProps<IDataItem>[] = [
            {
                title: '序号',
                width: '80px',
                dataIndex: 'index',
                fixed: 'left',
                align: 'center',
                render: (text: string, record: any, index: number) =>
                    index + 1 + pageNumber * (page - 1),
            },
            {
                title: '任务SN',
                width: '100px',
                fixed: 'left',
                dataIndex: 'task_sn',
                align: 'center',
            },
            {
                title: '任务ID',
                width: '100px',
                fixed: 'left',
                dataIndex: 'task_id',
                align: 'center',
            },
            {
                title: '任务名称',
                dataIndex: 'task_name',
                width: '178px',
                align: 'center',
            },
            {
                title: '任务范围',
                dataIndex: 'task_range',
                width: '182px',
                align: 'center',
                render:(text:number)=>TaskRangeList[text]
            },
            {
                title: '任务类型',
                dataIndex: 'task_type',
                width: '223px',
                align: 'center'
            },
            {
                title: '开始时间',
                dataIndex: 'start_time',
                width: '223px',
                align: 'center',
                render:(dateString)=>utcToLocal(dateString)
            },
            {
                title: '任务状态',
                dataIndex: 'status',
                width: '100px',
                align: 'center',
                render:(text:number)=>TaskStatusList[text]
            },
            {
                title: '创建时间',
                dataIndex: 'create_time',
                width: '200px',
                align: 'center',
                render:(dateString)=>utcToLocal(dateString)
            },
            {
                title: '操作',
                dataIndex: 'operation',
                align: 'center',
                render: (text: any, record: IDataItem) => {
                    const { task_status } = this.props;
                    if (task_status === void 0) {
                        return [
                            <Button
                                type="link"
                                key="0"
                                onClick={() => this.viewTaskResult(record.task_id)}
                            >
                                查看结果
                            </Button>,
                            <Button type="link" key="1" onClick={() => this.viewTaskDetail(record)}>
                                查看任务详情
                            </Button>,
                            <Button
                                type="link"
                                key="2"
                                onClick={() => this.showLogView(record.task_id)}
                            >
                                查看日志
                            </Button>,
                        ];
                    } else {
                        return [
                            <Button type="link" key="1" onClick={() => this.viewTaskDetail(record)}>
                                查看任务详情
                            </Button>,
                        ];
                    }
                },
            },
        ];
        if (task_status !== void 0) {
            columns.splice(7, 1);
        }
        return columns;
    }
    private onSelectChange(selectedRowKeys:React.Key[]) {
        this.setState({ selectedRowKeys: selectedRowKeys as string[] });
    }
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

    private showLogView(task_Id: number) {
        Modal.info({
            content: <TaskLogView task_Id={task_Id} />,
            className: 'modal-empty config-console-modal',
            icon: null,
            maskClosable: true,
        });
    }
    private viewTaskResult(task_id: number) {
        router.push({
            pathname: '/goods/local',
            state: {
                task_id,
            },
        });
    }
    private viewTaskDetail(task: IDataItem) {
        // task_range 分别弹不同的弹窗
        const { task_range, task_id } = task;
        if (task_range === "1") {
            // url
            Modal.info({
                content: <URLGather taskId={task_id} />,
                className: 'modal-empty config-modal-hot',
                icon: null,
                maskClosable: true,
            });
        } else {
            Modal.info({
                content: <HotGather taskId={task_id} />,
                className: 'modal-empty config-modal-hot',
                icon: null,
                maskClosable: true,
            });
        }
    }
    private deleteTasks() {
        const { selectedRowKeys } = this.state;
        const ids = selectedRowKeys.join(",");
        Modal.confirm({
            title: '确定要删除选中的任务吗？',
            icon: <ExclamationCircleOutlined />,
            content: `任务ID包括:${ids}`,
            okText: '确定',
            okType: 'danger',
            cancelText: '取消',
            onOk:()=>{
                this.setState({
                    deleteLoading: true,
                });
                deleteTasks(selectedRowKeys.join(','))
                    .then(() => {
                        message.success("任务删除成功!");
                        this.queryList({
                            searchLoading: true,
                        });
                    }).finally(() => {
                        this.setState({
                            deleteLoading: false,
                        });
                    });
            },
        });
    }

    private activeTasks(){
        const { selectedRowKeys } = this.state;
        this.setState({
            activeLoading: true,
        });
        activeTasks(selectedRowKeys.join(','))
            .then(() => {
                this.queryList({
                    searchLoading: true,
                });
            })
            .finally(() => {
                this.setState({
                    activeLoading: false,
                });
            });
    }

    render() {
        const {
            selectedRowKeys,
            dataLoading,
            deleteLoading,
            dataSet,
            searchLoading,
            page,
            pageNumber,
            total,
            activeLoading
        } = this.state;
        const rowSelection = {
            fixed: true,
            columnWidth: '50px',
            selectedRowKeys: selectedRowKeys,
            onChange: this.onSelectChange,
        };
        const { task_status } = this.props;
        const selectTaskSize = selectedRowKeys.length;
        return (
            <div>
                <TaskSearch ref={this.searchRef} task_status={task_status} />
                <div className="form-item">
                    <div className="block">
                        <Button loading={searchLoading} onClick={this.onSearch} type="primary">
                            查询
                        </Button>
                        {(task_status === void 0 ||
                            task_status === TaskStatus.Executed ||
                            task_status === TaskStatus.Failed) && (
                            <Button type="link" disabled={selectTaskSize === 0}>
                                重新执行任务
                            </Button>
                        )}
                        {(task_status === void 0 ||
                            task_status === TaskStatus.UnExecuted) && (
                            <Button loading={activeLoading} type="link" disabled={selectTaskSize === 0} onClick={this.activeTasks}>
                                立即执行任务
                            </Button>
                        )}
                        <Button type="link" disabled={selectTaskSize === 0}>
                            终止任务
                        </Button>
                        <Button
                            type="link"
                            loading={deleteLoading}
                            disabled={selectTaskSize === 0}
                            onClick={this.deleteTasks}
                        >
                            删除任务
                        </Button>
                        <Pagination
                            className="float-right"
                            pageSize={pageNumber}
                            current={page}
                            total={total}
                            pageSizeOptions={['50','100','500','1000']}
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
                    <FitTable
                        className="form-item"
                        rowKey="task_id"
                        bordered={true}
                        rowSelection={rowSelection}
                        columns={this.getColumns()}
                        dataSource={dataSet}
                        pagination={false}
                        loading={dataLoading}
                        scroll={{
                            x: task_status === void 0 ? 1600 : 1500,
                            scrollToFirstRowOnChange: true,
                        }}
                        bottom={130}
                    />
                </div>
            </div>
        );
    }
}

export default ALLTaskPage;

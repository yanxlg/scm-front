import React, { useCallback, useEffect, useMemo, useState } from 'react';
import '@/styles/config.less';
import { Button, Pagination, Table } from 'antd';
import { ColumnProps } from 'antd/lib/table';
import { getTaskList, queryTaskLog } from '@/services/task';
import { TaskStatusMap } from '@/enums/StatusEnum';

declare interface ITaskLogViewProps {
    task_Id: number;
}

declare interface ILogItem {
    task_send_time: string;
    status: string;
    sub_task_id: number;
    node: number;
}

const TaskNodeMap: { [key: number]: string } = {
    0: '创建任务',
    1: '爬取入库',
    2: '爬虫采集',
    3: '转化入库',
};

const TaskActionMap: { [key: number]: string } = {
    0: '发起',
    1: '推进',
    2: '完结',
    3: '终止',
    4: '失败',
};

const columns: ColumnProps<ILogItem>[] = [
    {
        title: '时间',
        width: '100px',
        dataIndex: 'task_send_time',
        align: 'center',
    },
    {
        title: '子任务ID',
        width: '100px',
        dataIndex: 'sub_task_id',
        align: 'center',
    },
    {
        title: '节点',
        width: '100px',
        dataIndex: 'node',
        align: 'center',
        render: (node: number) => TaskNodeMap[node],
    },
    {
        title: '动作',
        width: '126px',
        dataIndex: 'action',
        align: 'center',
        render: (action: number) => TaskActionMap[action],
    },
    {
        title: '内容',
        width: '126px',
        dataIndex: 'content',
        align: 'center',
    },
];

declare interface ITaskLogViewState {
    total: number;
    pageNumber: number;
    page: number;
    list: ILogItem[];
}

const TaskLogView: React.FC<ITaskLogViewProps> = ({ task_Id }) => {
    const [loading, setLoading] = useState(true);
    const [state, setState] = useState<ITaskLogViewState>({
        pageNumber: 50,
        page: 1,
        total: 0,
        list: [],
    });

    const queryList = useCallback(
        (params: { page?: number; page_number?: number } = {}) => {
            const { page = state.page, page_number = state.pageNumber } = params;
            setLoading(true);
            queryTaskLog({
                page: page,
                page_number: page_number,
                task_id: task_Id,
            })
                .then(({ data: { list = [], total = 0 } = {} }) => {
                    setState({
                        ...state,
                        list,
                        total,
                    });
                })
                .finally(() => {
                    setLoading(false);
                });
        },
        [state],
    );

    useEffect(() => {
        queryList();
    }, []);

    const showTotal = useCallback((total: number) => {
        return <span className="data-grid-total">共有{total}条</span>;
    }, []);
    const onPageChange = useCallback((page: number, pageSize?: number) => {
        queryList({
            page: page,
        });
    }, []);

    const onShowSizeChange = useCallback((page: number, size: number) => {
        queryList({
            page: page,
            page_number: size,
        });
    }, []);

    return useMemo(() => {
        const { list, page, pageNumber, total } = state;
        return (
            <div className="config-console-content">
                <Table
                    className="form-item"
                    rowKey="order_goods_sn"
                    columns={columns}
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
    }, [loading, state]);
};

export default TaskLogView;

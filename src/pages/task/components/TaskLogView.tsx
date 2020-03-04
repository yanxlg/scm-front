import React, { useEffect, useMemo, useState } from 'react';
import '@/styles/config.less';
import { Button, Pagination, Table } from 'antd';
import { ColumnProps } from 'antd/lib/table';
import { queryTaskLog } from '@/services/task';
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
    const [dataSet, setDataSet] = useState<ILogItem[]>([]);
    const [state, setState] = useState<ITaskLogViewState>({
        pageNumber: 50,
        page: 1,
        total: 0,
        list: [],
    });

    useEffect(() => {
        queryTaskLog(task_Id)
            .then(({ data = [] }) => {
                setDataSet(data);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);
    return useMemo(() => {
        return (
            <div className="config-console-content">
                <Table
                    className="form-item"
                    rowKey="order_goods_sn"
                    columns={columns}
                    dataSource={dataSet}
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
    }, [loading, dataSet]);
};

export default TaskLogView;

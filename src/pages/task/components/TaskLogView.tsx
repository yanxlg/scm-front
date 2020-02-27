import React, { useEffect, useMemo, useState } from 'react';
import '@/styles/config.less';
import { Table } from 'antd';
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
}

const columns: ColumnProps<ILogItem>[] = [
    {
        title: '序号',
        width: '100px',
        dataIndex: 'sub_task_id',
        fixed: 'left',
        align: 'center',
        // render: (text: string, record: any, index: number) => index + 1,
    },
    {
        title: '任务时间',
        width: '126px',
        dataIndex: 'task_send_time',
        align: 'center',
    },
    {
        title: '任务状态',
        width: '126px',
        dataIndex: 'status',
        align: 'center',
        render: task_status => {
            return TaskStatusMap[task_status];
        },
    },
];

const TaskLogView: React.FC<ITaskLogViewProps> = ({ task_Id }) => {
    const [loading, setLoading] = useState(true);
    const [dataSet, setDataSet] = useState<ILogItem[]>([]);
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
                <div className="config-console-title">任务日志</div>
                <Table
                    className="form-item"
                    rowKey="order_goods_sn"
                    columns={columns}
                    dataSource={dataSet}
                    pagination={false}
                    loading={loading}
                    scroll={{ y: 280 }}
                />
            </div>
        );
    }, [loading, dataSet]);
};

export default TaskLogView;

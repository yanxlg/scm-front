import React, { useEffect, useMemo, useState } from 'react';
import '@/styles/config.less';
import {Table } from 'antd';
import { ColumnProps } from 'antd/lib/table';


declare interface ITaskLogViewProps {
    taskId: string;
}

declare interface ILogItem {
    task_time:string;
    status:string;
}

const columns:ColumnProps<ILogItem>[] = [ {
    title: '序号',
    width: '100px',
    dataIndex: 'index',
    fixed: 'left',
    align: 'center',
    render: (text: string, record: any, index: number) => index + 1,
},{
    title: '任务时间',
    width: '126px',
    dataIndex: 'task_time',
    align: 'center',
},{
    title: '任务状态',
    width: '126px',
    dataIndex: 'status',
    align: 'center',
}];

const TaskLogView: React.FC<ITaskLogViewProps> = ({ taskId }) => {
    const [loading, setLoading] = useState(true);
    const [dataSet,setDataSet] = useState<ILogItem[]>([]);
    useEffect(() => {
        // 获取数据
        setTimeout(()=>{
            setLoading(false);
            setDataSet([{
                task_time:"212",
                status:"22"
            },{
                task_time:"212",
                status:"22"
            },{
                task_time:"212",
                status:"22"
            },{
                task_time:"212",
                status:"22"
            },{
                task_time:"212",
                status:"22"
            },{
                task_time:"212",
                status:"22"
            },{
                task_time:"212",
                status:"22"
            },{
                task_time:"212",
                status:"22"
            },{
                task_time:"212",
                status:"22"
            },{
                task_time:"212",
                status:"22"
            },{
                task_time:"212",
                status:"22"
            },{
                task_time:"212",
                status:"22"
            },{
                task_time:"212",
                status:"22"
            }]);
        },3000)
    }, []);
    return useMemo(() => {
        return (
          <div className="config-console-content">
              <div className="config-console-title">
                  任务日志
              </div>
              <Table
                  className="config-card"
                  rowKey="order_goods_sn"
                  columns={columns}
                  dataSource={dataSet}
                  pagination={false}
                  loading={loading}
                  scroll={{ y: 280 }}
              />
          </div>
        );
    }, [loading,dataSet]);
};


export default TaskLogView;

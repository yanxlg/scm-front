import React from 'react';
import { Table } from 'antd';
import { ColumnProps } from 'antd/lib/table';
import LoadingButton from '@/components/LoadingButton';
import { Bind } from 'lodash-decorators';
import { TaskTypeEnum } from '@/enums/StatusEnum';

declare interface ITaskProgressItem {}

const columns: ColumnProps<ITaskProgressItem>[] = [
    {
        title: '上传中',
        width: '100px',
        dataIndex: 'grab_num',
        align: 'center',
    },
    {
        title: '上架中',
        width: '100px',
        dataIndex: 'transform_incoming_num',
        align: 'center',
    },
    {
        title: '已上架',
        width: '100px',
        dataIndex: 'incoming_num',
        align: 'center',
    },
    {
        title: '上架失败',
        width: '100px',
        dataIndex: 'incoming_fail_num',
        align: 'center',
    },
];

declare interface ITaskProgressModalState {
    list: ITaskProgressItem[];
    loading: boolean;
}

declare interface ITaskProgressModalProps {
    sub_task_id: number;
    task_type: TaskTypeEnum;
}

class TaskProgressModal extends React.PureComponent<
    ITaskProgressModalProps,
    ITaskProgressModalState
> {
    constructor(props: ITaskProgressModalProps) {
        super(props);
        this.state = {
            list: [],
            loading: true,
        };
    }
    @Bind()
    private queryDetail() {
        return new Promise(() => {});
    }
    render() {
        const { loading, list } = this.state;
        return (
            <div>
                <div>子任务id：3333</div>
                <div>任务开始时间：2020-02-25 00:00:00</div>
                <div>任务结束时间：</div>
                <LoadingButton onClick={this.queryDetail}>刷新</LoadingButton>
                <Table columns={columns} dataSource={list} pagination={false} loading={loading} />
            </div>
        );
    }
}

export default TaskProgressModal;

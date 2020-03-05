import React from 'react';
import { Descriptions, Table } from 'antd';
import { ColumnProps } from 'antd/lib/table';
import LoadingButton from '@/components/LoadingButton';
import { Bind } from 'lodash-decorators';
import { TaskTypeEnum } from '@/enums/StatusEnum';
import { querySubTaskProgress } from '@/services/task';
import { ISubTaskProgressResponse } from '@/interface/ITask';
import { EmptyObject } from '@/enums/ConfigEnum';

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
    detail?: ISubTaskProgressResponse;
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
        this.state = {};
    }
    @Bind()
    private queryDetail() {
        return querySubTaskProgress({ sub_task_id: this.props.sub_task_id }).then(() => {});
    }
    render() {
        const { detail } = this.state;
        return (
            <div>
                <div>子任务id：3333</div>
                <div>任务开始时间：2020-02-25 00:00:00</div>
                <div>任务结束时间：</div>
                <LoadingButton onClick={this.queryDetail}>刷新</LoadingButton>
                <Descriptions
                    bordered={true}
                    column={{ xxl: 4, xl: 3, lg: 3, md: 3, sm: 2, xs: 1 }}
                >
                    <Descriptions.Item label="爬取中">{detail?.grab_num}</Descriptions.Item>
                    <Descriptions.Item label="更新中">
                        {detail?.transform_incoming_num}
                    </Descriptions.Item>
                    <Descriptions.Item label="已更新">{detail?.incoming_num}</Descriptions.Item>
                    <Descriptions.Item label="更新失败">
                        {detail?.incoming_fail_num}
                    </Descriptions.Item>
                </Descriptions>
            </div>
        );
    }
}

export default TaskProgressModal;

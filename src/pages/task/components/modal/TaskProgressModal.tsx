import React from 'react';
import { Card, Descriptions, Modal } from 'antd';
import LoadingButton from '@/components/LoadingButton';
import { Bind } from 'lodash-decorators';
import { querySubTaskProgress } from '@/services/task';
import { ISubTaskProgressResponse, ITaskProgressItem } from '@/interface/ITask';
import { utcToLocal } from '@/utils/date';
import '@/styles/task.less';
import { TaskTypeEnum } from '@/enums/StatusEnum';
import { EmptyObject } from '@/config/global';

declare interface ITaskProgressModalState {
    detail?: ISubTaskProgressResponse;
    loading: boolean;
}

class TaskProgressModal extends React.PureComponent<ITaskProgressItem, ITaskProgressModalState> {
    constructor(props: ITaskProgressItem) {
        super(props);
        this.state = {
            loading: true,
        };
    }
    componentDidMount(): void {
        this.queryDetail().finally(() => {
            this.setState({
                loading: false,
            });
        });
    }

    @Bind()
    private queryDetail() {
        return querySubTaskProgress({
            sub_task_id: this.props.sub_task_id,
        }).then(({ data } = EmptyObject) => {
            this.setState({
                detail: data,
            });
        });
    }
    render() {
        const { detail, loading } = this.state;
        const { sub_task_id, start_time, end_time, task_type } = this.props;
        const label =
            task_type === TaskTypeEnum.Gather
                ? ['爬取中', '转化入库中', '已入库', '入库失败']
                : task_type === TaskTypeEnum.Grounding
                ? ['未上架', '上架中', '已上架', '上架失败']
                : ['爬取中', '更新中', '已更新', '更新失败'];
        return (
            <div>
                <div>子任务id：{sub_task_id}</div>
                <div>任务开始时间：{utcToLocal(start_time)}</div>
                <div>任务结束时间：{utcToLocal(end_time)}</div>
                <LoadingButton
                    className="task-btn-refresh"
                    onClick={this.queryDetail}
                    ghost={true}
                    type="primary"
                >
                    刷新
                </LoadingButton>
                <Card
                    loading={loading}
                    className="task-body task-detail-card task-detail-table"
                    bordered={false}
                >
                    <Descriptions size="small" layout="vertical" bordered={true} column={4}>
                        <Descriptions.Item label={label[0]}>{detail?.grab_num}</Descriptions.Item>
                        <Descriptions.Item label={label[1]}>
                            {detail?.transform_incoming_num}
                        </Descriptions.Item>
                        <Descriptions.Item label={label[2]}>
                            {detail?.incoming_num}
                        </Descriptions.Item>
                        <Descriptions.Item label={label[3]}>
                            {detail?.incoming_fail_num}
                        </Descriptions.Item>
                    </Descriptions>
                </Card>
            </div>
        );
    }
}

export function showTaskProgressModal(record: ITaskProgressItem) {
    Modal.info({
        content: <TaskProgressModal {...record} />,
        className: 'modal-empty task-modal-progress',
        icon: null,
        maskClosable: true,
    });
}

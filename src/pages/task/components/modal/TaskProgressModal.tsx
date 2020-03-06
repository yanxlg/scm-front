import React from 'react';
import { Descriptions } from 'antd';
import LoadingButton from '@/components/LoadingButton';
import { Bind } from 'lodash-decorators';
import { querySubTaskProgress } from '@/services/task';
import { ISubTaskProgressResponse, ITaskProgressItem } from '@/interface/ITask';
import { utcToLocal } from '@/utils/date';
import '@/styles/task.less';
import { EmptyObject } from '@/enums/ConfigEnum';

declare interface ITaskProgressModalState {
    detail?: ISubTaskProgressResponse;
}

class TaskProgressModal extends React.PureComponent<ITaskProgressItem, ITaskProgressModalState> {
    constructor(props: ITaskProgressItem) {
        super(props);
        this.state = {};
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
        const { detail } = this.state;
        const { sub_task_id, start_time, end_time, task_type } = this.props;
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
                {task_type === 0 ? (
                    <Descriptions
                        layout="vertical"
                        bordered={true}
                        column={{ xxl: 4, xl: 3, lg: 3, md: 3, sm: 2, xs: 1 }}
                    >
                        <Descriptions.Item label="爬取中">{detail?.grab_num}</Descriptions.Item>
                        <Descriptions.Item label="转化入库中">
                            {detail?.transform_incoming_num}
                        </Descriptions.Item>
                        <Descriptions.Item label="已入库">{detail?.incoming_num}</Descriptions.Item>
                        <Descriptions.Item label="入库失败">
                            {detail?.incoming_fail_num}
                        </Descriptions.Item>
                    </Descriptions>
                ) : task_type === 1 ? (
                    <Descriptions
                        layout="vertical"
                        bordered={true}
                        column={{ xxl: 4, xl: 3, lg: 3, md: 3, sm: 2, xs: 1 }}
                    >
                        <Descriptions.Item label="爬取中">{detail?.grab_num}</Descriptions.Item>
                        <Descriptions.Item label="转化入库中">
                            {detail?.transform_incoming_num}
                        </Descriptions.Item>
                        <Descriptions.Item label="已入库">{detail?.incoming_num}</Descriptions.Item>
                        <Descriptions.Item label="入库失败">
                            {detail?.incoming_fail_num}
                        </Descriptions.Item>
                    </Descriptions>
                ) : (
                    <Descriptions
                        layout="vertical"
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
                )}
            </div>
        );
    }
}

export default TaskProgressModal;

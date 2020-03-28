import React, { useEffect, useMemo, useState } from 'react';
import { Descriptions, Progress, Statistic, Tooltip } from 'antd';
import styles from '@/styles/_index.less';
import formStyle from '@/styles/_form.less';
import taskStyle from '@/styles/_task.less';
import tableStyle from '@/styles/_table.less';
import { ColumnsType } from 'antd/lib/table/interface';
import { CheckCircleFilled, CloseCircleFilled, ExclamationCircleOutlined } from '@ant-design/icons';
import { FitTable } from '@/components/FitTable';
import { queryTaskProgressList } from '@/services/task';
import { ITaskProgressResponse } from '@/interface/ITask';
import { TaskExecuteType, TaskRangeMap, TaskTypeCode, TaskTypeEnum } from '@/enums/StatusEnum';
import { utcToLocal } from '@/utils/date';

declare interface TaskProgressProps {
    checkedIds?: string[];
    task_id: number;
    task_type?: TaskTypeCode;
}

const TaskProgress: React.FC<TaskProgressProps> = ({ checkedIds, task_id, task_type }) => {
    const [dataSet, setDataSet] = useState<ITaskProgressResponse>({});

    const columns = useMemo<ColumnsType<any>>(() => {
        return [
            {
                title: '上架阶段',
                dataIndex: 'stage',
                align: 'center',
                width: 200,
            },
            {
                title: '待处理',
                dataIndex: 'wait_execute',
                align: 'center',
                width: 200,
                render: _ => <Statistic value={_ || 0} className={tableStyle.staticNumber} />,
            },
            {
                title: '进行中',
                dataIndex: 'executing',
                align: 'center',
                width: 200,
                render: _ => <Statistic value={_ || 0} className={tableStyle.staticNumber} />,
            },
            {
                title: '已成功',
                dataIndex: 'success',
                align: 'center',
                width: 200,
                render: _ => <Statistic value={_ || 0} className={tableStyle.staticNumber} />,
            },
            {
                title: '已失败',
                dataIndex: 'fail',
                align: 'center',
                width: 200,
                render: (_, record) => {
                    const value = _ || 0;
                    return (
                        <Statistic
                            value={value}
                            className={tableStyle.staticNumber}
                            suffix={
                                value ? (
                                    <Tooltip title={record.fail_reason}>
                                        <ExclamationCircleOutlined
                                            className={taskStyle.failureSuffixIcon}
                                        />
                                    </Tooltip>
                                ) : null
                            }
                        />
                    );
                },
            },
        ];
    }, []);

    const percent = useMemo(() => {
        return 50 + Math.ceil(Math.random() * 50);
    }, []);

    useEffect(() => {
        queryTaskProgressList({
            task_id: task_id,
            plan_id: checkedIds ? checkedIds.join(',') : undefined,
        }).then(({ data }) => {
            setDataSet(data);
        });
    }, [checkedIds]);

    return useMemo(() => {
        const {
            total_goods = 0,
            already_on_sale_goods = 0,
            already_catch_goods = 0,
            add_on_sale_goods = 0,
            add_catch_goods = 0,
            on_sale_goods = 0,
            catch_goods = 0,
            success = 0,
            fail = 0,
            list = [],
        } = dataSet;

        if (task_type === TaskTypeEnum.Gather) {
            return (
                <>
                    <Descriptions
                        layout="vertical"
                        bordered={true}
                        column={{
                            xl: 6,
                        }}
                        className={[styles.textCenter, formStyle.formSItem].join(' ')}
                    >
                        <Descriptions.Item label="列表商品总量">
                            <Statistic value={total_goods} className={tableStyle.staticNumber} />
                        </Descriptions.Item>
                        <Descriptions.Item label="本地已有商品量">
                            <Statistic
                                value={already_catch_goods}
                                className={tableStyle.staticNumber}
                            />
                        </Descriptions.Item>
                        <Descriptions.Item label="新增爬取商品量">
                            <Statistic
                                value={add_catch_goods}
                                className={tableStyle.staticNumber}
                            />
                        </Descriptions.Item>
                        <Descriptions.Item
                            label={
                                <span>
                                    <Progress
                                        className={taskStyle.progressIcon}
                                        strokeLinecap="round"
                                        width={14}
                                        strokeWidth={14}
                                        type="circle"
                                        percent={percent}
                                        status={'normal'}
                                        format={() => ''}
                                    />
                                    爬取中
                                </span>
                            }
                        >
                            <Statistic
                                value={catch_goods}
                                className={[tableStyle.staticNumber, taskStyle.progressText].join(
                                    ' ',
                                )}
                            />
                        </Descriptions.Item>
                        <Descriptions.Item
                            label={
                                <span>
                                    <CheckCircleFilled className={taskStyle.successIcon} />
                                    已成功
                                </span>
                            }
                        >
                            <Statistic
                                value={success}
                                className={[tableStyle.staticNumber, taskStyle.successText].join(
                                    ' ',
                                )}
                            />
                        </Descriptions.Item>
                        <Descriptions.Item
                            label={
                                <span>
                                    <CloseCircleFilled className={taskStyle.errorIcon} />
                                    已失效
                                </span>
                            }
                        >
                            <Statistic
                                value={fail}
                                className={[tableStyle.staticNumber, taskStyle.errorText].join(' ')}
                            />
                        </Descriptions.Item>
                    </Descriptions>
                    <div className={formStyle.formItem}>新增爬取商品阶段明细</div>
                    <div>
                        <FitTable columns={columns} dataSource={list} pagination={false} />
                    </div>
                </>
            );
        }
        if (task_type === TaskTypeEnum.Grounding) {
            return (
                <>
                    <Descriptions
                        layout="vertical"
                        bordered={true}
                        column={{
                            xl: 6,
                        }}
                        className={[styles.textCenter, formStyle.formSItem].join(' ')}
                    >
                        <Descriptions.Item label="列表商品总量">
                            <Statistic value={total_goods} className={tableStyle.staticNumber} />
                        </Descriptions.Item>
                        <Descriptions.Item label="已上架商品数">
                            <Statistic
                                value={already_on_sale_goods}
                                className={tableStyle.staticNumber}
                            />
                        </Descriptions.Item>
                        <Descriptions.Item label="新增上架商品数">
                            <Statistic
                                value={add_on_sale_goods}
                                className={tableStyle.staticNumber}
                            />
                        </Descriptions.Item>
                        <Descriptions.Item
                            label={
                                <span>
                                    <Progress
                                        className={taskStyle.progressIcon}
                                        strokeLinecap="round"
                                        width={14}
                                        strokeWidth={14}
                                        type="circle"
                                        percent={percent}
                                        status={'normal'}
                                        format={() => ''}
                                    />
                                    上架中
                                </span>
                            }
                        >
                            <Statistic
                                value={on_sale_goods}
                                className={[tableStyle.staticNumber, taskStyle.progressText].join(
                                    ' ',
                                )}
                            />
                        </Descriptions.Item>
                        <Descriptions.Item
                            label={
                                <span>
                                    <CheckCircleFilled className={taskStyle.successIcon} />
                                    已成功
                                </span>
                            }
                        >
                            <Statistic
                                value={success}
                                className={[tableStyle.staticNumber, taskStyle.successText].join(
                                    ' ',
                                )}
                            />
                        </Descriptions.Item>
                        <Descriptions.Item
                            label={
                                <span>
                                    <CloseCircleFilled className={taskStyle.errorIcon} />
                                    已失效
                                </span>
                            }
                        >
                            <Statistic
                                value={fail}
                                className={[tableStyle.staticNumber, taskStyle.errorText].join(' ')}
                            />
                        </Descriptions.Item>
                    </Descriptions>
                    <div className={formStyle.formItem}>新增爬取商品阶段明细</div>
                    <div>
                        <FitTable columns={columns} dataSource={list} pagination={false} />
                    </div>
                </>
            );
        }
        if (task_type === TaskTypeEnum.Update) {
            return null;
        }
        return null;
    }, [dataSet]);
};

export default TaskProgress;

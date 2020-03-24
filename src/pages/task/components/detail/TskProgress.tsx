import React, { useMemo } from 'react';
import { Descriptions, Progress, Statistic } from 'antd';
import styles from '@/styles/_index.less';
import formStyle from '@/styles/_form.less';
import taskStyle from '@/styles/_task.less';
import tableStyle from '@/styles/_table.less';
import { ColumnsType } from 'antd/lib/table/interface';
import { CheckCircleFilled, CloseCircleFilled, WarningFilled } from '@ant-design/icons';
import { FitTable } from '@/components/FitTable';

declare interface TaskProgressProps {}

const TaskProgress: React.FC = () => {
    const columns = useMemo<ColumnsType<any>>(() => {
        return [
            {
                title: '上架阶段',
                dataIndex: 'name',
                align: 'center',
                width: 200,
            },
            {
                title: '待处理',
                dataIndex: 'resolve',
                align: 'center',
                width: 200,
                render: _ => <Statistic value={_} className={tableStyle.staticNumber} />,
            },
            {
                title: '进行中',
                dataIndex: 'going',
                align: 'center',
                width: 200,
                render: _ => <Statistic value={_} className={tableStyle.staticNumber} />,
            },
            {
                title: '已成功',
                dataIndex: 'success',
                align: 'center',
                width: 200,
                render: _ => <Statistic value={_} className={tableStyle.staticNumber} />,
            },
            {
                title: '已失败',
                dataIndex: 'failure',
                align: 'center',
                width: 200,
                render: _ => (
                    <Statistic
                        value={_}
                        className={tableStyle.staticNumber}
                        suffix={<WarningFilled className={taskStyle.failureSuffixIcon} />}
                    />
                ),
            },
        ];
    }, []);

    const dataSource = [
        {
            name: '中台商品发布',
            resolve: 20,
            going: 300,
            success: 1000,
            failure: 30000,
        },
        {
            name: '翻译',
            resolve: 20,
            going: 300,
            success: 1000,
            failure: 30000,
        },
        {
            name: '保存翻译',
            resolve: 20,
            going: 300,
            success: 1000,
            failure: 30000,
        },
        {
            name: '发送上架任务',
            resolve: 20,
            going: 300,
            success: 1000,
            failure: 30000,
        },
        {
            name: '上传中',
            resolve: 20,
            going: 300,
            success: 1000,
            failure: 30000,
        },
    ];

    const percent = useMemo(() => {
        return 50 + Math.ceil(Math.random() * 50);
    }, []);

    return useMemo(() => {
        return (
            <>
                <Descriptions
                    layout="vertical"
                    bordered={true}
                    column={{
                        xl: 6,
                    }}
                    className={styles.textCenter}
                >
                    <Descriptions.Item label="列表商品数量">
                        <Statistic value={1128} className={tableStyle.staticNumber} />
                    </Descriptions.Item>
                    <Descriptions.Item label="已上架商品数">
                        <Statistic value={1128} className={tableStyle.staticNumber} />
                    </Descriptions.Item>
                    <Descriptions.Item label="新增上架商品数">
                        <Statistic value={1128} className={tableStyle.staticNumber} />
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
                            value={1128}
                            className={[tableStyle.staticNumber, taskStyle.progressText].join(' ')}
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
                            value={1128}
                            className={[tableStyle.staticNumber, taskStyle.successText].join(' ')}
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
                            value={1128}
                            className={[tableStyle.staticNumber, taskStyle.errorText].join(' ')}
                        />
                    </Descriptions.Item>
                </Descriptions>
                <div className={formStyle.formItem}>新增爬取商品阶段明细</div>
                <div>
                    <FitTable columns={columns} dataSource={dataSource} pagination={false} />
                </div>
            </>
        );
    }, []);
};

export default TaskProgress;

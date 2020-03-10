import React, { RefObject } from 'react';
import { Button, message, Pagination, Progress } from 'antd';
import { ColumnProps } from 'antd/es/table';
import { abortTasks, activeTasks, deleteTasks, getTaskList, reActiveTasks } from '@/services/task';
import { BindAll } from 'lodash-decorators';
import { FitTable } from '@/components/FitTable';
import router from 'umi/router';
import { convertEndDate, convertStartDate, utcToLocal } from '@/utils/date';
import {
    TaskRangeCode,
    TaskRangeMap,
    TaskStatusCode,
    TaskStatusEnum,
    TaskStatusList,
    TaskStatusMap,
    TaskTypeCode,
    TaskTypeEnum,
    TaskTypeList,
    TaskTypeMap,
} from '@/enums/StatusEnum';
import SearchForm, { IFieldItem } from '@/components/SearchForm';
import CollapsePopOver from '@/components/CollapsePopOver';
import { SearchOutlined } from '@ant-design/icons';
import LoadingButton from '@/components/LoadingButton';
import PopConfirmLoadingButton from '@/components/PopConfirmLoadingButton';
import '@/styles/config.less';
import '@/styles/table.less';
import '@/styles/task.less';
import { ITaskListItem, ITaskListQuery } from '@/interface/ITask';
import { EmptyObject } from '@/config/global';
import queryString from 'query-string';
import { connect } from '@/compatibility/connect';
import { ConnectProps } from '@/models/connect';
import CopyLink from '@/components/copyLink';

declare interface IALLTaskPageState {
    selectedRowKeys: string[];
    dataLoading: boolean;
    dataSet: ITaskListItem[];
    searchLoading: boolean;
    pageNumber: number;
    page: number;
    total: number;
    showMore: boolean;
}

declare interface IALLTaskPageProps {
    task_status?: TaskStatusEnum;
    initialValues?: ITaskListQuery;
    setCountArr: (count: number[]) => void;
}

declare interface ISearchFormConfig {
    default: IFieldItem[];
    expend: IFieldItem[];
    initialValues?: { [key: string]: any };
}

@BindAll()
class ALLTaskPage extends React.PureComponent<IALLTaskPageProps, IALLTaskPageState> {
    private defaultFormRef: RefObject<SearchForm> = React.createRef();
    private expendFormRef: RefObject<SearchForm> = React.createRef();
    private queryData: any = {};
    constructor(props: IALLTaskPageProps) {
        super(props);
        const { page, page_number, ...defaultInitialValues } = this.computeInitialValues();
        this.state = {
            selectedRowKeys: [],
            dataLoading: false,
            searchLoading: false,
            dataSet: [],
            pageNumber: page_number,
            page: page,
            total: 0,
            showMore: false,
        };

        this.allFieldsList.initialValues = Object.assign(
            {},
            this.allFieldsList.initialValues,
            defaultInitialValues,
        );
        this.unExecutedFieldsList.initialValues = Object.assign(
            {},
            this.allFieldsList.initialValues,
            defaultInitialValues,
        );
    }
    componentDidMount(): void {
        this.queryList();
    }

    private computeInitialValues() {
        // copy link 解析
        const { query, url } = queryString.parseUrl(window.location.href);
        if (query) {
            window.history.replaceState({}, '', url);
        }
        const routeInitialValues = this.props.initialValues ?? {};
        const {
            page = 1,
            page_number = 50,
            task_id = '',
            task_sn = '',
            task_status = '',
            task_name = '',
            task_type = '',
            task_begin_time = 0,
            task_end_time = 0,
        } = query;
        return {
            ...routeInitialValues,
            page: Number(page),
            page_number: Number(page_number),
            task_id,
            task_sn,
            task_status,
            task_name,
            task_type,
            task_begin_time: convertStartDate(Number(task_begin_time)),
            task_end_time: convertEndDate(Number(task_end_time)),
        };
    }
    private onSearch() {
        this.queryList({
            searchLoading: true,
            page: 1,
        });
    }
    private getFormFieldsValue() {
        const defaultFieldsValue = this.defaultFormRef.current!.getFieldsValue();
        const expendFieldsValue = this.expendFormRef.current!.getFieldsValue();
        return {
            ...defaultFieldsValue,
            ...expendFieldsValue,
        };
    }
    private queryList(
        params: { page?: number; page_number?: number; searchLoading?: boolean } = {},
    ) {
        const {
            page = this.state.page,
            page_number = this.state.pageNumber,
            searchLoading = false,
        } = params;
        const { task_status, ...values } = this.getFormFieldsValue();
        this.setState({
            dataLoading: true,
            searchLoading,
            selectedRowKeys: [],
        });
        const query = {
            task_status: task_status ?? this.props.task_status,
            page: page,
            page_number: page_number,
            ...values,
        };
        const initialTaskStatus = this.props.task_status;
        // 设置方法后才显示copylink
        this.queryData = {
            ...query,
            tabKey:
                initialTaskStatus === void 0
                    ? '1'
                    : initialTaskStatus === TaskStatusEnum.UnExecuted
                    ? '2'
                    : initialTaskStatus === TaskStatusEnum.Executing
                    ? '3'
                    : initialTaskStatus === TaskStatusEnum.Executed
                    ? '4'
                    : initialTaskStatus === TaskStatusEnum.Failed
                    ? 5
                    : '6',
        };

        return getTaskList(query)
            .then(
                ({
                    data: {
                        task_info = [],
                        total = 0,
                        task_total_num = 0,
                        task_not_execute_num = 0,
                        task_execting_num = 0,
                        task_exected_num = 0,
                        task_exected_fail_num = 0,
                        task_ternimation_num = 0,
                    } = {},
                } = EmptyObject) => {
                    this.setState({
                        page: page,
                        pageNumber: page_number,
                        dataSet: task_info,
                        total,
                    });
                    this.props.setCountArr([
                        task_total_num,
                        task_not_execute_num,
                        task_execting_num,
                        task_exected_num,
                        task_exected_fail_num,
                        task_ternimation_num,
                    ]);
                },
            )
            .finally(() => {
                this.setState({
                    dataLoading: false,
                    searchLoading: false,
                });
            });
    }
    private columns: ColumnProps<ITaskListItem>[] = [
        {
            title: '操作',
            dataIndex: 'operation',
            align: 'center',
            fixed: 'left',
            width: '150px',
            render: (text: any, record: ITaskListItem) => {
                return (
                    <Button type="link" onClick={() => this.viewTaskDetail(record.task_id)}>
                        查看任务详情
                    </Button>
                );
            },
        },
        {
            title: '任务ID',
            width: '100px',
            fixed: 'left',
            dataIndex: 'task_id',
            align: 'center',
        },
        {
            title: '任务SN',
            width: '200px',
            fixed: 'left',
            dataIndex: 'task_sn',
            align: 'center',
        },
        {
            title: '任务名称',
            dataIndex: 'task_name',
            width: '178px',
            align: 'center',
        },
        {
            title: '任务状态',
            dataIndex: 'status',
            width: '130px',
            align: 'center',
            render: (status: string, record) => {
                // 目前只有采集任务支持查看结果
                const percent =
                    status === '0' ? 0 : status === '1' ? 50 : status === '2' ? 100 : 100;
                const { result = 0, task_type } = record;
                return (
                    <>
                        <div>
                            <Progress
                                className="task-progress-circle"
                                width={20}
                                strokeWidth={15}
                                strokeLinecap="round"
                                type="circle"
                                percent={percent}
                                status={
                                    status === '2'
                                        ? 'success'
                                        : status === '3'
                                        ? 'exception'
                                        : 'normal'
                                }
                                format={() => ''}
                            />
                            {TaskStatusMap[(status as unknown) as TaskStatusCode]}
                        </div>
                        {task_type !== TaskTypeEnum.Gather ||
                        status === '0' ||
                        status === '1' ||
                        result < 1 ? null : (
                            <Button type="link" onClick={() => this.viewTaskResult(record.task_id)}>
                                查看结果
                            </Button>
                        )}
                    </>
                );
            },
        },
        {
            title: '任务类型',
            dataIndex: 'task_type',
            width: '223px',
            align: 'center',
            render: (text: TaskTypeCode) => TaskTypeMap[text],
        },
        {
            title: '任务范围',
            dataIndex: 'task_range',
            width: '182px',
            align: 'center',
            render: (text: TaskRangeCode) => TaskRangeMap[text],
        },
        {
            title: '任务周期',
            dataIndex: 'execute_count',
            width: '223px',
            align: 'center',
            render: count => (count === '1' ? '单次' : '定时'),
        },
        {
            title: '创建时间',
            dataIndex: 'create_time',
            width: '223px',
            align: 'center',
            render: dateString => utcToLocal(dateString),
        },
        {
            title: '开始时间',
            dataIndex: 'start_time',
            width: '223px',
            align: 'center',
            render: dateString => utcToLocal(dateString),
        },
        {
            title: '结束时间',
            dataIndex: 'end_time',
            width: '200px',
            align: 'center',
            render: dateString => utcToLocal(dateString),
        },
    ];
    private onSelectChange(selectedRowKeys: React.Key[]) {
        this.setState({ selectedRowKeys: selectedRowKeys as string[] });
    }
    private showTotal(total: number) {
        return <span className="data-grid-total">共有{total}条</span>;
    }
    private onPageChange(page: number, pageSize?: number) {
        this.queryList({
            page: page,
        });
    }
    private onShowSizeChange(page: number, size: number) {
        this.queryList({
            page: page,
            page_number: size,
        });
    }

    private viewTaskResult(task_id: number) {
        router.push({
            pathname: '/goods/local',
            state: {
                task_id,
            },
        });
    }

    private viewTaskDetail(task_id: number) {
        router.push(`/task/list/${task_id}`);
    }

    private deleteTasks() {
        const { selectedRowKeys } = this.state;
        return deleteTasks(selectedRowKeys.join(',')).then(() => {
            message.success('任务删除成功!');
            this.queryList({
                searchLoading: true,
            });
        });
    }

    private activeTasks() {
        const { selectedRowKeys } = this.state;
        return activeTasks(selectedRowKeys.join(',')).then(() => {
            this.queryList({
                searchLoading: true,
            });
        });
    }

    private reActiveTasks() {
        const { selectedRowKeys } = this.state;
        return reActiveTasks(selectedRowKeys.join(',')).then(() => {
            this.queryList({
                searchLoading: true,
            });
        });
    }

    private abortTasks() {
        const { selectedRowKeys } = this.state;
        return abortTasks(selectedRowKeys.join(',')).then(() => {
            message.success('任务已终止!');
            this.queryList({
                searchLoading: true,
            });
        });
    }

    private allFieldsList: ISearchFormConfig = {
        initialValues: {
            task_status: '',
            task_type: '',
        },
        default: [
            {
                label: (
                    <span>
                        任务<span className="task-justify-1">ID</span>
                    </span>
                ),
                type: 'input',
                name: 'task_id',
                className: 'input-default',
                formItemClassName: 'form-item',
            },
            {
                label: (
                    <span>
                        任务<span className="task-justify-1">SN</span>
                    </span>
                ),
                type: 'number',
                name: 'task_sn',
                className: 'input-default input-handler',
                formItemClassName: 'form-item',
                formatter: 'number',
            },
            {
                label: '任务状态',
                type: 'select',
                name: 'task_status',
                className: 'select-default',
                formItemClassName: 'form-item',
                formatter: 'number',
                optionList: [
                    {
                        name: '全部',
                        value: '',
                    },
                ].concat(
                    TaskStatusList.map(({ id, name }) => {
                        return {
                            name,
                            value: id,
                        };
                    }),
                ),
            },
        ],
        expend: [
            {
                label: '任务名称',
                type: 'input',
                name: 'task_name',
                className: 'input-default',
                formItemClassName: 'form-item',
            },
            {
                label: '任务类型',
                type: 'select',
                name: 'task_type',
                className: 'select-default',
                formItemClassName: 'form-item',
                formatter: 'number',
                optionList: [
                    {
                        name: '全部',
                        value: '',
                    },
                ].concat(
                    TaskTypeList.map(({ id, name }) => {
                        return {
                            name,
                            value: id,
                        };
                    }),
                ),
            },
            {
                label: '开始时间',
                type: 'datePicker',
                name: 'task_begin_time',
                className: 'input-default',
                formItemClassName: 'form-item',
                formatter: 'start_date',
                dateEndWith: ['task_end_time'],
            },
            {
                label: '结束时间',
                type: 'datePicker',
                name: 'task_end_time',
                className: 'input-default',
                formItemClassName: 'form-item',
                formatter: 'end_date',
                dateBeginWith: ['task_begin_time'],
            },
        ],
    };
    private unExecutedFieldsList: ISearchFormConfig = {
        initialValues: {
            task_type: '',
        },
        default: [
            {
                label: (
                    <span>
                        任务<span className="task-justify-1">ID</span>
                    </span>
                ),
                type: 'input',
                name: 'task_id',
                className: 'input-default',
                formItemClassName: 'form-item',
            },
            {
                label: (
                    <span>
                        任务<span className="task-justify-1">SN</span>
                    </span>
                ),
                type: 'number',
                name: 'task_sn',
                className: 'input-default input-handler',
                formItemClassName: 'form-item',
                formatter: 'number',
            },
        ],
        expend: [
            {
                label: '任务名称',
                type: 'input',
                name: 'task_name',
                className: 'input-default',
                formItemClassName: 'form-item',
            },
            {
                label: '任务类型',
                type: 'select',
                name: 'task_type',
                className: 'select-default',
                formItemClassName: 'form-item',
                formatter: 'number',
                optionList: [
                    {
                        name: '全部',
                        value: '',
                    },
                ].concat(
                    TaskTypeList.map(({ id, name }) => {
                        return {
                            name,
                            value: id,
                        };
                    }),
                ),
            },
            {
                label: '开始时间',
                type: 'datePicker',
                name: 'task_begin_time',
                className: 'input-default',
                formItemClassName: 'form-item',
                dateEndWith: ['task_end_time'],
                formatter: 'start_date',
            },
            {
                label: '结束时间',
                type: 'datePicker',
                name: 'task_end_time',
                className: 'input-default',
                formItemClassName: 'form-item',
                dateBeginWith: ['task_begin_time'],
                formatter: 'end_date',
            },
        ],
    };
    private toggleShowMore() {
        this.setState({
            showMore: !this.state.showMore,
        });
    }
    private onRefresh() {
        return this.queryList();
    }
    private getCopiedLinkQuery() {
        return this.queryData;
    }
    render() {
        const {
            selectedRowKeys,
            dataLoading,
            dataSet,
            searchLoading,
            page,
            pageNumber,
            total,
            showMore,
        } = this.state;
        const rowSelection = {
            fixed: true,
            columnWidth: '50px',
            selectedRowKeys: selectedRowKeys,
            onChange: this.onSelectChange,
        };
        const { task_status } = this.props;
        const selectTaskSize = selectedRowKeys.length;
        const formConfig = task_status === void 0 ? this.allFieldsList : this.unExecutedFieldsList;
        return (
            <div>
                <SearchForm
                    ref={this.defaultFormRef}
                    fieldList={formConfig.default}
                    initialValues={formConfig.initialValues}
                >
                    <Button
                        className="form-item btn-group"
                        loading={searchLoading}
                        onClick={this.onSearch}
                        type="primary"
                        icon={<SearchOutlined />}
                    >
                        查询
                    </Button>
                    <Button
                        className="form-item btn-group btn-clear"
                        type="link"
                        onClick={this.toggleShowMore}
                    >
                        更多搜索条件
                    </Button>
                    <LoadingButton
                        onClick={this.onRefresh}
                        className="form-item btn-group btn-clear"
                        type="link"
                    >
                        刷新
                    </LoadingButton>
                </SearchForm>
                <CollapsePopOver collapse={showMore}>
                    <SearchForm
                        ref={this.expendFormRef}
                        className="form-item-bottom"
                        fieldList={formConfig.expend}
                        initialValues={formConfig.initialValues}
                    />
                </CollapsePopOver>

                <div className="form-item">
                    <div className="block float-clear">
                        {(task_status === void 0 || task_status === TaskStatusEnum.UnExecuted) && (
                            <LoadingButton
                                type="link"
                                disabled={selectTaskSize === 0}
                                onClick={this.activeTasks}
                                className="btn-clear btn-group"
                            >
                                立即执行任务
                            </LoadingButton>
                        )}
                        {(task_status === void 0 || task_status === TaskStatusEnum.Failed) && (
                            <LoadingButton
                                type="link"
                                disabled={selectTaskSize === 0}
                                onClick={this.reActiveTasks}
                                className="btn-clear btn-group"
                            >
                                重新执行任务
                            </LoadingButton>
                        )}
                        {task_status === TaskStatusEnum.Executed ||
                        task_status === TaskStatusEnum.Failed ||
                        task_status === TaskStatusEnum.Terminated ? null : (
                            <LoadingButton
                                type="link"
                                disabled={selectTaskSize === 0}
                                className="btn-clear btn-group"
                                onClick={this.abortTasks}
                            >
                                终止任务
                            </LoadingButton>
                        )}
                        <PopConfirmLoadingButton
                            buttonProps={{
                                danger: true,
                                type: 'link',
                                className: 'btn-clear btn-group',
                                disabled: selectTaskSize === 0,
                                children: '删除任务',
                            }}
                            popConfirmProps={{
                                title: '确定要删除选中的任务吗?',
                                okText: '确定',
                                cancelText: '取消',
                                disabled: selectTaskSize === 0,
                                onConfirm: this.deleteTasks,
                            }}
                        />
                        <Pagination
                            className="float-right float-clear"
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
                    <FitTable
                        className="form-item"
                        rowKey="task_id"
                        bordered={true}
                        rowSelection={rowSelection}
                        columns={this.columns}
                        dataSource={dataSet}
                        pagination={false}
                        loading={dataLoading}
                        scroll={{
                            x: true,
                            scrollToFirstRowOnChange: true,
                        }}
                        bottom={130}
                    />
                </div>
                <CopyLink getCopiedLinkQuery={this.getCopiedLinkQuery} />
            </div>
        );
    }
}

export default ALLTaskPage;

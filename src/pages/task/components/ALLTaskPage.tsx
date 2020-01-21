import React, { RefObject } from 'react';
import TaskSearch, { _TaskSearch, IFormData } from '@/pages/task/components/TaskSearch';
import { Button, Modal, Pagination, Table } from 'antd';
import { ColumnProps } from 'antd/es/table';
import TaskLogView from '@/pages/task/components/TaskLogView';
import "@/styles/config.less";
import "@/styles/table.less";
import { getTaskList } from '@/services/task';
import {BindAll} from 'lodash-decorators';


declare interface IALLTaskPageState {
    selectedRowKeys:string[];
    dataLoading:boolean;
    dataSet:IDataItem[];
    searchLoading:boolean;
    pageNumber:number;
    page:number;
    total:number;
}

declare interface IDataItem {
    task_id: string;
    task_name: string;
    task_range: string;
    task_type: string;
    start_time: string;
    status:string;
    create_time:string;
}

@BindAll()
class ALLTaskPage extends React.PureComponent<{},IALLTaskPageState>{
    private searchRef:RefObject<_TaskSearch> = React.createRef();
    constructor(props:{}){
        super(props);
        this.state={
            selectedRowKeys:[],
            dataLoading:false,
            searchLoading:false,
            dataSet:[],
            pageNumber:20,
            page:1,
            total:0
        }
    }
    componentDidMount(): void {
        this.queryList();
    }

    private onSearch=()=>{
        this.setState({
            searchLoading:true,
        });
        const values = this.searchRef.current!.getValues();
        this.queryList({
            searchLoading:true,
            page:1,
            ...values
        });
    };
    private queryList(params:{page?:number;page_number?:number;searchLoading?:boolean}&IFormData={}){
        const {page=this.state.page,page_number=this.state.pageNumber,searchLoading=false} = params;
        this.setState({
            dataLoading:true,
            searchLoading,
        });
        getTaskList({
            page:page,
            page_number:page_number
        }).then(({data:{data:{task_info=[],total=0}={}}={}}={})=>{
            this.setState({
                page:page,
                pageNumber:page_number,
                dataSet:task_info,
                total
            });
        }).finally(()=>{
            this.setState({
                dataLoading:false,
                searchLoading:false
            })
        })
    }

    private getColumns(): ColumnProps<IDataItem>[] {
        const { page, pageNumber } = this.state;
        return [
            {
                title: '序号',
                width: '100px',
                dataIndex: 'index',
                fixed: 'left',
                align: 'center',
                render: (text: string, record: any, index: number) => index + 1 + pageNumber * (page - 1),
            },
            {
                title: '任务ID',
                width: '126px',
                dataIndex: 'task_id',
                align: 'center',
            },
            {
                title: '任务名称',
                dataIndex: 'task_name',
                width: '178px',
                align: 'center',
            },
            {
                title: '任务范围',
                dataIndex: 'task_range',
                width: '182px',
                align: 'center',
            },
            {
                title: '任务类型',
                dataIndex: 'task_type',
                width: '223px',
                align: 'center',
            },
            {
                title: '开始时间',
                dataIndex: 'start_time',
                width: '223px',
                align: 'center',
            },
            {
                title: '任务状态',
                dataIndex: 'status',
                width: '106px',
                align: 'center',
            },
            {
                title: '创建时间',
                dataIndex: 'create_time',
                width: '200px',
                align: 'center',
            },
            {
                title: '操作',
                dataIndex: 'operation',
                width: '100px',
                align: 'center',
                render: (text: any, record: IDataItem) => {
                    return [
                        <Button type="link" key="0">查看结果</Button>,
                        <Button type="link" key="1">查看任务详情</Button>,
                        <Button type="link" key="2" onClick={()=>this.showLogView(record.task_id)}>查看日志</Button>
                    ]
                },
            },
        ];
    }
    private onSelectChange(selectedRowKeys: string[] | number[]) {
        this.setState({ selectedRowKeys:selectedRowKeys as string[]});
    };
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
            page:page,
            page_number: size,
        });
    }


    private showLogView(taskId:string){
        Modal.info({
            content:<TaskLogView taskId={taskId}/>,
            className:"modal-empty config-console-modal",
            icon:null,
            maskClosable:true
        });
    }

    render(){
        const {selectedRowKeys, dataLoading, dataSet, searchLoading,page,pageNumber,total} = this.state;
        const rowSelection = {
            fixed: true,
            columnWidth: '100px',
            selectedRowKeys: selectedRowKeys,
            onChange: this.onSelectChange,
        };
        return (
            <div>
                <TaskSearch wrappedComponentRef={this.searchRef}/>
                <div className="config-card">
                    <div className="block">
                        <Button loading={searchLoading} onClick={this.onSearch} type="primary">查询</Button>
                        <Button type="link">重新执行任务</Button>
                        <Button type="link">终止任务</Button>
                        <Button type="link">设置执行顺序</Button>
                        <Button type="link">删除任务</Button>
                        <Pagination
                            className="float-right"
                            pageSize={pageNumber}
                            current={page}
                            total={total}
                            pageSizeOptions={['100', '200', '500']}
                            onChange={this.onPageChange}
                            onShowSizeChange={this.onShowSizeChange}
                            showSizeChanger={true}
                            showQuickJumper={{
                                goButton: <Button className="button-go">Go</Button>,
                            }}
                            showLessItems={true}
                            showTotal={this.showTotal}
                        />
                    </div>
                    <Table
                        className="config-card"
                        rowKey="task_id"
                        bordered={true}
                        rowSelection={rowSelection}
                        columns={this.getColumns()}
                        dataSource={dataSet}
                        pagination={false}
                        loading={dataLoading}
                    />
                </div>
            </div>
        )
    }
}

export default ALLTaskPage;

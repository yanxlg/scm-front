import React, { RefObject } from 'react';
import TaskSearch, { _TaskSearch } from '@/pages/task/components/TaskSearch';
import { Button, Pagination, Table } from 'antd';
import { ColumnProps } from 'antd/es/table';
import TaskLogView from '@/pages/task/components/TaskLogView';
import "@/styles/config.less";
import "@/styles/table.less";


declare interface IALLTaskPageState {
    selectedRowKeys:string[];
    dataLoading:boolean;
    dataSet:IDataItem[];
    searchLoading:boolean;
    pageSize:number;
    pageNumber:number;
    total:number;
}

declare interface IDataItem {
    taskId: string;
    taskName: string;
    scope: string;
    taskType: string;
    startTime: string;
    taskStatus:string;
    createTime:string;
}

class ALLTaskPage extends React.PureComponent<{},IALLTaskPageState>{
    private searchRef:RefObject<_TaskSearch> = React.createRef();
    constructor(props:{}){
        super(props);
        this.state={
            selectedRowKeys:[],
            dataLoading:false,
            searchLoading:false,
            dataSet:[],
            pageSize:20,
            pageNumber:1,
            total:0
        }
    }
    private onSearch=()=>{
        this.setState({
            searchLoading:true,
        });
        const values = this.searchRef.current!.getValues();
    };
    private getColumns(): ColumnProps<IDataItem>[] {
        const { pageSize, pageNumber } = this.state;
        return [
            {
                title: '序号',
                width: '100px',
                dataIndex: 'index',
                fixed: 'left',
                align: 'center',
                render: (text: string, record: any, index: number) => index + 1 + pageSize * (pageNumber - 1),
            },
            {
                title: '任务ID',
                width: '126px',
                dataIndex: 'taskId',
                align: 'center',
            },
            {
                title: '任务名称',
                dataIndex: 'taskName',
                width: '178px',
                align: 'center',
            },
            {
                title: '任务范围',
                dataIndex: 'scope',
                width: '182px',
                align: 'center',
            },
            {
                title: '任务类型',
                dataIndex: 'taskType',
                width: '223px',
                align: 'center',
            },
            {
                title: '开始时间',
                dataIndex: 'createTime',
                width: '223px',
                align: 'center',
            },
            {
                title: '任务状态',
                dataIndex: 'taskStatus',
                width: '106px',
                align: 'center',
            },
            {
                title: '创建时间',
                dataIndex: 'createTime',
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
                        <Button type="link" key="2">查看日志</Button>
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
    }
    private onShowSizeChange(page: number, size: number) {
    }
    render(){
        const {selectedRowKeys, dataLoading, dataSet, searchLoading,pageSize,pageNumber,total} = this.state;
        const rowSelection = {
            fixed: true,
            columnWidth: '100px',
            selectedRowKeys: selectedRowKeys,
            onChange: this.onSelectChange,
        };
        return (
            <div>
                <TaskSearch wrappedComponentRef={this.searchRef}/>
                <div className="flex-row config-card">
                    <div className="flex flex-1 overflow-hidden">
                        <div className="flex-column">
                            <div className="block">
                                <Button loading={searchLoading} onClick={this.onSearch} type="primary">查询</Button>
                                <Button type="link">重新执行任务</Button>
                                <Button type="link">终止任务</Button>
                                <Button type="link">设置执行顺序</Button>
                                <Button type="link">删除任务</Button>
                                <Pagination
                                    className="float-right"
                                    pageSize={pageSize}
                                    current={pageNumber}
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
                                    disabled={dataLoading}
                                />
                            </div>
                            <Table
                                className="config-card"
                                rowKey="order_goods_sn"
                                bordered={true}
                                rowSelection={rowSelection}
                                columns={this.getColumns()}
                                dataSource={dataSet}
                                pagination={false}
                                loading={dataLoading}
                            />
                        </div>
                    </div>
                    <div className="flex">
                        <TaskLogView/>
                    </div>
                </div>
            </div>
        )
    }
}

export default ALLTaskPage;

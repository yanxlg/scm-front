import React from 'react';
import DraftSearch from '@/pages/task/components/DraftSearchForm';
import '@/styles/index.less';
import { Button, Pagination, Table } from 'antd';
import { ColumnProps } from 'antd/es/table';

declare interface IDataItem {
    taskId: string;
    taskName: string;
    scope: string;
    taskType: string;
    startTime: string;
    createTime: string;
}

declare interface IDraftsState {
    searchLoading: boolean;
    dataLoading: boolean;
    pageSize: number;
    pageNumber: number;
    total: number;
    selectedRowKeys: string[];
    dataSet: IDataItem[];
}

class Drafts extends React.PureComponent<{}, IDraftsState> {
    constructor(props: {}) {
        super(props);
        this.state = {
            searchLoading: false,
            dataLoading: false,
            pageSize: 20,
            pageNumber: 1,
            total: 0,
            selectedRowKeys: [],
            dataSet: [],
        };
    }
    private onSearch() {}
    private onSelectChange(selectedRowKeys: React.Key[]) {
        this.setState({ selectedRowKeys: selectedRowKeys as string[] });
    }
    private showTotal(total: number) {
        return <span className="data-grid-total">共有{total}条</span>;
    }
    private onPageChange(page: number, pageSize?: number) {}
    private onShowSizeChange(page: number, size: number) {}
    private getColumns(): ColumnProps<IDataItem>[] {
        const { pageSize, pageNumber } = this.state;
        return [
            {
                title: '序号',
                width: '100px',
                dataIndex: 'index',
                fixed: 'left',
                align: 'center',
                render: (text: string, record: any, index: number) =>
                    index + 1 + pageSize * (pageNumber - 1),
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
                        <Button type="link" key="0">
                            查看任务详情
                        </Button>,
                        <Button type="link" key="1">
                            重新创建任务
                        </Button>,
                    ];
                },
            },
        ];
    }
    render() {
        const {
            searchLoading,
            pageSize,
            pageNumber,
            total,
            dataLoading,
            selectedRowKeys,
            dataSet,
        } = this.state;
        const rowSelection = {
            fixed: true,
            columnWidth: '100px',
            selectedRowKeys: selectedRowKeys,
            onChange: this.onSelectChange,
        };
        return (
            <div className="container">
                <DraftSearch />
                <div className="block form-item">
                    <Button loading={searchLoading} onClick={this.onSearch} type="primary">
                        查询
                    </Button>
                    <Button type="link">重新创建任务</Button>
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
                            goButton: <Button className="btn-go">Go</Button>,
                        }}
                        showLessItems={true}
                        showTotal={this.showTotal}
                        disabled={dataLoading}
                    />
                </div>
                <Table
                    className="form-item"
                    rowKey="order_goods_sn"
                    bordered={true}
                    rowSelection={rowSelection}
                    columns={this.getColumns()}
                    dataSource={dataSet}
                    pagination={false}
                    loading={dataLoading}
                />
            </div>
        );
    }
}

export default Drafts;

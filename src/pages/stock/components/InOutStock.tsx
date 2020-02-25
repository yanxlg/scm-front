import React, { RefObject } from 'react';
import { FitTable } from '@/components/FitTable';
import { Button, Pagination } from 'antd';
import '@/styles/index.less';
import '@/styles/form.less';
import '@/styles/stock.less';
import { ColumnProps } from 'antd/es/table';
import { BindAll } from 'lodash-decorators';
import { utcToLocal } from '@/utils/date';
import JsonForm, { IFieldItem } from '@/components/JsonForm';

declare interface ITableData {
    in_time: number; // 入库时间
    in_order: string; // 入库订单号
    bug_order: string; // 采购订单号
    trans_order: string; // 首程运单号
    will_amount: number; // 计划入库数量
    amount: number; // 实际入库数量
    good_id: number; //中台商品ID
    out_time: number; //出库时间
    out_order: string; //出库单号
    will_out_amount: number; //计划出库数量
    out_amount: number; //实际出库数量
    last_trans_order: string; //尾程运单号
}

declare interface IInOutStockState {
    dataSet: ITableData[];
    dataLoading: boolean;
    searchLoading: boolean;
    pageNumber: number;
    pageSize: number;
    total: number;
    selectedRowKeys: string[];
}

@BindAll()
class InOutStock extends React.PureComponent<{}, IInOutStockState> {
    private columns: ColumnProps<ITableData>[] = [
        {
            title: '入库时间',
            width: '128px',
            dataIndex: 'in_time',
            align: 'center',
            render: (time: number) => utcToLocal(time),
        },
        {
            title: '入库订单号',
            width: '130px',
            dataIndex: 'in_order',
            align: 'center',
        },
        {
            title: '采购订单号',
            width: '130px',
            dataIndex: 'in_order',
            align: 'center',
        },
        {
            title: '首程运单号',
            width: '130px',
            dataIndex: 'trans_order',
            align: 'center',
        },
        {
            title: '计划入库数量',
            width: '150px',
            dataIndex: 'will_amount',
            align: 'center',
        },
        {
            title: '实际入库数量',
            width: '150px',
            dataIndex: 'amount',
            align: 'center',
        },
        {
            title: '中台商品ID',
            width: '128px',
            dataIndex: 'good_id',
            align: 'center',
        },
        {
            title: '出库时间',
            width: '128px',
            dataIndex: 'out_time',
            align: 'center',
            render: (time: number) => utcToLocal(time),
        },
        {
            title: '出库单号',
            width: '130px',
            dataIndex: 'out_order',
            align: 'center',
        },
        {
            title: '计划出库数量',
            width: '150px',
            dataIndex: 'will_out_amount',
            align: 'center',
        },
        {
            title: '实际出库数量',
            width: '150px',
            dataIndex: 'out_amount',
            align: 'center',
        },
        {
            title: '尾程运单号',
            width: '130px',
            dataIndex: 'last_trans_order',
            align: 'center',
        },
    ];

    constructor(props: {}) {
        super(props);
        this.state = {
            dataSet: [],
            dataLoading: true,
            searchLoading: true,
            total: 0,
            pageNumber: 1,
            pageSize: 50,
            selectedRowKeys: [],
        };
    }
    componentDidMount(): void {
        this.onSearch();
    }

    private onSearch() {
        this.queryList({
            searchLoading: true,
            pageNumber: 1,
        });
    }

    private queryList(
        params: { pageNumber?: number; pageSize?: number; searchLoading?: boolean } = {},
    ) {
        const {
            pageNumber = this.state.pageNumber,
            pageSize = this.state.pageSize,
            searchLoading = false,
        } = params;
        // const values = this.searchRef.current!.getFieldsValue();

        setTimeout(() => {
            this.setState({
                dataLoading: false,
                searchLoading: false,
            });
        }, 2000);
        this.setState({
            dataLoading: true,
            searchLoading,
            selectedRowKeys: [],
        });
    }

    private onSelectChange(selectedRowKeys: React.Key[]) {
        this.setState({ selectedRowKeys: selectedRowKeys as string[] });
    }

    private showTotal(total: number) {
        return <span className="data-grid-total">共有{total}条</span>;
    }

    private onPageChange(pageNumber: number, pageSize?: number) {
        this.queryList({
            pageNumber: pageNumber,
        });
    }

    private onShowSizeChange(pageNumber: number, pageSize: number) {
        this.queryList({
            pageNumber: pageNumber,
            pageSize: pageSize,
        });
    }

    render() {
        const {
            dataSet,
            dataLoading,
            searchLoading,
            pageNumber,
            pageSize,
            total,
            selectedRowKeys,
        } = this.state;
        const rowSelection = {
            fixed: true,
            columnWidth: '50px',
            selectedRowKeys: selectedRowKeys,
            onChange: this.onSelectChange,
        };
        return (
            <div>
                <div className="float-clear">
                    <JsonForm
                        labelClassName="stock-form-label"
                        fieldList={
                            [
                                {
                                    type: 'dateRanger',
                                    label: <span>出库&emsp;时间</span>,
                                    name: ['out_time_start', 'out_time_end'],
                                    formItemClassName: 'form-item',
                                    className: 'stock-form-picker',
                                },
                                {
                                    type: 'dateRanger',
                                    label: <span>入库&emsp;时间</span>,
                                    name: ['in_time_start', 'in_time_end'],
                                    formItemClassName: 'form-item',
                                    className: 'stock-form-picker',
                                },
                                {
                                    type: 'input',
                                    label: '尾程运单号',
                                    name: 'last_trans_no',
                                    formItemClassName: 'form-item',
                                    className: 'input-default',
                                },
                                {
                                    type: 'input',
                                    label: '出库订单号',
                                    name: 'out_order',
                                    formItemClassName: 'form-item',
                                    className: 'input-default',
                                },
                                {
                                    type: 'input',
                                    label: '入库订单号',
                                    name: 'in_order',
                                    formItemClassName: 'form-item',
                                    className: 'input-default',
                                },
                                {
                                    type: 'input',
                                    label: '采购订单号',
                                    name: 'buy_order',
                                    formItemClassName: 'form-item',
                                    className: 'input-default',
                                },
                                {
                                    type: 'input',
                                    label: '中台商品ID',
                                    name: 'good_id',
                                    formItemClassName: 'form-item',
                                    className: 'input-default',
                                },
                            ] as IFieldItem[]
                        }
                    />
                    <Pagination
                        className="float-right"
                        pageSize={pageSize}
                        current={pageNumber}
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
                    rowKey="in_order"
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
        );
    }
}

export { InOutStock };

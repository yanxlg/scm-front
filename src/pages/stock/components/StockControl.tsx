import React, { RefObject } from 'react';
import { FitTable } from '@/components/FitTable';
import { Button, Pagination } from 'antd';
import '@/styles/index.less';
import '@/styles/form.less';
import { ColumnProps } from 'antd/es/table';
import { BindAll } from 'lodash-decorators';
import { utcToLocal } from '@/utils/date';

declare interface ITableData {
    good_id: number; // 中台商品ID
    good_sku: string; // 商品子SKU
    sku_image: string; // SKU对应图片
    main_image: string; // 商品主图
    size: number; // size
    color: number; // color
    stock_amount: number; //在途库存
    lock_amount: number; //锁定库存
    sale_amount: string; //可销售库存
    store_amount: number; //仓库库存
}

declare interface IStockControlState {
    dataSet: ITableData[];
    dataLoading: boolean;
    searchLoading: boolean;
    pageNumber: number;
    pageSize: number;
    total: number;
    selectedRowKeys: string[];
}

@BindAll()
class StockControl extends React.PureComponent<{}, IStockControlState> {
    private columns: ColumnProps<ITableData>[] = [
        {
            title: '中台商品ID',
            width: '130px',
            dataIndex: 'good_id',
            align: 'center',
            render: (time: number) => utcToLocal(time),
        },
        {
            title: '商品子SKU',
            width: '130px',
            dataIndex: 'good_sku',
            align: 'center',
        },
        {
            title: 'SKU对应图片',
            width: '130px',
            dataIndex: 'sku_image',
            align: 'center',
        },
        {
            title: '商品主图',
            width: '130px',
            dataIndex: 'main_image',
            align: 'center',
        },
        {
            title: 'size',
            width: '128px',
            dataIndex: 'size',
            align: 'center',
        },
        {
            title: 'color',
            width: '128px',
            dataIndex: 'color',
            align: 'center',
        },
        {
            title: '在途库存',
            width: '128px',
            dataIndex: 'stock_amount',
            align: 'center',
        },
        {
            title: '锁定库存',
            width: '128px',
            dataIndex: 'lock_amount',
            align: 'center',
        },
        {
            title: '可销售库存',
            width: '128px',
            dataIndex: 'sale_amount',
            align: 'center',
        },
        {
            title: '仓库库存',
            width: '128px',
            dataIndex: 'store_amount',
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
                <div className="form-item float-clear">
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

export { StockControl };

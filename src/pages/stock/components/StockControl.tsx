import React, { RefObject } from 'react';
import { FitTable } from '@/components/FitTable';
import { Button, message, Pagination } from 'antd';
import '@/styles/index.less';
import '@/styles/form.less';
import { ColumnProps } from 'antd/es/table';
import { BindAll } from 'lodash-decorators';
import { convertEndDate, convertStartDate, utcToLocal } from '@/utils/date';
import SearchForm, { IFieldItem } from '@/components/SearchForm';
import { FormInstance } from 'antd/es/form';
import { exportStockList, queryStockList, syncStock } from '@/services/stock';
import CopyLink from '@/components/copyLink';
import { StockType } from '@/config/dictionaries/Stock';
import queryString from 'query-string';

declare interface ITableData {
    product_id: number; // 中台商品ID
    sku_info: string; // 商品子SKU
    sku_img: string; // SKU对应图片
    goods_img: string; // 商品主图
    size: number; // size
    color: number; // color
    shipping_inventory_qy: number; //在途库存
    lock_inventory_qy: number; //锁定库存
    sales_inventory_qy: string; //可销售库存
    inventory_qy: number; //仓库库存
}

declare interface IStockControlState {
    dataSet: ITableData[];
    dataLoading: boolean;
    searchLoading: boolean;
    exportingLoading: boolean;
    syncLoading: boolean;
    pageNumber: number;
    pageSize: number;
    total: number;
    defaultInitialValues?: { [key: string]: any };
}

export declare interface IStockFormData {
    product_id?: string;
}

@BindAll()
class StockControl extends React.PureComponent<{}, IStockControlState> {
    private formRef: RefObject<FormInstance> = React.createRef();
    private queryData: any = {};
    private columns: ColumnProps<ITableData>[] = [
        {
            title: '中台商品ID',
            width: '180px',
            dataIndex: 'product_id',
            align: 'center',
            render: (time: number) => utcToLocal(time),
        },
        {
            title: '商品子SKU',
            width: '180px',
            dataIndex: 'sku_info',
            align: 'center',
        },
        {
            title: 'SKU对应图片',
            width: '130px',
            dataIndex: 'sku_img',
            align: 'center',
            render: (img: string) => {
                return <img src={img} className="stock-img" alt="" />;
            },
        },
        {
            title: '商品主图',
            width: '130px',
            dataIndex: 'goods_img',
            align: 'center',
            render: (img: string) => {
                return <img src={img} className="stock-img" alt="" />;
            },
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
            width: '100px',
            dataIndex: 'shipping_inventory_qy',
            align: 'center',
        },
        {
            title: '锁定库存',
            width: '100px',
            dataIndex: 'lock_inventory_qy',
            align: 'center',
        },
        {
            title: '可销售库存',
            width: '100px',
            dataIndex: 'sales_inventory_qy',
            align: 'center',
        },
        {
            title: '仓库库存',
            width: '100px',
            dataIndex: 'inventory_qy',
            align: 'center',
        },
    ];
    private fieldsList: IFieldItem[] = [
        {
            type: 'input',
            label: '中台商品ID',
            name: 'product_id',
            formItemClassName: 'form-item',
            className: 'input-default',
        },
    ];
    constructor(props: {}) {
        super(props);
        const { page, page_count, ...extra } = this.computeInitialValues();
        this.state = {
            dataSet: [],
            dataLoading: true,
            searchLoading: true,
            exportingLoading: false,
            syncLoading: false,
            total: 0,
            pageNumber: page,
            pageSize: page_count,
            defaultInitialValues: extra,
        };
    }

    private computeInitialValues() {
        // copy link 解析
        const { query, url } = queryString.parseUrl(window.location.href);
        if (query) {
            window.history.replaceState({}, '', url);
        }
        const { page = 1, page_count = 50, ...extra } = query;
        return {
            page: Number(page),
            page_count: Number(page_count),
            ...extra,
        };
    }
    private convertFormData() {
        return this.formRef.current!.getFieldsValue();
    }

    componentDidMount(): void {
        this.queryList({
            searchLoading: true,
        });
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
        const values = this.convertFormData();
        this.setState({
            dataLoading: true,
            searchLoading,
        });
        const query = {
            ...values,
            page: pageNumber,
            page_count: pageSize,
        };
        this.queryData = {
            ...query,
            tabKey: '3',
        };
        queryStockList(query)
            .then(({ data: { all_count = 0, list = [] } }) => {
                this.setState({
                    dataLoading: false,
                    searchLoading: false,
                    total: all_count,
                    dataSet: list,
                });
            })
            .catch(() => {
                this.setState({
                    dataLoading: false,
                    searchLoading: false,
                });
            });
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

    private onExport() {
        const values = this.convertFormData();
        this.setState({
            exportingLoading: true,
        });
        exportStockList(values)
            .catch(() => {
                message.error('导出失败!');
            })
            .finally(() => {
                this.setState({
                    exportingLoading: false,
                });
            });
    }

    private syncStock() {
        this.setState({
            syncLoading: true,
        });
        syncStock()
            .then(() => {
                message.success('同步成功!');
            })
            .finally(() => {
                this.setState({
                    syncLoading: false,
                });
            });
    }

    private getCopiedLinkQuery() {
        return this.queryData;
    }

    render() {
        const {
            dataSet,
            dataLoading,
            searchLoading,
            exportingLoading,
            syncLoading,
            pageNumber,
            pageSize,
            total,
            defaultInitialValues,
        } = this.state;
        return (
            <div>
                <div className="float-clear">
                    <SearchForm
                        initialValues={defaultInitialValues}
                        labelClassName="stock-form-label"
                        fieldList={this.fieldsList}
                        formRef={this.formRef}
                    >
                        <React.Fragment>
                            <Button
                                type="primary"
                                loading={searchLoading}
                                className="btn-group vertical-middle form-item"
                                onClick={this.onSearch}
                            >
                                查询
                            </Button>
                            <Button
                                loading={exportingLoading}
                                className="btn-group vertical-middle form-item"
                                onClick={this.onExport}
                            >
                                导出Excel表
                            </Button>
                            <Button
                                loading={syncLoading}
                                className="btn-group vertical-middle form-item btn-clear"
                                type="link"
                                onClick={this.syncStock}
                            >
                                点击同步库存
                            </Button>
                        </React.Fragment>
                    </SearchForm>
                    <Pagination
                        className="float-right form-item"
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
                <CopyLink getCopiedLinkQuery={this.getCopiedLinkQuery} />
            </div>
        );
    }
}

export { StockControl };

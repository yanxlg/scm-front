import React, { RefObject } from 'react';
import { FitTable } from '@/components/FitTable';
import { Button, message, Pagination } from 'antd';
import '@/styles/index.less';
import '@/styles/form.less';
import '@/styles/stock.less';
import { ColumnProps } from 'antd/es/table';
import { BindAll } from 'lodash-decorators';
import { convertEndDate, convertStartDate, transEndDate, transStartDate } from '@/utils/date';
import SearchForm, { IFieldItem } from '@/components/SearchForm';
import { Moment } from 'moment';
import { FormInstance } from 'antd/es/form';
import { exportInList, exportOutList, queryInList, queryOutList } from '@/services/stock';
import CopyLink from '@/components/copyLink';
import queryString from 'query-string';
import { StockType } from '@/config/dictionaries/Stock';

declare interface ITableData {
    outboundOrderSn: string;
    planedQuantity: number;
    quantity: number;
    outboundTime: string;
    lastWaybillNo: string;
    commodity_id: string;
    inboundOrderSn: string;
    inboundTime: string;
    firstWaybillNo: string;
    purchaseOrderSn: string;
}

declare interface IInOutStockState {
    dataSet: ITableData[];
    dataLoading: boolean;
    searchLoading: boolean;
    exportingLoading: boolean;
    pageNumber: number;
    pageSize: number;
    total: number;
    defaultInitialValues?: { [key: string]: any };
}

export declare interface IStockINFormData {
    time_start?: Moment | number;
    time_end?: Moment | number;
    purchase_order_sn?: string;
    inbound_order_sn?: string;
    commodity_id?: string;
    page?: number;
    per_page?: number;
}

export declare interface IStockOUTFormData {
    time_start?: Moment | number;
    time_end?: Moment | number;
    last_waybill_no?: string;
    outbound_order_sn?: string;
    commodity_id?: string;
    page?: number;
    per_page?: number;
}

declare interface IInOutStockProps {
    type: typeof StockType[keyof typeof StockType]; //1:出库管理，2入库管理
}

@BindAll()
class InOutStock extends React.PureComponent<IInOutStockProps, IInOutStockState> {
    private formRef: RefObject<FormInstance> = React.createRef();
    private queryData: any = {};
    private inColumns: ColumnProps<ITableData>[] = [
        {
            title: '入库时间',
            width: '150px',
            dataIndex: 'inboundTime',
            align: 'center',
        },
        {
            title: '入库订单号',
            width: '180px',
            dataIndex: 'inboundOrderSn',
            align: 'center',
        },
        {
            title: '采购订单号',
            width: '180px',
            dataIndex: 'purchaseOrderSn',
            align: 'center',
        },
        {
            title: '首程运单号',
            width: '180px',
            dataIndex: 'firstWaybillNo',
            align: 'center',
        },
        {
            title: '计划入库数量',
            width: '100px',
            dataIndex: 'planedQuantity',
            align: 'center',
        },
        {
            title: '实际入库数量',
            width: '100px',
            dataIndex: 'quantity',
            align: 'center',
        },
        {
            title: '中台商品ID',
            width: '150px',
            dataIndex: 'commodity_id',
            align: 'center',
        },
    ];
    private outColumns: ColumnProps<ITableData>[] = [
        {
            title: '中台商品ID',
            width: '150px',
            dataIndex: 'commodity_id',
            align: 'center',
        },
        {
            title: '出库时间',
            width: '150px',
            dataIndex: 'outboundTime',
            align: 'center',
        },
        {
            title: '出库单号',
            width: '180px',
            dataIndex: 'outboundOrderSn',
            align: 'center',
        },
        {
            title: '计划出库数量',
            width: '100px',
            dataIndex: 'planedQuantity',
            align: 'center',
        },
        {
            title: '实际出库数量',
            width: '100px',
            dataIndex: 'quantity',
            align: 'center',
        },
        {
            title: '尾程运单号',
            width: '180px',
            dataIndex: 'lastWaybillNo',
            align: 'center',
        },
    ];
    private inFieldsList: IFieldItem[] = [
        {
            type: 'dateRanger',
            label: <span>入库&emsp;时间</span>,
            name: ['time_start', 'time_end'],
            formItemClassName: 'form-item',
            className: 'stock-form-picker',
        },
        {
            type: 'input',
            label: '入库订单号',
            name: 'inbound_order_sn',
            formItemClassName: 'form-item',
            className: 'input-default',
        },
        {
            type: 'input',
            label: '采购订单号',
            name: 'purchase_order_sn',
            formItemClassName: 'form-item',
            className: 'input-default',
        },
        {
            type: 'input',
            label: '中台商品ID',
            name: 'commodity_id',
            formItemClassName: 'form-item',
            className: 'input-default',
        },
    ];
    private outFieldsList: IFieldItem[] = [
        {
            type: 'dateRanger',
            label: <span>出库&emsp;时间</span>,
            name: ['time_start', 'time_end'],
            formItemClassName: 'form-item',
            className: 'stock-form-picker',
        },
        {
            type: 'input',
            label: '出库订单号',
            name: 'outbound_order_sn',
            formItemClassName: 'form-item',
            className: 'input-default',
        },
        {
            type: 'input',
            label: '尾程运单号',
            name: 'last_waybill_no',
            formItemClassName: 'form-item',
            className: 'input-default',
        },
        {
            type: 'input',
            label: '中台商品ID',
            name: 'commodity_id',
            formItemClassName: 'form-item',
            className: 'input-default',
        },
    ];

    constructor(props: IInOutStockProps) {
        super(props);
        const { page, per_page, ...extra } = this.computeInitialValues();
        this.state = {
            dataSet: [],
            dataLoading: true,
            searchLoading: true,
            exportingLoading: false,
            total: 0,
            pageNumber: page,
            pageSize: per_page,
            defaultInitialValues: extra,
        };
    }

    private computeInitialValues() {
        // copy link 解析
        const { query, url } = queryString.parseUrl(window.location.href);
        if (query) {
            window.history.replaceState({}, '', url);
        }
        const { page = 1, per_page = 50, time_start = 0, time_end = 0, ...extra } = query;
        return {
            page: Number(page),
            per_page: Number(per_page),
            time_start: convertStartDate(Number(time_start)),
            time_end: convertEndDate(Number(time_end)),
            ...extra,
        };
    }

    componentDidMount(): void {
        this.queryList({
            searchLoading: true,
        });
    }

    private convertFormData() {
        const { time_start, time_end, ...values } = this.formRef.current!.getFieldsValue();
        return {
            ...values,
            time_start: transStartDate(time_start),
            time_end: transEndDate(time_end),
        };
    }

    private onSearch() {
        this.queryList({
            searchLoading: true,
            pageNumber: 1,
        });
    }

    private onExport() {
        const values = this.convertFormData();
        this.setState({
            exportingLoading: true,
        });
        const exportService = this.props.type === StockType.In ? exportInList : exportOutList;
        exportService(Object.assign({ ...values }))
            .catch(() => {
                message.error('导出失败!');
            })
            .finally(() => {
                this.setState({
                    exportingLoading: false,
                });
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
        const type = this.props.type;
        const query = {
            ...values,
            page: pageNumber,
            per_page: pageSize,
        };
        this.queryData = {
            ...query,
            tabKey: type === StockType.Out ? '2' : type === StockType.In ? '1' : '3',
        };
        const queryService = type === StockType.In ? queryInList : queryOutList;
        queryService(query)
            .then(({ data: { total = 0, list = [] } }) => {
                this.setState({
                    dataLoading: false,
                    searchLoading: false,
                    total: total,
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

    private getCopiedLinkQuery() {
        return this.queryData;
    }

    render() {
        const {
            dataSet,
            dataLoading,
            searchLoading,
            exportingLoading,
            pageNumber,
            pageSize,
            total,
            defaultInitialValues,
        } = this.state;
        const { type } = this.props;
        return (
            <div>
                <div className="float-clear">
                    <SearchForm
                        labelClassName="stock-form-label"
                        formRef={this.formRef}
                        fieldList={type === 1 ? this.outFieldsList : this.inFieldsList}
                        initialValues={defaultInitialValues}
                    />
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
                    columns={type === 1 ? this.outColumns : this.inColumns}
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

export { InOutStock };

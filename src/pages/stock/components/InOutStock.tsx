import React, { RefObject } from 'react';
import { FitTable } from '@/components/FitTable';
import { Button, Form, Pagination } from 'antd';
import '@/styles/index.less';
import '@/styles/form.less';
import '@/styles/stock.less';
import { ColumnProps } from 'antd/es/table';
import { BindAll } from 'lodash-decorators';
import { transEndDate, transStartDate, utcToLocal } from '@/utils/date';
import SearchForm, { IFieldItem } from '@/components/SearchForm';
import { Moment } from 'moment';
import { FormInstance } from 'antd/es/form';
import { exportIOList, queryIOList } from '@/services/stock';

declare interface ITableData {
    warehousing_time: number; // 入库时间
    warehousing_order_sn: string; // 入库订单号
    purchase_order_sn: string; // 采购订单号
    first_waybill_no: string; // 首程运单号
    plan_warehousing_qy: number; // 计划入库数量
    actual_warehousing_qy: number; // 实际入库数量
    product_id: string; //中台商品ID
    outgoing_time: number; //出库时间
    outgoing_no: string; //出库单号
    plan_outgoing_qy: number; //计划出库数量
    actual_outgoing_qy: number; //实际出库数量
    last_waybill_no: string; //尾程运单号
}

declare interface IInOutStockState {
    dataSet: ITableData[];
    dataLoading: boolean;
    searchLoading: boolean;
    exportingLoading: boolean;
    pageNumber: number;
    pageSize: number;
    total: number;
}

export declare interface IStockIOFormData {
    warehousing_start_time?: Moment | number;
    warehousing_end_time?: Moment | number;
    outgoing_start_time?: Moment | number;
    outgoing_end_time?: Moment | number;
    outgoing_order_sn?: string;
    warehousing_order_sn?: string;
    purchase_order_sn?: string;
    product_id?: string;
    last_waybill_no?: string;
    type: 1 | 2;
}

declare interface IInOutStockProps {
    type: 1 | 2; //1:出库管理，2入库管理
}

@BindAll()
class InOutStock extends React.PureComponent<IInOutStockProps, IInOutStockState> {
    private formRef: RefObject<FormInstance> = React.createRef();
    private inColumns: ColumnProps<ITableData>[] = [
        {
            title: '入库时间',
            width: '200px',
            dataIndex: 'warehousing_time',
            align: 'center',
            render: (time: number) => utcToLocal(time),
        },
        {
            title: '入库订单号',
            width: '130px',
            dataIndex: 'warehousing_order_sn',
            align: 'center',
        },
        {
            title: '采购订单号',
            width: '130px',
            dataIndex: 'purchase_order_sn',
            align: 'center',
        },
        {
            title: '首程运单号',
            width: '130px',
            dataIndex: 'first_waybill_no',
            align: 'center',
        },
        {
            title: '计划入库数量',
            width: '150px',
            dataIndex: 'plan_warehousing_qy',
            align: 'center',
        },
        {
            title: '实际入库数量',
            width: '150px',
            dataIndex: 'actual_warehousing_qy',
            align: 'center',
        },
        {
            title: '中台商品ID',
            width: '128px',
            dataIndex: 'product_id',
            align: 'center',
        },
    ];
    private outColumns: ColumnProps<ITableData>[] = [
        {
            title: '中台商品ID',
            width: '128px',
            dataIndex: 'product_id',
            align: 'center',
        },
        {
            title: '出库时间',
            width: '200px',
            dataIndex: 'outgoing_time',
            align: 'center',
            render: (time: number) => utcToLocal(time),
        },
        {
            title: '出库单号',
            width: '130px',
            dataIndex: 'outgoing_no',
            align: 'center',
        },
        {
            title: '计划出库数量',
            width: '150px',
            dataIndex: 'plan_outgoing_qy',
            align: 'center',
        },
        {
            title: '实际出库数量',
            width: '150px',
            dataIndex: 'actual_outgoing_qy',
            align: 'center',
        },
        {
            title: '尾程运单号',
            width: '130px',
            dataIndex: 'last_waybill_no',
            align: 'center',
        },
    ];
    private inFieldsList: IFieldItem[] = [
        {
            type: 'dateRanger',
            label: <span>入库&emsp;时间</span>,
            name: ['warehousing_start_time', 'warehousing_end_time'],
            formItemClassName: 'form-item',
            className: 'stock-form-picker',
        },
        {
            type: 'input',
            label: '入库订单号',
            name: 'warehousing_order_sn',
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
            name: 'product_id',
            formItemClassName: 'form-item',
            className: 'input-default',
        },
    ];
    private outFieldsList: IFieldItem[] = [
        {
            type: 'dateRanger',
            label: <span>出库&emsp;时间</span>,
            name: ['outgoing_start_time', 'outgoing_end_time'],
            formItemClassName: 'form-item',
            className: 'stock-form-picker',
        },
        {
            type: 'input',
            label: '出库订单号',
            name: 'outgoing_order_sn',
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
            name: 'product_id',
            formItemClassName: 'form-item',
            className: 'input-default',
        },
    ];

    constructor(props: IInOutStockProps) {
        super(props);
        this.state = {
            dataSet: [],
            dataLoading: true,
            searchLoading: true,
            exportingLoading: false,
            total: 0,
            pageNumber: 1,
            pageSize: 50,
        };
    }

    componentDidMount(): void {
        this.onSearch();
    }

    private convertFormData() {
        const {
            warehousing_start_time,
            warehousing_end_time,
            outgoing_start_time,
            outgoing_end_time,
            ...values
        } = this.formRef.current!.getFieldsValue();
        return {
            ...values,
            warehousing_start_time: transStartDate(warehousing_start_time),
            warehousing_end_time: transEndDate(warehousing_end_time),
            outgoing_start_time: transStartDate(outgoing_start_time),
            outgoing_end_time: transEndDate(outgoing_end_time),
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
        exportIOList(Object.assign({ ...values, type: this.props.type })).finally(() => {
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
        queryIOList({
            ...values,
            page: pageNumber,
            page_count: pageSize,
            type: this.props.type,
        })
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

    render() {
        const {
            dataSet,
            dataLoading,
            searchLoading,
            exportingLoading,
            pageNumber,
            pageSize,
            total,
        } = this.state;
        const { type } = this.props;
        return (
            <div>
                <div className="float-clear">
                    <SearchForm
                        labelClassName="stock-form-label"
                        formRef={this.formRef}
                        fieldList={type === 1 ? this.outFieldsList : this.inFieldsList}
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
            </div>
        );
    }
}

export { InOutStock };

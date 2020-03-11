import React from 'react';
import { Table } from 'antd';

import { ColumnProps } from 'antd/es/table';
import { IOrderItem } from './PaneNotStock';

declare interface IProps {
    loading: boolean;
    colList: string[];
    orderList: IOrderItem[];
    // changeSelectedRows(selectedRows: IOrderItem[]): void;
}

declare interface IState {}

class TableNotStock extends React.PureComponent<IProps, IState> {
    private allColumns: ColumnProps<IOrderItem>[] = [
        {
            key: 'order_create_time',
            title: '订单时间',
            dataIndex: 'order_create_time',
            align: 'center',
            width: 120,
            render: (value: number, row: IOrderItem) => {
                return value;
            },
        },
        {
            key: 'middleground_order_id',
            title: '中台订单ID',
            dataIndex: 'middleground_order_id',
            align: 'center',
            width: 120,
        },
        {
            key: 'commodity_id',
            title: '中台商品ID',
            dataIndex: 'commodity_id',
            align: 'center',
            width: 120,
        },
        {
            key: 'purchase_shipping_no',
            title: '采购运单号',
            dataIndex: 'purchase_shipping_no',
            align: 'center',
            width: 120,
        },
        {
            key: 'purchase_order_status',
            title: '采购订单状态',
            dataIndex: 'purchase_order_status',
            align: 'center',
            width: 120,
        },
        {
            key: 'purchase_shipping_status',
            title: '采购配送状态',
            dataIndex: 'purchase_shipping_status',
            align: 'center',
            width: 120,
        },
        {
            key: 'purchase_pay_time',
            title: '采购支付时间',
            dataIndex: 'purchase_pay_time',
            align: 'center',
            width: 120,
        },
        {
            key: 'purchase_num',
            title: '采购数量',
            dataIndex: 'purchase_num',
            align: 'center',
            width: 120,
        },
        {
            key: 'a1',
            title: '订单确认时间',
            dataIndex: 'a1',
            align: 'center',
            width: 120,
        },
        {
            key: 'a2',
            title: '渠道订单ID',
            dataIndex: 'a2',
            align: 'center',
            width: 120,
        },
        {
            key: 'a3',
            title: '采购支付状态',
            dataIndex: 'a3',
            align: 'center',
            width: 120,
        },
        {
            key: 'a4',
            title: '采购生成时间',
            dataIndex: 'a4',
            align: 'center',
            width: 120,
        },
        {
            key: 'a5',
            title: '采购订单号',
            dataIndex: 'a5',
            align: 'center',
            width: 120,
        },
    ];

    constructor(props: IProps) {
        super(props);
    }

    private createColumns = (): ColumnProps<IOrderItem>[] => {
        const { colList } = this.props;
        // console.log(111, colList);
        return colList.map(key => {
            const i = this.allColumns.findIndex(item => item.key === key);
            // console.log('key', key, i);
            return this.allColumns[i];
        });
    };

    render() {
        const { loading, orderList } = this.props;
        const columns = this.createColumns();

        return (
            <Table
                bordered={true}
                rowKey="middleground_order_id"
                className="order-table"
                loading={loading}
                columns={columns}
                // rowSelection={rowSelection}
                dataSource={orderList}
                scroll={{ x: true }}
                pagination={false}
            />
        );
    }
}

export default TableNotStock;

import React from 'react';
import { Table } from 'antd';

import { ColumnProps } from 'antd/es/table';
import { IOrderItem } from './PaneStockNotShip';

declare interface IProps {
    loading: boolean;
    colList: string[];
    orderList: IOrderItem[];
    // changeSelectedRows(selectedRows: IOrderItem[]): void;
}

declare interface IState {}

class TableStockNotShip extends React.PureComponent<IProps, IState> {
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
            key: 'warehousing_time',
            title: '入库时间',
            dataIndex: 'warehousing_time',
            align: 'center',
            width: 120,
        },
        {
            key: 'xxx_time',
            title: '发送发货指令时间',
            dataIndex: 'xxx_time',
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
            title: '价格',
            dataIndex: 'a3',
            align: 'center',
            width: 120,
        },
        {
            key: 'a4',
            title: '运费',
            dataIndex: 'a4',
            align: 'center',
            width: 120,
        },
        {
            key: 'a5',
            title: '商品数量',
            dataIndex: 'a5',
            align: 'center',
            width: 120,
        },
        {
            key: 'a6',
            title: '取消订单时间',
            dataIndex: 'a6',
            align: 'center',
            width: 120,
        },
        {
            key: 'a7',
            title: '商品总金额',
            dataIndex: 'a7',
            align: 'center',
            width: 120,
        },
        {
            key: 'a8',
            title: '发货剩余时间',
            dataIndex: 'a8',
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

export default TableStockNotShip;

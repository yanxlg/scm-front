import React from 'react';
import { Table, Input } from 'antd';

import { ColumnProps } from 'antd/es/table';
import { IWaitShipItem } from './PaneWaitShip';
import { TableRowSelection } from 'antd/lib/table/interface';

import { formatDate } from '@/utils/date';

const { TextArea } = Input;

declare interface IProps {
    loading: boolean;
    orderList: IWaitShipItem[];
    // changeSelectedRows(selectedRows: IOrderItem[]): void;
}

declare interface IState {}

class TablePendingOrder extends React.PureComponent<IProps, IState> {
    columns: ColumnProps<IWaitShipItem>[] = [
        {
            key: 'purchase_time',
            title: '采购时间',
            dataIndex: 'purchase_time',
            align: 'center',
            width: 120,
            render: (value: number) => {
                return formatDate(new Date(value * 1000), 'yyyy-MM-dd hh:mm:ss');
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
            key: 'purchase_p_order_id',
            title: '采购父订单ID',
            dataIndex: 'purchase_p_order_id',
            align: 'center',
            width: 120,
        },
        {
            key: 'purchase_order_id',
            title: '采购订单ID',
            dataIndex: 'purchase_order_id',
            align: 'center',
            width: 120,
        },
        {
            key: 'purchase_price',
            title: '采购价',
            dataIndex: 'purchase_price',
            align: 'center',
            width: 120,
        },
        {
            key: 'sale_order_status',
            title: '销售订单状态',
            dataIndex: 'sale_order_status',
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
            key: 'purchase_pay_status',
            title: '采购支付状态',
            dataIndex: 'purchase_pay_status',
            align: 'center',
            width: 120,
        },
        {
            key: 'order_create_time',
            title: '订单时间',
            dataIndex: 'order_create_time',
            align: 'center',
            width: 120,
            render: (value: number) => {
                return formatDate(new Date(value * 1000), 'yyyy-MM-dd hh:mm:ss');
            },
        },
        {
            key: 'comment',
            title: '备注',
            dataIndex: 'comment',
            align: 'center',
            width: 200,
            render: (value: string) => {
                return <TextArea autoSize={true} defaultValue={value} />;
            },
        },
    ];

    constructor(props: IProps) {
        super(props);
    }

    render() {
        const { loading, orderList } = this.props;
        // const columns = this.createColumns()

        return (
            <Table
                bordered={true}
                rowKey="middleground_order_id"
                className="order-table"
                loading={loading}
                columns={this.columns}
                // rowSelection={rowSelection}
                dataSource={orderList}
                scroll={{ x: true }}
                pagination={false}
            />
        );
    }
}

export default TablePendingOrder;

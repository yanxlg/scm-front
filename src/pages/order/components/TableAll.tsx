import React from 'react';
import { Table } from 'antd';

import { ColumnProps } from 'antd/es/table';
import { IOrderItem } from '../index';
import { TableRowSelection } from 'antd/lib/table/interface';

declare interface IOrderTableAllProps {
    loading: boolean;
    orderList: IOrderItem[];
    // changeSelectedRows(selectedRows: IOrderItem[]): void;
}

declare interface IOrderTableAllState {

}

class OrderTableAll extends React.PureComponent<IOrderTableAllProps, IOrderTableAllState> {
    constructor(props: IOrderTableAllProps) {
        super(props);
    }

    createColumns = ():ColumnProps<IOrderItem>[] => {
        return [
            {
                key: 'order_time',
                title: '订单时间',
                dataIndex: 'order_time',
                align: 'center',
                width: 120
            },
            {
                key: 'a1',
                title: '中台订单父订单ID',
                dataIndex: 'a1',
                align: 'center',
                width: 120
            },
            {
                key: 'middleground_order_status',
                title: '中台订单状态',
                dataIndex: 'middleground_order_status',
                align: 'center',
                width: 120
            },
            {
                key: 'detail',
                title: '商品详情',
                // dataIndex: 'goods_detatil',
                align: 'center',
                width: 120,
                render: (value: any, row: IOrderItem) => {
                    // onClick={() => this.getOrderGoodsDetail(row.middleground_order_id)}
                    return <a >查看商品详情</a>
                }
            },
            {
                key: 'a2',
                title: '渠道订单状态',
                dataIndex: 'a2',
                align: 'center',
                width: 120
            },
            {
                key: 'a3',
                title: '渠道发货状态',
                dataIndex: 'a3',
                align: 'center',
                width: 120
            },
        ]
    }

    render() {

        
        const { loading, orderList } = this.props;
        const columns = this.createColumns()

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
        )    
    }
}

export default OrderTableAll;

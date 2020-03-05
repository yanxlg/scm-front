import React from 'react';
import { Table, Input } from 'antd';

import { ColumnProps } from 'antd/es/table';
import { IErrorOrderItem } from './PaneError';
// import { TableRowSelection } from 'antd/lib/table/interface';

// import { formatDate } from '@/utils/date';

declare interface IProps {
    loading: boolean;
    orderList: IErrorOrderItem[];
    // changeSelectedRows(selectedRows: IOrderItem[]): void;
}

declare interface IState {

}

class TableError extends React.PureComponent<IProps, IState> {

    columns: ColumnProps<IErrorOrderItem>[] = [
        {
            key: 'order_create_time',
            title: '订单时间',
            dataIndex: 'order_create_time',
            align: 'center',
            width: 120
        },
        {
            key: 'order_confirm_time',
            title: '订单确认时间',
            dataIndex: 'order_confirm_time',
            align: 'center',
            width: 120
        },
        {
            key: 'middleground_order_id',
            title: '订单号',
            dataIndex: 'middleground_order_id',
            align: 'center',
            width: 120
        },
        {
            key: 'channel_order_id',
            title: '渠道订单号',
            dataIndex: 'channel_order_id',
            align: 'center',
            width: 120
        },
        {
            key: 'error_type',
            title: '异常类型',
            dataIndex: 'error_type',
            align: 'center',
            width: 120
        },
        {
            key: 'error_detail',
            title: '异常详情',
            dataIndex: 'error_detail',
            align: 'center',
            width: 120
        },
        {
            key: '',
            title: '采购订单发货时间',
            dataIndex: '',
            align: 'center',
            width: 120
        },
        {
            key: '',
            title: '入库时间',
            dataIndex: '',
            align: 'center',
            width: 120
        },
        {
            key: '',
            title: '发送指令时间',
            dataIndex: '',
            align: 'center',
            width: 120
        },
        {
            key: '',
            title: '出库时间',
            dataIndex: '',
            align: 'center',
            width: 120
        },
        {
            key: '',
            title: '采购订单生成时间',
            dataIndex: '',
            align: 'center',
            width: 120
        },
        {
            key: '',
            title: '拍单时间',
            dataIndex: '',
            align: 'center',
            width: 120
        },
        {
            key: '',
            title: '支付时间',
            dataIndex: '',
            align: 'center',
            width: 120
        },
        {
            key: '',
            title: '标记发货时间',
            dataIndex: '',
            align: 'center',
            width: 120
        },
        {
            key: 'last_waybill_no',
            title: '尾程运单号',
            dataIndex: 'last_waybill_no',
            align: 'center',
            width: 120
        },
        {
            key: 'first_waybill_no',
            title: '首程运单号',
            dataIndex: 'first_waybill_no',
            align: 'center',
            width: 120
        }
    ]

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
                scroll={{ x: true, y: 600 }}
                pagination={false}
                
            />
        )    
    }
}

export default TableError;

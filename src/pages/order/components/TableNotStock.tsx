import React from 'react';
import { FitTable } from '@/components/FitTable';
import { ColumnProps } from 'antd/es/table';
import { IOrderItem } from './PaneNotStock';
import { utcToLocal } from '@/utils/date';
import { getStatusDesc } from '@/utils/transform';
import {
    orderStatusOptionList,
    purchaseOrderOptionList,
    purchaseShippingOptionList
} from '@/enums/OrderEnum';

declare interface IProps {
    loading: boolean;
    orderList: IOrderItem[];
}

declare interface IState {}



// 采购单号
// 采购订单号
// 采购运单号
// 采购生成时间
// 采购支付时间


class TableNotStock extends React.PureComponent<IProps, IState> {
    private columns: ColumnProps<IOrderItem>[] = [
        {
            key: 'orderGoodsId',
            title: '中台订单ID',
            dataIndex: 'orderGoodsId',
            align: 'center',
            width: 120,
        },
        {
            key: 'orderCreateTime',
            title: '订单时间',
            dataIndex: 'orderCreateTime',
            align: 'center',
            width: 120,
            render: (value: number, row: IOrderItem) => {
                return value;
            },
        },
        {
            key: 'productId',
            title: '中台商品ID',
            dataIndex: 'productId',
            align: 'center',
            width: 120,
        },
        {
            key: 'orderGoodsStatus',
            title: '中台订单状态',
            dataIndex: 'orderGoodsStatus',
            align: 'center',
            width: 120,
            render: (value: number) => {
                return getStatusDesc(orderStatusOptionList, value)
            }
        },
        {
            key: 'purchasePlanId',
            title: '计划子项ID',
            dataIndex: 'purchasePlanId',
            align: 'center',
            width: 120,
        },
        {
            key: 'purchasePlatform',
            title: '采购平台',
            dataIndex: 'purchasePlatform',
            align: 'center',
            width: 120,
        },
        {
            key: 'purchaseNumber',
            title: '采购数量',
            dataIndex: 'purchaseNumber',
            align: 'center',
            width: 120,
        },
        {
            key: 'purchase_shipping_no',
            title: '采购单号',
            dataIndex: 'purchase_shipping_no',
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
        {
            key: 'purchase_shipping_no',
            title: '采购运单号',
            dataIndex: 'purchase_shipping_no',
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
            key: 'purchaseOrderStatus',
            title: '采购订单状态',
            dataIndex: 'purchaseOrderStatus',
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
            key: 'purchaseOrderPayStatus',
            title: '采购支付时间',
            dataIndex: 'purchaseOrderPayStatus',
            align: 'center',
            width: 120,
        },
        {
            key: 'purchaseOrderShippingStatus',
            title: '采购配送状态',
            dataIndex: 'purchaseOrderShippingStatus',
            align: 'center',
            width: 120,
        },
        
        {
            key: 'confirmTime',
            title: '订单确认时间',
            dataIndex: 'confirmTime',
            align: 'center',
            width: 120,
        },
        {
            key: 'channelOrderSn',
            title: '渠道订单ID',
            dataIndex: 'channelOrderSn',
            align: 'center',
            width: 120,
        },
        
    ];

    constructor(props: IProps) {
        super(props);
    }

    render() {
        const { loading, orderList } = this.props;
        return (
            <FitTable
                bordered
                rowKey="middleground_order_id"
                className="order-table"
                loading={loading}
                columns={this.columns}
                // rowSelection={rowSelection}
                dataSource={orderList}
                scroll={{ x: 'max-content' }}
                pagination={false}
            />
        );
    }
}

export default TableNotStock;

import React from 'react';
import { Table } from 'antd';

import { ColumnProps } from 'antd/es/table';
import { IOrderItem, IPurchaseStatus } from './PaneAll';

declare interface IOrderTableAllProps {
    loading: boolean;
    colList: string[];
    orderList: IOrderItem[];
    // changeSelectedRows(selectedRows: IOrderItem[]): void;
}

declare interface IOrderTableAllState {

}

class OrderTableAll extends React.PureComponent<IOrderTableAllProps, IOrderTableAllState> {

    private allColumns: ColumnProps<IOrderItem>[] = [
        {
            key: 'order_confirm_time',
            title: '订单时间',
            dataIndex: 'order_confirm_time',
            align: 'center',
            width: 120,
            render: (value: number, row: IOrderItem) => {
                return {
                    children: value,
                    props: {
                        rowSpan: row._rowspan || 0,
                    },
                }
            }
        },
        {
            key: 'middleground_c_order_id',
            title: '中台订单子ID',
            dataIndex: 'middleground_c_order_id',
            align: 'center',
            width: 120,
            render: this.mergeCell
        },
        {
            key: 'goods_detail',
            title: '商品详情',
            dataIndex: 'goods_detail',
            align: 'center',
            width: 120,
            render: (value: any, row: IOrderItem) => {
                return {
                    // onClick={() => this.getOrderGoodsDetail(row.middleground_order_id)}
                    children: <a >查看商品详情</a>,
                    props: {
                        rowSpan: row._rowspan || 0,
                    },
                }
            }
        },
        // 缺失
        {
            key: 'product_id',
            title: 'Product ID',
            dataIndex: 'product_id',
            align: 'center',
            width: 120,
            render: this.mergeCell
        },
        {
            key: 'channel_order_status',
            title: '渠道订单状态',
            dataIndex: 'channel_order_status',
            align: 'center',
            width: 120,
            render: this.mergeCell
        },
        // 缺失
        {
            key: 'channel_delivery_status',
            title: '渠道发货状态',
            dataIndex: 'channel_delivery_status',
            align: 'center',
            width: 120,
            render: this.mergeCell
        },
        {
            key: 'middleground_order_status',
            title: '中台订单状态',
            dataIndex: 'middleground_order_status',
            align: 'center',
            width: 120,
            render: this.mergeCell
        },
        {
            key: 'goods_commodity_id',
            title: '中台商品ID',
            dataIndex: 'goods_commodity_id',
            align: 'center',
            width: 120
        },
        {
            key: 'goods_purchase_status',
            title: '采购订单状态',
            dataIndex: 'goods_purchase_status',
            align: 'center',
            width: 120,
            render: (value: IPurchaseStatus, row: IOrderItem) => {
                return value.comment
            }
        },
        {
            key: 'goods_purchase_payment_status',
            title: '采购支付状态',
            dataIndex: 'goods_purchase_payment_status',
            align: 'center',
            width: 120
        },
        {
            key: 'goods_purchase_delivery_status',
            title: '采购配送状态',
            dataIndex: 'goods_purchase_delivery_status',
            align: 'center',
            width: 120
        },
        {
            key: 'goods_purchase_order_time',
            title: '采购生成时间',
            dataIndex: 'goods_purchase_order_time',
            align: 'center',
            width: 120
        },
        {
            key: 'goods_purchase_order_sn',
            title: '采购订单号',
            dataIndex: 'goods_purchase_order_sn',
            align: 'center',
            width: 120
        },
        {
            key: 'goods_purchase_waybill_sn',
            title: '采购运单号',
            dataIndex: 'goods_purchase_waybill_sn',
            align: 'center',
            width: 120
        },
        {
            key: 'channel_order_id',
            title: '渠道订单ID',
            dataIndex: 'channel_order_id',
            align: 'center',
            width: 120,
            render: this.mergeCell
        },
        {
            key: 'channel_goods_price',
            title: '价格',
            dataIndex: 'channel_goods_price',
            align: 'center',
            width: 120,
            render: this.mergeCell
        },
        {
            key: 'channel_shipping_fee',
            title: '运费',
            dataIndex: 'channel_shipping_fee',
            align: 'center',
            width: 120,
            render: this.mergeCell
        },
        {
            key: 'goods_number',
            title: '商品数量',
            dataIndex: 'goods_number',
            align: 'center',
            width: 120,
            render: this.mergeCell
        },
        {
            key: 'cancel_order_time',
            title: '取消订单时间',
            dataIndex: 'cancel_order_time',
            align: 'center',
            width: 120,
            render: this.mergeCell
        },
        {
            key: 'goods_purchase_shipping_no',
            title: '采购运单号',
            dataIndex: 'goods_purchase_shipping_no',
            align: 'center',
            width: 120,
            render: this.mergeCell
        },
        {
            key: 'channel',
            title: '销售渠道',
            dataIndex: 'channel',
            align: 'center',
            width: 120,
            render: this.mergeCell
        },
        {
            key: 'middleground_p_order_id',
            title: '中台父订单ID',
            dataIndex: 'middleground_p_order_id',
            align: 'center',
            width: 120,
            render: this.mergeCell
        },
        {
            key: 'currency_type',
            title: '货币类型',
            dataIndex: 'currency_type',
            align: 'center',
            width: 120,
            render: this.mergeCell
        },
        {
            key: 'remain_delivery_time',
            title: '发货剩余时间',
            dataIndex: 'remain_delivery_time',
            align: 'center',
            width: 120,
            render: this.mergeCell
        },
        {
            key: 'channel_store_name',
            title: '渠道店铺名',
            dataIndex: 'channel_store_name',
            align: 'center',
            width: 120,
            render: this.mergeCell
        },
        {
            key: 'purchase_cancel_reason',
            title: '采购取消原因',
            dataIndex: 'purchase_cancel_reason',
            align: 'center',
            width: 120,
            render: this.mergeCell
        },
        {
            key: 'goods_amount',
            title: '商品总金额',
            dataIndex: 'goods_amount',
            align: 'center',
            width: 120,
            render: this.mergeCell
        },
        {
            key: 'p_order_id',
            title: '父订单ID',
            dataIndex: 'p_order_id',
            align: 'center',
            width: 120,
            render: this.mergeCell
        },
        {
            key: 'child_order_id',
            title: '子订单ID',
            dataIndex: 'child_order_id',
            align: 'center',
            width: 120,
            render: this.mergeCell
        },
    ]

    constructor(props: IOrderTableAllProps) {
        super(props);
    }

    private createColumns = ():ColumnProps<IOrderItem>[] => {
        const { colList } = this.props;
        // console.log(111, colList);
        return colList.map(key => {
            const i = this.allColumns.findIndex(item => item.key === key);
            // console.log('key', key, i);
            return this.allColumns[i]
        });
    }

    // 合并单元格
    private mergeCell(value: string | number, row: IOrderItem) {
        return {
            children: value,
            props: {
                rowSpan: row._rowspan || 0,
            },
        };
    }

    render() {

        const { loading, orderList } = this.props;
        const columns = this.createColumns()

        return (
            <Table
                bordered={true}
                rowKey="goods_commodity_id"
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

import React from 'react';
import { Table, Checkbox } from 'antd';
import { ColumnProps } from 'antd/es/table';


import { IParentOrderItem } from './PaneAll';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';

declare interface IProps {
    loading: boolean;
    colList: string[];
    orderList: IParentOrderItem[];
}

declare interface IState {

}

class TableParentAll extends React.PureComponent<IProps, IState> {

    private allColumns: ColumnProps<IParentOrderItem>[] = [
        {
            key: 'goodsCreateTime',
            title: '订单时间',
            dataIndex: 'goodsCreateTime',
            align: 'center',
            width: 120,
            render: (value: number, row: IParentOrderItem) => {
                return {
                    children: value,
                    props: {
                        rowSpan: row._rowspan || 0,
                    },
                }
            }
        },
        {
            key: 'orderGoodsId',
            title: '中台订单子ID',
            dataIndex: 'orderGoodsId',
            align: 'center',
            width: 120,
            render: this.mergeCell
        },
        // 缺失
        {
            key: 'product_sn',
            title: 'Product SN',
            dataIndex: 'product_sn',
            align: 'center',
            width: 120,
            render: this.mergeCell
        },
        // 缺失
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
            key: 'orderGoodsStatus',
            title: '中台订单状态',
            dataIndex: 'orderGoodsStatus',
            align: 'center',
            width: 120,
            render: this.mergeCell
        },
        {
            key: 'productId',
            title: '中台商品ID',
            dataIndex: 'productId',
            align: 'center',
            width: 120,
            render: this.mergeCell
        },
        {
            key: 'purchaseOrderStatus',
            title: '采购订单状态',
            dataIndex: 'purchaseOrderStatus',
            align: 'center',
            width: 120,
        },
        {
            key: 'purchaseOrderPayStatus',
            title: '采购支付状态',
            dataIndex: 'purchaseOrderPayStatus',
            align: 'center',
            width: 120
        },
        {
            key: 'purchaseOrderShippingStatus',
            title: '采购配送状态',
            dataIndex: 'purchaseOrderShippingStatus',
            align: 'center',
            width: 120
        },
        {
            key: 'purchaseCreateTime',
            title: '采购生成时间',
            dataIndex: 'purchaseCreateTime',
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
            key: 'channel_shipping_fee',
            title: '运费',
            dataIndex: 'channel_shipping_fee',
            align: 'center',
            width: 120,
            render: this.mergeCell
        }
    ]

    constructor(props: IProps) {
        super(props);
    }

    private createColumns = ():ColumnProps<IParentOrderItem>[] => {
        const { colList } = this.props;
        // console.log(111, colList);
        const allColumns: ColumnProps<IParentOrderItem>[]  = [];
        colList.forEach(key => {
            const i = this.allColumns.findIndex(item => item.key === key);
            // console.log('key', key, i);
            if (i === -1) {
                // console.log('colList没找到', key);
            } else {
                // allColumns.push(this.allColumns[i]);
                return this.allColumns[i];
            }
        });
        return allColumns;
    }

    // 合并单元格
    private mergeCell(value: string | number, row: IParentOrderItem) {
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
                rowKey="purchasePlanId"
                className="order-table"
                loading={loading}
                columns={columns}
                // rowSelection={rowSelection}
                dataSource={orderList}
                scroll={{ x: true, y: 600 }}
                pagination={false}
            />
        )    
    }
}

export default TableParentAll;

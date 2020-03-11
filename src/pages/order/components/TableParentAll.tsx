import React from 'react';
import { Table, Checkbox } from 'antd';
import { ColumnProps } from 'antd/es/table';


import { IParentOrderItem } from './PaneAll';
import { utcToLocal } from '@/utils/date';
import { getStatusDesc } from '@/utils/transform';
import { 
    orderStatusOptionList,
    orderShippingOptionList
} from '@/enums/OrderEnum';

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
            key: 'createTime',
            title: '订单时间',
            dataIndex: 'createTime',
            align: 'center',
            width: 120,
            render: (value: string, row: IParentOrderItem) => {
                return {
                    children: utcToLocal(value),
                    props: {
                        rowSpan: row._rowspan || 0,
                    },
                }
            }
        },
        {
            key: 'orderId',
            title: '中台订单父订单ID',
            dataIndex: 'orderId',
            align: 'center',
            width: 120,
            render: this.mergeCell
        },
        // 缺失
        // {
        //     key: 'a1',
        //     title: '运费',
        //     dataIndex: 'a1',
        //     align: 'center',
        //     width: 120,
        //     render: this.mergeCell
        // },
        // 缺失
        // {
        //     key: 'channel_order_status',
        //     title: '渠道订单状态',
        //     dataIndex: 'channel_order_status',
        //     align: 'center',
        //     width: 120,
        //     render: this.mergeCell
        // },
        // 缺失
        // {
        //     key: 'channel_delivery_status',
        //     title: '渠道发货状态',
        //     dataIndex: 'channel_delivery_status',
        //     align: 'center',
        //     width: 120,
        //     render: this.mergeCell
        // },
        {
            key: 'productId',
            title: '中台商品ID',
            dataIndex: 'productId',
            align: 'center',
            width: 120
        },
        {
            key: 'goodsNumber',
            title: '商品数量',
            dataIndex: 'goodsNumber',
            align: 'center',
            width: 120,
        },
        {
            key: 'goodsAmount',
            title: '商品价格',
            dataIndex: 'goodsAmount',
            align: 'center',
            width: 120,
        },
        {
            key: 'orderGoodsId',
            title: '中台子订单ID',
            dataIndex: 'orderGoodsId',
            align: 'center',
            width: 120
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
            key: 'orderGoodsShippingStatus',
            title: '中台订单配送状态',
            dataIndex: 'orderGoodsShippingStatus',
            align: 'center',
            width: 120,
            render: (value: number) => {
                return getStatusDesc(orderShippingOptionList, value)
            }
        },
        // {
        //     key: 'orderGoodsId',
        //     title: '中台子订单ID',
        //     dataIndex: 'orderGoodsId',
        //     align: 'center',
        //     width: 120
        // },
        // {
        //     key: 'goodsAmount',
        //     title: '价格',
        //     dataIndex: 'goodsAmount',
        //     align: 'center',
        //     width: 120
        // },
        {
            key: 'goodsDetail',
            title: '商品详情',
            dataIndex: 'goodsDetail',
            align: 'center',
            width: 120
        },
        {
            key: 'productShop',
            title: '渠道店铺名',
            dataIndex: 'productShop',
            align: 'center',
            width: 120
        },
        {
            key: 'confirmTime',
            title: '订单确认时间',
            dataIndex: 'confirmTime',
            align: 'center',
            width: 120,
            render: this.mergeCell
        },
        {
            key: 'channelSource',
            title: '销售渠道',
            dataIndex: 'channelSource',
            align: 'center',
            width: 120,
            render: this.mergeCell
        },
        {
            key: 'currency',
            title: '货币类型',
            dataIndex: 'currency',
            align: 'center',
            width: 120,
            render: this.mergeCell
        },
        {
            key: 'orderAmount',
            title: '商品总金额',
            dataIndex: 'orderAmount',
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
        // const allColumns: ColumnProps<IParentOrderItem>[]  = [];
        return colList.map(key => {
            const i = this.allColumns.findIndex(item => item.key === key);
            // console.log('key', key, i);
            // if (i === -1) {
            //     console.log('colList没找到', key);
            // } else {
            //     return this.allColumns[i];
            // }
            return this.allColumns[i];
        });
        // return allColumns;
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
                rowKey="orderGoodsId"
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

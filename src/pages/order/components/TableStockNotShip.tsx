import React from 'react';
import { Checkbox } from 'antd';
import { ColumnProps } from 'antd/es/table';

import { IOrderItem } from './PaneStockNotShip';
import { FitTable } from '@/components/FitTable';

import { utcToLocal } from '@/utils/date';
import { getStatusDesc } from '@/utils/transform';
import { purchaseOrderOptionList, purchaseShippingOptionList } from '@/enums/OrderEnum';

declare interface IProps {
    loading: boolean;
    orderList: IOrderItem[];
    onCheckAllChange(status: boolean): void;
    onSelectedRow(row: IOrderItem): void;
}

declare interface IState {}

class TableStockNotShip extends React.PureComponent<IProps, IState> {
    private columns: ColumnProps<IOrderItem>[] = [
        {
            fixed: true,
            key: '_checked',
            title: () => {
                const { orderList, onCheckAllChange } = this.props;
                const rowspanList = orderList.filter(item => item._rowspan);
                const checkedListLen = rowspanList.filter(item => item._checked).length;
                let indeterminate = false,
                    checked = false;
                if (rowspanList.length && rowspanList.length === checkedListLen) {
                    checked = true;
                } else if (checkedListLen) {
                    indeterminate = true;
                }
                return (
                    <Checkbox
                        indeterminate={indeterminate}
                        checked={checked}
                        onChange={e => onCheckAllChange(e.target.checked)}
                    />
                );
            },
            dataIndex: '_checked',
            align: 'center',
            width: 50,
            render: (value: boolean, row: IOrderItem) => {
                return {
                    children: (
                        <Checkbox checked={value} onChange={() => this.props.onSelectedRow(row)} />
                    ),
                    props: {
                        rowSpan: row._rowspan || 0,
                    },
                };
            },
        },
        {
            key: 'createTime',
            title: '订单时间',
            dataIndex: 'createTime',
            align: 'center',
            width: 120,
            render: (value: string, row: IOrderItem) => {
                return {
                    children: utcToLocal(value),
                    props: {
                        rowSpan: row._rowspan || 0,
                    },
                };
            },
        },
        {
            key: 'orderGoodsId',
            title: '中台订单子ID',
            dataIndex: 'orderGoodsId',
            align: 'center',
            width: 120,
            render: this.mergeCell,
        },
        {
            key: 'purchasePlanId',
            title: '计划子项ID',
            dataIndex: 'purchasePlanId',
            align: 'center',
            width: 120,
            // render: this.mergeCell
        },
        {
            key: 'productId',
            title: '中台商品ID',
            dataIndex: 'productId',
            align: 'center',
            width: 120,
            // render: this.mergeCell
        },
        {
            key: 'purchaseWaybillNo',
            title: '采购运单号',
            dataIndex: 'purchaseWaybillNo',
            align: 'center',
            width: 120,
        },
        {
            key: 'purchaseOrderStatus',
            title: '采购订单状态',
            dataIndex: 'purchaseOrderStatus',
            align: 'center',
            width: 120,
            render: (value: number, row: IOrderItem) => {
                return getStatusDesc(purchaseOrderOptionList, value);
            },
        },
        {
            key: 'purchaseOrderShippingStatus',
            title: '采购配送状态',
            dataIndex: 'purchaseOrderShippingStatus',
            align: 'center',
            width: 120,
            render: (value: number, row: IOrderItem) => {
                return getStatusDesc(purchaseShippingOptionList, value);
            },
        },
        {
            key: 'storageTime',
            title: '入库时间',
            dataIndex: 'storageTime',
            align: 'center',
            width: 120,
            render: (value: string, row: IOrderItem) => {
                return {
                    children: utcToLocal(value),
                    props: {
                        rowSpan: row._rowspan || 0,
                    },
                };
            },
        },
        {
            key: 'deliveryCommandTime',
            title: '发送发货指令时间',
            dataIndex: 'deliveryCommandTime',
            align: 'center',
            width: 120,
            render: (value: string, row: IOrderItem) => {
                return {
                    children: utcToLocal(value),
                    props: {
                        rowSpan: row._rowspan || 0,
                    },
                };
            },
        },
        // {
        //     key: 'a2',
        //     title: '发货剩余时间',
        //     dataIndex: 'a1',
        //     align: 'center',
        //     width: 120,
        //     render: (value: string, row: IOrderItem) => {
        //         return {
        //             children: utcToLocal(value),
        //             props: {
        //                 rowSpan: row._rowspan || 0,
        //             },
        //         };
        //     },
        // },
        {
            key: 'cancelTime',
            title: '取消订单时间',
            dataIndex: 'cancelTime',
            align: 'center',
            width: 120,
            render: (value: string, row: IOrderItem) => {
                return {
                    children: utcToLocal(value),
                    props: {
                        rowSpan: row._rowspan || 0,
                    },
                };
            },
        },
        {
            key: '_goodsTotalAmount',
            title: '商品总金额',
            dataIndex: '_goodsTotalAmount',
            align: 'center',
            width: 120,
            render: (value, row: IOrderItem) => {
                // console.log(row);
                const { goodsAmount, goodsNumber } = row;
                return {
                    children: Number(goodsAmount) * goodsNumber,
                    props: {
                        rowSpan: row._rowspan || 0,
                    },
                };
            },
        },
        {
            key: 'channelOrderGoodsSn',
            title: '渠道订单ID',
            dataIndex: 'channelOrderGoodsSn',
            align: 'center',
            width: 120,
            render: this.mergeCell,
        },
        {
            key: 'channelSource',
            title: '销售渠道',
            dataIndex: 'channelSource',
            align: 'center',
            width: 120,
            render: this.mergeCell,
        },
        {
            key: 'confirmTime',
            title: '订单确认时间',
            dataIndex: 'confirmTime',
            align: 'center',
            width: 120,
            render: (value: string, row: IOrderItem) => {
                return {
                    children: utcToLocal(value),
                    props: {
                        rowSpan: row._rowspan || 0,
                    },
                };
            },
        },
    ];

    constructor(props: IProps) {
        super(props);
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

        return (
            <FitTable
                bordered
                rowKey={record => {
                    return record.purchasePlanId || record.orderGoodsId;
                }}
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

export default TableStockNotShip;

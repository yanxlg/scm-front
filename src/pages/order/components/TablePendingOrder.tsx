import React from 'react';
import { Checkbox } from 'antd';
import { FitTable } from 'react-components';

import { IOrderItem } from './PanePendingOrder';
import { ColumnProps } from 'antd/lib/table/Column';
import { utcToLocal } from 'react-components/es/utils/date';
import { getStatusDesc } from '@/utils/transform';
import { purchaseOrderOptionList } from '@/enums/OrderEnum';

declare interface IProps {
    loading: boolean;
    orderList: IOrderItem[];
    onCheckAllChange(status: boolean): void;
    onSelectedRow(row: IOrderItem): void;
}

declare interface IState {}

class TablePendingOrder extends React.PureComponent<IProps, IState> {
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
            width: 60,
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
            fixed: true,
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
            fixed: true,
            key: 'orderGoodsId',
            title: '中台订单ID',
            dataIndex: 'orderGoodsId',
            align: 'center',
            width: 120,
            render: this.mergeCell,
        },
        {
            key: 'goodsNumber',
            title: '商品数量',
            dataIndex: 'goodsNumber',
            align: 'center',
            width: 120,
            render: this.mergeCell,
        },
        {
            key: 'goodsAmount',
            title: '商品价格',
            dataIndex: 'goodsAmount',
            align: 'center',
            width: 120,
            render: this.mergeCell,
        },
        {
            key: 'freight',
            title: '预估运费',
            dataIndex: 'freight',
            align: 'center',
            width: 120,
            render: this.mergeCell,
        },
        // // 缺少
        // {
        //     key: 'sale_price',
        //     title: '销售价',
        //     dataIndex: 'sale_price',
        //     align: 'center',
        //     width: 120,
        //     render: this.mergeCell,
        // },
        // // 缺少
        // {
        //     key: 'sale_order_status',
        //     title: '销售订单状态',
        //     dataIndex: 'sale_order_status',
        //     align: 'center',
        //     width: 120,
        //     render: this.mergeCell,
        // },
        {
            key: 'productId',
            title: '中台商品ID',
            dataIndex: 'productId',
            align: 'center',
            width: 120,
            render: this.mergeCell,
        },

        {
            key: 'skuId',
            title: '中台SKU ID',
            dataIndex: 'skuId',
            align: 'center',
            width: 120,
            render: this.mergeCell,
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
            key: 'purchasePlatform',
            title: '采购平台',
            dataIndex: 'purchasePlatform',
            align: 'center',
            width: 120,
            // render: this.mergeCell
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
            key: 'purchaseNumber',
            title: '采购数量',
            dataIndex: 'purchaseNumber',
            align: 'center',
            width: 120,
            // render: this.mergeCell
        },
        {
            key: 'purchaseAmount',
            title: '采购单价',
            dataIndex: 'purchaseAmount',
            align: 'center',
            width: 120,
            // render: this.mergeCell
        },
        // // 缺少
        // {
        //     key: 'goods_img',
        //     title: '商品图片',
        //     dataIndex: 'goods_img',
        //     align: 'center',
        //     width: 120,
        //     render: this.mergeCell,
        //     // render: (value: string) => {
        //     //     return (
        //     //         <img style={{width: '100%'}} src={value}/>
        //     //     )
        //     // }
        // },
        // // 缺少
        // {
        //     key: 'style',
        //     title: '商品信息',
        //     dataIndex: 'style',
        //     align: 'center',
        //     width: 120,
        //     render: this.mergeCell,
        // },
        // // 缺少
        // {
        //     key: 'second_catagory',
        //     title: '中台分类',
        //     dataIndex: 'second_catagory',
        //     align: 'center',
        //     width: 120,
        //     render: this.mergeCell,
        //     // render: (value: ICatagoryData) => {
        //     //     return value.name
        //     // }
        // },
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
        // const width = this.columns.reduce((total, current) => total + (current.width as number), 0);
        // console.log('render', 111111);
        return (
            // <Table
            //     bordered
            //     rowKey={record => {
            //         return record.purchasePlanId || record.orderGoodsId;
            //     }}
            //     className="order-table"
            //     loading={loading}
            //     columns={this.columns}
            //     dataSource={orderList}
            //     scroll={{ x: width || 'max-content', y: 600 }}
            //     pagination={false}
            // />
            <FitTable
                bordered
                rowKey="purchasePlanId"
                className="order-table"
                loading={loading}
                columns={this.columns}
                dataSource={orderList}
                scroll={{ x: 'max-content' }}
                bottom={20}
                minHeight={500}
                pagination={false}
            />
        );
    }
}

export default TablePendingOrder;

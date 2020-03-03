import React from 'react';
import { Table, Checkbox } from 'antd';
import { ColumnProps } from 'antd/es/table';

import GoodsDetailDialog from './GoodsDetailDialog';
import { IChildOrderItem, IPurchaseStatus } from './PaneAll';
import { getOrderGoodsDetail } from '@/services/order-manage';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';

declare interface ISpecs {
    [key: string]: string;
}

export declare interface IGoodsDetail {
    channel_goods_id: string;
    psku: string;
    main_img: string;
    sku: string;
    sku_img: string;
    goods_name: string;
    specs: ISpecs;
}

declare interface IProps {
    loading: boolean;
    colList: string[];
    orderList: IChildOrderItem[];
    onCheckAllChange(status: boolean): void;
    onSelectedRow(row: IChildOrderItem): void;
}

declare interface IState {
    detailDialogStatus: boolean;
    goodsDetail: IGoodsDetail | null;
}

class OrderTableAll extends React.PureComponent<IProps, IState> {

    private allColumns: ColumnProps<IChildOrderItem>[] = [
        {
            key: 'goodsCreateTime',
            title: '订单时间',
            dataIndex: 'goodsCreateTime',
            align: 'center',
            width: 120,
            render: (value: number, row: IChildOrderItem) => {
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
        {
            key: 'goods_detail',
            title: '商品详情',
            dataIndex: 'goods_detail',
            align: 'center',
            width: 120,
            render: (value: any, row: IChildOrderItem) => {
                return {
                    children: <a onClick={() => this.getOrderGoodsDetail(row.channel_order_id)}>查看商品详情</a>,
                    props: {
                        rowSpan: row._rowspan || 0,
                    },
                }
            }
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
        },
        // {
        //     key: 'channel_order_id',
        //     title: '渠道订单ID',
        //     dataIndex: 'channel_order_id',
        //     align: 'center',
        //     width: 120,
        //     render: this.mergeCell
        // },
        // {
        //     key: 'channel_goods_price',
        //     title: '价格',
        //     dataIndex: 'channel_goods_price',
        //     align: 'center',
        //     width: 120,
        //     render: this.mergeCell
        // },
        // {
        //     key: 'channel_shipping_fee',
        //     title: '运费',
        //     dataIndex: 'channel_shipping_fee',
        //     align: 'center',
        //     width: 120,
        //     render: this.mergeCell
        // },
        // {
        //     key: 'goods_number',
        //     title: '商品数量',
        //     dataIndex: 'goods_number',
        //     align: 'center',
        //     width: 120,
        //     render: this.mergeCell
        // },
        // {
        //     key: 'cancel_order_time',
        //     title: '取消订单时间',
        //     dataIndex: 'cancel_order_time',
        //     align: 'center',
        //     width: 120,
        //     render: this.mergeCell
        // },
        // {
        //     key: 'goods_purchase_shipping_no',
        //     title: '采购运单号',
        //     dataIndex: 'goods_purchase_shipping_no',
        //     align: 'center',
        //     width: 120,
        //     render: this.mergeCell
        // },
        // {
        //     key: 'channel',
        //     title: '销售渠道',
        //     dataIndex: 'channel',
        //     align: 'center',
        //     width: 120,
        //     render: this.mergeCell
        // },
        // {
        //     key: 'middleground_p_order_id',
        //     title: '中台父订单ID',
        //     dataIndex: 'middleground_p_order_id',
        //     align: 'center',
        //     width: 120,
        //     render: this.mergeCell
        // },
        // {
        //     key: 'currency_type',
        //     title: '货币类型',
        //     dataIndex: 'currency_type',
        //     align: 'center',
        //     width: 120,
        //     render: this.mergeCell
        // },
        // {
        //     key: 'remain_delivery_time',
        //     title: '发货剩余时间',
        //     dataIndex: 'remain_delivery_time',
        //     align: 'center',
        //     width: 120,
        //     render: this.mergeCell
        // },
        // {
        //     key: 'channel_store_name',
        //     title: '渠道店铺名',
        //     dataIndex: 'channel_store_name',
        //     align: 'center',
        //     width: 120,
        //     render: this.mergeCell
        // },
        // {
        //     key: 'purchase_cancel_reason',
        //     title: '采购取消原因',
        //     dataIndex: 'purchase_cancel_reason',
        //     align: 'center',
        //     width: 120,
        //     render: this.mergeCell
        // },
        // {
        //     key: 'goods_amount',
        //     title: '商品总金额',
        //     dataIndex: 'goods_amount',
        //     align: 'center',
        //     width: 120,
        //     render: this.mergeCell
        // },
        // {
        //     key: 'p_order_id',
        //     title: '父订单ID',
        //     dataIndex: 'p_order_id',
        //     align: 'center',
        //     width: 120,
        //     render: this.mergeCell
        // },
        // {
        //     key: 'child_order_id',
        //     title: '子订单ID',
        //     dataIndex: 'child_order_id',
        //     align: 'center',
        //     width: 120,
        //     render: this.mergeCell
        // },
    ]

    constructor(props: IProps) {
        super(props);
        this.state = {
            detailDialogStatus: false,
            goodsDetail: null,
        }
    }

    private createColumns = ():ColumnProps<IChildOrderItem>[] => {
        const { colList, orderList, onCheckAllChange, onSelectedRow } = this.props;
        const rowspanList = orderList.filter(item => item._rowspan);
        const checkedListLen = rowspanList.filter(item => item._checked).length;
        let indeterminate = false, checked = false;
        if (rowspanList.length && rowspanList.length === checkedListLen) {
            checked = true; 
        } else if (checkedListLen) {
            indeterminate = true;
        }
        // console.log(111, colList);
        const allColumns: ColumnProps<IChildOrderItem>[]  = [
            {
                fixed: true,
                key: '_checked',
                title: () => <Checkbox indeterminate={indeterminate} checked={checked} onChange={e => onCheckAllChange(e.target.checked)}/>,
                dataIndex: '_checked',
                align: 'center',
                width: 60,
                render: (value: boolean, row: IChildOrderItem) => {
                    return {
                        children: (
                            <Checkbox 
                                checked={value}
                                onChange={() => onSelectedRow(row)}
                            />
                        ),
                        props: {
                            rowSpan: row._rowspan || 0,
                        },
                    }
                }
            },
        ]
        colList.forEach(key => {
            const i = this.allColumns.findIndex(item => item.key === key);
            // console.log('key', key, i);
            if (i === -1) {
                // console.log('colList没找到', key);
            } else {
                allColumns.push(this.allColumns[i]);
            }
        });
        return allColumns;
    }

    // 合并单元格
    private mergeCell(value: string | number, row: IChildOrderItem) {
        return {
            children: value,
            props: {
                rowSpan: row._rowspan || 0,
            },
        };
    }

    hideGoodsDetailDialog = () => {
        this.setState({
            detailDialogStatus: false,
            goodsDetail: null,
        });
    };

    // 获取商品详情
    private getOrderGoodsDetail = (middleground_order_id: string) => {
        this.setState({
            detailDialogStatus: true,
        });
        getOrderGoodsDetail({
            middleground_order_id,
        })
            .then(res => {
                // console.log('getOrderGoodsDetail', res);
                this.setState({
                    goodsDetail: res.data,
                });
            })
    };

    render() {

        const { loading, orderList } = this.props;
        const { detailDialogStatus, goodsDetail } = this.state;
        const columns = this.createColumns()

        return (
            <>
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
                <GoodsDetailDialog 
                    visible={detailDialogStatus}
                    goodsDetail={goodsDetail}
                    hideGoodsDetailDialog={this.hideGoodsDetailDialog}
                />
            </>
            
        )    
    }
}

export default OrderTableAll;

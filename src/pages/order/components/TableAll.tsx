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
            key: 'createTime',
            title: '订单时间',
            dataIndex: 'createTime',
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
            key: 'orderGoodsId',
            title: '商品详情',
            dataIndex: 'orderGoodsId',
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
        {
            key: 'channelOrderGoodsSn',
            title: 'Product SN',
            dataIndex: 'channelOrderGoodsSn',
            align: 'center',
            width: 120,
            render: this.mergeCell
        },
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
        // 待确定
        {
            key: 'purchasePlatformOrderId',
            title: '采购订单号',
            dataIndex: 'purchasePlatformOrderId',
            align: 'center',
            width: 120
        },
        {
            key: 'purchaseWaybillNo',
            title: '采购运单号',
            dataIndex: 'purchaseWaybillNo',
            align: 'center',
            width: 120
        },
        {
            key: 'purchaseCancelReason',
            title: '采购取消原因',
            dataIndex: 'purchaseCancelReason',
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
            key: 'channelOrderGoodsSn',
            title: '渠道订单ID',
            dataIndex: 'channelOrderGoodsSn',
            align: 'center',
            width: 120,
            render: this.mergeCell
        },
        {
            key: 'goodsAmount',
            title: '价格',
            dataIndex: 'goodsAmount',
            align: 'center',
            width: 120,
            render: this.mergeCell
        },
        // 待确定
        // {
        //     key: 'a4',
        //     title: '运费',
        //     dataIndex: 'a4',
        //     align: 'center',
        //     width: 120,
        //     render: this.mergeCell
        // },
        {
            key: 'goodsNumber',
            title: '商品数量',
            dataIndex: 'goodsNumber',
            align: 'center',
            width: 120,
            render: this.mergeCell
        },
        {
            key: '_goodsTotalAmount',
            title: '商品总金额',
            dataIndex: '_goodsTotalAmount',
            align: 'center',
            width: 120,
            render: this.mergeCell
        },
        {
            key: 'productPlatform',
            title: '销售渠道',
            dataIndex: 'productPlatform',
            align: 'center',
            width: 120,
            render: this.mergeCell
        },
        {
            key: 'orderId',
            title: '中台父订单ID',
            dataIndex: 'orderId',
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
            key: 'productShop',
            title: '渠道店铺名',
            dataIndex: 'productShop',
            align: 'center',
            width: 120,
            render: this.mergeCell
        },
        
        {
            key: 'a14',
            title: '渠道订单状态',
            dataIndex: 'a14',
            align: 'center',
            width: 120,
            render: this.mergeCell
        },
        {
            key: 'orderGoodsId',
            title: '中台子订单ID',
            dataIndex: 'orderGoodsId',
            align: 'center',
            width: 120,
            render: this.mergeCell
        }
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

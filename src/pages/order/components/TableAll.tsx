import React from 'react';
import { Table, Checkbox, Modal } from 'antd';
import { ColumnProps } from 'antd/es/table';
import GoodsDetailDialog from './GoodsDetailDialog';
import TrackDialog from './TrackDialog';
import { IChildOrderItem, IGoodsDetail } from './PaneAll';
import { getOrderGoodsDetail } from '@/services/order-manage';
import { utcToLocal } from '@/utils/date';
import { getStatusDesc } from '@/utils/transform';
import {
    orderStatusOptionList,
    orderShippingOptionList,
    purchaseOrderOptionList,
    purchasePayOptionList,
    purchaseShippingOptionList,
    purchaseReserveOptionList,
} from '@/enums/OrderEnum';

declare interface ISpecs {
    [key: string]: string;
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
    trackDialogStatus: boolean;
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
            render: (value: string, row: IChildOrderItem) => {
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
            key: 'goodsDetail',
            title: '商品详情',
            dataIndex: 'goodsDetail',
            align: 'center',
            width: 120,
            render: (value: any, row: IChildOrderItem) => {
                return {
                    children: (
                        <a onClick={() => this.getOrderGoodsDetail(row.productId, row.skuId)}>
                            查看商品详情
                        </a>
                    ),
                    props: {
                        rowSpan: row._rowspan || 0,
                    },
                };
            },
        },
        // {
        //     key: 'channelOrderGoodsSn',
        //     title: 'Product SN',
        //     dataIndex: 'channelOrderGoodsSn',
        //     align: 'center',
        //     width: 120,
        //     render: this.mergeCell,
        // },
        {
            key: 'skuId',
            title: 'SKU ID',
            dataIndex: 'skuId',
            align: 'center',
            width: 120,
            render: this.mergeCell,
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
            render: (value: number, row: IChildOrderItem) => {
                return {
                    children: getStatusDesc(orderStatusOptionList, value),
                    props: {
                        rowSpan: row._rowspan || 0,
                    },
                };
            },
        },
        {
            key: 'orderGoodsShippingStatus',
            title: '中台订单配送状态',
            dataIndex: 'orderGoodsShippingStatus',
            align: 'center',
            width: 120,
            render: (value: number, row: IChildOrderItem) => {
                return {
                    children: getStatusDesc(orderShippingOptionList, value),
                    props: {
                        rowSpan: row._rowspan || 0,
                    },
                };
            },
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
        {
            key: 'purchasePlatform',
            title: '采购平台',
            dataIndex: 'purchasePlatform',
            align: 'center',
            width: 120,
            // render: this.mergeCell
        },
        {
            key: 'reserveStatus',
            title: '库存预定状态',
            dataIndex: 'reserveStatus',
            align: 'center',
            width: 120,
            render: (value: number, row: IChildOrderItem) => {
                return getStatusDesc(purchaseReserveOptionList, value);
            },
        },
        {
            key: 'purchaseOrderStatus',
            title: '采购订单状态',
            dataIndex: 'purchaseOrderStatus',
            align: 'center',
            width: 120,
            render: (value: number, row: IChildOrderItem) => {
                return getStatusDesc(purchaseOrderOptionList, value);
            },
        },
        {
            key: 'purchaseOrderPayStatus',
            title: '采购支付状态',
            dataIndex: 'purchaseOrderPayStatus',
            align: 'center',
            width: 120,
            render: (value: number, row: IChildOrderItem) => {
                return getStatusDesc(purchasePayOptionList, value);
            },
        },
        {
            key: 'purchaseOrderShippingStatus',
            title: '采购配送状态',
            dataIndex: 'purchaseOrderShippingStatus',
            align: 'center',
            width: 120,
            render: (value: number, row: IChildOrderItem) => {
                return getStatusDesc(purchaseShippingOptionList, value);
            },
        },
        {
            key: 'purchasePlatformOrderId',
            title: '采购订单号',
            dataIndex: 'purchasePlatformOrderId',
            align: 'center',
            width: 120,
        },
        {
            key: 'purchaseWaybillNo',
            title: '采购运单号',
            dataIndex: 'purchaseWaybillNo',
            align: 'center',
            width: 120,
        },

        {
            key: '_logisticsTrack',
            title: '物流轨迹',
            dataIndex: '_logisticsTrack',
            align: 'center',
            width: 120,
            render: (value, row: IChildOrderItem) => {
                const { purchaseWaybillNo } = row;
                // return purchaseWaybillNo ? (
                //     <a onClick={() => this.showLogisticsTrack(purchaseWaybillNo)}>物流轨迹</a>
                // ) : null;
                return <a onClick={() => this.showLogisticsTrack(purchaseWaybillNo)}>物流轨迹</a>;
            },
        },
        {
            key: 'purchaseCancelReason',
            title: '采购取消原因',
            dataIndex: 'purchaseCancelReason',
            align: 'center',
            width: 120,
        },
        {
            key: 'purchaseCreateTime',
            title: '采购时间',
            dataIndex: 'purchaseCreateTime',
            align: 'center',
            width: 120,
            render: (value: string, row: IChildOrderItem) => {
                return utcToLocal(value);
            },
        },
        {
            key: 'payTime',
            title: '支付时间',
            dataIndex: 'payTime',
            align: 'center',
            width: 120,
            render: (value: string, row: IChildOrderItem) => {
                return utcToLocal(value);
            },
        },
        {
            key: 'confirmTime',
            title: '订单确认时间',
            dataIndex: 'confirmTime',
            align: 'center',
            width: 120,
            render: (value: string, row: IChildOrderItem) => {
                return {
                    children: utcToLocal(value),
                    props: {
                        rowSpan: row._rowspan || 0,
                    },
                };
            },
        },
        {
            key: 'cancelTime',
            title: '订单取消时间',
            dataIndex: 'cancelTime',
            align: 'center',
            width: 120,
            render: (value: string, row: IChildOrderItem) => {
                return {
                    children: utcToLocal(value),
                    props: {
                        rowSpan: row._rowspan || 0,
                    },
                };
            },
        },
        {
            key: 'purchaseTime',
            title: '采购完成时间',
            dataIndex: 'purchaseTime',
            align: 'center',
            width: 120,
            render: (value: string, row: IChildOrderItem) => {
                return {
                    children: utcToLocal(value),
                    props: {
                        rowSpan: row._rowspan || 0,
                    },
                };
            },
        },
        {
            key: 'storageTime',
            title: '入库时间',
            dataIndex: 'storageTime',
            align: 'center',
            width: 120,
            render: (value: string, row: IChildOrderItem) => {
                return {
                    children: utcToLocal(value),
                    props: {
                        rowSpan: row._rowspan || 0,
                    },
                };
            },
        },
        {
            key: 'deliveryTime',
            title: '出库时间',
            dataIndex: 'deliveryTime',
            align: 'center',
            width: 120,
            render: (value: string, row: IChildOrderItem) => {
                return {
                    children: utcToLocal(value),
                    props: {
                        rowSpan: row._rowspan || 0,
                    },
                };
            },
        },
        {
            key: 'collectTime',
            title: '揽收时间',
            dataIndex: 'collectTime',
            align: 'center',
            width: 120,
            render: (value: string, row: IChildOrderItem) => {
                return {
                    children: utcToLocal(value),
                    props: {
                        rowSpan: row._rowspan || 0,
                    },
                };
            },
        },
        {
            key: 'receiveTime',
            title: '收货时间',
            dataIndex: 'receiveTime',
            align: 'center',
            width: 120,
            render: (value: string, row: IChildOrderItem) => {
                return {
                    children: utcToLocal(value),
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
            key: 'goodsAmount',
            title: '价格',
            dataIndex: 'goodsAmount',
            align: 'center',
            width: 120,
            render: this.mergeCell,
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
            render: this.mergeCell,
        },
        {
            key: 'freight',
            title: '商品运费',
            dataIndex: 'freight',
            align: 'center',
            width: 120,
            render: this.mergeCell,
        },
        {
            key: '_goodsTotalAmount',
            title: '商品总金额',
            dataIndex: '_goodsTotalAmount',
            align: 'center',
            width: 120,
            render: (value, row: IChildOrderItem) => {
                // console.log(row);
                const { goodsAmount, goodsNumber, freight } = row;
                return {
                    children: Number(goodsAmount) * goodsNumber + (Number(freight) || 0),
                    props: {
                        rowSpan: row._rowspan || 0,
                    },
                };
            },
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
            key: 'orderId',
            title: '中台父订单ID',
            dataIndex: 'orderId',
            align: 'center',
            width: 120,
            render: this.mergeCell,
        },
        {
            key: 'currency',
            title: '货币类型',
            dataIndex: 'currency',
            align: 'center',
            width: 120,
            render: this.mergeCell,
        },
        {
            key: 'productShop',
            title: '渠道店铺名',
            dataIndex: 'productShop',
            align: 'center',
            width: 120,
            render: this.mergeCell,
        },

        {
            key: 'a14',
            title: '渠道订单状态',
            dataIndex: 'a14',
            align: 'center',
            width: 120,
            render: this.mergeCell,
        },
        {
            key: 'orderGoodsId',
            title: '中台子订单ID',
            dataIndex: 'orderGoodsId',
            align: 'center',
            width: 120,
            render: this.mergeCell,
        },
        {
            key: 'lastWaybillNo',
            title: '尾程运单号',
            dataIndex: 'lastWaybillNo',
            align: 'center',
            width: 120,
            render: this.mergeCell,
        },
    ];

    constructor(props: IProps) {
        super(props);
        this.state = {
            detailDialogStatus: false,
            trackDialogStatus: false,
            goodsDetail: null,
        };
    }

    private createColumns = (): ColumnProps<IChildOrderItem>[] => {
        const { colList, orderList, onCheckAllChange, onSelectedRow } = this.props;
        const rowspanList = orderList.filter(item => item._rowspan);
        const checkedListLen = rowspanList.filter(item => item._checked).length;
        let indeterminate = false,
            checked = false;
        if (rowspanList.length && rowspanList.length === checkedListLen) {
            checked = true;
        } else if (checkedListLen) {
            indeterminate = true;
        }
        // console.log(111, colList);
        const allColumns: ColumnProps<IChildOrderItem>[] = [
            {
                fixed: true,
                key: '_checked',
                title: () => (
                    <Checkbox
                        indeterminate={indeterminate}
                        checked={checked}
                        onChange={e => onCheckAllChange(e.target.checked)}
                    />
                ),
                dataIndex: '_checked',
                align: 'center',
                width: 50,
                render: (value: boolean, row: IChildOrderItem) => {
                    return {
                        children: <Checkbox checked={value} onChange={() => onSelectedRow(row)} />,
                        props: {
                            rowSpan: row._rowspan || 0,
                        },
                    };
                },
            },
        ];
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
    };

    private showLogisticsTrack = (purchaseWaybillNo: string) => {
        // console.log('showLogisticsTrack', purchaseWaybillNo);
        this.setState({
            trackDialogStatus: true,
        });
    };

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

    hideTrackDetail = () => {
        this.setState({
            trackDialogStatus: false,
        });
    };

    // 获取商品详情
    private getOrderGoodsDetail = (productId: string, skuId: string) => {
        this.setState({
            detailDialogStatus: true,
        });
        getOrderGoodsDetail(productId).then(res => {
            const { sku_info, product_id, goods_img, title } = res.data;
            if (sku_info) {
                const i = sku_info.findIndex((item: any) => item.commodity_sku_id === skuId);
                const goodsDetail: IGoodsDetail = {
                    product_id,
                    goods_img,
                    title,
                };
                if (i > -1) {
                    const { sku_style, sku_sn, sku_img } = sku_info[i];
                    Object.assign(goodsDetail, {
                        sku_sn,
                        sku_img,
                        sku_style,
                    });
                }
                this.setState({
                    goodsDetail,
                });
            }
        });
    };

    render() {
        const { loading, orderList } = this.props;
        const { detailDialogStatus, trackDialogStatus, goodsDetail } = this.state;
        const columns = this.createColumns();
        return (
            <>
                <Table
                    key={columns.length}
                    bordered={true}
                    // "purchasePlanId"
                    rowKey={record => {
                        return record.purchasePlanId || record.orderGoodsId;
                    }}
                    className="order-table"
                    loading={loading}
                    columns={columns}
                    // rowSelection={rowSelection}
                    dataSource={orderList}
                    scroll={{ x: 'max-content', y: 500 }}
                    pagination={false}
                />
                <GoodsDetailDialog
                    visible={detailDialogStatus}
                    goodsDetail={goodsDetail}
                    hideGoodsDetailDialog={this.hideGoodsDetailDialog}
                />
                <TrackDialog visible={trackDialogStatus} hideTrackDetail={this.hideTrackDetail} />
            </>
        );
    }
}

export default OrderTableAll;

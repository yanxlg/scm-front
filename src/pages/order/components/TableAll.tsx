import React, { HtmlHTMLAttributes } from 'react';
import { Checkbox } from 'antd';
import { AutoEnLargeImg, FitTable } from 'react-components';
import { ColumnProps } from 'antd/es/table';
import GoodsDetailDialog from './GoodsDetailDialog';
import TrackDialog from './TrackDialog';
import { IChildOrderItem, IGoodsDetail } from './PaneAll';
import { getOrderGoodsDetail } from '@/services/order-manage';
import { utcToLocal } from 'react-components/es/utils/date';
import { getStatusDesc } from '@/utils/transform';
import {
    orderStatusOptionList,
    orderShippingOptionList,
    purchaseOrderOptionList,
    purchasePayOptionList,
    purchaseShippingOptionList,
    purchaseReserveOptionList,
} from '@/enums/OrderEnum';
import Export from '@/components/Export';

declare interface IProps {
    loading: boolean;
    colList: string[];
    orderList: IChildOrderItem[];
    onCheckAllChange(status: boolean): void;
    onSelectedRow(row: IChildOrderItem): void;
    visible: boolean;
    onCancel: () => void;
    onOKey: (values: any) => Promise<any>;
}

declare interface IState {
    detailDialogStatus: boolean;
    trackDialogStatus: boolean;
    goodsDetail: IGoodsDetail | null;
    currentOrder: IChildOrderItem | null;
}

class OrderTableAll extends React.PureComponent<IProps, IState> {
    private allColumns: ColumnProps<IChildOrderItem>[] = [
        {
            key: 'createTime',
            title: '订单生成时间',
            dataIndex: 'createTime',
            align: 'center',
            width: 120,
            render: (value: string) => utcToLocal(value, ''),
        },
        {
            key: 'orderGoodsStatus',
            title: '订单状态',
            dataIndex: 'orderGoodsStatus',
            align: 'center',
            width: 120,
            render: (value: number) => getStatusDesc(orderStatusOptionList, value),
        },
        {
            key: 'orderGoodsShippingStatusShow',
            title: '配送状态',
            dataIndex: 'orderGoodsShippingStatusShow',
            align: 'center',
            width: 120,
            render: (value: number) => getStatusDesc(orderShippingOptionList, value),
        },
        // 勾选展示
        {
            key: 'orderId',
            title: '父订单ID',
            dataIndex: 'orderId',
            align: 'center',
            width: 120,
        },
        {
            key: 'orderGoodsId',
            title: '子订单ID',
            dataIndex: 'orderGoodsId',
            align: 'center',
            width: 120,
        },
        {
            key: 'productId',
            title: 'Version ID',
            dataIndex: 'productId',
            align: 'center',
            width: 120,
        },
        // 勾选展示
        {
            key: 'skuId',
            title: '中台SKU ID',
            dataIndex: 'skuId',
            align: 'center',
            width: 120,
        },
        // 勾选展示 - 待确认
        // {
        //     key: '',
        //     title: '采购渠道Goods ID',
        //     dataIndex: '',
        //     align: 'center',
        //     width: 120,
        // },
        // 勾选展示 - 待确认
        // {
        //     key: '',
        //     title: '采购渠道SKU ID',
        //     dataIndex: '',
        //     align: 'center',
        //     width: 120,
        // },
        {
            key: 'productImage',
            title: 'SKU图片',
            dataIndex: 'productImage',
            align: 'center',
            width: 100,
            render: (value: string) => {
                return <AutoEnLargeImg src={value} className="order-img-lazy" />;
            },
        },
        // // 待补充
        // {
        //     key: '',
        //     title: '商品名称',
        //     dataIndex: '',
        //     align: 'center',
        //     width: 120,
        // },
        {
            key: 'productStyle',
            title: '商品规格',
            dataIndex: 'productStyle',
            align: 'center',
            width: 180,
            render: (value: string) => {
                let child: any = null;
                if (value) {
                    try {
                        const styleInfo = JSON.parse(value);
                        child = (
                            <>
                                {Object.keys(styleInfo).map(key => (
                                    <div key={key}>{`${key}: ${styleInfo[key]}`}</div>
                                ))}
                            </>
                        );
                    } catch (err) {}
                }
                return child;
            },
        },
        {
            key: 'goodsAmount',
            title: '销售商品单价',
            dataIndex: 'goodsAmount',
            align: 'center',
            width: 120,
        },
        {
            key: 'goodsNumber',
            title: '销售商品数量',
            dataIndex: 'goodsNumber',
            align: 'center',
            width: 120,
        },
        {
            key: 'freight',
            title: '销售商品运费',
            dataIndex: 'freight',
            align: 'center',
            width: 120,
        },
        {
            key: '_goodsTotalAmount',
            title: '销售商品总金额',
            dataIndex: '_goodsTotalAmount',
            align: 'center',
            width: 140,
            render: (_, row: IChildOrderItem) => {
                const { goodsAmount, goodsNumber, freight } = row;
                const total = Number(goodsAmount) * goodsNumber + (Number(freight) || 0);
                return isNaN(total) ? '' : total.toFixed(2);
            },
        },
        // 勾选展示
        {
            key: 'currency',
            title: '销售金额货币',
            dataIndex: 'currency',
            align: 'center',
            width: 120,
        },
        // 勾选展示
        {
            key: 'purchaseAmount',
            title: '采购商品单价',
            dataIndex: 'purchaseAmount',
            align: 'center',
            width: 120,
        },
        {
            key: 'purchaseNumber',
            title: '采购商品数量',
            dataIndex: 'purchaseNumber',
            align: 'center',
            width: 120,
        },
        {
            key: '_purchaseTotalAmount',
            title: '采购商品总金额',
            dataIndex: '_purchaseTotalAmount',
            align: 'center',
            width: 140,
            render: (_, row: IChildOrderItem) => {
                const { purchaseNumber, purchaseAmount } = row;
                const total = Number(purchaseNumber) * Number(purchaseAmount);
                return isNaN(total) ? '' : total.toFixed(2);
            },
        },
        // // 勾选展示 - 待补充
        // {
        //     key: '',
        //     title: '商品属性标签',
        //     dataIndex: '',
        //     align: 'center',
        //     width: 120,
        // },
        {
            key: 'channelSource',
            title: '销售渠道',
            dataIndex: 'channelSource',
            align: 'center',
            width: 120,
        },
        // // 勾选展示 - 待补充
        // {
        //     key: '',
        //     title: '销售店铺名称',
        //     dataIndex: '',
        //     align: 'center',
        //     width: 120,
        // },
        // // 勾选展示 - 待补充
        // {
        //     key: '',
        //     title: '销售渠道二级分类',
        //     dataIndex: '',
        //     align: 'center',
        //     width: 120,
        // },
        // // 待补充
        // {
        //     key: '',
        //     title: '销售渠道Goods ID',
        //     dataIndex: '',
        //     align: 'center',
        //     width: 120,
        // },
        {
            key: 'confirmTime',
            title: '销售订单确认时间',
            dataIndex: 'confirmTime',
            align: 'center',
            width: 146,
            render: (value: string) => utcToLocal(value, ''),
        },
        {
            key: 'channelOrderGoodsSn',
            title: '销售订单ID',
            dataIndex: 'channelOrderGoodsSn',
            align: 'center',
            width: 120,
        },
        // 勾选展示
        {
            key: 'cancelTime',
            title: '销售订单取消时间',
            dataIndex: 'cancelTime',
            align: 'center',
            width: 146,
            render: (value: string) => utcToLocal(value, ''),
        },
        // 勾选展示
        {
            key: 'deliveryTime',
            title: '销售订单出库时间',
            dataIndex: 'deliveryTime',
            align: 'center',
            width: 146,
            render: (value: string) => utcToLocal(value, ''),
        },
        // 勾选展示
        {
            key: 'collectTime',
            title: '销售订单揽收时间',
            dataIndex: 'collectTime',
            align: 'center',
            width: 146,
            render: (value: string) => utcToLocal(value, ''),
        },
        {
            key: 'lastWaybillNo',
            title: '销售尾程运单ID',
            dataIndex: 'lastWaybillNo',
            align: 'center',
            width: 136,
        },
        // 勾选展示
        {
            key: 'receiveTime',
            title: '妥投时间',
            dataIndex: 'receiveTime',
            align: 'center',
            width: 120,
            render: (value: string) => utcToLocal(value, ''),
        },
        {
            key: 'purchasePlanId',
            title: '采购计划ID',
            dataIndex: 'purchasePlanId',
            align: 'center',
            width: 120,
        },
        {
            key: 'reserveStatus',
            title: '仓库库存预定状态',
            dataIndex: 'reserveStatus',
            align: 'center',
            width: 148,
            render: (value: number) => getStatusDesc(purchaseReserveOptionList, value),
        },
        {
            key: 'purchasePlatform',
            title: '采购平台',
            dataIndex: 'purchasePlatform',
            align: 'center',
            width: 120,
        },
        // // 勾选展示 - 待补充
        // {
        //     key: '',
        //     title: '采购店铺名称',
        //     dataIndex: '',
        //     align: 'center',
        //     width: 120,
        // },
        {
            key: 'purchaseOrderStatus',
            title: '采购订单状态',
            dataIndex: 'purchaseOrderStatus',
            align: 'center',
            width: 120,
            render: (value: number, row: IChildOrderItem) => {
                const { reserveStatus } = row;
                if (reserveStatus === 3 && value === 1) {
                    return '';
                }
                return getStatusDesc(purchaseOrderOptionList, value);
            },
        },
        // 勾选展示
        {
            key: 'purchaseCreateTime',
            title: '采购订单生成时间',
            dataIndex: 'purchaseCreateTime',
            align: 'center',
            width: 146,
            render: (value: string) => utcToLocal(value, ''),
        },
        // 勾选展示
        {
            key: 'purchasePlatformParentOrderId',
            title: '采购父订单ID',
            dataIndex: 'purchasePlatformParentOrderId',
            align: 'center',
            width: 120,
        },
        // 勾选展示
        {
            key: 'purchasePlatformOrderId',
            title: '采购订单ID',
            dataIndex: 'purchasePlatformOrderId',
            align: 'center',
            width: 120,
        },
        {
            key: 'purchaseOrderPayStatus',
            title: '采购支付状态',
            dataIndex: 'purchaseOrderPayStatus',
            align: 'center',
            width: 120,
            render: (value: number, row: IChildOrderItem) => {
                const { purchasePlatformOrderId } = row;
                return purchasePlatformOrderId ? getStatusDesc(purchasePayOptionList, value) : '';
            },
        },
        // 勾选展示
        {
            key: 'payTime',
            title: '采购支付时间',
            dataIndex: 'payTime',
            align: 'center',
            width: 120,
            render: (value: string, row: IChildOrderItem) => utcToLocal(value, ''),
        },
        // 勾选展示
        {
            key: 'purchaseWaybillNo',
            title: '采购运单ID',
            dataIndex: 'purchaseWaybillNo',
            align: 'center',
            width: 120,
        },
        // 勾选展示
        {
            key: 'purchaseCancelReason',
            title: '采购取消原因',
            dataIndex: 'purchaseCancelReason',
            align: 'center',
            width: 120,
        },
        // 勾选展示
        {
            key: 'purchaseTime',
            title: '采购签收时间',
            dataIndex: 'purchaseTime',
            align: 'center',
            width: 120,
            render: (value: string) => utcToLocal(value, ''),
        },
        // 勾选展示
        {
            key: 'storageTime',
            title: '采购入库时间',
            dataIndex: 'storageTime',
            align: 'center',
            width: 120,
            render: (value: string) => utcToLocal(value, ''),
        },
        // {
        //     key: 'purchaseOrderShippingStatus',
        //     title: '采购配送状态',
        //     dataIndex: 'purchaseOrderShippingStatus',
        //     align: 'center',
        //     width: 120,
        //     render: (value: number, row: IChildOrderItem) => {
        //         return getStatusDesc(purchaseShippingOptionList, value);
        //     },
        // },
        {
            key: '_logisticsTrack',
            title: '物流轨迹',
            dataIndex: '_logisticsTrack',
            align: 'center',
            width: 120,
            render: (value, row: IChildOrderItem) => {
                return <a onClick={() => this.showLogisticsTrack(row)}>物流轨迹</a>;
            },
        },
    ];

    constructor(props: IProps) {
        super(props);
        this.state = {
            detailDialogStatus: false,
            trackDialogStatus: false,
            goodsDetail: null,
            currentOrder: null,
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
                className: 'colspan-cell',
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
        this.allColumns.forEach(item => {
            if (colList.indexOf(item.key as string) > -1) {
                allColumns.push(item);
            }
        });
        return allColumns;
    };

    private showLogisticsTrack = (currentOrder: IChildOrderItem) => {
        // console.log('showLogisticsTrack', purchaseWaybillNo);
        this.setState({
            currentOrder,
            trackDialogStatus: true,
        });
    };

    hideTrackDetail = () => {
        this.setState({
            trackDialogStatus: false,
            currentOrder: null,
        });
    };

    hideGoodsDetailDialog = () => {
        this.setState({
            detailDialogStatus: false,
            goodsDetail: null,
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
        const { loading, orderList, visible, onCancel, onOKey } = this.props;
        const { detailDialogStatus, trackDialogStatus, goodsDetail, currentOrder } = this.state;
        const columns = this.createColumns();
        return (
            <>
                <FitTable
                    // key={columns.length}
                    bordered={true}
                    rowKey={record => {
                        return record.purchasePlanId || record.orderGoodsId;
                    }}
                    // rowKey="orderGoodsId"
                    className="order-table"
                    rowClassName="order-tr"
                    loading={loading}
                    columns={columns}
                    // rowSelection={rowSelection}
                    dataSource={orderList}
                    scroll={{ x: 'max-content' }}
                    autoFitY={true}
                    pagination={false}
                    onRow={record => {
                        return {
                            'data-id': record.orderGoodsId,
                        } as any;
                    }}
                />
                <GoodsDetailDialog
                    visible={detailDialogStatus}
                    goodsDetail={goodsDetail}
                    hideGoodsDetailDialog={this.hideGoodsDetailDialog}
                />
                <TrackDialog
                    visible={trackDialogStatus}
                    orderGoodsId={currentOrder ? currentOrder.orderGoodsId || '' : ''}
                    lastWaybillNo={currentOrder ? currentOrder.lastWaybillNo || '' : ''}
                    hideTrackDetail={this.hideTrackDetail}
                />
                <Export columns={columns} visible={visible} onOKey={onOKey} onCancel={onCancel} />
            </>
        );
    }
}

export default OrderTableAll;

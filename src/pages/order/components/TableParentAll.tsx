import React from 'react';
import { Table, Checkbox } from 'antd';
import { ColumnProps } from 'antd/es/table';

import GoodsDetailDialog from './GoodsDetailDialog';
import { IParentOrderItem, IGoodsDetail } from './PaneAll';
import { getOrderGoodsDetail } from '@/services/order-manage';
import { utcToLocal } from '@/utils/date';
import { getStatusDesc } from '@/utils/transform';
import { orderStatusOptionList, orderShippingOptionList } from '@/enums/OrderEnum';

declare interface IProps {
    loading: boolean;
    colList: string[];
    orderList: IParentOrderItem[];
}

declare interface IState {
    detailDialogStatus: boolean;
    goodsDetail: IGoodsDetail | null;
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
                };
            },
        },
        {
            key: 'orderId',
            title: '中台订单父订单ID',
            dataIndex: 'orderId',
            align: 'center',
            width: 120,
            render: this.mergeCell,
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
            width: 120,
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
            width: 120,
        },
        {
            key: 'channelOrderGoodsSn',
            title: '渠道订单ID',
            dataIndex: 'channelOrderGoodsSn',
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
                return getStatusDesc(orderStatusOptionList, value);
            },
        },
        {
            key: 'orderGoodsShippingStatus',
            title: '中台订单配送状态',
            dataIndex: 'orderGoodsShippingStatus',
            align: 'center',
            width: 120,
            render: (value: number) => {
                return getStatusDesc(orderShippingOptionList, value);
            },
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
            width: 120,
            render: (value: any, row: IParentOrderItem) => {
                return (
                    <a onClick={() => this.getOrderGoodsDetail(row.productId, row.skuId)}>
                        查看商品详情
                    </a>
                );
            },
        },
        {
            key: 'productShop',
            title: '渠道店铺名',
            dataIndex: 'productShop',
            align: 'center',
            width: 120,
        },
        {
            key: 'confirmTime',
            title: '订单确认时间',
            dataIndex: 'confirmTime',
            align: 'center',
            width: 120,
            render: (value: string, row: IParentOrderItem) => {
                return {
                    children: utcToLocal(value),
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
            key: 'currency',
            title: '货币类型',
            dataIndex: 'currency',
            align: 'center',
            width: 120,
            render: this.mergeCell,
        },
        {
            key: 'orderAmount',
            title: '商品总金额',
            dataIndex: 'orderAmount',
            align: 'center',
            width: 120,
            render: this.mergeCell,
        },
    ];

    constructor(props: IProps) {
        super(props);
        this.state = {
            detailDialogStatus: false,
            goodsDetail: null,
        };
    }

    private createColumns = (): ColumnProps<IParentOrderItem>[] => {
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
    };

    // 合并单元格
    private mergeCell(value: string | number, row: IParentOrderItem) {
        return {
            children: value,
            props: {
                rowSpan: row._rowspan || 0,
            },
        };
    }

    // 获取商品详情
    private getOrderGoodsDetail = (productId: string, skuId: string) => {
        this.setState({
            detailDialogStatus: true,
        });
        getOrderGoodsDetail(productId).then(res => {
            const { sku_info, product_id, goods_img, title } = res.data;
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
        });
    };

    hideGoodsDetailDialog = () => {
        this.setState({
            detailDialogStatus: false,
            goodsDetail: null,
        });
    };

    render() {
        const { loading, orderList } = this.props;
        const { detailDialogStatus, goodsDetail } = this.state;
        const columns = this.createColumns();
        return (
            <>
                <Table
                    bordered
                    key={columns.length}
                    rowKey="orderGoodsId"
                    className="order-table"
                    loading={loading}
                    columns={columns}
                    // rowSelection={rowSelection}
                    dataSource={orderList}
                    scroll={{ x: 'max-content', y: 600 }}
                    pagination={false}
                />
                <GoodsDetailDialog
                    visible={detailDialogStatus}
                    goodsDetail={goodsDetail}
                    hideGoodsDetailDialog={this.hideGoodsDetailDialog}
                />
            </>
        );
    }
}

export default TableParentAll;

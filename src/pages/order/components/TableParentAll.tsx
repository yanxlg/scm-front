import React from 'react';
import { Checkbox } from 'antd';
import { ColumnProps } from 'antd/es/table';
import { FitTable } from 'react-components';
import GoodsDetailDialog from './GoodsDetailDialog';
import { IParentOrderItem, IGoodsDetail, IChildOrderItem } from './PaneAll';
import { getOrderGoodsDetail, IFilterParams } from '@/services/order-manage';
import { utcToLocal } from 'react-components/es/utils/date';
import { getStatusDesc } from '@/utils/transform';
import { orderStatusOptionList, orderShippingOptionList } from '@/enums/OrderEnum';
import Export from '@/components/Export';
import { PaginationConfig } from 'antd/es/pagination';

declare interface IProps {
    loading: boolean;
    colList: string[];
    orderList: IParentOrderItem[];
    visible: boolean;
    onCancel: () => void;
    onOKey: (values: any) => Promise<any>;
    page: number;
    pageSize: number;
    total: number;
    showParentStatus: boolean;
    changeParentOrder(checked: boolean): void;
    onSearch(params?: IFilterParams): Promise<any>;
}

declare interface IState {
    detailDialogStatus: boolean;
    goodsDetail: IGoodsDetail | null;
}

class TableParentAll extends React.PureComponent<IProps, IState> {
    private allColumns: ColumnProps<IParentOrderItem>[] = [
        {
            key: 'createTime',
            title: '订单生成时间',
            dataIndex: 'createTime',
            align: 'center',
            width: 120,
            render: (value: string, row: IParentOrderItem) => {
                return {
                    children: utcToLocal(value, ''),
                    props: {
                        rowSpan: row._rowspan || 0,
                    },
                };
            },
        },
        {
            key: 'orderId',
            title: '父订单ID',
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
            title: 'Product ID',
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
            defaultHide: true,
        },
        {
            key: 'productShop',
            title: '渠道店铺名',
            dataIndex: 'productShop',
            align: 'center',
            width: 120,
            defaultHide: true,
        },
        {
            key: 'confirmTime',
            title: '订单确认时间',
            dataIndex: 'confirmTime',
            align: 'center',
            width: 120,
            render: (value: string, row: IParentOrderItem) => {
                return {
                    children: utcToLocal(value, ''),
                    props: {
                        rowSpan: row._rowspan || 0,
                    },
                };
            },
            defaultHide: true,
        },
        {
            key: 'channelSource',
            title: '销售渠道',
            dataIndex: 'channelSource',
            align: 'center',
            width: 120,
            render: this.mergeCell,
            defaultHide: true,
        },
        // {
        //     key: 'productShop',
        //     title: '销售店铺名称',
        //     dataIndex: 'productShop',
        //     align: 'center',
        //     width: 120,
        //     render: this.mergeCell,
        //     defaultHide: true,
        // },
        {
            key: 'currency',
            title: '货币类型',
            dataIndex: 'currency',
            align: 'center',
            width: 120,
            render: this.mergeCell,
            defaultHide: true,
        },
        {
            key: 'orderAmount',
            title: '商品总金额',
            dataIndex: 'orderAmount',
            align: 'center',
            width: 120,
            render: this.mergeCell,
            defaultHide: true,
        },
        {
            key: 'saleMinusPurchaseNormalPrice',
            title: '销售-采购价差',
            dataIndex: 'saleMinusPurchaseNormalPrice',
            align: 'center',
            width: 180,
            render: (value, row: IChildOrderItem) => {
                const { productPrice = 0, purchaseNormalPrice = 0 } = row;
                return Number(productPrice) - Number(purchaseNormalPrice);
            },
        },
    ];

    constructor(props: IProps) {
        super(props);
        this.state = {
            detailDialogStatus: false,
            goodsDetail: null,
        };
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

    toolBarRender = () => {
        const { changeParentOrder, showParentStatus } = this.props;
        return [
            <Checkbox
                onChange={e => changeParentOrder(e.target.checked)}
                checked={showParentStatus}
                key="0"
            >
                仅展示父订单ID
            </Checkbox>,
        ];
    };

    onChange = ({ current, pageSize }: PaginationConfig) => {
        this.props.onSearch({
            page: current,
            page_count: pageSize,
        });
    };

    render() {
        const { loading, orderList, visible, onCancel, onOKey, page, pageSize, total } = this.props;
        const { detailDialogStatus, goodsDetail } = this.state;
        return (
            <>
                <FitTable
                    bordered
                    rowKey="orderGoodsId"
                    // className="order-table"
                    loading={loading}
                    columns={this.allColumns}
                    dataSource={orderList}
                    scroll={{ x: 'max-content' }}
                    autoFitY={true}
                    pagination={{
                        current: page,
                        pageSize: pageSize,
                        total: total,
                        showSizeChanger: true,
                        position: ['topRight', 'bottomRight'],
                    }}
                    columnsSettingRender={true}
                    toolBarRender={this.toolBarRender}
                    onChange={this.onChange}
                />
                <GoodsDetailDialog
                    visible={detailDialogStatus}
                    goodsDetail={goodsDetail}
                    hideGoodsDetailDialog={this.hideGoodsDetailDialog}
                />
                <Export
                    columns={this.allColumns}
                    visible={visible}
                    onOKey={onOKey}
                    onCancel={onCancel}
                />
            </>
        );
    }
}

export default TableParentAll;

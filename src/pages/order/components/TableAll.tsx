import React from 'react';
import { Checkbox, Button } from 'antd';
import { AutoEnLargeImg, FitTable, LoadingButton } from 'react-components';
import { ColumnProps } from 'antd/es/table';
import GoodsDetailDialog from './GoodsDetailDialog';
import TrackDialog from './TrackDialog';
import { IChildOrderItem, IGoodsDetail } from './PaneAll';
import { utcToLocal } from 'react-components/es/utils/date';
import { getStatusDesc } from '@/utils/transform';
import {
    orderStatusOptionList,
    orderShippingOptionList,
    purchaseOrderOptionList,
    purchasePayOptionList,
    purchaseReserveOptionList,
    childrenOrderCancelOptionList,
    purchasePlanCancelOptionList,
    FinalCancelMap,
    FinalCancelStatus,
} from '@/enums/OrderEnum';
import AllColumnsSetting from './AllColumnsSetting';
import Export from '@/components/Export';
import { IFilterParams, getWarehouseList, getPurchaseUidList } from '@/services/order-manage';
import { PaginationConfig } from 'antd/es/pagination';

import formStyles from 'react-components/es/JsonForm/_form.less';
import CancelOrder from './CancelOrder';
import { IOptionItem } from 'react-components/lib/JsonForm/items/Select';

declare interface IProps {
    loading: boolean;
    colList: string[];
    orderList: IChildOrderItem[];
    onCheckAllChange(status: boolean): void;
    onSelectedRow(row: IChildOrderItem): void;
    visible: boolean;
    onCancel: () => void;
    onOKey: (values: any) => Promise<any>;
    page: number;
    pageSize: number;
    total: number;
    onSearch(params?: IFilterParams): Promise<any>;
    postOrdersPlace(ids: string[]): Promise<any>;
    cancelPurchaseOrder(ids: string[]): Promise<any>;
    cancelChannelOrder(ids: string[]): Promise<any>;
    changeParentOrder(checked: boolean): void;
    showParentStatus: boolean;
    getOrderGoodsIdList(): string[];
    getAllTabCount(type: number): void;
    changeRegenerate(status: boolean): void;
}

declare interface IState {
    detailDialogStatus: boolean;
    trackDialogStatus: boolean;
    goodsDetail: IGoodsDetail | null;
    currentOrder: IChildOrderItem | null;
    warehouseList: IOptionItem[];
    purchaseUidList: IOptionItem[];
}

class OrderTableAll extends React.PureComponent<IProps, IState> {
    private allColumns: ColumnProps<IChildOrderItem>[] = [
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
            className: 'colspan-cell',
            render: (value: boolean, row: IChildOrderItem) => {
                return {
                    children: (
                        <Checkbox checked={value} onChange={() => this.props.onSelectedRow(row)} />
                    ),
                    props: {
                        rowSpan: row._rowspan || 0,
                    },
                };
            },
            hideInSetting: true,
        },
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
            defaultHide: true,
        },
        {
            key: 'orderGoodsId',
            title: '子订单ID',
            dataIndex: 'orderGoodsId',
            align: 'center',
            width: 120,
        },
        {
            key: 'commodityId',
            title: 'Commodity ID',
            dataIndex: 'commodityId',
            align: 'center',
            width: 130,
        },
        {
            key: 'productId',
            title: 'Product ID',
            dataIndex: 'productId',
            align: 'center',
            width: 200,
            render: (value: string, record) => {
                return (
                    <>
                        {value}
                        <div style={{ color: 'red' }}>
                            {String(record?.orderGods?.isReplaceDelivery) === '1'
                                ? '（替换成其他商品出库）'
                                : ''}
                        </div>
                    </>
                );
            },
        },
        // 勾选展示
        {
            key: 'skuId',
            title: '中台SKU ID',
            dataIndex: 'skuId',
            align: 'center',
            width: 120,
            defaultHide: true,
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
            defaultHide: true,
        },
        // 勾选展示
        {
            key: 'purchaseAmount',
            title: '采购商品单价',
            dataIndex: 'purchaseAmount',
            align: 'center',
            width: 120,
            defaultHide: true,
            render: (_, row: IChildOrderItem) => {
                const { purchaseNumber, purchaseAmount } = row;
                const price = Number(purchaseAmount) / Number(purchaseNumber);
                return isNaN(price) ? '' : price.toFixed(2);
            },
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
            render: (_, row: IChildOrderItem) => row.purchaseAmount,
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
        // 勾选展示 - 待补充
        {
            key: 'productShop',
            title: '销售店铺名称',
            dataIndex: 'productShop',
            align: 'center',
            width: 120,
            defaultHide: true,
        },
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
            defaultHide: true,
        },
        // 勾选展示
        {
            key: 'deliveryTime',
            title: '销售订单出库时间',
            dataIndex: 'deliveryTime',
            align: 'center',
            width: 146,
            render: (value: string) => utcToLocal(value, ''),
            defaultHide: true,
        },
        // 勾选展示
        {
            key: 'collectTime',
            title: '销售订单揽收时间',
            dataIndex: 'collectTime',
            align: 'center',
            width: 146,
            render: (value: string) => utcToLocal(value, ''),
            defaultHide: true,
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
            defaultHide: true,
        },
        {
            key: 'purchasePlanId',
            title: '采购计划ID',
            dataIndex: 'purchasePlanId',
            align: 'center',
            width: 120,
            render: (value: string, record) => {
                return (
                    <>
                        {value}
                        <div style={{ color: 'red' }}>
                            {String(record?.orderGods?.isOfflinePurchase) === '1'
                                ? '（线下采购，无需拍单）'
                                : ''}
                        </div>
                    </>
                );
            },
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
            title: '采购计划状态',
            dataIndex: 'purchaseOrderStatus',
            align: 'center',
            width: 120,
            render: (value: number, row: IChildOrderItem) => {
                const { reserveStatus } = row;
                if (reserveStatus === 3 && value === 1) {
                    return '无需拍单'; // feature_4170
                }
                return getStatusDesc(purchaseOrderOptionList, value);
            },
        },
        {
            key: 'purchaseFailCode',
            title: '失败原因',
            dataIndex: 'purchaseFailCode',
            align: 'center',
            width: 140,
            render: (value: string, row: IChildOrderItem) => {
                const { purchaseOrderStatus } = row;
                return purchaseOrderStatus === 7
                    ? FinalCancelMap[value as FinalCancelStatus] || '未知原因'
                    : '';
            },
            defaultHide: true,
        },
        // 勾选展示
        {
            key: 'purchaseCreateTime',
            title: '采购计划生成时间',
            dataIndex: 'purchaseCreateTime',
            align: 'center',
            width: 146,
            render: (value: string) => utcToLocal(value, ''),
            defaultHide: true,
        },
        // 勾选展示
        {
            key: 'purchasePlatformParentOrderId',
            title: '采购父订单ID',
            dataIndex: 'purchasePlatformParentOrderId',
            align: 'center',
            width: 120,
            defaultHide: true,
        },
        // 勾选展示
        {
            key: 'purchasePlatformOrderId',
            title: '供应商订单ID',
            dataIndex: 'purchasePlatformOrderId',
            align: 'center',
            width: 120,
            defaultHide: true,
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
            defaultHide: true,
        },
        // 勾选展示
        {
            key: 'purchaseWaybillNo',
            title: '采购运单ID',
            dataIndex: 'purchaseWaybillNo',
            align: 'center',
            width: 120,
            defaultHide: true,
        },
        // 勾选展示
        {
            key: 'purchaseCancelReason',
            title: '采购取消原因',
            dataIndex: 'purchaseCancelReason',
            align: 'center',
            width: 120,
            defaultHide: true,
        },
        // 勾选展示
        {
            key: 'purchaseTime',
            title: '采购签收时间',
            dataIndex: 'purchaseTime',
            align: 'center',
            width: 120,
            render: (value: string) => utcToLocal(value, ''),
            defaultHide: true,
        },
        // 勾选展示
        {
            key: 'storageTime',
            title: '采购入库时间',
            dataIndex: 'storageTime',
            align: 'center',
            width: 120,
            render: (value: string) => utcToLocal(value, ''),
            defaultHide: true,
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
        // 勾选展示
        {
            key: 'cancelType',
            title: '子订单取消类型',
            dataIndex: 'cancelType',
            align: 'center',
            width: 140,
            render: (value: number) => getStatusDesc(childrenOrderCancelOptionList, value),
            defaultHide: true,
        },
        // 勾选展示
        {
            key: 'purchaseCancelType',
            title: '采购单取消类型',
            dataIndex: 'purchaseCancelType',
            align: 'center',
            width: 146,
            render: (value: number) => getStatusDesc(purchasePlanCancelOptionList, value),
            defaultHide: true,
        },
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
        {
            key: 'saleMinusPurchaseNormalPrice',
            title: '销售-采购价差',
            dataIndex: 'saleMinusPurchaseNormalPrice',
            align: 'center',
            width: 180,
            render: (value, row: IChildOrderItem) => {
                const { productPrice = 0, purchaseNormalPrice = 0, purchaseNumber = 0 } = row;
                const purchasePrice = Number(purchaseNormalPrice);
                if (purchasePrice === 0 || isNaN(purchasePrice)) {
                    return '';
                }
                const result =
                    ((Number(productPrice) * 1000 - purchasePrice * 1000) *
                        Number(purchaseNumber)) /
                    1000;
                return result < 0 ? <span style={{ color: 'red' }}>{result}</span> : result;
            },
        },
        {
            key: 'orderAddress',
            title: '用户地址信息',
            dataIndex: 'orderAddress',
            align: 'center',
            width: 180,
            render: (value: any) => {
                if (!value) {
                    return '';
                }
                const {
                    consignee = '',
                    address1 = '',
                    city = '',
                    province = '',
                    country = '',
                    zipCode = '',
                    tel = '',
                } = value;
                return (
                    <div style={{ textAlign: 'left', wordBreak: 'break-all' }}>
                        <div>{consignee}</div>
                        <div>
                            {address1},{city},{province},{country}
                        </div>
                        <div>
                            {zipCode},{tel}
                        </div>
                    </div>
                );
            },
            // render: (value: number) => getStatusDesc(purchasePlanCancelOptionList, value),
            // defaultHide: true,
        },
        {
            key: 'lastWaybillNo',
            title: '供应商订单号',
            dataIndex: 'lastWaybillNo',
            align: 'center',
            width: 130,
        },
        // 勾选展示
        {
            key: 'warehouseId',
            title: '仓库名称',
            dataIndex: 'warehouseId',
            align: 'center',
            width: 130,
            render: (value: string) => {
                const { warehouseList } = this.state;
                return getStatusDesc(warehouseList, value);
            },
            defaultHide: true,
        },
        // 勾选展示
        {
            key: 'platformUid',
            title: '下单账号',
            dataIndex: 'platformUid',
            align: 'center',
            width: 130,
            render: (value: string) => {
                const { purchaseUidList } = this.state;
                return getStatusDesc(purchaseUidList, value);
            },
            defaultHide: true,
        },
    ];

    constructor(props: IProps) {
        super(props);
        this.state = {
            detailDialogStatus: false,
            trackDialogStatus: false,
            goodsDetail: null,
            currentOrder: null,
            warehouseList: [],
            purchaseUidList: [],
        };
    }

    componentDidMount = () => {
        this.getWarehouseList();
        this.getPurchaseUidList();
    };

    private getWarehouseList = () => {
        getWarehouseList().then(list =>
            this.setState({
                warehouseList: list,
            }),
        );
    };

    private getPurchaseUidList = () => {
        getPurchaseUidList().then(list =>
            this.setState({
                purchaseUidList: list,
            }),
        );
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

    onChange = ({ current, pageSize }: PaginationConfig) => {
        this.props.onSearch({
            page: current,
            page_count: pageSize,
        });
    };

    handleChangeRegenerate = (status: boolean) => {
        // console.log(1111111, status);
        this.props.changeRegenerate(status);
    };

    toolBarRender = () => {
        const {
            postOrdersPlace,
            cancelPurchaseOrder,
            changeParentOrder,
            showParentStatus,
            getOrderGoodsIdList,
            onSearch,
            getAllTabCount,
        } = this.props;
        const orderGoodsIdList = getOrderGoodsIdList();
        const disabled = orderGoodsIdList.length === 0;
        const _getAllTabCount = () => getAllTabCount(2);
        return [
            <Checkbox
                onChange={e => changeParentOrder(e.target.checked)}
                checked={showParentStatus}
                key="0"
            >
                仅展示父订单ID
            </Checkbox>,
            <Checkbox onChange={e => this.handleChangeRegenerate(e.target.checked)} key="1">
                展示已重新生成
            </Checkbox>,
            <LoadingButton
                key="2"
                type="primary"
                disabled={disabled}
                className={formStyles.formBtn}
                onClick={() => postOrdersPlace(orderGoodsIdList)}
            >
                一键拍单
            </LoadingButton>,
            <LoadingButton
                key="3"
                type="primary"
                disabled={disabled}
                className={formStyles.formBtn}
                onClick={() => cancelPurchaseOrder(orderGoodsIdList)}
            >
                取消采购单
            </LoadingButton>,
            <CancelOrder
                orderGoodsIds={orderGoodsIdList}
                onReload={onSearch}
                getAllTabCount={_getAllTabCount}
                offShelfChecked={false}
            >
                <Button
                    key="4"
                    type="primary"
                    disabled={disabled}
                    className={formStyles.formBtn}
                    // onClick={() => cancelChannelOrder(orderGoodsIdList)}
                >
                    取消渠道订单
                </Button>
            </CancelOrder>,
        ];
    };

    render() {
        const { loading, orderList, visible, onCancel, onOKey, page, pageSize, total } = this.props;
        const { detailDialogStatus, trackDialogStatus, goodsDetail, currentOrder } = this.state;
        // const columns = this.createColumns();
        return (
            <>
                <FitTable
                    bordered
                    rowKey={record => {
                        return record.purchasePlanId || record.orderGoodsId;
                    }}
                    // className="order-table"
                    rowClassName="order-tr"
                    loading={loading}
                    columns={this.allColumns}
                    dataSource={orderList}
                    scroll={{ x: 'max-content' }}
                    autoFitY={true}
                    minHeight={600}
                    pagination={
                        {
                            current: page,
                            pageSize: pageSize,
                            total: total,
                            showSizeChanger: true,
                            position: ['topRight', 'bottomRight'],
                        } as any
                    }
                    columnsSettingRender={AllColumnsSetting}
                    onChange={this.onChange}
                    onRow={record => {
                        return {
                            'data-id': record.orderGoodsId,
                            // hidden: false,
                        } as any;
                    }}
                    toolBarRender={this.toolBarRender}
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

export default OrderTableAll;

import React from 'react';
import { FitTable } from 'react-components';
import { ColumnProps } from 'antd/es/table';
import { IOrderItem } from './PaneNotStock';
import { getStatusDesc } from '@/utils/transform';
import {
    orderStatusOptionList,
    purchaseOrderOptionList,
    purchaseShippingOptionList,
    purchasePayOptionList,
} from '@/enums/OrderEnum';
import { utcToLocal } from '@/utils/date';

declare interface IProps {
    loading: boolean;
    orderList: IOrderItem[];
    selectedRowKeys: string[];
    changeSelectedRowKeys(keys: string[]): void;
}

declare interface IState {}

class TableNotStock extends React.PureComponent<IProps, IState> {
    private columns: ColumnProps<IOrderItem>[] = [
        {
            key: 'orderGoodsId',
            title: '中台订单ID',
            dataIndex: 'orderGoodsId',
            align: 'center',
            width: 120,
        },
        {
            key: 'orderCreateTime',
            title: '订单时间',
            dataIndex: 'orderCreateTime',
            align: 'center',
            width: 120,
            render: (value: string) => utcToLocal(value),
        },
        {
            key: 'productId',
            title: '中台商品ID',
            dataIndex: 'productId',
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
            key: 'purchasePlanId',
            title: '计划子项ID',
            dataIndex: 'purchasePlanId',
            align: 'center',
            width: 120,
        },
        {
            key: 'purchasePlatform',
            title: '采购平台',
            dataIndex: 'purchasePlatform',
            align: 'center',
            width: 120,
        },
        {
            key: 'purchaseNumber',
            title: '采购数量',
            dataIndex: 'purchaseNumber',
            align: 'center',
            width: 120,
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
            key: 'platformOrderTime',
            title: '采购生成时间',
            dataIndex: 'platformOrderTime',
            align: 'center',
            width: 120,
            render: (value: string) => utcToLocal(value),
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
            key: 'purchaseOrderPayStatus',
            title: '采购支付状态',
            dataIndex: 'purchaseOrderPayStatus',
            align: 'center',
            width: 120,
            render: (value: number, row: IOrderItem) => {
                return getStatusDesc(purchasePayOptionList, value);
            },
        },
        {
            key: 'payTime',
            title: '采购支付时间',
            dataIndex: 'payTime',
            align: 'center',
            width: 120,
            render: (value: string) => utcToLocal(value),
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
            key: 'confirmTime',
            title: '订单确认时间',
            dataIndex: 'confirmTime',
            align: 'center',
            width: 120,
            render: (value: string) => utcToLocal(value),
        },
        {
            key: 'channelOrderSn',
            title: '渠道订单ID',
            dataIndex: 'channelOrderSn',
            align: 'center',
            width: 120,
        },
    ];

    constructor(props: IProps) {
        super(props);
    }

    private onSelectChange = (selectedRowKeys: React.Key[]) => {
        // console.log('onSelectChange', selectedRowKeys);
        this.props.changeSelectedRowKeys(selectedRowKeys as string[]);
    };

    render() {
        const { loading, orderList, selectedRowKeys } = this.props;
        const rowSelection = {
            fixed: true,
            columnWidth: 60,
            selectedRowKeys: selectedRowKeys,
            onChange: this.onSelectChange,
        };
        return (
            <FitTable
                bordered={true}
                rowKey="orderGoodsId"
                className="order-table"
                loading={loading}
                columns={this.columns}
                rowSelection={rowSelection}
                dataSource={orderList}
                scroll={{ x: 'max-content' }}
                pagination={false}
            />
        );
    }
}

export default TableNotStock;

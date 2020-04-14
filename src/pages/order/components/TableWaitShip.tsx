import React from 'react';
import { FitTable } from 'react-components';

import { ColumnProps } from 'antd/es/table';
import { IWaitShipItem } from './PaneWaitShip';
import { utcToLocal } from 'react-components/es/utils/date';
import { getStatusDesc } from '@/utils/transform';
import {
    orderStatusOptionList,
    purchaseOrderOptionList,
    purchaseShippingOptionList,
} from '@/enums/OrderEnum';

declare interface IProps {
    loading: boolean;
    selectedRowKeys: string[];
    orderList: IWaitShipItem[];
    changeSelectedRowKeys(keys: string[]): void;
}

declare interface IState {}

class TablePendingOrder extends React.PureComponent<IProps, IState> {
    columns: ColumnProps<IWaitShipItem>[] = [
        {
            key: 'platformOrderTime',
            title: '采购时间',
            dataIndex: 'platformOrderTime',
            align: 'center',
            width: 120,
            render: (value: string) => {
                return utcToLocal(value, '');
            },
        },
        {
            key: 'purchasePlatformOrderId',
            title: '采购平台订单ID',
            dataIndex: 'purchasePlatformOrderId',
            align: 'center',
            width: 120,
        },
        {
            key: 'purchaseAmount',
            title: '采购价',
            dataIndex: 'purchaseAmount',
            align: 'center',
            width: 120,
        },
        {
            key: 'channelSource',
            title: '销售渠道',
            dataIndex: 'channelSource',
            align: 'center',
            width: 120,
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
            key: 'purchaseOrderStatus',
            title: '采购订单状态',
            dataIndex: 'purchaseOrderStatus',
            align: 'center',
            width: 120,
            render: (value: number) => {
                return getStatusDesc(purchaseOrderOptionList, value);
            },
        },
        {
            key: 'purchaseOrderShippingStatus',
            title: '采购配送状态',
            dataIndex: 'purchaseOrderShippingStatus',
            align: 'center',
            width: 120,
            render: (value: number) => {
                return getStatusDesc(purchaseShippingOptionList, value);
            },
        },
        // {
        //     key: 'purchaseWaybillNo',
        //     title: '采购运单号',
        //     dataIndex: 'purchaseWaybillNo',
        //     align: 'center',
        //     width: 120,
        // },
        {
            key: 'purchasePlanId',
            title: '计划子项ID',
            dataIndex: 'purchasePlanId',
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
            key: 'orderCreateTime',
            title: '订单时间',
            dataIndex: 'orderCreateTime',
            align: 'center',
            width: 120,
            render: (value: string) => {
                return utcToLocal(value, '');
            },
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
                bordered
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

export default TablePendingOrder;

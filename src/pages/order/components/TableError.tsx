import React from 'react';
import { Table } from 'antd';

import { ColumnProps } from 'antd/es/table';
import { IErrorOrderItem } from './PaneError';
import { utcToLocal } from '@/utils/date';
import { getStatusDesc } from '@/utils/transform';
import { errorTypeOptionList, errorDetailOptionList } from '@/enums/OrderEnum';

declare interface IProps {
    loading: boolean;
    orderList: IErrorOrderItem[];
    // changeSelectedRows(selectedRows: IOrderItem[]): void;
}

declare interface IState {}

class TableError extends React.PureComponent<IProps, IState> {
    columns: ColumnProps<IErrorOrderItem>[] = [
        {
            key: 'createTime',
            title: '订单时间',
            dataIndex: 'createTime',
            align: 'center',
            width: 120,
            render: (value: string, row: IErrorOrderItem) => {
                return {
                    children: utcToLocal(value),
                    props: {
                        rowSpan: row._rowspan || 0,
                    },
                };
            },
        },
        {
            key: 'confirmTime',
            title: '订单确认时间',
            dataIndex: 'confirmTime',
            align: 'center',
            width: 120,
            render: (value: string, row: IErrorOrderItem) => {
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
            title: '订单号',
            dataIndex: 'orderGoodsId',
            align: 'center',
            width: 120,
            render: this.mergeCell,
        },
        {
            key: 'channelOrderGoodsSn',
            title: '渠道订单号',
            dataIndex: 'channelOrderGoodsSn',
            align: 'center',
            width: 120,
            render: this.mergeCell,
        },
        {
            key: 'abnormalType',
            title: '异常类型',
            dataIndex: 'abnormalType',
            align: 'center',
            width: 120,
            render: (value: number, row: IErrorOrderItem) => {
                return {
                    children: getStatusDesc(errorTypeOptionList, value),
                    props: {
                        rowSpan: row._rowspan || 0,
                    },
                };
            },
        },
        {
            key: 'abnormalDetailType',
            title: '异常详情',
            dataIndex: 'abnormalDetailType',
            align: 'center',
            width: 120,
            render: (value: number, row: IErrorOrderItem) => {
                return {
                    children: getStatusDesc(errorDetailOptionList, value),
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
            render: (value: string, row: IErrorOrderItem) => {
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
            render: (value: string, row: IErrorOrderItem) => {
                return {
                    children: utcToLocal(value),
                    props: {
                        rowSpan: row._rowspan || 0,
                    },
                };
            },
        },
        {
            key: 'deliveryCommandTime',
            title: '发送指令时间',
            dataIndex: 'deliveryCommandTime',
            align: 'center',
            width: 120,
            render: (value: string, row: IErrorOrderItem) => {
                return {
                    children: utcToLocal(value),
                    props: {
                        rowSpan: row._rowspan || 0,
                    },
                };
            },
        },
        {
            key: 'platformShippingTime',
            title: '采购订单发货时间',
            dataIndex: 'platformShippingTime',
            align: 'center',
            width: 120,
            render: (value: string) => {
                return utcToLocal(value);
            },
        },
        {
            key: 'x1',
            title: '采购订单生成时间',
            dataIndex: 'x1',
            align: 'center',
            width: 120,
            render: (value: string) => {
                return utcToLocal(value);
            },
        },
        {
            key: 'platformOrderTime',
            title: '拍单时间',
            dataIndex: 'platformOrderTime',
            align: 'center',
            width: 120,
            render: (value: string) => {
                return utcToLocal(value);
            },
        },
        {
            key: 'payTime',
            title: '支付时间',
            dataIndex: 'payTime',
            align: 'center',
            width: 120,
            render: (value: string) => {
                return utcToLocal(value);
            },
        },
        {
            key: 'x2',
            title: '标记发货时间',
            dataIndex: 'x2',
            align: 'center',
            width: 120,
            render: (value: string) => {
                return utcToLocal(value);
            },
        },
        {
            key: 'purchaseWaybillNo',
            title: '首程运单号',
            dataIndex: 'purchaseWaybillNo',
            align: 'center',
            width: 120,
        },
        {
            key: 'lastWaybillNo',
            title: '尾程运单号',
            dataIndex: 'lastWaybillNo',
            align: 'center',
            width: 120,
        },
    ];

    constructor(props: IProps) {
        super(props);
    }

    // 合并单元格
    private mergeCell(value: string | number, row: IErrorOrderItem) {
        return {
            children: value,
            props: {
                rowSpan: row._rowspan || 0,
            },
        };
    }

    render() {
        const { loading, orderList } = this.props;
        return (
            <Table
                bordered={true}
                rowKey={record => {
                    return record.purchasePlanId || record.orderGoodsId;
                }}
                className="order-table"
                loading={loading}
                columns={this.columns}
                // rowSelection={rowSelection}
                dataSource={orderList}
                scroll={{ x: 'max-content', y: 500 }}
                pagination={false}
            />
        );
    }
}

export default TableError;

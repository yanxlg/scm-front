import React from 'react';
import { Table, Input, Modal, Button, Checkbox } from 'antd';
import AutoEnLargeImg from '@/components/AutoEnLargeImg';

import { ColumnProps } from 'antd/es/table';
import { IPayItem } from './PanePay';
import { putConfirmPay } from '@/services/order-manage';
import { utcToLocal } from '@/utils/date';

declare interface IProps {
    loading: boolean;
    orderList: IPayItem[];
    onCheckAllChange(status: boolean): void;
    onSelectedRow(row: IPayItem): void;
    onSearch(): void;
}

declare interface IState {}

class TablePendingOrder extends React.PureComponent<IProps, IState> {
    columns: ColumnProps<IPayItem>[] = [
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
            render: (value: boolean, row: IPayItem) => {
                return {
                    children: (
                        <Checkbox checked={value} onChange={() => this.props.onSelectedRow(row)} />
                    ),
                    props: {
                        rowSpan: row._rowspan || 0,
                    },
                };
            },
        },
        {
            key: 'purchase_order_time',
            title: '采购订单生成时间',
            dataIndex: 'purchase_order_time',
            align: 'center',
            width: 150,
            render: (value: string, row: IPayItem) => {
                return {
                    children: utcToLocal(value),
                    props: {
                        rowSpan: row._rowspan || 0,
                    },
                };
            },
        },
        {
            key: 'purchase_parent_order_sn',
            title: '采购父订单号',
            dataIndex: 'purchase_parent_order_sn',
            align: 'center',
            width: 150,
            render: this.mergeCell,
        },
        {
            key: 'purchase_pay_url',
            title: '支付二维码',
            dataIndex: 'purchase_pay_url',
            align: 'center',
            width: 140,
            render: (value: string, row: IPayItem) => {
                const { purchase_parent_order_sn, parent_purchase_pay_status_desc } = row;
                return {
                    children:
                        parent_purchase_pay_status_desc !== '已支付' ? (
                            <div>
                                <AutoEnLargeImg src={value} className="order-img-auto" />
                                <Button
                                    ghost={true}
                                    size="small"
                                    type="primary"
                                    style={{ marginTop: 10 }}
                                    onClick={() => this.confirmPay(purchase_parent_order_sn)}
                                >
                                    确认支付
                                </Button>
                            </div>
                        ) : (
                            parent_purchase_pay_status_desc
                        ),
                    props: {
                        rowSpan: row._rowspan || 0,
                    },
                };
            },
        },
        {
            key: 'purchase_pay_status_desc',
            title: '采购支付状态',
            dataIndex: 'purchase_pay_status_desc',
            align: 'center',
            width: 120,
            render: this.mergeCell,
        },
        {
            key: 'purchase_total_amount',
            title: '采购价',
            dataIndex: 'purchase_total_amount',
            align: 'center',
            width: 120,
            render: this.mergeCell,
        },
        {
            key: 'purchase_order_sn',
            title: '采购子订单号',
            dataIndex: 'purchase_order_sn',
            align: 'center',
            width: 140,
        },
        {
            key: 'purchase_plan_id',
            title: '计划子项ID',
            dataIndex: 'purchase_plan_id',
            align: 'center',
            width: 120,
        },
        {
            key: 'purchase_order_status_desc',
            title: '采购订单状态',
            dataIndex: 'purchase_order_status_desc',
            align: 'center',
            width: 120,
        },
        {
            key: 'purchase_pay_status_desc',
            title: '采购子订单支付状态',
            dataIndex: 'purchase_pay_status_desc',
            align: 'center',
            width: 160,
        },
        // {
        //     key: 'a9',
        //     title: '中台子订单ID',
        //     dataIndex: 'a9',
        //     align: 'center',
        //     width: 120
        // },
        // {
        //     key: 'a10',
        //     title: '订单时间',
        //     dataIndex: 'a10',
        //     align: 'center',
        //     width: 120
        // },
        // {
        //     key: 'a11',
        //     title: '备注',
        //     dataIndex: 'a11',
        //     align: 'center',
        //     width: 200,
        //     render: (value: string, row: IPayItem) => {
        //         return {
        //             children: <TextArea autoSize={true} defaultValue={value}/>,
        //             props: {
        //                 rowSpan: row._rowspan || 0,
        //             },
        //         }
        //     }
        // }
    ];

    constructor(props: IProps) {
        super(props);
    }

    // 合并单元格
    private mergeCell(value: string | number, row: IPayItem) {
        return {
            children: value,
            props: {
                rowSpan: row._rowspan || 0,
            },
        };
    }

    // 确认支付
    confirmPay = (id: string) => {
        const { orderList, onSearch } = this.props;
        const planIdList = orderList
            .filter(item => item.purchase_parent_order_sn === id)
            .map(item => item.purchase_plan_id);
        putConfirmPay({
            purchase_platform_parent_order_id: id,
            purchase_plan_id: planIdList,
        }).then(res => {
            // console.log('putConfirmPay', res);
            onSearch();
        });
    };

    render() {
        const { loading, orderList } = this.props;
        // const columns = this.createColumns()

        return (
            <Table
                bordered={true}
                rowKey="purchase_plan_id"
                className="order-table"
                loading={loading}
                columns={this.columns}
                // rowSelection={rowSelection}
                dataSource={orderList}
                scroll={{ x: 'max-content', y: 600 }}
                pagination={false}
            />
        );
    }
}

export default TablePendingOrder;

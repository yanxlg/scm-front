import React from 'react';
import { Table, Input, Modal, Button, Checkbox } from 'antd';

import { ColumnProps } from 'antd/es/table';
import { IPayItem } from './PanePay';


const { TextArea } = Input;

declare interface IProps {
    loading: boolean;
    orderList: IPayItem[];
    onCheckAllChange(status: boolean): void;
    onSelectedRow(row: IPayItem): void;
}

declare interface IState {

}

class TablePendingOrder extends React.PureComponent<IProps, IState> {

    columns: ColumnProps<IPayItem>[] = [
        {
            fixed: true,
            key: '_checked',
            title: () => {
                const { orderList, onCheckAllChange } = this.props;
                const rowspanList = orderList.filter(item => item._rowspan);
                const checkedListLen = rowspanList.filter(item => item._checked).length;
                let indeterminate = false, checked = false;
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
                )
            },
            dataIndex: '_checked',
            align: 'center',
            width: 60,
            render: (value: boolean, row: IPayItem) => {
                return {
                    children: (
                        <Checkbox 
                            checked={value}
                            onChange={() => this.props.onSelectedRow(row)}
                        />
                    ),
                    props: {
                        rowSpan: row._rowspan || 0,
                    },
                }
            }
        },
        {
            key: 'purchaseOrderTime',
            title: '采购订单生成时间',
            dataIndex: 'purchaseOrderTime',
            align: 'center',
            width: 120,
            render: this.mergeCell
        },
        {
            key: 'purchaseParentOrderSn',
            title: '采购父订单号',
            dataIndex: 'purchaseParentOrderSn',
            align: 'center',
            width: 120,
            render: this.mergeCell
        },
        {
            key: 'purchasePayUrl',
            title: '支付二维码',
            dataIndex: 'purchasePayUrl',
            align: 'center',
            width: 140,
            render: (value: string, row: IPayItem) => {
                return {
                    children: (
                        <div>
                            <img 
                                src={value}
                                style={{width: '100%'}}
                                onMouseEnter={() => this.mouseEnter(value)} 
                            />
                            <Button
                                ghost={true}
                                size="small"
                                type="primary"
                                style={{marginTop: 10}}
                            >确认支付</Button>
                        </div>
                    ),
                    props: {
                        rowSpan: row._rowspan || 0,
                    },
                }
            }
        },
        {
            key: 'parentPurchasePayStatusDesc',
            title: '采购支付状态',
            dataIndex: 'parentPurchasePayStatusDesc',
            align: 'center',
            width: 120,
            render: this.mergeCell
        },
        {
            key: 'purchaseTotalAmount',
            title: '采购价',
            dataIndex: 'purchaseTotalAmount',
            align: 'center',
            width: 120,
            render: this.mergeCell
        },
        {
            key: 'purchaseOrderSn',
            title: '采购子订单号',
            dataIndex: 'purchaseOrderSn',
            align: 'center',
            width: 120
        },
        {
            key: 'purchasePlanId',
            title: '计划子项ID',
            dataIndex: 'purchasePlanId',
            align: 'center',
            width: 120
        },
        {
            key: 'purchaseOrderStatusDesc',
            title: '采购订单状态',
            dataIndex: 'purchaseOrderStatusDesc',
            align: 'center',
            width: 120
        },
        {
            key: 'purchasePayStatusDesc',
            title: '采购子订单支付状态',
            dataIndex: 'purchasePayStatusDesc',
            align: 'center',
            width: 120
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
    ]

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

    mouseEnter = (qrCodeurl: string) => {
        // console.log('mouseEnter');
        Modal.success({
            icon: null,
            okText: '关闭',
            maskClosable: true,
            content: <img style={{width: '100%'}} src={qrCodeurl} />
        });
    }

    render() {

        
        const { loading, orderList } = this.props;
        // const columns = this.createColumns()

        return (
            <Table
                bordered={true}
                rowKey="middleground_order_id"
                className="order-table"
                loading={loading}
                columns={this.columns}
                // rowSelection={rowSelection}
                dataSource={orderList}
                scroll={{ x: true, y: 600 }}
                pagination={false}
                
            />
        )    
    }
}

export default TablePendingOrder;

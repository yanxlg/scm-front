import React from 'react';
import { Table, Input, Checkbox } from 'antd';
import { ColumnProps } from 'antd/es/table';
import { TableRowSelection } from 'antd/lib/table/interface';

import { IOrderItem, IStyleData, ICatagoryData } from './PanePendingOrder';

// import { formatDate } from '@/utils/date';

const { TextArea } = Input;

declare interface IProps {
    loading: boolean;
    orderList: IOrderItem[];
    onCheckAllChange(status: boolean): void;
    onSelectedRow(row: IOrderItem): void;
}

declare interface IState {

}

class TablePendingOrder extends React.PureComponent<IProps, IState> {

    private columns: ColumnProps<IOrderItem>[] = [
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
            render: (value: boolean, row: IOrderItem) => {
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
            fixed: true,
            key: 'goodsCreateTime',
            title: '订单时间',
            dataIndex: 'goodsCreateTime',
            align: 'center',
            width: 120,
            render: this.mergeCell
        },
        {
            fixed: true,
            key: 'orderId',
            title: '中台订单ID',
            dataIndex: 'orderId',
            align: 'center',
            width: 120,
            render: this.mergeCell
        },
        // 缺少
        {
            key: 'goods_img',
            title: '商品图片',
            dataIndex: 'goods_img',
            align: 'center',
            width: 120,
            render: this.mergeCell
            // render: (value: string) => {
            //     return (
            //         <img style={{width: '100%'}} src={value}/>
            //     )
            // }
        },
        // 缺少
        {
            key: 'style',
            title: '商品信息',
            dataIndex: 'style',
            align: 'center',
            width: 120,
            render: this.mergeCell
        },
        {
            key: 'goodsNumber',
            title: '商品数量',
            dataIndex: 'goodsNumber',
            align: 'center',
            width: 120,
            render: this.mergeCell
        },
        {
            key: 'goodsAmount',
            title: '商品价格',
            dataIndex: 'goodsAmount',
            align: 'center',
            width: 120,
            render: this.mergeCell
        },
        // 缺少
        {
            key: 'shipping_fee',
            title: '预估运费',
            dataIndex: 'shipping_fee',
            align: 'center',
            width: 120,
            render: this.mergeCell
        },
        // 缺少
        {
            key: 'sale_price',
            title: '销售价',
            dataIndex: 'sale_price',
            align: 'center',
            width: 120,
            render: this.mergeCell
        },
        // 缺少
        {
            key: 'sale_order_status',
            title: '销售订单状态',
            dataIndex: 'sale_order_status',
            align: 'center',
            width: 120,
            render: this.mergeCell
        },
        {
            key: 'productId',
            title: '中台商品ID',
            dataIndex: 'productId',
            align: 'center',
            width: 120,
            render: this.mergeCell
        },
        // 缺少
        {
            key: 'second_catagory',
            title: '中台二级分类',
            dataIndex: 'second_catagory',
            align: 'center',
            width: 120,
            render: this.mergeCell
            // render: (value: ICatagoryData) => {
            //     return value.name
            // }
        },
        {
            key: 'skuId',
            title: '中台SKU ID',
            dataIndex: 'skuId',
            align: 'center',
            width: 120,
            render: this.mergeCell
        },
        {
            key: 'purchasePlatform',
            title: '采购平台',
            dataIndex: 'purchasePlatform',
            align: 'center',
            width: 120
        },
        {
            key: 'purchaseNumber',
            title: '采购数量',
            dataIndex: 'purchaseNumber',
            align: 'center',
            width: 120
        },
        {
            key: 'purchaseAmount',
            title: '采购价格',
            dataIndex: 'purchaseAmount',
            align: 'center',
            width: 120
        },
        {
            key: 'purchaseOrderStatus',
            title: '采购订单状态',
            dataIndex: 'purchaseOrderStatus',
            align: 'center',
            width: 120
        },
        {
            key: 'purchaseOrderPayStatus',
            title: '采购支付状态',
            dataIndex: 'purchaseOrderPayStatus',
            align: 'center',
            width: 120
        },
        {
            key: 'purchaseOrderShippingStatus',
            title: '采购物流状态',
            dataIndex: 'purchaseOrderShippingStatus',
            align: 'center',
            width: 120
        },
        {
            key: 'comment',
            title: '备注',
            dataIndex: 'comment',
            align: 'center',
            width: 200,
            render: (value: string, row: IOrderItem) => {
                return {
                    children: <TextArea autoSize={true} defaultValue={value}/>,
                    props: {
                        rowSpan: row._rowspan || 0,
                    },
                }
            }
        },
    ]

    constructor(props: IProps) {
        super(props);
    }

    // 合并单元格
    private mergeCell(value: string | number, row: IOrderItem) {
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
                rowKey="middleground_order_id"
                className="order-table"
                loading={loading}
                columns={this.columns}
                dataSource={orderList}
                scroll={{ x: true }}
                pagination={false}
                
            />
        )    
    }
}

export default TablePendingOrder;

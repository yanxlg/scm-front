import React from 'react';
import { Table, Input } from 'antd';

import { ColumnProps } from 'antd/es/table';
import { IPendingOrderItem, IStyleData, ICatagoryData } from './PanePendingOrder';
import { TableRowSelection } from 'antd/lib/table/interface';

import { formatDate } from '@/utils/date';

const { TextArea } = Input;

declare interface IProps {
    loading: boolean;
    orderList: IPendingOrderItem[];
    // changeSelectedRows(selectedRows: IOrderItem[]): void;
}

declare interface IState {

}

class TablePendingOrder extends React.PureComponent<IProps, IState> {

    columns: ColumnProps<IPendingOrderItem>[] = [
        {
            key: 'order_create_time',
            title: '订单时间',
            dataIndex: 'order_create_time',
            align: 'center',
            width: 120,
            render: (value: number) => {
                return formatDate(new Date(value * 1000), 'yyyy-MM-dd hh:mm:ss')
            }
        },
        {
            key: 'middleground_order_id',
            title: '中台订单ID',
            dataIndex: 'middleground_order_id',
            align: 'center',
            width: 120
        },
        {
            key: 'goods_img',
            title: '商品图片',
            dataIndex: 'goods_img',
            align: 'center',
            width: 140,
            render: (value: string) => {
                return (
                    <img style={{width: '100%'}} src={value}/>
                )
            }
        },
        {
            key: 'style',
            title: '商品信息',
            dataIndex: 'style',
            align: 'center',
            width: 120,
            render: (value: IStyleData) => {
                return (
                    <>
                        {
                            Object.keys(value).map(key => (
                                <div key={key}>{key}: {value[key]}</div>
                            ))
                        }
                    </>
                )
            }
        },
        {
            key: 'goods_num',
            title: '商品数量',
            dataIndex: 'goods_num',
            align: 'center',
            width: 120
        },
        {
            key: 'price',
            title: '商品价格',
            dataIndex: 'price',
            align: 'center',
            width: 120
        },
        {
            key: 'shipping_fee',
            title: '预估运费',
            dataIndex: 'shipping_fee',
            align: 'center',
            width: 120
        },
        {
            key: 'sale_price',
            title: '销售价',
            dataIndex: 'sale_price',
            align: 'center',
            width: 120
        },
        {
            key: 'sale_order_status',
            title: '销售订单状态',
            dataIndex: 'sale_order_status',
            align: 'center',
            width: 120
        },
        {
            key: 'purchase_order_status',
            title: '采购订单状态',
            dataIndex: 'purchase_order_status',
            align: 'center',
            width: 120
        },
        {
            key: 'commodity_id',
            title: '中台商品ID',
            dataIndex: 'commodity_id',
            align: 'center',
            width: 120,
        },
        {
            key: 'second_catagory',
            title: '中台二级分类',
            dataIndex: 'second_catagory',
            align: 'center',
            width: 120,
            render: (value: ICatagoryData) => {
                return value.name
            }
        },
        {
            key: 'sku_id',
            title: '中台sku id',
            dataIndex: 'sku_id',
            align: 'center',
            width: 120
        },
        {
            key: 'comment',
            title: '备注',
            dataIndex: 'comment',
            align: 'center',
            width: 200,
            render: (value: string) => {
                return <TextArea autoSize={true} defaultValue={value}/> 
            }
        }
    ]

    constructor(props: IProps) {
        super(props);
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
                scroll={{ x: true }}
                pagination={false}
                
            />
        )    
    }
}

export default TablePendingOrder;

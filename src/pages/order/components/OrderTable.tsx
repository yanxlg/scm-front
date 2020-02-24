import React from 'react';
import { Table, message, Button } from 'antd';
import GoodsDetailDialog from './GoodsDetailDialog';

import { ColumnProps } from 'antd/es/table';
import { CheckboxChangeEvent } from 'antd/es/checkbox';
import { IOrderItem } from '../index';
import { TableRowSelection } from 'antd/lib/table/interface';

import { 
    getOrderGoodsDetail
} from '@/services/order-manage';

// import { formatDate } from '@/utils/date';

declare interface IOrderTableProps {
    loading: boolean;
    orderList: IOrderItem[];
    allRowKeys: string[];
    selectedRowKeys: string[];
    activeOrderList: IOrderItem[];
    changeSelectedRowKeys(keys: string[]): void;
}

declare interface ISpecs {
    size?: string;
    color?: string;
}

export declare interface IGoodsDetail {
    channel_goods_id: string;
    psku: string;
    main_img: string;
    sku: string;
    sku_img: string;
    goods_name: string;
    specs: ISpecs;
}

declare interface IOrderTableState {
    indeterminate: boolean;
    checkAll: boolean;
    detailDialogStatus: boolean;
    goodsDetail: IGoodsDetail | null;
}

class OrderTable extends React.PureComponent<IOrderTableProps, IOrderTableState> {
    constructor(props: IOrderTableProps) {
        super(props);
        this.state = {
            indeterminate: false,
            checkAll: false,
            detailDialogStatus: false,
            goodsDetail: null
        };
    }

    private columns: ColumnProps<IOrderItem>[] = [
        // {
        //     key: 'x',
        //     title: () => (
        //         <Checkbox
        //             indeterminate={this.state.indeterminate}
        //             checked={this.state.checkAll}
        //             onChange={this.onCheckAllChange}
        //         />
        //     ),
        //     // dataIndex: 'a1',
        //     align: 'center',
        //     width: 60,
        //     render: (value: string, row: IOrderItem) => {
        //         const { selectedRowKeys } = this.props;
        //         const { middleground_order_id } = row;
        //         return (
        //             <Checkbox
        //                 checked={selectedRowKeys.indexOf(middleground_order_id) > -1}
        //                 onChange={() => this.selectedRow(middleground_order_id)}
        //             />
        //         )
        //     },
        // },
        {
            key: 'order_confirm_time',
            title: '订单确认时间',
            dataIndex: 'order_confirm_time',
            align: 'center',
            width: 120
        },
        {
            key: 'middleground_order_id',
            title: '中台订单ID',
            dataIndex: 'middleground_order_id',
            align: 'center',
            width: 120
        },
        {
            key: 'channel_order_id',
            title: '渠道订单ID',
            dataIndex: 'channel_order_id',
            align: 'center',
            width: 120
        },
        {
            key: 'commodity_id',
            title: '中台商品ID',
            dataIndex: 'commodity_id',
            align: 'center',
            width: 120
        },
        {
            key: 'detail',
            title: '商品详情',
            // dataIndex: 'goods_detatil',
            align: 'center',
            width: 120,
            render: (value: any, row: IOrderItem) => {
                return <Button type="link" onClick={() => this.getOrderGoodsDetail(row.middleground_order_id)}>查看商品详情</Button>
            }
        },

        {
            key: 'channel_goods_price',
            title: '价格',
            dataIndex: 'channel_goods_price',
            align: 'center',
            width: 120
        },
        {
            key: 'channel_shipping_fee',
            title: '运费',
            dataIndex: 'channel_shipping_fee',
            align: 'center',
            width: 120
            
        },
        {
            key: 'goods_number',
            title: '商品数量',
            dataIndex: 'goods_number',
            align: 'center',
            width: 120
        },
        {
            key: 'order_price',
            title: '商品总金额',
            dataIndex: 'order_price',
            align: 'center',
            width: 120
        },
        {
            key: 'currency_type',
            title: '货币类型',
            dataIndex: 'currency_type',
            align: 'center',
            width: 120,
        },
        {
            key: 'address',
            title: '地址',
            dataIndex: 'address',
            align: 'center',
            width: 120
        },
        {
            key: 'remain_delivery_time',
            title: '发货时间',
            dataIndex: 'remain_delivery_time',
            align: 'center',
            width: 120
        },
        {
            key: 'cancel_order_time',
            title: '取消订单时间',
            dataIndex: 'cancel_order_time',
            align: 'center',
            width: 120
        },
        {
            key: 'channel_store_name',
            title: '店铺名',
            dataIndex: 'channel_store_name',
            align: 'center',
            width: 120
        },
        {
            key: 'channel_order_status',
            title: '渠道订单状态',
            dataIndex: 'channel_order_status',
            align: 'center',
            width: 120
        },
        {
            key: 'channel_shipments_status',
            title: '渠道发货状态',
            dataIndex: 'channel_shipments_status',
            align: 'center',
            width: 120
        },
        {
            key: 'middleground_order_status',
            title: '中台订单状态',
            dataIndex: 'middleground_order_status',
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
            key: 'purchase_payment_status',
            title: '采购支付状态',
            dataIndex: 'purchase_payment_status',
            align: 'center',
            width: 120
        },
        {
            key: 'purchase_delivery_status',
            title: '采购配送状态',
            dataIndex: 'purchase_delivery_status',
            align: 'center',
            width: 120
        },
        {
            key: 'cancel_order',
            title: '取消订单',
            dataIndex: 'cancel_order',
            align: 'center',
            width: 120
        },
        {
            key: 'purchase_place_order_time',
            title: '采购下单时间',
            dataIndex: 'purchase_place_order_time',
            align: 'center',
            width: 120
        },
        {
            key: 'purchase_order_number',
            title: '采购订单号',
            dataIndex: 'purchase_order_number',
            align: 'center',
            width: 120
        },
        {
            key: 'purchase_porder_number',
            title: '采购父订单号',
            dataIndex: 'purchase_porder_number',
            align: 'center',
            width: 120
        },
        {
            key: 'purchase_waybill_number',
            title: '采购运单号',
            dataIndex: 'purchase_waybill_number',
            align: 'center',
            width: 120
        },
        {
            key: 'operation',
            title: '操作',
            // dataIndex: '',
            align: 'center',
            width: 120
        },
    ];

    // 取消全选
    cancelCheckAll = () => {
        this.setState({
            indeterminate: false,
            checkAll: false,
        });
    };

    // 点击全选
    private onCheckAllChange = (e: CheckboxChangeEvent) => {
        const checked = e.target.checked;
        const { allRowKeys, changeSelectedRowKeys } = this.props;
        this.setState({
            indeterminate: false,
            checkAll: checked,
        });
        changeSelectedRowKeys(checked ? [...allRowKeys] : []);
    };

    // 选择订单行
    private selectedRow = (id: string) => {
        const { selectedRowKeys, allRowKeys, changeSelectedRowKeys } = this.props;
        const copySelectedRowKeys = [...selectedRowKeys];
        const index = copySelectedRowKeys.indexOf(id);
        if (index === -1) {
            copySelectedRowKeys.push(id);
        } else {
            copySelectedRowKeys.splice(index, 1);
        }
        const len = copySelectedRowKeys.length;
        this.setState({
            indeterminate: len > 0 && len !== allRowKeys.length,
            checkAll: len === allRowKeys.length,
        });
        changeSelectedRowKeys(copySelectedRowKeys);
    };

    // 获取商品详情
    private getOrderGoodsDetail = (middleground_order_id: string) => {
        this.setState({
            detailDialogStatus: true
        })
        getOrderGoodsDetail({
            middleground_order_id
        }).then(res => {
            // console.log('getOrderGoodsDetail', res);
            this.setState({
                goodsDetail: res.data
            })
        }).catch(err => {
            message.error(err.message);
        })
    }

    hideGoodsDetailDialog = () => {
        this.setState({
            detailDialogStatus: false,
            goodsDetail: null
        })
    }

    render() {
        const { orderList, loading } = this.props;
        const { detailDialogStatus, goodsDetail } = this.state;
        const rowSelection: TableRowSelection<IOrderItem>  = {
            // onChange: (selectedRowKeys, selectedRows) => {
            //     console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
            // },
            onSelect: (record, selected, selectedRows) => {
                // console.log(record, selected, selectedRows);
            },
            // onSelectAll: (selected, selectedRows, changeRows) => {
            //     console.log(selected, selectedRows, changeRows);
            // },
        };
        return (
            <>
                <Table
                    bordered={true}
                    rowKey="middleground_order_id"
                    className="order-table"
                    columns={this.columns}
                    rowSelection={rowSelection}
                    dataSource={orderList}
                    scroll={{ x: true }}
                    pagination={false}
                    loading={loading}
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

export default OrderTable;

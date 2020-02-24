import React, { RefObject } from 'react';
import { Button, message } from 'antd';

import OrderFilter from './components/OrderFilter';
import OrderTable from './components/OrderTable';

import {
    getProductOrderList,
    IFilterBaseParams,
    IFilterParams
} from '@/services/order-manage';

import "@/styles/order.less";
import { OrderPayListModal } from '@/pages/order/components/OrderPayListModal';

export declare interface IOrderItem {
    order_confirm_time: string;
    middleground_order_id: string;
    channel_order_id: string;
    commodity_id: string;
    goods_detatil: string; // ?
    channel_goods_price: string;
    channel_shipping_fee: string;
    goods_number: string;
    order_price: string;
    currency_type: string;
    address: string;
    remain_delivery_time: string;
    cancel_order_time: string;
    channel_store_name: string;
    channel_order_status: string;
    channel_shipments_status: string;
    middleground_order_status: string;
    purchase_order_status: string;
    purchase_payment_status: string;
    purchase_delivery_status: string;
    cancel_order: string;
    purchase_place_order_time: string;
    purchase_order_number: string;
    purchase_porder_number: string;
    purchase_waybill_number: string;
}

declare interface IOrderState {
    loading: boolean;
    editing: boolean;
    page: number;
    pageNumber: number;
    total: number;
    orderList: IOrderItem[];
    allRowKeys: string[];
    selectedRowKeys: string[];
    activeOrderList: IOrderItem[];
}

class Order extends React.PureComponent<{}, IOrderState> {

    private orderFilterRef: RefObject<OrderFilter> = React.createRef();

    constructor(props: {}) {
        super(props);
        this.state = {
            loading: false,
            editing: false,
            page: 1,
            pageNumber: 30,
            total: 0,
            orderList: [],
            allRowKeys: [],
            selectedRowKeys: [],
            activeOrderList: []
        };
    }

    componentDidMount() {
        this.onSearch();
    }

    onSearch = (baseParams?: IFilterBaseParams) => {
        const { page, pageNumber } = this.state;
        let params: IFilterParams = {
            page,
            page_number: pageNumber
        }
        if (this.orderFilterRef.current) {
            // console.log('onSearch', this.orderFilterRef.current.getValues());
            params = Object.assign(params, this.orderFilterRef.current.getValues());
        }
        if (baseParams) {
            params = Object.assign(params, baseParams);
        }
        this.setState({
            loading: true
        })
        getProductOrderList(params).then(res => {
            // console.log('getProductOrderList', res);
            const { total, list } = res.data;
            this.setState({
                total,
                page: params.page,
                pageNumber: params.page_number,
                orderList: list,
                allRowKeys: list.map((item: IOrderItem) => item.middleground_order_id)
            })
        }).catch(err => {

        }).finally(() => {
            this.setState({
                loading: false
            })
        })
    }

    // 设置当前选中的行
    changeSelectedRowKeys = (selectedRowKeys: string[]) => {
        this.setState({
            selectedRowKeys
        })
    }

    // 点击编辑
    handleClickEdit = () => {
        const { editing, selectedRowKeys, orderList } = this.state;
        if (!selectedRowKeys.length) {
            return message.info('请选择需要编辑的订单');
        }
        this.setState({
            editing: true,
            activeOrderList: orderList.filter(item => selectedRowKeys.indexOf(item.middleground_order_id) > -1)
        })
    }

    // 取消编辑
    cancelEdit = () => {
        this.setState({
            editing: false,
            selectedRowKeys: [],
            activeOrderList: []
        })
    }

    // 保存编辑
    saveEdit = () => {
        // console.log('saveEdit');
    }

    render() {

        const {
            loading,
            editing,
            orderList,
            allRowKeys,
            selectedRowKeys,
            activeOrderList
        } = this.state;

        return (
            <div className="order-wrap">
                <OrderFilter
                    ref={this.orderFilterRef}
                />
                <div className="order-operation">
                    <Button
                        type="primary"
                        className="order-btn"
                        loading={loading}
                        onClick={() => this.onSearch()}
                    >查询</Button>
                    <Button
                        type="primary"
                        className="order-btn"
                    >一键拍单</Button>
                    {
                        editing ? (
                            <>
                                <Button
                                    size="small"
                                    className="order-btn"
                                    onClick={this.cancelEdit}
                                >取消</Button>
                                <Button
                                    size="small"
                                    type="primary"
                                    className="order-btn"
                                    onClick={this.saveEdit}
                                >保存</Button>
                            </>
                        ) : (
                            <Button
                                type="primary"
                                className="order-btn"
                                onClick={this.handleClickEdit}
                            >编辑</Button>
                        )
                    }
                    <Button className="order-btn">导出Excel</Button>
                </div>
                <OrderTable
                    loading={loading}
                    orderList={orderList}
                    allRowKeys={allRowKeys}
                    selectedRowKeys={selectedRowKeys}
                    activeOrderList={activeOrderList}
                    changeSelectedRowKeys={this.changeSelectedRowKeys}
                />
                <OrderPayListModal/>
            </div>
        )
    }
}

export default Order;

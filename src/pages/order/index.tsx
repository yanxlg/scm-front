import React, { RefObject } from 'react';
import { Button, Tabs, message } from 'antd';

import OrderFilter from './components/OrderFilter';
import OrderTable from './components/OrderTable';
import PaneAll from './components/PaneAll';

import { 
    getProductOrderList,
    IFilterBaseParams,
    IFilterParams
} from '@/services/order-manage';

import "@/styles/order.less";

const { TabPane } = Tabs;

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
    page: number;
    pageNumber: number;
    total: number;
    orderList: IOrderItem[];
    selectedRows: IOrderItem[];
}

class Order extends React.PureComponent<{}, IOrderState> {

    private orderFilterRef: RefObject<OrderFilter> = React.createRef();

    constructor(props: {}) {
        super(props);
        this.state = {
            loading: false,
            page: 1,
            pageNumber: 30,
            total: 0,
            orderList: [],
            selectedRows: []
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
        // console.log('getValues', this.orderFilterRef.current!.getValues());
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
                orderList: list
            })
        }).finally(() => {
            this.setState({
                loading: false
            })
        })
    }

    // 改变选择的行
    changeSelectedRows = (selectedRows: IOrderItem[]) => {
        this.setState({
            selectedRows
        })
    }

    // 拍单
    placeOrder = () => {
        const { selectedRows } = this.state;
        // console.log('selectedRows', selectedRows);
    }

    // 改变tab  
    selectedTab = (key: string) => {
        // console.log('selectedTab', key);
    }

    render() {

        const { 
            loading,
            orderList         
        } = this.state;

        return ( 
            <div className="order-wrap">
                <Tabs onChange={this.selectedTab} type="card">
                    <TabPane tab={`全部（1000）`} key="1">
                        <PaneAll />
                    </TabPane>
                    <TabPane tab={`待拍单（1000）`} key="2">
                        待拍单
                    </TabPane>
                    <TabPane tab={`待支付（1000）`} key="3">
                        待支付
                    </TabPane>
                    <TabPane tab={`待发货（1000）`} key="4">
                        待发货
                    </TabPane>
                    <TabPane tab={`采购未发货（1000）`} key="5">
                        采购未发货
                    </TabPane>
                    <TabPane tab={`仓库未发货（1000）`} key="6">
                        仓库未发货
                    </TabPane>
                    <TabPane tab={`异常订单（1000）`} key="7">
                        异常订单
                    </TabPane>
                </Tabs>
                {/* <OrderFilter 
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
                        onClick={this.placeOrder}
                    >一键拍单</Button>
                    <Button 
                        type="primary" 
                        className="order-btn"
                    >支付</Button>
                    <Button className="order-btn">导出Excel</Button>
                </div>
                <OrderTable
                    loading={loading}
                    orderList={orderList}
                    changeSelectedRows={this.changeSelectedRows}
                /> */}
            </div>
        )
    }
}

export default Order;

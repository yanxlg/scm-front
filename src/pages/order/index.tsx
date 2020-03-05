import React, { RefObject } from 'react';
import { Button, Tabs, message } from 'antd';

import OrderFilter from './components/OrderFilter';
import OrderTable from './components/OrderTable_del';
import PaneAll from './components/PaneAll';
import PanePendingOrder from './components/PanePendingOrder';
import PanePay from './components/PanePay';
import PaneWaitShip from './components/PaneWaitShip';
import PaneError from './components/PaneError';
import PaneNotStock from './components/PaneNotStock';
import PaneStockNotShip from './components/PaneStockNotShip';

// import { getProductOrderList, IFilterBaseParams, IFilterParams } from '@/services/order-manage';

import '@/styles/order.less';

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
   
}

class Order extends React.PureComponent<{}, IOrderState> {
    private orderFilterRef: RefObject<OrderFilter> = React.createRef();

    constructor(props: {}) {
        super(props);
    }

    componentDidMount() {
        // this.onSearch();
    }

    // 改变tab
    selectedTab = (key: string) => {
        // console.log('selectedTab', key);
    };

    render() {
        return (
            <div className="order-wrap">
                <Tabs onChange={this.selectedTab} type="card" defaultActiveKey="7">
                    <TabPane tab={`全部（1000）`} key="1">
                        <PaneAll />
                    </TabPane>
                    {/* <TabPane tab={`待拍单（1000）`} key="2">
                        <PanePendingOrder />
                    </TabPane> */}
                    <TabPane tab={`待支付（1000）`} key="3">
                        <PanePay />
                    </TabPane>
                    {/* <TabPane tab={`待发货（1000）`} key="4">
                        <PaneWaitShip />
                    </TabPane>
                    <TabPane tab={`采购未发货（1000）`} key="5">
                        <PaneNotStock />
                    </TabPane>
                    <TabPane tab={`仓库未发货（1000）`} key="6">
                        <PaneStockNotShip />
                    </TabPane> */}
                    <TabPane tab={`异常订单（1000）`} key="7">
                        <PaneError/>
                    </TabPane>
                </Tabs>
            </div>
        );
    }
}

export default Order;

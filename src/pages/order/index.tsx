import React from 'react';
import { Tabs } from 'antd';
import PaneAll from './components/PaneAll';
import PanePendingOrder from './components/PanePendingOrder';
import PanePay from './components/PanePay';
import PaneWaitShip from './components/PaneWaitShip';
import PaneError from './components/PaneError';
import PaneNotStock from './components/PaneNotStock';
import PaneStockNotShip from './components/PaneStockNotShip';
import Container from '@/components/Container';

import { getAllTabCount } from '@/services/order-manage';

import '@/styles/order.less';

const { TabPane } = Tabs;

declare interface IOrderState {
    allListCount: number;
    penddingOrderCount: number;
    penddingPayCount: number;
    penddingShipingOrderCount: number;
    penddingPurchaseListCount: number;
    penddingWarehousingListCount: number;
    errorOrderCount: number;
}

class Order extends React.PureComponent<{}, IOrderState> {
    private type: number = 2;
    constructor(props: {}) {
        super(props);
        this.state = {
            allListCount: 0,
            penddingOrderCount: 0,
            penddingPayCount: 0,
            penddingShipingOrderCount: 0,
            penddingPurchaseListCount: 0,
            penddingWarehousingListCount: 0,
            errorOrderCount: 0,
        };
    }

    componentDidMount() {
        // this.onSearch();
        this.getAllTabCount();
    }

    getAllTabCount = (type?: number) => {
        const _type: number = typeof type === 'number' ? type : this.type;
        getAllTabCount(_type).then(res => {
            this.setState({
                ...res.data,
            });
        });
    };

    // 改变tab
    selectedTab = (key: string) => {
        // console.log('selectedTab', key);
    };

    render() {
        // errorOrderCount
        const { 
            allListCount, 
            penddingOrderCount, 
            penddingPayCount, 
            penddingShipingOrderCount,
            penddingPurchaseListCount,
            penddingWarehousingListCount
        } = this.state;
        return (
            <Container>
                <div className="order-wrap">
                    <Tabs onChange={this.selectedTab} type="card" defaultActiveKey="6">
                        <TabPane tab={`全部（${allListCount}）`} key="1">
                            <PaneAll getAllTabCount={this.getAllTabCount} />
                        </TabPane>
                        <TabPane tab={`待拍单（${penddingOrderCount}）`} key="2">
                            <PanePendingOrder getAllTabCount={this.getAllTabCount} />
                        </TabPane>
                        <TabPane tab={`待支付（${penddingPayCount}）`} key="3">
                            <PanePay  getAllTabCount={this.getAllTabCount} />
                        </TabPane>
                        <TabPane tab={`待发货（${penddingShipingOrderCount}）`} key="4">
                            <div className="order-tab-content">
                                <PaneWaitShip getAllTabCount={this.getAllTabCount} />
                            </div>
                        </TabPane>
                        <TabPane tab={`已采购未入库（${penddingPurchaseListCount}）`} key="5">
                            <div className="order-tab-content">
                                <PaneNotStock getAllTabCount={this.getAllTabCount} />
                            </div>
                        </TabPane>
                        <TabPane tab={`仓库未发货（${penddingWarehousingListCount}）`} key="6">
                            <div className="order-tab-content">
                                <PaneStockNotShip getAllTabCount={this.getAllTabCount} />
                            </div>
                        </TabPane>
                        <TabPane tab={`异常订单`} key="7">
                            <PaneError />
                        </TabPane>
                    </Tabs>
                </div>
            </Container>
        );
    }
}

export default Order;

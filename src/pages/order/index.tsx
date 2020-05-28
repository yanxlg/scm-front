import React from 'react';
import { Tabs } from 'antd';
import PaneAll from './components/PaneAll';
import PanePendingOrder from './components/PanePendingOrder';
import PanePay from './components/PanePay';
import PaneWaitShip from './components/PaneWaitShip';
import PaneError from './components/PaneError';
import PaneNotWarehouse from './components/PaneNotWarehouse';
import PaneWarehouseNotShip from './components/PaneWarehouseNotShip';
import Container from '@/components/Container';
import PanePendingReview from './components/PanePendingReview';

import { getAllTabCount } from '@/services/order-manage';

import '@/styles/order.less';

const { TabPane } = Tabs;

interface IProps {
    location: any;
}

declare interface IOrderState {
    allListCount: number;
    penddingOrderCount: number;
    penddingPayCount: number;
    penddingShipingOrderCount: number;
    penddingPurchaseListCount: number;
    penddingWarehousingListCount: number;
    errorOrderCount: number;
    penddingCheckListCount: number;
}

class Order extends React.PureComponent<IProps, IOrderState> {
    private type: number = 2;
    private defaultActiveKey: string = '1';
    constructor(props: IProps) {
        super(props);
        this.state = {
            allListCount: 0,
            penddingOrderCount: 0,
            penddingPayCount: 0,
            penddingShipingOrderCount: 0,
            penddingPurchaseListCount: 0,
            penddingWarehousingListCount: 0,
            errorOrderCount: 0,
            penddingCheckListCount: 0,
        };
        // console.log(11111, this.props);
        this.defaultActiveKey = this.props.location?.query?.type || '2';
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
            penddingWarehousingListCount,
            penddingCheckListCount,
        } = this.state;
        return (
            <Container>
                <div className="order-wrap">
                    <Tabs
                        onChange={this.selectedTab}
                        type="card"
                        defaultActiveKey={this.defaultActiveKey}
                    >
                        <TabPane tab={`全部（${allListCount}）`} key="1">
                            <div className="order-tab-content">
                                <PaneAll getAllTabCount={this.getAllTabCount} />
                            </div>
                        </TabPane>
                        <TabPane tab={`待审核（${penddingCheckListCount}）`} key="8">
                            <div className="order-tab-content">
                                <PanePendingReview getAllTabCount={this.getAllTabCount} />
                            </div>
                        </TabPane>
                        <TabPane tab={`拍单中（${penddingOrderCount}）`} key="2">
                            <div className="order-tab-content">
                                <PanePendingOrder getAllTabCount={this.getAllTabCount} />
                            </div>
                        </TabPane>
                        <TabPane tab={`待支付（${penddingPayCount}）`} key="3">
                            <div className="order-tab-content">
                                <PanePay getAllTabCount={this.getAllTabCount} />
                            </div>
                        </TabPane>
                        <TabPane tab={`待发货（${penddingShipingOrderCount}）`} key="4">
                            <div className="order-tab-content">
                                <PaneWaitShip getAllTabCount={this.getAllTabCount} />
                            </div>
                        </TabPane>
                        <TabPane tab={`已采购未入库（${penddingPurchaseListCount}）`} key="5">
                            <div className="order-tab-content">
                                <PaneNotWarehouse getAllTabCount={this.getAllTabCount} />
                            </div>
                        </TabPane>
                        <TabPane tab={`仓库未发货（${penddingWarehousingListCount}）`} key="6">
                            <div className="order-tab-content">
                                <PaneWarehouseNotShip getAllTabCount={this.getAllTabCount} />
                            </div>
                        </TabPane>
                        <TabPane tab={`异常订单`} key="7">
                            <div className="order-tab-content">
                                <PaneError />
                            </div>
                        </TabPane>
                    </Tabs>
                </div>
            </Container>
        );
    }
}

export default Order;

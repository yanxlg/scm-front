import React from 'react';
import { Tabs } from 'antd';
import PanePendingOrder from './components/PanePendingOrder';
import PaneError from './components/PaneError';
import PaddingInStore from './components/PaddingInStore';
import PaneWarehouseNotShip from './components/PaneWarehouseNotShip';
import Container from '@/components/Container';
import PanePendingReview from './components/PanePendingReview';

import { getAllTabCount } from '@/services/order-manage';

import '@/styles/order.less';
import PendingSign from '@/pages/order/components/PendingSign';
import PendingPay from '@/pages/order/components/PendingPay';
import PendingShip from './components/PendingShip';
import AllOrder from '@/pages/order/components/AllOrder';

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
    penddingSignListCount: number;
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
            penddingSignListCount: 0,
        };
        // console.log(11111, this.props);
        this.defaultActiveKey = this.props.location?.query?.type || '1';
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
            penddingSignListCount,
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
                                <AllOrder updateCount={this.getAllTabCount} />
                            </div>
                        </TabPane>
                        <TabPane tab={`待审核（${penddingCheckListCount}）`} key="8">
                            <div className="order-tab-content">
                                <PanePendingReview getAllTabCount={this.getAllTabCount} />
                            </div>
                        </TabPane>
                        <TabPane tab={`待拍单（${penddingOrderCount}）`} key="2">
                            <div className="order-tab-content">
                                <PanePendingOrder getAllTabCount={this.getAllTabCount} />
                            </div>
                        </TabPane>
                        <TabPane tab={`待支付（${penddingPayCount}）`} key="3">
                            <div className="order-tab-content">
                                <PendingPay updateCount={this.getAllTabCount} />
                            </div>
                        </TabPane>
                        <TabPane tab={`待发货（${penddingShipingOrderCount}）`} key="4">
                            <div className="order-tab-content">
                                <PendingShip updateCount={this.getAllTabCount} />
                            </div>
                        </TabPane>
                        <TabPane tab={`待签收（${penddingSignListCount}）`} key="9">
                            <div className="order-tab-content">
                                <PendingSign updateCount={this.getAllTabCount} />
                            </div>
                        </TabPane>
                        <TabPane tab={`待入库（${penddingPurchaseListCount}）`} key="5">
                            <div className="order-tab-content">
                                <PaddingInStore updateCount={this.getAllTabCount} />
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

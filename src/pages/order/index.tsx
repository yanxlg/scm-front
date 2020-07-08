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
import { Permission, PermissionComponent } from 'rc-permission';
import ForbiddenComponent from '@/components/ForbiddenComponent';

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

@Permission({ pid: 'order', login: true, router: true })
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
        this.defaultActiveKey = this.props.location?.query?.type || '3';
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
                                <PermissionComponent
                                    pid="order/all"
                                    fallback={() => <ForbiddenComponent />}
                                >
                                    <AllOrder updateCount={this.getAllTabCount} />
                                </PermissionComponent>
                            </div>
                        </TabPane>
                        <TabPane tab={`待审核（${penddingCheckListCount}）`} key="8">
                            <div className="order-tab-content">
                                <PermissionComponent
                                    pid="order/pending_review"
                                    fallback={() => <ForbiddenComponent />}
                                >
                                    <PanePendingReview getAllTabCount={this.getAllTabCount} />
                                </PermissionComponent>
                            </div>
                        </TabPane>
                        <TabPane tab={`待拍单（${penddingOrderCount}）`} key="2">
                            <div className="order-tab-content">
                                <PermissionComponent
                                    pid="order/pending_order"
                                    fallback={() => <ForbiddenComponent />}
                                >
                                    <PanePendingOrder getAllTabCount={this.getAllTabCount} />
                                </PermissionComponent>
                            </div>
                        </TabPane>
                        <TabPane tab={`待支付（${penddingPayCount}）`} key="3">
                            <div className="order-tab-content">
                                <PermissionComponent
                                    pid="order/pending_pay"
                                    fallback={() => <ForbiddenComponent />}
                                >
                                    <PendingPay updateCount={this.getAllTabCount} />
                                </PermissionComponent>
                            </div>
                        </TabPane>
                        <TabPane tab={`待发货（${penddingShipingOrderCount}）`} key="4">
                            <div className="order-tab-content">
                                <PermissionComponent
                                    pid="order/pending_ship"
                                    fallback={() => <ForbiddenComponent />}
                                >
                                    <PendingShip updateCount={this.getAllTabCount} />
                                </PermissionComponent>
                            </div>
                        </TabPane>
                        <TabPane tab={`待签收（${penddingSignListCount}）`} key="9">
                            <div className="order-tab-content">
                                <PermissionComponent
                                    pid="order/pending_sign"
                                    fallback={() => <ForbiddenComponent />}
                                >
                                    <PendingSign updateCount={this.getAllTabCount} />
                                </PermissionComponent>
                            </div>
                        </TabPane>
                        <TabPane tab={`待入库（${penddingPurchaseListCount}）`} key="5">
                            <div className="order-tab-content">
                                <PermissionComponent
                                    pid="order/pending_in"
                                    fallback={() => <ForbiddenComponent />}
                                >
                                    <PaddingInStore updateCount={this.getAllTabCount} />
                                </PermissionComponent>
                            </div>
                        </TabPane>
                        <TabPane tab={`仓库未发货（${penddingWarehousingListCount}）`} key="6">
                            <div className="order-tab-content">
                                <PermissionComponent
                                    pid="order/no_ship"
                                    fallback={() => <ForbiddenComponent />}
                                >
                                    <PaneWarehouseNotShip getAllTabCount={this.getAllTabCount} />
                                </PermissionComponent>
                            </div>
                        </TabPane>
                        <TabPane tab={`异常订单`} key="7">
                            <div className="order-tab-content">
                                <PermissionComponent
                                    pid="order/error"
                                    fallback={() => <ForbiddenComponent />}
                                >
                                    <PaneError />
                                </PermissionComponent>
                            </div>
                        </TabPane>
                    </Tabs>
                </div>
            </Container>
        );
    }
}

export default Order;

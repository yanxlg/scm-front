import React from 'react';
import { Tabs } from 'antd';

import PaneAll from './components/PaneAll';
import PanePendingOrder from './components/PanePendingOrder';
import PanePay from './components/PanePay';
import PaneWaitShip from './components/PaneWaitShip';
import PaneError from './components/PaneError';
import PaneNotStock from './components/PaneNotStock';
import PaneStockNotShip from './components/PaneStockNotShip';

import { getAllTabCount } from '@/services/order-manage';

import '@/styles/order.less';

const { TabPane } = Tabs;

declare interface IOrderState {
    allListCount: number;
    penddingOrderCount: number;
    penddingPayCount: number;
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
        const { allListCount, penddingOrderCount, penddingPayCount } = this.state;
        return (
            <div className="order-wrap">
                <Tabs onChange={this.selectedTab} type="card" defaultActiveKey="2">
                    <TabPane tab={`全部（${allListCount}）`} key="1">
                        <PaneAll getAllTabCount={this.getAllTabCount} />
                    </TabPane>
                    <TabPane tab={`待拍单（${penddingOrderCount}）`} key="2">
                        <PanePendingOrder getAllTabCount={this.getAllTabCount} />
                    </TabPane>
                    <TabPane tab={`待支付（${penddingPayCount}）`} key="3">
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
                    <TabPane tab={`异常订单`} key="7">
                        <PaneError />
                    </TabPane>
                </Tabs>
            </div>
        );
    }
}

export default Order;

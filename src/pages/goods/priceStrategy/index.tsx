import React, { useCallback, useState } from 'react';
import { Tabs } from 'antd';
import Container from '@/components/Container';
import PaneSellPrice from './components/PaneSellPrice';
import PaneFreight from './components/PaneFreight';
import PaneFreightCalc from './components/PaneFreightCalc';
import PaneWeight from './components/PaneWeight';

import styles from './_index.less';
import { PermissionRouterWrap, PermissionComponent } from 'rc-permission';
import ForbiddenComponent from '@/components/ForbiddenComponent';

const { TabPane } = Tabs;

const PriceStrategyPage: React.FC = props => {
    const [key, setKey] = useState('');
    const onChange = useCallback(key => {
        // console.log('11111', key);
        setKey(key);
    }, []);

    return (
        <Container>
            <Tabs type="card" defaultActiveKey="1" onChange={onChange}>
                <TabPane tab="售价调整" key="1">
                    <div className={styles.paneContent}>
                        <PermissionComponent
                            pid="goods/price_strategy/sale"
                            fallback={() => <ForbiddenComponent />}
                        >
                            <PaneSellPrice />
                        </PermissionComponent>
                    </div>
                </TabPane>
                <TabPane tab="运费调整" key="2">
                    <div className={styles.paneContent}>
                        <PermissionComponent
                            pid="goods/price_strategy/shipping"
                            fallback={() => <ForbiddenComponent />}
                        >
                            <PaneFreight type={key} />
                        </PermissionComponent>
                    </div>
                </TabPane>
                <TabPane tab="运费价卡" key="3">
                    <div className={styles.paneContent}>
                        <PermissionComponent
                            pid="goods/price_strategy/shipping_card"
                            fallback={() => <ForbiddenComponent />}
                        >
                            <PaneFreightCalc />
                        </PermissionComponent>
                    </div>
                </TabPane>
                <TabPane tab="品类预估重量调整" key="4">
                    <div className={styles.paneContent}>
                        <PermissionComponent
                            pid="goods/price_strategy/weight"
                            fallback={() => <ForbiddenComponent />}
                        >
                            <PaneWeight />
                        </PermissionComponent>
                    </div>
                </TabPane>
            </Tabs>
        </Container>
    );
};

export default PermissionRouterWrap(React.memo(PriceStrategyPage), {
    login: true,
    pid: 'goods/price_strategy',
});

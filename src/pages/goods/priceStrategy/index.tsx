import React from 'react';
import { Tabs } from 'antd';
import Container from '@/components/Container';
import PaneSellPrice from './components/PaneSellPrice';
import PaneFreight from './components/PaneFreight';
import PaneFreightCalc from './components/PaneFreightCalc';
import PaneWeight from './components/PaneWeight';

import styles from './_index.less';

const { TabPane } = Tabs;

const PriceStrategyPage: React.FC = props => {
    return (
        <Container>
            <Tabs type="card" defaultActiveKey="4">
                <TabPane tab="售价调整" key="1">
                    <div className={styles.paneContent}>
                        <PaneSellPrice />
                    </div>
                </TabPane>
                <TabPane tab="运费调整" key="2">
                    <div className={styles.paneContent}>
                        <PaneFreight />
                    </div>
                </TabPane>
                <TabPane tab="运费价卡" key="3">
                    <div className={styles.paneContent}>
                        <PaneFreightCalc />
                    </div>
                </TabPane>
                <TabPane tab="品类预估重量调整" key="4">
                    <div className={styles.paneContent}>
                        <PaneWeight />
                    </div>
                </TabPane>
            </Tabs>
        </Container>
    );
};

export default React.memo(PriceStrategyPage);

import React from 'react';
import { Tabs } from 'antd';
import Container from '@/components/Container';
import PaneSellPrice from './components/PaneSellPrice';
import PaneFreight from './components/PaneFreight';

import styles from './_index.less';

const { TabPane } = Tabs;

const PriceStrategyPage: React.FC = props => {
    return (
        <Container>
            <Tabs type="card" defaultActiveKey="2">
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
                    Content of Tab Pane 3
                </TabPane>
                <TabPane tab="品类预估重量调整" key="4">
                    Content of Tab Pane 4
                </TabPane>
            </Tabs>
        </Container>
    );
};

export default React.memo(PriceStrategyPage);

import React, { useMemo } from 'react';
import { Tabs } from 'antd';
import Container from '@/components/Container';
import GoodsInfo from './components/GoodsInfo';
import { RouteComponentProps } from 'react-router';
import useReleasedGoods from './hooks/useReleasedGoods';
import CurrentPane from './components/CurrentPane';
import HistoryPane from './components/HistoryPane';

import styles from './_version.less';

const { TabPane } = Tabs;

const Version: React.FC<RouteComponentProps<{ id: string }>> = ({
    match
}) => {
    const commodityId = match.params.id;
    const { releasedGoods, getReleasedGoodsInfo } = useReleasedGoods(commodityId);
    
    // const [] = useState();

    return useMemo(() => {
        return (
            <Container>
                <GoodsInfo releasedGoods={releasedGoods}/>
                <Tabs defaultActiveKey="1" type="card" className={styles.tabs}>
                    <TabPane tab="当前最新版本" key="1">
                        <CurrentPane commodityId={commodityId}/>
                    </TabPane>
                    <TabPane tab="历史应用版本" key="2">
                        <HistoryPane commodityId={commodityId}/>
                    </TabPane>
                </Tabs>
            </Container>
        )
    }, [releasedGoods]);
}

export default Version;

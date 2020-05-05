import React, { useMemo, useEffect, useCallback, useState } from 'react';
import { Tabs } from 'antd';
import Container from '@/components/Container';
import PaneAbnormalAll from './components/PaneAbnormalAll';
import PaneAbnormalPending from './components/PaneAbnormalPending';
import PaneAbnormalProcessing from './components/PaneAbnormalProcessing';
import PaneAbnormalEnd from './components/PaneAbnormalEnd';
import { getExceptionCount } from '@/services/purchase';

const { TabPane } = Tabs;

const Purchase: React.FC = props => {
    const [countInfo, setCountInfo] = useState({
        penddingCount: 0,
        allPenddingCount: 0,
        execingCount: 0,
        allExecingCount: 0,
    });

    const _getExceptionCount = useCallback(() => {
        getExceptionCount().then(res => {
            // console.log('getExceptionCount', res);
            const {
                all_pendding_count: allPenddingCount,
                more_time_pendding_count: penddingCount,
                all_execing_count: allExecingCount,
                more_time_execing_count: execingCount,
            } = res.data;
            setCountInfo({
                penddingCount,
                allPenddingCount,
                execingCount,
                allExecingCount,
            });
        });
    }, []);

    useEffect(() => {
        _getExceptionCount();
    }, []);

    return useMemo(() => {
        const { penddingCount, allPenddingCount, execingCount, allExecingCount } = countInfo;
        return (
            <Container>
                <Tabs defaultActiveKey="1" type="card">
                    <TabPane tab="全部" key="1">
                        <PaneAbnormalAll
                            getExceptionCount={getExceptionCount}
                        />
                    </TabPane>
                    <TabPane tab={`待处理（${allPenddingCount}）`} key="2">
                        <PaneAbnormalPending penddingCount={penddingCount} getExceptionCount={getExceptionCount}/>
                    </TabPane>
                    <TabPane tab={`处理中（${allExecingCount}）`} key="3">
                        <PaneAbnormalProcessing execingCount={execingCount} />
                    </TabPane>
                    <TabPane tab="已完结" key="4">
                        <PaneAbnormalEnd />
                    </TabPane>
                </Tabs>
            </Container>
        );
    }, [countInfo]);
};

export default Purchase;

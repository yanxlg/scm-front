import React, { useMemo, useEffect, useCallback, useState } from 'react';
import { Tabs } from 'antd';
import Container from '@/components/Container';
import PaneAbnormalAll from './components/abnormal/PaneAbnormalAll';
import PaneAbnormalWaitProcess from './components/abnormal/PaneAbnormalWaitProcess';
import PaneAbnormalProcessing from './components/abnormal/PaneAbnormalProcessing';
import PaneAbnormalEnd from './components/abnormal/PaneAbnormalEnd';
import { getExceptionCount, queryStrategyException } from '@/services/purchase';
import PaneAbnormalReview from './components/abnormal/PaneAbnormalReview';
import { IAbnormalContext } from '@/interface/IPurchase';

const { TabPane } = Tabs;

export const AbnormalContext = React.createContext<IAbnormalContext>({});

const Purchase: React.FC = props => {
    const [countInfo, setCountInfo] = useState({
        penddingCount: 0,
        allPenddingCount: 0,
        execingCount: 0,
        allExecingCount: 0,
    });
    const [context, setContext] = useState<IAbnormalContext>({});

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

    const _queryStrategyException = useCallback(() => {
        queryStrategyException().then(data => setContext(data));
    }, []);

    useEffect(() => {
        _getExceptionCount();
        _queryStrategyException();
    }, []);

    return useMemo(() => {
        const { penddingCount, allPenddingCount, execingCount, allExecingCount } = countInfo;
        return (
            <Container>
                <AbnormalContext.Provider value={context}>
                    <Tabs defaultActiveKey="4" type="card" className="tabs-margin-none">
                        <TabPane tab="全部" key="1">
                            <PaneAbnormalAll getExceptionCount={getExceptionCount} />
                        </TabPane>
                        <TabPane tab={`待审核（xxx）`} key="2">
                            <PaneAbnormalReview
                                penddingCount={penddingCount}
                                getExceptionCount={getExceptionCount}
                            />
                        </TabPane>
                        <TabPane tab={`待处理（${allPenddingCount}）`} key="3">
                            <PaneAbnormalWaitProcess
                                penddingCount={penddingCount}
                                getExceptionCount={getExceptionCount}
                            />
                        </TabPane>
                        <TabPane tab={`处理中（${allExecingCount}）`} key="4">
                            <PaneAbnormalProcessing execingCount={execingCount} />
                        </TabPane>
                        <TabPane tab="已完结" key="5">
                            <PaneAbnormalEnd />
                        </TabPane>
                    </Tabs>
                </AbnormalContext.Provider>
            </Container>
        );
    }, [countInfo, context]);
};

export default Purchase;

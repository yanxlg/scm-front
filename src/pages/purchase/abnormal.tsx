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
import { PermissionRouterWrap, PermissionComponent } from 'rc-permission';
import ForbiddenComponent from '@/components/ForbiddenComponent';

const { TabPane } = Tabs;

export const AbnormalContext = React.createContext<IAbnormalContext>({});

const Purchase: React.FC = props => {
    const [countInfo, setCountInfo] = useState({
        penddingCount: 0,
        allPenddingCount: 0,
        execingCount: 0,
        allExecingCount: 0,
        waitReviewTotal: 0,
    });
    const [context, setContext] = useState<IAbnormalContext>({});

    const _getExceptionCount = useCallback(() => {
        getExceptionCount().then(res => {
            const {
                all_pendding_count: allPenddingCount,
                more_time_pendding_count: penddingCount,
                all_execing_count: allExecingCount,
                more_time_execing_count: execingCount,
                wait_review_total: waitReviewTotal,
            } = res.data;
            setCountInfo({
                penddingCount,
                allPenddingCount,
                execingCount,
                allExecingCount,
                waitReviewTotal,
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
        const {
            penddingCount,
            allPenddingCount,
            execingCount,
            allExecingCount,
            waitReviewTotal,
        } = countInfo;
        return (
            <Container>
                <AbnormalContext.Provider value={context}>
                    <Tabs defaultActiveKey="1" type="card" className="tabs-margin-none">
                        <TabPane tab="全部" key="1">
                            <PermissionComponent
                                pid="purchase/abnormal/tab"
                                fallback={() => <ForbiddenComponent />}
                            >
                                <PaneAbnormalAll getExceptionCount={_getExceptionCount} />
                            </PermissionComponent>
                        </TabPane>
                        <TabPane tab={`待审核（${waitReviewTotal}）`} key="2">
                            <PermissionComponent
                                pid="purchase/abnormal/tab"
                                fallback={() => <ForbiddenComponent />}
                            >
                                <PaneAbnormalReview
                                    penddingCount={penddingCount}
                                    getExceptionCount={_getExceptionCount}
                                />
                            </PermissionComponent>
                        </TabPane>
                        <TabPane tab={`待处理（${allPenddingCount}）`} key="3">
                            <PermissionComponent
                                pid="purchase/abnormal/tab"
                                fallback={() => <ForbiddenComponent />}
                            >
                                <PaneAbnormalWaitProcess
                                    penddingCount={penddingCount}
                                    getExceptionCount={_getExceptionCount}
                                />
                            </PermissionComponent>
                        </TabPane>
                        <TabPane tab={`处理中（${allExecingCount}）`} key="4">
                            <PermissionComponent
                                pid="purchase/abnormal/tab"
                                fallback={() => <ForbiddenComponent />}
                            >
                                <PaneAbnormalProcessing
                                    execingCount={execingCount}
                                    getExceptionCount={_getExceptionCount}
                                />
                            </PermissionComponent>
                        </TabPane>
                        <TabPane tab="已完结" key="5">
                            <PermissionComponent
                                pid="purchase/abnormal/tab"
                                fallback={() => <ForbiddenComponent />}
                            >
                                <PaneAbnormalEnd />
                            </PermissionComponent>
                        </TabPane>
                    </Tabs>
                </AbnormalContext.Provider>
            </Container>
        );
    }, [countInfo, context]);
};

export default PermissionRouterWrap(Purchase, {
    login: true,
    pid: 'purchase/abnormal',
});

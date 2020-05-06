import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Container from '@/components/Container';
import { Tabs } from 'antd';
import AllList from '@/pages/purchase/components/list/all';
import PendingShipped from '@/pages/purchase/components/list/pendingShipped';
import PendingSigned from '@/pages/purchase/components/list/pendingSigned';
import PendingStorage from './components/list/pendingStorage';
import Warehousing from './components/list/warehousing';
import Over from './components/list/over';
import Return from './components/list/return';
import { IPurchaseStatics, IReturnStatics } from '@/interface/IPurchase';
import { queryPurchaseStatic, queryReturnStatic } from '@/services/purchase';
const TabPane = Tabs.TabPane;

const List = () => {
    const [statics, setStatics] = useState<IPurchaseStatics>({});
    const request = queryPurchaseStatic();

    const getStatics = useCallback(() => {
        request.request().then(({ data }) => {
            setStatics(data);
        });
    }, []);

    useEffect(() => {
        getStatics();
        return () => {
            request.cancel();
        };
    }, []);

    const getStaticsNumber = useCallback((num?: number) => {
        return num === void 0 ? '' : `（${num}）`;
    }, []);

    return useMemo(() => {
        const {
            all_total,
            finish_total,
            wait_in_total,
            wait_send_total,
            wait_recieve_total,
            some_in_total,
            purchase_refund_total,
        } = statics;
        return (
            <Container>
                <Tabs
                    className="tabs-margin-none"
                    defaultActiveKey="1"
                    type="card"
                    children={[
                        <TabPane tab={`全部${getStaticsNumber(all_total)}`} key="1">
                            <AllList />
                        </TabPane>,
                        <TabPane tab={`待发货${getStaticsNumber(wait_send_total)}`} key="2">
                            <PendingShipped />
                        </TabPane>,
                        <TabPane tab={`待签收${getStaticsNumber(wait_recieve_total)}`} key="3">
                            <PendingSigned />
                        </TabPane>,
                        <TabPane tab={`待入库${getStaticsNumber(wait_in_total)}`} key="4">
                            <PendingStorage />
                        </TabPane>,
                        <TabPane tab={`部分入库${getStaticsNumber(some_in_total)}`} key="5">
                            <Warehousing />
                        </TabPane>,
                        <TabPane tab={`已完结${getStaticsNumber(finish_total)}`} key="6">
                            <Over />
                        </TabPane>,
                        <TabPane tab={`采购退款${getStaticsNumber(purchase_refund_total)}`} key="7">
                            <Return />
                        </TabPane>,
                    ]}
                />
            </Container>
        );
    }, [statics]);
};

export default List;

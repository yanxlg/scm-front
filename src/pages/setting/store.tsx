import React, { useMemo } from 'react';
import Container from '@/components/Container';
import { Tabs } from 'antd';
import '@/styles/index.less';
import PriceStrategy from '@/pages/setting/store/PriceStrategy';
import ReplaceStoreOut from '@/pages/setting/store/ReplaceStoreOut';
import OfflinePurchase from '@/pages/setting/store/OfflinePurchase';
import { PermissionRouterWrap } from 'rc-permission';

const { TabPane } = Tabs;

const Store = () => {
    return useMemo(() => {
        return (
            <Container>
                <Tabs
                    defaultActiveKey="1"
                    className="tabs-margin-none"
                    type="card"
                    children={[
                        <TabPane tab="价格判断设置" key="1">
                            <PriceStrategy />
                        </TabPane>,
                        <TabPane tab="线下采购配置" key="2">
                            <OfflinePurchase />
                        </TabPane>,
                        <TabPane tab="替换出库配置" key="3">
                            <ReplaceStoreOut />
                        </TabPane>,
                    ]}
                />
            </Container>
        );
    }, []);
};
export default PermissionRouterWrap(Store, {
    login: true,
    pid: 'setting/store',
});

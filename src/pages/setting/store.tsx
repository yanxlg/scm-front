import React, { useMemo } from 'react';
import Container from '@/components/Container';
import { Tabs } from 'antd';
import '@/styles/index.less';
import PriceStrategy from '@/pages/setting/store/PriceStrategy';
import ReplaceStoreOut from '@/pages/setting/store/ReplaceStoreOut';
import OfflinePurchase from '@/pages/setting/store/OfflinePurchase';
import { PermissionRouterWrap, PermissionComponent } from 'rc-permission';
import ForbiddenComponent from '@/components/ForbiddenComponent';

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
                            <PermissionComponent
                                pid="setting/store/price"
                                fallback={() => <ForbiddenComponent />}
                            >
                                <PriceStrategy />
                            </PermissionComponent>
                        </TabPane>,
                        <TabPane tab="线下采购配置" key="2">
                            <PermissionComponent
                                pid="setting/store/offline"
                                fallback={() => <ForbiddenComponent />}
                            >
                                <OfflinePurchase />
                            </PermissionComponent>
                        </TabPane>,
                        <TabPane tab="替换出库配置" key="3">
                            <PermissionComponent
                                pid="setting/store/replace"
                                fallback={() => <ForbiddenComponent />}
                            >
                                <ReplaceStoreOut />
                            </PermissionComponent>
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

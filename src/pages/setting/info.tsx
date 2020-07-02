import React, { useMemo, useState } from 'react';
import Container from '@/components/Container';
import { Tabs } from 'antd';
import tabStyles from '@/styles/_tabs.less';
import EditTab from '@/pages/setting/components/info/EditTab';
import ListTab from '@/pages/setting/components/info/ListTab';
import { PermissionRouterWrap, PermissionComponent } from 'rc-permission';
import ForbiddenComponent from '@/components/ForbiddenComponent';

const { TabPane } = Tabs;

const CustomDeclarationInfoPage: React.FC = () => {
    const [activeKey, setActiveKey] = useState('1');
    return useMemo(() => {
        return (
            <Container>
                <Tabs
                    activeKey={activeKey}
                    className={tabStyles.tabs}
                    onChange={setActiveKey}
                    type="card"
                    children={[
                        <TabPane tab={'重量报关信息设置'} key="1">
                            <PermissionComponent
                                pid="setting/customs/setting"
                                fallback={() => <ForbiddenComponent />}
                            >
                                <EditTab />
                            </PermissionComponent>
                        </TabPane>,
                        <TabPane tab={'重量报关信息查看'} key="2">
                            <PermissionComponent
                                pid="setting/customs/list"
                                fallback={() => <ForbiddenComponent />}
                            >
                                <ListTab activeKey={activeKey} />
                            </PermissionComponent>
                        </TabPane>,
                    ]}
                />
            </Container>
        );
    }, [activeKey]);
};

export default PermissionRouterWrap(CustomDeclarationInfoPage, {
    login: true,
    pid: 'setting/customs',
});

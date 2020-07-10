import React, { useMemo } from 'react';
import { Tabs } from 'antd';
import Container from '@/components/Container';
import { Account } from './_accont';
import { Role } from './_role';
import { PermissionRouterWrap, PermissionComponent } from 'rc-permission';
import ForbiddenComponent from '@/components/ForbiddenComponent';

const { TabPane } = Tabs;

const Page = () => {
    return useMemo(() => {
        return (
            <Container>
                <Tabs
                    className="tabs-margin-none"
                    defaultActiveKey="1"
                    type="card"
                    children={[
                        <TabPane tab="账号列表" key="1">
                            <PermissionComponent
                                pid="setting/permission/user"
                                fallback={() => <ForbiddenComponent />}
                            >
                                <Account />
                            </PermissionComponent>
                        </TabPane>,
                        <TabPane tab="角色列表" key="2">
                            <PermissionComponent
                                pid="setting/permission/role"
                                fallback={() => <ForbiddenComponent />}
                            >
                                <Role />
                            </PermissionComponent>
                        </TabPane>,
                    ]}
                />
            </Container>
        );
    }, []);
};

export default PermissionRouterWrap(Page, {
    login: true,
    pid: 'setting/permission',
});

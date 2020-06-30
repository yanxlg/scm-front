import React, { useMemo } from 'react';
import { Tabs } from 'antd';
import Container from '@/components/Container';
import { Account } from './_accont';
import { Role } from './_role';
import { PermissionRouterWrap } from 'rc-permission';

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
                            <Account />
                        </TabPane>,
                        <TabPane tab="角色列表" key="2">
                            <Role />
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

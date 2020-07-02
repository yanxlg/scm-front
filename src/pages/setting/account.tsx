import React from 'react';
import CookieSetting from '@/pages/setting/components/account/CookieSetting';
import Container from '@/components/Container';
import { PermissionRouterWrap, PermissionComponent } from 'rc-permission';
import ForbiddenComponent from '@/components/ForbiddenComponent';

const AccountPage: React.FC = () => {
    return (
        <Container>
            <PermissionComponent pid="setting/account/list" fallback={() => <ForbiddenComponent />}>
                <CookieSetting />
            </PermissionComponent>
        </Container>
    );
};

export default PermissionRouterWrap(AccountPage, {
    login: true,
    pid: 'setting/account',
});

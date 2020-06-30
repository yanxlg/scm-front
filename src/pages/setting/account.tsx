import React from 'react';
import CookieSetting from '@/pages/setting/components/account/CookieSetting';
import Container from '@/components/Container';
import { PermissionRouterWrap } from 'rc-permission';

const AccountPage: React.FC = () => {
    return (
        <Container>
            <CookieSetting />
        </Container>
    );
};

export default PermissionRouterWrap(AccountPage, {
    login: true,
    pid: 'setting/account',
});

import React from 'react';
import CookieSetting from '@/pages/setting/components/account/CookieSetting';
import Container from '@/components/Container';

const AccountPage: React.FC = () => {
    return (
        <Container>
            <CookieSetting />
        </Container>
    );
};

export default AccountPage;

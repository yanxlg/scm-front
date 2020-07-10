import React from 'react';
import { Redirect } from 'react-router';
import '@/styles/index.less';

class Index extends React.PureComponent {
    render() {
        return <Redirect to="/dashboard/overview" />;
    }
}

export default Index;

import React, { useMemo } from 'react';
import Container from '@/components/Container';
import { Tabs } from 'antd';
import tabStyles from '@/styles/_tabs.less';
import EditTab from '@/pages/setting/components/info/EditTab';
import ListTab from '@/pages/setting/components/info/ListTab';

const { TabPane } = Tabs;

const CustomDeclarationInfoPage: React.FC = () => {
    return useMemo(() => {
        return (
            <Container>
                <Tabs
                    className={tabStyles.tabs}
                    type="card"
                    children={[
                        <TabPane tab={'重要报关信息设置'} key="1">
                            <EditTab />
                        </TabPane>,
                        <TabPane tab={'重要报关信息查看'} key="2">
                            <ListTab />
                        </TabPane>,
                    ]}
                />
            </Container>
        );
    }, []);
};

export default CustomDeclarationInfoPage;

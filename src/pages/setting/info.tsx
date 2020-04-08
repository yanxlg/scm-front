import React, { useMemo, useState } from 'react';
import Container from '@/components/Container';
import { Tabs } from 'antd';
import tabStyles from '@/styles/_tabs.less';
import EditTab from '@/pages/setting/components/info/EditTab';
import ListTab from '@/pages/setting/components/info/ListTab';

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
                        <TabPane tab={'重要报关信息设置'} key="1">
                            <EditTab />
                        </TabPane>,
                        <TabPane tab={'重要报关信息查看'} key="2">
                            <ListTab activeKey={activeKey} />
                        </TabPane>,
                    ]}
                />
            </Container>
        );
    }, [activeKey]);
};

export default CustomDeclarationInfoPage;

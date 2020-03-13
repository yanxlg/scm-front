import React, { useCallback, useMemo, useState } from 'react';
import { Tabs } from 'antd';
import StoreForm from '@/pages/setting/components/StoreForm';

const { TabPane } = Tabs;

const Store: React.FC = (props: {}) => {
    const [activeKey, setActiveKey] = useState('1');
    const onChange = useCallback((activeKey: string) => setActiveKey(activeKey), []);
    return useMemo(() => {
        return (
            <Tabs
                className="tabs-margin-none"
                onChange={onChange}
                activeKey={activeKey}
                type="card"
                children={[
                    <TabPane tab="VOVA" key="1">
                        <StoreForm />
                    </TabPane>,
                    <TabPane tab="FD" key="2">
                        <StoreForm />
                    </TabPane>,
                ]}
            />
        );
    }, [activeKey, props]);
};

export default Store;

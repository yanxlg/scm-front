import React, { useCallback, useMemo, useState } from 'react';
import { Tabs } from 'antd';
import { InOutStock } from '@/pages/stock/components/InOutStock';
import { StockControl } from './components/StockControl';

const { TabPane } = Tabs;

const Stock: React.FC = (props: {}) => {
    const [activeKey, setActiveKey] = useState('1');
    const onChange = useCallback((activeKey: string) => setActiveKey(activeKey), []);
    return useMemo(() => {
        return (
            <div className="container">
                <Tabs
                    className="tabs-margin-none"
                    onChange={onChange}
                    activeKey={activeKey}
                    type="card"
                    children={[
                        <TabPane tab="出入库" key="1">
                            <InOutStock />
                        </TabPane>,
                        <TabPane tab="库存管理" key="2">
                            <StockControl />
                        </TabPane>,
                    ]}
                />
            </div>
        );
    }, [activeKey, props]);
};

export default Stock;

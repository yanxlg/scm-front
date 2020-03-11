import React, { useMemo } from 'react';
import { Tabs } from 'antd';
import { InOutStock } from '@/pages/stock/components/InOutStock';
import { StockControl } from './components/StockControl';

const { TabPane } = Tabs;

const Stock: React.FC = () => {
    return useMemo(() => {
        return (
            <div className="container">
                <Tabs
                    defaultActiveKey="1"
                    className="tabs-margin-none"
                    type="card"
                    children={[
                        <TabPane tab="入库管理" key="1">
                            <InOutStock type={2} />
                        </TabPane>,
                        <TabPane tab="出库管理" key="2">
                            <InOutStock type={1} />
                        </TabPane>,
                        <TabPane tab="库存管理" key="3">
                            <StockControl />
                        </TabPane>,
                    ]}
                />
            </div>
        );
    }, []);
};

export default Stock;

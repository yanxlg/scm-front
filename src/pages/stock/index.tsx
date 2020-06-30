import React, { useMemo } from 'react';
import { Tabs } from 'antd';
import { InOutStock } from '@/pages/stock/components/InOutStock';
import { StockControl } from './components/StockControl';
import queryString from 'query-string';
import { StockType } from '@/config/dictionaries/Stock';
import Container from '@/components/Container';
import { PermissionRouterWrap } from 'rc-permission';

const { TabPane } = Tabs;

const Stock: React.FC = (props: any) => {
    return useMemo(() => {
        const { query } = queryString.parseUrl(window.location.href);
        const defaultActiveKey = ((query.tabKey ?? '1') as unknown) as string;
        return (
            <Container>
                <Tabs
                    defaultActiveKey={defaultActiveKey}
                    className="tabs-margin-none"
                    type="card"
                    children={[
                        <TabPane tab="入库管理" key="1">
                            <InOutStock type={StockType.In} />
                        </TabPane>,
                        <TabPane tab="出库管理" key="2">
                            <InOutStock type={StockType.Out} />
                        </TabPane>,
                        <TabPane tab="库存管理" key="3">
                            <StockControl />
                        </TabPane>,
                    ]}
                />
            </Container>
        );
    }, []);
};

export default PermissionRouterWrap(Stock, {
    login: true,
    pid: 'stock',
});

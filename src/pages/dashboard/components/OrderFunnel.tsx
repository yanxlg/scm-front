import React, { useMemo, useEffect } from 'react';
import { Funnel } from '@antv/g2plot';

const data = [
    { label: '需采购', quantity: 3000, quarter: 'aaa' },
    { label: '已拍单', quantity: 3000, quarter: 'aaa' },
    { label: '已支付', quantity: 3000, quarter: 'aaa' },
    { label: '已发货', quantity: 3000, quarter: 'aaa' },
    { label: '已签收', quantity: 3000, quarter: 'aaa' },
    { label: '已入库', quantity: 3000, quarter: 'aaa' },
    // 需采购--
    { label: '已出库', quantity: 700, quarter: 'aaa' },
    { label: '已收货', quantity: 500, quarter: 'aaa' },

    { label: '需采购', quantity: 3000, quarter: 'bbb' },
    { label: '已拍单', quantity: 2000, quarter: 'bbb' },
    { label: '已支付', quantity: 1500, quarter: 'bbb' },
    { label: '已发货', quantity: 1200, quarter: 'bbb' },
    { label: '已签收', quantity: 1000, quarter: 'bbb' },
    { label: '已入库', quantity: 800, quarter: 'bbb' },
    // 需采购--
    { label: '已出库', quantity: 700, quarter: 'bbb' },
    { label: '已收货', quantity: 500, quarter: 'bbb' },
];

const OrderFunnel: React.FC = () => {
    useEffect(() => {
        const funnelPlot = new Funnel(document.getElementById('order-funnel') as HTMLElement, {
            data,
            xField: 'label',
            yField: 'quantity',
            compareField: 'quarter',
        });
        funnelPlot.render();
    }, []);

    return useMemo(() => {
        return <div id="order-funnel"></div>;
    }, []);
};

export default OrderFunnel;

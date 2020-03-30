import React, { useMemo } from 'react';
import { ColumnProps } from 'antd/es/table';

import { queryRegionShippingFee } from '@/services/channel';
import { IRegionShippingFeeItem } from '@/interface/IChannel';
import { useList } from '@/utils/hooks';
import ProTable from '@/components/ProTable';
import { ConfigProvider, Statistic } from 'antd';
import zhCN from 'antd/es/locale/zh_CN';

declare interface ShipFeeModalProps {
    product_id: string;
    merchant_id: string;
}

const columns: ColumnProps<IRegionShippingFeeItem>[] = [
    {
        title: '国家',
        dataIndex: 'country_name',
        align: 'center',
        width: 120,
    },
    {
        title: '国家运费（$）',
        dataIndex: 'fee',
        align: 'center',
        width: 120,
    },
    {
        title: '重量（g)',
        dataIndex: 'weight',
        align: 'center',
        width: 120,
    },
];

const ShipFeeModal: React.FC<ShipFeeModalProps> = ({ product_id, merchant_id }) => {
    const { loading, dataSource, pageNumber, pageSize, total, onChange } = useList<
        IRegionShippingFeeItem
    >(queryRegionShippingFee, undefined, {
        product_id: product_id,
        merchant_id: merchant_id,
    });
    return useMemo(() => {
        return (
            <ConfigProvider locale={zhCN}>
                <ProTable<IRegionShippingFeeItem>
                    search={false}
                    rowKey="country_code"
                    scroll={{ y: 280, scrollToFirstRowOnChange: true }}
                    autoFitY={false}
                    pagination={{
                        total: total,
                        current: pageNumber.current,
                        pageSize: pageSize.current,
                        showSizeChanger: true,
                        showQuickJumper: false,
                        showTotal: undefined,
                    }}
                    toolBarRender={false}
                    tableAlertRender={false}
                    columns={columns}
                    dataSource={dataSource}
                    loading={loading}
                    onChange={onChange}
                    options={false}
                />
            </ConfigProvider>
        );
    }, [loading]);
};

export default ShipFeeModal;

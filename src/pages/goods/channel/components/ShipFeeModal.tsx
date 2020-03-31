import React, { useMemo } from 'react';
import { ColumnProps } from 'antd/es/table';

import { queryRegionShippingFee } from '@/services/channel';
import { IRegionShippingFeeItem } from '@/interface/IChannel';
import { useList } from '@/utils/hooks';
import ProTable from '@/components/ProTable';
import { ConfigProvider, Statistic } from 'antd';
import zhCN from 'antd/es/locale/zh_CN';
import { FitTable } from '@/components/FitTable';

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
    >({
        queryList: queryRegionShippingFee,
        extraQuery: {
            product_id: product_id,
            merchant_id: merchant_id,
        },
    });
    return useMemo(() => {
        return (
            <ConfigProvider locale={zhCN}>
                <FitTable<IRegionShippingFeeItem>
                    rowKey="country_code"
                    scroll={{ y: 280, scrollToFirstRowOnChange: true }}
                    autoFitY={false}
                    pagination={{
                        total: total,
                        current: pageNumber,
                        pageSize: pageSize,
                        showSizeChanger: true,
                        showQuickJumper: false,
                        showTotal: undefined,
                    }}
                    columns={columns}
                    dataSource={dataSource}
                    loading={loading}
                    onChange={onChange}
                />
            </ConfigProvider>
        );
    }, [loading]);
};

export default ShipFeeModal;

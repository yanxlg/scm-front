import React, { useMemo, useEffect } from 'react';
import { useList, FitTable } from 'react-components';
import { getAbnormalAllList } from '@/services/purchase';
import { IPurchaseAbnormalRes } from '@/interface/IPurchase';
import { ColumnProps } from 'antd/es/table';

const PaneAbnormalAll: React.FC = props => {
    const { loading, dataSource } = useList<IPurchaseAbnormalRes>({
        queryList: getAbnormalAllList,
    });

    const columns = useMemo<ColumnProps<IPurchaseAbnormalRes>[]>(() => {
        return [
            {
                title: '异常单ID',
                dataIndex: 'a1',
                align: 'center',
                width: 150,
            },
            {
                title: '异常类型',
                dataIndex: 'a2',
                align: 'center',
                width: 150,
            },
            {
                title: '异常单状态',
                dataIndex: 'a3',
                align: 'center',
                width: 150,
            },
            {
                title: '异常图片',
                dataIndex: 'image',
                align: 'center',
                width: 150,
            },
            {
                title: '异常数量',
                dataIndex: 'a4',
                align: 'center',
                width: 150,
            },
            {
                title: '异常描述',
                dataIndex: 'a5',
                align: 'center',
                width: 150,
            },
            {
                title: '采购单ID',
                dataIndex: 'a6',
                align: 'center',
                width: 150,
            },
            {
                title: '运单号',
                dataIndex: 'a7',
                align: 'center',
                width: 150,
            },
            {
                title: '操作',
                dataIndex: 'a8',
                align: 'center',
                width: 150,
            },
        ];
    }, []);

    return useMemo(() => {
        console.log('dataSource', dataSource);
        return (
            <>
                <FitTable
                    bordered={true}
                    rowKey="purchase_plan_id"
                    className="order-table"
                    loading={loading}
                    columns={columns}
                    // rowSelection={rowSelection}
                    dataSource={dataSource}
                    scroll={{ x: 'max-content' }}
                    columnsSettingRender={true}
                    // pagination={pagination}
                    // onChange={onChange}
                    // toolBarRender={toolBarRender}
                />
            </>
        );
    }, [dataSource]);
};

export default PaneAbnormalAll;

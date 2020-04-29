import React, { useEffect, useMemo } from 'react';
import { Modal, Table } from 'antd';
import { ColumnsType } from 'antd/lib/table/interface';
import { useDataSet } from 'react-components';
import { queryPurchasePlainList } from '@/services/purchase';
import { IPurchasePlain } from '@/interface/IPurchase';
import { EmptyObject } from '@/config/global';

const reserveStatusMap = {
    1: '未预定',
    2: '预定失败',
    3: '预定成功',
    4: '预定已释放',
};

const columns: ColumnsType<IPurchasePlain> = [
    {
        title: '采购计划ID',
        dataIndex: 'purchasePlanId',
        align: 'center',
        width: '150px',
    },
    {
        title: '采购计划生成时间',
        width: '100px',
        align: 'center',
    },
    {
        title: '入库数量',
        width: '100px',
        align: 'center',
        render: () => '--',
    },
    {
        title: '子订单ID',
        width: '100px',
        dataIndex: 'orderGoodsId',
        align: 'center',
    },
    {
        title: '子订单状态',
        width: '100px',
        fixed: 'left',
        dataIndex: 'task_id',
        align: 'center',
    },
    {
        title: '预定状态',
        width: '100px',
        fixed: 'left',
        dataIndex: 'reserveStatus', //1：未预定 2：预定失败 3：预定成功 4：预定已释放
        align: 'center',
        render: (_: keyof typeof reserveStatusMap) => {
            return reserveStatusMap[_];
        },
    },
];

declare interface IPurchaseDetailProps {
    visible: string | false;
    onCancel: () => void;
}

const PurchaseDetailModal: React.FC<IPurchaseDetailProps> = ({ visible, onCancel }) => {
    const { loading, dataSet, setLoading, setDataSet } = useDataSet<IPurchasePlain>();
    useEffect(() => {
        const api = queryPurchasePlainList({
            purchase_order_goods_id: visible,
        });
        if (visible) {
            setLoading(true);
            setDataSet([]);
            api.request()
                .then(({ data: { list = [] } = EmptyObject }) => {
                    setDataSet(list);
                })
                .finally(() => {
                    setLoading(false);
                });
        }
        return () => {
            setLoading(false);
            api.cancel();
        };
    }, [visible]);

    return useMemo(() => {
        return (
            <Modal
                visible={!!visible}
                title="采购计划详情"
                width={900}
                onCancel={onCancel}
                footer={null}
                destroyOnClose={true}
            >
                <Table
                    columns={columns}
                    pagination={false}
                    dataSource={dataSet}
                    loading={loading}
                    scroll={{ y: 500 }}
                />
            </Modal>
        );
    }, [visible, loading]);
};

export default PurchaseDetailModal;

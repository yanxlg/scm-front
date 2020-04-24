import React, { useMemo } from 'react';
import { Modal, Table } from 'antd';
import { ColumnsType } from 'antd/lib/table/interface';

const columns: ColumnsType<any> = [
    {
        title: '采购计划ID',
        dataIndex: 'operation',
        align: 'center',
        fixed: 'left',
        width: '150px',
    },
    {
        title: '采购计划生成时间',
        width: '100px',
        fixed: 'left',
        dataIndex: 'task_id',
        align: 'center',
    },
    {
        title: '入库数量',
        width: '100px',
        fixed: 'left',
        dataIndex: 'task_id',
        align: 'center',
    },
    {
        title: '自订单ID',
        width: '100px',
        fixed: 'left',
        dataIndex: 'task_id',
        align: 'center',
    },
    {
        title: '自订单状态',
        width: '100px',
        fixed: 'left',
        dataIndex: 'task_id',
        align: 'center',
    },
    {
        title: '预定状态',
        width: '100px',
        fixed: 'left',
        dataIndex: 'task_id',
        align: 'center',
    },
];

declare interface IPurchaseDetailProps {
    visible: string | false;
    onCancel: () => void;
}

const PurchaseDetailModal: React.FC<IPurchaseDetailProps> = ({ visible, onCancel }) => {
    return useMemo(() => {
        return (
            <Modal
                visible={!!visible}
                title="采购计划详情"
                width={700}
                onCancel={onCancel}
                footer={null}
            >
                <Table columns={columns} pagination={false} />
            </Modal>
        );
    }, []);
};

export default PurchaseDetailModal;

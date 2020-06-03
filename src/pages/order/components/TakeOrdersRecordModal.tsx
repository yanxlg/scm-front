import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Modal, Table } from 'antd';
import { queryTakeOrders } from '@/services/order-manage';
import { EmptyArray } from 'react-components/es/utils';
import { IPurchaseLog } from '@/interface/IOrder';

declare interface TakeOrdersRecordModalProps {
    visible: boolean;
    onClose: () => void;
}
const TakeOrdersRecordModal = ({ visible, onClose }: TakeOrdersRecordModalProps) => {
    const [loading, setLoading] = useState(false);
    const [dataSet, setDataSet] = useState<IPurchaseLog[]>([]);

    const updateData = useCallback(() => {
        setLoading(true);
        queryTakeOrders()
            .then(({ data = EmptyArray }) => {
                setDataSet(data);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);
    useEffect(() => {
        updateData();
    }, []);

    useEffect(() => {
        if (visible) {
            updateData();
        }
    }, [visible]);

    return useMemo(() => {
        return (
            <Modal title="拍单记录" visible={visible} width={900} onCancel={onClose} footer={null}>
                <Table
                    bordered={true}
                    pagination={false}
                    dataSource={dataSet}
                    columns={[
                        {
                            title: '拍单时间',
                            dataIndex: 'taskTime',
                            width: 120,
                        },
                        {
                            title: '当前状态',
                            dataIndex: 'status',
                            width: 120,
                        },
                        {
                            title: '总提交数',
                            dataIndex: 'allPurchase',
                            width: 120,
                        },
                        {
                            title: '代拍单',
                            dataIndex: 'needPurchase',
                            width: 120,
                        },
                        {
                            title: '有效订单',
                            dataIndex: 'effePurchase',
                            width: 120,
                        },
                        {
                            title: '拍单成功',
                            dataIndex: 'succPurchase',
                            width: 120,
                        },
                        {
                            title: '拍单失败',
                            dataIndex: 'failPurchase',
                            width: 120,
                        },
                    ]}
                />
            </Modal>
        );
    }, [visible]);
};

export default TakeOrdersRecordModal;

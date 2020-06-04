import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Modal, Table } from 'antd';
import { queryTakeOrders } from '@/services/order-manage';
import { EmptyArray } from 'react-components/es/utils';
import { IPurchaseLog } from '@/interface/IOrder';
import { EmptyObject } from '@/config/global';
import { utcToLocal } from 'react-components/es/utils/date';

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
            .then(({ data: { data = EmptyArray } = EmptyObject }) => {
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
                    loading={loading}
                    bordered={true}
                    pagination={false}
                    dataSource={dataSet}
                    scroll={{
                        y: 500,
                    }}
                    columns={[
                        {
                            title: '拍单时间',
                            dataIndex: 'taskTime',
                            width: 120,
                            align: 'center',
                            render: _ => utcToLocal(_),
                        },
                        {
                            title: '当前状态',
                            dataIndex: 'status',
                            width: 120,
                            align: 'center',
                        },
                        {
                            title: '总提交数',
                            dataIndex: 'allPurchase',
                            width: 100,
                            align: 'center',
                        },
                        {
                            title: '代拍单',
                            dataIndex: 'needPurchase',
                            width: 100,
                            align: 'center',
                        },
                        {
                            title: '有效订单',
                            dataIndex: 'effePurchase',
                            width: 100,
                            align: 'center',
                        },
                        {
                            title: '拍单成功',
                            dataIndex: 'succPurchase',
                            width: 100,
                            align: 'center',
                        },
                        {
                            title: '拍单失败',
                            dataIndex: 'failPurchase',
                            width: 100,
                            align: 'center',
                        },
                    ]}
                />
            </Modal>
        );
    }, [visible, loading]);
};

export default TakeOrdersRecordModal;

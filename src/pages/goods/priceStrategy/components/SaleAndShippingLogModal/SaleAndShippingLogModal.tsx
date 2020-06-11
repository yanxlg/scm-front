import React, { useState, useEffect, useCallback } from 'react';
import { Modal, Table, Pagination } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { getCatagoryWeightLog, getSaleAndShippingOperateLog } from '@/services/price-strategy';
import { ICatagoryWeightLogReq, IUpdateRecoreItem } from '@/interface/IPriceStrategy';
import { utcToLocal } from 'react-components/es/utils/date';

interface IProps {
    visible: boolean;
    id: string;
    type: 'shipping_fee' | 'sale_price';
    onCancel(): void;
}

const columns: ColumnsType<any> = [
    {
        title: '操作内容',
        dataIndex: 'operate_info',
        align: 'center',
        width: 120,
    },
    {
        title: '操作账号',
        dataIndex: 'operator',
        align: 'center',
        width: 120,
    },
    {
        title: '生效时间',
        dataIndex: 'operate_time',
        align: 'center',
        width: 120,
        render: (val: string) => utcToLocal(val),
    },
];

const UpdateRecordModal: React.FC<IProps> = ({ visible, id, type, onCancel }) => {
    const [loading, setLoading] = useState(false);
    const [dataSource, setDataSource] = useState<IUpdateRecoreItem[]>([]);

    const handleCancel = useCallback(() => {
        onCancel();
        setDataSource([]);
    }, []);

    useEffect(() => {
        if (visible && id) {
            setLoading(true);
            getSaleAndShippingOperateLog({
                rule_id: id,
                log_type: type,
            })
                .then(({ data }) => setDataSource(data?.list ?? []))
                .finally(() => {
                    setLoading(false);
                });
        }
    }, [id, type, visible]);

    return (
        <Modal title="更新记录" width={720} visible={visible} footer={null} onCancel={handleCancel}>
            <Table
                bordered
                loading={loading}
                columns={columns}
                dataSource={dataSource}
                scroll={{ y: 440 }}
            />
        </Modal>
    );
};

export default React.memo(UpdateRecordModal);

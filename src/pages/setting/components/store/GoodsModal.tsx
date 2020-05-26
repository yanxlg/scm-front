import React, { useState, useCallback, useEffect } from 'react';
import { Modal, Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { AutoEnLargeImg } from 'react-components';
import { IOfflinePurchaseDetail } from '@/interface/ISetting';
import { queryOfflinePurchaseInfo } from '@/services/setting';

interface IProps {
    visible: boolean;
    id: string;
    onCancel(): void;
}

const columns: ColumnsType<IOfflinePurchaseDetail> = [
    {
        title: 'Commodity Id',
        dataIndex: 'commodity_id',
        align: 'center',
        width: 160,
        render: (val: string) => <div style={{ wordBreak: 'break-all' }}>{val}</div>,
    },
    {
        title: 'Commodity Sku Id',
        dataIndex: 'commodity_sku_id',
        align: 'center',
        width: 160,
        render: (val: string) => <div style={{ wordBreak: 'break-all' }}>{val}</div>,
    },
    {
        title: '对应图片',
        dataIndex: 'variant_image',
        align: 'center',
        width: 120,
        // className={styles.img}
        render: (val: string) => <AutoEnLargeImg src={val} style={{ width: 88, height: 88 }} />,
    },
    {
        title: '商品名称',
        dataIndex: 'goods_name',
        align: 'center',
        width: 160,
    },
    {
        title: '规格',
        dataIndex: 'sku_style',
        align: 'center',
        width: 160,
    },
    {
        title: '库存',
        dataIndex: 'sku_inventory',
        align: 'center',
        width: 140,
    },
];

const GoodsModal: React.FC<IProps> = ({ visible, id, onCancel }) => {
    const [loading, setLoading] = useState(false);
    const [goodsList, setGoodsList] = useState<IOfflinePurchaseDetail[]>([]);

    const handleCancel = useCallback(() => {
        setGoodsList([]);
        onCancel();
    }, []);

    const _queryOfflinePurchaseInfo = useCallback(id => {
        setLoading(true);
        return queryOfflinePurchaseInfo(id)
            .then(res => {
                setGoodsList([res.data]);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    useEffect(() => {
        if (visible) {
            _queryOfflinePurchaseInfo(id);
        }
    }, [visible, id]);

    return (
        <Modal
            title="线下采购商品信息"
            width={980}
            footer={null}
            visible={visible}
            onCancel={handleCancel}
        >
            <Table
                bordered
                loading={loading}
                pagination={false}
                columns={columns}
                dataSource={goodsList}
            />
        </Modal>
    );
};

export default React.memo(GoodsModal);

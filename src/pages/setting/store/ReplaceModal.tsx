import React, { useEffect, useMemo, useState } from 'react';
import { Modal, Table } from 'antd';
import { queryReplaceStoreOut } from '@/services/setting';
import useFetch from '@/hooks/useFetch';
import { EmptyObject } from '@/config/global';
import { ReplaceItem } from '@/interface/ISetting';
import { ColumnsType } from 'antd/es/table';
import { AutoEnLargeImg } from 'react-components';
import styles from '@/styles/_store.less';

declare interface ReplaceModalProps {
    visible: string | false;
    onClose: () => void;
}
const ReplaceModal = ({ id }: { id: string }) => {
    const [fetch] = useFetch();
    const [dataSet, setDataSet] = useState<Array<ReplaceItem['sale'] & { type: string }>>([]);

    useEffect(() => {
        queryReplaceStoreOut(fetch, id).then(({ data: { sale, outbound } = EmptyObject }) => {
            setDataSet([
                {
                    type: '售卖商品',
                    commodity_id: sale.commodity_id,
                    commodity_sku_id: sale.commodity_sku_id,
                    variant_image: sale.variant_image,
                    goods_name: sale.goods_name,
                    sku_style: sale.sku_style,
                    sku_inventory: sale.sku_inventory,
                },
                {
                    type: '出库商品',
                    commodity_id: outbound.commodity_id,
                    commodity_sku_id: outbound.commodity_sku_id,
                    variant_image: outbound.variant_image,
                    goods_name: outbound.goods_name,
                    sku_style: outbound.sku_style,
                    sku_inventory: outbound.sku_inventory,
                },
            ]);
        });
    }, []);

    const columns = useMemo<ColumnsType<ReplaceItem['sale'] & { type: string }>>(() => {
        return [
            {
                title: '类型',
                align: 'center',
                dataIndex: 'type',
                width: 100,
            },
            {
                title: 'commodity id',
                align: 'center',
                dataIndex: 'commodity_id',
                width: 150,
            },
            {
                title: 'commodity sku id',
                align: 'center',
                dataIndex: 'commodity_sku_id',
                width: 150,
            },
            {
                title: '对应图片',
                align: 'center',
                dataIndex: 'variant_image',
                width: 100,
                render: _ => {
                    return <AutoEnLargeImg className={styles.goodImg} src={_} />;
                },
            },
            {
                title: '商品名称',
                align: 'center',
                dataIndex: 'goods_name',
                width: 120,
            },
            {
                title: '规格',
                align: 'center',
                dataIndex: 'sku_style',
                width: 150,
            },
            {
                title: '库存',
                align: 'center',
                dataIndex: 'sku_inventory',
                width: 150,
            },
        ];
    }, []);

    return useMemo(() => {
        return (
            <Table
                tableLayout={'fixed'}
                rowKey="type"
                pagination={false}
                loading={dataSet.length === 0}
                bordered={true}
                columns={columns}
                dataSource={dataSet}
            />
        );
    }, [dataSet]);
};

const ModalWrap = ({ visible, onClose }: ReplaceModalProps) => {
    return useMemo(() => {
        return (
            <Modal
                visible={visible !== false}
                title="替换出库商品信息"
                destroyOnClose={true}
                onCancel={onClose}
                width={1200}
                footer={null}
            >
                <ReplaceModal id={visible as string} />
            </Modal>
        );
    }, [visible]);
};

export default ModalWrap;

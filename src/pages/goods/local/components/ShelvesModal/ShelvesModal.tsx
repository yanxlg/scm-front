import React, { useMemo, useCallback } from 'react';
import { Modal, Table } from 'antd';
import { utcToLocal } from 'react-components/es/utils/date';
import { publishStatusMap, publishStatusCode } from '@/enums/LocalGoodsEnum';
import { IPublishItem } from '@/interface/ILocalGoods';
import { ColumnType } from 'antd/es/table';

interface IProps {
    visible: boolean;
    publishStatusList: IPublishItem[];
    onCancel(): void;
}

const ShelvesDialog: React.FC<IProps> = ({ visible, publishStatusList, onCancel }) => {
    const columns = useMemo<ColumnType<IPublishItem>[]>(() => {
        return [
            {
                key: 'serialNum',
                title: '序号',
                dataIndex: 'serialNum',
                align: 'center',
            },
            {
                key: 'lastUpdateTime',
                title: '时间',
                dataIndex: 'lastUpdateTime',
                align: 'center',
                render: (val: string) => utcToLocal(val),
            },
            {
                key: 'publishChannel',
                title: '销售平台',
                dataIndex: 'publishChannel',
                align: 'center',
            },
            {
                key: 'publishStore',
                title: '店铺名称',
                dataIndex: 'publishStore',
                align: 'center',
            },
            {
                key: 'publishStatus',
                title: '上架状态',
                dataIndex: 'publishStatus',
                align: 'center',
                render: (val: publishStatusCode) => publishStatusMap[val ? val : 0],
            },
            {
                key: 'productId',
                title: '中台商品ID',
                dataIndex: 'productId',
                align: 'center',
            },
        ];
    }, []);

    return useMemo(() => {
        const pagination = publishStatusList.length > 5 ? {} : false;
        return (
            <Modal
                title="上架状态记录"
                visible={visible}
                footer={null}
                width={800}
                onCancel={onCancel}
            >
                <Table
                    bordered
                    rowKey="serialNum"
                    dataSource={publishStatusList}
                    pagination={pagination}
                    columns={columns}
                />
            </Modal>
        );
    }, [visible]);
};

export default ShelvesDialog;

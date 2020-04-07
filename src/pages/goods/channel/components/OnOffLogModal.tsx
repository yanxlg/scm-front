import React, { useEffect, useMemo, useState } from 'react';
import { Modal, Table } from 'antd';
import { TableProps } from 'antd/es/table';
import channelStyles from '@/styles/_channel.less';
import { useDataSet } from 'react-components/es/hooks';
import { ILogItem } from '@/interface/IChannel';
import { queryOnOffLog } from '@/services/channel';

declare interface OnOffLogModalProps {
    visible: string | false;
    onClose: () => void;
}

const OnOffLogModal: React.FC<OnOffLogModalProps> = ({ visible, onClose }) => {
    const { dataSet, setDataSet, loading, setLoading } = useDataSet<ILogItem>();
    const columns = useMemo<TableProps<ILogItem>['columns']>(() => {
        return [
            {
                title: '序号',
                dataIndex: 'index',
                width: 100,
                align: 'center',
                render: (_, record, index: number) => {
                    return index + 1;
                },
            },
            {
                title: '时间',
                width: 180,
                dataIndex: 'create_time',
                align: 'center',
            },
            {
                title: '状态',
                width: 100,
                dataIndex: 'status',
                align: 'center',
            },
            {
                title: '原因',
                dataIndex: 'reason',
                align: 'center',
            },
        ];
    }, []);
    useEffect(() => {
        if (visible) {
            setDataSet([]);
            setLoading(true);
            queryOnOffLog(visible)
                .then(({ data }) => {
                    setDataSet(data);
                })
                .finally(() => {
                    setLoading(false);
                });
        } else {
            setLoading(false);
        }
    }, [visible]);
    return useMemo(() => {
        return (
            <Modal
                visible={!!visible}
                title="上下架日志"
                onCancel={onClose}
                className={channelStyles.logModal}
            >
                <Table
                    columns={columns}
                    scroll={{ y: 600 }}
                    dataSource={dataSet}
                    loading={loading}
                />
            </Modal>
        );
    }, [visible, loading]);
};

export default OnOffLogModal;

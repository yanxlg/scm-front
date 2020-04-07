import React, { useMemo } from 'react';
import { Modal, Table } from 'antd';
import { TableProps } from 'antd/es/table';
import channelStyles from '@/styles/_channel.less';
import { useList } from 'react-components/es/hooks';

declare interface OnOffLogModalProps {
    visible: string | false;
    onClose: () => void;
}

declare interface LogItem {}

const OnOffLogModal: React.FC<OnOffLogModalProps> = ({ visible, onClose }) => {
    // const {} = useList({});
    const columns = useMemo<TableProps<LogItem>['columns']>(() => {
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
    return useMemo(() => {
        return (
            <Modal
                visible={!!visible}
                title="上下架日志"
                onCancel={onClose}
                className={channelStyles.logModal}
            >
                <Table columns={columns} scroll={{ y: 600 }} />
            </Modal>
        );
    }, [visible]);
};

export default OnOffLogModal;

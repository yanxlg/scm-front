import React, { useState } from 'react';
import { Modal, Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';

interface IProps {
    visible: boolean;
    onCancel(): void;
}

const columns: ColumnsType<any> = [
    {
        title: '操作内容',
        dataIndex: 'a1',
        align: 'center',
        width: 120,
    },
    {
        title: '操作账号',
        dataIndex: 'a2',
        align: 'center',
        width: 120,
    },
    {
        title: '生效时间',
        dataIndex: 'a3',
        align: 'center',
        width: 120,
    },
];

const UpdateRecordModal: React.FC<IProps> = ({ visible, onCancel }) => {
    const [loading, setLoading] = useState(false);

    return (
        <Modal title="更新记录" width={680} visible={visible} footer={null} onCancel={onCancel}>
            <Table
                bordered
                loading={loading}
                columns={columns}
                dataSource={[]}
                scroll={{ y: 480 }}
            />
        </Modal>
    );
};

export default React.memo(UpdateRecordModal);

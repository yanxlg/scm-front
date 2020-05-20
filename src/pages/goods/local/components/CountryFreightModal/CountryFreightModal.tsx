import React, { useCallback, useEffect, useState } from 'react';
import { Modal, Table } from 'antd';

interface IProps {
    visible: boolean;
    onCancel(): void;
}

const columns = [
    {
        title: '国家',
        dataIndex: 'country',
    },
    {
        title: '价格',
        dataIndex: 'price',
    },
];

const dataSource = [
    {
        country: 'FR',
        price: 55,
    },
    {
        country: 'DE',
        price: 56,
    },
];

const CountryFreightModal: React.FC<IProps> = ({ visible, onCancel }) => {
    const [loading] = useState(true);
    return (
        <Modal title="国家价格" visible={visible} width={600} onCancel={onCancel} footer={null}>
            <Table loading={loading} columns={columns} dataSource={dataSource} pagination={false} />
        </Modal>
    );
};

export default React.memo(CountryFreightModal);

import React, { useMemo } from 'react';
import { Modal, Descriptions } from 'antd';
import { IStockOutItem } from '@/interface/IStock';

declare interface AddressModalProps {
    visible: IStockOutItem['orderAddress'] | false;
    onClose: () => void;
}

const AddressModal = ({ visible, onClose }: AddressModalProps) => {
    return useMemo(() => {
        const detail = (visible as IStockOutItem['orderAddress']) || {};
        const { consignee, country, address1, province, address2, zipCode, city, tel } = detail;
        return (
            <Modal
                visible={!!visible}
                title="收货地址"
                onCancel={onClose}
                width={600}
                footer={null}
            >
                <Descriptions column={2}>
                    <Descriptions.Item label="收件人姓名">{consignee}</Descriptions.Item>
                    <Descriptions.Item label="国家">{country}</Descriptions.Item>
                    <Descriptions.Item label="地址1">{address1}</Descriptions.Item>
                    <Descriptions.Item label="州/省/地区">{province}</Descriptions.Item>
                    <Descriptions.Item label="地址2">{address2}</Descriptions.Item>
                    <Descriptions.Item label="邮编">{zipCode}</Descriptions.Item>
                    <Descriptions.Item label="城市">{city}</Descriptions.Item>
                    <Descriptions.Item label="电话">{tel}</Descriptions.Item>
                </Descriptions>
            </Modal>
        );
    }, [visible]);
};

export { AddressModal };

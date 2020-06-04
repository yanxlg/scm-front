import React from 'react';
import { Modal, Row, Col } from 'antd';

interface IProps {
    visible: boolean;
    countryList: string[];
    onCancel(): void;
}

const DeliveryCountry: React.FC<IProps> = ({ visible, countryList, onCancel }) => {
    return (
        <Modal title="配送国家" width={720} footer={null} visible={visible} onCancel={onCancel}>
            <Row gutter={20}>
                {countryList.map(name => (
                    <Col style={{ marginBottom: 16 }} span={4} key={name}>
                        {name}
                    </Col>
                ))}
            </Row>
        </Modal>
    );
};

export default React.memo(DeliveryCountry);

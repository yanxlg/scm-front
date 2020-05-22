import React, { useState, useCallback } from 'react';
import { Modal, Row, Col } from 'antd';

interface IProps {
    visible: boolean;
    onCancel(): void;
}

const DeliveryCountry: React.FC<IProps> = ({ visible, onCancel }) => {
    const [loading, setLaoding] = useState(true);
    const [countryList, setCountryList] = useState<string[]>([
        '国家1',
        '国家2',
        '国家3',
        '国家4',
        '国家5',
        '国家6',
        '国家7',
        '国家8',
        '国家9',
    ]);

    const handleCancel = useCallback(() => {
        onCancel();
    }, []);

    return (
        <Modal title="配送国家" width={720} footer={null} visible={visible} onCancel={handleCancel}>
            <Row gutter={20}>
                {countryList.map(name => (
                    <Col style={{ marginBottom: 16 }} span={4}>
                        {name}
                    </Col>
                ))}
            </Row>
        </Modal>
    );
};

export default React.memo(DeliveryCountry);

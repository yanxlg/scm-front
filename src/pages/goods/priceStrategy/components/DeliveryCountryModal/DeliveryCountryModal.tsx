import React, { useState, useCallback, useEffect } from 'react';
import { Modal, Row, Col, Spin } from 'antd';
import { getShippingCardCountry } from '@/services/price-strategy';

interface IProps {
    visible: boolean;
    id: string;
    onCancel(): void;
}

const DeliveryCountry: React.FC<IProps> = ({ visible, id, onCancel }) => {
    const [loading, setLaoding] = useState(true);
    const [countryList, setCountryList] = useState<string[]>([]);

    const handleCancel = useCallback(() => {
        onCancel();
    }, []);

    // useEffect(() => {
    //     if (id) {
    //         setLaoding(true);
    //         getShippingCardCountry(id)
    //             .then(list => setCountryList(list?.map(({ name }: any) => name)))
    //             .finally(() => setLaoding(false));
    //     }
    // }, [id]);

    return (
        <Modal title="配送国家" width={720} footer={null} visible={visible} onCancel={handleCancel}>
            <Spin spinning={loading}>
                <Row gutter={20}>
                    {countryList.map(name => (
                        <Col style={{ marginBottom: 16 }} span={4} key={name}>
                            {name}
                        </Col>
                    ))}
                </Row>
            </Spin>
        </Modal>
    );
};

export default React.memo(DeliveryCountry);

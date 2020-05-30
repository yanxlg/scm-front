import React, { useMemo } from 'react';
import { Modal } from 'antd';

declare interface CreatePurchaseProps {
    visible: string | false;
    onClose: () => void;
}

const CreatePurchase = () => {
    return useMemo(() => {
        return <div></div>;
    }, []);
};

export default ({ visible, onClose }: CreatePurchaseProps) =>
    useMemo(
        () => (
            <Modal title="创建采购单" visible={!!visible} destroyOnClose={true} onCancel={onClose}>
                <CreatePurchase />
            </Modal>
        ),
        [visible],
    );

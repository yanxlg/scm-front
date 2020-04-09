import React, { useMemo, useState, useCallback } from 'react';
import { Modal } from 'antd';
import { FitTable } from 'react-components';

interface IProps {
    visible: boolean;
    hideModal(): void;
}

const VersionParentDialog: React.FC<IProps> = ({
    visible,
    hideModal
}) => {

    const [goodsList, setGoodsList] = useState();

    const onCancel = useCallback(() => {
        hideModal();
    }, []);

    return useMemo(() => {
        return (
            <Modal
                title="查看父版本"
                visible={visible}
                width={800}
                footer={null}
                onCancel={onCancel}
            >
                Modal
            </Modal>
        )
    }, [visible]);
}

export default VersionParentDialog;
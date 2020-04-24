import React, { useCallback, useMemo, useRef, useState } from 'react';
import { Modal } from 'antd';
import { JsonForm } from 'react-components';
import { FormField, JsonFormRef } from 'react-components/es/JsonForm';
import styles from '@/pages/purchase/_list.less';

const fieldList: FormField[] = [
    {
        type: 'input',
        name: 'number',
        label: <span>运&emsp;单&emsp;号</span>,
        className: styles.connectInput,
    },
    {
        type: 'number',
        name: 'count',
        label: '应入库数量',
        className: styles.connectInput,
    },
];

declare interface IConnectModalProps {
    visible: string | false;
    onCancel: () => void;
}

const ConnectModal: React.FC<IConnectModalProps> = ({ visible, onCancel }) => {
    const [submitting, setSubmitting] = useState(false);
    const formRef = useRef<JsonFormRef>(null);

    const onOKey = useCallback(() => {
        setSubmitting(true);
    }, []);

    return useMemo(() => {
        return (
            <Modal
                title="关联运单号"
                confirmLoading={submitting}
                visible={!!visible}
                okText="确认"
                onOk={onOKey}
                onCancel={onCancel}
                destroyOnClose={true}
            >
                <JsonForm
                    fieldList={fieldList}
                    layout="horizontal"
                    ref={formRef}
                    enableCollapse={false}
                />
            </Modal>
        );
    }, [submitting, visible]);
};

export default ConnectModal;

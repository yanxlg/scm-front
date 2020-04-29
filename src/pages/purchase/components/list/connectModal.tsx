import React, { useCallback, useMemo, useRef, useState } from 'react';
import { message, Modal } from 'antd';
import { JsonForm } from 'react-components';
import { FormField, JsonFormRef } from 'react-components/es/JsonForm';
import styles from '@/pages/purchase/_list.less';
import { setCorrelateWaybill } from '@/services/purchase';

const fieldList: FormField[] = [
    {
        type: 'input',
        name: 'purchase_waybill_no',
        label: <span>运&emsp;单&emsp;号</span>,
        className: styles.connectInput,
    },
    {
        type: 'number',
        name: 'goods_number',
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
        formRef.current!.validateFields().then(values => {
            setSubmitting(true);
            setCorrelateWaybill(({
                purchase_order_goods_id: visible as string,
                ...values,
            } as unknown) as any)
                .then(() => {
                    message.success('关联成功');
                })
                .finally(() => {
                    setSubmitting(false);
                });
        });
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

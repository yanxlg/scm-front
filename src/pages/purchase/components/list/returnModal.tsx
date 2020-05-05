import React, { useMemo, useRef } from 'react';
import { Modal, Divider, Descriptions } from 'antd';
import { FormField, JsonFormRef } from 'react-components/es/JsonForm';
import styles from '@/pages/purchase/_list.less';
import { JsonForm } from 'react-components';

const fieldList: FormField[] = [
    {
        type: 'input',
        name: 'number',
        label: '运单号',
        className: styles.connectInput,
    },
    {
        type: 'select',
        name: 'count',
        label: '物流商',
        className: styles.connectInput,
    },
];

declare interface IReturnModalProps {
    visible: string | false;
    onCancel: () => void;
}
const ReturnModal: React.FC<IReturnModalProps> = ({ visible, onCancel }) => {
    const formRef = useRef<JsonFormRef>(null);
    return useMemo(() => {
        return (
            <Modal title="退货运单号" visible={!!visible} onCancel={onCancel} width={900}>
                <JsonForm
                    fieldList={fieldList}
                    layout="horizontal"
                    ref={formRef}
                    enableCollapse={false}
                />
                <Divider />
                <Descriptions title="退货地址" column={1}>
                    <Descriptions.Item label="收货人">Zhou Maomao</Descriptions.Item>
                    <Descriptions.Item label="手机号">1810000000</Descriptions.Item>
                    <Descriptions.Item label="地址信息">Hangzhou, Zhejiang</Descriptions.Item>
                    <Descriptions.Item label="详细地址">
                        No. 18, Wantang Road, Xihu District, Hangzhou, Zhejiang, China
                    </Descriptions.Item>
                    <Descriptions.Item label="邮政编码">empty</Descriptions.Item>
                </Descriptions>
            </Modal>
        );
    }, []);
};

export default ReturnModal;

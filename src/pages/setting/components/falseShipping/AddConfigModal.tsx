import React, { useMemo, useState, useCallback } from 'react';
import { Modal, Form, Radio, Select, Input } from 'antd';
import { MinusCircleOutlined, PlusCircleOutlined } from '@ant-design/icons';
import classnames from 'classnames';

import styles from '../../_falseShipping.less';

const { Option } = Select;

interface IProps {
    visible: boolean;
    onCancel(): void;
}

const AddConfigModal: React.FC<IProps> = ({ visible, onCancel }) => {
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [form] = Form.useForm();
    const [configNum, setConfigNum] = useState(2);

    const handleCancel = useCallback(() => {
        onCancel();
    }, []);

    const handleOk = useCallback(() => {
        console.log('handleOk');
    }, []);

    return useMemo(() => {
        return (
            <Modal
                title="采购运单号配置"
                width={800}
                visible={visible}
                confirmLoading={confirmLoading}
                onCancel={handleCancel}
                onOk={handleOk}
            >
                <Form form={form}>
                    {new Array(configNum).fill(0).map((item, index) => {
                        return (
                            <div className={styles.item}>
                                {index > 0 ? (
                                    <Form.Item
                                        name={`type-${index}`}
                                        initialValue="1"
                                        className={styles.marginNone}
                                    >
                                        <Radio.Group>
                                            <Radio value="1">或(O)</Radio>
                                            <Radio value="2">与(A)</Radio>
                                        </Radio.Group>
                                    </Form.Item>
                                ) : null}
                                <div className={styles.formItem}>
                                    <Form.Item
                                        name={`value-${index}`}
                                        className={classnames(styles.select, styles.marginNone)}
                                    >
                                        <Select>
                                            <Option value="aaa">bbb</Option>
                                        </Select>
                                    </Form.Item>
                                    <Form.Item name={`label-${index}`} className={styles.input}>
                                        <Input />
                                    </Form.Item>
                                    <div className={styles.operate}>
                                        <MinusCircleOutlined />
                                        <PlusCircleOutlined />
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </Form>
            </Modal>
        );
    }, [visible, confirmLoading, configNum]);
};

export default AddConfigModal;

import React, { useMemo, useState, useCallback } from 'react';
import { Modal, Form, Radio, Select, Input } from 'antd';
import { MinusCircleOutlined, PlusCircleOutlined } from '@ant-design/icons';
import classnames from 'classnames';

import styles from '../../_falseShipping.less';

interface IProps {
    visible: boolean;
    onCancel(): void;
}

const { Option } = Select;

const initialRules = [{ required: true, message: '请输入!' }];

const AddConfigModal: React.FC<IProps> = ({ visible, onCancel }) => {
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [form] = Form.useForm();
    const [configNum, setConfigNum] = useState(1);

    const handleCancel = useCallback(() => {
        onCancel();
    }, []);

    const handleOk = useCallback(async () => {
        // console.log('handleOk', form.getFieldsValue());
        const data = form.validateFields();
    }, []);

    const delConfig = useCallback(() => {
        setConfigNum(configNum - 1);
    }, [configNum]);

    const addConfig = useCallback(() => {
        setConfigNum(configNum + 1);
    }, [configNum]);

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
                                    <Form.Item
                                        name={`label-${index}`}
                                        className={styles.input}
                                        rules={initialRules}
                                    >
                                        <Input />
                                    </Form.Item>
                                    <div className={styles.operate}>
                                        {configNum === index + 1 ? (
                                            <>
                                                {index > 0 ? (
                                                    <MinusCircleOutlined
                                                        className={styles.icon}
                                                        onClick={delConfig}
                                                    />
                                                ) : null}
                                                {3 !== index + 1 ? (
                                                    <PlusCircleOutlined
                                                        className={styles.icon}
                                                        onClick={addConfig}
                                                    />
                                                ) : null}
                                            </>
                                        ) : null}
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

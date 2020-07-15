import React, { useMemo, useState, useCallback } from 'react';
import { Modal, Form, Radio, Select, Input, message } from 'antd';
import { MinusCircleOutlined, PlusCircleOutlined } from '@ant-design/icons';
import classnames from 'classnames';

import styles from '../../_falseShipping.less';
import { falseShippingTypeList } from '@/enums/SettingEnum';
import { IAddVirtualAbnormalItem } from '@/interface/ISetting';
import { addVirtualDeliverySign } from '@/services/setting';

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

    const _addVirtualDeliverySign = useCallback((data: IAddVirtualAbnormalItem[]) => {
        setConfirmLoading(true);
        addVirtualDeliverySign({
            virtual_delivery_content: data,
        })
            .then(res => {
                // console.log('addVirtualDeliverySign', res);
                message.success('新增配置成功！');
                handleCancel();
            })
            .finally(() => {
                setConfirmLoading(false);
            });
    }, []);

    const handleOk = useCallback(async () => {
        // console.log('handleOk', form.getFieldsValue());
        const data = await form.validateFields();
        console.log('handleOk', data);
        const labelList = Object.keys(data).filter(key => key.indexOf('label') > -1);
        const params: IAddVirtualAbnormalItem[] = [];
        labelList.forEach(key => {
            const i = key[6];
            params.push({
                abnormal_type: data[key],
                abnormal_config_detail: data[`value-${i}`],
            });
        });
        _addVirtualDeliverySign(params);
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
                                    <Radio.Group defaultValue="1">
                                        <Radio value="1">与(A)</Radio>
                                    </Radio.Group>
                                ) : null}
                                <div className={styles.formItem}>
                                    <Form.Item
                                        name={`label-${index}`}
                                        className={classnames(styles.select, styles.marginNone)}
                                        initialValue={1}
                                    >
                                        <Select>
                                            {falseShippingTypeList.map(({ name, value }) => {
                                                return <Option value={value}>{name}</Option>;
                                            })}
                                        </Select>
                                    </Form.Item>
                                    <Form.Item
                                        name={`value-${index}`}
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

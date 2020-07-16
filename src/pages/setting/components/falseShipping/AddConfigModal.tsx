import React, { useMemo, useState, useCallback } from 'react';
import { Modal, Form, Radio, Select, Input, message } from 'antd';
import { MinusCircleOutlined, PlusCircleOutlined } from '@ant-design/icons';
import classnames from 'classnames';

import styles from '../../_falseShipping.less';
import {
    falseShippingTypeList,
    falseShippingTypeMap,
    IFalseShippingTypeCode,
} from '@/enums/SettingEnum';
import { IAddVirtualAbnormalItem } from '@/interface/ISetting';
import { addVirtualDeliverySign } from '@/services/setting';
import { IOptionItem } from 'react-components/es/JsonForm/items/Select';

interface IProps {
    visible: boolean;
    allShippingList: IOptionItem[];
    onCancel(): void;
    onReload(): void;
}

const { Option } = Select;

const initialRules = [{ required: true, message: '请输入!' }];

const AddConfigModal: React.FC<IProps> = ({ visible, onCancel, onReload, allShippingList }) => {
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [form] = Form.useForm();
    const [configNum, setConfigNum] = useState(1);

    const handleCancel = useCallback(() => {
        onCancel();
        form.resetFields();
        setConfigNum(1);
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
                onReload();
            })
            .finally(() => {
                setConfirmLoading(false);
            });
    }, []);

    const handleOk = useCallback(async () => {
        // console.log('handleOk', form.getFieldsValue());
        const data = await form.validateFields();
        const labelList = Object.keys(data).filter(key => key.indexOf('label') > -1);
        const params: IAddVirtualAbnormalItem[] = [];
        const abnormalTypeList: IFalseShippingTypeCode[] = [];
        labelList.forEach(key => {
            const i = key[6];
            abnormalTypeList.push(data[key]);
            params.push({
                abnormal_type: data[key],
                abnormal_config_detail: data[`value-${i}`],
            });
        });
        abnormalTypeList.sort();
        for (let i = 0; i < abnormalTypeList.length - 1; i++) {
            if (abnormalTypeList[i] === abnormalTypeList[i + 1]) {
                return message.error(`${falseShippingTypeMap[abnormalTypeList[i]]}配置项重复`);
            }
        }
        // console.log('handleOk', data, params);
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
                                        noStyle
                                        shouldUpdate={(prevValues, currentValues) => {
                                            return (
                                                prevValues[`label-${index}`] === 1 ||
                                                currentValues[`label-${index}`] === 1
                                            );
                                        }}
                                    >
                                        {({ getFieldValue }) => {
                                            const labelValue = getFieldValue(`label-${index}`);
                                            return labelValue &&
                                                getFieldValue(`label-${index}`) !== 1 ? (
                                                <Form.Item
                                                    name={`value-${index}`}
                                                    className={styles.input}
                                                    rules={initialRules}
                                                >
                                                    <Input />
                                                </Form.Item>
                                            ) : (
                                                <Form.Item
                                                    name={`value-${index}`}
                                                    className={styles.input}
                                                    rules={initialRules}
                                                >
                                                    <Select>
                                                        {allShippingList.map(({ name, value }) => (
                                                            <Option value={value}>{name}</Option>
                                                        ))}
                                                    </Select>
                                                </Form.Item>
                                            );
                                        }}
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
    }, [visible, confirmLoading, configNum, allShippingList]);
};

export default AddConfigModal;

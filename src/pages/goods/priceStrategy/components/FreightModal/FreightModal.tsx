import React, { useState, useCallback } from 'react';
import { Modal, Form, Input, Upload, Select, notification, message } from 'antd';
import { LoadingButton } from 'react-components';
import { UploadOutlined, FileExcelOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { requiredRule } from '@/enums/PriceStrategyEnum';
import { IOptionItem } from 'react-components/es/JsonForm/items/Select';

import styles from './_FreightModal.less';
import { saveShippingCard, getShippingCartDetail } from '@/services/price-strategy';
import { downloadTemplateFile } from '@/services/global';

const { TextArea } = Input;
const { Option } = Select;

interface IProps {
    visible: boolean;
    freightType: 'add' | 'update';
    nameList: IOptionItem[];
    onCancel(isRefresh?: boolean): void;
}

const FreightModal: React.FC<IProps> = ({ visible, freightType, onCancel, nameList }) => {
    const [form] = Form.useForm();
    const [name, setName] = useState('');
    const [filename, setFilename] = useState('');

    const handleCancel = useCallback((isRefresh?: boolean) => {
        setName('');
        setFilename('');
        form.resetFields();
        onCancel(isRefresh);
    }, []);

    const handleInputName = useCallback(e => {
        // console.log(111111, e.target.value);
        setName(e.target.value);
    }, []);

    const handleChangeName = useCallback(name => {
        setName(name);
        getShippingCartDetail(name).then(res => {
            // console.log('res', res);
            const { shipping_card } = res.data;
            if (shipping_card && shipping_card.comment) {
                form.setFieldsValue({
                    comment: shipping_card.comment,
                });
            }
        });
    }, []);

    const saveUpload = useCallback(async () => {
        // console.log(11111111, form.getFieldsValue());
        const data = await form.validateFields();
        // console.log('saveUpload', data);
        const { card_name, file, comment } = data;
        const formData = new FormData();
        formData.append('file', file);
        formData.append('is_new', freightType === 'add' ? '1' : '0');
        formData.append('comment', comment || '');
        formData.append('card_name', card_name);
        return saveShippingCard(formData).then(res => {
            // console.log('saveShippingCard', res);
            handleCancel(true);
            if (!res.data) {
                message.success(`${freightType === 'add' ? '新增' : '更新'}成功`);
            } else {
                const { error_list } = res.data;
                if (error_list && error_list.length > 0) {
                    notification.warning({
                        message: '部分导入失败，请重新尝试。',
                        duration: null,
                        description: (
                            <div style={{ maxHeight: 600, overflow: 'auto' }}>
                                {error_list.map((item: any) => {
                                    const { country_code, error_reason } = item;
                                    return (
                                        <p>
                                            {error_reason}-{country_code || ''}
                                        </p>
                                    );
                                })}
                            </div>
                        ),
                    });
                } else {
                    message.success(`${freightType === 'add' ? '新增' : '更新'}成功`);
                }
            }
        });
    }, [freightType]);

    const normFile = useCallback(e => {
        // console.log(1111111, e);
        const { file } = e;
        setFilename(file.name);
        return file;
    }, []);

    const delFile = useCallback(() => {
        setFilename('');
        form.setFieldsValue({
            file: null,
        });
    }, []);

    return (
        <Modal
            title={`${freightType === 'add' ? '新增' : '更新'}运费价卡`}
            width={680}
            footer={null}
            maskClosable={false}
            visible={visible}
            onCancel={() => handleCancel()}
        >
            <Form form={form}>
                <Form.Item
                    label="价卡名称"
                    name="card_name"
                    className={styles.item}
                    rules={[requiredRule]}
                >
                    {freightType === 'add' ? (
                        <Input
                            maxLength={32}
                            placeholder="限制32个字符"
                            className={styles.input}
                            onChange={handleInputName}
                        />
                    ) : (
                        <Select
                            placeholder="请选择"
                            className={styles.input}
                            onChange={handleChangeName}
                        >
                            {nameList.map(({ name, value }) => (
                                <Option key={name} value={value}>
                                    {name}
                                </Option>
                            ))}
                        </Select>
                    )}
                </Form.Item>
                <Form.Item
                    label="上传文件"
                    name="file"
                    valuePropName="file"
                    getValueFromEvent={normFile}
                    className={styles.item}
                    extra={
                        <div className={styles.extra}>
                            仅支持xlsx格式文件 如无模板，可下载
                            <a
                                className={styles.download}
                                onClick={() => downloadTemplateFile('2')}
                            >
                                运费价卡xlsx模板
                            </a>
                        </div>
                    }
                >
                    {filename ? (
                        <div className={styles.filename}>
                            <FileExcelOutlined className={styles.iconFile} />
                            {filename}
                            <CloseCircleOutlined onClick={delFile} className={styles.iconClose} />
                        </div>
                    ) : (
                        <Upload accept=".xlsx" showUploadList={false} beforeUpload={() => false}>
                            <a>
                                <UploadOutlined /> 上传运费价卡表
                            </a>
                        </Upload>
                    )}
                </Form.Item>
                <Form.Item label="备注" name="comment" className={styles.item}>
                    <TextArea />
                </Form.Item>
                <div className={styles.btnSave}>
                    <LoadingButton
                        type="primary"
                        onClick={saveUpload}
                        disabled={!name || !filename}
                    >
                        确认上传
                    </LoadingButton>
                </div>
            </Form>
        </Modal>
    );
};

export default React.memo(FreightModal);

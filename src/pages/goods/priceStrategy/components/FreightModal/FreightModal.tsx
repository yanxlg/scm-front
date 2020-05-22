import React, { useState, useCallback } from 'react';
import { Modal, Form, Input, Upload, Button } from 'antd';

import styles from './_FreightModal.less';
import { UploadOutlined, FileExcelOutlined, CloseCircleOutlined } from '@ant-design/icons';

const { TextArea } = Input;

interface IProps {
    visible: boolean;
    onCancel(): void;
}

const FreightModal: React.FC<IProps> = ({ visible, onCancel }) => {
    const [form] = Form.useForm();
    const [name, setName] = useState('');

    const handleCancel = useCallback(() => {
        setName('');
        onCancel();
    }, []);

    const saveUpload = useCallback(() => {
        console.log(11111111, form.getFieldsValue());
    }, []);

    const normFile = useCallback(e => {
        // console.log(1111111, e);
        const { file } = e;
        setName(file.name);
        return file;
    }, []);

    const delFile = useCallback(() => {
        setName('');
        form.setFieldsValue({
            file: null,
        });
    }, []);

    return (
        <Modal
            title="新增运费价卡"
            width={680}
            footer={null}
            maskClosable={false}
            visible={visible}
            onCancel={handleCancel}
        >
            <Form form={form}>
                <Form.Item label="价卡名称" name="name" className={styles.item}>
                    <Input maxLength={32} placeholder="限制32个字符" className={styles.input} />
                </Form.Item>
                <Form.Item
                    label="上传文件"
                    name="file"
                    valuePropName="file"
                    getValueFromEvent={normFile}
                    extra={
                        <div className={styles.extra}>
                            仅支持CSV格式文件 如无模板，可下载
                            <a className={styles.download}>运费价卡csv模板</a>
                        </div>
                    }
                >
                    {name ? (
                        <div className={styles.filename}>
                            <FileExcelOutlined className={styles.iconFile} />
                            {name}
                            <CloseCircleOutlined onClick={delFile} className={styles.iconClose} />
                        </div>
                    ) : (
                        <Upload accept=".csv" showUploadList={false} beforeUpload={() => false}>
                            <a>
                                <UploadOutlined /> 上传运费价卡表
                            </a>
                        </Upload>
                    )}
                </Form.Item>
                <Form.Item label="备注" name="remark" className={styles.item}>
                    <TextArea placeholder="此规则仅适用于VOVA-新店铺运营1个月内" />
                </Form.Item>
                <div className={styles.btnSave}>
                    <Button type="primary" onClick={saveUpload}>
                        确认上传
                    </Button>
                </div>
            </Form>
        </Modal>
    );
};

export default React.memo(FreightModal);

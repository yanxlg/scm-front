import React, { useState, useCallback } from 'react';
import { Modal, Form, Input, Upload, Button, notification } from 'antd';
import { LoadingButton } from 'react-components';
import { UploadOutlined, FileExcelOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { saveCatagoryWeight } from '@/services/price-strategy';
import classnames from 'classnames';

import styles from './_WeightModal.less';
import { downloadTemplateFile } from '@/services/global';

const { TextArea } = Input;

interface IProps {
    visible: boolean;
    onCancel(isRefresh?: boolean): void;
}

const FreightModal: React.FC<IProps> = ({ visible, onCancel }) => {
    const [form] = Form.useForm();
    const [name, setName] = useState('');
    // const [templateUrl, setTemplateUrl] = useState('');

    const handleCancel = useCallback((isRefresh?: boolean) => {
        setName('');
        form.resetFields();
        onCancel(isRefresh);
    }, []);

    const saveUpload = useCallback(() => {
        // console.log(11111111, form.getFieldsValue());
        const { file, remark } = form.getFieldsValue();
        const data = new FormData();
        data.append('file', file);
        data.append('remark', remark || '');
        return saveCatagoryWeight(data).then(res => {
            const { data } = res;
            if (data && data.length > 0) {
                notification.warning({
                    message: '部分导入失败，请重新尝试。',
                    duration: null,
                    description: (
                        <div style={{ maxHeight: 600, overflow: 'auto' }}>
                            {data.map((item: any) => {
                                const { code, message, category } = item;
                                if (code === '110103') {
                                    const {
                                        firstCategoryName,
                                        firstCategoryId,
                                        secondCategoryName,
                                        secondCategoryId,
                                        thirdCategoryName,
                                        thirdCategoryId,
                                    } = category;
                                    return (
                                        <>
                                            {message}
                                            <p>
                                                {firstCategoryName}-{firstCategoryId};&emsp;
                                                {secondCategoryName}-{secondCategoryId};&emsp;
                                                {thirdCategoryName}-{thirdCategoryId};
                                            </p>
                                        </>
                                    );
                                }
                            })}
                        </div>
                    ),
                });
            }
            handleCancel(true);
        });
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
            title="预估重量批量导入"
            width={680}
            footer={null}
            maskClosable={false}
            visible={visible}
            onCancel={() => handleCancel()}
        >
            <Form form={form}>
                <Form.Item
                    label="上传文件"
                    name="file"
                    valuePropName="file"
                    getValueFromEvent={normFile}
                    extra={
                        <div className={styles.extra}>
                            仅支持xlsx格式文件 如无模板，可下载
                            <a
                                className={classnames(styles.download)}
                                onClick={() => downloadTemplateFile('1')}
                            >
                                品类预估重量xlsx模板
                            </a>
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
                        <Upload accept=".xlsx" showUploadList={false} beforeUpload={() => false}>
                            <a>
                                <UploadOutlined /> 上传品类预估重量表
                            </a>
                        </Upload>
                    )}
                </Form.Item>
                <Form.Item label="备注" name="remark" className={styles.item}>
                    <TextArea placeholder="此规则仅适用于VOVA-新店铺运营1个月内" />
                </Form.Item>
                <div className={styles.btnSave}>
                    <LoadingButton type="primary" onClick={saveUpload} disabled={!name}>
                        确认上传
                    </LoadingButton>
                </div>
            </Form>
        </Modal>
    );
};

export default React.memo(FreightModal);

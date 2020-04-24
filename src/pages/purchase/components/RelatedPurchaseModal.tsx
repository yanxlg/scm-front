import React, { useMemo, useCallback, useState } from 'react';
import { Modal, Form, Input, Row, Col, InputNumber } from 'antd';
import { LoadingButton } from 'react-components';
import classnames from 'classnames';

import styles from '../_abnormal.less';
import formStyles from 'react-components/es/JsonForm/_form.less';

interface IProps {
    visible: boolean;
    onCancel(): void;
}

const RelatedPurchaseModal: React.FC<IProps> = ({
    visible,
    onCancel
}) => {
    const [form] = Form.useForm();
    const [canRelated, setCanRelated] = useState(false);

    const handleOk = useCallback(
        () => {
            console.log('handleOk', form.getFieldsValue());
        },
        [],
    );

    const handleCancel = useCallback(
        () => {
            onCancel();
        },
        []
    );

    return useMemo(() => {
        const disabled = !canRelated;
        return (
            <Modal
                title="关联采购单"
                width={720}
                visible={visible}
                onCancel={handleCancel}
                onOk={handleOk}
                okButtonProps={{
                    disabled
                }}
            >
                <Form form={form}>
                    <div className={styles.relatedBox}>
                        <div className={styles.stepOne}>
                            <div className={styles.title}>关联采购单</div>
                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item name="id" label={<span className={styles.label}>采购单ID</span>}>
                                        <Input placeholder="请输入采购单ID"/>
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <LoadingButton type="primary" className={formStyles.formBtn} onClick={() => Promise.resolve()}>查询</LoadingButton>
                                </Col>
                            </Row>
                            <div className={styles.numberBox}>
                                <div className={classnames(styles.number, styles.one)}>1</div>
                                <div className={classnames(styles.number, styles.two, disabled ? styles.disabled : '')}>2</div>
                                <div className={classnames(styles.line, styles.lineOne)}></div>
                                <div className={classnames(styles.line, styles.lineTwo, disabled ? styles.disabled : '')}></div>
                            </div>
                        </div>
                        {/* className={styles.stepTwo} */}
                        <div className={disabled ? styles.disabled : ''}>
                            <div className={styles.title}>运单号</div>
                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item label={<span className={styles.label}>关联运单号</span>}>
                                        <Input disabled={disabled} placeholder="请输入想关联的运单号"/>
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row gutter={16}>
                                <Col span={8}>
                                    <Form.Item label={<span className={styles.label}>入库数量</span>}>
                                        <InputNumber disabled={disabled} placeholder="请输入数量" className={styles.inputNumber}/>
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Form.Item label={<span className={styles.label}>备注</span>}>
                                <Input.TextArea disabled={disabled} placeholder="原因"/>
                            </Form.Item>
                        </div>
                    </div>
                </Form>
            </Modal>
        )
    }, [visible, canRelated])
}

export default RelatedPurchaseModal;
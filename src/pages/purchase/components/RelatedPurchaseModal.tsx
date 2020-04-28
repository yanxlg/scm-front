import React, { useMemo, useCallback, useState } from 'react';
import { Modal, Form, Input, Row, Col, InputNumber } from 'antd';
import { LoadingButton } from 'react-components';
import classnames from 'classnames';
import { setCorrelateWaybill } from '@/services/purchase';
import { ICorrelateWaybillReq } from '@/interface/IPurchase';

import styles from '../_abnormal.less';
import formStyles from 'react-components/es/JsonForm/_form.less';

const rules = [{ required: true, message: '请输入！' }];

interface IProps {
    visible: boolean;
    onCancel(): void;
}

const RelatedPurchaseModal: React.FC<IProps> = ({ visible, onCancel }) => {
    const [form] = Form.useForm();
    const [canRelated, setCanRelated] = useState(true);

    const handleOk = useCallback(() => {
        form.validateFields().then(vals => {
            console.log('handleOk', vals);
            setCorrelateWaybill(vals as ICorrelateWaybillReq).then((res: any) => {});
        });
    }, []);

    const handleCancel = useCallback(() => {
        onCancel();
    }, []);

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
                    disabled,
                }}
            >
                <Form form={form}>
                    <div className={styles.relatedBox}>
                        <div className={styles.stepOne}>
                            <div className={styles.title}>关联采购单</div>
                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item
                                        name="purchase_order_goods_id"
                                        label={<span className={styles.label}>采购单ID</span>}
                                        required={false}
                                        rules={rules}
                                    >
                                        <Input placeholder="请输入采购单ID" />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <LoadingButton
                                        type="primary"
                                        className={formStyles.formBtn}
                                        onClick={() => Promise.resolve()}
                                    >
                                        查询
                                    </LoadingButton>
                                </Col>
                            </Row>
                            <div className={styles.numberBox}>
                                <div className={classnames(styles.number, styles.one)}>1</div>
                                <div
                                    className={classnames(
                                        styles.number,
                                        styles.two,
                                        disabled ? styles.disabled : '',
                                    )}
                                >
                                    2
                                </div>
                                <div className={classnames(styles.line, styles.lineOne)}></div>
                                <div
                                    className={classnames(
                                        styles.line,
                                        styles.lineTwo,
                                        disabled ? styles.disabled : '',
                                    )}
                                ></div>
                            </div>
                        </div>
                        {/* className={styles.stepTwo} */}
                        <div className={disabled ? styles.disabled : ''}>
                            <div className={styles.title}>运单号</div>
                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item
                                        name="purchase_waybill_no"
                                        label={<span className={styles.label}>关联运单号</span>}
                                        required={false}
                                        rules={rules}
                                    >
                                        <Input
                                            disabled={disabled}
                                            placeholder="请输入想关联的运单号"
                                        />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row gutter={16}>
                                <Col span={8}>
                                    <Form.Item
                                        name="goods_number"
                                        label={<span className={styles.label}>入库数量</span>}
                                        required={false}
                                        rules={rules}
                                    >
                                        <InputNumber
                                            disabled={disabled}
                                            placeholder="请输入数量"
                                            className={styles.inputNumber}
                                        />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Form.Item
                                name="remark"
                                label={<span className={styles.label}>备注</span>}
                                required={false}
                                rules={rules}
                            >
                                <Input.TextArea disabled={disabled} placeholder="原因" />
                            </Form.Item>
                        </div>
                    </div>
                </Form>
            </Modal>
        );
    }, [visible, canRelated]);
};

export default RelatedPurchaseModal;

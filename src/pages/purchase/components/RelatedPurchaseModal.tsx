import React, { useMemo, useCallback, useState } from 'react';
import { Modal, Form, Input, Row, Col, InputNumber } from 'antd';
import { LoadingButton } from 'react-components';
import classnames from 'classnames';
import { setCorrelateWaybill, getPurchaseGoodsInfo } from '@/services/purchase';
import { ICorrelateWaybillReq } from '@/interface/IPurchase';

import styles from '../_abnormal.less';
import formStyles from 'react-components/es/JsonForm/_form.less';

const rules = [{ required: true, message: '请输入！' }];

interface IProps {
    visible: boolean;
    onCancel(): void;
    onRefresh(): void;
}

const RelatedPurchaseModal: React.FC<IProps> = ({ visible, onCancel, onRefresh }) => {
    const [form] = Form.useForm();
    const [purchaseOrderGoodsId, setPurchaseOrderGoodsId] = useState('');
    const [relatedType, setRelatedType] = useState('default');
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [goodsDetail, setGoodsDetail] = useState({
        purchaseGoodsName: '',
        productImageUrl: '',
        productSkuStyle: '',
    });

    // const getPurchaseGoodsInfo =
    const handleSearch = useCallback(() => {
        return getPurchaseGoodsInfo(form.getFieldValue('purchase_order_goods_id'))
            .then(res => {
                // console.log('getPurchaseGoodsInfo', res);
                const { purchaseGoodsName, productImageUrl, productSkuStyle } = res.data;
                setRelatedType('ok');
                setGoodsDetail({
                    purchaseGoodsName,
                    productImageUrl,
                    productSkuStyle,
                });
            })
            .catch(() => {
                setRelatedType('err');
            });
    }, []);

    const handleOk = useCallback(() => {
        form.validateFields().then(({ goods_number, ...rest }) => {
            // console.log('handleOk', vals);as ICorrelateWaybillReq
            setConfirmLoading(true);
            setCorrelateWaybill({
                ...rest,
                goods_number: goods_number + '',
                request_type: 'PURCHASE_ORDER',
            } as ICorrelateWaybillReq)
                .then(() => {
                    onCancel();
                    onRefresh();
                    setConfirmLoading(false);
                })
                .catch(() => {
                    setConfirmLoading(false);
                });
        });
    }, []);

    const handleCancel = useCallback(() => {
        onCancel();
    }, []);

    return useMemo(() => {
        if (!visible) {
            return null;
        }
        const disabled = relatedType !== 'ok';
        const { purchaseGoodsName, productImageUrl, productSkuStyle } = goodsDetail;
        const _productSkuStyle = productSkuStyle ? JSON.parse(productSkuStyle) : productSkuStyle;
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
                confirmLoading={confirmLoading}
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
                                        <Input
                                            onChange={e => setPurchaseOrderGoodsId(e.target.value)}
                                            placeholder="请输入采购单ID"
                                        />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <LoadingButton
                                        type="primary"
                                        disabled={!purchaseOrderGoodsId}
                                        className={formStyles.formBtn}
                                        onClick={handleSearch}
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
                            {relatedType === 'err' && (
                                <p className={styles.red}>未查询到此采购单ID</p>
                            )}
                            {relatedType === 'ok' && (
                                <div className={styles.goodsInfo}>
                                    <img src={productImageUrl} className={styles.img} />
                                    <div className={styles.desc}>
                                        <div className={styles.name}>{purchaseGoodsName}</div>
                                        <div>
                                            {
                                                _productSkuStyle ? (
                                                    Object.keys(_productSkuStyle).map(key => (
                                                        <div key={key} className={styles.styleItem}>{key}: {_productSkuStyle[key]}</div>
                                                    ))
                                                ) : ''
                                            }
                                        </div>
                                    </div>
                                </div>
                            )}
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
                                            precision={0}
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
    }, [visible, relatedType, purchaseOrderGoodsId, goodsDetail, confirmLoading]);
};

export default RelatedPurchaseModal;

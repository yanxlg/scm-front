import React, { useState, useCallback, useMemo } from 'react';
import { Modal, Form, Checkbox, InputNumber, Input, message } from 'antd';
import { IPurchaseAbnormalItem } from '@/interface/IPurchase';
import { setPurchaseException } from '@/services/purchase';

import styles from '../_abnormal.less';

const rules = [{ required: true, message: '请输入！' }];

interface IProps {
    visible: boolean;
    currentRecord: IPurchaseAbnormalItem | null;
    onCancel(): void;
    onRefresh(): void;
}

const AbnormalModal: React.FC<IProps> = ({ visible, currentRecord, onCancel, onRefresh }) => {
    if (!visible) {
        return null;
    }
    const {
        waybillExceptionType,
        waybillExceptionSn,
        purchaseOrderGoodsId,
    } = currentRecord as IPurchaseAbnormalItem;
    const [form] = Form.useForm();
    const [checkedList, setCheckedList] = useState<number[]>([]);
    const [confirmLoading, setConfirmLoading] = useState(false);

    const handleOk = useCallback(async () => {
        const { reject_count, in_storage_count, ...rest } = await form.validateFields();
        setConfirmLoading(true);
        return setPurchaseException({
            ...rest,
            reject_count: (reject_count || '') + '',
            in_storage_count: (in_storage_count || '') + '',
            purchase_order_goods_id: purchaseOrderGoodsId,
            waybill_exception_sn: waybillExceptionSn,
            exec_type: checkedList,
        })
            .then((res: any) => {
                for (const key in res.data) {
                    const val = res.data[key];
                    if (!Array.isArray(val) && val?.type === 'failed') {
                        setConfirmLoading(false);
                        return message.error(val.res);
                    }
                }
                message.success('操作成功');
                setConfirmLoading(false);
                onCancel();
                onRefresh();
            })
            .catch(() => {
                setConfirmLoading(false);
            });
    }, [checkedList]);

    const handleCancel = useCallback(() => {
        onCancel();
    }, []);

    const handleCheckboxChange = useCallback(vals => {
        // console.log('val', vals);
        setCheckedList(vals);
    }, []);

    return useMemo(() => {
        return (
            <Modal
                title="异常处理"
                width={720}
                visible={visible}
                onOk={handleOk}
                onCancel={handleCancel}
                confirmLoading={confirmLoading}
                okButtonProps={{
                    disabled: checkedList.length === 0,
                }}
            >
                <Form form={form} className={styles.abnormalModal}>
                    <div className={styles.title}>请选择需要的操作</div>
                    <Checkbox.Group value={checkedList} onChange={handleCheckboxChange}>
                        {waybillExceptionType === '102' ? (
                            <Checkbox value={1} className={styles.checkbox}>
                                退款
                            </Checkbox>
                        ) : (
                            <>
                                <Checkbox value={1} className={styles.checkbox}>
                                    退款
                                </Checkbox>
                                <Checkbox value={2} className={styles.checkbox}>
                                    拒收
                                </Checkbox>
                                <Checkbox value={3} className={styles.checkbox}>
                                    补发
                                </Checkbox>
                            </>
                        )}
                    </Checkbox.Group>
                    {// 拒收
                    checkedList.indexOf(2) > -1 && (
                        <div className={styles.sectionBox}>
                            <Form.Item
                                name="reject_count"
                                className={styles.itemBox}
                                label={<span className={styles.label}>拒收数量</span>}
                                rules={rules}
                                required={false}
                            >
                                <InputNumber
                                    precision={0}
                                    className={styles.inputNumber}
                                    placeholder="请输入数量"
                                />
                            </Form.Item>
                            <Form.Item
                                name="receive_name"
                                className={styles.itemBox}
                                label={<span className={styles.label}>收货人</span>}
                                rules={rules}
                                required={false}
                            >
                                <Input placeholder="请输入收货人姓名" />
                            </Form.Item>
                            <Form.Item
                                name="receive_tel"
                                className={styles.itemBox}
                                label={<span className={styles.label}>手机号</span>}
                                rules={rules}
                                required={false}
                            >
                                <Input placeholder="请输入手机号" />
                            </Form.Item>
                            <Form.Item
                                name="receive_address"
                                className={styles.cascaderBox}
                                label={<span className={styles.label}>地址信息</span>}
                                rules={rules}
                                required={false}
                            >
                                <Input placeholder="请输入省/市/区/街道" />
                            </Form.Item>
                            <Form.Item
                                name="receive_address_detail"
                                label={<span className={styles.label}>详细地址</span>}
                                rules={rules}
                                required={false}
                            >
                                <Input.TextArea placeholder="请输入详细的地址信息，如道路、门牌号、小区、楼栋号、单元等信息" />
                            </Form.Item>
                            <Form.Item
                                name="zip_code"
                                className={styles.itemBox}
                                label={<span className={styles.label}>邮政编码</span>}
                                rules={rules}
                                required={false}
                            >
                                <Input placeholder="填写编码" />
                            </Form.Item>
                        </div>
                    )}
                    {// 补发
                    checkedList.indexOf(3) > -1 && (
                        <div className={styles.sectionBox}>
                            <Form.Item
                                name="waybill_no"
                                className={styles.itemBox}
                                label={<span className={styles.label}>运单号</span>}
                                rules={rules}
                                required={false}
                            >
                                <Input className={styles.inputNumber} placeholder="关联运单号" />
                            </Form.Item>
                            <Form.Item
                                name="in_storage_count"
                                className={styles.itemBox}
                                label={<span className={styles.label}>入库数量</span>}
                                rules={rules}
                                required={false}
                            >
                                <InputNumber
                                    precision={0}
                                    className={styles.inputNumber}
                                    placeholder="请输入数量"
                                />
                            </Form.Item>
                        </div>
                    )}
                    {checkedList.length > 0 && (
                        <div className={styles.remark}>
                            <Form.Item
                                name="remarks"
                                label={<span className={styles.label}>备注</span>}
                                rules={rules}
                                required={false}
                            >
                                <Input.TextArea placeholder="原因" />
                            </Form.Item>
                        </div>
                    )}
                </Form>
            </Modal>
        );
    }, [visible, checkedList, confirmLoading]);
};

export default AbnormalModal;

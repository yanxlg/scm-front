import React, { useMemo, useState, useCallback, useEffect } from 'react';
import { Modal, Form, Input, Button, message, InputNumber } from 'antd';
import { Icons } from '@/components/Icon';
import { IPurchaseAbnormalItem, IDiscardAbnormalOrderReq } from '@/interface/IPurchase';

import styles from '../../_abnormal.less';
import { setDiscardAbnormalOrder } from '@/services/purchase';

interface IProps {
    visible: boolean;
    currentRecord: IPurchaseAbnormalItem | null;
    onCancel(): void;
    onRefresh(): Promise<void>;
}

const DetailModal: React.FC<IProps> = ({ visible, currentRecord, onCancel, onRefresh }) => {
    const [form] = Form.useForm();
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const { remark, waybillExceptionHandle, waybillExceptionStatus } =
        (currentRecord as IPurchaseAbnormalItem) || {};
    let info: any = {};
    try {
        info = JSON.parse(remark);
    } catch (err) {}
    // console.log(111111, info);

    const handleEdit = useCallback(() => {
        setIsEdit(!isEdit);
    }, [isEdit]);

    const handleOk = useCallback(() => {
        // console.log('onOk', form.getFieldsValue());
        setConfirmLoading(true);
        return setDiscardAbnormalOrder({
            ...info,
            ...form.getFieldsValue(),
            handle_type: ['3'],
        } as IDiscardAbnormalOrderReq)
            .then((res: any) => {
                message.success('更新成功');
                setConfirmLoading(false);
                handleCancel();
                onRefresh();
            })
            .catch(() => {
                setConfirmLoading(false);
            });
    }, [visible]);

    const handleCancel = useCallback(() => {
        setIsEdit(false);
        onCancel();
    }, []);

    useEffect(() => {
        if (isEdit) {
            form.setFieldsValue(info);
        }
    }, [isEdit]);

    return useMemo(() => {
        if (!visible) {
            return null;
        }
        const {
            abnormal_operate_type,
            reject_count,
            receive_name,
            receive_tel,
            receive_address,
            receive_address_detail,
            zip_code,
            waybill_no,
            in_storage_count,
            remarks,
        } = info;

        let isRefund: boolean = false;
        let isReject: boolean = false;
        let isReplenishment: boolean = false;
        const hasExceptionHandle = waybillExceptionHandle && waybillExceptionHandle.length > 0;
        const hasUpdate =
            waybillExceptionStatus !== 3 &&
            waybillExceptionHandle &&
            waybillExceptionHandle.findIndex(({ handleType }) => handleType === 3) > -1;

        waybillExceptionHandle?.forEach(({ handleType }) => {
            handleType === 2 && (isRefund = true);
            handleType === 3 && (isReject = true);
            handleType === 4 && (isReplenishment = true);
        });

        return (
            <Modal
                title="查看详情"
                width={720}
                visible={visible}
                onCancel={handleCancel}
                footer={isEdit ? undefined : null}
                className={styles.detailModal}
                onOk={handleOk}
                confirmLoading={confirmLoading}
            >
                {hasExceptionHandle ? (
                    <>
                        <div className={styles.iconSection}>
                            {isRefund && (
                                <div className={styles.iconBox}>
                                    <Icons type="scm-tuikuan" className={styles.icon1} />
                                    <div>退款</div>
                                </div>
                            )}
                            {isReject && (
                                <div className={styles.iconBox}>
                                    <Icons type="scm-tuihuo" className={styles.icon2} />
                                    <div>退货</div>
                                </div>
                            )}
                            {isReplenishment && (
                                <div className={styles.iconBox}>
                                    <Icons type="scm-fahuo" className={styles.icon3} />
                                    <div>补发</div>
                                </div>
                            )}
                        </div>
                        <Form form={form} className={styles.form}>
                            {isReject && (
                                <>
                                    <Form.Item label="拒收数量" name="reject_count">
                                        {isEdit ? (
                                            <InputNumber min={1} precision={0} />
                                        ) : (
                                            <div>{reject_count}</div>
                                        )}
                                    </Form.Item>
                                    <Form.Item label="收货人" name="receive_name">
                                        {isEdit ? <Input /> : <div>{receive_name}</div>}
                                    </Form.Item>
                                    <Form.Item label="手机号" name="receive_tel">
                                        {isEdit ? <Input /> : <div>{receive_tel}</div>}
                                    </Form.Item>
                                    <Form.Item label="地址信息" name="receive_address">
                                        {isEdit ? <Input /> : <div>{receive_address}</div>}
                                    </Form.Item>
                                    <Form.Item label="详细地址" name="receive_address_detail">
                                        {isEdit ? <Input /> : <div>{receive_address_detail}</div>}
                                    </Form.Item>
                                    <Form.Item label="邮政编码" name="zip_code">
                                        {isEdit ? <Input /> : <div>{zip_code}</div>}
                                    </Form.Item>
                                </>
                            )}
                            {isReplenishment && (
                                <>
                                    <Form.Item label="补发运单号">
                                        <div>{waybill_no}</div>
                                    </Form.Item>
                                    <Form.Item label="入库数量">
                                        <div>{in_storage_count}</div>
                                    </Form.Item>
                                </>
                            )}
                            <Form.Item label="备注" name="remarks">
                                {isEdit ? <Input /> : <div>{remarks}</div>}
                            </Form.Item>
                            {hasUpdate && (
                                <a className={styles.edit} onClick={handleEdit}>
                                    {isEdit ? '取消修改' : '修改'}
                                </a>
                            )}
                        </Form>
                    </>
                ) : (
                    <p>订单没进行过异常处理</p>
                )}
            </Modal>
        );
    }, [visible, isEdit, confirmLoading]);
};

export default DetailModal;

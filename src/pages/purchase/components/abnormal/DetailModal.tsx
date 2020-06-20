import React, { useMemo, useState, useCallback, useEffect } from 'react';
import { Modal, Form, Input, Button } from 'antd';
import { Icons } from '@/components/Icon';
import { IPurchaseAbnormalItem } from '@/interface/IPurchase';

import styles from '../../_abnormal.less';

interface IProps {
    visible: boolean;
    currentRecord: IPurchaseAbnormalItem | null;
    onCancel(): void;
}

const DetailModal: React.FC<IProps> = ({ visible, onCancel, currentRecord }) => {
    const [form] = Form.useForm();
    const [isEdit, setIsEdit] = useState(false);
    const { remark } = (currentRecord as IPurchaseAbnormalItem) || {};
    let info: any = {};
    try {
        info = JSON.parse(remark);
    } catch (err) {}
    // console.log(111111, info);

    const handleEdit = useCallback(() => {
        setIsEdit(!isEdit);
    }, [isEdit]);

    const handleOk = useCallback(() => {
        console.log('onOk', form.getFieldsValue());
    }, []);

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
            // in_storage_count,
            remarks,
        } = info;
        const operateList = (abnormal_operate_type || '').split(',');
        const isRefund = operateList.indexOf('退款') > -1;
        const isReject = operateList.indexOf('拒收') > -1;
        const isReplenishment = operateList.indexOf('补货') > -1;

        return (
            <Modal
                title="查看详情"
                width={720}
                visible={visible}
                onCancel={handleCancel}
                footer={isEdit ? undefined : null}
                className={styles.detailModal}
                onOk={handleOk}
            >
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
                            <div>拒收</div>
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
                                {isEdit ? <Input /> : <div>{reject_count}</div>}
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
                        <Form.Item label="补发运单号">
                            <div>{waybill_no}</div>
                        </Form.Item>
                    )}
                    <Form.Item label="备注" name="remarks">
                        {isEdit ? <Input /> : <div>{remarks}</div>}
                    </Form.Item>
                    <a className={styles.edit} onClick={handleEdit}>
                        {isEdit ? '取消修改' : '修改'}
                    </a>
                </Form>
            </Modal>
        );
    }, [visible, isEdit]);
};

export default DetailModal;

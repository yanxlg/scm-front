import React, { useState, useCallback, useMemo, useContext } from 'react';
import { Modal, Form, Checkbox, InputNumber, Input, message, Select } from 'antd';
import {
    IPurchaseAbnormalItem,
    IDiscardAbnormalOrderReq,
    IExceptionOperationDetailItem,
    IExceptionHandleType,
} from '@/interface/IPurchase';
import { setDiscardAbnormalOrder } from '@/services/purchase';

import styles from '../../_abnormal.less';
import { carrierList } from '@/config/global';
import { AbnormalContext } from '../../abnormal';
import { OperateType } from '@/enums/PurchaseEnum';

const rules = [{ required: true, message: '请输入！' }];

interface IProps {
    visible: boolean;
    currentRecord: IPurchaseAbnormalItem | null;
    onCancel(): void;
    onRefresh(): void;
}

const AbnormalModal: React.FC<IProps> = ({ visible, currentRecord, onCancel, onRefresh }) => {
    const { waybillExceptionType, waybillExceptionSn, purchaseOrderGoodsId } =
        (currentRecord as IPurchaseAbnormalItem) || {};
    const [form] = Form.useForm();
    const [checkedList, setCheckedList] = useState<IExceptionHandleType[]>([]);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const abnormalContext = useContext(AbnormalContext);

    let exceptionOperationList: IExceptionOperationDetailItem[] = [];

    abnormalContext?.exception_strategy?.forEach(
        ({ exception_operation_id, exception_operation_detail }) => {
            if (exception_operation_id === OperateType.exceptionHandle) {
                exceptionOperationList = exception_operation_detail as IExceptionOperationDetailItem[];
            }
        },
    );

    useMemo(() => {
        if (visible) {
            setCheckedList([]);
            form.resetFields();
        }
    }, [visible]);

    const handleOk = useCallback(async () => {
        const { reject_count, in_storage_count, ...rest } = await form.validateFields();
        setConfirmLoading(true);
        return setDiscardAbnormalOrder({
            ...rest,
            reject_count: (reject_count || '') + '',
            in_storage_count: (in_storage_count || '') + '',
            purchase_order_goods_id: purchaseOrderGoodsId,
            waybill_exception_sn: waybillExceptionSn,
            handle_type: checkedList,
        } as IDiscardAbnormalOrderReq)
            .then((res: any) => {
                // for (const key in res.data) {
                //     const val = res.data[key];
                //     if (!Array.isArray(val) && val?.type === 'failed') {
                //         setConfirmLoading(false);
                //         return message.error(val.res);
                //     }
                // }
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
        if (!visible) {
            return null;
        }
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
                        {exceptionOperationList.map(
                            ({
                                second_exception_operation_id,
                                second_exception_operation_name,
                                second_show_exception_type,
                            }) => {
                                let type: IExceptionHandleType =
                                    second_exception_operation_id === 1
                                        ? '2'
                                        : second_exception_operation_id === 2
                                        ? '3'
                                        : '4';
                                return second_show_exception_type.indexOf(waybillExceptionType) >
                                    -1 ? (
                                    <Checkbox
                                        key={second_exception_operation_name}
                                        value={type}
                                        className={styles.checkbox}
                                    >
                                        {second_exception_operation_name}
                                    </Checkbox>
                                ) : null;
                            },
                        )}
                    </Checkbox.Group>
                    {// 退货
                    checkedList.indexOf('3') > -1 && (
                        <div className={styles.sectionBox}>
                            <Form.Item
                                name="reject_count"
                                className={styles.itemBox}
                                label="拒收数量"
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
                                label="收货人"
                                required={false}
                            >
                                <Input placeholder="请输入收货人姓名" />
                            </Form.Item>
                            <Form.Item
                                name="receive_tel"
                                className={styles.itemBox}
                                label="手机号"
                                required={false}
                            >
                                <Input placeholder="请输入手机号" />
                            </Form.Item>
                            <Form.Item
                                name="receive_address"
                                className={styles.cascaderBox}
                                label="地址信息"
                                required={false}
                            >
                                <Input placeholder="请输入省/市/区/街道" />
                            </Form.Item>
                            <Form.Item
                                name="receive_address_detail"
                                label="详细地址"
                                required={false}
                            >
                                <Input.TextArea placeholder="请输入详细的地址信息，如道路、门牌号、小区、楼栋号、单元等信息" />
                            </Form.Item>
                            <Form.Item
                                name="zip_code"
                                className={styles.itemBox}
                                label="邮政编码"
                                required={false}
                            >
                                <Input placeholder="填写编码" />
                            </Form.Item>
                        </div>
                    )}
                    {// 补发
                    checkedList.indexOf('4') > -1 && (
                        <div className={styles.sectionBox}>
                            <Form.Item
                                name="waybill_no"
                                className={styles.itemBox}
                                label="运单号"
                                rules={rules}
                            >
                                <Input className={styles.inputNumber} placeholder="关联运单号" />
                            </Form.Item>
                            <Form.Item
                                name="purchase_shipping_name"
                                className={styles.itemBox}
                                label="物流商"
                                rules={rules}
                            >
                                <Select className={styles.inputNumber} placeholder="请选择物流商">
                                    {carrierList.map(({ name }) => {
                                        return (
                                            <Select.Option value={name} key={name}>
                                                {name}
                                            </Select.Option>
                                        );
                                    })}
                                </Select>
                            </Form.Item>
                            <Form.Item
                                name="in_storage_count"
                                className={styles.itemBox}
                                label="入库数量"
                                rules={rules}
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
                            <Form.Item name="remarks" label="备注" rules={rules}>
                                <Input.TextArea placeholder="原因" />
                            </Form.Item>
                        </div>
                    )}
                </Form>
            </Modal>
        );
    }, [visible, checkedList, confirmLoading, abnormalContext]);
};

export default AbnormalModal;
import React, { useMemo, useCallback, useState, useEffect } from 'react';
import { Popconfirm, Button, message, Form, Radio } from 'antd';

import styles from './_PopSetProgress.less';
import { updateWaybillExceptionPregress } from '@/services/purchase';
import { IHandleItem } from '@/interface/IPurchase';
import { refundStatusList, reissueStatusList, returnStatusList } from '@/enums/PurchaseEnum';
import { PermissionComponent } from 'rc-permission';

declare interface IProps {
    waybillExceptionSn: string;
    handle: IHandleItem[];
    onReload(): Promise<void>;
}

const PopSetProgress: React.FC<IProps> = ({ waybillExceptionSn, handle, onReload }) => {
    const [form] = Form.useForm();
    const [disabled, setDisabled] = useState(true);
    const [visible, setVisible] = useState(false);
    const onConfirm = useCallback(() => {
        const { refund_status, return_status, reissue_status } = form.getFieldsValue();
        updateWaybillExceptionPregress({
            waybill_exception_sn: waybillExceptionSn,
            handle_status: [refund_status, return_status, reissue_status].filter(val => val),
        }).then(() => {
            message.success('处理方式更新成功');
            onReload();
        });
    }, []);

    const setFields = useCallback(() => {
        handle.forEach(({ handleType, handleStatus }) => {
            switch (handleType) {
                case 2:
                    form.setFieldsValue({
                        refund_status: handleStatus,
                    });
                    break;
                case 3:
                    form.setFieldsValue({
                        return_status: handleStatus,
                    });
                    break;
                case 4:
                    form.setFieldsValue({
                        reissue_status: handleStatus,
                    });
                    break;
                default:
            }
        });
    }, [handle]);

    const onVisibleChange = useCallback(
        visible => {
            if (visible && handle.length > 0) {
                setDisabled(false);
            }
            setVisible(visible);
        },
        [handle],
    );

    const onValuesChange = useCallback(() => {
        setDisabled(false);
    }, []);

    const progressNode = useMemo(() => {
        return (
            <Form form={form} onValuesChange={onValuesChange} className={styles.form}>
                {handle.map(({ handleType, handleStatus }) => {
                    switch (handleType) {
                        case 2:
                            return (
                                <Form.Item
                                    label="退款进度"
                                    name="refund_status"
                                    initialValue={handleStatus}
                                >
                                    <Radio.Group>
                                        {refundStatusList.map(({ name, value }) => (
                                            <Radio value={value} key={value}>
                                                {name}
                                            </Radio>
                                        ))}
                                    </Radio.Group>
                                </Form.Item>
                            );
                        case 3:
                            return (
                                <Form.Item
                                    label="退货进度"
                                    name="return_status"
                                    initialValue={handleStatus}
                                >
                                    <Radio.Group>
                                        {returnStatusList.map(({ name, value }) => (
                                            <Radio value={value} key={value}>
                                                {name}
                                            </Radio>
                                        ))}
                                    </Radio.Group>
                                </Form.Item>
                            );
                        case 4:
                            return (
                                <Form.Item
                                    label="补发进度"
                                    name="reissue_status"
                                    initialValue={handleStatus}
                                >
                                    <Radio.Group>
                                        {reissueStatusList.map(({ name, value }) => (
                                            <Radio value={value} key={value}>
                                                {name}
                                            </Radio>
                                        ))}
                                    </Radio.Group>
                                </Form.Item>
                            );
                        default:
                    }
                })}
            </Form>
        );
    }, []);

    useEffect(() => {
        if (visible) {
            setFields();
        }
    }, [visible]);

    return useMemo(() => {
        return (
            <PermissionComponent pid="purchase/abnormal/update_progress" control="tooltip">
                <Popconfirm
                    placement="bottom"
                    okText="确定"
                    cancelText="取消"
                    icon={null}
                    title={progressNode}
                    onConfirm={onConfirm}
                    // onCancel={onCancel}
                    onVisibleChange={onVisibleChange}
                    okButtonProps={{
                        disabled,
                    }}
                >
                    <Button type="link">修改</Button>
                </Popconfirm>
            </PermissionComponent>
        );
    }, [progressNode, disabled]);
};

export default PopSetProgress;

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Modal, Divider, Descriptions, Spin, message } from 'antd';
import { FormField, JsonFormRef } from 'react-components/es/JsonForm';
import styles from '@/pages/purchase/_list.less';
import { JsonForm, useDataSet } from 'react-components';
import { addWaybill, queryReturnInfo, queryReturnList } from '@/services/purchase';
import { IReturnInfo, IReturnItem } from '@/interface/IPurchase';
import { EmptyObject } from '@/config/global';

const optionList = [
    {
        name: '中通快递',
        value: 115,
    },
    {
        name: '韵达快递',
        value: 121,
    },
    {
        name: '圆通快递',
        value: 85,
    },
    {
        name: '申通快递',
        value: 1,
    },
    {
        name: '百世快递',
        value: 3,
    },
    {
        name: '天天快递',
        value: 119,
    },
    {
        name: '邮政快递包裹',
        value: 132,
    },
    {
        name: '优速快递',
        value: 117,
    },
    {
        name: '邮政EMS',
        value: 118,
    },
    {
        name: '顺丰快递',
        value: 44,
    },
    {
        name: '安能快递',
        value: 208,
    },
    {
        name: '国通快递',
        value: 124,
    },
    {
        name: '宅急送快递',
        value: 129,
    },
    {
        name: '德邦快递',
        value: 131,
    },
    {
        name: '其他',
        value: 180,
    },
];

const fieldList: FormField[] = [
    {
        type: 'input',
        name: 'tracking_number',
        label: '运单号',
        className: styles.connectInput,
        rules: [
            {
                required: true,
                message: '请输入运单号',
            },
        ],
    },
    {
        type: 'select',
        name: 'shipping_id',
        label: '物流商',
        className: styles.connectInput,
        optionList: optionList,
        rules: [
            {
                required: true,
                message: '请选择物流商',
            },
        ],
    },
];

declare interface IReturnModalProps {
    visible: string | false;
    onCancel: () => void;
}
const ReturnModal: React.FC<IReturnModalProps> = ({ visible, onCancel }) => {
    const formRef = useRef<JsonFormRef>(null);

    const [loading, setLoading] = useState(false);
    const [dataSet, setDataSet] = useState<IReturnItem>(EmptyObject);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (visible) {
            setDataSet(EmptyObject);
            formRef.current?.resetFields();
            const api = queryReturnList({
                purchase_order_goods_id: visible,
            });
            setLoading(true);
            api.request()
                .then(({ data: { list = [] } = EmptyObject }) => {
                    const item = list[0];
                    if (item) {
                        setDataSet(item);
                    }
                })
                .finally(() => {
                    setLoading(false);
                });
            return () => {
                api.cancel();
            };
        } else {
            setLoading(false);
        }
    }, [visible]);

    const onSubmit = useCallback(() => {
        formRef.current!.validateFields().then(values => {
            const shipping_name = optionList.find(item => item.value === values.shipping_id)?.name;
            setSubmitting(true);
            addWaybill({ ...values, purchase_order_goods_id: visible, shipping_name })
                .request()
                .then(() => {
                    message.success('运货单填写成功！');
                })
                .finally(() => {
                    setSubmitting(false);
                });
        });
    }, [visible]);

    return useMemo(() => {
        return (
            <Modal
                title="退货运单号"
                visible={!!visible}
                onCancel={onCancel}
                width={900}
                onOk={onSubmit}
                confirmLoading={submitting}
            >
                <JsonForm
                    fieldList={fieldList}
                    layout="horizontal"
                    ref={formRef}
                    enableCollapse={false}
                />
                <Divider />
                <Spin spinning={loading}>
                    <Descriptions title="退货地址" column={1}>
                        <Descriptions.Item label="收货人">{dataSet.receiverName}</Descriptions.Item>
                        <Descriptions.Item label="手机号">{dataSet.receiverTel}</Descriptions.Item>
                        <Descriptions.Item label="地址信息">
                            {dataSet.receiverProvince
                                ? `${dataSet.receiverProvince}/${dataSet.receiverCity}/${dataSet.receiverStreet}`
                                : ''}
                        </Descriptions.Item>
                        <Descriptions.Item label="详细地址">
                            {dataSet.receiverAddress}
                        </Descriptions.Item>
                        <Descriptions.Item label="邮政编码">
                            {dataSet.receiverCode}
                        </Descriptions.Item>
                    </Descriptions>
                </Spin>
            </Modal>
        );
    }, [loading, visible, submitting]);
};

export default ReturnModal;

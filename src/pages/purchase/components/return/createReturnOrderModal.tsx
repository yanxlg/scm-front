import React, { useCallback, useMemo, useRef, useState } from 'react';
import { Button, message, Modal, Steps } from 'antd';
import { JsonForm, LoadingButton } from 'react-components';
import { FormField, JsonFormRef } from 'react-components/es/JsonForm';
import formStyles from 'react-components/es/JsonForm/_form.less';
import styles from '@/pages/purchase/_return.less';
import { IAddressItem } from '@/interface/IPurchase';
import { addReturn, queryPurchaseList } from '@/services/purchase';

declare interface ICreateReturnOrderModalProps {
    visible: boolean;
    onCancel: () => void;
    addressDataSet: IAddressItem[];
}

const fieldList: FormField[] = [
    { label: '采购单ID', type: 'number', name: 'purchase_order_goods_id', formatter: 'number' },
];

const CreateReturnOrderModal: React.FC<ICreateReturnOrderModalProps> = ({
    visible,
    onCancel,
    addressDataSet,
}) => {
    const form1 = useRef<JsonFormRef>(null);
    const form2 = useRef<JsonFormRef>(null);
    const [goods, setGoods] = useState(false);
    const [current, setCurrent] = useState(0);

    useMemo(() => {
        if (visible) {
            form1.current?.resetFields();
            form2.current?.resetFields();
        }
    }, [visible]);

    const onSearch = useCallback(() => {
        return form1.current!.validateFields().then(values => {
            const { purchase_order_goods_id } = values;
            return queryPurchaseList({
                type: 0,
                purchase_order_goods_id: purchase_order_goods_id,
            })
                .request()
                .then(() => {
                    setGoods(true);
                    setCurrent(1);
                });
        });
    }, []);

    const fieldList1: FormField[] = useMemo(() => {
        const disabled = current === 0;
        return [
            {
                label: '退货数量',
                type: 'positiveInteger',
                name: 'return_number',
                rules: [{ required: true, message: '请输入退货数量' }],
                className: styles.formInput,
                formatter: 'number',
                disabled,
            },
            {
                label: <span>收 货 人</span>,
                type: 'input',
                name: 'receiver_name',
                rules: [{ required: true, message: '请输入收货人' }],
                className: styles.formInput,
                disabled,
            },
            {
                label: <span>手 机 号</span>,
                type: 'input',
                name: 'receiver_tel',
                className: styles.formInput,
                rules: [{ required: true, message: '请输入手机号' }],
                disabled,
            },
            {
                label: '地址信息',
                type: 'cascader',
                name: 'address',
                rules: [
                    { required: true, message: '请选择收货地址' },
                    {
                        validator: (_, value) => {
                            return value.length === 3
                                ? Promise.resolve()
                                : Promise.reject('请选择收货地址');
                        },
                    },
                ],
                className: styles.formInput,
                disabled,
                options: addressDataSet,
                fieldNames: {
                    label: 'label',
                    value: 'label',
                    children: 'children',
                },
            },
            {
                label: '详细地址',
                type: 'textarea',
                name: 'receiver_address',
                rules: [{ required: true, message: '请输入详细地址' }],
                className: styles.formTextarea,
                disabled,
            },
            {
                label: '邮政编码',
                type: 'number',
                name: 'receiver_code',
                rules: [{ required: true, message: '请输入邮政编码' }],
                className: styles.formInput,
                disabled,
            },
        ];
    }, [current, addressDataSet]);

    const onSubmit = useCallback(() => {
        Promise.all([form1.current?.validateFields(), form2.current?.validateFields()]).then(() => {
            const values = {
                ...form1.current!.getFieldsValue(),
                ...form2.current!.getFieldsValue(),
            };
            const {
                address: [receiver_province, receiver_city, receiver_street],
                ...extra
            } = values;
            addReturn({
                ...extra,
                receiver_province,
                receiver_city,
                receiver_street,
            })
                .request()
                .then(() => {
                    message.success('创建成功！');
                    onCancel();
                });
        });
    }, []);

    return useMemo(() => {
        return (
            <Modal
                title="创建退货单"
                visible={visible}
                onCancel={onCancel}
                width={900}
                onOk={onSubmit}
            >
                <Steps
                    direction="vertical"
                    current={current}
                    size="small"
                    status="process"
                    className={styles.steps}
                >
                    <Steps.Step
                        title="关联采购单"
                        icon={1}
                        description={
                            <div>
                                <JsonForm ref={form1} fieldList={fieldList} enableCollapse={false}>
                                    <LoadingButton
                                        type="primary"
                                        className={formStyles.formBtn}
                                        onClick={onSearch}
                                    >
                                        查询
                                    </LoadingButton>
                                </JsonForm>
                                {goods ? (
                                    <div>
                                        <div>title</div>
                                        <div>content</div>
                                    </div>
                                ) : null}
                            </div>
                        }
                    />
                    <Steps.Step
                        title="填写退货信息"
                        description={
                            <JsonForm
                                ref={form2}
                                className={formStyles.formHelpAbsolute}
                                enableCollapse={false}
                                layout="horizontal"
                                fieldList={fieldList1}
                                labelClassName={styles.formLabel}
                            />
                        }
                    />
                </Steps>
            </Modal>
        );
    }, [goods, current, visible, addressDataSet]);
};

export default CreateReturnOrderModal;

import React, { useCallback, useMemo, useRef, useState } from 'react';
import { Button, Col, message, Modal, Row, Steps } from 'antd';
import { AutoEnLargeImg, JsonForm, LoadingButton } from 'react-components';
import { FormField, JsonFormRef } from 'react-components/es/JsonForm';
import formStyles from 'react-components/es/JsonForm/_form.less';
import styles from '@/pages/purchase/_return.less';
import { IAddressItem, IPurchaseItem } from '@/interface/IPurchase';
import { addReturn, queryPurchaseList } from '@/services/purchase';
import { EmptyObject } from '@/config/global';
import classNames from 'classnames';
import similarStyles from '@/pages/order/components/similarStyle/_similar.less';
import { RuleObject, StoreValue } from 'rc-field-form/lib/interface';

declare interface ICreateReturnOrderModalProps {
    visible: boolean;
    onCancel: () => void;
    addressDataSet: IAddressItem[];
}

const fieldList: FormField[] = [
    {
        label: '采购单ID',
        type: 'number',
        name: 'purchase_order_goods_id',
        rules: [{ required: true, message: '请填写采购单ID' }],
    },
];

const CreateReturnOrderModal: React.FC<ICreateReturnOrderModalProps> = ({
    visible,
    onCancel,
    addressDataSet,
}) => {
    const form1 = useRef<JsonFormRef>(null);
    const form2 = useRef<JsonFormRef>(null);
    const [goods, setGoods] = useState<IPurchaseItem>();
    const [current, setCurrent] = useState(0);
    const [submitting, setSubmitting] = useState(false);
    const maxReturnNumber = useRef<number | undefined>();

    useMemo(() => {
        if (visible) {
            setGoods(undefined);
            setCurrent(0);
            form1.current?.resetFields();
            form2.current?.resetFields();
        }
    }, [visible]);

    const onSearch = useCallback(() => {
        setGoods(undefined);
        setCurrent(0);
        return form1.current!.validateFields().then(values => {
            const { purchase_order_goods_id } = values;
            return queryPurchaseList({
                type: 0,
                purchase_order_goods_id: purchase_order_goods_id,
            })
                .request()
                .then(({ data: { list = [] } = EmptyObject }) => {
                    const item = list[0];
                    if (item) {
                        setGoods({
                            ...item,
                        });
                        setCurrent(1);
                        const return_number = Math.min(
                            item?.inventory?.availableInventory ?? 0,
                            (item?.realInStorageNumber ?? 0) - (item?.returnNumber ?? 0),
                        );
                        maxReturnNumber.current = return_number;
                        form2.current!.setFieldsValue({
                            return_number: return_number,
                            receiver_name: item.platformUid,
                        });
                    } else {
                        message.error('查询不到相关采购单');
                    }
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
                rules: [
                    { required: true, message: '请输入退货数量' },
                    {
                        validator: (
                            rule: RuleObject,
                            value: StoreValue,
                            callback: (error?: string) => void,
                        ) => {
                            if (maxReturnNumber.current !== void 0) {
                                if (Number(value) > maxReturnNumber.current) {
                                    return Promise.reject(
                                        `不可大于${maxReturnNumber.current}（退货数不可大于仓库可用库存数或采购单可退数）`,
                                    );
                                } else {
                                    return Promise.resolve();
                                }
                            } else {
                                return Promise.resolve();
                            }
                        },
                    },
                ],
                className: styles.formInput,
                formatter: 'number',
                disabled,
            },
            {
                label: '收货人',
                type: 'input',
                name: 'receiver_name',
                rules: [{ required: true, message: '请输入收货人' }],
                className: styles.formInput,
                disabled,
            },
            {
                label: '手机号',
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
                                : Promise.reject('请选择到区');
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
            setSubmitting(true);
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
                })
                .finally(() => {
                    setSubmitting(false);
                });
        });
    }, []);

    const skuComponent = useMemo(() => {
        if (goods) {
            let skus: any[] = [];
            const { productSkuStyle } = goods;
            try {
                const sku = JSON.parse(productSkuStyle);
                for (let key in sku) {
                    skus.push(
                        <div key={key} className={styles.modalSku}>
                            {key}:{sku[key]}
                        </div>,
                    );
                }
            } catch (e) {}
            return skus;
        } else {
            return null;
        }
    }, [goods]);

    return useMemo(() => {
        return (
            <Modal
                title="创建退货单"
                visible={visible}
                onCancel={onCancel}
                width={900}
                onOk={onSubmit}
                confirmLoading={submitting}
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
                                <JsonForm
                                    ref={form1}
                                    fieldList={fieldList}
                                    className={formStyles.formHelpAbsolute}
                                >
                                    <LoadingButton
                                        type="primary"
                                        className={formStyles.formBtn}
                                        onClick={onSearch}
                                    >
                                        查询
                                    </LoadingButton>
                                </JsonForm>
                                {goods ? (
                                    <div
                                        className={classNames(formStyles.flex, formStyles.flexRow)}
                                    >
                                        <div>
                                            <AutoEnLargeImg
                                                src={goods?.productImageUrl}
                                                className={styles.modalImage}
                                            />
                                        </div>
                                        <div>
                                            <div
                                                className={styles.modalTitle}
                                                title={goods?.purchaseGoodsName}
                                            >
                                                {goods?.purchaseGoodsName}
                                            </div>
                                            <div
                                                className={classNames(
                                                    styles.modalSkus,
                                                    styles.modalSkuValue,
                                                )}
                                            >
                                                {skuComponent}
                                            </div>
                                            <div className={styles.modalSkus}>
                                                <div className={styles.modalSku}>
                                                    入库数量:
                                                    <span className={styles.modalSkuValue}>
                                                        {goods?.realInStorageNumber ?? 0}/
                                                        {goods?.purchaseGoodsNumber ?? 0}
                                                    </span>
                                                </div>
                                                <div className={styles.modalSku}>
                                                    仓库可用库存数量:
                                                    <span className={styles.modalSkuValue}>
                                                        {goods?.inventory?.availableInventory ?? 0}
                                                    </span>
                                                </div>
                                                <div className={styles.modalSku}>
                                                    采购单可退数量:
                                                    <span className={styles.modalSkuValue}>
                                                        {(goods?.realInStorageNumber ?? 0) -
                                                            (goods?.returnNumber ?? 0)}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
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
                                className={classNames(
                                    formStyles.formHelpAbsolute,
                                    current === 0 ? styles.formLabelDisabled : undefined,
                                )}
                                layout="horizontal"
                                fieldList={fieldList1}
                                labelClassName={styles.formLabel}
                            />
                        }
                    />
                </Steps>
            </Modal>
        );
    }, [goods, current, visible, addressDataSet, submitting]);
};

export default CreateReturnOrderModal;

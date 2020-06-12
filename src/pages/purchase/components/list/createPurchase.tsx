import React, {
    forwardRef,
    ForwardRefRenderFunction,
    useCallback,
    useEffect,
    useImperativeHandle,
    useMemo,
    useRef,
    useState,
} from 'react';
import { Modal, Divider, message } from 'antd';
import { JsonForm } from 'react-components';
import formStyles from 'react-components/es/JsonForm/_form.less';
import classNames from 'classnames';
import { WarehouseList } from '@/config/dictionaries/Stock';
import SearchGood from '@/pages/purchase/components/list/searchGood';
import { FormField, JsonFormRef } from 'react-components/es/JsonForm';
import styles from '../../_list.less';
import { createPurchase } from '@/services/purchase';
import { FormInstance } from 'antd/es/form';
import { queryWarehourseById } from '@/services/global';
import { IGood } from '@/interface/ILocalGoods';

declare interface CreatePurchaseModalProps {
    visible: boolean;
    onClose: () => void;
    onReload: () => void;
}

declare interface CreatePurchaseProps {
    setSubmittingLoading: (loading: boolean) => void;
}

declare interface CreatePurchaseRef {
    submit: () => Promise<any>;
}

const CreatePurchase: ForwardRefRenderFunction<CreatePurchaseRef, CreatePurchaseProps> = (
    props: CreatePurchaseProps,
    ref,
) => {
    const formRef1 = useRef<JsonFormRef>(null);
    const formRef2 = useRef<JsonFormRef>(null);
    const [amount, setAmount] = useState<number | string>(0);

    const [address, setAddress] = useState('');

    const updateAmount = useCallback(() => {
        const { shop_price, goods_number } = formRef1.current!.getFieldsValue();
        setAmount(
            shop_price && goods_number
                ? Number((shop_price * 100 * goods_number) / 100).toFixed(2)
                : 0,
        );
    }, []);

    const submitForm = useCallback(() => {
        return formRef1.current!.validateFields().then((values1: any) => {
            return formRef2.current!.validateFields().then(values2 => {
                props.setSubmittingLoading(true);
                return createPurchase({
                    ...values1,
                    ...values2,
                });
            });
        });
    }, []);

    useImperativeHandle(
        ref,
        () => {
            return {
                submit: submitForm,
            };
        },
        [],
    );

    const onWarehouseSelect = useCallback(() => {
        const { warehouse_id } = formRef1.current!.getFieldsValue();
        queryWarehourseById(warehouse_id).then(
            ({ data: { address1, address2, country, province, city } }) => {
                setAddress(`${country} ${province} ${city} ${address1} ${address2}`);
            },
        );
    }, []);

    const onGoodChange = useCallback((good: IGood | undefined) => {
        if (good) {
            formRef1.current!.setFieldsValue({
                product_id: good.productId,
                shop_price: good.price,
            });
        } else {
            formRef1.current!.setFieldsValue({
                product_id: undefined,
            });
        }
    }, []);

    useEffect(() => {
        onWarehouseSelect();
    }, []);

    return useMemo(() => {
        return (
            <div>
                <JsonForm
                    ref={formRef1}
                    enableCollapse={false}
                    layout={'horizontal'}
                    initialValues={{
                        purchase_platform: 'pdd',
                        warehouse_id: '2', // 默认仓库
                    }}
                    labelClassName={styles.formLabel}
                    className={formStyles.formHelpAbsolute}
                    fieldList={
                        [
                            {
                                type: 'layout',
                                className: formStyles.flexRow,
                                fieldList: [
                                    {
                                        type: 'input',
                                        name: 'purchase_manager',
                                        label: '采购负责人',
                                        formItemClassName: classNames(
                                            formStyles.flexInline,
                                            formStyles.formItem,
                                        ),
                                        rules: [{ required: true, message: '请填写采购负责人' }],
                                    },
                                    {
                                        type: 'layout',
                                        className: classNames(
                                            formStyles.flexInline,
                                            formStyles.flexColumn,
                                            styles.formRight,
                                        ),
                                        style: { marginLeft: 200 },
                                        fieldList: [
                                            {
                                                type: 'select',
                                                name: 'purchase_platform',
                                                label: '供应商渠道',
                                                rules: [
                                                    { required: true, message: '请选择供应商渠道' },
                                                ],
                                                optionList: [
                                                    {
                                                        name: 'pdd',
                                                        value: 'pdd',
                                                    },
                                                ],
                                            },
                                            {
                                                type: 'input',
                                                name: 'purchase_merchant_name',
                                                label: '供应商名称',
                                                rules: [
                                                    { required: true, message: '请填写供应商名称' },
                                                ],
                                            },
                                            {
                                                type: 'input',
                                                name: 'purchase_order_goods_sn',
                                                label: '供应商订单ID',
                                                rules: [
                                                    {
                                                        required: true,
                                                        message: '请填写供应商订单ID',
                                                    },
                                                ],
                                            },
                                        ],
                                    },
                                ],
                            },
                            {
                                type: 'layout',
                                fieldList: [
                                    {
                                        type: 'select',
                                        name: 'warehouse_id',
                                        label: '交付仓库',
                                        optionList: WarehouseList.filter(
                                            item => item.value !== '1',
                                        ), // 不显示安俊仓
                                        formatter: 'number',
                                        rules: [{ required: true, message: '请选择交付仓库' }],
                                        onChange: onWarehouseSelect,
                                    },
                                ],
                                footer: <div className={styles.address}>{address}</div>,
                            },
                            {
                                type: 'hide',
                                name: 'product_id',
                                colon: false,
                            },
                            {
                                type: 'layout',
                                fieldList: [
                                    {
                                        type: 'layout',
                                        className: formStyles.flexRow,
                                        fieldList: [
                                            {
                                                type: 'number',
                                                name: 'shop_price',
                                                label: '单价(¥)',
                                                onChange: updateAmount,
                                                rules: [{ required: true, message: '请填写单价' }],
                                            },
                                            {
                                                type: 'positiveInteger',
                                                name: 'goods_number',
                                                label: '采购数',
                                                onChange: updateAmount,
                                                formatter: 'number',
                                                rules: [
                                                    { required: true, message: '请填写采购数' },
                                                ],
                                                formItemClassName: classNames(
                                                    formStyles.formItem,
                                                    styles.formItemMl,
                                                ),
                                            },
                                        ],
                                    },
                                ],
                                header: (
                                    <React.Fragment>
                                        <Divider />
                                        <div className={styles.title}>采购商品详情</div>
                                        <SearchGood
                                            formRef={formRef2}
                                            containerClassName=""
                                            onDataChange={onGoodChange}
                                        />
                                    </React.Fragment>
                                ),
                                footer: (
                                    <div className={formStyles.formItem}>
                                        总金额(¥)：<span className={styles.amount}>¥{amount}</span>
                                    </div>
                                ),
                            },
                        ] as FormField[]
                    }
                />
            </div>
        );
    }, [amount, address]);
};

const CreatePurchaseWrap = forwardRef(CreatePurchase);

const CreatePurchaseModal = ({ visible, onClose, onReload }: CreatePurchaseModalProps) => {
    const ref = useRef<CreatePurchaseRef>(null);
    const [submitting, setSubmitting] = useState(false);
    const onOKey = useCallback(() => {
        ref.current!.submit()
            .then(() => {
                message.success('创建成功');
                onClose();
                onReload();
            })
            .finally(() => {
                setSubmitting(false);
            });
    }, []);
    return useMemo(
        () => (
            <Modal
                confirmLoading={submitting}
                width={900}
                title="创建采购单"
                visible={visible}
                destroyOnClose={true}
                onCancel={onClose}
                onOk={onOKey}
            >
                <CreatePurchaseWrap ref={ref} setSubmittingLoading={setSubmitting} />
            </Modal>
        ),
        [visible, submitting],
    );
};

export default CreatePurchaseModal;

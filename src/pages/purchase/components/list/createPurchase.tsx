import React, {
    forwardRef,
    ForwardRefRenderFunction,
    useCallback,
    useImperativeHandle,
    useMemo,
    useRef,
    useState,
} from 'react';
import { Modal, Divider } from 'antd';
import { JsonForm } from 'react-components';
import formStyles from 'react-components/es/JsonForm/_form.less';
import classNames from 'classnames';
import { WarehouseList } from '@/config/dictionaries/Stock';
import SearchGood from '@/pages/purchase/components/list/searchGood';
import { JsonFormRef } from 'react-components/es/JsonForm';
import styles from '../../_list.less';
import { createPurchase } from '@/services/purchase';

declare interface CreatePurchaseModalProps {
    visible: string | false;
    onClose: () => void;
}

declare interface CreatePurchaseProps {}

declare interface CreatePurchaseRef {
    submit: () => Promise<any>;
}

const CreatePurchase: ForwardRefRenderFunction<CreatePurchaseRef, CreatePurchaseProps> = (
    props: CreatePurchaseProps,
    ref,
) => {
    const formRef1 = useRef<JsonFormRef>(null);
    const formRef2 = useRef<JsonFormRef>(null);
    const [amount, setAmount] = useState(0);

    const updateAmount = useCallback(() => {
        const { shop_price, goods_number } = formRef1.current!.getFieldsValue();
        setAmount(shop_price && goods_number ? shop_price * goods_number : 0);
    }, []);

    const submitForm = useCallback(() => {
        return formRef1.current!.validateFields().then((values1: any) => {
            return formRef2.current!.validateFields().then(values2 => {
                return createPurchase({
                    ...values1,
                    ...values2,
                }).then(() => {});
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

    return useMemo(() => {
        return (
            <div>
                <JsonForm
                    ref={formRef1}
                    enableCollapse={false}
                    layout={'horizontal'}
                    initialValues={{
                        purchase_platform: 'pdd',
                    }}
                    labelClassName={styles.formLabel}
                    className={formStyles.formHelpAbsolute}
                    fieldList={[
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
                                                { required: true, message: '请填写供应商订单ID' },
                                            ],
                                        },
                                    ],
                                },
                            ],
                        },
                        {
                            type: 'select',
                            name: 'warehouse_id',
                            label: '交付仓库',
                            optionList: WarehouseList,
                            rules: [{ required: true, message: '请选择交付仓库' }],
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
                                            rules: [{ required: true, message: '请填写采购数' }],
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
                                    <SearchGood formRef={formRef2} containerClassName="" />
                                </React.Fragment>
                            ),
                            footer: (
                                <div className={formStyles.formItem}>
                                    总金额(¥)：<span className={styles.amount}>¥{amount}</span>
                                </div>
                            ),
                        },
                    ]}
                />
            </div>
        );
    }, [amount]);
};

const CreatePurchaseWrap = forwardRef(CreatePurchase);

const CreatePurchaseModal = ({ visible, onClose }: CreatePurchaseModalProps) => {
    const ref = useRef<CreatePurchaseRef>(null);
    const onOKey = useCallback(() => {
        ref.current!.submit();
    }, []);
    return useMemo(
        () => (
            <Modal
                width={900}
                title="创建采购单"
                visible={!!visible}
                destroyOnClose={true}
                onCancel={onClose}
                onOk={onOKey}
            >
                <CreatePurchaseWrap ref={ref} />
            </Modal>
        ),
        [visible],
    );
};

export default CreatePurchaseModal;

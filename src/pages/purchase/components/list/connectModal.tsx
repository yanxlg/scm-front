import React, { useCallback, useMemo, useRef, useState } from 'react';
import { message, Modal } from 'antd';
import { JsonForm } from 'react-components';
import { FormField, JsonFormRef } from 'react-components/es/JsonForm';
import styles from '@/pages/purchase/_list.less';
import { setCorrelateWaybill } from '@/services/purchase';
import { carrierList } from '@/config/global';
import formStyles from 'react-components/es/JsonForm/_form.less';
import classNames from 'classnames';

const fieldList: FormField[] = [
    {
        type: 'input',
        name: 'purchase_waybill_no',
        label: '运单号',
        className: styles.connectInput,
        formItemClassName: classNames(formStyles.formItem, formStyles.formRequiredHide),
        rules: [
            {
                required: true,
                message: '请填写运单号',
            },
        ],
    },
    {
        type: 'number',
        name: 'goods_number',
        label: '应入库数量',
        className: styles.connectInput,
        formItemClassName: classNames(formStyles.formItem, formStyles.formRequiredHide),
        rules: [
            {
                required: true,
                message: '请填写应入库数量',
            },
        ],
    },
    {
        type: 'select',
        name: 'purchase_shipping_name',
        label: '物流商',
        className: styles.connectInput,
        formItemClassName: classNames(formStyles.formItem, formStyles.formRequiredHide),
        optionList: carrierList.map(item => {
            return {
                name: item.name,
                value: item.name,
            };
        }),
        rules: [
            {
                required: true,
                message: '请选择物流商',
            },
        ],
    },
];

declare interface IConnectModalProps {
    visible: string | false;
    onCancel: () => void;
}

const ConnectModal: React.FC<IConnectModalProps> = ({ visible, onCancel }) => {
    const [submitting, setSubmitting] = useState(false);
    const formRef = useRef<JsonFormRef>(null);

    const onOKey = useCallback(() => {
        formRef.current!.validateFields().then(values => {
            setSubmitting(true);
            setCorrelateWaybill(({
                purchase_order_goods_id: visible as string,
                request_type: 'PURCHASE_ORDER',
                ...values,
            } as unknown) as any)
                .then(() => {
                    message.success('关联成功');
                    onCancel();
                })
                .finally(() => {
                    setSubmitting(false);
                });
        });
    }, [visible]);

    return useMemo(() => {
        return (
            <Modal
                title="关联运单号"
                confirmLoading={submitting}
                visible={!!visible}
                okText="确认"
                onOk={onOKey}
                onCancel={onCancel}
                destroyOnClose={true}
            >
                <JsonForm
                    labelClassName={styles.connectLabel}
                    className={formStyles.formHelpAbsolute}
                    containerClassName={''}
                    fieldList={fieldList}
                    layout="horizontal"
                    ref={formRef}
                />
            </Modal>
        );
    }, [submitting, visible]);
};

export default ConnectModal;

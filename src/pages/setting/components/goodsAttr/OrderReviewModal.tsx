import React, { useMemo, useRef, useCallback, useState } from 'react';
import { Modal, message } from 'antd';
import { JsonForm } from 'react-components';
import { JsonFormRef, FormField } from 'react-components/es/JsonForm';
import { IOptionItem } from 'react-components/es/JsonForm/items/Select';

import styles from './_PaneOrderReview.less';
import { IAddOrderConfigReq } from '@/interface/ISetting';
import { addOrderConfig } from '@/services/setting';
import { hasNotSelectedCategory } from '@/utils/utils';

interface IProps {
    visible: boolean;
    allCategoryList: IOptionItem[];
    hideModal(): void;
    getCategoryList(): Promise<IOptionItem[]>;
    onReload(): Promise<void>;
}

const OrderReviewModal: React.FC<IProps> = ({
    visible,
    allCategoryList,
    hideModal,
    getCategoryList,
    onReload,
}) => {
    const formRef = useRef<JsonFormRef>(null);
    const [confirmLoading, setConfirmLoading] = useState(false);

    const onCancel = useCallback(() => {
        formRef.current?.resetFields();
        hideModal();
    }, []);

    const _addOrderConfig = useCallback((data: IAddOrderConfigReq) => {
        setConfirmLoading(true);
        addOrderConfig(data)
            .then(res => {
                // console.log('addOrderConfig', res);
                onCancel();
                onReload();
            })
            .finally(() => {
                setConfirmLoading(false);
            });
    }, []);

    const onOk = useCallback(async () => {
        const data = (await formRef.current?.getFieldsValue()) as IAddOrderConfigReq;
        const { first_cat_id, second_cat_id, third_cat_id, remark } = data;
        if (hasNotSelectedCategory(allCategoryList, first_cat_id, second_cat_id, third_cat_id)) {
            return message.error('请检查选择的类目！');
        }
        // console.log('onOk', data, allCategoryList);
        _addOrderConfig(data);
    }, [allCategoryList]);

    const formFields = useMemo<FormField[]>(() => {
        return [
            {
                type: 'select',
                label: '一级类目',
                name: 'first_cat_id',
                syncDefaultOption: {
                    value: '',
                    name: '请选择',
                },
                optionList: () => getCategoryList(),
                onChange: (name, form) => {
                    form.resetFields(['second_cat_id']);
                    form.resetFields(['third_cat_id']);
                },
            },
            {
                type: 'select',
                label: '二级类目',
                name: 'second_cat_id',
                optionListDependence: {
                    name: 'first_cat_id',
                    key: 'children',
                },
                syncDefaultOption: {
                    value: '',
                    name: '请选择',
                },
                optionList: () => getCategoryList(),
                onChange: (name, form) => {
                    form.resetFields(['third_cat_id']);
                },
            },
            {
                type: 'select',
                label: '三级类目',
                name: 'third_cat_id',
                // className: styles.input,
                optionListDependence: {
                    name: ['first_cat_id', 'second_cat_id'],
                    key: 'children',
                },
                syncDefaultOption: {
                    value: '',
                    name: '请选择',
                },
                optionList: () => getCategoryList(),
            },
            {
                type: 'textarea',
                label: <span>备&emsp;&emsp;注</span>,
                name: 'remark',
                className: styles.textarea,
                autoSize: { minRows: 3 },
            },
        ];
    }, []);

    return useMemo(() => {
        return (
            <Modal
                title="订单审核配置"
                visible={visible}
                confirmLoading={confirmLoading}
                onCancel={onCancel}
                onOk={onOk}
            >
                <div className={styles.modalContent}>
                    <JsonForm
                        initialValues={{
                            first_cat_id: '',
                            second_cat_id: '',
                            third_cat_id: '',
                        }}
                        ref={formRef}
                        fieldList={formFields}
                    />
                </div>
            </Modal>
        );
    }, [visible, confirmLoading]);
};

export default OrderReviewModal;

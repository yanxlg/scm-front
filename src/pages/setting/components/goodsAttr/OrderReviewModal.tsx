import React, { useMemo, useRef, useCallback } from 'react';
import { Modal } from 'antd';
import { JsonForm } from 'react-components';
import { JsonFormRef, FormField } from 'react-components/es/JsonForm';
import { IOptionItem } from 'react-components/es/JsonForm/items/Select';

import styles from './_PaneOrderReview.less';

interface IProps {
    visible: boolean;
    allCategoryList: IOptionItem[];
    hideModal(): void;
    getCatagoryList(): Promise<IOptionItem[]>;
}

const OrderReviewModal: React.FC<IProps> = ({
    visible,
    allCategoryList,
    hideModal,
    getCatagoryList,
}) => {
    const formRef = useRef<JsonFormRef>(null);

    const onCancel = useCallback(() => {
        formRef.current?.resetFields();
        hideModal();
    }, []);

    const onOk = useCallback(async () => {
        const data = await formRef.current?.getFieldsValue();
        console.log('onOk', data);
    }, []);

    const formFields = useMemo<FormField[]>(() => {
        return [
            {
                type: 'select',
                label: '一级类目',
                name: 'first_catagory',
                // className: styles.input,
                syncDefaultOption: {
                    value: '',
                    name: '全部',
                },
                optionList: () => getCatagoryList(),
                onChange: (name, form) => {
                    form.resetFields(['second_catagory']);
                    form.resetFields(['third_catagory']);
                },
            },
            {
                type: 'select',
                label: '二级类目',
                name: 'second_catagory',
                // className: styles.input,
                optionListDependence: {
                    name: 'first_catagory',
                    key: 'children',
                },
                syncDefaultOption: {
                    value: '',
                    name: '全部',
                },
                optionList: () => getCatagoryList(),
                onChange: (name, form) => {
                    form.resetFields(['third_catagory']);
                },
            },
            {
                type: 'select',
                label: '三级类目',
                name: 'third_catagory',
                // className: styles.input,
                optionListDependence: {
                    name: ['first_catagory', 'second_catagory'],
                    key: 'children',
                },
                syncDefaultOption: {
                    value: '',
                    name: '全部',
                },
                optionList: () => getCatagoryList(),
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
            <Modal title="订单审核配置" visible={visible} onCancel={onCancel} onOk={onOk}>
                <div className={styles.modalContent}>
                    <JsonForm
                        // initialValues={initialValues}
                        ref={formRef}
                        fieldList={formFields}
                    />
                </div>
            </Modal>
        );
    }, [visible]);
};

export default OrderReviewModal;

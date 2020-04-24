import React, { useCallback, useMemo, useState } from 'react';
import { Button, Modal, Steps } from 'antd';
import { JsonForm } from 'react-components';
import { FormField } from 'react-components/es/JsonForm';
import formStyles from 'react-components/es/JsonForm/_form.less';
import styles from '@/pages/purchase/_return.less';

declare interface ICreateReturnOrderModalProps {
    visible: string | boolean;
    onCancel: () => void;
}

const fieldList: FormField[] = [{ label: '采购单ID', type: 'input', name: 'id' }];

const fieldList1: FormField[] = [
    { label: '退货数量', type: 'input', name: 'id', rules: [{ required: true }] },
    { label: '收货人', type: 'input', name: 'id', rules: [{ required: true }] },
    { label: '手机号', type: 'input', name: 'id', rules: [{ required: true }] },
    { label: '地址信息', type: 'input', name: 'id', rules: [{ required: true }] },
    { label: '详细地址', type: 'input', name: 'id', rules: [{ required: true }] },
    { label: '邮政编码', type: 'input', name: 'id', rules: [{ required: true }] },
];

const CreateReturnOrderModal: React.FC<ICreateReturnOrderModalProps> = ({ visible, onCancel }) => {
    const [goods, setGoods] = useState(false);
    const [current, setCurrent] = useState(0);

    const onSearch = useCallback(() => {
        setGoods(true);
        setCurrent(1);
    }, []);

    return useMemo(() => {
        return (
            <Modal title="创建退货单" visible={!!visible} onCancel={onCancel} width={900}>
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
                                <JsonForm fieldList={fieldList} enableCollapse={false}>
                                    <Button
                                        type="primary"
                                        className={formStyles.formBtn}
                                        onClick={onSearch}
                                    >
                                        查询
                                    </Button>
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
                                enableCollapse={false}
                                layout="horizontal"
                                fieldList={fieldList1}
                            />
                        }
                    />
                </Steps>
            </Modal>
        );
    }, [goods, current]);
};

export default CreateReturnOrderModal;

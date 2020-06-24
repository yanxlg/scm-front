import React, { useCallback, useMemo, useState } from 'react';
import { Modal } from 'antd';
import { JsonForm } from 'react-components';
import { pwdIconRender } from '@/config/global';
import styles from './_index.less';
import formStyles from 'react-components/es/JsonForm/_form.less';

declare interface IChangePwdModalProps {
    visible: boolean;
    onClose: () => void;
}

const ChangePwdModal: React.FC<IChangePwdModalProps> = ({ visible, onClose }) => {
    const [submitting, setSubmitting] = useState(false);

    const onOKey = useCallback(() => {
        setSubmitting(true);
        // TODO 修改密码
    }, []);

    return useMemo(() => {
        return (
            <Modal
                title="修改密码"
                width={800}
                visible={visible}
                cancelButtonProps={{ className: styles.cancel }}
                onCancel={onClose}
                onOk={onOKey}
                confirmLoading={submitting}
            >
                <JsonForm
                    layout="horizontal"
                    labelClassName={styles.label}
                    containerClassName=""
                    fieldList={[
                        {
                            type: 'label',
                            label: '用户名',
                            content: '张',
                            formItemClassName: formStyles.formItemBottom,
                        },
                        {
                            type: 'password',
                            name: 'password',
                            label: '原密码',
                            iconRender: pwdIconRender,
                            className: styles.input,
                        },
                        {
                            type: 'password',
                            name: 'password1',
                            label: '新密码',
                            iconRender: pwdIconRender,
                            className: styles.input,
                        },
                        {
                            type: 'password',
                            name: 'password2',
                            label: '请重复密码',
                            iconRender: pwdIconRender,
                            className: styles.input,
                        },
                    ]}
                />
            </Modal>
        );
    }, [visible, submitting]);
};

export { ChangePwdModal };

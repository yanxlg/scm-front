import React, { RefObject, useCallback, useMemo, useRef, useState } from 'react';
import { Modal, message } from 'antd';
import { JsonForm } from 'react-components';
import { pwdIconRender } from '@/config/global';
import styles from './_index.less';
import formStyles from 'react-components/es/JsonForm/_form.less';
import User from '@/storage/User';
import { logout, updatePwd } from '@/services/global';
import { JsonFormRef } from 'react-components/es/JsonForm';
import { FormInstance } from 'rc-field-form/lib/interface';
import { history } from '@@/core/history';
import classNames from 'classnames';

declare interface IChangePwdModalProps {
    visible: boolean;
    onClose: () => void;
}

const ChangePwdModalContent = ({ originRef }: { originRef: RefObject<JsonFormRef> }) => {
    return useMemo(() => {
        return (
            <JsonForm
                layout="horizontal"
                labelClassName={styles.label}
                containerClassName={formStyles.formHelpAbsolute}
                ref={originRef}
                fieldList={[
                    {
                        type: 'label',
                        label: '用户名',
                        content: User.userName,
                        formItemClassName: formStyles.formItemBottom,
                    },
                    {
                        type: 'password',
                        name: 'oldPassword',
                        label: '原密码',
                        iconRender: pwdIconRender,
                        className: styles.input,
                        defaultVisible: true,
                        autoComplete: 'new-password',
                        required: false,
                        validateTrigger: 'onBlur',
                        formItemClassName: classNames(
                            formStyles.formItem,
                            formStyles.formRequiredHide,
                        ),
                        rules: [
                            {
                                required: true,
                                message: '请输入原密码',
                            },
                        ],
                    },
                    {
                        type: 'password',
                        name: 'newPassword',
                        label: '新密码',
                        iconRender: pwdIconRender,
                        className: styles.input,
                        autoComplete: 'new-password',
                        required: false,
                        validateTrigger: 'onBlur',
                        formItemClassName: classNames(
                            formStyles.formItem,
                            formStyles.formRequiredHide,
                        ),
                        rules: [
                            {
                                required: true,
                                message: '请输入新密码',
                            },
                            ({ getFieldValue }) => ({
                                validator: (rule, form) => {
                                    const newPassword = getFieldValue('newPassword');
                                    if (newPassword && newPassword.length < 8) {
                                        return Promise.reject('密码必须大于8位');
                                    }
                                    return Promise.resolve();
                                },
                            }),
                        ],
                    },
                    {
                        type: 'password',
                        name: 'newPassword1',
                        label: '请重复密码',
                        iconRender: pwdIconRender,
                        className: styles.input,
                        autoComplete: 'new-password',
                        required: false,
                        validateTrigger: 'onBlur',
                        formItemClassName: classNames(
                            formStyles.formItem,
                            formStyles.formRequiredHide,
                        ),
                        rules: [
                            {
                                required: true,
                                message: '请重复新密码',
                            },
                            ({ getFieldValue }) => ({
                                validator: (rule, form) => {
                                    const newPassword = getFieldValue('newPassword');
                                    const newPassword1 = getFieldValue('newPassword1');
                                    if (newPassword1 && newPassword1.length < 8) {
                                        return Promise.reject('密码必须大于8位');
                                    }
                                    if (!newPassword || newPassword === newPassword1) {
                                        return Promise.resolve();
                                    } else {
                                        return Promise.reject('两次输入密码不一致');
                                    }
                                },
                            }),
                        ],
                    },
                ]}
            />
        );
    }, []);
};

const ChangePwdModal: React.FC<IChangePwdModalProps> = ({ visible, onClose }) => {
    const [submitting, setSubmitting] = useState(false);
    const formRef = useRef<JsonFormRef>(null);

    const onOKey = useCallback(() => {
        formRef.current!.validateFields().then(values => {
            const { oldPassword, newPassword } = values;
            setSubmitting(true);
            updatePwd(oldPassword, newPassword)
                .then(() => {
                    message.success('密码修改成功，请重新登陆');
                    logout()
                        .then(() => {
                            history.replace('/login');
                        })
                        .finally(() => {
                            setSubmitting(false);
                        });
                })
                .catch(() => {
                    setSubmitting(false);
                });
        });
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
                destroyOnClose={true}
            >
                <ChangePwdModalContent originRef={formRef} />
            </Modal>
        );
    }, [visible, submitting]);
};

export { ChangePwdModal };

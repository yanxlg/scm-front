import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { message, Modal } from 'antd';
import { JsonForm } from 'react-components';
import styles from '../_index.less';
import classNames from 'classnames';
import formStyles from 'react-components/es/JsonForm/_form.less';
import { FormField, JsonFormRef } from 'react-components/es/JsonForm';
import { addAccount, queryAccount, updateAccount } from '@/services/setting';
import { useSelector } from '@@/plugin-dva/exports';
import { ConnectState } from '@/models/connect';
import PermissionTree from '@/pages/setting/_role/components/PermissionTree';

declare interface AddAccountModalProps {
    visible:
        | {
              type: 'add' | 'view' | 'edit';
              id?: string;
          }
        | false; // 新增｜查看｜编辑
    onClose: () => void;
}

const AddAccountModal: React.FC<AddAccountModalProps> = ({ visible, onClose }) => {
    const formRef = useRef<JsonFormRef>(null);
    const [submitting, setSubmitting] = useState(false);
    const footerRef = useRef<null>();
    const { type, id } = visible || {};

    const onOKey = useCallback(() => {
        formRef.current!.validateFields().then((values: any) => {
            setSubmitting(true);
            switch (type) {
                case 'add':
                    addAccount(values)
                        .then(() => {
                            message.success('添加账号成功');
                            onClose();
                        })
                        .finally(() => {
                            setSubmitting(false);
                        });
                    break;
                case 'view':
                    break;
                default:
                    const { password, ...extra } = values;
                    updateAccount(id!, {
                        ...extra,
                        password: password === '********' ? undefined : password,
                    })
                        .then(() => {
                            message.success('修改账号成功');
                            onClose();
                        })
                        .finally(() => {
                            setSubmitting(false);
                        });
                    break;
            }
        });
    }, [type]);

    // roles
    const roleList = useSelector((state: ConnectState) => {
        return state?.account?.roleSimpleList;
    });

    useEffect(() => {
        if (visible) {
            formRef.current?.resetFields();
        }
        switch (type) {
            case 'edit':
            case 'view':
                queryAccount(id!).then(({ data }) => {
                    formRef.current!.setFieldsValue({
                        username: data.username,
                        real_name: data.real_name,
                        status: data.status,
                        roles: data.role_ids,
                        password: '********',
                    });
                });
                break;
            case 'add':
                break;
            case undefined:
                break;
            default:
                break;
        }
    }, [visible]);

    const formFields = useMemo(() => {
        return [
            {
                type: 'layout',
                header: <span className={styles.formModalTitle}>基本信息</span>,
                fieldList: [
                    {
                        type: 'input',
                        label: '用户名',
                        name: 'username',
                        className: styles.formInput,
                    },
                    {
                        type: 'input',
                        label: '姓名',
                        name: 'real_name',
                        className: styles.formInput,
                    },
                    {
                        type: 'input',
                        label: '密码',
                        name: 'password',
                        className: styles.formInput,
                    },
                    {
                        type: 'radioGroup',
                        name: 'status',
                        label: '状态',
                        initialValue: '1',
                        options: [
                            {
                                label: '启用',
                                value: '1',
                            },
                            {
                                label: '禁用',
                                value: '0',
                            },
                        ],
                        formatter: 'number',
                    },
                    {
                        type: 'checkboxGroup',
                        name: 'roles',
                        label: '角色',
                        options: (roleList || []).map(({ value, name }) => {
                            return {
                                label: name,
                                value: value,
                            };
                        }),
                        className: classNames(styles.formModalRole),
                        formItemClassName: classNames(
                            formStyles.formItem,
                            styles.formModalRoleItem,
                        ),
                        formatter: 'arrayNumber',
                    },
                ],
            },
            {
                type: 'component',
                Component: PermissionTree,
                names: [], // 不收集参数
            },
        ] as FormField<any>[];
    }, []);

    useMemo(() => {
        if (type) {
            footerRef.current = type === 'view' ? null : undefined;
        }
    }, [type]);

    return useMemo(() => {
        return (
            <Modal
                confirmLoading={submitting}
                title={type === 'add' ? '添加账号' : type === 'view' ? '查看账号' : '修改账号'}
                width={800}
                visible={!!visible}
                onCancel={onClose}
                onOk={onOKey}
                footer={footerRef.current}
            >
                <JsonForm
                    ref={formRef}
                    layout="horizontal"
                    labelClassName={styles.formModalLabel}
                    fieldList={formFields}
                />
            </Modal>
        );
    }, [submitting, visible, roleList]);
};

export { AddAccountModal };

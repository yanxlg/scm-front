import React, { RefObject, useCallback, useEffect, useMemo, useRef, useState } from 'react';
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
import { FormInstance } from 'antd/es/form';
declare interface VisibleProps {
    type: 'add' | 'view' | 'edit';
    id?: string;
}

declare interface AddAccountModalProps {
    visible: VisibleProps | false; // 新增｜查看｜编辑
    onClose: () => void;
    onSearch: () => void;
    onReload: () => void;
}

declare interface AddAccountModalContentProps {
    visibleType: 'add' | 'view' | 'edit';
    id?: string;
    originFormRef: RefObject<JsonFormRef>;
}

const AddAccountModalContent: React.FC<AddAccountModalContentProps> = ({
    visibleType,
    id,
    originFormRef,
}) => {
    const [roleIds, setRoleIds] = useState<string[]>();
    const roleList = useSelector((state: ConnectState) => {
        return state?.account?.roleSimpleList;
    });

    const disabled = visibleType === 'view';

    const treeDisabled = true;

    useEffect(() => {
        switch (visibleType) {
            case 'edit':
            case 'view':
                queryAccount(id!).then(({ data }) => {
                    const { username, real_name, status, role_ids } = data;
                    // 可能还未创建完成
                    originFormRef.current!.setFieldsValue({
                        username: username,
                        real_name: real_name,
                        status: status,
                        roles: role_ids,
                        password: '', // 密码不能显示
                    });
                    setRoleIds(role_ids && role_ids.length ? role_ids : undefined);
                });
                break;
            default:
                break;
        }
    }, []);

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
                        disabled: disabled || visibleType === 'edit',
                    },
                    {
                        type: 'input',
                        label: '姓名',
                        name: 'real_name',
                        className: styles.formInput,
                        disabled: disabled,
                    },
                    {
                        type: 'password',
                        label: '密码',
                        name: 'password',
                        className: styles.formInput,
                        disabled: disabled,
                        defaultVisible: true,
                    },
                    {
                        type: 'radioGroup',
                        name: 'status',
                        label: '状态',
                        initialValue: '1',
                        disabled: disabled,
                        options: [
                            {
                                label: '启用',
                                value: '1',
                            },
                            {
                                label: '禁用',
                                value: '2',
                            },
                        ],
                        formatter: 'number',
                    },
                    {
                        type: 'checkboxGroup',
                        name: 'roles',
                        label: '角色',
                        disabled: disabled,
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
                        onChange: (name: string, form: FormInstance) => {
                            const roles = form.getFieldValue('roles');
                            setRoleIds(roles);
                        },
                    },
                ],
            },
            {
                type: 'component',
                Component: PermissionTree,
                names: [], // 不收集参数
                props: {
                    roleIds: roleIds,
                    disabled: disabled || treeDisabled,
                },
            },
        ] as FormField<any>[];
    }, [roleIds]);

    return useMemo(() => {
        return (
            <JsonForm
                ref={originFormRef}
                layout="horizontal"
                labelClassName={styles.formModalLabel}
                fieldList={formFields}
            />
        );
    }, [roleIds, roleList]);
};

const AddAccountModal: React.FC<AddAccountModalProps> = ({
    visible,
    onClose,
    onSearch,
    onReload,
}) => {
    const formRef = useRef<JsonFormRef>(null);
    const [submitting, setSubmitting] = useState(false);
    const { type, id } = visible || {};
    const visibleProps = useRef<VisibleProps>({
        type: 'view',
    });
    useMemo(() => {
        if (visible) {
            visibleProps.current = visible;
        }
    }, [visible]);

    const _visible = visibleProps.current;

    const onOKey = useCallback(() => {
        formRef.current!.validateFields().then((values: any) => {
            console.log(values);
            setSubmitting(true);
            switch (type) {
                case 'add':
                    addAccount(values)
                        .then(() => {
                            message.success('添加账号成功');
                            onClose();
                            onSearch();
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
                    })
                        .then(() => {
                            message.success('修改账号成功');
                            onClose();
                            onReload();
                        })
                        .finally(() => {
                            setSubmitting(false);
                        });
                    break;
            }
        });
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
                footer={_visible.type === 'view' ? null : undefined}
                destroyOnClose={true}
            >
                <AddAccountModalContent
                    visibleType={(visible as VisibleProps).type}
                    id={(visible as VisibleProps).id}
                    originFormRef={formRef}
                />
            </Modal>
        );
    }, [submitting, visible]);
};

export { AddAccountModal };

import React, { RefObject, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { message, Modal } from 'antd';
import { JsonForm } from 'react-components';
import styles from '../_index.less';
import classNames from 'classnames';
import formStyles from 'react-components/es/JsonForm/_form.less';
import { CaretRightOutlined } from '@ant-design/icons';
import { FormField, JsonFormRef } from 'react-components/es/JsonForm';
import PermissionTree from '@/pages/setting/_role/components/PermissionTree';
import {
    addAccount,
    addRole,
    editRole,
    queryAccount,
    queryRolePermission,
    updateAccount,
} from '@/services/setting';
import { useDispatch } from '@@/plugin-dva/exports';

declare interface VisibleProps {
    type: 'add' | 'view' | 'edit';
    detail?: {
        name: string;
        description: string;
        status: '1' | '2';
        id: string;
    };
}
declare interface AddAccountModalProps {
    visible: VisibleProps | false; // 新增｜查看｜编辑
    onClose: () => void;
    onSearch: () => void;
    onReload: () => void;
}

const formatterFormValues = (values: any) => {
    const { data = [], page_tree = [], ...extra } = values;
    return {
        ...extra,
        role_auths: data
            .filter((key: string) => key !== 'all')
            .concat(page_tree.flat().filter(Boolean))
            .map((id: string) => Number(id)),
    };
};

declare interface AddRoleModalContent extends VisibleProps {
    originFormRef: RefObject<JsonFormRef>;
}

const AddRoleModalContent: React.FC<AddRoleModalContent> = ({ originFormRef, type, detail }) => {
    const disabled = type === 'view';
    const formFields = useMemo(() => {
        const roleIds = detail ? [detail.id] : undefined;
        return [
            {
                type: 'layout',
                header: <span className={styles.formModalTitle}>基本信息</span>,
                fieldList: [
                    {
                        type: 'input',
                        label: '角色名称',
                        name: 'name',
                        disabled: disabled,
                    },
                    {
                        type: 'input',
                        label: '角色描述',
                        name: 'description',
                        disabled: disabled,
                    },
                    {
                        type: 'radioGroup',
                        name: 'status',
                        label: '角色状态',
                        initialValue: '1',
                        formatter: 'number',
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
                    },
                ],
            },
            {
                type: 'component',
                Component: PermissionTree,
                names: ['data', 'page_tree'], // 不收集参数
                props: {
                    roleIds: roleIds,
                    disabled: disabled,
                },
            },
        ] as FormField<any>[];
    }, []);

    return useMemo(() => {
        return (
            <JsonForm
                initialValues={{
                    name: detail?.name,
                    description: detail?.description,
                    status: detail?.status,
                }}
                ref={originFormRef}
                layout="horizontal"
                labelClassName={styles.formModalLabel}
                fieldList={formFields}
            />
        );
    }, []);
};

const AddRoleModal: React.FC<AddAccountModalProps> = ({ visible, onClose, onReload, onSearch }) => {
    const { type } = visible || {};
    const formRef = useRef<JsonFormRef>(null);
    const [submitting, setSubmitting] = useState(false);
    const dispatch = useDispatch();

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
            setSubmitting(true);
            const data = formatterFormValues(values);
            switch (type) {
                case 'add':
                    addRole(data)
                        .then(() => {
                            message.success('添加角色成功');
                            onClose();
                            onSearch();
                            // 刷新角色列表
                            dispatch({
                                type: 'account/queryRoleSimpleList',
                            });
                        })
                        .finally(() => {
                            setSubmitting(false);
                        });
                    break;
                case 'view':
                    break;
                case 'edit':
                    editRole((visible as VisibleProps).detail!.id, data)
                        .then(() => {
                            message.success('编辑角色成功');
                            onClose();
                            onReload();
                        })
                        .finally(() => {
                            setSubmitting(false);
                        });
                    break;
                default:
                    break;
            }
        });
    }, [type]);

    return useMemo(() => {
        return (
            <Modal
                title={type === 'add' ? '添加角色' : type === 'view' ? '查看角色' : '修改角色'}
                width={800}
                visible={!!visible}
                onCancel={onClose}
                confirmLoading={submitting}
                onOk={onOKey}
                footer={_visible.type === 'view' ? null : undefined}
                destroyOnClose={true}
            >
                <AddRoleModalContent
                    type={(visible as VisibleProps).type}
                    detail={(visible as VisibleProps).detail}
                    originFormRef={formRef}
                />
            </Modal>
        );
    }, [submitting, visible]);
};

export { AddRoleModal };

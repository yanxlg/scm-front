import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
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
    queryAccount,
    queryRolePermission,
    updateAccount,
} from '@/services/setting';

declare interface VisibleProps {
    type: 'add' | 'view' | 'edit';
    detail?: {
        name: string;
        description: string;
        status: '0' | '1';
        id: string;
    };
}
declare interface AddAccountModalProps {
    visible: VisibleProps | false; // 新增｜查看｜编辑
    onClose: () => void;
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

const AddRoleModal: React.FC<AddAccountModalProps> = ({ visible, onClose }) => {
    const { type } = visible || {};
    const formRef = useRef<JsonFormRef>(null);
    const [submitting, setSubmitting] = useState(false);

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
                        })
                        .finally(() => {
                            setSubmitting(false);
                        });
                    break;
                case 'view':
                    break;
                default:
                    break;
            }
        });
    }, [type]);

    const footerRef = useRef<null>();
    useMemo(() => {
        if (type) {
            footerRef.current = type === 'view' ? null : undefined;
        }
    }, [type]);

    const formFields = useMemo(() => {
        return [
            {
                type: 'layout',
                header: <span className={styles.formModalTitle}>基本信息</span>,
                fieldList: [
                    {
                        type: 'input',
                        label: '角色名称',
                        name: 'name',
                    },
                    {
                        type: 'input',
                        label: '角色描述',
                        name: 'description',
                    },
                    {
                        type: 'radioGroup',
                        name: 'status',
                        label: '角色状态',
                        initialValue: 1,
                        options: [
                            {
                                label: '启用',
                                value: 1,
                            },
                            {
                                label: '禁用',
                                value: 0,
                            },
                        ],
                    },
                ],
            },
            {
                type: 'component',
                Component: PermissionTree,
                names: ['data', 'page_tree'], // 不收集参数
            },
        ] as FormField<any>[];
    }, []);

    useEffect(() => {
        if (visible) {
            formRef.current?.resetFields();
        }
        switch (type) {
            case 'edit':
            case 'view':
                const { detail } = visible as VisibleProps;
                console.log(detail);
                formRef.current?.setFieldsValue({
                    name: detail?.name,
                    description: detail?.description,
                    status: Number(detail?.status),
                });
                // 查询选中权限
                queryRolePermission([detail?.id!]).then(() => {});
                break;
            default:
                break;
        }
    }, [visible]);

    return useMemo(() => {
        return (
            <Modal
                title={type === 'add' ? '添加角色' : type === 'view' ? '查看角色' : '修改角色'}
                width={800}
                visible={!!visible}
                onCancel={onClose}
                confirmLoading={submitting}
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
    }, [submitting, visible]);
};

export { AddRoleModal };

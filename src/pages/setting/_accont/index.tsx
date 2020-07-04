import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { FormField, JsonFormRef } from 'react-components/es/JsonForm';
import { FitTable, JsonForm, LoadingButton, useList, useModal2 } from 'react-components';
import formStyles from 'react-components/es/JsonForm/_form.less';
import {
    queryAccountCreator,
    queryAccountList,
    updateAccountStatus,
    updateRoleStatus,
} from '@/services/setting';
import { Button, Switch } from 'antd';
import { scroll } from '@/config/global';
import { PlusOutlined } from '@ant-design/icons';
import { ColumnType } from 'antd/es/table';
import styles from './_index.less';
import { AddAccountModal } from './components/AddAccountModal';
import { IAccount } from '@/interface/ISetting';
import { utcToLocal } from 'react-components/es/utils/date';
import { useDispatch } from '@@/plugin-dva/exports';
import { ConnectState } from '@/models/connect';
import LoadingSwitch from '@/pages/setting/_role/components/LoadingSwitch';
import { PermissionComponent } from 'rc-permission';

const fieldsList: FormField[] = [
    {
        type: 'positiveInteger',
        label: '账号ID',
        name: 'user_id',
        formatter: 'number',
    },
    {
        type: 'input',
        label: '用户名',
        name: 'username',
    },
    {
        type: 'select',
        label: '角色',
        name: 'role_id',
        initialValue: '',
        syncDefaultOption: {
            name: '全部',
            value: '',
        },
        optionList: {
            type: 'select',
            selector: (state: ConnectState) => {
                return state?.account?.roleSimpleList;
            },
        },
    },
    {
        type: 'select',
        label: '创建人',
        name: 'create_user',
        initialValue: '',
        syncDefaultOption: {
            name: '全部',
            value: '',
        },
        optionList: () => queryAccountCreator(),
    },
    {
        type: 'select',
        label: '状态',
        name: 'status',
        initialValue: '',
        optionList: [
            {
                name: '全部',
                value: '',
            },
            {
                name: '启用',
                value: 1,
            },
            {
                name: '禁用',
                value: 2,
            },
        ],
    },
    {
        type: 'dateRanger',
        label: '创建时间',
        name: ['create_time_start', 'create_time_end'],
        formatter: ['start_date', 'end_date'],
        className: styles.formDate,
    },
];

const Account = () => {
    const formRef = useRef<JsonFormRef>(null);
    const {
        total,
        pageSize,
        pageNumber,
        loading,
        dataSource,
        onReload,
        onChange,
        onSearch,
    } = useList<IAccount>({
        queryList: queryAccountList,
        formRef: formRef,
    });

    const dispatch = useDispatch();

    useEffect(() => {
        // 获取角色列表
        dispatch({
            type: 'account/queryRoleSimpleList',
        });
    }, []);

    const [addModal, showAddModal, closeAddModal] = useModal2<{
        type: 'add' | 'view' | 'edit';
        id?: string;
    }>();

    const form = useMemo(() => {
        return (
            <JsonForm ref={formRef} fieldList={fieldsList} labelClassName={styles.formLabel}>
                <LoadingButton type="primary" onClick={onSearch} className={formStyles.formBtn}>
                    查询
                </LoadingButton>
                <LoadingButton onClick={onReload} className={formStyles.formBtn}>
                    刷新
                </LoadingButton>
            </JsonForm>
        );
    }, []);

    const updateStatus = useCallback((id: string, status: number, row: IAccount) => {
        return updateAccountStatus(id, status).then(() => {
            row.status = String(status) as '1' | '2';
            return status === 1;
        });
    }, []);

    const columns = useMemo<ColumnType<IAccount>[]>(() => {
        return [
            {
                title: '账号ID',
                fixed: 'left',
                width: '150px',
                align: 'center',
                dataIndex: 'id',
            },
            {
                title: '操作',
                dataIndex: 'operations',
                align: 'center',
                width: '150px',
                render: (_, item) => {
                    return (
                        <>
                            <PermissionComponent
                                pid={'setting/permission/user/view'}
                                control={'tooltip'}
                            >
                                <Button
                                    type="link"
                                    onClick={() => {
                                        showAddModal({
                                            type: 'view',
                                            id: item.id,
                                        });
                                    }}
                                >
                                    查看
                                </Button>
                            </PermissionComponent>
                            <PermissionComponent
                                pid={'setting/permission/user/update'}
                                control={'tooltip'}
                            >
                                <Button
                                    type="link"
                                    onClick={() => {
                                        showAddModal({
                                            type: 'edit',
                                            id: item.id,
                                        });
                                    }}
                                >
                                    修改
                                </Button>
                            </PermissionComponent>
                        </>
                    );
                },
            },
            {
                title: '用户名',
                width: '140px',
                dataIndex: 'username',
                align: 'center',
            },
            {
                title: '角色',
                width: '150px',
                dataIndex: 'roles',
                align: 'center',
                render: _ => _.join(','),
            },
            {
                title: '创建人',
                dataIndex: 'create_user',
                width: '280px',
                align: 'center',
            },
            {
                title: '创建时间',
                dataIndex: 'create_time',
                width: '180px',
                align: 'center',
                render: _ => utcToLocal(_),
            },
            {
                title: '状态',
                dataIndex: 'status',
                width: '130px',
                align: 'center',
                render: (_, row) => {
                    const value = Number(_);
                    const active = value === 1;
                    return (
                        <>
                            <span className={styles.statusLabel}>{active ? '启用' : '禁用'}</span>
                            <PermissionComponent
                                pid="setting/permission/user/update_status"
                                control="tooltip"
                            >
                                <LoadingSwitch
                                    checked={active}
                                    onClick={() => updateStatus(row.id, active ? 2 : 1, row)}
                                />
                            </PermissionComponent>
                        </>
                    );
                },
            },
        ];
    }, []);

    const pagination = useMemo(() => {
        return {
            total: total,
            current: pageNumber,
            pageSize: pageSize,
            showSizeChanger: true,
            position: ['topRight', 'bottomRight'],
        } as any;
    }, [loading]);

    const toolBarRender = useCallback(() => {
        return [
            <PermissionComponent key="1" pid="setting/permission/user/add" control="tooltip">
                <Button
                    type="primary"
                    onClick={() => {
                        showAddModal({
                            type: 'add',
                        });
                    }}
                >
                    <PlusOutlined />
                    添加账号
                </Button>
            </PermissionComponent>,
        ];
    }, []);

    const table = useMemo(() => {
        return (
            <FitTable
                columns={columns}
                dataSource={dataSource}
                rowKey="id"
                bordered={true}
                scroll={scroll}
                bottom={60}
                minHeight={500}
                pagination={pagination}
                loading={loading}
                onChange={onChange}
                toolBarRender={toolBarRender}
            />
        );
    }, [loading]);

    return useMemo(() => {
        return (
            <>
                {form}
                {table}
                <AddAccountModal
                    visible={addModal}
                    onClose={closeAddModal}
                    onSearch={onSearch}
                    onReload={onReload}
                />
            </>
        );
    }, [loading, addModal]);
};

export { Account };

import React, { useCallback, useMemo, useRef } from 'react';
import { FormField, JsonFormRef } from 'react-components/es/JsonForm';
import {
    FitTable,
    JsonForm,
    LoadingButton,
    PopConfirmLoadingButton,
    useList,
    useModal2,
} from 'react-components';
import formStyles from 'react-components/es/JsonForm/_form.less';
import { queryRoleCreator, queryRoleList, deleteRole, updateRoleStatus } from '@/services/setting';
import { Button, message, Switch } from 'antd';
import { scroll } from '@/config/global';
import { PlusOutlined } from '@ant-design/icons';
import { ColumnType } from 'antd/es/table';
import styles from './_index.less';
import { AddRoleModal } from './components/AddRoleModal';
import { ConnectState } from '@/models/connect';
import { IRole } from '@/interface/ISetting';
import { utcToLocal } from 'react-components/es/utils/date';
import LoadingSwitch from '@/pages/setting/_role/components/LoadingSwitch';
import { PermissionComponent } from 'rc-permission';
import { useDispatch } from '@@/plugin-dva/exports';

const fieldsList: FormField[] = [
    {
        type: 'input',
        label: '角色ID',
        name: 'id',
    },
    {
        type: 'select',
        label: '角色名称',
        name: 'name',
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
        optionList: () => queryRoleCreator(),
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

const Role = () => {
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
    } = useList<IRole>({
        queryList: queryRoleList,
    });

    const dispatch = useDispatch();

    const [addModal, showAddModal, closeAddModal] = useModal2<{
        type: 'add' | 'view' | 'edit';
        detail?: {
            name: string;
            description: string;
            status: '1' | '2';
            id: string;
        };
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

    const rmRole = useCallback((id: string) => {
        return deleteRole(id).then(() => {
            message.success('删除成功!');
            onReload();
            // 刷新角色列表
            dispatch({
                type: 'account/queryRoleSimpleList',
            });
        });
    }, []);

    const updateStatus = useCallback((id: string, status: number, row: IRole) => {
        return updateRoleStatus(id, status).then(() => {
            row.status = String(status) as '1' | '2';
            return status === 1;
        });
    }, []);

    const columns = useMemo<ColumnType<IRole>[]>(() => {
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
                            <Button
                                type="link"
                                onClick={() =>
                                    showAddModal({
                                        type: 'view',
                                        detail: item,
                                    })
                                }
                            >
                                查看
                            </Button>
                            <PermissionComponent
                                pid={'setting/permission/role/edit'}
                                control="tooltip"
                            >
                                <Button
                                    type="link"
                                    onClick={() =>
                                        showAddModal({
                                            type: 'edit',
                                            detail: item,
                                        })
                                    }
                                >
                                    修改
                                </Button>
                            </PermissionComponent>
                            <PermissionComponent
                                pid={'setting/permission/role/delete'}
                                control="tooltip"
                            >
                                <PopConfirmLoadingButton
                                    popConfirmProps={{
                                        title: '确定要阐述改角色吗？',
                                        onConfirm: () => rmRole(item.id),
                                    }}
                                    buttonProps={{
                                        type: 'link',
                                        children: '删除',
                                    }}
                                />
                            </PermissionComponent>
                        </>
                    );
                },
            },
            {
                title: '角色名称',
                width: '140px',
                dataIndex: 'name',
                align: 'center',
            },
            {
                title: '角色描述',
                width: '150px',
                dataIndex: 'description',
                align: 'center',
            },
            {
                title: '用户列表',
                dataIndex: 'users',
                width: '280px',
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
                width: '130px',
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
                                pid="setting/permission/role/update_status"
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
            <PermissionComponent key="1" pid="setting/permission/role/add" control="tooltip">
                <Button
                    type="primary"
                    onClick={() => {
                        showAddModal({
                            type: 'add',
                        });
                    }}
                >
                    <PlusOutlined />
                    添加角色
                </Button>
            </PermissionComponent>,
        ];
    }, []);

    const table = useMemo(() => {
        return (
            <FitTable
                columns={columns}
                dataSource={dataSource}
                rowKey="accountId"
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
                <AddRoleModal
                    visible={addModal}
                    onClose={closeAddModal}
                    onReload={onReload}
                    onSearch={onSearch}
                />
            </>
        );
    }, [addModal, loading]);
};

export { Role };

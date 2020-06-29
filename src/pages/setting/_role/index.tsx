import React, { useCallback, useMemo, useRef } from 'react';
import { FormField, JsonFormRef } from 'react-components/es/JsonForm';
import { FitTable, JsonForm, LoadingButton, useList, useModal2 } from 'react-components';
import formStyles from 'react-components/es/JsonForm/_form.less';
import { queryAccountCreator, queryRoleCreator, queryRoleList } from '@/services/setting';
import { Button, Switch } from 'antd';
import { scroll } from '@/config/global';
import { PlusOutlined } from '@ant-design/icons';
import { ColumnType } from 'antd/es/table';
import styles from './_index.less';
import { AddRoleModal } from './components/AddRoleModal';
import { ConnectState } from '@/models/connect';
import { IRole } from '@/interface/ISetting';
import { utcToLocal } from 'react-components/es/utils/date';

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
                value: 0,
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

    const onExport = useCallback(() => {}, []);

    const [addModal, showAddModal, closeAddModal] = useModal2<{
        type: 'add' | 'view' | 'edit';
        detail?: {
            name: string;
            description: string;
            status: '0' | '1';
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
                <Button onClick={onExport} className={formStyles.formBtn}>
                    导出
                </Button>
            </JsonForm>
        );
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
                            <Button type="link">删除</Button>
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
                render: (value, row) => {
                    const active = Boolean(Number(value));
                    return (
                        <>
                            {active ? '启用' : '禁用'}
                            <Switch checked={active} />
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
            <Button
                type="primary"
                key="1"
                onClick={() => {
                    showAddModal({
                        type: 'add',
                    });
                }}
            >
                <PlusOutlined />
                添加角色
            </Button>,
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
                <AddRoleModal visible={addModal} onClose={closeAddModal} />
            </>
        );
    }, [addModal, loading]);
};

export { Role };

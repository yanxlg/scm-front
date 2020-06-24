import React, { useCallback, useMemo, useRef } from 'react';
import { FormField, JsonFormRef } from 'react-components/es/JsonForm';
import { FitTable, JsonForm, LoadingButton, useList, useModal2 } from 'react-components';
import formStyles from 'react-components/es/JsonForm/_form.less';
import { queryAccountList } from '@/services/setting';
import { Button, Switch } from 'antd';
import { scroll } from '@/config/global';
import { PlusOutlined } from '@ant-design/icons';
import { ColumnType } from 'antd/es/table';
import styles from './_index.less';
import { AddAccountModal } from './components/AddAccountModal';
import { IAccount } from '@/interface/ISetting';
import { utcToLocal } from 'react-components/es/utils/date';

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
    },
    {
        type: 'select',
        label: '创建人',
        name: 'create_user',
    },
    {
        type: 'select',
        label: '状态',
        name: 'status',
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
    });

    const [addModal, showAddModal, closeAddModal] = useModal2<boolean>();

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

    const columns = useMemo<ColumnType<any>[]>(() => {
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
                render: () => {
                    return (
                        <>
                            <Button type="link">查看</Button>
                            <Button type="link">修改</Button>
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
                    showAddModal(true);
                }}
            >
                <PlusOutlined />
                添加账号
            </Button>,
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
                <AddAccountModal visible={addModal} onClose={closeAddModal} />
            </>
        );
    }, [loading, addModal]);
};

export { Account };

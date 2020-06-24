import React, { useCallback, useMemo, useRef } from 'react';
import { FormField, JsonFormRef } from 'react-components/es/JsonForm';
import { FitTable, JsonForm, LoadingButton, useList } from 'react-components';
import formStyles from 'react-components/es/JsonForm/_form.less';
import { queryAccount } from '@/services/setting';
import { Button, Switch } from 'antd';
import { scroll } from '@/config/global';
import { PlusOutlined } from '@ant-design/icons';
import { ColumnType } from 'antd/es/table';
import styles from './_index.less';
import { AddRoleModal } from './components/AddRoleModal';

const fieldsList: FormField[] = [
    {
        type: 'input',
        label: '账号ID',
        name: 'account',
    },
    {
        type: 'select',
        label: '角色名称',
        name: 'user_name',
    },
    {
        type: 'select',
        label: '创建人',
        name: 'create_by',
    },
    {
        type: 'select',
        label: '状态',
        name: 'state',
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
    } = useList({
        queryList: queryAccount,
    });

    const onExport = useCallback(() => {}, []);

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

    const columns = useMemo<ColumnType<any>[]>(() => {
        return [
            {
                title: '账号ID',
                fixed: 'left',
                width: '150px',
                align: 'center',
                dataIndex: 'account',
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
                            <Button type="link">删除</Button>
                        </>
                    );
                },
            },
            {
                title: '角色名称',
                width: '140px',
                dataIndex: 'userName',
                align: 'center',
            },
            {
                title: '角色秒数',
                width: '150px',
                dataIndex: 'role',
                align: 'center',
            },
            {
                title: '用户列表',
                dataIndex: 'createBy',
                width: '280px',
                align: 'center',
            },
            {
                title: '创建人',
                dataIndex: 'createBy',
                width: '280px',
                align: 'center',
            },
            {
                title: '创建时间',
                dataIndex: 'createTime',
                width: '130px',
                align: 'center',
            },
            {
                title: '状态',
                dataIndex: 'purchaseMerchantName',
                width: '130px',
                align: 'center',
                render: (value, row) => {
                    return (
                        <>
                            启用
                            <Switch />
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
            <Button type="primary" key="1" onClick={() => {}}>
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
    }, []);

    return useMemo(() => {
        return (
            <>
                {form}
                {table}
                <AddRoleModal visible={true} />
            </>
        );
    }, []);
};

export { Role };

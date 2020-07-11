import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import Container from '@/components/Container';
import { JsonForm, LoadingButton, useList, FitTable, useModal2 } from 'react-components';
import { JsonFormRef, FormField } from 'react-components/es/JsonForm';
import { Button } from 'antd';
import formStyles from 'react-components/es/JsonForm/_form.less';
import { queryErrorConfigList } from '@/services/setting';
import { PaginationConfig } from 'react-components/es/FitTable';
import { ColumnType } from 'antd/es/table';
import { scroll } from '@/config/global';
import EditPage, { EditPageProps } from '@/pages/setting/purchase_error_code/components/EditPage';
import styles from './index.module.less';
import { useDispatch } from '@@/plugin-dva/exports';
import { ConnectState } from '@/models/connect';
import { IErrorConfigItem } from '@/interface/ISetting';
import UpdateLog, {
    UpdateLogProps,
} from '@/pages/setting/purchase_error_code/components/UpdateLog';
import { PermissionRouterWrap, PermissionComponent } from 'rc-permission';

const fieldList: FormField[] = [
    {
        type: 'select@2',
        label: '中台错误码',
        name: 'middle_code',
        initialValue: '',
        options: {
            selector: (state: ConnectState) => {
                return state.options.platformErrorCode;
            },
        },
        childrenProps: {
            mode: 'multiple',
        },
    },
    {
        type: 'select@2',
        label: '中台错误文案',
        name: 'middle_text',
        initialValue: '',
        options: {
            selector: (state: ConnectState) => {
                return state.options.platformErrorLabel;
            },
        },
        childrenProps: {
            mode: 'multiple',
        },
    },
    {
        type: 'select@2',
        label: '订单错误码',
        initialValue: '',
        name: 'order_code',
        options: {
            selector: (state: ConnectState) => {
                return state.options.orderErrorCode;
            },
        },
        childrenProps: {
            mode: 'multiple',
        },
    },
    {
        type: 'select@2',
        label: '渠道错误码',
        name: 'channel_code',
        initialValue: '',
        options: {
            selector: (state: ConnectState) => {
                return state.options.channelErrorCode;
            },
        },
        childrenProps: {
            mode: 'multiple',
        },
    },
    {
        type: 'select@2',
        label: '采购渠道',
        name: 'purchase_channel',
        initialValue: '',
        options: {
            selector: (state: ConnectState) => {
                return state.options.purchaseChannel;
            },
        },
        childrenProps: {
            mode: 'multiple',
        },
    },
    {
        type: 'select@2',
        label: '渠道错误文案',
        name: 'channel_text',
        initialValue: '',
        options: {
            selector: (state: ConnectState) => {
                return state.options.channelErrorLabel;
            },
        },
        childrenProps: {
            mode: 'multiple',
        },
    },
];

const PurchaseErrorCode = () => {
    const formRef = useRef<JsonFormRef>(null);

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch({
            type: 'options/queryErrorCode',
        });
        dispatch({
            type: 'options/channel',
        });
    }, []);

    const {
        dataSource,
        total,
        pageNumber,
        pageSize,
        loading,
        onChange,
        onReload,
        onSearch,
    } = useList({
        formRef: formRef,
        queryList: queryErrorConfigList,
    });

    const pagination = useMemo(() => {
        return {
            total: total,
            current: pageNumber,
            pageSize: pageSize,
            showSizeChanger: true,
            position: ['topRight', 'bottomRight'],
        } as PaginationConfig;
    }, [total, pageNumber, pageSize]);

    const columns = useMemo<ColumnType<IErrorConfigItem>[]>(() => {
        return [
            {
                title: '操作',
                fixed: 'left',
                width: '150px',
                align: 'center',
                dataIndex: 'operation',
                render: (_, item) => {
                    return (
                        <PermissionComponent
                            pid="setting/purchase_error_code/update"
                            control="tooltip"
                        >
                            <Button type="link" onClick={() => onEditClick(item)}>
                                更新
                            </Button>
                        </PermissionComponent>
                    );
                },
            },
            {
                title: '中台错误码',
                width: '150px',
                align: 'center',
                dataIndex: 'middle_code',
            },
            {
                title: '中台错误文案',
                width: '150px',
                align: 'center',
                dataIndex: 'middle_text',
            },
            {
                title: '订单错误码',
                width: '150px',
                align: 'center',
                dataIndex: 'order_code',
            },
            {
                title: '采购渠道',
                width: '150px',
                align: 'center',
                dataIndex: 'purchase_channel',
            },
            {
                title: '渠道错误码',
                width: '150px',
                align: 'center',
                dataIndex: 'channel_code',
            },
            {
                title: '渠道错误文案',
                width: '150px',
                align: 'center',
                dataIndex: 'channel_text',
            },
            {
                title: '更新记录',
                width: '120px',
                align: 'center',
                dataIndex: 'operation_update',
                render: (_, row) => {
                    return (
                        <Button
                            type="link"
                            onClick={() => {
                                const { record } = row;
                                let list = [];
                                try {
                                    list = JSON.parse(record);
                                } catch (e) {}
                                showLogModal(list);
                            }}
                        >
                            查看
                        </Button>
                    );
                },
            },
        ];
    }, []);

    const [editProps, setEditProps, closeEditPage] = useModal2<
        Partial<Omit<EditPageProps, 'onClick'>>
    >();

    const [logModal, showLogModal, closeLogModal] = useModal2<UpdateLogProps['list']>();

    const onEditClick = useCallback((data: IErrorConfigItem) => {
        setEditProps({
            type: 'edit',
            data: data,
        });
    }, []);

    return useMemo(() => {
        return (
            <Container>
                <JsonForm fieldList={fieldList} ref={formRef} labelClassName={styles.formLabel}>
                    <LoadingButton className={formStyles.formBtn} type="primary" onClick={onSearch}>
                        查询
                    </LoadingButton>
                    {/*   <Button className={formStyles.formBtn} onClick={onAddClick}>
                        <PlusOutlined />
                        新增采购错误码
                    </Button>*/}
                </JsonForm>
                <FitTable
                    rowKey="id"
                    bordered={true}
                    dataSource={dataSource}
                    columns={columns}
                    loading={loading}
                    pagination={pagination}
                    scroll={scroll}
                    bottom={150}
                    minHeight={450}
                    onChange={onChange}
                />
                {editProps && (
                    <EditPage
                        type="add"
                        {...editProps}
                        onClose={closeEditPage}
                        onReload={onReload}
                    />
                )}
                <UpdateLog list={logModal} onClose={closeLogModal} />
            </Container>
        );
    }, [loading, editProps, logModal]);
};

export default PermissionRouterWrap(PurchaseErrorCode, {
    login: true,
    pid: 'setting/purchase_error_code',
});

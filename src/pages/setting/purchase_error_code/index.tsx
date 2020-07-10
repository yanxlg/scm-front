import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import Container from '@/components/Container';
import { JsonForm, LoadingButton, useList, FitTable, useModal2 } from 'react-components';
import { JsonFormRef, FormField } from 'react-components/es/JsonForm';
import { SettingModeState } from '@/pages/setting/model';
import { Button } from 'antd';
import formStyles from 'react-components/es/JsonForm/_form.less';
import { queryErrorConfigList } from '@/services/setting';
import { PaginationConfig } from 'react-components/es/FitTable';
import { ColumnType } from 'antd/es/table';
import { scroll } from '@/config/global';
import EditPage, { EditPageProps } from '@/pages/setting/purchase_error_code/components/EditPage';
import { PlusOutlined } from '@ant-design/icons';
import styles from './index.module.less';
import { queryGoodsSourceList } from '@/services/global';
import { useDispatch } from '@@/plugin-dva/exports';

const fieldList: FormField[] = [
    {
        type: 'select',
        label: '中台错误码',
        name: 'middle_code',
        optionList: {
            type: 'select',
            selector: (state: { setting: SettingModeState }) => {
                return state.setting.platformErrorCode;
            },
        },
    },
    {
        type: 'select',
        label: '中台错误文案',
        name: 'middle_text',
        optionList: {
            type: 'select',
            selector: (state: { setting: SettingModeState }) => {
                return state.setting.platformErrorLabel;
            },
        },
    },
    {
        type: 'select',
        label: '订单错误码',
        name: 'order_code',
        optionList: {
            type: 'select',
            selector: (state: { setting: SettingModeState }) => {
                return state.setting.orderErrorCode;
            },
        },
    },
    {
        type: 'select',
        label: '渠道错误码',
        name: 'channel_code',
        optionList: {
            type: 'select',
            selector: (state: { setting: SettingModeState }) => {
                return state.setting.channelErrorCode;
            },
        },
    },
    {
        type: 'treeSelect',
        label: '采购渠道',
        name: 'purchase_channel',
        optionList: () => queryGoodsSourceList(),
        showArrow: true,
        initialValue: 'all',
        showCheckedStrategy: 'SHOW_PARENT',
        treeNodeFilterProp: 'title',
    },
    {
        type: 'select',
        label: '渠道错误文案',
        name: 'channel_text',
        optionList: {
            type: 'select',
            selector: (state: { setting: SettingModeState }) => {
                return state.setting.channelErrorLabel;
            },
        },
    },
];

const PurchaseErrorCode = () => {
    const formRef = useRef<JsonFormRef>(null);

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch({
            type: 'setting/queryErrorCode',
        });
    }, []);

    const { dataSource, total, pageNumber, pageSize, loading, onChange, onReload } = useList({
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

    const columns = useMemo<ColumnType<any>[]>(() => {
        return [
            {
                title: '操作',
                fixed: 'left',
                width: '150px',
                align: 'center',
                dataIndex: 'operation',
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
                render: () => {
                    return <Button type="link">查看</Button>;
                },
            },
        ];
    }, []);

    const [editProps, setEditProps, closeEditPage] = useModal2<
        Partial<Omit<EditPageProps, 'onClick'>>
    >();

    const onAddClick = useCallback(() => {
        setEditProps({
            type: 'add',
        });
    }, []);

    return useMemo(() => {
        return (
            <Container>
                <JsonForm fieldList={fieldList} ref={formRef} labelClassName={styles.formLabel}>
                    <LoadingButton className={formStyles.formBtn} type="primary" onClick={() => {}}>
                        查询
                    </LoadingButton>
                    <Button className={formStyles.formBtn} onClick={onAddClick}>
                        <PlusOutlined />
                        新增采购错误码
                    </Button>
                </JsonForm>
                <FitTable
                    dataSource={dataSource}
                    columns={columns}
                    loading={loading}
                    pagination={pagination}
                    scroll={scroll}
                    bottom={60}
                    minHeight={500}
                    onChange={onChange}
                />
                {editProps && <EditPage type="add" {...editProps} onClose={closeEditPage} />}
            </Container>
        );
    }, [loading, editProps]);
};

export default PurchaseErrorCode;

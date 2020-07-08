import React, { useCallback, useMemo, useRef } from 'react';
import Container from '@/components/Container';
import { JsonForm, LoadingButton, useList, FitTable, useModal2 } from 'react-components';
import { JsonFormRef, FormField } from 'react-components/es/JsonForm';
import { SettingModeState } from '@/pages/setting/model';
import { Button } from 'antd';
import formStyles from 'react-components/es/JsonForm/_form.less';
import { queryErrorConfigList } from '@/services/setting';
import { PaginationConfig } from 'react-components/src/FitTable/index';
import { ColumnType } from 'antd/es/table';
import { scroll } from '@/config/global';
import EditPage, { EditPageProps } from '@/pages/setting/components/purchaseErrorCode/EditPage';
import { PlusOutlined } from '@ant-design/icons';

const fieldList: FormField[] = [
    {
        type: 'select',
        label: '中台错误码',
        name: 'platformCode',
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
        name: 'platformLabel',
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
        name: 'orderCode',
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
        name: 'channelCode',
        optionList: {
            type: 'select',
            selector: (state: { setting: SettingModeState }) => {
                return state.setting.channelErrorCode;
            },
        },
    },
    {
        type: 'select',
        label: '采购渠道',
        name: 'channel',
        optionList: [],
    },
    {
        type: 'select',
        label: '渠道错误文案',
        name: 'channelLabel',
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
                dataIndex: 'platformCode',
            },
            {
                title: '中台错误文案',
                width: '150px',
                align: 'center',
                dataIndex: 'platformLabel',
            },
            {
                title: '订单错误码',
                width: '150px',
                align: 'center',
                dataIndex: 'orderCode',
            },
            {
                title: '采购渠道',
                width: '150px',
                align: 'center',
                dataIndex: 'channel',
            },
            {
                title: '渠道错误码',
                width: '150px',
                align: 'center',
                dataIndex: 'channelCode',
            },
            {
                title: '渠道错误文案',
                width: '150px',
                align: 'center',
                dataIndex: 'channelLabel',
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
                <JsonForm fieldList={fieldList} ref={formRef}>
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

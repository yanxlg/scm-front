import React, { useMemo, useEffect, useState, useCallback, useRef } from 'react';
import { Modal, Input, message, Button, Select } from 'antd';
import { JsonFormRef, FormField } from 'react-components/es/JsonForm';
import { useList, FitTable, JsonForm, LoadingButton } from 'react-components';
import { getAbnormalAllList, setDiscardAbnormalOrder, downloadExcel } from '@/services/purchase';
import {
    IPurchaseAbnormalItem,
    IWaybillExceptionTypeKey,
    IWaybillExceptionStatusKey,
} from '@/interface/IPurchase';
import { ColumnProps } from 'antd/es/table';
import { AutoEnLargeImg } from 'react-components';
import {
    waybillExceptionTypeList,
    defaultOptionItem,
    waybillExceptionTypeMap,
    waybillExceptionStatusMap,
} from '@/enums/PurchaseEnum';
import TextArea from 'antd/lib/input/TextArea';
// import { utcToLocal } from 'react-components/es/utils/date';
import { QuestionCircleOutlined } from '@ant-design/icons';
import Export from '@/components/Export';

import styles from '../../_abnormal.less';
import formStyles from 'react-components/es/JsonForm/_form.less';

const { Option } = Select;

const fieldList: FormField[] = [
    {
        type: 'input',
        name: 'waybill_exception_sn',
        label: '异常单ID',
        placeholder: '请输入',
        formatter: 'str_arr',
    },
    {
        type: 'select',
        name: 'waybill_exception_type',
        label: '异常类型',
        optionList: [defaultOptionItem, ...waybillExceptionTypeList],
    },
    {
        type: 'input',
        name: 'purchase_order_id',
        label: '采购单ID',
        placeholder: '请输入',
        formatter: 'str_arr',
    },
    {
        type: 'input',
        name: 'waybill_no',
        label: '运单号',
        placeholder: '请输入',
    },
];

interface IProps {
    penddingCount: number;
    getExceptionCount(): void;
}

const PaneAbnormalReview: React.FC<IProps> = ({ penddingCount, getExceptionCount }) => {
    const formRef = useRef<JsonFormRef>(null);
    const [currentRecord, setCurrentRecord] = useState<IPurchaseAbnormalItem | null>(null);
    const [exportStatus, setExportStatus] = useState(false);
    const {
        loading,
        pageNumber,
        pageSize,
        total,
        selectedRowKeys,
        dataSource,
        onSearch,
        onReload,
        onChange,
        setSelectedRowKeys,
    } = useList<IPurchaseAbnormalItem>({
        queryList: getAbnormalAllList,
        formRef: formRef,
        extraQuery: {
            waybill_exception_status: 1,
        },
    });

    const onSelectedRowKeysChange = useCallback(keys => {
        // console.log(111111, args);
        setSelectedRowKeys(keys);
    }, []);

    const onRefresh = useCallback(() => {
        getExceptionCount();
        onReload();
    }, []);

    const onExport = useCallback((values: any) => {
        return downloadExcel({
            query: {
                ...formRef.current?.getFieldsValue(),
                waybill_exception_status: 1,
            },
            module: 5,
            ...values,
        });
    }, []);

    const columns = useMemo<ColumnProps<IPurchaseAbnormalItem>[]>(() => {
        return [
            {
                title: '操作',
                dataIndex: '_operate',
                align: 'center',
                width: 150,
                render: (_, row: IPurchaseAbnormalItem) => {
                    return (
                        <>
                            <div>
                                <a onClick={() => {}}>审核通过</a>
                            </div>
                            <div>
                                <a onClick={() => {}}>审核驳回</a>
                            </div>
                        </>
                    );
                },
            },
            {
                title: '异常单ID',
                dataIndex: 'waybillExceptionSn',
                align: 'center',
                width: 150,
            },
            {
                title: '异常类型',
                dataIndex: 'waybillExceptionType',
                align: 'center',
                width: 180,
                // render: (val: IWaybillExceptionTypeKey) => waybillExceptionTypeMap[val],
                render: (val: IWaybillExceptionTypeKey) => {
                    return val === '101' ? (
                        waybillExceptionTypeMap[val]
                    ) : (
                        <Select defaultValue={Number(val)} className={styles.select}>
                            {waybillExceptionTypeList.map(({ name, value }) => (
                                <Option value={value} key={value}>
                                    {name}
                                </Option>
                            ))}
                        </Select>
                    );
                },
            },
            {
                title: '异常单状态',
                dataIndex: 'waybillExceptionStatus',
                align: 'center',
                width: 150,
                render: (val: IWaybillExceptionStatusKey) => waybillExceptionStatusMap[val],
            },
            {
                title: '异常图片',
                dataIndex: 'goodsImageUrl',
                align: 'center',
                width: 120,
                render: (value: string, row: IPurchaseAbnormalItem) => {
                    const { packageImageUrl } = row;
                    const list: string[] = [];
                    value && list.push(value);
                    packageImageUrl && list.push(packageImageUrl);

                    return <AutoEnLargeImg srcList={list} className={styles.imgCell} />;
                },
            },
            {
                title: '异常描述',
                dataIndex: 'waybillExceptionDescription',
                align: 'center',
                width: 150,
            },
            {
                title: '采购单ID',
                dataIndex: 'purchaseOrderGoodsId',
                align: 'center',
                width: 150,
            },
            {
                title: '供应商订单号',
                dataIndex: 'xxx',
                align: 'center',
                width: 150,
            },
            {
                title: '运单号',
                dataIndex: 'purchaseWaybillNo',
                align: 'center',
                width: 150,
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
        const disabled = selectedRowKeys.length === 0;
        return [
            <LoadingButton
                key="1"
                type="primary"
                className={formStyles.formBtn}
                disabled={disabled}
                onClick={onSearch}
            >
                审核通过
            </LoadingButton>,
            <LoadingButton
                key="2"
                type="primary"
                className={formStyles.formBtn}
                disabled={disabled}
                onClick={onSearch}
            >
                审核驳回
            </LoadingButton>,
        ];
    }, [selectedRowKeys]);

    const exportModalComponent = useMemo(() => {
        return (
            <Export
                columns={columns.filter((item: any) => item.dataIndex[0] !== '_')}
                visible={exportStatus}
                onOKey={onExport}
                onCancel={() => setExportStatus(false)}
            />
        );
    }, [exportStatus]);

    const rowSelection = useMemo(() => {
        return {
            fixed: true,
            columnWidth: '50px',
            selectedRowKeys: selectedRowKeys,
            onChange: onSelectedRowKeysChange,
        };
    }, [selectedRowKeys]);

    return useMemo(() => {
        // console.log('dataSource', dataSource);
        return (
            <>
                <JsonForm
                    labelClassName={styles.label}
                    fieldList={fieldList}
                    ref={formRef}
                    initialValues={{
                        waybill_exception_type: 100,
                    }}
                >
                    <LoadingButton type="primary" className={formStyles.formBtn} onClick={onSearch}>
                        查询
                    </LoadingButton>
                    <LoadingButton className={formStyles.formBtn} onClick={onReload}>
                        刷新
                    </LoadingButton>
                    <Button className={formStyles.formBtn} onClick={() => setExportStatus(true)}>
                        导出
                    </Button>
                </JsonForm>
                <FitTable
                    bordered
                    rowKey="waybillExceptionSn"
                    // className="order-table"
                    loading={loading}
                    columns={columns}
                    rowSelection={rowSelection}
                    dataSource={dataSource}
                    scroll={{ x: 'max-content' }}
                    columnsSettingRender={true}
                    pagination={pagination}
                    onChange={onChange}
                    toolBarRender={toolBarRender}
                />
                {exportModalComponent}
            </>
        );
    }, [dataSource, loading, currentRecord, exportModalComponent, rowSelection]);
};

export default PaneAbnormalReview;

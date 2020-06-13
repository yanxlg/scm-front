import React, { useMemo, useEffect, useState, useCallback, useRef } from 'react';
import { Button } from 'antd';
import { JsonFormRef, FormField } from 'react-components/es/JsonForm';
import { useList, FitTable, JsonForm, LoadingButton } from 'react-components';
import { getAbnormalAllList, downloadExcel } from '@/services/purchase';
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
import DetailModal from './DetailModal';
import Export from '@/components/Export';
import PopSetProgress from './PopSetProgress/PopSetProgress';

import styles from '../../_abnormal.less';
import formStyles from 'react-components/es/JsonForm/_form.less';

const fieldList: FormField[] = [
    {
        type: 'input',
        name: 'waybill_exception_sn',
        label: '异常单id',
        placeholder: '请输入异常单id',
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
        label: '采购单id',
        placeholder: '请输入采购单id',
        formatter: 'str_arr',
    },
    {
        type: 'input',
        name: 'waybill_no',
        label: '运单号',
        placeholder: '请输入运单号',
    },
];

interface IProps {
    execingCount: number;
}

const PaneAbnormalProcessing: React.FC<IProps> = ({ execingCount }) => {
    const formRef1 = useRef<JsonFormRef>(null);
    const formRef2 = useRef<JsonFormRef>(null);
    const [detailStatus, setDetailStatus] = useState(false);
    const [exportStatus, setExportStatus] = useState(false);
    const [currentRecord, setCurrentRecord] = useState<IPurchaseAbnormalItem | null>(null);
    const {
        loading,
        pageNumber,
        pageSize,
        total,
        onSearch,
        onReload,
        onChange,
        dataSource,
    } = useList<IPurchaseAbnormalItem>({
        queryList: getAbnormalAllList,
        formRef: [formRef1, formRef2],
        extraQuery: {
            waybill_exception_status: 2,
        },
    });

    const showDetail = (row: IPurchaseAbnormalItem) => {
        setDetailStatus(true);
        setCurrentRecord(row);
    };

    const hideDetail = useCallback(() => {
        setDetailStatus(false);
    }, []);

    const onExport = useCallback((values: any) => {
        return downloadExcel({
            query: {
                ...formRef1.current?.getFieldsValue(),
                ...formRef2.current?.getFieldsValue(),
                waybill_exception_status: 2,
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
                render: (_, row) => {
                    return (
                        <Button type="link" onClick={() => showDetail(row)}>
                            查看详情
                        </Button>
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
                width: 150,
                render: (val: IWaybillExceptionTypeKey) => waybillExceptionTypeMap[val],
            },
            {
                title: '处理方式/进度',
                dataIndex: 'a1',
                align: 'center',
                width: 150,
                render: () => {
                    return <PopSetProgress onReload={onReload} />;
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
            // {
            //     title: '异常数量',
            //     dataIndex: 'quantity',
            //     align: 'center',
            //     width: 150,
            // },
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

    const fieldCheckboxList = useMemo<FormField[]>(() => {
        return [
            {
                type: 'checkbox',
                name: 'exec_more_time',
                label: `24小时未处理（${execingCount}）`,
                formItemClassName: '',
                formatter: (val: boolean) => (val ? 24 : undefined),
                onChange: () => {
                    onSearch();
                },
            },
        ];
    }, [execingCount]);

    const toolBarRender = useCallback(() => {
        return [
            <JsonForm
                key="2"
                containerClassName=""
                enableCollapse={false}
                fieldList={fieldCheckboxList}
                ref={formRef2}
            ></JsonForm>,
        ];
    }, [fieldCheckboxList]);

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

    return useMemo(() => {
        // console.log('dataSource', dataSource);
        return (
            <>
                <JsonForm
                    labelClassName={styles.label}
                    fieldList={fieldList}
                    ref={formRef1}
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
                    // rowSelection={rowSelection}
                    dataSource={dataSource}
                    scroll={{ x: 'max-content' }}
                    columnsSettingRender={true}
                    pagination={pagination}
                    onChange={onChange}
                    toolBarRender={toolBarRender}
                />
                <DetailModal
                    currentRecord={currentRecord}
                    visible={detailStatus}
                    onCancel={hideDetail}
                />
                {exportModalComponent}
            </>
        );
    }, [dataSource, loading, detailStatus, exportModalComponent]);
};

export default PaneAbnormalProcessing;

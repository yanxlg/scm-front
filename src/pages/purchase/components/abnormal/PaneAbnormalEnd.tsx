import React, { useMemo, useState, useCallback, useRef, useContext } from 'react';
import { Button } from 'antd';
import { JsonFormRef, FormField } from 'react-components/es/JsonForm';
import { useList, FitTable, JsonForm, LoadingButton, AutoEnLargeImg } from 'react-components';
import { getAbnormalAllList, downloadExcel } from '@/services/purchase';
import {
    IPurchaseAbnormalItem,
    IWaybillExceptionStatusKey,
    IWaybillExceptionTypeKey,
    IHandleItem,
} from '@/interface/IPurchase';
import { ColumnProps } from 'antd/es/table';
import {
    defaultOptionItem,
    waybillExceptionStatusMap,
    waybillExceptionHandleMap,
    IExceptionHandle,
} from '@/enums/PurchaseEnum';
import { utcToLocal } from 'react-components/es/utils/date';
import Export from '@/components/Export';
import DetailModal from './DetailModal';

import styles from '../../_abnormal.less';
import formStyles from 'react-components/es/JsonForm/_form.less';
import { AbnormalContext } from '../../abnormal';
import useDetail from '../../hooks/useDetail';
import { getStatusDesc } from '@/utils/transform';

const PaneAbnormalEnd: React.FC = props => {
    const formRef = useRef<JsonFormRef>(null);
    const abnormalContext = useContext(AbnormalContext);
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
        formRef: formRef,
        extraQuery: {
            waybill_exception_status: 3,
        },
    });

    const { detailStatus, showDetail, hideDetail } = useDetail(setCurrentRecord);

    const { exception_code = [], exception_strategy = [] } = abnormalContext;

    const onExport = useCallback((values: any) => {
        return downloadExcel({
            query: {
                ...formRef.current?.getFieldsValue(),
                waybill_exception_status: 3,
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
                width: 180,
                render: (val: string, row: IPurchaseAbnormalItem) => {
                    const { createTime } = row;
                    return (
                        <>
                            {val}
                            <div>{utcToLocal(createTime)}</div>
                        </>
                    );
                },
            },
            {
                title: '异常类型',
                dataIndex: 'waybillExceptionType',
                align: 'center',
                width: 150,
                render: (val: IWaybillExceptionTypeKey) => getStatusDesc(exception_code, val),
            },
            {
                title: '处理方式',
                dataIndex: 'waybillExceptionHandle',
                align: 'center',
                width: 150,
                render: (val: IHandleItem[] | undefined, row: IPurchaseAbnormalItem) => {
                    const { waybillExceptionSn } = row;
                    let handleList: number[] = [];
                    let handleStatusList: number[] = [];
                    let hasUpdate = false;
                    val?.forEach(({ handleType, handleStatus }) => {
                        if (!hasUpdate && [2, 3, 4].indexOf(handleType) > -1) {
                            hasUpdate = true;
                        }
                        handleList.push(handleType);
                        handleStatus && handleStatusList.push(handleStatus);
                    });
                    return (
                        <>
                            {handleList.map(handle => (
                                <div key={handle}>
                                    {waybillExceptionHandleMap[handle as IExceptionHandle]}
                                </div>
                            ))}
                        </>
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
            {
                title: '供应商订单号',
                dataIndex: 'purchaseOrderGoodsSn',
                align: 'center',
                width: 150,
            },
            {
                title: '完结时间',
                dataIndex: 'finishedTime',
                align: 'center',
                width: 150,
                render: val => utcToLocal(val),
            },
        ];
    }, [abnormalContext]);

    const pagination = useMemo(() => {
        return {
            total: total,
            current: pageNumber,
            pageSize: pageSize,
            showSizeChanger: true,
            position: ['topRight', 'bottomRight'],
        } as any;
    }, [loading]);

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

    const fieldList = useMemo<FormField[]>(() => {
        return [
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
                optionList: [defaultOptionItem, ...exception_code],
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
            {
                type: 'input',
                name: 'purchase_order_goods_sn',
                label: '供应商订单号',
                placeholder: '请输入',
            },
        ];
    }, [abnormalContext]);

    return useMemo(() => {
        // console.log('dataSource', dataSource);
        return (
            <>
                <JsonForm
                    labelClassName={styles.label}
                    fieldList={fieldList}
                    ref={formRef}
                    initialValues={{
                        waybill_exception_type: '',
                    }}
                >
                    <div>
                        <LoadingButton
                            type="primary"
                            className={formStyles.formBtn}
                            onClick={onSearch}
                        >
                            查询
                        </LoadingButton>
                        <LoadingButton className={formStyles.formBtn} onClick={onReload}>
                            刷新
                        </LoadingButton>
                        <Button
                            className={formStyles.formBtn}
                            onClick={() => setExportStatus(true)}
                        >
                            导出
                        </Button>
                    </div>
                </JsonForm>
                <FitTable
                    bordered
                    rowKey="waybillExceptionSn"
                    loading={loading}
                    columns={columns}
                    dataSource={dataSource}
                    scroll={{ x: 'max-content' }}
                    columnsSettingRender={true}
                    pagination={pagination}
                    onChange={onChange}
                />
                <DetailModal
                    visible={detailStatus}
                    currentRecord={currentRecord}
                    onCancel={hideDetail}
                    onRefresh={onReload}
                />
                {exportModalComponent}
            </>
        );
    }, [dataSource, loading, exportModalComponent, detailStatus, currentRecord, abnormalContext]);
};

export default PaneAbnormalEnd;

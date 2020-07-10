import React, { useMemo, useEffect, useState, useCallback, useRef, useContext } from 'react';
import { Button, message } from 'antd';
import { JsonFormRef, FormField } from 'react-components/es/JsonForm';
import { useList, FitTable, JsonForm, LoadingButton } from 'react-components';
import {
    getAbnormalAllList,
    downloadExcel,
    finishPurchaseExceptionOrder,
} from '@/services/purchase';
import {
    IPurchaseAbnormalItem,
    IWaybillExceptionTypeKey,
    IWaybillExceptionStatusKey,
    IHandleItem,
} from '@/interface/IPurchase';
import { ColumnProps } from 'antd/es/table';
import { AutoEnLargeImg } from 'react-components';
import {
    defaultOptionItem,
    waybillExceptionStatusMap,
    waybillExceptionHandleMap,
    IExceptionHandle,
    refundStatus,
    returnStatus,
    reissueStatus,
    IRefundStatusCode,
    IReturnStatusCode,
    IReissueStatusCode,
} from '@/enums/PurchaseEnum';
import DetailModal from './DetailModal';
import Export from '@/components/Export';
import PopSetProgress from './PopSetProgress/PopSetProgress';
import { AbnormalContext } from '../../abnormal';
import useDetail from '../../hooks/useDetail';

import styles from '../../_abnormal.less';
import formStyles from 'react-components/es/JsonForm/_form.less';
import { utcToLocal } from 'react-components/es/utils/date';
import { PermissionComponent } from 'rc-permission';
import { getStatusDesc } from '@/utils/transform';

interface IProps {
    execingCount: number;
    getExceptionCount(): void;
}

const PaneAbnormalProcessing: React.FC<IProps> = ({ execingCount, getExceptionCount }) => {
    const formRef1 = useRef<JsonFormRef>(null);
    const formRef2 = useRef<JsonFormRef>(null);
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
        selectedRowKeys,
        setSelectedRowKeys,
    } = useList<IPurchaseAbnormalItem>({
        queryList: getAbnormalAllList,
        formRef: [formRef1, formRef2],
        extraQuery: {
            waybill_exception_status: 2,
        },
    });

    const { detailStatus, showDetail, hideDetail } = useDetail(setCurrentRecord);

    const onRefresh = useCallback(() => {
        getExceptionCount();
        return onReload();
    }, []);

    const { exception_code = [], exception_strategy = [] } = abnormalContext;

    const onSelectedRowKeysChange = useCallback(keys => {
        // console.log(111111, args);
        setSelectedRowKeys(keys);
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

    const _finishPurchaseExceptionOrder = useCallback(() => {
        return finishPurchaseExceptionOrder(selectedRowKeys).then(() => {
            onRefresh();
            message.success('完结采购单成功');
        });
    }, [selectedRowKeys]);

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
                title: '处理方式/进度',
                dataIndex: 'waybillExceptionHandle',
                align: 'center',
                width: 150,
                render: (val: IHandleItem[] | undefined, row: IPurchaseAbnormalItem) => {
                    const { waybillExceptionSn, waybillExceptionStatus } = row;
                    let progressList: string[] = [];
                    let handleStatusList: number[] = [];
                    let hasUpdate = false;
                    val?.forEach(({ handleType, handleStatus }) => {
                        if (!hasUpdate && [2, 3, 4].indexOf(handleType) > -1) {
                            hasUpdate = true;
                        }
                        progressList.push(
                            handleStatus
                                ? handleType === 2
                                    ? refundStatus[handleStatus as IRefundStatusCode]
                                    : handleType === 3
                                    ? returnStatus[handleStatus as IReturnStatusCode]
                                    : handleType === 4
                                    ? reissueStatus[handleStatus as IReissueStatusCode]
                                    : waybillExceptionHandleMap[handleType as IExceptionHandle]
                                : waybillExceptionHandleMap[handleType as IExceptionHandle],
                        );
                        handleStatus && handleStatusList.push(handleStatus);
                    });
                    return (
                        <>
                            {progressList.map(handle => (
                                <div key={handle}>{handle}</div>
                            ))}
                            {hasUpdate && String(waybillExceptionStatus) !== '3' && (
                                <PopSetProgress
                                    waybillExceptionSn={waybillExceptionSn}
                                    handle={val as IHandleItem[]}
                                    onReload={onReload}
                                />
                            )}
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
        ];
    }, [abnormalContext]);

    const rowSelection = useMemo(() => {
        return {
            fixed: true,
            columnWidth: '50px',
            selectedRowKeys: selectedRowKeys,
            onChange: onSelectedRowKeysChange,
        };
    }, [selectedRowKeys]);

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
            <PermissionComponent key="1" pid="purchase/abnormal/finish" control="tooltip">
                <LoadingButton
                    type="primary"
                    className={formStyles.formBtn}
                    onClick={_finishPurchaseExceptionOrder}
                    disabled={selectedRowKeys.length === 0}
                >
                    完结异常单
                </LoadingButton>
            </PermissionComponent>,
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
                    ref={formRef1}
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
                        <LoadingButton className={formStyles.formBtn} onClick={onRefresh}>
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
                <JsonForm
                    // key="2"
                    // containerClassName=""
                    fieldList={fieldCheckboxList}
                    ref={formRef2}
                />
                <FitTable
                    bordered={true}
                    rowKey="waybillExceptionSn"
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
                <DetailModal
                    currentRecord={currentRecord}
                    visible={detailStatus}
                    onCancel={hideDetail}
                    onRefresh={onRefresh}
                />
                {exportModalComponent}
            </>
        );
    }, [dataSource, loading, detailStatus, exportModalComponent, rowSelection, abnormalContext]);
};

export default PaneAbnormalProcessing;

import React, { useMemo, useState, useCallback, useRef } from 'react';
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
import RelatedPurchaseModal from './RelatedPurchaseModal';
import AbnormalModal from './AbnormalModal';
import {
    defaultOptionItem,
    waybillExceptionStatusMap,
    AbnormalType,
    OperateType,
} from '@/enums/PurchaseEnum';
import Export from '@/components/Export';

import styles from '../../_abnormal.less';
import formStyles from 'react-components/es/JsonForm/_form.less';
import useWaitProcess from '../../hooks/useWaitProcess';
import { utcToLocal } from 'react-components/lib/utils/date';
import { PermissionComponent } from 'rc-permission';
import { getStatusDesc } from '@/utils/transform';

interface IProps {
    penddingCount: number;
    getExceptionCount(): void;
}

const PaneAbnormalPending: React.FC<IProps> = ({ penddingCount, getExceptionCount }) => {
    const formRef1 = useRef<JsonFormRef>(null);
    const formRef2 = useRef<JsonFormRef>(null);
    const [currentRecord, setCurrentRecord] = useState<IPurchaseAbnormalItem | null>(null);
    const [exportStatus, setExportStatus] = useState(false);
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
            waybill_exception_status: AbnormalType.waitProcess,
        },
    });

    const onRefresh = useCallback(() => {
        getExceptionCount();
        onReload();
    }, []);

    const {
        relatedPurchaseStatus,
        abnormalStatus,
        abnormalContext,
        hideRelatedPurchase,
        hideAbnormal,
        handleOperate,
    } = useWaitProcess(setCurrentRecord, onRefresh);

    const { exception_code = [], exception_strategy = [] } = abnormalContext;

    const onExport = useCallback((values: any) => {
        return downloadExcel({
            query: {
                ...formRef1.current?.getFieldsValue(),
                ...formRef2.current?.getFieldsValue(),
                waybill_exception_status: AbnormalType.waitProcess,
            },
            module: 5,
            ...values,
        });
    }, []);

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
    }, [exception_code]);

    const columns = useMemo<ColumnProps<IPurchaseAbnormalItem>[]>(() => {
        return [
            {
                title: '操作',
                dataIndex: '_operate',
                align: 'center',
                width: 150,
                render: (_, row: IPurchaseAbnormalItem) => {
                    const { waybillExceptionType } = row;
                    return (
                        <>
                            {exception_strategy.map(item => {
                                const {
                                    exception_operation_name,
                                    show_exception_type,
                                    exception_operation_id,
                                } = item;
                                let pid = '';
                                switch (exception_operation_id) {
                                    case OperateType.discard:
                                        pid = 'purchase/abnormal/delete';
                                        break;
                                    case OperateType.related:
                                        pid = 'purchase/abnormal/connect';
                                        break;
                                    case OperateType.exceptionHandle:
                                        pid = 'purchase/abnormal/exception_exec';
                                        break;
                                    default:
                                }
                                return show_exception_type.indexOf(waybillExceptionType) > -1 ? (
                                    <div key={exception_operation_name}>
                                        <PermissionComponent pid={pid} control="tooltip">
                                            <a onClick={() => handleOperate(item, row)}>
                                                {exception_operation_name}
                                            </a>
                                        </PermissionComponent>
                                    </div>
                                ) : null;
                            })}
                        </>
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
        ];
    }, [abnormalContext]);

    const fieldCheckboxList = useMemo<FormField[]>(() => {
        return [
            {
                type: 'checkbox',
                name: 'exec_more_time',
                label: `24小时未处理（${penddingCount}）`,
                formItemClassName: '',
                formatter: (val: boolean) => (val ? 24 : undefined),
                onChange: () => {
                    onSearch();
                },
            },
        ];
    }, [penddingCount]);

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
            <JsonForm key="1" containerClassName="" fieldList={fieldCheckboxList} ref={formRef2} />,
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
                    bordered={true}
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
                <RelatedPurchaseModal
                    visible={relatedPurchaseStatus}
                    onCancel={hideRelatedPurchase}
                    onRefresh={onRefresh}
                />
                <AbnormalModal
                    currentRecord={currentRecord}
                    visible={abnormalStatus}
                    onCancel={hideAbnormal}
                    onRefresh={onRefresh}
                />
                {exportModalComponent}
            </>
        );
    }, [
        dataSource,
        loading,
        relatedPurchaseStatus,
        abnormalStatus,
        currentRecord,
        exportModalComponent,
        abnormalContext,
    ]);
};

export default PaneAbnormalPending;

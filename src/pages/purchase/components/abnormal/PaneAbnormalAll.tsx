import React, { useMemo, useEffect, useState, useCallback, useRef, useContext } from 'react';
import { Button, Form, Select } from 'antd';
import { JsonFormRef, FormField } from 'react-components/es/JsonForm';
import { useList, FitTable, JsonForm, LoadingButton } from 'react-components';
import { getAbnormalAllList, setDiscardAbnormalOrder, downloadExcel } from '@/services/purchase';
import {
    IPurchaseAbnormalItem,
    IWaybillExceptionTypeKey,
    IWaybillExceptionStatusKey,
    IExceptionStrategyItem,
    IHandleItem,
} from '@/interface/IPurchase';
import { ColumnProps } from 'antd/es/table';
import { AutoEnLargeImg } from 'react-components';
import RelatedPurchaseModal from './RelatedPurchaseModal';
import AbnormalModal from './AbnormalModal';
import {
    waybillExceptionTypeList,
    defaultOptionItem,
    waybillExceptionTypeMap,
    waybillExceptionStatusMap,
    OperateType,
    AbnormalType,
    waybillExceptionHandleMap,
    IExceptionHandle,
    refundStatus,
    IRefundStatusCode,
    returnStatus,
    IReturnStatusCode,
    reissueStatus,
    IReissueStatusCode,
} from '@/enums/PurchaseEnum';
import { utcToLocal } from 'react-components/es/utils/date';
import Export from '@/components/Export';
import DetailModal from './DetailModal';
import { AbnormalContext } from '../../abnormal';

import styles from '../../_abnormal.less';
import formStyles from 'react-components/es/JsonForm/_form.less';
import useWaitProcess from '../../hooks/useWaitProcess';
import useReview from '../../hooks/useReview';
import PopSetProgress from './PopSetProgress/PopSetProgress';
import useDetail from '../../hooks/useDetail';
import { PermissionComponent } from 'rc-permission';

const { Option } = Select;

interface IProps {
    getExceptionCount(): void;
}

const PaneAbnormalAll: React.FC<IProps> = ({ getExceptionCount }) => {
    const formRef = useRef<JsonFormRef>(null);
    const [form] = Form.useForm();
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
        formRef: formRef,
    });

    const { detailStatus, showDetail, hideDetail } = useDetail(setCurrentRecord);

    const onRefresh = useCallback(() => {
        getExceptionCount();
        return onReload();
    }, []);

    const { reviewPass, reviewReject } = useReview(form, onRefresh);

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
        // console.log('onExport', values);
        return downloadExcel({
            query: formRef.current?.getFieldsValue(),
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
    }, [abnormalContext]);

    const columns = useMemo<ColumnProps<IPurchaseAbnormalItem>[]>(() => {
        return [
            {
                title: '操作',
                dataIndex: '_operate',
                align: 'center',
                width: 150,
                render: (_, row: IPurchaseAbnormalItem) => {
                    const { waybillExceptionType, waybillExceptionStatus } = row;
                    switch (waybillExceptionStatus) {
                        case AbnormalType.waitProcess:
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

                                        return show_exception_type.indexOf(waybillExceptionType) >
                                            -1 ? (
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
                        case AbnormalType.pendingReview:
                            return (
                                <>
                                    <div>
                                        <PermissionComponent
                                            pid="purchase/abnormal/verify"
                                            control="tooltip"
                                        >
                                            <a onClick={() => reviewPass(row)}>审核通过</a>
                                        </PermissionComponent>
                                    </div>
                                    <div>
                                        <PermissionComponent
                                            pid="purchase/abnormal/verify"
                                            control="tooltip"
                                        >
                                            <a onClick={() => reviewReject(row)}>审核驳回</a>
                                        </PermissionComponent>
                                    </div>
                                </>
                            );
                        default:
                            return <a onClick={() => showDetail(row)}>查看详情</a>;
                    }
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
                render: (val: IWaybillExceptionTypeKey, record: IPurchaseAbnormalItem) => {
                    const { waybillExceptionSn, waybillExceptionStatus } = record;
                    return waybillExceptionStatus === AbnormalType.pendingReview &&
                        val !== '101' ? (
                        <Form.Item
                            name={waybillExceptionSn}
                            initialValue={val}
                            className={styles.tableFormItem}
                        >
                            <Select className={styles.select}>
                                {waybillExceptionTypeList.map(({ name, value }) => (
                                    <Option value={value} key={value}>
                                        {name}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                    ) : (
                        waybillExceptionTypeMap[val]
                    );
                },
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
                <Form form={form}>
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
                </Form>
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
                <DetailModal
                    visible={detailStatus}
                    currentRecord={currentRecord}
                    onCancel={hideDetail}
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
        detailStatus,
        fieldList,
    ]);
};

export default PaneAbnormalAll;

import React, { useMemo, useEffect, useState, useCallback, useRef } from 'react';
import { Modal, Input, message, Button } from 'antd';
import { JsonFormRef, FormField } from 'react-components/es/JsonForm';
import { useList, FitTable, JsonForm, LoadingButton } from 'react-components';
import { getAbnormalAllList, setDiscardAbnormalOrder } from '@/services/purchase';
import { IPurchaseAbnormalItem } from '@/interface/IPurchase';
import { ColumnProps } from 'antd/es/table';
import { AutoEnLargeImg } from 'react-components';
import RelatedPurchaseModal from './RelatedPurchaseModal';
import AbnormalModal from './AbnormalModal';
import { waybillExceptionTypeList, defaultOptionItem } from '@/enums/PurchaseEnum';
import TextArea from 'antd/lib/input/TextArea';
// import { utcToLocal } from 'react-components/es/utils/date';
import { QuestionCircleOutlined } from '@ant-design/icons';
import Export from '@/components/Export';

import styles from '../_abnormal.less';
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
    penddingCount: number;
}

const PaneAbnormalPending: React.FC<IProps> = ({ penddingCount }) => {
    const formRef1 = useRef<JsonFormRef>(null);
    const formRef2 = useRef<JsonFormRef>(null);
    const textareaRef = useRef<TextArea>(null);
    const [relatedPurchaseStatus, setRelatedPurchaseStatus] = useState(false);
    const [abnormalStatus, setAbnormalStatus] = useState(false);
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
            waybill_exception_status: 1,
        },
    });

    const showRelatedPurchase = () => {
        setRelatedPurchaseStatus(true);
    };

    const hideRelatedPurchase = useCallback(() => {
        setRelatedPurchaseStatus(false);
    }, []);

    const showAbnormal = (record: IPurchaseAbnormalItem) => {
        setAbnormalStatus(true);
        setCurrentRecord(record);
    };

    const hideAbnormal = useCallback(() => {
        setAbnormalStatus(false);
    }, []);

    const showDiscardModal = useCallback((record: IPurchaseAbnormalItem) => {
        const { waybillExceptionSn } = record;
        Modal.confirm({
            title: '废弃异常单',
            icon: <QuestionCircleOutlined />,
            content: (
                <>
                    <p>是否确认废弃异常单，通知仓库不做处理？</p>
                    <Input.TextArea ref={textareaRef} placeholder="备注" />
                </>
            ),
            onOk: () => {
                // console.log(textareaRef.current?.state.value);
                const remarks = textareaRef.current?.state.value;
                if (!remarks) {
                    message.error('请填写备注！！！');
                    return Promise.reject();
                }
                return setDiscardAbnormalOrder({
                    waybill_exception_sn: waybillExceptionSn,
                    abnormal_operate_type: '废弃',
                    remarks,
                }).then(() => {
                    onReload();
                });
            },
        });
    }, []);

    // 显示关联采购单
    const hasRelatedPurchase = useCallback((waybillExceptionType: string) => {
        return ['101', '103'].indexOf(waybillExceptionType) > -1;
    }, []);

    const hasExceptionHandle = useCallback((waybillExceptionType: string) => {
        return ['102', '104', '105'].indexOf(waybillExceptionType) > -1;
    }, []);

    const onExport = useCallback((values: any) => {
        console.log('onExport', values);
        // return postExportErrOrder({
        //     abnormal_type: 1,
        //     abnormal_detail_type: 2,
        //     ...queryRef.current,
        //     ...values,
        // });
        return Promise.resolve();
    }, []);

    const columns = useMemo<ColumnProps<IPurchaseAbnormalItem>[]>(() => {
        return [
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
            },
            {
                title: '异常单状态',
                dataIndex: 'waybillExceptionStatus',
                align: 'center',
                width: 150,
            },
            {
                title: '异常图片',
                dataIndex: 'goodsImageUrl',
                align: 'center',
                width: 120,
                render: (value: string, row: IPurchaseAbnormalItem) => {
                    return <AutoEnLargeImg src={value} className={styles.imgCell} />;
                },
            },
            {
                title: '异常数量',
                dataIndex: 'quantity',
                align: 'center',
                width: 150,
            },
            {
                title: '异常描述',
                dataIndex: 'waybillExceptionDescription',
                align: 'center',
                width: 150,
            },
            {
                title: '采购单ID',
                dataIndex: 'purchaseOrderId',
                align: 'center',
                width: 150,
            },
            {
                title: '运单号',
                dataIndex: 'waybillNo',
                align: 'center',
                width: 150,
            },
            {
                title: '操作',
                dataIndex: '_operate',
                align: 'center',
                width: 150,
                render: (_, row: IPurchaseAbnormalItem) => {
                    const { waybillExceptionType } = row;
                    return (
                        <>
                            <div>
                                <a onClick={() => showDiscardModal(row)}>废弃</a>
                            </div>
                            {hasRelatedPurchase(waybillExceptionType) && (
                                <div>
                                    <a onClick={() => showRelatedPurchase()}>关联采购单</a>
                                </div>
                            )}
                            {hasExceptionHandle(waybillExceptionType) && (
                                <div>
                                    <a type="link" onClick={() => showAbnormal(row)}>
                                        异常处理
                                    </a>
                                </div>
                            )}
                        </>
                    );
                },
            },
        ];
    }, []);

    const fieldCheckboxList = useMemo<FormField[]>(() => {
        return [
            {
                type: 'checkbox',
                name: 'time_out',
                label: `24小时未处理（${penddingCount}）`,
                formItemClassName: '',
                formatter: (val: boolean) => (val ? 24 : undefined),
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
            <JsonForm
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
                columns={columns}
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
                    // labelClassName="order-error-label"
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
                    bordered={true}
                    rowKey="purchase_plan_id"
                    className="order-table"
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
                />
                <AbnormalModal
                    currentRecord={currentRecord}
                    visible={abnormalStatus}
                    onCancel={hideAbnormal}
                    onReload={onReload}
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
    ]);
};

export default PaneAbnormalPending;

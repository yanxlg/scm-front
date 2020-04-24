import React, { useMemo, useEffect, useState, useCallback, useRef } from 'react';
import { Button, Checkbox } from 'antd';
import { JsonFormRef, FormField } from 'react-components/es/JsonForm';
import { useList, FitTable, JsonForm, LoadingButton } from 'react-components';
import { getAbnormalAllList } from '@/services/purchase';
import { IPurchaseAbnormalRes } from '@/interface/IPurchase';
import { ColumnProps } from 'antd/es/table';
import { AutoEnLargeImg } from 'react-components';
import { waybillExceptionTypeList, defaultOptionItem } from '@/enums/PurchaseEnum';
import DetailModal from './DetailModal';

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
        optionList: [
            defaultOptionItem,
            ...waybillExceptionTypeList
        ],
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
]

const fieldCheckboxList: FormField[] = [
    {
        type: 'checkbox',
        name: 'time_out',
        label: '24小时未处理',
        formItemClassName: '',
        formatter: (val: boolean) => val ? 1 : 0
        // onChange: (name, form) => {
        //     this.changeParentOrder(form.getFieldValue(name));
        // },
    },
];

const PaneAbnormalProcessing: React.FC = props => {
    const formRef1 = useRef<JsonFormRef>(null);
    const formRef2 = useRef<JsonFormRef>(null);
    const [detailStatus, setDetailStatus] = useState(false);
    const { 
        loading,
        pageNumber,
        pageSize,
        total,
        onSearch,
        onReload,
        onChange,
        dataSource 
    } = useList<IPurchaseAbnormalRes>({
        queryList: getAbnormalAllList,
        formRef: [formRef1, formRef2],
        extraQuery: {
            waybill_exception_status: 2
        }
    });

    const showDetail = () => {
        setDetailStatus(true);
    }

    const hideDetail = useCallback(
        () => {
            setDetailStatus(false);
        },
        [],
    );

    const columns = useMemo<ColumnProps<IPurchaseAbnormalRes>[]>(() => {
        return [
            {
                title: '异常单ID',
                dataIndex: 'a1',
                align: 'center',
                width: 150,
            },
            {
                title: '异常类型',
                dataIndex: 'a2',
                align: 'center',
                width: 150,
            },
            {
                title: '异常单状态',
                dataIndex: 'a3',
                align: 'center',
                width: 150,
            },
            {
                title: '异常图片',
                dataIndex: 'image',
                align: 'center',
                width: 120,
                render: (value: string, row: IPurchaseAbnormalRes) => {
                    return <AutoEnLargeImg src={value} className={styles.imgCell} />;
                },
            },
            {
                title: '异常数量',
                dataIndex: 'a4',
                align: 'center',
                width: 150,
            },
            {
                title: '异常描述',
                dataIndex: 'a5',
                align: 'center',
                width: 150,
            },
            {
                title: '采购单ID',
                dataIndex: 'a6',
                align: 'center',
                width: 150,
            },
            {
                title: '运单号',
                dataIndex: 'a7',
                align: 'center',
                width: 150,
            },
            {
                title: '操作',
                dataIndex: 'a8',
                align: 'center',
                width: 150,
                render: (_) => {
                    return <Button type="link" onClick={() => showDetail()}>查看详情</Button>
                }
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
        return [
            <JsonForm
                containerClassName=""
                enableCollapse={false}
                fieldList={fieldCheckboxList}
                ref={formRef2}
            >
            </JsonForm>
        ]
    }, [])

    return useMemo(() => {
        // console.log('dataSource', dataSource);
        return (
            <>
                <JsonForm
                    // labelClassName="order-error-label"
                    fieldList={fieldList}
                    ref={formRef1}
                    initialValues={{
                        waybill_exception_type: 100
                    }}
                >
                    <LoadingButton type="primary" className={formStyles.formBtn} onClick={onSearch}>
                        查询
                    </LoadingButton>
                    <LoadingButton className={formStyles.formBtn} onClick={onReload}>
                        刷新
                    </LoadingButton>
                    {/* <Button className={formStyles.formBtn} onClick={() => setExportModal(true)}>
                        导出数据
                    </Button> */}
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
                <DetailModal
                    visible={detailStatus}
                    onCancel={hideDetail}
                />
            </>
        );
    }, [dataSource, loading, detailStatus]);
};

export default PaneAbnormalProcessing;

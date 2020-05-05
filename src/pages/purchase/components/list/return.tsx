import React, { useCallback, useMemo, useRef, useState } from 'react';
import { JsonFormRef } from 'react-components/es/JsonForm';
import {
    AutoEnLargeImg,
    FitTable,
    JsonForm,
    LoadingButton,
    useList,
    useModal,
} from 'react-components';
import { FormField } from 'react-components/src/JsonForm/index';
import { Button } from 'antd';
import formStyles from 'react-components/es/JsonForm/_form.less';
import { ITaskListItem } from '@/interface/ITask';
import { ColumnType, TableProps } from 'antd/es/table';
import { exportPurchaseList, queryPurchaseList } from '@/services/purchase';
import { IPurchaseItem } from '@/interface/IPurchase';
import PurchaseDetailModal from '@/pages/purchase/components/list/purchaseDetailModal';
import styles from '@/pages/purchase/_list.less';
import { colSpanDataSource } from '@/pages/purchase/components/list/all';
import { PurchaseCode, PurchaseMap } from '@/config/dictionaries/Purchase';
import ReturnModal from './returnModal';
import Export from '@/components/Export';

const fieldList: FormField[] = [
    {
        label: '采购单id',
        type: 'input',
        name: 'purchase_order_goods_id',
    },
    {
        label: '退款状态',
        type: 'select',
        name: 'purchase_refund_status',
        defaultValue: '',
        optionList: [
            {
                name: '全部',
                value: '',
            },
            {
                name: '待处理',
                value: 0,
            },
            {
                name: '退款申请中',
                value: 1,
            },
            {
                name: '退款申请成功',
                value: 2,
            },
            {
                name: '退款驳回',
                value: 3,
            },
            {
                name: '等待商家退款',
                value: 4,
            },
            {
                name: '退款成功',
                value: 5,
            },
        ],
    },
    {
        label: '采购平台',
        type: 'input',
        name: 'purchase_platform',
    },
    {
        label: '采购店铺',
        type: 'input',
        name: 'purchase_merchant_name',
    },
    {
        label: '供应商订单号',
        type: 'input',
        name: 'purchase_order_goods_sn',
    },
    {
        label: '商品名称',
        type: 'input',
        name: 'purchase_goods_name',
    },
];

const scroll: TableProps<ITaskListItem>['scroll'] = { x: true, scrollToFirstRowOnChange: true };

//(0：待处理，1：退款申请中，2：退款申请成功，3：退款驳回，4：等待商家退款:5：退款成功)
const refundStatusMap = {
    0: '待处理',
    1: '退款申请中',
    2: '退款申请成功',
    3: '退款驳回',
    4: '等待商家退款',
    5: '退款成功',
};

const Return = () => {
    const formRef = useRef<JsonFormRef>(null);

    const {
        loading,
        pageNumber,
        pageSize,
        dataSource,
        total,
        onChange,
        onSearch,
        onReload,
    } = useList<IPurchaseItem>({
        queryList: queryPurchaseList,
        formRef: formRef,
        extraQuery: {
            type: 6,
        },
    });

    const [showExport, setShowExport] = useState(false);

    const showExportFn = useCallback(() => {
        setShowExport(true);
    }, []);

    const closeExportFn = useCallback(() => {
        setShowExport(false);
    }, []);

    const onExport = useCallback((data: any) => {
        return exportPurchaseList({
            ...data,
            query: {
                ...formRef.current!.getFieldsValue(),
                type: 6,
            },
        }).request();
    }, []);

    const searchForm = useMemo(() => {
        return (
            <JsonForm fieldList={fieldList} ref={formRef} enableCollapse={false}>
                <div>
                    <LoadingButton onClick={onSearch} type="primary" className={formStyles.formBtn}>
                        搜索
                    </LoadingButton>
                    <LoadingButton onClick={onReload} type="primary" className={formStyles.formBtn}>
                        刷新
                    </LoadingButton>
                    <Button onClick={showExportFn} type="primary" className={formStyles.formBtn}>
                        导出
                    </Button>
                </div>
            </JsonForm>
        );
    }, []);

    const [returnModal, setReturnModal] = useState<false | string>(false);
    const showReturnModal = useCallback((item: IPurchaseItem) => {
        setReturnModal(item.purchaseOrderGoodsId);
    }, []);
    const closeReturnModal = useCallback(() => {
        setReturnModal(false);
    }, []);

    const columns = useMemo(() => {
        return [
            {
                title: '采购单ID',
                dataIndex: 'purchaseOrderGoodsId',
                align: 'center',
                width: '150px',
                render: (value, row) => {
                    return {
                        children: value,
                        props: {
                            rowSpan: row.rowSpan || 0,
                        },
                    };
                },
            },
            {
                title: '采购金额',
                width: '200px',
                dataIndex: 'purchaseTotalAmount',
                align: 'center',
                render: (value, row) => {
                    return {
                        children: value,
                        props: {
                            rowSpan: row.rowSpan || 0,
                        },
                    };
                },
            },
            {
                title: '实际退款金额',
                width: '200px',
                dataIndex: 'refundAmount',
                align: 'center',
                render: (value, row) => {
                    return {
                        children: row.purchaseTotalAmount,
                        props: {
                            rowSpan: row.rowSpan || 0,
                        },
                    };
                },
            },
            {
                title: '退款状态',
                width: '200px',
                dataIndex: 'purchaseRefundStatus', //(0：待处理，1：退款申请中，2：退款申请成功，3：退款驳回，4：等待商家退款:5：退款成功)
                align: 'center',
                render: (value: keyof typeof refundStatusMap = 0, row) => {
                    return {
                        children: (
                            <div>
                                {refundStatusMap[value]}
                                {String(value) === '2' ? (
                                    <Button type="link" onClick={() => showReturnModal(row)}>
                                        填写运单号
                                    </Button>
                                ) : null}
                            </div>
                        ),
                        props: {
                            rowSpan: row.rowSpan || 0,
                        },
                    };
                },
            },
            {
                title: '商品信息',
                dataIndex: 'productInfo',
                width: '178px',
                align: 'center',
                render: (_, item) => {
                    const {
                        productImageUrl,
                        purchaseGoodsName,
                        productSkuStyle,
                        purchaseGoodsNumber = 0,
                    } = item;
                    let skus: any[] = [];
                    try {
                        const sku = JSON.parse(productSkuStyle);
                        for (let key in sku) {
                            skus.push(
                                <div key={key}>
                                    {key}:{sku[key]}
                                </div>,
                            );
                        }
                    } catch (e) {}
                    const children = (
                        <div>
                            <AutoEnLargeImg src={productImageUrl} className={styles.image} />
                            <div>{purchaseGoodsName}</div>
                            <div>{skus}</div>
                            <div>数量：x{purchaseGoodsNumber}</div>
                        </div>
                    );
                    return {
                        children: children,
                        props: {
                            rowSpan: item.rowSpan || 0,
                        },
                    };
                },
            },
            {
                title: '采购平台',
                dataIndex: 'purchasePlatform',
                width: '130px',
                align: 'center',
                render: (value, row) => {
                    return {
                        children: value,
                        props: {
                            rowSpan: row.rowSpan || 0,
                        },
                    };
                },
            },
            {
                title: '采购店铺',
                dataIndex: 'purchaseMerchantName',
                width: '130px',
                align: 'center',
                render: (value, row) => {
                    return {
                        children: value,
                        props: {
                            rowSpan: row.rowSpan || 0,
                        },
                    };
                },
            },
            {
                title: '供应商订单号',
                dataIndex: 'purchaseOrderGoodsSn',
                width: '223px',
                align: 'center',
                render: (value, row) => {
                    return {
                        children: value,
                        props: {
                            rowSpan: row.rowSpan || 0,
                        },
                    };
                },
            },
            {
                title: '运单号',
                dataIndex: 'purchaseTrackingNumber',
                width: '182px',
                align: 'center',
                render: (_, row) => {
                    const code = String(row.boundStatus);
                    return _ ? (
                        <>
                            <div>{_}</div>
                            <div>{code === '1' ? '未入库' : code === '10' ? '已入库' : ''}</div>
                        </>
                    ) : null;
                },
            },
            {
                title: '出入库单号',
                dataIndex: 'referWaybillNo',
                width: '223px',
                align: 'center',
            },
            {
                title: '出入库类型',
                dataIndex: 'boundType',
                width: '223px',
                align: 'center',
                render: (_ = 0) => {
                    const code = String(_);
                    return code === '0' ? '入库' : code === '1' ? '出库' : '';
                },
            },
        ] as ColumnType<IPurchaseItem>[];
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

    const table = useMemo(() => {
        const dataSet = colSpanDataSource(dataSource);
        return (
            <FitTable
                rowKey="purchaseOrderGoodsId"
                scroll={scroll}
                bottom={60}
                minHeight={500}
                pagination={pagination}
                columns={columns}
                dataSource={dataSet}
                loading={loading}
                onChange={onChange}
            />
        );
    }, [loading]);

    return useMemo(() => {
        return (
            <>
                {searchForm}
                {table}
                <ReturnModal visible={returnModal} onCancel={closeReturnModal} />
                <Export
                    columns={columns}
                    visible={showExport}
                    onOKey={onExport}
                    onCancel={closeExportFn}
                />
            </>
        );
    }, [loading, returnModal, showExport]);
};

export default Return;

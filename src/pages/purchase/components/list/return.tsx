import React, { useCallback, useMemo, useRef, useState } from 'react';
import { JsonFormRef } from 'react-components/es/JsonForm';
import { AutoEnLargeImg, FitTable, JsonForm, LoadingButton, useList } from 'react-components';
import { Button, Tag, Typography } from 'antd';
import { FormField } from 'react-components/es/JsonForm';
import formStyles from 'react-components/es/JsonForm/_form.less';
import { ITaskListItem } from '@/interface/ITask';
import { ColumnType, TableProps } from 'antd/es/table';
import { exportPurchaseList, queryPurchaseList } from '@/services/purchase';
import { IPurchaseItem } from '@/interface/IPurchase';
import styles from '@/pages/purchase/_list.less';
import { colSpanDataSource } from '@/pages/purchase/components/list/all';
import { PurchaseCreateType } from '@/config/dictionaries/Purchase';
import ReturnModal from './returnModal';
import Export from '@/components/Export';
import classNames from 'classnames';
import { filterFieldsList } from './form';
import { utcToLocal } from 'react-components/es/utils/date';
const { Paragraph } = Typography;

const fieldKeys = [
    'purchase_order_goods_id',
    'purchase_refund_status',
    'purchase_platform',
    'purchase_merchant_name',
    'purchase_order_goods_sn',
    'purchase_goods_name',
    'origin',
    'purchase_waybill_no',
    'create_time',
];
const fieldList: FormField[] = filterFieldsList(fieldKeys);

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
            <JsonForm fieldList={fieldList} ref={formRef} labelClassName={styles.formItem}>
                <div>
                    <LoadingButton onClick={onSearch} type="primary" className={formStyles.formBtn}>
                        搜索
                    </LoadingButton>
                    <LoadingButton onClick={onReload} className={formStyles.formBtn}>
                        刷新
                    </LoadingButton>
                    <Button onClick={showExportFn} className={formStyles.formBtn}>
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
                className: 'break-all',
                render: (value, row) => {
                    const { origin = PurchaseCreateType.Auto } = row;
                    return {
                        children: (
                            <>
                                {origin === PurchaseCreateType.Manually && <Tag>手动</Tag>}
                                {value}
                            </>
                        ),
                        props: {
                            rowSpan: row.rowSpan || 0,
                        },
                    };
                },
            },
            {
                title: '采购单生成时间',
                dataIndex: 'createTime',
                align: 'center',
                width: '150px',
                render: (value, row) => {
                    return {
                        children: utcToLocal(value),
                        props: {
                            rowSpan: row.rowSpan || 0,
                        },
                    };
                },
            },
            {
                title: '采购金额',
                width: '150px',
                dataIndex: 'purchaseTotalAmount',
                align: 'center',
                render: (value, row) => {
                    return {
                        children: value ? `¥${value}` : value,
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
                width: '280px',
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
                        <div
                            className={classNames(
                                formStyles.flex,
                                formStyles.flexRow,
                                formStyles.flexAlign,
                            )}
                        >
                            <AutoEnLargeImg src={productImageUrl} className={styles.image} />
                            <div className={classNames(formStyles.flex1, styles.productDesc)}>
                                <div title={purchaseGoodsName}>
                                    <Paragraph ellipsis={{ rows: 2 }} className={styles.paragraph}>
                                        {purchaseGoodsName}
                                    </Paragraph>
                                </div>
                                <div>{skus}</div>
                                <div>数量：x{purchaseGoodsNumber}</div>
                            </div>
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
                dataIndex: 'purchaseWaybillNo',
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
                width: '150px',
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
                bordered={true}
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

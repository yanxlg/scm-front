import React, { useCallback, useMemo, useRef, useState } from 'react';
import { JsonFormRef } from 'react-components/es/JsonForm';
import {
    AutoEnLargeImg,
    FitTable,
    JsonForm,
    LoadingButton,
    PopConfirmLoadingButton,
    useList,
    useModal,
} from 'react-components';
import { Button, message, Modal, Typography, Tag, Popconfirm } from 'antd';
import { FormField } from 'react-components/es/JsonForm';
import formStyles from 'react-components/es/JsonForm/_form.less';
import { ITaskListItem } from '@/interface/ITask';
import { ColumnType, TableProps } from 'antd/es/table';
import {
    applyReturn,
    cancelPurchaseByUser,
    exportPurchaseList,
    queryPurchaseList,
    reviewVirtualDelivery,
} from '@/services/purchase';
import { IPurchaseItem, IReviewVirtualDelivery } from '@/interface/IPurchase';
import styles from '@/pages/purchase/_list.less';
import PurchaseDetailModal from '@/pages/purchase/components/list/purchaseDetailModal';
import {
    PurchaseCode,
    PurchaseCreateType,
    PurchaseMap,
    FalseShippingReviewMap,
    IsFalseShippingCode,
    IsFalseShippingMap,
} from '@/config/dictionaries/Purchase';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import ConnectModal from './connectModal';
import Export from '@/components/Export';
import { FormInstance } from 'antd/es/form';
import classNames from 'classnames';
import { PermissionComponent } from 'rc-permission';
import { filterFieldsList } from './form';
import { utcToLocal } from 'react-components/es/utils/date';
import { colSpanDataSource } from './all';

const { Paragraph } = Typography;

const fieldKeys = [
    'purchase_order_goods_id',
    'purchase_platform',
    'purchase_merchant_name',
    'purchase_order_goods_sn',
    'purchase_goods_name',
    'origin',
    'purchase_waybill_no',
    'is_real_delivery',
    'audit_status',
    'create_time',
];
const fieldList: FormField[] = filterFieldsList(fieldKeys);

const scroll: TableProps<ITaskListItem>['scroll'] = { x: true, scrollToFirstRowOnChange: true };

const PendingShipped = () => {
    const formRef = useRef<JsonFormRef>(null);
    const formRef1 = useRef<JsonFormRef>(null);
    const { visible, setVisibleProps, onClose } = useModal<string>();

    const fieldList1: FormField[] = useMemo(() => {
        return [
            {
                type: 'checkboxGroup',
                name: 'update_time',
                formItemClassName: '',
                options: [
                    {
                        label: '48小时无状态更新',
                        value: 48,
                    },
                ],
                onChange: (name: string, form: FormInstance) => {
                    onSearch();
                },
                formatter: 'join',
            },
        ];
    }, []);

    const showDetailModal = useCallback((purchaseOrderGoodsId: string) => {
        setVisibleProps(purchaseOrderGoodsId);
    }, []);

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
        formRef: [formRef, formRef1],
        extraQuery: {
            type: 1,
        },
    });

    const [showExport, setShowExport] = useState(false);

    const _reviewVirtualDelivery = useCallback((data: IReviewVirtualDelivery) => {
        reviewVirtualDelivery(data).then(() => {
            // console.log('reviewVirtualDelivery', res);
            message.success('虚假发货审核成功！');
            onReload();
        });
    }, []);

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
                type: 1,
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

    const applyReturnService = useCallback((item: IPurchaseItem) => {
        Modal.confirm({
            title: '申请退款',
            content: '是否确认申请退款？',
            icon: <ExclamationCircleOutlined />,
            okText: '确定',
            cancelText: '取消',
            onOk: () => {
                return applyReturn(item.purchaseOrderGoodsId)
                    .request()
                    .then(() => {
                        message.success('申请成功！');
                        onReload();
                    });
            },
        });
    }, []);

    const [connect, setConnect] = useState<string | false>(false);
    const showConnect = useCallback((item: IPurchaseItem) => {
        setConnect(item.purchaseOrderGoodsId);
    }, []);
    const closeConnect = useCallback(() => {
        setConnect(false);
    }, []);

    const onCancelPurchaseByUser = useCallback((purchaseOrderGoodsId: string) => {
        return cancelPurchaseByUser(purchaseOrderGoodsId).then(() => {
            onReload();
        });
    }, []);
    const columns = useMemo(() => {
        return [
            {
                title: '操作',
                dataIndex: 'operation',
                fixed: 'left',
                width: '150px',
                align: 'center',
                render: (_, item) => {
                    const { origin = PurchaseCreateType.Auto, purchaseOrderGoodsId } = item;
                    return {
                        children: (
                            <>
                                <PermissionComponent pid="purchase/list/connect" control="tooltip">
                                    <Button type="link" onClick={() => showConnect(item)}>
                                        关联运单号
                                    </Button>
                                </PermissionComponent>
                                {origin === PurchaseCreateType.Auto ? (
                                    <PermissionComponent
                                        pid="purchase/list/refund"
                                        control="tooltip"
                                    >
                                        <Button
                                            type="link"
                                            onClick={() => applyReturnService(item)}
                                        >
                                            申请退款
                                        </Button>
                                    </PermissionComponent>
                                ) : (
                                    <PopConfirmLoadingButton
                                        popConfirmProps={{
                                            title: '确定要取消该采购单？',
                                            onConfirm: () =>
                                                onCancelPurchaseByUser(purchaseOrderGoodsId),
                                        }}
                                        buttonProps={{
                                            type: 'link',
                                            children: '取消采购单',
                                        }}
                                    />
                                )}
                            </>
                        ),
                        props: {
                            rowSpan: item.rowSpan || 0,
                        },
                    };
                },
            },
            {
                title: '采购单ID',
                dataIndex: 'purchaseOrderGoodsId',
                align: 'center',
                width: '150px',
                className: 'break-all',
                render: (_, item) => {
                    const { origin = PurchaseCreateType.Auto } = item;
                    return {
                        children: (
                            <>
                                {origin === PurchaseCreateType.Manually && <Tag>手动</Tag>}
                                {_}
                            </>
                        ),
                        props: {
                            rowSpan: item.rowSpan || 0,
                        },
                    };
                },
            },
            {
                title: '采购单生成时间',
                dataIndex: 'createTime',
                align: 'center',
                width: '150px',
                render: value => utcToLocal(value),
            },
            {
                title: '采购单状态',
                width: '140px',
                dataIndex: 'purchaseGoodsStatus',
                align: 'center',
                render: (value: PurchaseCode, item) => {
                    return {
                        children: PurchaseMap[value],
                        props: {
                            rowSpan: item.rowSpan || 0,
                        },
                    };
                },
            },
            {
                title: '采购金额',
                width: '150px',
                dataIndex: 'purchaseTotalAmount',
                align: 'center',
                render: (value, item) => {
                    return {
                        children: value ? `¥${value}` : value,
                        props: {
                            rowSpan: item.rowSpan || 0,
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
                    return {
                        children: (
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
                                        <Paragraph
                                            ellipsis={{ rows: 2 }}
                                            className={styles.paragraph}
                                        >
                                            {purchaseGoodsName}
                                        </Paragraph>
                                    </div>
                                    <div>{skus}</div>
                                    <div>数量：x{purchaseGoodsNumber}</div>
                                </div>
                            </div>
                        ),
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
                title: '采购计划',
                width: '223px',
                align: 'center',
                render: (value, row) => {
                    return {
                        children: (
                            <Button
                                type="link"
                                onClick={() => showDetailModal(row.purchaseOrderGoodsId)}
                            >
                                查看详情
                            </Button>
                        ),
                        props: {
                            rowSpan: row.rowSpan || 0,
                        },
                    };
                },
            },
            {
                title: '是否虚假发货',
                dataIndex: 'isRealDelivery',
                width: '160px',
                align: 'center',
                render: (val: IsFalseShippingCode) => IsFalseShippingMap[val] || '',
            },
            {
                title: '虚假发货审核状态',
                dataIndex: 'auditStatus',
                width: '160px',
                align: 'center',
                render: (val: number, record) => {
                    const { purchaseOrderGoodsId, referWaybillNo } = record;
                    if (val === 1) {
                        return (
                            <>
                                <Popconfirm
                                    placement="top"
                                    title="确认是虚假发货吗？"
                                    onConfirm={() =>
                                        _reviewVirtualDelivery({
                                            refer_waybill_no: referWaybillNo,
                                            audit_status: 2,
                                            purchase_order_goods_id: purchaseOrderGoodsId,
                                        })
                                    }
                                    okText="确认"
                                    cancelText="取消"
                                >
                                    <a className={styles.operateItem}>确认</a>
                                </Popconfirm>
                                <Popconfirm
                                    placement="top"
                                    title="确认不是虚假发货吗？"
                                    onConfirm={() =>
                                        _reviewVirtualDelivery({
                                            refer_waybill_no: referWaybillNo,
                                            audit_status: 3,
                                            purchase_order_goods_id: purchaseOrderGoodsId,
                                        })
                                    }
                                    okText="确认"
                                    cancelText="取消"
                                >
                                    <a className={styles.operateItem}>取消</a>
                                </Popconfirm>
                            </>
                        );
                    } else if (val === 2 || val === 3) {
                        return FalseShippingReviewMap[val];
                    }
                    return '';
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

    const toolBarRender = useCallback(() => {
        return [
            <JsonForm
                containerClassName=""
                key="extra-form"
                fieldList={fieldList1}
                ref={formRef1}
            />,
        ];
    }, []);

    const table = useMemo(() => {
        // 处理合并单元格
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
                toolBarRender={toolBarRender}
            />
        );
    }, [loading]);

    return useMemo(() => {
        return (
            <>
                {searchForm}
                {table}
                <PurchaseDetailModal visible={visible} onCancel={onClose} />
                <ConnectModal visible={connect} onCancel={closeConnect} />
                <Export
                    columns={columns}
                    visible={showExport}
                    onOKey={onExport}
                    onCancel={closeExportFn}
                />
            </>
        );
    }, [loading, visible, connect, showExport]);
};

export default PendingShipped;

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
    useModal2,
} from 'react-components';
import { Button, message, Modal, Tag, Typography } from 'antd';
import { FormField } from 'react-components/es/JsonForm/index';
import formStyles from 'react-components/es/JsonForm/_form.less';
import { ITaskListItem } from '@/interface/ITask';
import { ColumnType, TableProps } from 'antd/es/table';
import {
    applyReturn,
    cancelPurchaseByUser,
    endPurchaseByUser,
    exportPurchaseList,
    queryPurchaseList,
} from '@/services/purchase';
import { IPurchaseItem } from '@/interface/IPurchase';
import PurchaseDetailModal from '@/pages/purchase/components/list/purchaseDetailModal';
import styles from '@/pages/purchase/_list.less';
import {
    PurchaseCode,
    PurchaseCreateType,
    PurchaseCreateTypeList,
    PurchaseMap,
} from '@/config/dictionaries/Purchase';
import Export from '@/components/Export';
import classNames from 'classnames';
import CreatePurchaseModal from '@/pages/purchase/components/list/createPurchase';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import ConnectModal from '@/pages/purchase/components/list/connectModal';
import { PermissionComponent } from 'rc-permission';

const { Paragraph } = Typography;

const fieldList: FormField[] = [
    {
        label: '采购单ID',
        type: 'positiveInteger',
        name: 'purchase_order_goods_id',
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
    {
        label: '采购单类型',
        type: 'select',
        name: 'origin',
        formatter: 'number',
        optionList: [
            {
                name: '全部',
                value: '',
            },
            ...PurchaseCreateTypeList,
        ],
    },
];

const scroll: TableProps<ITaskListItem>['scroll'] = { x: true, scrollToFirstRowOnChange: true };

export function colSpanDataSource(dataSource: IPurchaseItem[]) {
    let list: IPurchaseItem[] = [];
    dataSource.forEach(source => {
        const { storageExpressInfo = [] } = source;
        if (storageExpressInfo && storageExpressInfo.length > 0) {
            storageExpressInfo.map((info, index) => {
                list.push({
                    ...source,
                    ...info,
                    rowSpan: index === 0 ? storageExpressInfo.length : 0,
                });
            });
        } else {
            list.push({
                ...source,
                rowSpan: 1,
            });
        }
    });
    return list;
}

const AllList = () => {
    const formRef = useRef<JsonFormRef>(null);
    const { visible, setVisibleProps, onClose } = useModal<string>();
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
        formRef: formRef,
        extraQuery: {
            type: 0,
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
                type: 0,
            },
        }).request();
    }, []);

    const searchForm = useMemo(() => {
        return (
            <JsonForm
                fieldList={fieldList}
                ref={formRef}
                labelClassName={styles.formItem}
                initialValues={{
                    origin: '',
                }}
            >
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

    const [connect, setConnect] = useState<string | false>(false);
    const showConnect = useCallback((item: IPurchaseItem) => {
        setConnect(item.purchaseOrderGoodsId);
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

    const onCancelPurchaseByUser = useCallback((purchaseOrderGoodsId: string) => {
        return cancelPurchaseByUser(purchaseOrderGoodsId).then(() => {
            onReload();
        });
    }, []);

    const onEndPurchaseByUser = useCallback((purchaseOrderGoodsId: string) => {
        return endPurchaseByUser(purchaseOrderGoodsId).then(() => {
            onReload();
        });
    }, []);

    const closeConnect = useCallback(() => {
        setConnect(false);
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
                    const {
                        origin = PurchaseCreateType.Auto,
                        purchaseOrderGoodsId,
                        purchaseGoodsStatus,
                    } = item;
                    const status = String(purchaseGoodsStatus);
                    let child: React.ReactNode;

                    switch (status) {
                        case '1': // 待发货
                            child = (
                                <>
                                    <PermissionComponent
                                        pid="purchase/list/connect"
                                        control="tooltip"
                                    >
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
                            );
                            break;
                        case '2':
                            child = (
                                <>
                                    <PermissionComponent
                                        pid="purchase/list/connect"
                                        control="tooltip"
                                    >
                                        <Button type="link" onClick={() => showConnect(item)}>
                                            关联运单号
                                        </Button>
                                    </PermissionComponent>
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
                                </>
                            );
                            break;
                        case '3':
                            child = (
                                <>
                                    <PermissionComponent
                                        pid="purchase/list/connect"
                                        control="tooltip"
                                    >
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
                                    ) : null /*(
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
                                    )*/}
                                </>
                            );
                            break;
                        case '4':
                            child = (
                                <>
                                    <PermissionComponent
                                        pid="purchase/list/connect"
                                        control="tooltip"
                                    >
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
                                    ) : null}
                                    <PermissionComponent
                                        pid="purchase/list/finish"
                                        control="tooltip"
                                    >
                                        <PopConfirmLoadingButton
                                            popConfirmProps={{
                                                title: '确定要完结该采购单？',
                                                onConfirm: () =>
                                                    onEndPurchaseByUser(purchaseOrderGoodsId),
                                            }}
                                            buttonProps={{
                                                type: 'link',
                                                children: '完结采购单',
                                            }}
                                        />
                                    </PermissionComponent>
                                </>
                            );
                            break;
                        case '5': // 已完结 + 已取消
                            child = (
                                <>
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
                                </>
                            );
                            break;
                        default:
                            child = null;
                            break;
                    }
                    return {
                        children: child,
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
                title: '采购单状态',
                width: '140px',
                dataIndex: 'purchaseGoodsStatus',
                align: 'center',
                render: (value: PurchaseCode, row) => {
                    return {
                        children: PurchaseMap[value],
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
                title: '采购计划',
                width: '150px',
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

    const [createModal, showCreateModal, closeCreateModal] = useModal2<true>();

    const toolBarRender = useCallback(() => {
        return [
            <Button type="primary" key="1" onClick={() => showCreateModal(true)}>
                创建采购单
            </Button>,
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
                <Export
                    columns={columns}
                    visible={showExport}
                    onOKey={onExport}
                    onCancel={closeExportFn}
                />
                <CreatePurchaseModal
                    visible={createModal}
                    onClose={closeCreateModal}
                    onReload={onReload}
                />
                <ConnectModal visible={connect} onCancel={closeConnect} />
            </>
        );
    }, [loading, visible, showExport, createModal, connect]);
};

export default AllList;

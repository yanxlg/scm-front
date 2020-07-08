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
import { Button, message, Modal, Tag, Typography } from 'antd';
import { FormField } from 'react-components/es/JsonForm/index';
import formStyles from 'react-components/es/JsonForm/_form.less';
import { ITaskListItem } from '@/interface/ITask';
import { ColumnType, TableProps } from 'antd/es/table';
import {
    applyReturn,
    endPurchaseByUser,
    exportPurchaseList,
    queryPurchaseList,
} from '@/services/purchase';
import { IPurchaseItem } from '@/interface/IPurchase';
import { colSpanDataSource } from '@/pages/purchase/components/list/all';
import styles from '@/pages/purchase/_list.less';
import PurchaseDetailModal from '@/pages/purchase/components/list/purchaseDetailModal';
import {
    PurchaseCode,
    PurchaseCreateType,
    PurchaseCreateTypeList,
    PurchaseMap,
} from '@/config/dictionaries/Purchase';
import ConnectModal from '@/pages/purchase/components/list/connectModal';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import Export from '@/components/Export';
import classNames from 'classnames';
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

const Warehousing = () => {
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
            type: 4,
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
                type: 4,
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

    const onEndPurchaseByUser = useCallback((purchaseOrderGoodsId: string) => {
        return endPurchaseByUser(purchaseOrderGoodsId).then(() => {
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
                    const { origin = PurchaseCreateType.Manually, purchaseOrderGoodsId } = item;

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
                                ) : null}
                                {/*所有部分入库都可以完结*/}
                                <PermissionComponent pid="purchase/list/finish" control="tooltip">
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
                            className: 'break-all',
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
                title: '入库数量',
                dataIndex: 'realInStorageNumber',
                width: '130px',
                align: 'center',
                render: (value, row) => {
                    const { realInStorageNumber = 0, purchaseGoodsNumber = 0 } = row;
                    return {
                        children: `${realInStorageNumber}/${purchaseGoodsNumber}`,
                        props: {
                            rowSpan: row.rowSpan || 0,
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

export default Warehousing;

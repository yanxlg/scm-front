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
import { FormField } from 'react-components/es/JsonForm/index';
import { Button, message, Modal, Typography, Tag } from 'antd';
import formStyles from 'react-components/es/JsonForm/_form.less';
import { ITaskListItem } from '@/interface/ITask';
import { ColumnType, TableProps } from 'antd/es/table';
import {
    applyReturn,
    cancelPurchaseByUser,
    exportPurchaseList,
    queryPurchaseList,
} from '@/services/purchase';
import { IPurchaseItem } from '@/interface/IPurchase';
import styles from '@/pages/purchase/_list.less';
import PurchaseDetailModal from '@/pages/purchase/components/list/purchaseDetailModal';
import {
    PurchaseCode,
    PurchaseCreateType,
    PurchaseCreateTypeList,
    PurchaseMap,
} from '@/config/dictionaries/Purchase';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import ConnectModal from './connectModal';
import Export from '@/components/Export';
import { FormInstance } from 'antd/es/form';
import classNames from 'classnames';

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
                    return (
                        <>
                            <Button type="link" onClick={() => showConnect(item)}>
                                关联运单号
                            </Button>
                            {origin === PurchaseCreateType.Auto ? (
                                <Button type="link" onClick={() => applyReturnService(item)}>
                                    申请退款
                                </Button>
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
                    return (
                        <>
                            {origin === PurchaseCreateType.Manually && <Tag>手动</Tag>}
                            {_}
                        </>
                    );
                },
            },
            {
                title: '采购单状态',
                width: '140px',
                dataIndex: 'purchaseGoodsStatus',
                align: 'center',
                render: (value: PurchaseCode, row) => {
                    return PurchaseMap[value];
                },
            },
            {
                title: '采购金额',
                width: '150px',
                dataIndex: 'purchaseTotalAmount',
                align: 'center',
                render: value => {
                    return value ? `¥${value}` : value;
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
                    return (
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
                },
            },
            {
                title: '采购平台',
                dataIndex: 'purchasePlatform',
                width: '130px',
                align: 'center',
            },
            {
                title: '采购店铺',
                dataIndex: 'purchaseMerchantName',
                width: '130px',
                align: 'center',
            },
            {
                title: '供应商订单号',
                dataIndex: 'purchaseOrderGoodsSn',
                width: '223px',
                align: 'center',
            },
            {
                title: '采购计划',
                width: '223px',
                align: 'center',
                render: (value, row) => {
                    return (
                        <Button
                            type="link"
                            onClick={() => showDetailModal(row.purchaseOrderGoodsId)}
                        >
                            查看详情
                        </Button>
                    );
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
        return (
            <FitTable
                rowKey="purchaseOrderGoodsId"
                bordered={true}
                scroll={scroll}
                bottom={60}
                minHeight={500}
                pagination={pagination}
                columns={columns}
                dataSource={dataSource}
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

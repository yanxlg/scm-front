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
import { Button, message, Modal } from 'antd';
import formStyles from 'react-components/es/JsonForm/_form.less';
import { ITaskListItem } from '@/interface/ITask';
import { ColumnType, TableProps } from 'antd/es/table';
import { applyReturn, cancelReturnOrder, queryPurchaseList } from '@/services/purchase';
import { IPurchaseItem, IReturnItem } from '@/interface/IPurchase';
import styles from '@/pages/purchase/_list.less';
import PurchaseDetailModal from '@/pages/purchase/components/list/purchaseDetailModal';
import { colSpanDataSource } from '@/pages/purchase/components/list/all';
import { PurchaseCode, PurchaseMap } from '@/config/dictionaries/Purchase';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import ConnectModal from './connectModal';

const fieldList: FormField[] = [
    {
        label: '采购单id',
        type: 'input',
        name: 'purchase_order_goods_id',
    },
    {
        label: '供应商',
        type: 'input',
        name: 'gongyingshag',
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

const fieldList1: FormField[] = [
    {
        label: '48小时无状态更新',
        type: 'checkbox',
        name: 'id',
        formItemClassName: '',
        formatter: 'join',
    },
];

const scroll: TableProps<ITaskListItem>['scroll'] = { x: true, scrollToFirstRowOnChange: true };

const PendingShipped = () => {
    const formRef = useRef<JsonFormRef>(null);
    const formRef1 = useRef<JsonFormRef>(null);
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
        formRef: [formRef, formRef1],
        extraQuery: {
            type: 1,
        },
    });

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
                    <Button type="primary" className={formStyles.formBtn}>
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
                return applyReturn(Number(item.purchaseOrderGoodsId))
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

    const columns = useMemo(() => {
        return [
            {
                title: '操作',
                dataIndex: 'operation',
                fixed: 'left',
                width: '150px',
                align: 'center',
                render: (_, item) => {
                    return (
                        <>
                            <Button type="link" onClick={() => showConnect(item)}>
                                关联运单号
                            </Button>
                            <Button type="link" onClick={() => applyReturnService(item)}>
                                申请退款
                            </Button>
                        </>
                    );
                },
            },
            {
                title: '采购单ID',
                dataIndex: 'purchaseOrderGoodsId',
                align: 'center',
                width: '150px',
            },
            {
                title: '采购单状态',
                width: '140px',
                dataIndex: 'purchaseOrderStatus',
                align: 'center',
                render: (value: PurchaseCode, row) => {
                    return PurchaseMap[value];
                },
            },
            {
                title: '采购金额',
                width: '200px',
                dataIndex: 'purchaseTotalAmount',
                align: 'center',
            },
            {
                title: '商品信息',
                dataIndex: 'product_info',
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
                    return (
                        <div>
                            <AutoEnLargeImg src={productImageUrl} className={styles.image} />
                            <div>{purchaseGoodsName}</div>
                            <div>{skus}</div>
                            <div>数量：x{purchaseGoodsNumber}</div>
                        </div>
                    );
                },
            },
            {
                title: '供应商',
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
                enableCollapse={false}
            />,
        ];
    }, []);

    const table = useMemo(() => {
        return (
            <FitTable
                rowKey="purchaseOrderGoodsId"
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
            </>
        );
    }, [loading, visible, connect]);
};

export default PendingShipped;

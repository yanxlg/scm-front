import React, { useCallback, useMemo, useRef, useState } from 'react';
import { JsonFormRef } from 'react-components/es/JsonForm';
import {
    AutoEnLargeImg,
    FitTable,
    JsonForm,
    LoadingButton,
    PopConfirmLoadingButton,
    useList,
} from 'react-components';
import { FormField } from 'react-components/src/JsonForm/index';
import { Button, message, Modal } from 'antd';
import formStyles from 'react-components/es/JsonForm/_form.less';
import { ITaskListItem } from '@/interface/ITask';
import { ColumnType, TableProps } from 'antd/es/table';
import {
    cancelReturnOrder,
    exportReturnList,
    queryPurchaseList,
    queryReturnList,
} from '@/services/purchase';
import { IPurchaseItem, IReturnItem } from '@/interface/IPurchase';
import {
    PurchaseReturnCode,
    PurchaseReturnMap,
    PurchaseReturnType,
} from '@/config/dictionaries/Purchase';
import { FormInstance } from 'antd/es/form';
import styles from '@/pages/purchase/_return.less';
import Export from '@/components/Export';

const fieldList: FormField[] = [
    {
        label: '出入库单号',
        type: 'input',
        name: 'refer_waybill_no',
    },
    {
        label: '商品名称',
        type: 'input',
        name: 'product_name',
    },
    {
        label: '采购单ID',
        type: 'input',
        name: 'purchase_order_goods_id',
    },
    {
        label: '供应商订单号',
        type: 'input',
        name: 'purchase_order_goods_sn',
    },
    {
        label: '运单号',
        type: 'input',
        name: 'waybill_no',
    },
];

const scroll: TableProps<ITaskListItem>['scroll'] = { x: true, scrollToFirstRowOnChange: true };

const PendingOut = () => {
    const [showExport, setShowExport] = useState(false);

    const showExportFn = useCallback(() => {
        setShowExport(true);
    }, []);

    const closeExportFn = useCallback(() => {
        setShowExport(false);
    }, []);

    const onExport = useCallback((data: any) => {
        return exportReturnList(data).request();
    }, []);

    const formRef = useRef<JsonFormRef>(null);
    const formRef1 = useRef<JsonFormRef>(null);
    const {
        loading,
        pageNumber,
        pageSize,
        dataSource,
        total,
        onChange,
        onSearch,
        onReload,
    } = useList<IReturnItem>({
        queryList: queryReturnList,
        formRef: [formRef, formRef1],
        extraQuery: {
            purchase_return_status: PurchaseReturnType.PendingOut,
        },
    });

    const fieldList1: FormField[] = useMemo(() => {
        return [
            {
                type: 'checkboxGroup',
                name: 'time_type',
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
            },
        ];
    }, []);

    const searchForm = useMemo(() => {
        return (
            <JsonForm fieldList={fieldList} ref={formRef} enableCollapse={false}>
                <div>
                    <LoadingButton type="primary" className={formStyles.formBtn} onClick={onSearch}>
                        搜索
                    </LoadingButton>
                    <LoadingButton type="primary" className={formStyles.formBtn} onClick={onReload}>
                        刷新
                    </LoadingButton>
                    <Button onClick={showExportFn} type="primary" className={formStyles.formBtn}>
                        导出
                    </Button>
                </div>
            </JsonForm>
        );
    }, []);

    const cancelReturnOrderFn = useCallback((item: IReturnItem) => {
        Modal.confirm({
            title: '取消采购退货单',
            content: '是否确认取消采购退货单？',
            okText: '去定',
            cancelText: '取消',
            onOk: () => {
                return cancelReturnOrder(item.purchaseOrderGoodsReturnId)
                    .request()
                    .then(() => {
                        message.success('取消成功！');
                        onReload();
                    });
            },
        });
    }, []);

    const columns = useMemo(() => {
        return [
            {
                title: '出入库单号',
                dataIndex: 'referWaybillNo',
                align: 'center',
                width: '150px',
                render: (_: string, item: IReturnItem) => {
                    return (
                        <div>
                            {_}
                            <Button type="link" onClick={() => cancelReturnOrderFn(item)}>
                                取消退货单
                            </Button>
                        </div>
                    );
                },
            },
            {
                title: '出入库类型',
                width: '100px',
                align: 'center',
                dataIndex: 'outboundType',
                render: () => '退货出库',
            },
            {
                title: '退货状态',
                width: '200px',
                dataIndex: 'purchaseReturnStatus',
                align: 'center',
                render: (_: PurchaseReturnCode) => PurchaseReturnMap[_],
            },
            {
                title: '商品信息',
                dataIndex: 'product_info',
                width: '178px',
                align: 'center',
                render: (_, item: IReturnItem) => {
                    const { productImageUrl, purchasePlatformGoodsName, productSkuStyle } = item;
                    let skus: any[] = [];
                    try {
                        const sku = JSON.parse(productSkuStyle);
                        for (let key of sku) {
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
                            {purchasePlatformGoodsName}
                            {skus}
                        </div>
                    );
                },
            },
            {
                title: '退货数量',
                dataIndex: 'returnNumber',
                width: '130px',
                align: 'center',
            },
            {
                title: '采购单ID',
                dataIndex: 'purchaseOrderGoodsId',
                width: '223px',
                align: 'center',
            },
            {
                title: '供应商',
                dataIndex: 'productPddMerchantName',
                width: '223px',
                align: 'center',
            },
            {
                title: '供应商订单号',
                dataIndex: 'purchaseOrderGoodsSn',
                width: '182px',
                align: 'center',
            },
        ] as ColumnType<IReturnItem>[];
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
                rowKey="purchaseOrderGoodsReturnId"
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
                <Export
                    columns={columns}
                    visible={showExport}
                    onOKey={onExport}
                    onCancel={closeExportFn}
                />
            </>
        );
    }, [loading, showExport]);
};

export default PendingOut;

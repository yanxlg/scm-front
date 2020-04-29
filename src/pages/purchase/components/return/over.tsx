import React, { useCallback, useMemo, useRef, useState } from 'react';
import { JsonFormRef } from 'react-components/es/JsonForm';
import { AutoEnLargeImg, FitTable, JsonForm, LoadingButton, useList } from 'react-components';
import { FormField } from 'react-components/src/JsonForm/index';
import { Button } from 'antd';
import formStyles from 'react-components/es/JsonForm/_form.less';
import { ITaskListItem } from '@/interface/ITask';
import { ColumnType, TableProps } from 'antd/es/table';
import { exportReturnList, queryPurchaseList, queryReturnList } from '@/services/purchase';
import { IPurchaseItem, IReturnItem } from '@/interface/IPurchase';
import { FormInstance } from 'antd/es/form';
import {
    PurchaseReturnCode,
    PurchaseReturnMap,
    PurchaseReturnType,
} from '@/config/dictionaries/Purchase';
import styles from '@/pages/purchase/_return.less';
import Export from '@/components/Export';
import { fieldList } from '@/pages/purchase/components/return/all';

const scroll: TableProps<ITaskListItem>['scroll'] = { x: true, scrollToFirstRowOnChange: true };

const Over = () => {
    const formRef = useRef<JsonFormRef>(null);
    const formRef1 = useRef<JsonFormRef>(null);

    const [showExport, setShowExport] = useState(false);

    const showExportFn = useCallback(() => {
        setShowExport(true);
    }, []);

    const closeExportFn = useCallback(() => {
        setShowExport(false);
    }, []);

    const onExport = useCallback((data: any) => {
        return exportReturnList({
            ...data,
            query: {
                purchase_return_status: PurchaseReturnType.Over,
                ...formRef.current!.getFieldsValue(),
                ...formRef1.current!.getFieldsValue(),
            },
        }).request();
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
    } = useList<IReturnItem>({
        queryList: queryReturnList,
        formRef: [formRef, formRef1],
        extraQuery: {
            purchase_return_status: PurchaseReturnType.Over,
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
                    <Button onClick={showExportFn} type="primary" className={formStyles.formBtn}>
                        导出
                    </Button>
                </div>
            </JsonForm>
        );
    }, []);

    const fieldList1: FormField[] = useMemo(() => {
        return [
            {
                type: 'checkboxGroup',
                name: 'time_type',
                formItemClassName: '',
                options: [
                    {
                        label: '72小时无状态更新',
                        value: 72,
                    },
                ],
                onChange: (name: string, form: FormInstance) => {
                    onSearch();
                },
                formatter: 'join',
            },
        ];
    }, []);

    const columns = useMemo(() => {
        return [
            {
                title: '出入库单号',
                dataIndex: 'referWaybillNo',
                align: 'center',
                width: '150px',
            },
            {
                title: '出入库类型',
                width: '150px',
                align: 'center',
                dataIndex: 'outboundType',
                render: () => {
                    return '退货出库';
                },
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
                    const {
                        productImageUrl,
                        purchasePlatformGoodsName,
                        productSkuStyle,
                        returnNumber = 0,
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
                            <div>{purchasePlatformGoodsName}</div>
                            <div>{skus}</div>
                            <div>数量：x{returnNumber}</div>
                        </div>
                    );
                },
            },
            {
                title: '退货数量',
                dataIndex: 'returnNumber',
                width: '130px',
                align: 'center',
                render: (_, item: IReturnItem) => {
                    const { returnNumber = 0, realReturnNumber = 0 } = item;
                    return `${realReturnNumber}/${returnNumber}`;
                },
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
            {
                title: '运单号',
                dataIndex: 'waybillNo',
                width: '223px',
                align: 'center',
                render: (_, item: IReturnItem) => {
                    const { purchaseReturnStatus } = item;
                    return (
                        <div>
                            {_}
                            {purchaseReturnStatus === '6' ? <div>已签收</div> : null}
                        </div>
                    );
                },
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

export default Over;

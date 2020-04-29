import React, { useCallback, useMemo, useRef } from 'react';
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
import { queryPurchaseList } from '@/services/purchase';
import { IPurchaseItem } from '@/interface/IPurchase';
import PurchaseDetailModal from '@/pages/purchase/components/list/purchaseDetailModal';
import styles from '@/pages/purchase/_list.less';

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
        name: 'order',
    },
    {
        label: '商品名称',
        type: 'input',
        name: 'purchase_goods_name',
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
                title: '采购单状态',
                width: '100px',
                dataIndex: 'purchaseOrderStatus',
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
                title: '商品信息',
                dataIndex: 'product_info',
                width: '178px',
                align: 'center',
                render: (_, item) => {
                    const { productImageUrl, purchaseProductName, productSkuStyle } = item;
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
                    const children = (
                        <div>
                            <AutoEnLargeImg src={productImageUrl} className={styles.image} />
                            {purchaseProductName}
                            {skus}
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
                title: '供应商',
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
                dataIndex: 'purchaseTrackingNumber',
                width: '182px',
                align: 'center',
            },
            {
                title: '出入库单号',
                dataIndex: 'referWaybillNo',
                width: '223px',
                align: 'center',
            },
            {
                title: '出入库类型',
                dataIndex: 'type',
                width: '223px',
                align: 'center',
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
        // 处理合并单元格
        const dataSet = colSpanDataSource(dataSource);
        return (
            <FitTable
                rowKey="task_id"
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
                {/*{<ConnectModal visible="1111" onCancel={() => {}} />}*/}
                {/*<ReturnModal visible="111" onCancel={() => {}} />*/}
                <PurchaseDetailModal visible={visible} onCancel={onClose} />
            </>
        );
    }, [loading, visible]);
};

export default AllList;

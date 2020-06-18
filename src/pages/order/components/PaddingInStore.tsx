import React, { ReactText, useCallback, useMemo, useRef, useState } from 'react';
import { JsonFormRef } from 'react-components/es/JsonForm';
import { purchaseOrderOptionList, purchaseReserveOptionList } from '@/enums/OrderEnum';
import {
    exportPendingSignList,
    getOrderGoodsDetail,
    getPayOrderList,
    getPurchasedNotWarehouseList,
    getWaitShipList,
    postExportPurchasedNotWarehouse,
    putConfirmPay,
} from '@/services/order-manage';
import {
    AutoEnLargeImg,
    FitTable,
    JsonForm,
    LoadingButton,
    PopConfirmLoadingButton,
    useList,
    useModal2,
} from 'react-components';
import { Button } from 'antd';
import formStyles from 'react-components/es/JsonForm/_form.less';
import Export from '@/components/Export';
import CancelOrder from '@/pages/order/components/CancelOrder';
import { utcToLocal } from 'react-components/es/utils/date';
import {
    CombineRowItem,
    IFlatOrderItem,
    IOrderGood,
    IOrderItem,
    IPurchasePlan,
    PayOrderPurchase,
} from '@/interface/IOrder';
import { ColumnType } from 'antd/es/table';
import { getStatusDesc } from '@/utils/transform';
import { useCancelPurchase, useSplitSelectKeys } from '@/pages/order/components/hooks';
import { FormInstance } from 'antd/es/form';
import { filterFieldsList, combineRows } from './utils';
import { EmptyObject } from 'react-components/es/utils';
import TrackDialog from '@/pages/order/components/TrackDialog';

const configFields = [
    'product_shop1',
    'reserve_status',
    'order_goods_id',
    'commodity_id',
    'purchase_platform_order_id',
    'purchase_waybill_no',
    'order_create_time',
    'pay_time',
    'purchase_time',
];

const fieldsList = filterFieldsList(configFields);

declare interface PendingInStoreProps {
    updateCount: () => void;
}

const PendingInStore = ({ updateCount }: PendingInStoreProps) => {
    const formRef = useRef<JsonFormRef>(null);
    const formRef1 = useRef<JsonFormRef>(null);
    const [update, setUpdate] = useState(0);

    const {
        loading,
        pageNumber,
        pageSize,
        total,
        dataSource,
        selectedRowKeys,
        setSelectedRowKeys,
        onReload,
        onSearch,
        onChange,
    } = useList<IOrderItem>({
        formRef: [formRef, formRef1],
        queryList: getPurchasedNotWarehouseList, // 获取订单列表
    });

    const selectedKeys = useSplitSelectKeys(selectedRowKeys);

    const startUpdate = useCallback(() => {
        setUpdate(update => update + 1);
    }, []);

    const [exportModal, showExportModal, closeExportModal] = useModal2<boolean>();
    const [trackModal, showTrackModal, closeTRackModal] = useModal2<IFlatOrderItem | undefined>();

    const openOrderGoodsDetailUrl = useCallback((productId: string) => {
        return getOrderGoodsDetail(productId).then(res => {
            const { worm_goodsinfo_link } = res.data;
            window.open(worm_goodsinfo_link);
        });
    }, []);

    const columns = useMemo<ColumnType<IFlatOrderItem & CombineRowItem>[]>(() => {
        return [
            {
                key: 'operation',
                title: '操作',
                dataIndex: 'operation',
                align: 'center',
                width: 150,
                fixed: 'left',
                render: (value: string, item) => {
                    return (
                        <>
                            <PopConfirmLoadingButton
                                popConfirmProps={{
                                    title: '确定要取消该采购订单吗？',
                                    onConfirm: () => cancelSingle([item.orderGoodsId!]),
                                }}
                                buttonProps={{
                                    type: 'link',
                                    children: '取消采购订单',
                                }}
                            />
                            <CancelOrder
                                key={'2'}
                                orderGoodsIds={[item.orderGoodsId!]}
                                onReload={onSearch}
                                getAllTabCount={updateCount}
                            >
                                <Button type="link">取消销售订单</Button>
                            </CancelOrder>
                            <Button type="link" onClick={() => showTrackModal(item)}>
                                查看物流轨迹
                            </Button>
                        </>
                    );
                },
            },
            {
                key: 'orderCreateTime',
                title: '订单生成时间',
                dataIndex: 'orderCreateTime',
                align: 'center',
                width: 150,
                render: (value: string, item) => utcToLocal(item.createTime, ''),
            },
            {
                key: 'orderGoodsId',
                title: '子订单ID',
                dataIndex: 'orderGoodsId',
                align: 'center',
                width: 150,
            },
            {
                key: 'commodityId',
                title: 'Commodity ID',
                dataIndex: 'commodityId',
                align: 'center',
                width: 150,
            },
            {
                key: 'productName',
                title: '商品名称',
                dataIndex: 'productName',
                align: 'center',
                width: 150,
                render: (value, item) => (
                    <a onClick={() => openOrderGoodsDetailUrl(item.productId!)}>{value}</a>
                ),
            },
            {
                key: 'productImageUrl',
                title: 'SKU图片',
                dataIndex: 'productImageUrl',
                align: 'center',
                width: 150,
                render: (value: string) => {
                    return <AutoEnLargeImg src={value} className="order-img-lazy" />;
                },
            },
            {
                key: 'productSkuStyle',
                title: '商品规格',
                dataIndex: 'productSkuStyle',
                align: 'center',
                width: 150,
                render: (value: string) => {
                    let child: any = null;
                    if (value) {
                        try {
                            const styleInfo = JSON.parse(value);
                            child = (
                                <>
                                    {Object.keys(styleInfo).map(key => (
                                        <div key={key}>{`${key}: ${styleInfo[key]}`}</div>
                                    ))}
                                </>
                            );
                        } catch (err) {}
                    }
                    return child;
                },
            },
            {
                key: 'purchaseOrderGoodsId',
                title: '供应商订单ID',
                dataIndex: 'purchaseOrderGoodsId',
                align: 'center',
                width: 150,
                render: (value, item) => item.purchasePlatformOrderId,
            },
            {
                key: 'payTime',
                title: '支付时间',
                dataIndex: 'payTime',
                align: 'center',
                width: 150,
                render: (value: string) => utcToLocal(value, ''),
            },
            {
                key: 'productShop',
                title: '销售店铺名称',
                dataIndex: 'productShop',
                align: 'center',
                width: 150,
            },
            {
                key: 'purchaseWaybillNo',
                title: '采购运单ID',
                dataIndex: 'purchaseWaybillNo',
                align: 'center',
                width: 150,
            },
            {
                key: 'collectTime',
                title: '采购签收时间',
                dataIndex: 'collectTime',
                align: 'center',
                width: 150,
                render: (value: string) => utcToLocal(value, ''),
            },
            {
                key: 'purchaseOrderStatus',
                title: '采购计划状态',
                dataIndex: 'purchaseOrderStatus',
                align: 'center',
                width: 150,
                render: (value: number, row) => {
                    const { reserveStatus } = row;
                    if (reserveStatus === 3 && value === 1) {
                        return '无需拍单'; // feature_4170
                    }
                    return getStatusDesc(purchaseOrderOptionList, value);
                },
            },
            {
                key: 'reserveStatus',
                title: '仓库库存预定状态',
                dataIndex: 'reserveStatus',
                align: 'center',
                width: 150,
                render: (value: number) => getStatusDesc(purchaseReserveOptionList, value),
            },
        ];
    }, [dataSource]);

    const formComponent = useMemo(() => {
        return (
            <JsonForm ref={formRef} fieldList={fieldsList} labelClassName="order-label">
                <div>
                    <LoadingButton type="primary" className={formStyles.formBtn} onClick={onSearch}>
                        查询
                    </LoadingButton>
                    <LoadingButton className={formStyles.formBtn} onClick={onReload}>
                        刷新
                    </LoadingButton>
                    <Button
                        disabled={total <= 0}
                        className={formStyles.formBtn}
                        onClick={() => showExportModal(true)}
                    >
                        导出
                    </Button>
                </div>
            </JsonForm>
        );
    }, [loading]);

    const formComponent1 = useMemo(() => {
        return (
            <JsonForm
                ref={formRef1}
                fieldList={[
                    {
                        type: 'checkboxGroup',
                        name: 'regenerate',
                        options: [
                            {
                                label: '展示已重新生成',
                                value: true,
                            },
                        ],
                        onChange: (name: string, form: FormInstance) => {
                            startUpdate();
                        },
                        formatter: 'join',
                    },
                    {
                        type: 'checkboxGroup',
                        name: 'more_shipping_time',
                        options: [
                            {
                                label: '72小时无状态更新',
                                value: 72,
                            },
                        ],
                        onChange: (name: string, form: FormInstance) => {
                            onSearch();
                        },
                        formatter: 'firstNumber',
                    },
                ]}
                labelClassName="order-label"
            />
        );
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

    // filter  + flat list
    const flatList = useMemo(() => {
        const flatOrderList: (IFlatOrderItem & CombineRowItem)[] = [];
        const { regenerate } = formRef1.current
            ? formRef1.current.getFieldsValue()
            : { regenerate: false };
        dataSource.forEach(order => {
            const {
                orderGoods,
                unpaidPurchaseOrderGoodsResult,
                orderInfo,
                orderGods,
                ...extra
            } = order;
            // purchasePlan 可能在orderGoods下，可能在unpaidPurchaseOrderGoodsResult中
            const { orderGoodsPurchasePlan = [], ...others } =
                (orderGoods as IOrderGood) || EmptyObject;
            const planList: Array<PayOrderPurchase | IPurchasePlan> =
                unpaidPurchaseOrderGoodsResult || orderGoodsPurchasePlan;
            const purchaseList = regenerate
                ? planList
                : planList.filter(plan => {
                      return plan.purchaseOrderStatus !== 6;
                  }); // 子订单级别
            if (purchaseList.length) {
                purchaseList.forEach((plan, index) => {
                    const childOrderItem = {
                        ...extra,
                        ...orderInfo,
                        ...orderGods,
                        ...others,
                        ...plan,
                        __rowspan: 1,
                        __key: plan.orderGoodsId,
                        // __rowspan: index === 0 ? purchaseList.length : 0,
                        // __key: purchaseList.map(item => item.orderGoodsId).join(','),
                    };
                    flatOrderList.push(childOrderItem);
                });
            } else {
                flatOrderList.push({
                    ...extra,
                    ...orderInfo,
                    ...orderGods,
                    ...others,
                    __rowspan: 1,
                    __key: extra.orderGoodsId,
                });
            }
        });
        return regenerate
            ? flatOrderList
            : flatOrderList.filter(item => {
                  return item.purchaseOrderStatus !== 6; // 采购单级别
              });
    }, [dataSource, update]);

    const { cancelSingle, cancelList } = useCancelPurchase(selectedKeys, onReload, updateCount);

    const toolBarRender = useCallback(() => {
        const disabled = selectedKeys.length === 0;
        return [
            <LoadingButton
                key="purchase_order"
                type="primary"
                className={formStyles.formBtn}
                disabled={disabled}
                onClick={cancelList}
            >
                取消采购订单
            </LoadingButton>,
            <CancelOrder
                key="2"
                orderGoodsIds={selectedKeys}
                onReload={onReload}
                getAllTabCount={updateCount}
            >
                <Button
                    key="channel_order"
                    type="primary"
                    className={formStyles.formBtn}
                    disabled={disabled}
                >
                    取消销售订单
                </Button>
            </CancelOrder>,
        ];
    }, [selectedKeys]);

    const rowSelection = useMemo(() => {
        return {
            fixed: true,
            columnWidth: '50px',
            selectedRowKeys: selectedRowKeys,
            onChange: (selectedKeys: ReactText[]) => {
                setSelectedRowKeys(selectedKeys as string[]);
            },
            renderCell: (
                checked: boolean,
                record: IFlatOrderItem & CombineRowItem,
                index: number,
                originNode: React.ReactNode,
            ) => {
                return {
                    children: originNode,
                    props: {
                        rowSpan: record.__rowspan,
                    },
                };
            },
        };
    }, [selectedRowKeys]);

    const onExport = useCallback((data: any) => {
        return postExportPurchasedNotWarehouse({
            ...data,
            ...formRef.current!.getFieldsValue(),
            ...formRef1.current!.getFieldsValue(),
        }).request();
    }, []);

    return useMemo(() => {
        return (
            <div>
                {formComponent}
                {formComponent1}
                <FitTable
                    bordered={true}
                    rowKey={'__key'}
                    loading={loading}
                    columns={columns}
                    dataSource={flatList}
                    scroll={{ x: true, scrollToFirstRowOnChange: true }}
                    columnsSettingRender={true}
                    pagination={pagination}
                    onChange={onChange}
                    toolBarRender={toolBarRender}
                    rowSelection={rowSelection}
                />
                <Export
                    columns={columns as any}
                    visible={exportModal}
                    onOKey={onExport}
                    onCancel={closeExportModal}
                />
                <TrackDialog
                    visible={!!trackModal}
                    orderGoodsId={trackModal ? trackModal.orderGoodsId || '' : ''}
                    lastWaybillNo={trackModal ? trackModal.lastWaybillNo || '' : ''}
                    hideTrackDetail={closeTRackModal}
                />
            </div>
        );
    }, [update, flatList, loading, selectedRowKeys, trackModal, exportModal]);
};

export default PendingInStore;
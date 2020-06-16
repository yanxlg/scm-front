import React, { ReactText, useCallback, useMemo, useRef, useState } from 'react';
import { FormField, JsonFormRef } from 'react-components/es/JsonForm';
import {
    defaultOptionItem,
    defaultOptionItem1,
    purchaseOrderOptionList,
    purchaseReserveOptionList,
} from '@/enums/OrderEnum';
import {
    exportPendingSignList,
    getOrderGoodsDetail,
    getPayOrderList,
    putConfirmPay,
    queryPendingSignList,
    queryShopList,
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
    IOrderItem,
    IPurchasePlan,
    IWaitPayOrderItem,
    PayOrderPurchase,
} from '@/interface/IOrder';
import { ColumnType } from 'antd/es/table';
import { getStatusDesc } from '@/utils/transform';
import { useCancelPurchase } from '@/pages/order/components/hooks';
import { FormInstance } from 'antd/es/form';
import { filterFieldsList, combineRows } from './utils';
import { EmptyObject } from 'react-components/es/utils';
import QRCode from 'qrcode.react';

const configFields = [
    'product_shop',
    'reserve_status',
    'order_goods_id',
    'commodity_id',
    'purchase_platform_order_id',
    'purchase_parent_order_sn',
    'purchase_order_time',
];

const fieldsList = filterFieldsList(configFields);

declare interface PendingPayProps {
    updateCount: () => void;
}

const PendingPay = ({ updateCount }: PendingPayProps) => {
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
        queryList: getPayOrderList, // 获取订单列表
    });

    const startUpdate = useCallback(() => {
        setUpdate(update => update + 1);
    }, []);

    const [exportModal, showExportModal, closeExportModal] = useModal2<boolean>();

    const openOrderGoodsDetailUrl = useCallback((productId: string) => {
        return getOrderGoodsDetail(productId).then(res => {
            const { worm_goodsinfo_link } = res.data;
            window.open(worm_goodsinfo_link);
        });
    }, []);

    const confirmPay = useCallback(
        (id: string) => {
            const planIdList = dataSource
                .filter(item => item.purchase_parent_order_sn === id)
                .map(item => item.purchase_plan_id);
            putConfirmPay({
                purchase_platform_parent_order_id: id,
                purchase_plan_id: planIdList,
            }).then(() => {
                // console.log('putConfirmPay', res);
                onSearch();
            });
        },
        [dataSource],
    );

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
                                    onConfirm: () => cancelSingle([item.orderGoodsId]),
                                }}
                                buttonProps={{
                                    type: 'link',
                                    children: '取消采购订单',
                                }}
                            />
                            <CancelOrder
                                key={'2'}
                                orderGoodsIds={[item.orderGoodsId]}
                                onReload={onSearch}
                                getAllTabCount={updateCount}
                            >
                                <Button type="link">取消销售订单</Button>
                            </CancelOrder>
                        </>
                    );
                },
            },
            {
                key: 'purchaseOrderTime',
                title: '采购订单生成时间',
                dataIndex: 'purchaseOrderTime',
                align: 'center',
                width: 150,
                render: (value: string, item) => combineRows(item, utcToLocal(value, '')),
            },
            {
                key: 'purchaseParentOrderSn',
                title: '供应商父订单ID',
                dataIndex: 'purchaseParentOrderSn',
                align: 'center',
                width: 150,
                render: (value: string, item) => combineRows(item, value),
            },
            {
                key: 'purchasePayUrl',
                title: '支付二维码',
                dataIndex: 'purchasePayUrl',
                align: 'center',
                width: 140,
                render: (value: string = '', item) => {
                    const { purchaseParentOrderSn, purchasePayStatusDesc } = item;
                    return combineRows(
                        item,
                        purchasePayStatusDesc !== '已支付' ? (
                            <div>
                                <AutoEnLargeImg
                                    enlargeContent={
                                        <QRCode
                                            value={value}
                                            size={300}
                                            className="order-qr-enlarge"
                                        />
                                    }
                                >
                                    <QRCode value={value} size={40} className="order-qr-small" />
                                </AutoEnLargeImg>
                                <div>
                                    <Button
                                        ghost={true}
                                        size="small"
                                        type="primary"
                                        style={{ marginTop: 6 }}
                                        onClick={() => confirmPay(purchaseParentOrderSn)}
                                    >
                                        确认支付
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            purchasePayStatusDesc
                        ),
                    );
                },
            },
            {
                key: 'purchase_total_amount',
                title: '采购总金额($)',
                dataIndex: 'purchase_total_amount',
                align: 'center',
                width: 150,
                render: (value: string, item) => combineRows(item, value),
            },
            {
                key: 'parent_purchase_pay_status_desc',
                title: '订单生成时间',
                dataIndex: 'parent_purchase_pay_status_desc',
                align: 'center',
                width: 120,
            },
            {
                key: 'purchase_order_sn',
                title: '子订单ID',
                dataIndex: 'purchase_order_sn',
                align: 'center',
                width: 140,
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
                    <a onClick={() => openOrderGoodsDetailUrl(item.productId)}>{value}</a>
                ),
            },
            {
                key: 'purchaseOrderGoodsId',
                title: '供应商订单ID',
                dataIndex: 'purchaseOrderGoodsId',
                align: 'center',
                width: 150,
            },
            {
                key: 'purchaseOrderGoodsId',
                title: '销售商品数量',
                dataIndex: 'purchaseOrderGoodsId',
                align: 'center',
                width: 150,
            },
            {
                key: 'purchaseOrderGoodsId',
                title: '销售商品运费($)',
                dataIndex: 'purchaseOrderGoodsId',
                align: 'center',
                width: 150,
            },
            {
                key: 'purchaseOrderGoodsId',
                title: '销售商品总金额($)',
                dataIndex: 'purchaseOrderGoodsId',
                align: 'center',
                width: 150,
            },
            {
                key: 'purchaseOrderGoodsId',
                title: '采购商品数量',
                dataIndex: 'purchaseOrderGoodsId',
                align: 'center',
                width: 150,
            },
            {
                key: 'purchaseOrderGoodsId',
                title: '采购商品总金额(￥)',
                dataIndex: 'purchaseOrderGoodsId',
                align: 'center',
                width: 150,
            },
            {
                key: 'productShop',
                title: '销售店铺名称',
                dataIndex: 'productShop',
                align: 'center',
                width: 150,
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
    }, []);

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
    }, []);

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
                        name: 'showRecreated',
                        options: [
                            {
                                label: '72小时无状态更新',
                                value: true,
                            },
                        ],
                        onChange: (name: string, form: FormInstance) => {
                            onSearch();
                        },
                        formatter: 'join',
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
            const { orderGoodsPurchasePlan = [], ...others } = orderGoods || EmptyObject;
            const planList: Array<PayOrderPurchase | IPurchasePlan> =
                unpaidPurchaseOrderGoodsResult || orderGoodsPurchasePlan;
            const purchaseList = regenerate
                ? planList
                : planList.filter(plan => {
                      return plan.purchaseOrderStatus !== 6;
                  });
            if (purchaseList.length) {
                purchaseList.forEach((plan, index) => {
                    const childOrderItem = {
                        ...extra,
                        ...orderInfo,
                        ...orderGods,
                        ...others,
                        ...plan,
                        __rowspan: index === 0 ? purchaseList.length : 0,
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
                });
            }
        });
        return flatOrderList;
    }, [dataSource]);

    const { cancelSingle, cancelList } = useCancelPurchase(selectedRowKeys, onSearch, updateCount);

    const toolBarRender = useCallback(() => {
        const disabled = selectedRowKeys.length === 0;
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
                orderGoodsIds={selectedRowKeys}
                onReload={onSearch}
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
    }, [selectedRowKeys]);

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
        return exportPendingSignList({
            ...data,
            ...formRef.current!.getFieldsValue(),
        }).request();
    }, []);

    return useMemo(() => {
        return (
            <div>
                {formComponent}
                {formComponent1}
                <FitTable
                    bordered={true}
                    rowKey={'orderGoodsId'}
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
            </div>
        );
    }, [update, flatList, loading, selectedRowKeys]);
};

export default PendingPay;

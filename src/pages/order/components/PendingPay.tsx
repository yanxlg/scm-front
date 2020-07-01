import React, { ReactText, useCallback, useMemo, useRef, useState } from 'react';
import { JsonFormRef } from 'react-components/es/JsonForm';
import { purchaseOrderOptionList, purchaseReserveOptionList } from '@/enums/OrderEnum';
import {
    getOrderGoodsDetail,
    getPayOrderList,
    postExportPay,
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
import QRCode from 'qrcode.react';

const configFields = [
    'product_shop1',
    'reserve_status',
    'order_goods_id',
    'commodity_id',
    'purchase_platform_order_id',
    'purchase_parent_order_sn',
    'order_create_time',
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
    const dataSourceRef = useRef<IOrderItem[]>(dataSource);
    useMemo(() => {
        dataSourceRef.current = dataSource;
    }, [dataSource]);

    const selectedKeys = useSplitSelectKeys(selectedRowKeys);

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

    const confirmPay = useCallback((id: string) => {
        const planList =
            dataSourceRef.current.find(item => item.purchaseParentOrderSn === id)
                ?.unpaidPurchaseOrderGoodsResult ?? [];
        const planIdList = planList.map(item => item.purchasePlanId!);
        return putConfirmPay({
            purchase_platform_parent_order_id: id,
            purchase_plan_id: Array.from(new Set(planIdList)),
        }).then(() => {
            onReload();
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
                    return combineRows(
                        item,
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
                                onReload={onReload}
                                getAllTabCount={updateCount}
                            >
                                <Button type="link">取消销售订单</Button>
                            </CancelOrder>
                        </>,
                    );
                },
            },
            {
                key: 'purchaseOrderTime',
                title: '采购计划生成时间',
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
                                    <LoadingButton
                                        ghost={true}
                                        size="small"
                                        type="primary"
                                        style={{ marginTop: 6 }}
                                        onClick={() => confirmPay(purchaseParentOrderSn!)}
                                    >
                                        确认支付
                                    </LoadingButton>
                                </div>
                            </div>
                        ) : (
                            purchasePayStatusDesc
                        ),
                    );
                },
            },
            {
                key: 'purchaseTotalAmount',
                title: '采购总金额($)',
                dataIndex: 'purchaseTotalAmount',
                align: 'center',
                width: 150,
                render: (value: string, item) => combineRows(item, value),
            },
            {
                key: 'orderCreateTime',
                title: '订单生成时间',
                dataIndex: 'orderCreateTime',
                align: 'center',
                width: 120,
            },
            {
                key: 'orderGoodsId',
                title: '子订单ID',
                dataIndex: 'orderGoodsId',
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
                    <div className="order-text-ellipsis">
                        <a onClick={() => openOrderGoodsDetailUrl(item.productId!)}>{value}</a>
                    </div>
                ),
            },
            {
                key: 'purchaseOrderSn',
                title: '供应商订单ID',
                dataIndex: 'purchaseOrderSn',
                align: 'center',
                width: 150,
            },
            {
                key: 'saleGoodsNumber',
                title: '销售商品数量',
                dataIndex: 'saleGoodsNumber',
                align: 'center',
                width: 150,
            },
            {
                key: 'freight',
                title: '销售商品运费($)',
                dataIndex: 'freight',
                align: 'center',
                width: 150,
            },
            {
                key: 'saleGoodsAmount',
                title: '销售商品总金额($)',
                dataIndex: 'saleGoodsAmount',
                align: 'center',
                width: 180,
            },
            {
                key: 'purchaseGoodsNumber',
                title: '采购商品数量',
                dataIndex: 'purchaseGoodsNumber',
                align: 'center',
                width: 150,
            },
            {
                key: 'purchaseGoodsAmount',
                title: '采购商品总金额(￥)',
                dataIndex: 'purchaseGoodsAmount',
                align: 'center',
                width: 180,
            },
            {
                key: 'productShop',
                title: '销售店铺名称',
                dataIndex: 'productShop',
                align: 'center',
                width: 150,
            },
            {
                key: 'purchasePlanStatus',
                title: '采购计划状态',
                dataIndex: 'purchasePlanStatus',
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
                        __rowspan: index === 0 ? purchaseList.length : 0,
                        __key: purchaseList.map(item => item.orderGoodsId).join(','),
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
                    __key: extra.orderGoodsId || others.orderGoodsId,
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
        return postExportPay({
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
            </div>
        );
    }, [update, flatList, loading, selectedRowKeys, exportModal]);
};

export default PendingPay;

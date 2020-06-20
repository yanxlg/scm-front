import React, { useMemo, useRef, useCallback, useState, useEffect } from 'react';
import { Button, notification } from 'antd';
import {
    JsonForm,
    LoadingButton,
    FitTable,
    useModal,
    AutoEnLargeImg,
    PopConfirmLoadingButton,
} from 'react-components';
import { JsonFormRef, FormField } from 'react-components/es/JsonForm';
import {
    defaultOptionItem,
    channelOptionList,
    defaultOptionItem1,
    purchaseReserveOptionList,
} from '@/enums/OrderEnum';
import { IWaitShipSearch, IWaitShipOrderItem, IPendingOrderItem } from '@/interface/IOrder';
import {
    getWaitShipList,
    delPurchaseOrders,
    delChannelOrders,
    postExportWaitShip,
    queryChannelSource,
    getPlatformAndStore,
    queryShopList,
} from '@/services/order-manage';
import { utcToLocal } from 'react-components/es/utils/date';
import { getStatusDesc } from '@/utils/transform';
import {
    purchaseOrderOptionList,
    purchaseShippingOptionList,
    orderStatusOptionList,
} from '@/enums/OrderEnum';
import { TableProps } from 'antd/es/table';

import formStyles from 'react-components/es/JsonForm/_form.less';
import Export from '@/components/Export';
import CancelOrder from './CancelOrder';
import styles from '@/pages/order/components/_pending.less';
import { FormInstance } from 'antd/es/form';

declare interface IProps {
    getAllTabCount(): void;
}

const formFields: FormField[] = [
    {
        type: 'select',
        name: 'product_shop',
        label: '销售店铺名称',
        className: 'order-input',
        syncDefaultOption: defaultOptionItem1,
        optionList: () =>
            queryShopList().then(({ data = [] }) => {
                return data.map((item: any) => {
                    const { merchant_name } = item;
                    return {
                        name: merchant_name,
                        value: merchant_name,
                    };
                });
            }),
    },
    {
        type: 'select',
        name: 'reserve_status',
        label: '仓库库存预定状态',
        className: 'order-input',
        optionList: [defaultOptionItem, ...purchaseReserveOptionList],
    },
    {
        type: 'textarea',
        name: 'order_goods_id',
        label: '子订单ID',
        className: 'order-input',
        placeholder: '请输入',
        formatter: 'multipleToArray',
    },
    {
        type: 'textarea',
        name: 'commodity_id',
        label: 'Commodity ID',
        className: 'order-input',
        placeholder: '请输入',
        formatter: 'multipleToArray',
    },
    {
        type: 'textarea',
        name: 'purchase_platform_order_id',
        label: '供应商订单ID',
        className: 'order-input',
        placeholder: '请输入',
        formatter: 'multipleToArray',
    },
    {
        type: 'dateRanger',
        name: ['order_create_time_start', 'order_create_time_end'],
        label: '订单生成时间',
        className: 'order-date-picker',
        // placeholder: '请选择订单时间',
        formatter: ['start_date', 'end_date'],
    },
    {
        type: 'dateRanger',
        name: ['pay_time_start', 'pay_time_end'],
        label: '支付时间',
        className: 'order-date-picker',
        // formItemClassName: 'order-form-item',
        formatter: ['start_date', 'end_date'],
    },
];

const defaultInitialValues = {
    channel_source: '',
    order_goods_status: 100,
    purchase_order_status: 100,
};

const PaneWarehouseNotShip: React.FC<IProps> = ({ getAllTabCount }) => {
    const searchRef = useRef<JsonFormRef>(null);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(50);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    const [orderList, setOrderList] = useState<IWaitShipOrderItem[]>([]);
    const orderListRef = useRef<IWaitShipOrderItem[]>([]);
    const searchRef2 = useRef<JsonFormRef>(null);
    const cacheList = useRef<any[]>([]);

    let currentSearchParams: IWaitShipSearch | null = null;

    const onSearch = useCallback(
        (paginationParams = { page, page_count: pageSize }) => {
            const params: IWaitShipSearch = Object.assign(
                {
                    page,
                    page_count: pageSize,
                },
                paginationParams,
                searchRef.current?.getFieldsValue(),
            );
            setLoading(true);
            return getWaitShipList(params)
                .then(res => {
                    currentSearchParams = params;
                    const { all_count: total, list } = res.data;
                    // const { page, page_count } = params;
                    setSelectedRowKeys([]);
                    if (list) {
                        setPage(params.page as number);
                        setPageSize(params.page_count as number);
                        setTotal(total);
                        _setOrderList(handleOrderList(list));
                    }
                })
                .finally(() => {
                    setLoading(false);
                });
        },
        [page, pageSize],
    );

    const handleOrderList = useCallback(list => {
        cacheList.current = list;
        const { showRecreated } = searchRef2.current?.getFieldsValue() ?? {};
        return list
            .filter((item: any) => {
                if (!showRecreated) {
                    return item.purchaseOrderStatus !== 6;
                } else {
                    return true;
                }
            })
            .map((current: any) => {
                const {
                    platformOrderTime,
                    purchasePlatformOrderId,
                    purchaseAmount,
                    purchaseOrderStatus,
                    purchaseOrderShippingStatus,
                    purchasePlanId,
                    orderGoodsId,
                    productId,
                    orderGoods,
                    orderInfo,
                    productImageUrl,
                    productName,
                    productPddMerchantName,
                    payTime,
                    productSkuStyle,
                    reserveStatus,
                } = current;
                const { orderGoodsStatus, createTime: orderCreateTime, commodityId } = orderGoods;
                const { channelSource } = orderInfo;
                return {
                    platformOrderTime,
                    purchasePlatformOrderId,
                    purchaseAmount,
                    orderGoodsStatus,
                    purchaseOrderStatus,
                    purchaseOrderShippingStatus,
                    purchasePlanId,
                    orderGoodsId,
                    orderCreateTime,
                    productId,
                    // purchasewaybillNo,
                    channelSource,
                    productImageUrl,
                    productName,
                    productPddMerchantName,
                    payTime,
                    productSkuStyle,
                    reserveStatus,
                    commodityId,
                } as IWaitShipOrderItem;
            });
    }, []);

    const _setOrderList = useCallback(list => {
        orderListRef.current = list;
        setOrderList(list);
    }, []);

    const handleClickSearch = useCallback(() => {
        return onSearch({ page: 1 });
    }, []);

    const onChange = useCallback(({ current, pageSize }) => {
        onSearch({
            page_count: pageSize,
            page: current,
        });
    }, []);

    const batchOperateSuccess = useCallback((name: string = '', list: string[]) => {
        getAllTabCount();
        notification.success({
            message: `${name}成功`,
            description: (
                <div>
                    {list.map((item: string) => (
                        <div key={item}>{item}</div>
                    ))}
                </div>
            ),
        });
    }, []);

    const batchOperateFail = useCallback(
        (name: string = '', list: { order_goods_id: string; result: string }[]) => {
            notification.error({
                message: `${name}失败`,
                description: (
                    <div>
                        {list.map((item: any) => (
                            <div>
                                {item.order_goods_id}: {item.result.slice(0, 50)}
                            </div>
                        ))}
                    </div>
                ),
            });
        },
        [],
    );

    const _cancelPurchaseOrder = useCallback(
        (orderGoodsIds?: string[]) => {
            return delPurchaseOrders({
                order_goods_ids: orderGoodsIds || (selectedRowKeys as string[]),
            }).then(res => {
                onSearch();
                const { success, failed } = res.data;
                if (success!.length) {
                    batchOperateSuccess('取消采购单', success);
                }
                if (failed!.length) {
                    batchOperateFail('取消采购单', failed);
                }
            });
        },
        [selectedRowKeys],
    );

    const _postExportWaitShip = useCallback((values: any) => {
        return postExportWaitShip({
            ...currentSearchParams,
            ...values,
        });
    }, []);

    const search = useMemo(() => {
        return (
            <JsonForm
                ref={searchRef}
                fieldList={formFields}
                labelClassName="order-label"
                initialValues={defaultInitialValues}
            >
                <div>
                    <LoadingButton
                        type="primary"
                        className={formStyles.formBtn}
                        onClick={handleClickSearch}
                    >
                        查询
                    </LoadingButton>
                    <LoadingButton className={formStyles.formBtn} onClick={() => onSearch()}>
                        刷新
                    </LoadingButton>
                    <Button
                        disabled={total <= 0}
                        className={formStyles.formBtn}
                        onClick={() => setVisibleProps(true)}
                    >
                        导出
                    </Button>
                </div>
            </JsonForm>
        );
    }, [loading]);

    const columns = useMemo<TableProps<IWaitShipOrderItem>['columns']>(() => {
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
                                    onConfirm: () => _cancelPurchaseOrder([item.orderGoodsId]),
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
                                getAllTabCount={getAllTabCount}
                            >
                                <Button type="link">取消销售订单</Button>
                            </CancelOrder>
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
                render: (value: string) => utcToLocal(value, ''),
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
                width: 180,
            },
            {
                key: 'productImageUrl',
                title: 'SKU 图片',
                dataIndex: 'productImageUrl',
                align: 'center',
                width: 150,
                render: value => {
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
                key: 'purchasePlatformOrderId',
                title: '供应商订单ID',
                dataIndex: 'purchasePlatformOrderId',
                align: 'center',
                width: 150,
            },
            {
                key: 'payTime',
                title: '支付时间',
                dataIndex: 'payTime',
                align: 'center',
                width: 120,
                render: (value: string) => utcToLocal(value, ''),
            },
            {
                key: 'productPddMerchantName',
                title: '销售店铺名称',
                dataIndex: 'productPddMerchantName',
                align: 'center',
                width: 120,
            },
            {
                key: 'purchaseOrderStatus',
                title: '采购计划状态',
                dataIndex: 'purchaseOrderStatus',
                align: 'center',
                width: 120,
                render: (value: number) => getStatusDesc(purchaseOrderOptionList, value),
            },
            {
                key: 'reserveStatus',
                title: '仓库库存预定状态',
                dataIndex: 'reserveStatus',
                align: 'center',
                width: 160,
                render: (value: string, row: IPendingOrderItem) => {
                    return getStatusDesc(purchaseReserveOptionList, value);
                },
            },
        ];
    }, []);

    const pagination = useMemo(() => {
        return {
            total: total,
            current: page,
            pageSize: pageSize,
            showSizeChanger: true,
            position: ['topRight', 'bottomRight'],
        } as any;
    }, [loading]);

    const { visible, setVisibleProps, onClose } = useModal<boolean>();

    const toolBarRender = useCallback(() => {
        const disabled = selectedRowKeys.length === 0 ? true : false;
        return [
            <LoadingButton
                key="_order"
                type="primary"
                disabled={disabled}
                className={formStyles.formBtn}
                onClick={_cancelPurchaseOrder as any}
            >
                取消采购订单
            </LoadingButton>,
            <CancelOrder
                key={'2'}
                orderGoodsIds={selectedRowKeys as string[]}
                onReload={onSearch}
                getAllTabCount={getAllTabCount}
            >
                <Button
                    key="channel_order"
                    type="primary"
                    className={formStyles.formBtn}
                    disabled={selectedRowKeys.length === 0}
                >
                    取消销售订单
                </Button>
            </CancelOrder>,
        ];
    }, [selectedRowKeys, _cancelPurchaseOrder, _postExportWaitShip]);

    useEffect(() => {
        onSearch();
    }, []);

    return useMemo(() => {
        return (
            <>
                {search}
                <JsonForm
                    ref={searchRef2}
                    initialValues={{
                        purchase_fail_filter_type: 3,
                    }}
                    fieldList={[
                        {
                            type: 'checkboxGroup',
                            name: 'showRecreated',
                            options: [
                                {
                                    label: '展示已重新生成',
                                    value: true,
                                },
                            ],
                            onChange: (name: string, form: FormInstance) => {
                                _setOrderList(handleOrderList(cacheList.current));
                            },
                            formatter: 'join',
                        },
                        {
                            type: 'checkboxGroup',
                            name: 'showRecreated',
                            options: [
                                {
                                    label: '48小时无状态更新',
                                    value: true,
                                },
                            ],
                            onChange: (name: string, form: FormInstance) => {
                                alert('发请求');
                                // _setOrderList(handleOrderList(cacheList.current));
                            },
                            formatter: 'join',
                        },
                    ]}
                />
                <FitTable
                    bordered={true}
                    rowKey="orderGoodsId"
                    // className="order-table"
                    loading={loading}
                    columns={columns}
                    rowSelection={{
                        fixed: true,
                        columnWidth: 60,
                        selectedRowKeys: selectedRowKeys,
                        onChange: (selectedRowKeys: React.Key[]) =>
                            setSelectedRowKeys(selectedRowKeys),
                    }}
                    dataSource={orderList}
                    scroll={{ x: 'max-content' }}
                    columnsSettingRender={true}
                    pagination={pagination}
                    onChange={onChange}
                    toolBarRender={toolBarRender}
                />
                <Export
                    columns={columns as any}
                    visible={visible}
                    onOKey={_postExportWaitShip}
                    onCancel={onClose}
                />
            </>
        );
    }, [page, pageSize, total, loading, orderList, selectedRowKeys, visible]);
};

export default PaneWarehouseNotShip;

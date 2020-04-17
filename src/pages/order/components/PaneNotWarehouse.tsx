import React, { useMemo, useRef, useCallback, useState, useEffect } from 'react';
import { notification } from 'antd';
import { JsonForm, LoadingButton, FitTable } from 'react-components';
import { JsonFormRef, FormField } from 'react-components/es/JsonForm';
import { defaultOptionItem, channelOptionList } from '@/enums/OrderEnum';
import { INotWarehouseSearch, INotWarehouseOrderItem } from '@/interface/IOrder';
import {
    getPurchasedNotWarehouseList,
    postExportPurchasedNotWarehouse,
    delChannelOrders,
} from '@/services/order-manage';
import { utcToLocal } from 'react-components/es/utils/date';
import { getStatusDesc } from '@/utils/transform';
import {
    purchaseOrderOptionList,
    purchaseShippingOptionList,
    orderStatusOptionList,
    purchasePayOptionList,
} from '@/enums/OrderEnum';
import { TableProps } from 'antd/es/table';

import formStyles from 'react-components/es/JsonForm/_form.less';

declare interface IProps {
    getAllTabCount(): void;
}

const formFields: FormField[] = [
    {
        type: 'input',
        name: 'order_goods_id',
        label: <span>中&nbsp;台&nbsp;订&nbsp;单&nbsp;ID</span>,
        className: 'order-input',
        // formItemClassName: 'form-item',
        placeholder: '请输入中台订单ID',
        // numberStrArr
        // formatter: 'strArr',
    },
    {
        type: 'input',
        name: 'purchase_platform_order_id_list',
        label: '采购平台订单ID',
        className: 'order-input',
        placeholder: '请输入采购平台订单ID',
        formatter: 'strArr',
    },
    {
        type: 'input',
        name: 'product_id',
        label: '中台商品ID',
        className: 'order-input',
        placeholder: '请输入中台商品ID',
        // formatter: 'strArr',
    },
    {
        type: 'input',
        name: 'purchase_waybill_no',
        label: '采购运单号',
        className: 'order-input',
        placeholder: '请输入采购运单号',
        // formatter: 'strArr',
    },
    {
        type: 'select',
        name: 'channel_source',
        label: '销售渠道',
        className: 'order-input',
        optionList: [defaultOptionItem, ...channelOptionList],
    },
    {
        type: 'select',
        name: 'order_goods_status',
        label: '中台订单状态',
        className: 'order-input',
        optionList: [defaultOptionItem, ...orderStatusOptionList],
    },
    {
        type: 'select',
        name: 'purchase_order_status',
        label: '采购订单状态',
        className: 'order-input',
        optionList: [defaultOptionItem, ...purchaseOrderOptionList],
    },
    {
        type: 'dateRanger',
        name: ['platform_order_time_start', 'platform_order_time_end'],
        label: <span>采&nbsp;购&nbsp;时&nbsp;间</span>,
        className: 'order-date-picker',
        placeholder: '请选择订单时间',
        formatter: ['start_date', 'end_date'],
    },
];

const defaultInitialValues = {
    channel_source: 100,
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
    const [orderList, setOrderList] = useState<INotWarehouseOrderItem[]>([]);

    let currentSearchParams: INotWarehouseSearch | null = null;

    const onSearch = useCallback(
        (paginationParams = { page, page_count: pageSize }) => {
            const params: INotWarehouseSearch = Object.assign(
                {
                    page,
                    page_count: pageSize,
                },
                paginationParams,
                searchRef.current?.getFieldsValue(),
            );
            setLoading(true);
            return getPurchasedNotWarehouseList(params)
                .then(res => {
                    currentSearchParams = params;
                    const { all_count: total, list } = res.data;
                    // const { page, page_count } = params;
                    if (list) {
                        setPage(params.page as number);
                        setPageSize(params.page_count as number);
                        setTotal(total);
                        setOrderList(handleOrderList(list));
                    }
                })
                .finally(() => {
                    setLoading(false);
                });
        },
        [page, pageSize],
    );

    const handleOrderList = useCallback(list => {
        return list.map((current: any) => {
            const {
                orderGoodsId,
                purchasePlanId,
                productId,
                purchasePlatform,
                purchaseNumber,
                purchaseOrderStatus,
                purchaseOrderShippingStatus,
                purchaseOrderPayStatus,
                purchasePlatformOrderId,
                purchaseWaybillNo,
                // platformOrderTime,
                payTime,
                platformSendOrderTime,

                orderGoods,
                orderInfo,
            } = current;
            const { confirmTime, channelOrderSn, channelSource } = orderInfo;
            const { orderGoodsStatus, createTime: orderCreateTime } = orderGoods;

            return {
                orderGoodsId,
                purchasePlanId,
                productId,
                purchasePlatform,
                purchaseNumber,
                purchaseOrderStatus,
                purchaseOrderShippingStatus,
                purchaseOrderPayStatus,
                purchasePlatformOrderId,
                purchaseWaybillNo,
                // platformOrderTime,
                payTime,
                platformSendOrderTime,

                confirmTime,
                channelOrderSn,
                channelSource,

                orderGoodsStatus,
                orderCreateTime,
            } as INotWarehouseOrderItem;
        });
    }, []);

    const handleClickSearch = useCallback(() => {
        return onSearch({ page: 1 });
    }, []);

    const onChange = useCallback(({ current, pageSize }) => {
        onSearch({
            pageSize,
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

    const _delChannelOrders = useCallback(() => {
        return delChannelOrders({
            order_goods_ids: selectedRowKeys as string[],
        }).then(res => {
            onSearch();
            const { success, failed } = res.data;

            if (success!.length) {
                batchOperateSuccess('取消渠道订单', success);
            }
            if (failed!.length) {
                batchOperateFail('取消渠道订单', failed);
            }
        });
    }, [selectedRowKeys]);

    const _postExportPurchasedNotWarehouse = useCallback(() => {
        return postExportPurchasedNotWarehouse(
            currentSearchParams
                ? currentSearchParams
                : {
                      page: 1,
                      page_count: 50,
                  },
        );
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
                </div>
            </JsonForm>
        );
    }, []);

    const columns = useMemo<TableProps<INotWarehouseOrderItem>['columns']>(() => {
        return [
            {
                key: 'orderGoodsId',
                title: '中台订单ID',
                dataIndex: 'orderGoodsId',
                align: 'center',
                width: 120,
                hideInSetting: true,
            },
            {
                key: 'orderCreateTime',
                title: '订单时间',
                dataIndex: 'orderCreateTime',
                align: 'center',
                width: 120,
                render: (value: string) => utcToLocal(value, ''),
            },
            {
                key: 'productId',
                title: '中台商品ID',
                dataIndex: 'productId',
                align: 'center',
                width: 120,
            },
            {
                key: 'orderGoodsStatus',
                title: '中台订单状态',
                dataIndex: 'orderGoodsStatus',
                align: 'center',
                width: 120,
                render: (value: number) => getStatusDesc(orderStatusOptionList, value),
            },
            {
                key: 'purchasePlanId',
                title: '计划子项ID',
                dataIndex: 'purchasePlanId',
                align: 'center',
                width: 120,
            },
            {
                key: 'purchasePlatform',
                title: '采购平台',
                dataIndex: 'purchasePlatform',
                align: 'center',
                width: 120,
            },
            {
                key: 'purchaseNumber',
                title: '采购数量',
                dataIndex: 'purchaseNumber',
                align: 'center',
                width: 120,
            },
            {
                key: 'purchasePlatformOrderId',
                title: '采购订单号',
                dataIndex: 'purchasePlatformOrderId',
                align: 'center',
                width: 120,
            },
            {
                key: 'purchaseWaybillNo',
                title: '采购运单号',
                dataIndex: 'purchaseWaybillNo',
                align: 'center',
                width: 120,
            },

            {
                key: 'platformSendOrderTime',
                title: '采购生成时间',
                dataIndex: 'platformSendOrderTime',
                align: 'center',
                width: 120,
                render: (value: string) => utcToLocal(value, ''),
            },
            {
                key: 'purchaseOrderStatus',
                title: '采购订单状态',
                dataIndex: 'purchaseOrderStatus',
                align: 'center',
                width: 120,
                render: (value: number) => getStatusDesc(purchaseOrderOptionList, value),
            },
            {
                key: 'purchaseOrderPayStatus',
                title: '采购支付状态',
                dataIndex: 'purchaseOrderPayStatus',
                align: 'center',
                width: 120,
                render: (value: number) => getStatusDesc(purchasePayOptionList, value),
            },
            {
                key: 'payTime',
                title: '采购支付时间',
                dataIndex: 'payTime',
                align: 'center',
                width: 120,
                render: (value: string) => utcToLocal(value, ''),
            },
            {
                key: 'purchaseOrderShippingStatus',
                title: '采购配送状态',
                dataIndex: 'purchaseOrderShippingStatus',
                align: 'center',
                width: 120,
                render: (value: number) => getStatusDesc(purchaseShippingOptionList, value),
            },

            {
                key: 'confirmTime',
                title: '订单确认时间',
                dataIndex: 'confirmTime',
                align: 'center',
                width: 120,
                render: (value: string) => utcToLocal(value, ''),
            },
            {
                key: 'channelSource',
                title: '销售渠道',
                dataIndex: 'channelSource',
                align: 'center',
                width: 120,
            },
            {
                key: 'channelOrderSn',
                title: '渠道订单ID',
                dataIndex: 'channelOrderSn',
                align: 'center',
                width: 120,
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

    const toolBarRender = useCallback(() => {
        const disabled = selectedRowKeys.length === 0 ? true : false;
        return [
            <LoadingButton
                key="channel_order"
                type="primary"
                disabled={disabled}
                className={formStyles.formBtn}
                onClick={_delChannelOrders}
            >
                取消渠道订单
            </LoadingButton>,
            <LoadingButton
                key="export"
                className={formStyles.formBtn}
                onClick={_postExportPurchasedNotWarehouse}
            >
                导出至EXCEL
            </LoadingButton>,
        ];
    }, [selectedRowKeys, _delChannelOrders, _postExportPurchasedNotWarehouse]);

    useEffect(() => {
        onSearch();
    }, []);

    return useMemo(() => {
        return (
            <>
                {search}
                <FitTable
                    bordered
                    rowKey="orderGoodsId"
                    className="order-table"
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
            </>
        );
    }, [page, pageSize, total, loading, orderList, selectedRowKeys]);
};

export default PaneWarehouseNotShip;

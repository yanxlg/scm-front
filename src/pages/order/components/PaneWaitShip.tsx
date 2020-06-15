import React, { useMemo, useRef, useCallback, useState, useEffect } from 'react';
import { Button, notification } from 'antd';
import { JsonForm, LoadingButton, FitTable, useModal } from 'react-components';
import { JsonFormRef, FormField } from 'react-components/es/JsonForm';
import { defaultOptionItem, channelOptionList, defaultOptionItem1 } from '@/enums/OrderEnum';
import { IWaitShipSearch, IWaitShipOrderItem } from '@/interface/IOrder';
import {
    getWaitShipList,
    delPurchaseOrders,
    delChannelOrders,
    postExportWaitShip,
    queryChannelSource,
    getPlatformAndStore,
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
import { queryGoodsSourceList } from '@/services/global';

declare interface IProps {
    getAllTabCount(): void;
}

const formFields: FormField[] = [
    {
        type: 'input',
        name: 'order_goods_id',
        label: <span>中&nbsp;台&nbsp;订&nbsp;单&nbsp;ID</span>,
        className: 'order-input',
        placeholder: '请输入中台订单ID',
    },
    {
        type: 'input',
        name: 'purchase_platform_order_id_list',
        label: '采购平台订单ID',
        className: 'order-input',
        placeholder: '请输入采购平台订单ID',
        formatter: 'str_arr',
    },
    {
        type: 'input',
        name: 'product_id',
        label: '中台商品ID',
        className: 'order-input',
        placeholder: '请输入中台商品ID',
    },
    {
        type: 'select',
        name: 'channel_source',
        label: '销售店铺名称',
        className: 'order-input',
        // optionList: [defaultOptionItem, ...channelOptionList],
        syncDefaultOption: defaultOptionItem1,
        optionList: () => getPlatformAndStore(),
    },
    {
        type: 'select',
        name: 'xxx',
        label: '采购渠道',
        className: 'order-input',
        // optionList: [defaultOptionItem, ...channelOptionList],
        syncDefaultOption: defaultOptionItem1,
        optionList: () => queryGoodsSourceList(),
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
        label: '采购计划状态',
        className: 'order-input',
        optionList: [defaultOptionItem, ...purchaseOrderOptionList],
    },
    {
        type: 'dateRanger',
        name: ['platform_order_time_start', 'platform_order_time_end'],
        label: <span>采&nbsp;购&nbsp;时&nbsp;间</span>,
        className: 'order-date-picker',
        // placeholder: '请选择订单时间',
        formatter: ['start_date', 'end_date'],
    },
    {
        type: 'dateRanger',
        name: ['order_create_time_start', 'order_create_time_end'],
        label: <span>订&nbsp;单&nbsp;时&nbsp;间</span>,
        className: 'order-date-picker',
        // placeholder: '请选择订单时间',
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
                platformOrderTime,
                purchasePlatformOrderId,
                purchaseAmount,
                purchaseOrderStatus,
                purchaseOrderShippingStatus,
                purchasePlanId,
                orderGoodsId,
                productId,
                // purchasewaybillNo,
                orderGoods,
                orderInfo,
            } = current;
            const { orderGoodsStatus, createTime: orderCreateTime } = orderGoods;
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
            } as IWaitShipOrderItem;
        });
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

    const _cancelPurchaseOrder = useCallback(() => {
        return delPurchaseOrders({
            order_goods_ids: selectedRowKeys as string[],
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
    }, [selectedRowKeys]);

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
                key: 'platformOrderTime',
                title: '采购时间',
                dataIndex: 'platformOrderTime',
                align: 'center',
                width: 120,
                render: (value: string) => utcToLocal(value, ''),
            },
            {
                key: 'purchasePlatformOrderId',
                title: '采购平台订单ID',
                dataIndex: 'purchasePlatformOrderId',
                align: 'center',
                width: 120,
            },
            {
                key: 'purchaseAmount',
                title: '采购价',
                dataIndex: 'purchaseAmount',
                align: 'center',
                width: 120,
            },
            {
                key: 'channelSource',
                title: '销售店铺名称',
                dataIndex: 'channelSource',
                align: 'center',
                width: 120,
            },
            {
                key: 'xxx',
                title: '采购渠道',
                dataIndex: 'xxx',
                align: 'center',
                width: 120,
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
                key: 'purchaseOrderStatus',
                title: '采购计划状态',
                dataIndex: 'purchaseOrderStatus',
                align: 'center',
                width: 120,
                render: (value: number) => getStatusDesc(purchaseOrderOptionList, value),
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
                key: 'purchasePlanId',
                title: '计划子项ID',
                dataIndex: 'purchasePlanId',
                align: 'center',
                width: 120,
            },
            {
                key: 'orderGoodsId',
                title: '中台子订单ID',
                dataIndex: 'orderGoodsId',
                align: 'center',
                width: 120,
            },
            {
                key: 'orderCreateTime',
                title: '订单时间',
                dataIndex: 'orderCreateTime',
                align: 'center',
                width: 120,
                render: (value: string) => utcToLocal(value, ''),
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
                onClick={_cancelPurchaseOrder}
            >
                取消采购单
            </LoadingButton>,
            <CancelOrder
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
                    取消渠道订单
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

import React, { useMemo, useRef, useCallback, useState, useEffect } from 'react';
import { notification, Checkbox, Button } from 'antd';
import { JsonForm, LoadingButton, FitTable, useModal } from 'react-components';
import { JsonFormRef, FormField } from 'react-components/es/JsonForm';
import { IPendingOrderSearch, IPendingOrderItem } from '@/interface/IOrder';
import {
    getPendingOrderList,
    delChannelOrders,
    postExportPendingOrder,
    postOrdersPlace,
    queryChannelSource,
} from '@/services/order-manage';
import { utcToLocal } from 'react-components/es/utils/date';
import { defaultOptionItem, channelOptionList, purchaseOrderOptionList } from '@/enums/OrderEnum';
import { TableProps } from 'antd/es/table';

import formStyles from 'react-components/es/JsonForm/_form.less';
import { getStatusDesc } from '@/utils/transform';
import Export from '@/components/Export';

declare interface IProps {
    getAllTabCount(): void;
}

const formFields: FormField[] = [
    {
        type: 'input',
        name: 'order_goods_id',
        label: '中台订单ID',
        className: 'order-input',
        placeholder: '请输入中台订单ID',
        formatter: 'number_str_arr',
    },
    {
        type: 'input',
        name: 'product_id',
        label: '中台商品ID',
        className: 'order-input',
        placeholder: '请输入中台商品ID',
        formatter: 'str_arr',
    },
    {
        type: 'input',
        name: 'sku_id',
        label: '中台SKU ID',
        className: 'order-input',
        placeholder: '请输入中台SKU ID',
        formatter: 'str_arr',
    },
    {
        type: 'select',
        name: 'channel_source',
        label: '销售渠道',
        className: 'order-input',
        // optionList: [defaultOptionItem, ...channelOptionList],
        syncDefaultOption: defaultOptionItem,
        optionList: () =>
            queryChannelSource().then(({ data = {} }) => {
                return Object.keys(data).map(key => ({
                    name: data[key],
                    value: Number(key),
                }));
            }),
    },
    {
        type: 'dateRanger',
        name: ['order_time_start', 'order_time_end'],
        label: '订单时间',
        className: 'order-pending-date-picker',
        placeholder: '请选择订单时间',
        formatter: ['start_date', 'end_date'],
    },
];

const defaultInitialValues = {
    channel_source: 100,
};

const PaneWarehouseNotShip: React.FC<IProps> = ({ getAllTabCount }) => {
    const searchRef = useRef<JsonFormRef>(null);
    const orderListRef = useRef<IPendingOrderItem[]>([]);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(50);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);
    const [orderList, setOrderList] = useState<IPendingOrderItem[]>([]);

    let currentSearchParams: IPendingOrderSearch | null = null;

    const selectedOrderGoodsIdList = useMemo(() => {
        return orderList.filter(item => item._checked).map(item => item.orderGoodsId);
    }, [orderList]);

    const _setOrderList = useCallback(list => {
        orderListRef.current = list;
        setOrderList(list);
    }, []);

    const onSearch = useCallback(
        (paginationParams = { page, page_count: pageSize }) => {
            const params: IPendingOrderSearch = Object.assign(
                {
                    page,
                    page_count: pageSize,
                },
                paginationParams,
                searchRef.current?.getFieldsValue(),
            );
            setLoading(true);
            return getPendingOrderList(params)
                .then(res => {
                    currentSearchParams = params;
                    const { all_count: total, list } = res.data;
                    // const { page, page_count } = params;
                    if (list) {
                        setPage(params.page as number);
                        setPageSize(params.page_count as number);
                        setTotal(total);
                        _setOrderList(getOrderList(list));
                    }
                })
                .finally(() => {
                    setLoading(false);
                });
        },
        [page, pageSize],
    );

    const getOrderList = useCallback(list => {
        // console.log(1111, list);
        const childOrderList: IPendingOrderItem[] = [];
        list.forEach((goodsItem: any) => {
            const { orderGoods, orderInfo } = goodsItem;
            const { orderGoodsPurchasePlan, ...orderRest } = orderGoods;
            const { currency, confirmTime, channelOrderSn, channelSource } = orderInfo;
            // console.log(111, orderGoodsPurchasePlan, orderGoods);
            if (orderGoodsPurchasePlan) {
                // 生成采购计划
                orderGoodsPurchasePlan.forEach((purchaseItem: any, index: number) => {
                    const {
                        createTime: purchaseCreateTime,
                        lastUpdateTime: purchaseLastUpdateTime,
                        ...purchaseRest
                    } = purchaseItem;
                    const childOrderItem: any = {
                        ...orderRest,
                        ...purchaseRest,
                        purchaseCreateTime,
                        purchaseLastUpdateTime,
                        currency,
                        confirmTime,
                        channelOrderSn,
                        channelSource,
                    };
                    if (index === 0) {
                        childOrderItem._rowspan = orderGoodsPurchasePlan.length;
                        childOrderItem._checked = false;
                    }
                    childOrderList.push(childOrderItem);
                });
            } else {
                // 没有生成采购计划
                childOrderList.push({
                    currency,
                    confirmTime,
                    channelOrderSn,
                    channelSource,
                    ...orderRest,
                    _rowspan: 1,
                    _checked: false,
                });
            }
        });
        // console.log(1111, childOrderList);
        return childOrderList;
    }, []);

    const handleClickSearch = useCallback(() => {
        return onSearch({ page: 1 });
    }, []);

    const onCheckAllChange = useCallback((status: boolean) => {
        _setOrderList(
            orderListRef.current.map(item => {
                if (item._rowspan) {
                    return {
                        ...item,
                        _checked: status,
                    };
                }
                return item;
            }),
        );
    }, []);

    const onSelectedRow = useCallback((row: IPendingOrderItem) => {
        _setOrderList(
            orderListRef.current.map(item => {
                if (item._rowspan && row.orderGoodsId === item.orderGoodsId) {
                    return {
                        ...item,
                        _checked: !row._checked,
                    };
                }
                return item;
            }),
        );
    }, []);

    const mergeCell = useCallback((value: string | number, row: IPendingOrderItem) => {
        return {
            children: value,
            props: {
                rowSpan: row._rowspan || 0,
            },
        };
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

    const _postOrdersPlace = useCallback(() => {
        return postOrdersPlace({
            order_goods_ids: selectedOrderGoodsIdList,
        }).then(res => {
            onSearch();
            const { success, failed } = res.data;
            if (success?.length) {
                batchOperateSuccess('拍单', success);
            }
            if (failed?.length) {
                batchOperateFail('拍单', failed);
            }
        });
    }, [selectedOrderGoodsIdList]);

    const _delChannelOrders = useCallback(() => {
        return delChannelOrders({
            order_goods_ids: selectedOrderGoodsIdList,
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
    }, [selectedOrderGoodsIdList]);

    const _postExportPendingOrder = useCallback((values: any) => {
        return postExportPendingOrder({
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
                </div>
            </JsonForm>
        );
    }, []);

    const columns = useMemo<TableProps<IPendingOrderItem>['columns']>(() => {
        return [
            {
                fixed: true,
                key: '_checked',
                title: () => {
                    const rowspanList = orderListRef.current.filter(item => item._rowspan);
                    const checkedListLen = rowspanList.filter(item => item._checked).length;
                    let indeterminate = false,
                        checked = false;
                    if (rowspanList.length && rowspanList.length === checkedListLen) {
                        checked = true;
                    } else if (checkedListLen) {
                        indeterminate = true;
                    }
                    return (
                        <Checkbox
                            indeterminate={indeterminate}
                            checked={checked}
                            onChange={e => onCheckAllChange(e.target.checked)}
                        />
                    );
                },
                dataIndex: '_checked',
                align: 'center',
                width: 60,
                render: (value: boolean, row: IPendingOrderItem) => {
                    return {
                        children: <Checkbox checked={value} onChange={() => onSelectedRow(row)} />,
                        props: {
                            rowSpan: row._rowspan || 0,
                        },
                    };
                },
                hideInSetting: true,
            },
            {
                fixed: true,
                key: 'createTime',
                title: '订单时间',
                dataIndex: 'createTime',
                align: 'center',
                width: 120,
                render: (value: string, row: IPendingOrderItem) => {
                    return {
                        children: utcToLocal(value, ''),
                        props: {
                            rowSpan: row._rowspan || 0,
                        },
                    };
                },
            },
            {
                fixed: true,
                key: 'orderGoodsId',
                title: '中台订单ID',
                dataIndex: 'orderGoodsId',
                align: 'center',
                width: 120,
                render: mergeCell,
            },
            {
                key: 'goodsNumber',
                title: '商品数量',
                dataIndex: 'goodsNumber',
                align: 'center',
                width: 120,
                render: mergeCell,
            },
            {
                key: 'goodsAmount',
                title: '商品价格',
                dataIndex: 'goodsAmount',
                align: 'center',
                width: 120,
                render: mergeCell,
            },
            {
                key: 'freight',
                title: '预估运费',
                dataIndex: 'freight',
                align: 'center',
                width: 120,
                render: mergeCell,
            },
            {
                key: 'productId',
                title: '中台商品ID',
                dataIndex: 'productId',
                align: 'center',
                width: 120,
                render: mergeCell,
            },
            {
                key: 'skuId',
                title: '中台SKU ID',
                dataIndex: 'skuId',
                align: 'center',
                width: 120,
                render: mergeCell,
            },
            {
                key: 'channelSource',
                title: '销售渠道',
                dataIndex: 'channelSource',
                align: 'center',
                width: 120,
                render: mergeCell,
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
                key: 'purchasePlatform',
                title: '采购平台',
                dataIndex: 'purchasePlatform',
                align: 'center',
                width: 120,
            },
            {
                key: 'purchasePlanId',
                title: '计划子项ID',
                dataIndex: 'purchasePlanId',
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
                key: 'purchaseAmount',
                title: '采购单价',
                dataIndex: 'purchaseAmount',
                align: 'center',
                width: 120,
                render: (value: string, row: IPendingOrderItem) => {
                    const { purchaseNumber } = row;
                    const price = Number(value) / Number(purchaseNumber);
                    return isNaN(price) ? '' : price.toFixed(2);
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

    const { visible, onClose, setVisibleProps } = useModal<boolean>();

    const toolBarRender = useCallback(() => {
        const disabled = selectedOrderGoodsIdList.length === 0 ? true : false;
        return [
            <LoadingButton
                key="place_order"
                type="primary"
                className={formStyles.formBtn}
                onClick={_postOrdersPlace}
                disabled={disabled}
            >
                一键拍单
            </LoadingButton>,
            <LoadingButton
                key="channel_order"
                type="primary"
                className={formStyles.formBtn}
                onClick={_delChannelOrders}
                disabled={disabled}
            >
                取消渠道订单
            </LoadingButton>,
            <Button
                key="export"
                className={formStyles.formBtn}
                onClick={() => setVisibleProps(true)}
            >
                导出至EXCEL
            </Button>,
        ];
    }, [selectedOrderGoodsIdList, _postOrdersPlace, _delChannelOrders, _postExportPendingOrder]);

    useEffect(() => {
        onSearch();
    }, []);

    return useMemo(() => {
        return (
            <>
                {search}
                <FitTable
                    bordered={true}
                    rowKey="purchasePlanId"
                    className="order-table"
                    loading={loading}
                    columns={columns}
                    // rowSelection={rowSelection}
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
                    onOKey={_postExportPendingOrder}
                    onCancel={onClose}
                />
            </>
        );
    }, [page, pageSize, total, loading, orderList, visible]);
};

export default PaneWarehouseNotShip;

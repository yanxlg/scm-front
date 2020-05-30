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
    getPlatformAndStore,
} from '@/services/order-manage';
import { utcToLocal } from 'react-components/es/utils/date';
import {
    defaultOptionItem,
    channelOptionList,
    purchaseOrderOptionList,
    defaultOptionItem1,
} from '@/enums/OrderEnum';
import { TableProps } from 'antd/es/table';

import formStyles from 'react-components/es/JsonForm/_form.less';
import { getStatusDesc } from '@/utils/transform';
import Export from '@/components/Export';
import CancelOrder from './CancelOrder';
import { FormInstance } from 'antd/es/form';

declare interface IProps {
    getAllTabCount(): void;
}

const defaultInitialValues = {
    channel_source: '',
};

const PaneWarehouseNotShip: React.FC<IProps> = ({ getAllTabCount }) => {
    const searchRef = useRef<JsonFormRef>(null);
    const searchRef1 = useRef<JsonFormRef>(null);
    const searchRef2 = useRef<JsonFormRef>(null);
    const orderListRef = useRef<IPendingOrderItem[]>([]);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(50);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);
    const [orderList, setOrderList] = useState<IPendingOrderItem[]>([]);

    const [status, setStatus] = useState('1');

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
                searchRef1.current?.getFieldsValue(),
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

    const _postExportPendingOrder = useCallback((values: any) => {
        return postExportPendingOrder({
            ...currentSearchParams,
            ...values,
        });
    }, []);

    const formFieldsState = useMemo<FormField[]>(() => {
        switch (status) {
            case '1':
            default:
            case '2':
                return [
                    {
                        type: 'select',
                        name: 'store',
                        label: '销售店铺名称',
                    },
                    {
                        type: 'input',
                        name: 'order_goods_id',
                        label: '子订单ID',
                        className: 'order-input',
                        placeholder: '请输入中台订单ID',
                        formatter: 'number_str_arr',
                    },
                    {
                        type: 'input',
                        name: 'order_commodity_id',
                        label: 'Commodity ID',
                        className: 'order-input',
                        placeholder: 'Commodity ID',
                        formatter: 'number_str_arr',
                    },
                    {
                        type: 'input',
                        name: 'product_id',
                        label: '采购计划ID',
                        className: 'order-input',
                        placeholder: '请输入中台商品ID',
                        formatter: 'str_arr',
                    },
                    {
                        type: 'dateRanger',
                        name: ['order_time_start', 'order_time_end'],
                        label: '订单生成时间',
                        className: 'order-pending-date-picker',
                        placeholder: '请选择订单时间',
                        formatter: ['start_date', 'end_date'],
                    },
                    {
                        type: 'dateRanger',
                        name: ['purchase_time_start', 'purchase_order_time_end'],
                        label: '采购计划生成时间',
                        className: 'order-pending-date-picker',
                        placeholder: '请选择订单时间',
                        formatter: ['start_date', 'end_date'],
                    },
                ];

            case '3':
                return [
                    {
                        type: 'select',
                        name: 'store',
                        label: '销售店铺名称',
                    },
                    {
                        type: 'select',
                        name: 'store',
                        label: '仓库库存预定状态',
                    },
                    {
                        type: 'select',
                        name: 'store',
                        label: '采购计划状态',
                    },
                    {
                        type: 'select',
                        name: 'store',
                        label: '失败原因',
                    },
                    {
                        type: 'select',
                        name: 'store',
                        label: '采购单取消类型',
                    },
                    {
                        type: 'input',
                        name: 'order_goods_id',
                        label: '子订单ID',
                        className: 'order-input',
                        placeholder: '请输入中台订单ID',
                        formatter: 'number_str_arr',
                    },
                    {
                        type: 'input',
                        name: 'order_commodity_id',
                        label: 'Commodity ID',
                        className: 'order-input',
                        placeholder: 'Commodity ID',
                        formatter: 'number_str_arr',
                    },
                    {
                        type: 'input',
                        name: 'product_id',
                        label: '采购计划ID',
                        className: 'order-input',
                        placeholder: '请输入中台商品ID',
                        formatter: 'str_arr',
                    },
                    {
                        type: 'dateRanger',
                        name: ['order_time_start', 'order_time_end'],
                        label: '订单生成时间',
                        className: 'order-pending-date-picker',
                        placeholder: '请选择订单时间',
                        formatter: ['start_date', 'end_date'],
                    },
                    {
                        type: 'dateRanger',
                        name: ['purchase_time_start', 'purchase_order_time_end'],
                        label: '采购计划生成时间',
                        className: 'order-pending-date-picker',
                        placeholder: '请选择订单时间',
                        formatter: ['start_date', 'end_date'],
                    },
                ];
            case '4':
                return [
                    {
                        type: 'select',
                        name: 'store',
                        label: '销售店铺名称',
                    },
                    {
                        type: 'select',
                        name: 'purchase_status',
                        label: '采购计划状态',
                    },
                    {
                        type: 'input',
                        name: 'order_goods_id',
                        label: '子订单ID',
                        className: 'order-input',
                        placeholder: '请输入中台订单ID',
                        formatter: 'number_str_arr',
                    },
                    {
                        type: 'input',
                        name: 'order_commodity_id',
                        label: 'Commodity ID',
                        className: 'order-input',
                        placeholder: 'Commodity ID',
                        formatter: 'number_str_arr',
                    },
                    {
                        type: 'input',
                        name: 'product_id',
                        label: '采购计划ID',
                        className: 'order-input',
                        placeholder: '请输入中台商品ID',
                        formatter: 'str_arr',
                    },
                    {
                        type: 'dateRanger',
                        name: ['order_time_start', 'order_time_end'],
                        label: '订单生成时间',
                        className: 'order-pending-date-picker',
                        placeholder: '请选择订单时间',
                        formatter: ['start_date', 'end_date'],
                    },
                    {
                        type: 'dateRanger',
                        name: ['purchase_time_start', 'purchase_order_time_end'],
                        label: '采购计划生成时间',
                        className: 'order-pending-date-picker',
                        placeholder: '请选择订单时间',
                        formatter: ['start_date', 'end_date'],
                    },
                ];
        }
    }, [status]);

    const statusFormFields = useMemo<FormField[]>(() => {
        return [
            {
                type: 'radioGroup',
                name: 'status',
                label: '拍单状态',
                options: [
                    {
                        label: '待拍单',
                        value: '1',
                    },
                    {
                        label: '拍单中',
                        value: '2',
                    },
                    {
                        label: '拍单失败',
                        value: '3',
                    },
                    {
                        label: '相似款代拍中',
                        value: '4',
                    },
                ],
                onChange: (name, form) => {
                    searchRef.current?.resetFields();
                    setStatus(form.getFieldValue('status'));
                },
            },
        ];
    }, []);

    const search = useMemo(() => {
        return (
            <>
                <JsonForm
                    ref={searchRef1}
                    initialValues={{
                        status: '1',
                    }}
                    fieldList={statusFormFields}
                />
                <JsonForm
                    ref={searchRef}
                    fieldList={formFieldsState}
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
            </>
        );
    }, [loading, status]);

    const searchForm1 = useMemo(() => {
        return (
            <JsonForm
                layout="horizontal"
                // containerClassName={status === '4' ? '' : undefined}
                key={'form1'}
                ref={searchRef2}
                enableCollapse={false}
                fieldList={
                    status === '3'
                        ? [
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
                                      onSearch();
                                  },
                                  formatter: 'join',
                              },
                              {
                                  type: 'checkboxGroup',
                                  name: 'resolveType',
                                  label: '处理方式',
                                  options: [
                                      {
                                          label: '仅重拍',
                                          value: 1,
                                      },
                                      {
                                          label: '仅相似款代拍',
                                          value: 2,
                                      },
                                      {
                                          label: '重拍或相似款代拍',
                                          value: 3,
                                      },
                                  ],
                              },
                          ]
                        : [
                              {
                                  type: 'checkboxGroup',
                                  name: 'showRecreated',
                                  formItemClassName: status === '4' ? '' : undefined,
                                  options: [
                                      {
                                          label: '展示已重新生成',
                                          value: true,
                                      },
                                  ],
                                  onChange: (name: string, form: FormInstance) => {
                                      onSearch();
                                  },
                                  formatter: 'join',
                              },
                          ]
                }
            />
        );
    }, [status]);

    const columns = useMemo<TableProps<IPendingOrderItem>['columns']>(() => {
        switch (status) {
            default:
            case '1':
            case '2':
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
                                children: (
                                    <Checkbox checked={value} onChange={() => onSelectedRow(row)} />
                                ),
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
                        title: '订单生成时间',
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
                        title: '子订单ID',
                        dataIndex: 'orderGoodsId',
                        align: 'center',
                        width: 120,
                        render: mergeCell,
                    },
                    {
                        key: 'commodityId',
                        title: 'Commodity ID',
                        dataIndex: 'commodityId',
                        align: 'center',
                        width: 120,
                        render: mergeCell,
                    },
                    {
                        key: 'goodsName',
                        title: '商品名称',
                        dataIndex: 'goodsName',
                        align: 'center',
                        width: 120,
                        render: mergeCell,
                    },
                    {
                        key: 'skuImg',
                        title: 'SKU图片',
                        dataIndex: 'skuImg',
                        align: 'center',
                        width: 120,
                        render: mergeCell,
                    },
                    {
                        key: 'productStyle',
                        title: '商品规格',
                        dataIndex: 'productStyle',
                        align: 'center',
                        width: 120,
                        render: mergeCell,
                    },
                    {
                        key: 'goodsNumber',
                        title: '销售商品数量',
                        dataIndex: 'goodsNumber',
                        align: 'center',
                        width: 120,
                        render: mergeCell,
                    },
                    {
                        key: 'freight',
                        title: '销售商品运费',
                        dataIndex: 'freight',
                        align: 'center',
                        width: 120,
                        render: mergeCell,
                    },
                    {
                        key: 'goodsAmount',
                        title: '销售商品总金额($)',
                        dataIndex: 'goodsAmount',
                        align: 'center',
                        width: 120,
                        render: mergeCell,
                    },
                    {
                        key: 'goodsStore',
                        title: '销售店铺名称',
                        dataIndex: 'goodsStore',
                        align: 'center',
                        width: 120,
                        render: mergeCell,
                    },
                    {
                        key: 'goodsStore',
                        title: '销售订单ID',
                        dataIndex: 'goodsStore',
                        align: 'center',
                        width: 120,
                        render: mergeCell,
                    },
                    {
                        key: 'purchasePlanId',
                        title: '采购计划ID',
                        dataIndex: 'purchasePlanId',
                        align: 'center',
                        width: 120,
                    },
                    {
                        key: 'purchasePlanId',
                        title: '采购订单生成时间',
                        dataIndex: 'purchasePlanId',
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
                ];
            case '3':
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
                                children: (
                                    <Checkbox checked={value} onChange={() => onSelectedRow(row)} />
                                ),
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
                        title: '订单生成时间',
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
                        title: '仓库库存预定状态',
                        dataIndex: 'orderGoodsId',
                        align: 'center',
                        width: 120,
                        render: mergeCell,
                    },
                    {
                        fixed: true,
                        key: 'orderGoodsId',
                        title: '子订单ID',
                        dataIndex: 'orderGoodsId',
                        align: 'center',
                        width: 120,
                        render: mergeCell,
                    },
                    {
                        key: 'commodityId',
                        title: 'Commodity ID',
                        dataIndex: 'commodityId',
                        align: 'center',
                        width: 120,
                        render: mergeCell,
                    },
                    {
                        key: 'commodityId',
                        title: '拍单失败原因',
                        dataIndex: 'commodityId',
                        align: 'center',
                        width: 120,
                        render: mergeCell,
                    },
                    {
                        key: 'goodsName',
                        title: '商品名称',
                        dataIndex: 'goodsName',
                        align: 'center',
                        width: 120,
                        render: mergeCell,
                    },
                    {
                        key: 'skuImg',
                        title: 'SKU图片',
                        dataIndex: 'skuImg',
                        align: 'center',
                        width: 120,
                        render: mergeCell,
                    },
                    {
                        key: 'productStyle',
                        title: '商品规格',
                        dataIndex: 'productStyle',
                        align: 'center',
                        width: 120,
                        render: mergeCell,
                    },
                    {
                        key: 'goodsStore',
                        title: '销售店铺名称',
                        dataIndex: 'goodsStore',
                        align: 'center',
                        width: 120,
                        render: mergeCell,
                    },
                    {
                        key: 'purchasePlanId',
                        title: '采购计划ID',
                        dataIndex: 'purchasePlanId',
                        align: 'center',
                        width: 120,
                    },
                    {
                        key: 'purchasePlanId',
                        title: '采购订单生成时间',
                        dataIndex: 'purchasePlanId',
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
                        key: 'purchasePlanId',
                        title: '采购单取消类型',
                        dataIndex: 'purchasePlanId',
                        align: 'center',
                        width: 120,
                    },
                ];
            case '4':
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
                                children: (
                                    <Checkbox checked={value} onChange={() => onSelectedRow(row)} />
                                ),
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
                        title: '订单生成时间',
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
                        title: '子订单ID',
                        dataIndex: 'orderGoodsId',
                        align: 'center',
                        width: 120,
                        render: mergeCell,
                    },
                    {
                        key: 'commodityId',
                        title: 'Commodity ID',
                        dataIndex: 'commodityId',
                        align: 'center',
                        width: 120,
                        render: mergeCell,
                    },
                    {
                        key: 'goodsName',
                        title: '商品名称',
                        dataIndex: 'goodsName',
                        align: 'center',
                        width: 120,
                        render: mergeCell,
                    },
                    {
                        key: 'skuImg',
                        title: 'SKU图片',
                        dataIndex: 'skuImg',
                        align: 'center',
                        width: 120,
                        render: mergeCell,
                    },
                    {
                        key: 'productStyle',
                        title: '商品规格',
                        dataIndex: 'productStyle',
                        align: 'center',
                        width: 120,
                        render: mergeCell,
                    },
                    {
                        key: 'goodsNumber',
                        title: '销售商品数量',
                        dataIndex: 'goodsNumber',
                        align: 'center',
                        width: 120,
                        render: mergeCell,
                    },
                    {
                        key: 'freight',
                        title: '销售商品运费',
                        dataIndex: 'freight',
                        align: 'center',
                        width: 120,
                        render: mergeCell,
                    },
                    {
                        key: 'goodsAmount',
                        title: '销售商品总金额($)',
                        dataIndex: 'goodsAmount',
                        align: 'center',
                        width: 120,
                        render: mergeCell,
                    },
                    {
                        key: 'goodsStore',
                        title: '销售店铺名称',
                        dataIndex: 'goodsStore',
                        align: 'center',
                        width: 120,
                        render: mergeCell,
                    },
                    {
                        key: 'purchasePlanId',
                        title: '采购计划ID',
                        dataIndex: 'purchasePlanId',
                        align: 'center',
                        width: 120,
                    },
                    {
                        key: 'purchasePlanId',
                        title: '采购订单生成时间',
                        dataIndex: 'purchasePlanId',
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
                ];
        }
    }, [status]);

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
        const disabled = selectedOrderGoodsIdList.length === 0;
        switch (status) {
            default:
            case '1':
            case '3':
                return [
                    <LoadingButton
                        key="place_order"
                        type="primary"
                        className={formStyles.formBtn}
                        onClick={_postOrdersPlace}
                        disabled={disabled}
                    >
                        一键重拍
                    </LoadingButton>,
                    <CancelOrder
                        key={'cancel'}
                        orderGoodsIds={selectedOrderGoodsIdList}
                        onReload={onSearch}
                        getAllTabCount={getAllTabCount}
                    >
                        <Button
                            key="channel_order"
                            type="primary"
                            className={formStyles.formBtn}
                            disabled={disabled}
                        >
                            取消订单
                        </Button>
                    </CancelOrder>,
                ];
            case '2':
                return [
                    <CancelOrder
                        key={'cancel'}
                        orderGoodsIds={selectedOrderGoodsIdList}
                        onReload={onSearch}
                        getAllTabCount={getAllTabCount}
                    >
                        <Button
                            key="channel_order"
                            type="primary"
                            className={formStyles.formBtn}
                            disabled={disabled}
                        >
                            取消订单
                        </Button>
                    </CancelOrder>,
                ];
            case '4':
                return [searchForm1];
        }
    }, [selectedOrderGoodsIdList, _postOrdersPlace, _postExportPendingOrder, status]);

    useEffect(() => {
        onSearch();
    }, []);

    return useMemo(() => {
        return (
            <>
                {search}
                {status === '4' ? null : searchForm1}
                <FitTable
                    bordered={true}
                    rowKey="purchasePlanId"
                    // className="order-table"
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
    }, [page, pageSize, total, loading, orderList, visible, status]);
};

export default PaneWarehouseNotShip;

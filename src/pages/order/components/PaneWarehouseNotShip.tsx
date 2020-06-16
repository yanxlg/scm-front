import React, { useMemo, useRef, useCallback, useState, useEffect } from 'react';
import { Checkbox, Button } from 'antd';
import { JsonForm, LoadingButton, FitTable, useModal } from 'react-components';
import { JsonFormRef, FormField } from 'react-components/es/JsonForm';
import { defaultOptionItem1 } from '@/enums/OrderEnum';
import { IWarehouseNotShipSearch, IWarehouseNotShipOrderItem } from '@/interface/IOrder';
import {
    getWarehouseNotShipList,
    postExportWarehouseNotShip,
    getPlatformAndStore,
    getWarehouseList,
} from '@/services/order-manage';
import { utcToLocal } from 'react-components/es/utils/date';
import { getStatusDesc } from '@/utils/transform';
import { purchaseOrderOptionList, purchaseShippingOptionList } from '@/enums/OrderEnum';
import { TableProps } from 'antd/es/table';

import formStyles from 'react-components/es/JsonForm/_form.less';
import Export from '@/components/Export';
import CancelOrder from './CancelOrder';
import { IOptionItem } from 'react-components/lib/JsonForm/items/Select';

declare interface IProps {
    getAllTabCount(): void;
}

const formFields: FormField[] = [
    {
        type: 'textarea',
        name: 'order_goods_id',
        label: '中台订单子ID',
        className: 'order-input',
        placeholder: '请输入',
        formatter: 'multipleToArray',
    },
    {
        type: 'textarea',
        name: 'product_id',
        label: '中台商品ID',
        className: 'order-input',
        placeholder: '请输入',
        formatter: 'multipleToArray',
    },
    {
        type: 'textarea',
        name: 'purchase_waybill_no',
        label: '采购运单号',
        className: 'order-input',
        placeholder: '请输入',
        formatter: 'multipleToArray',
    },
    {
        type: 'textarea',
        name: 'refer_waybill_no',
        label: '参考订单号',
        className: 'order-input',
        placeholder: '请输入',
        formatter: 'multipleToArray',
    },
    {
        type: 'select',
        name: 'warehouse_id',
        label: '仓库名称',
        className: 'order-input',
        syncDefaultOption: defaultOptionItem1,
        optionList: () => getWarehouseList(),
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
        type: 'dateRanger',
        name: ['storage_time_start', 'storage_time_end'],
        label: '入库时间',
        className: 'order-date-picker',
        formatter: ['start_date', 'end_date'],
    },
];

const defaultInitialValues = {
    channel_source: '',
    warehouse_id: '',
};

const PaneWarehouseNotShip: React.FC<IProps> = ({ getAllTabCount }) => {
    const searchRef = useRef<JsonFormRef>(null);
    const orderListRef = useRef<IWarehouseNotShipOrderItem[]>([]);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(50);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);
    const [orderList, setOrderList] = useState<IWarehouseNotShipOrderItem[]>([]);
    const [warehouseList, setWarehouseList] = useState<IOptionItem[]>([]);

    let currentSearchParams: IWarehouseNotShipSearch | null = null;

    const _setOrderList = useCallback(list => {
        orderListRef.current = list;
        setOrderList(list);
    }, []);

    const onSearch = useCallback(
        (paginationParams = { page, page_count: pageSize }) => {
            const params: IWarehouseNotShipSearch = Object.assign(
                {
                    page,
                    page_count: pageSize,
                },
                paginationParams,
                searchRef.current?.getFieldsValue(),
            );
            setLoading(true);
            return getWarehouseNotShipList(params)
                .then(res => {
                    currentSearchParams = params;
                    const { all_count: total, list } = res.data;
                    // const { page, page_count } = params;
                    if (list) {
                        setPage(params.page as number);
                        setPageSize(params.page_count as number);
                        setTotal(total);
                        _setOrderList(getChildOrderData(list));
                    }
                })
                .finally(() => {
                    setLoading(false);
                });
        },
        [page, pageSize],
    );

    const getChildOrderData = useCallback(list => {
        const childOrderList: IWarehouseNotShipOrderItem[] = [];
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

    const onSelectedRow = useCallback((row: IWarehouseNotShipOrderItem) => {
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

    const mergeCell = useCallback((value: string | number, row: IWarehouseNotShipOrderItem) => {
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

    const getOrderGoodsIdList = useCallback(() => {
        return orderList.filter(item => item._checked).map(item => item.orderGoodsId);
    }, [orderList]);

    const _postExportWarehouseNotShip = useCallback((values: any) => {
        return postExportWarehouseNotShip({
            ...currentSearchParams,
            ...values,
        });
    }, []);

    const _getWarehouseList = useCallback(() => {
        getWarehouseList().then(list => setWarehouseList(list));
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

    const columns = useMemo<TableProps<IWarehouseNotShipOrderItem>['columns']>(() => {
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
                width: 50,
                render: (value: boolean, row: IWarehouseNotShipOrderItem) => {
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
                key: 'createTime',
                title: '订单时间',
                dataIndex: 'createTime',
                align: 'center',
                width: 120,
                render: (value: string, row: IWarehouseNotShipOrderItem) => {
                    return {
                        children: utcToLocal(value, ''),
                        props: {
                            rowSpan: row._rowspan || 0,
                        },
                    };
                },
            },
            {
                key: 'orderGoodsId',
                title: '中台订单子ID',
                dataIndex: 'orderGoodsId',
                align: 'center',
                width: 120,
                render: mergeCell,
            },
            {
                key: 'purchasePlanId',
                title: '计划子项ID',
                dataIndex: 'purchasePlanId',
                align: 'center',
                width: 120,
                // render: mergeCell
            },
            {
                key: 'productId',
                title: '中台商品ID',
                dataIndex: 'productId',
                align: 'center',
                width: 120,
                // render: mergeCell
            },
            {
                key: 'purchaseWaybillNo',
                title: '采购运单号',
                dataIndex: 'purchaseWaybillNo',
                align: 'center',
                width: 120,
            },
            {
                key: 'purchaseOrderStatus',
                title: '采购计划状态',
                dataIndex: 'purchaseOrderStatus',
                align: 'center',
                width: 120,
                render: (value: number, row: IWarehouseNotShipOrderItem) => {
                    return getStatusDesc(purchaseOrderOptionList, value);
                },
            },
            {
                key: 'purchaseOrderShippingStatus',
                title: '采购配送状态',
                dataIndex: 'purchaseOrderShippingStatus',
                align: 'center',
                width: 120,
                render: (value: number, row: IWarehouseNotShipOrderItem) => {
                    return getStatusDesc(purchaseShippingOptionList, value);
                },
            },
            {
                key: 'storageTime',
                title: '入库时间',
                dataIndex: 'storageTime',
                align: 'center',
                width: 120,
                render: (value: string, row: IWarehouseNotShipOrderItem) => {
                    return {
                        children: utcToLocal(value, ''),
                        props: {
                            rowSpan: row._rowspan || 0,
                        },
                    };
                },
            },
            {
                key: 'deliveryCommandTime',
                title: '发送发货指令时间',
                dataIndex: 'deliveryCommandTime',
                align: 'center',
                width: 120,
                render: (value: string, row: IWarehouseNotShipOrderItem) => {
                    return {
                        children: utcToLocal(value, ''),
                        props: {
                            rowSpan: row._rowspan || 0,
                        },
                    };
                },
            },
            {
                key: 'cancelTime',
                title: '取消订单时间',
                dataIndex: 'cancelTime',
                align: 'center',
                width: 120,
                render: (value: string, row: IWarehouseNotShipOrderItem) => {
                    return {
                        children: utcToLocal(value, ''),
                        props: {
                            rowSpan: row._rowspan || 0,
                        },
                    };
                },
            },
            {
                key: '_goodsTotalAmount',
                title: '商品总金额',
                dataIndex: '_goodsTotalAmount',
                align: 'center',
                width: 120,
                render: (_: any, row: IWarehouseNotShipOrderItem) => {
                    // console.log(row);
                    const { goodsAmount, goodsNumber, freight } = row;
                    const totalAmount = Number(goodsAmount) * goodsNumber + (Number(freight) || 0);
                    return {
                        children: isNaN(totalAmount) ? totalAmount : totalAmount.toFixed(2),
                        props: {
                            rowSpan: row._rowspan || 0,
                        },
                    };
                },
            },
            {
                key: 'channelOrderGoodsSn',
                title: '渠道订单ID',
                dataIndex: 'channelOrderGoodsSn',
                align: 'center',
                width: 120,
                render: mergeCell,
            },
            {
                key: 'channelSource',
                title: '销售店铺名称',
                dataIndex: 'channelSource',
                align: 'center',
                width: 120,
                render: mergeCell,
            },
            {
                key: 'confirmTime',
                title: '订单确认时间',
                dataIndex: 'confirmTime',
                align: 'center',
                width: 120,
                render: (value: string, row: IWarehouseNotShipOrderItem) => {
                    return {
                        children: utcToLocal(value, ''),
                        props: {
                            rowSpan: row._rowspan || 0,
                        },
                    };
                },
            },
            {
                key: 'referWaybillNo',
                title: '参考订单号',
                dataIndex: 'referWaybillNo',
                align: 'center',
                width: 120,
                render: mergeCell,
            },
            {
                key: 'warehouseId',
                title: '仓库名称',
                dataIndex: 'warehouseId',
                align: 'center',
                width: 120,
                render: (value: string, row: IWarehouseNotShipOrderItem) => {
                    return {
                        children: getStatusDesc(warehouseList, value),
                        props: {
                            rowSpan: row._rowspan || 0,
                        },
                    };
                },
            },
        ];
    }, [warehouseList]);

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
        const list = getOrderGoodsIdList();
        return [
            <CancelOrder orderGoodsIds={list} onReload={onSearch} getAllTabCount={getAllTabCount}>
                <Button
                    key="channel_order"
                    type="primary"
                    className={formStyles.formBtn}
                    disabled={list.length ? false : true}
                >
                    取消渠道订单
                </Button>
            </CancelOrder>,
        ];
    }, [getOrderGoodsIdList]);

    useEffect(() => {
        onSearch();
        _getWarehouseList();
    }, []);

    return useMemo(() => {
        return (
            <>
                {search}
                <FitTable
                    bordered={true}
                    rowKey={record => {
                        return record.purchasePlanId || record.orderGoodsId;
                    }}
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
                    onOKey={_postExportWarehouseNotShip}
                    onCancel={onClose}
                />
            </>
        );
    }, [page, pageSize, total, loading, orderList, visible]);
};

export default PaneWarehouseNotShip;

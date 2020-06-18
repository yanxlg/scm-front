import React, { useMemo, useRef, useCallback, useState, useEffect } from 'react';
import { notification, Checkbox, Button } from 'antd';
import {
    JsonForm,
    LoadingButton,
    AutoEnLargeImg,
    FitTable,
    useModal,
    PopConfirmLoadingButton,
} from 'react-components';
import { JsonFormRef, FormField } from 'react-components/es/JsonForm';
import { IWaitPaySearch, IWaitPayOrderItem } from '@/interface/IOrder';
import {
    getPayOrderList,
    delChannelOrders,
    postExportPay,
    putConfirmPay,
    delPurchaseOrders,
    queryShopList,
} from '@/services/order-manage';
import { utcToLocal } from 'react-components/es/utils/date';
import {
    defaultOptionItem,
    defaultOptionItem1,
    purchasePlatformOptionList,
    purchaseReserveOptionList,
} from '@/enums/OrderEnum';
import { TableProps } from 'antd/es/table';
import QRCode from 'qrcode.react';
import Export from '@/components/Export';

import formStyles from 'react-components/es/JsonForm/_form.less';
import CancelOrder from './CancelOrder';

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
        type: 'textarea',
        name: 'purchase_parent_order_sn',
        label: '采购父订单ID',
        className: 'order-input',
        placeholder: '请输入',
        formatter: 'multipleToArray',
    },
    {
        type: 'dateRanger',
        name: ['purchase_order_stime', 'purchase_order_etime'],
        label: '采购订单生成时间',
        className: 'order-date-picker',
        formatter: ['start_date', 'end_date'],
    },
];

const defaultInitialValues = {
    purchase_platform: 100,
};

const PaneWarehouseNotShip: React.FC<IProps> = ({ getAllTabCount }) => {
    const orderListRef = useRef<IWaitPayOrderItem[]>([]);
    const searchRef = useRef<JsonFormRef>(null);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(50);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);
    const [orderList, setOrderList] = useState<IWaitPayOrderItem[]>([]);

    let currentSearchParams: IWaitPaySearch | null = null;

    const selectedOrderGoodsIdList = useMemo(() => {
        const parentOrdersSnList = orderList
            .filter(item => item._checked)
            .map(item => item.purchase_parent_order_sn);
        const list = orderList
            .filter(
                item =>
                    parentOrdersSnList.indexOf(item.purchase_parent_order_sn) > -1 &&
                    item.order_goods_id,
            )
            .map(item => item.order_goods_id);
        return [...new Set(list)];
    }, [orderList]);

    const _setOrderList = useCallback(list => {
        orderListRef.current = list;
        setOrderList(list);
    }, []);

    const onSearch = useCallback(
        (paginationParams = { page, page_count: pageSize }) => {
            const params: IWaitPaySearch = Object.assign(
                {
                    page,
                    page_count: pageSize,
                },
                paginationParams,
                searchRef.current?.getFieldsValue(),
            );
            setLoading(true);
        },
        [page, pageSize],
    );

    const getOrderList = useCallback(list => {
        const ret: IWaitPayOrderItem[] = [];
        list.forEach((item: any) => {
            const {
                child_order,
                purchase_pay_status_desc: parent_purchase_pay_status_desc,
                ...parentRest
            } = item;
            child_order.forEach((childItem: any, index: number) => {
                const payItem = {
                    ...parentRest,
                    ...childItem,
                    parent_purchase_pay_status_desc,
                };
                if (index === 0) {
                    payItem._rowspan = child_order.length;
                    payItem._checked = false;
                    payItem._childIds = child_order.map((item: any) => {
                        return item.order_goods_id;
                    });
                }
                ret.push(payItem);
            });
        });
        return ret;
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

    const onSelectedRow = useCallback((row: IWaitPayOrderItem) => {
        // console.log('onSelectedRow');
        _setOrderList(
            orderListRef.current.map(item => {
                if (
                    item._rowspan &&
                    row.purchase_parent_order_sn === item.purchase_parent_order_sn
                ) {
                    return {
                        ...item,
                        _checked: !row._checked,
                    };
                }
                return item;
            }),
        );
    }, []);

    const mergeCell = useCallback((value: string | number, row: IWaitPayOrderItem) => {
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

    const _cancelPurchaseOrder = useCallback(
        (orderGoodsIds?: string[]) => {
            return delPurchaseOrders({
                order_goods_ids: orderGoodsIds || selectedOrderGoodsIdList,
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
        [selectedOrderGoodsIdList],
    );

    const _postExportPay = useCallback((values: any) => {
        return postExportPay({
            ...currentSearchParams,
            ...values,
        });
    }, []);

    const _confirmPay = useCallback(
        (id: string) => {
            const planIdList = orderList
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
        [orderList],
    );

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

    const columns = useMemo<TableProps<IWaitPayOrderItem>['columns']>(() => {
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
                render: (value: boolean, row: IWaitPayOrderItem) => {
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
                key: 'operations',
                title: '操作',
                dataIndex: 'operations',
                align: 'center',
                fixed: 'left',
                width: 150,
                render: (value: string, row: IWaitPayOrderItem) => {
                    const { _childIds = [] } = row;
                    const ids = _childIds.filter(item => Boolean(item));
                    const length = ids.length;
                    return {
                        children: (
                            <>
                                <PopConfirmLoadingButton
                                    popConfirmProps={{
                                        disabled: length === 0,
                                        title: '确定要取消该采购订单吗？',
                                        onConfirm: () => _cancelPurchaseOrder(ids),
                                    }}
                                    buttonProps={{
                                        disabled: length === 0,
                                        type: 'link',
                                        children: '取消采购订单',
                                    }}
                                />
                                <CancelOrder
                                    key={'2'}
                                    orderGoodsIds={ids}
                                    onReload={onSearch}
                                    getAllTabCount={getAllTabCount}
                                >
                                    <Button type="link" disabled={length === 0}>
                                        取消销售订单
                                    </Button>
                                </CancelOrder>
                            </>
                        ),
                        props: {
                            rowSpan: row._rowspan || 0,
                        },
                    };
                },
            },
            {
                key: 'purchase_order_time',
                title: '采购计划生成时间',
                dataIndex: 'purchase_order_time',
                align: 'center',
                width: 150,
                render: (value: string, row: IWaitPayOrderItem) => {
                    return {
                        children: utcToLocal(value, ''),
                        props: {
                            rowSpan: row._rowspan || 0,
                        },
                    };
                },
            },
            {
                key: 'purchase_parent_order_sn',
                title: '供应商父订单ID',
                dataIndex: 'purchase_parent_order_sn',
                align: 'center',
                width: 150,
                render: mergeCell,
            },
            {
                key: 'purchase_pay_url',
                title: '支付二维码',
                dataIndex: 'purchase_pay_url',
                align: 'center',
                width: 140,
                render: (value: string, row: IWaitPayOrderItem) => {
                    const { purchase_parent_order_sn, parent_purchase_pay_status_desc } = row;
                    return {
                        children:
                            parent_purchase_pay_status_desc !== '已支付' ? (
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
                                        <QRCode
                                            value={value}
                                            size={40}
                                            className="order-qr-small"
                                        />
                                    </AutoEnLargeImg>
                                    <div>
                                        <Button
                                            ghost={true}
                                            size="small"
                                            type="primary"
                                            style={{ marginTop: 6 }}
                                            onClick={() => _confirmPay(purchase_parent_order_sn)}
                                        >
                                            确认支付
                                        </Button>
                                    </div>
                                </div>
                            ) : (
                                parent_purchase_pay_status_desc
                            ),
                        props: {
                            rowSpan: row._rowspan || 0,
                        },
                    };
                },
            },
            {
                key: 'purchase_total_amount',
                title: '采购总金额($)',
                dataIndex: 'purchase_total_amount',
                align: 'center',
                width: 150,
                render: mergeCell,
            },
            {
                key: 'parent_purchase_pay_status_desc',
                title: '采购支付状态',
                dataIndex: 'parent_purchase_pay_status_desc',
                align: 'center',
                width: 120,
                render: mergeCell,
            },

            {
                key: 'purchase_order_sn',
                title: '子订单ID',
                dataIndex: 'purchase_order_sn',
                align: 'center',
                width: 140,
            },
            {
                key: 'purchase_order_sn',
                title: 'Commodity ID',
                dataIndex: 'purchase_order_sn',
                align: 'center',
                width: 140,
            },
            {
                key: 'purchase_plan_id',
                title: '计划子项ID',
                dataIndex: 'purchase_plan_id',
                align: 'center',
                width: 120,
            },
            {
                key: 'purchase_order_status_desc',
                title: '采购计划状态',
                dataIndex: 'purchase_order_status_desc',
                align: 'center',
                width: 120,
            },
            {
                key: 'purchase_pay_status_desc',
                title: '采购子订单支付状态',
                dataIndex: 'purchase_pay_status_desc',
                align: 'center',
                width: 160,
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
        console.log(selectedOrderGoodsIdList);
        const disabled = selectedOrderGoodsIdList.length === 0 ? true : false;
        return [
            <LoadingButton
                key="purchase_order"
                type="primary"
                className={formStyles.formBtn}
                onClick={_cancelPurchaseOrder as any}
                disabled={disabled}
            >
                取消采购订单
            </LoadingButton>,
            <CancelOrder
                key="2"
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
                    取消销售订单
                </Button>
            </CancelOrder>,
        ];
    }, [selectedOrderGoodsIdList, _cancelPurchaseOrder]);

    useEffect(() => {
        onSearch();
    }, []);

    return useMemo(() => {
        return (
            <>
                {search}
                <FitTable
                    bordered={true}
                    rowKey="purchase_plan_id"
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
                    onOKey={_postExportPay}
                    onCancel={onClose}
                />
            </>
        );
    }, [page, pageSize, total, loading, orderList, visible]);
};

export default PaneWarehouseNotShip;
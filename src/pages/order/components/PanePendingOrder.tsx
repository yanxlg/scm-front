import React, { useMemo, useRef, useCallback, useState, useEffect } from 'react';
import { notification, Checkbox, Button } from 'antd';
import {
    JsonForm,
    LoadingButton,
    FitTable,
    useModal,
    AutoEnLargeImg,
    useModal2,
} from 'react-components';
import { JsonFormRef, FormField } from 'react-components/es/JsonForm';
import { IPendingOrderSearch, IPendingOrderItem } from '@/interface/IOrder';
import {
    getOrderGoodsDetail,
    getPendingOrderList,
    postExportPendingOrder,
    postOrdersPlace,
    queryPendingCount,
} from '@/services/order-manage';
import { utcToLocal } from 'react-components/es/utils/date';
import {
    defaultOptionItem,
    purchaseOrderOptionList,
    defaultOptionItem1,
    purchasePlanCancelOptionList,
    purchaseReserveOptionList,
} from '@/enums/OrderEnum';
import { TableProps } from 'antd/es/table';

import formStyles from 'react-components/es/JsonForm/_form.less';
import { getStatusDesc } from '@/utils/transform';
import Export from '@/components/Export';
import CancelOrder from './CancelOrder';
import { FormInstance } from 'antd/es/form';
import styles from './_pending.less';
import { IChildOrderItem } from '@/pages/order/components/PaneAll';
import { EmptyObject } from '@/config/global';
import TakeOrdersRecordModal from '@/pages/order/components/TakeOrdersRecordModal';
import classNames from 'classnames';
import SimilarStyleModal from '@/pages/order/components/similarStyle/SimilarStyleModal';
import { getCategoryList } from '@/services/global';
import { getCategoryName, getCategoryLowestLevel } from '@/utils/utils';
import { IOptionItem } from 'react-components/es/JsonForm/items/Select';
import { PermissionComponent } from 'rc-permission';
import { useDispatch, useSelector } from '@@/plugin-dva/exports';
import { ConnectState } from '@/models/connect';

declare interface IProps {
    getAllTabCount(): void;
}

const categoryFieldList: FormField[] = [
    {
        type: 'select',
        label: '一级类目',
        key: 'first_category',
        name: 'first_category',
        // className: 'order-input',
        initialValue: '',
        syncDefaultOption: defaultOptionItem1,
        optionList: () => getCategoryList(),
        onChange: (name, form) => {
            form.resetFields(['second_category']);
            form.resetFields(['third_category']);
        },
    },
    {
        type: 'select',
        label: '二级类目',
        key: 'second_category',
        name: 'second_category',
        // className: 'order-input',
        initialValue: '',
        optionListDependence: {
            name: 'first_category',
            key: 'children',
        },
        syncDefaultOption: defaultOptionItem1,
        optionList: () => getCategoryList(),
        onChange: (name, form) => {
            form.resetFields(['third_category']);
        },
    },
    {
        type: 'select',
        label: '三级类目',
        key: 'third_category',
        name: 'third_category',
        // className: 'order-input',
        initialValue: '',
        optionListDependence: {
            name: ['first_category', 'second_category'],
            key: 'children',
        },
        syncDefaultOption: defaultOptionItem1,
        optionList: () => getCategoryList(),
    },
];

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
    const cacheList = useRef<any[]>([]);
    const [update, setUpdate] = useState(0);
    const categoryRef = useRef<IOptionItem[]>([]);
    const [allCategoryList, setAllCategoryList] = useState<IOptionItem[]>([]);

    const dispatch = useDispatch();

    const purchaseErrorMap = useSelector((state: ConnectState) => state.options.platformErrorMap);

    useEffect(() => {
        dispatch({
            type: 'permission/queryMerchantList',
        });
        dispatch({
            type: 'options/purchaseError',
        });
    }, []);

    const [counts, setCounts] = useState({
        penddingFailOrderCount: 0,
        penddingOrderCount: 0,
        samePenddingOrderCount: 0,
        waitPenddingOrderCount: 0,
    });
    // 统计
    useEffect(() => {
        queryPendingCount().then(
            ({
                data: {
                    penddingFailOrderCount = 0,
                    penddingOrderCount = 0,
                    samePenddingOrderCount = 0,
                    waitPenddingOrderCount = 0,
                } = EmptyObject,
            }) => {
                setCounts({
                    penddingFailOrderCount,
                    penddingOrderCount,
                    samePenddingOrderCount,
                    waitPenddingOrderCount,
                });
            },
        );
        getCategoryList().then(list => {
            categoryRef.current = list;
            setAllCategoryList(list);
        });
    }, []);

    const [status, setStatus] = useState(1);

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
            const {
                first_category = '',
                second_category = '',
                third_category = '',
                ...searchData
            } = searchRef.current?.getFieldsValue() as any;
            const params: IPendingOrderSearch = Object.assign(
                {
                    page,
                    page_count: pageSize,
                },
                paginationParams,
                {
                    ...searchData,
                    three_level_catogry_code: getCategoryLowestLevel(
                        categoryRef.current,
                        first_category,
                        second_category,
                        third_category,
                    ),
                },
                searchRef1.current?.getFieldsValue(),
                searchRef2.current?.getFieldsValue(),
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
                        _setOrderList(filterOrderList(list));
                    }
                })
                .finally(() => {
                    setLoading(false);
                });
        },
        [page, pageSize],
    );

    const filterOrderList = useCallback(list => {
        cacheList.current = list;
        const childOrderList: IPendingOrderItem[] = [];
        list.forEach((goodsItem: any) => {
            const { orderGoods, orderInfo } = goodsItem;
            const { orderGoodsPurchasePlan, ...orderRest } = orderGoods;
            const {
                currency,
                confirmTime,
                channelOrderSn,
                channelSource,
                channelMerchantName,
            } = orderInfo;
            if (orderGoodsPurchasePlan) {
                let purchasePlanList = [...orderGoodsPurchasePlan];
                // 重新生成筛选
                const { showRecreated } = searchRef2.current?.getFieldsValue() ?? {};
                if (!showRecreated) {
                    purchasePlanList = purchasePlanList.filter(
                        (item: any) => item.purchaseOrderStatus !== 6,
                    );
                }
                // 生成采购计划
                purchasePlanList.forEach((purchaseItem: any, index: number) => {
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
                        channelMerchantName,
                    };
                    if (index === 0) {
                        childOrderItem._rowspan = purchasePlanList.length;
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
                    channelMerchantName,
                    ...orderRest,
                    _rowspan: 1,
                    _checked: false,
                });
            }
        });
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
            default:
                return [
                    {
                        type: 'select',
                        name: 'product_shop',
                        label: '销售店铺名称',
                        syncDefaultOption: defaultOptionItem1,
                        optionList: {
                            type: 'select',
                            selector: (state: ConnectState) => {
                                return state?.permission?.merchantList;
                            },
                        },
                        formatter: 'plainToArr',
                    },
                    {
                        type: 'textarea',
                        name: 'order_goods_id',
                        label: '子订单ID',
                        placeholder: '请输入',
                        formatter: 'multipleToArray',
                    },
                    {
                        type: 'textarea',
                        name: 'commodity_id',
                        label: 'Commodity ID',
                        placeholder: '请输入',
                        formatter: 'multipleToArray',
                    },
                    {
                        type: 'textarea',
                        name: 'purchase_plan_id',
                        label: '采购计划ID',
                        placeholder: '请输入',
                        formatter: 'multipleToArray',
                    },
                    ...categoryFieldList,
                    {
                        type: 'dateRanger',
                        name: ['order_time_start', 'order_time_end'],
                        label: '订单生成时间',
                        placeholder: '请选择订单时间',
                        formatter: ['start_date', 'end_date'],
                        className: styles.formPicker,
                    },
                    {
                        type: 'dateRanger',
                        name: ['purchase_plan_create_time_start', 'purchase_plan_create_time_end'],
                        label: '采购计划生成时间',
                        placeholder: '请选择订单时间',
                        formatter: ['start_date', 'end_date'],
                        className: styles.formPicker,
                    },
                ];

            case 3:
                return [
                    {
                        type: 'select',
                        name: 'product_shop',
                        label: '销售店铺名称',
                        syncDefaultOption: defaultOptionItem1,
                        optionList: {
                            type: 'select',
                            selector: (state: ConnectState) => {
                                return state?.permission?.merchantList;
                            },
                        },
                        formatter: 'plainToArr',
                    },
                    {
                        type: 'select',
                        name: 'reserve_status',
                        label: '仓库库存预定状态',
                        optionList: [defaultOptionItem, ...purchaseReserveOptionList],
                    },
                    {
                        type: 'select',
                        name: 'purchase_order_status',
                        label: '采购计划状态',
                        optionList: [defaultOptionItem, ...purchaseOrderOptionList],
                    },
                    {
                        type: 'select@2',
                        name: 'scm_error_code',
                        label: '失败原因',
                        labelClassName: 'order-label-next1',
                        options: {
                            selector: (state: ConnectState) => state.options.platformErrorList,
                        },
                        childrenProps: {
                            mode: 'multiple',
                            maxTagCount: 2,
                            placeholder: '请选择失败原因',
                        },
                    },
                    {
                        type: 'select',
                        name: 'purchase_plan_cancel_type',
                        label: '采购单取消类型',
                        optionList: [defaultOptionItem, ...purchasePlanCancelOptionList],
                    },
                    {
                        type: 'textarea',
                        name: 'order_goods_id',
                        label: '子订单ID',
                        placeholder: '请输入',
                        formatter: 'multipleToArray',
                    },
                    {
                        type: 'textarea',
                        name: 'commodity_id',
                        label: 'Commodity ID',
                        placeholder: '请输入',
                        formatter: 'multipleToArray',
                    },
                    {
                        type: 'textarea',
                        name: 'purchase_plan_id',
                        label: '采购计划ID',
                        placeholder: '请输入',
                        formatter: 'multipleToArray',
                    },
                    ...categoryFieldList,
                    {
                        type: 'dateRanger',
                        name: ['order_time_start', 'order_time_end'],
                        label: '订单生成时间',
                        className: styles.formPicker,
                        placeholder: '请选择订单时间',
                        formatter: ['start_date', 'end_date'],
                    },
                    {
                        type: 'dateRanger',
                        name: ['purchase_plan_create_time_start', 'purchase_plan_create_time_end'],
                        label: '采购计划生成时间',
                        className: styles.formPicker,
                        placeholder: '请选择订单时间',
                        formatter: ['start_date', 'end_date'],
                    },
                ];
            case 4:
                return [
                    {
                        type: 'select',
                        name: 'product_shop',
                        label: '销售店铺名称',
                        syncDefaultOption: defaultOptionItem1,
                        optionList: {
                            type: 'select',
                            selector: (state: ConnectState) => {
                                return state?.permission?.merchantList;
                            },
                        },
                        formatter: 'plainToArr',
                    },
                    {
                        type: 'select',
                        name: 'purchase_order_status',
                        label: '采购计划状态',
                        optionList: [defaultOptionItem, ...purchaseOrderOptionList],
                    },
                    {
                        type: 'textarea',
                        name: 'order_goods_id',
                        label: '子订单ID',
                        placeholder: '请输入',
                        formatter: 'multipleToArray',
                    },
                    {
                        type: 'textarea',
                        name: 'commodity_id',
                        label: 'Commodity ID',
                        placeholder: '请输入',
                        formatter: 'multipleToArray',
                    },
                    {
                        type: 'textarea',
                        name: 'purchase_plan_id',
                        label: '采购计划ID',
                        placeholder: '请输入',
                        formatter: 'multipleToArray',
                    },
                    ...categoryFieldList,
                    {
                        type: 'dateRanger',
                        name: ['order_time_start', 'order_time_end'],
                        label: '订单生成时间',
                        className: styles.formPicker,
                        placeholder: '请选择订单时间',
                        formatter: ['start_date', 'end_date'],
                    },
                    {
                        type: 'dateRanger',
                        name: ['purchase_plan_create_time_start', 'purchase_plan_create_time_end'],
                        label: '采购计划生成时间',
                        className: styles.formPicker,
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
                name: 'purchase_order_combine_status',
                label: '拍单状态',
                options: [
                    {
                        label: `待拍单(${counts.waitPenddingOrderCount})`,
                        value: 1,
                    },
                    {
                        label: `拍单中(${counts.penddingOrderCount})`,
                        value: 2,
                    },
                    {
                        label: `拍单失败(${counts.penddingFailOrderCount})`,
                        value: 3,
                    },
                    {
                        label: `相似款代拍中(${counts.samePenddingOrderCount})`,
                        value: 4,
                    },
                ],
                onChange: (name, form) => {
                    searchRef.current?.resetFields();
                    setPage(1);
                    setPageSize(50);
                    setTotal(0);
                    _setOrderList([]);
                    setStatus(form.getFieldValue('purchase_order_combine_status'));
                },
            },
            {
                type: 'layout',
                className: classNames(formStyles.flex1, formStyles.flexRow),
                fieldList: [],
                footer: (
                    <React.Fragment>
                        <div className={formStyles.flex1} />
                        <div className={formStyles.formItem}>
                            <Button type="link" onClick={() => showModal(true)}>
                                查看拍单记录
                            </Button>
                        </div>
                    </React.Fragment>
                ),
            },
        ];
    }, [counts]);

    useEffect(() => {
        handleClickSearch();
    }, [status]);

    const search = useMemo(() => {
        return (
            <>
                <JsonForm
                    ref={searchRef1}
                    initialValues={{
                        purchase_order_combine_status: 1,
                    }}
                    fieldList={statusFormFields}
                />
                <JsonForm
                    ref={searchRef}
                    fieldList={formFieldsState}
                    labelClassName={styles.formLabel}
                    initialValues={{
                        product_shop: '',
                        reserve_status: 100,
                        purchase_order_status: 100,
                        purchase_plan_cancel_type: 100,
                    }}
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
    }, [loading, status, counts]);

    const searchForm1 = useMemo(() => {
        return (
            <JsonForm
                // layout={status === 4 ? 'inline' : 'horizontal'}
                key={'form1'}
                ref={searchRef2}
                containerClassName={status === 4 ? '' : undefined}
                initialValues={{
                    purchase_fail_filter_type: 3,
                }}
                fieldList={
                    status === 3
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
                                      _setOrderList(filterOrderList(cacheList.current));
                                      setUpdate(update => update + 1);
                                  },
                                  formatter: 'join',
                              },
                              {
                                  type: 'checkboxGroup',
                                  name: 'show_similar_orders',
                                  options: [
                                      {
                                          label: '仅展示相似款订单',
                                          value: 1,
                                      },
                                  ],
                                  onChange: (name: string, form: FormInstance) => {
                                      handleClickSearch();
                                  },
                                  formatter: 'join',
                              },
                              {
                                  type: 'radioGroup',
                                  name: 'purchase_fail_filter_type',
                                  label: '处理方式',
                                  formItemClassName: styles.formItem,
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
                                  onChange: (name: string, form: FormInstance) => {
                                      handleClickSearch();
                                  },
                              },
                          ]
                        : [
                              {
                                  type: 'checkboxGroup',
                                  name: 'showRecreated',
                                  formItemClassName: status === 4 ? '' : undefined,
                                  options: [
                                      {
                                          label: '展示已重新生成',
                                          value: true,
                                      },
                                  ],
                                  onChange: (name: string, form: FormInstance) => {
                                      _setOrderList(filterOrderList(cacheList.current));
                                      setUpdate(update => update + 1);
                                  },
                                  formatter: 'join',
                              },
                          ]
                }
            />
        );
    }, [status]);

    const _getOrderGoodsDetail = useCallback((productId: string) => {
        return getOrderGoodsDetail(productId).then(res => {
            const { worm_goodsinfo_link } = res.data;
            window.open(worm_goodsinfo_link);
        });
    }, []);

    const [similarModal, showSimilarModal, hideSimilarModal] = useModal2<{
        order_goods_id: string;
        purchase_plan_id: string;
    }>();

    const similarModalComponent = useMemo(() => {
        return (
            <SimilarStyleModal
                visible={similarModal}
                onClose={hideSimilarModal}
                onReload={onSearch}
            />
        );
    }, [similarModal]);

    const columns = useMemo<TableProps<IPendingOrderItem>['columns']>(() => {
        switch (status) {
            default:
            case 1:
            case 2:
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
                        width: 180,
                        render: mergeCell,
                    },
                    {
                        key: 'productName',
                        title: '商品名称',
                        dataIndex: 'productName',
                        align: 'center',
                        width: 200,
                        render: (value, row) => {
                            const { productId } = row;
                            return {
                                children: (
                                    <a onClick={() => _getOrderGoodsDetail(productId)}>{value}</a>
                                ),
                                props: {
                                    rowSpan: row._rowspan || 0,
                                },
                            };
                        },
                    },
                    {
                        key: 'productImage',
                        title: 'SKU图片',
                        dataIndex: 'productImage',
                        align: 'center',
                        width: 100,
                        render: (value: string, row) => {
                            return {
                                children: <AutoEnLargeImg src={value} className="order-img-lazy" />,
                                props: {
                                    rowSpan: row._rowspan || 0,
                                },
                            };
                        },
                    },
                    {
                        key: 'productStyle',
                        title: '商品规格',
                        dataIndex: 'productStyle',
                        align: 'center',
                        width: 180,
                        render: (value: string, row) => {
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
                            return {
                                children: child,
                                props: {
                                    rowSpan: row._rowspan || 0,
                                },
                            };
                        },
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
                        width: 160,
                        render: (_, row: IChildOrderItem) => {
                            const { goodsAmount, goodsNumber, freight } = row;
                            const total =
                                Number(goodsAmount) * goodsNumber + (Number(freight) || 0);
                            return {
                                children: isNaN(total) ? '' : total.toFixed(2),
                                props: {
                                    rowSpan: row._rowspan || 0,
                                },
                            };
                        },
                    },
                    {
                        key: 'channelMerchantName',
                        title: '销售店铺名称',
                        dataIndex: 'channelMerchantName',
                        align: 'center',
                        width: 120,
                        render: mergeCell,
                    },
                    {
                        key: 'channelOrderGoodsSn',
                        title: '销售订单ID',
                        dataIndex: 'channelOrderGoodsSn',
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
                        key: 'purchaseCreateTime',
                        title: '采购计划生成时间',
                        dataIndex: 'purchaseCreateTime',
                        align: 'center',
                        width: 180,
                        render: _ => utcToLocal(_),
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
                        title: '商品最低类目',
                        dataIndex: 'threeLevelCatogryCode',
                        align: 'center',
                        width: 140,
                        render: (value: number) => getCategoryName(String(value), allCategoryList),
                    },
                ];
            case 3:
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
                        key: 'reserveStatus',
                        title: '仓库库存预定状态',
                        dataIndex: 'reserveStatus',
                        align: 'center',
                        width: 160,
                        render: (value: string, row: IPendingOrderItem) => {
                            return {
                                children: getStatusDesc(purchaseReserveOptionList, value),
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
                        width: 180,
                        render: mergeCell,
                    },
                    {
                        key: 'scmErrorCode',
                        title: '拍单失败原因',
                        dataIndex: 'scmErrorCode',
                        align: 'center',
                        width: 200,
                        render: (value, row) => {
                            const reason = purchaseErrorMap?.[value];
                            const reasonStr = reason ? `${reason}` : '';
                            // 0代拍，1爬取中，2爬取成功，3爬取失败
                            const status = Number(row.similarGoodsStatus);
                            const purchaseOrderStatus = row.purchaseOrderStatus;
                            return (
                                <div>
                                    <div>{reasonStr}</div>
                                    {purchaseOrderStatus === 7 && (
                                        <div>
                                            {status === 0 ? (
                                                <PermissionComponent
                                                    pid="order/similar_pay"
                                                    control="tooltip"
                                                >
                                                    <Button
                                                        type="link"
                                                        onClick={() =>
                                                            showSimilarModal({
                                                                order_goods_id: row.orderGoodsId,
                                                                purchase_plan_id: row.purchasePlanId as string,
                                                            })
                                                        }
                                                    >
                                                        相似款代拍
                                                    </Button>
                                                </PermissionComponent>
                                            ) : status === 1 || status === 5 ? (
                                                <PermissionComponent
                                                    pid="order/similar_pay"
                                                    control="tooltip"
                                                >
                                                    <Button
                                                        type="link"
                                                        onClick={() =>
                                                            showSimilarModal({
                                                                order_goods_id: row.orderGoodsId,
                                                                purchase_plan_id: row.purchasePlanId as string,
                                                            })
                                                        }
                                                    >
                                                        代拍详情-爬取中
                                                    </Button>
                                                </PermissionComponent>
                                            ) : status === 3 ? (
                                                <PermissionComponent
                                                    pid="order/similar_pay"
                                                    control="tooltip"
                                                >
                                                    <Button
                                                        type="link"
                                                        danger={true}
                                                        onClick={() =>
                                                            showSimilarModal({
                                                                order_goods_id: row.orderGoodsId,
                                                                purchase_plan_id: row.purchasePlanId as string,
                                                            })
                                                        }
                                                    >
                                                        代拍详情-爬取失败
                                                    </Button>
                                                </PermissionComponent>
                                            ) : null}
                                        </div>
                                    )}
                                </div>
                            );
                        },
                    },
                    {
                        key: 'productName',
                        title: '商品名称',
                        dataIndex: 'productName',
                        align: 'center',
                        width: 200,
                        render: (value, row) => {
                            const { productId } = row;
                            return {
                                children: (
                                    <a onClick={() => _getOrderGoodsDetail(productId)}>{value}</a>
                                ),
                                props: {
                                    rowSpan: row._rowspan || 0,
                                },
                            };
                        },
                    },
                    {
                        key: 'productImage',
                        title: 'SKU图片',
                        dataIndex: 'productImage',
                        align: 'center',
                        width: 100,
                        render: (value: string, row) => {
                            return {
                                children: <AutoEnLargeImg src={value} className="order-img-lazy" />,
                                props: {
                                    rowSpan: row._rowspan || 0,
                                },
                            };
                        },
                    },
                    {
                        key: 'productStyle',
                        title: '商品规格',
                        dataIndex: 'productStyle',
                        align: 'center',
                        width: 180,
                        render: (value: string, row) => {
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
                            return {
                                children: child,
                                props: {
                                    rowSpan: row._rowspan || 0,
                                },
                            };
                        },
                    },
                    {
                        key: 'channelMerchantName',
                        title: '销售店铺名称',
                        dataIndex: 'channelMerchantName',
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
                        key: 'purchaseCreateTime',
                        title: '采购计划生成时间',
                        dataIndex: 'purchaseCreateTime',
                        align: 'center',
                        width: 180,
                        render: _ => utcToLocal(_),
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
                        key: 'cancelType',
                        title: '采购单取消类型',
                        dataIndex: 'cancelType',
                        align: 'center',
                        width: 150,
                        render: value => getStatusDesc(purchasePlanCancelOptionList, value),
                    },
                    {
                        title: '商品最低类目',
                        dataIndex: 'threeLevelCatogryCode',
                        align: 'center',
                        width: 140,
                        render: (value: number) => getCategoryName(String(value), allCategoryList),
                    },
                ];
            case 4:
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
                        width: 180,
                        render: mergeCell,
                    },
                    {
                        key: 'productName',
                        title: '商品名称',
                        dataIndex: 'productName',
                        align: 'center',
                        width: 200,
                        render: (value, row) => {
                            const { productId } = row;
                            return {
                                children: (
                                    <a onClick={() => _getOrderGoodsDetail(productId)}>{value}</a>
                                ),
                                props: {
                                    rowSpan: row._rowspan || 0,
                                },
                            };
                        },
                    },
                    {
                        key: 'productImage',
                        title: 'SKU图片',
                        dataIndex: 'productImage',
                        align: 'center',
                        width: 100,
                        render: (value: string, row) => {
                            return {
                                children: <AutoEnLargeImg src={value} className="order-img-lazy" />,
                                props: {
                                    rowSpan: row._rowspan || 0,
                                },
                            };
                        },
                    },
                    {
                        key: 'productStyle',
                        title: '商品规格',
                        dataIndex: 'productStyle',
                        align: 'center',
                        width: 180,
                        render: (value: string, row) => {
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
                            return {
                                children: child,
                                props: {
                                    rowSpan: row._rowspan || 0,
                                },
                            };
                        },
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
                        width: 160,
                        render: (_, row: IChildOrderItem) => {
                            const { goodsAmount, goodsNumber, freight } = row;
                            const total =
                                Number(goodsAmount) * goodsNumber + (Number(freight) || 0);
                            return {
                                children: isNaN(total) ? '' : total.toFixed(2),
                                props: {
                                    rowSpan: row._rowspan || 0,
                                },
                            };
                        },
                    },
                    {
                        key: 'channelMerchantName',
                        title: '销售店铺名称',
                        dataIndex: 'channelMerchantName',
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
                        key: 'purchaseCreateTime',
                        title: '采购计划生成时间',
                        dataIndex: 'purchaseCreateTime',
                        align: 'center',
                        width: 180,
                        render: _ => utcToLocal(_),
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
                        title: '商品最低类目',
                        dataIndex: 'threeLevelCatogryCode',
                        align: 'center',
                        width: 140,
                        render: (value: number) => getCategoryName(String(value), allCategoryList),
                    },
                ];
        }
    }, [status, allCategoryList, purchaseErrorMap]);

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
            case 1:
            case 3:
                return [
                    <PermissionComponent key="place_order" pid="order/post_order" control="tooltip">
                        <LoadingButton
                            type="primary"
                            className={formStyles.formBtn}
                            onClick={_postOrdersPlace}
                            disabled={disabled}
                        >
                            一键拍单
                        </LoadingButton>
                    </PermissionComponent>,
                    <CancelOrder
                        key={'cancel'}
                        orderGoodsIds={selectedOrderGoodsIdList}
                        onReload={onSearch}
                        getAllTabCount={getAllTabCount}
                    >
                        <PermissionComponent
                            key="purchase_order"
                            pid="order/cancel_order"
                            control="tooltip"
                        >
                            <Button
                                key="channel_order"
                                type="primary"
                                className={formStyles.formBtn}
                                disabled={disabled}
                            >
                                取消订单
                            </Button>
                        </PermissionComponent>
                    </CancelOrder>,
                ];
            case 2:
                return [
                    <CancelOrder
                        key={'cancel'}
                        orderGoodsIds={selectedOrderGoodsIdList}
                        onReload={onSearch}
                        getAllTabCount={getAllTabCount}
                    >
                        <PermissionComponent
                            key="purchase_order"
                            pid="order/cancel_order"
                            control="tooltip"
                        >
                            <Button
                                key="channel_order"
                                type="primary"
                                className={formStyles.formBtn}
                                disabled={disabled}
                            >
                                取消订单
                            </Button>
                        </PermissionComponent>
                    </CancelOrder>,
                ];
            case 4:
                return [searchForm1];
        }
    }, [selectedOrderGoodsIdList, _postOrdersPlace, _postExportPendingOrder, status]);

    const [modal, showModal, hideModal] = useModal2<boolean>();

    return useMemo(() => {
        return (
            <>
                {search}
                {status === 4 ? null : searchForm1}
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
                <TakeOrdersRecordModal visible={modal} onClose={hideModal} />
                {similarModalComponent}
            </>
        );
    }, [
        page,
        pageSize,
        total,
        loading,
        orderList,
        visible,
        status,
        update,
        counts,
        modal,
        similarModal,
        allCategoryList,
        purchaseErrorMap,
    ]);
};

export default PaneWarehouseNotShip;

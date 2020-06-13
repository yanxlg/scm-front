import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { FitTable, useModal, useList, AutoEnLargeImg } from 'react-components';
import { Button } from 'antd';
import '@/styles/index.less';
import '@/styles/stock.less';
import { ColumnProps, TableProps } from 'antd/es/table';
import { unixToStartDate, unixToEndDate, utcToLocal } from 'react-components/es/utils/date';
import { JsonFormRef, FormField } from 'react-components/es/JsonForm';
import { JsonForm } from 'react-components';
import {
    exportInList,
    exportOutList,
    queryInList,
    queryLogistics,
    queryOutList,
} from '@/services/stock';
import CopyLink from '@/components/copyLink';
import queryString from 'query-string';
import {
    InStockState,
    InStockStateCode,
    InStockStateList,
    OutStockState,
    OutStockStateCode,
    OutStockStateList,
    StockType,
    WarehouseList,
    WarehouseMap,
    WarehouseMapCode,
} from '@/config/dictionaries/Stock';
import { isEmptyObject } from '@/utils/utils';
import { carrierList, defaultPageNumber, defaultPageSize } from '@/config/global';
import { LoadingButton } from 'react-components';
import { IStockInItem, IStockOutItem } from '@/interface/IStock';
import formStyles from 'react-components/es/JsonForm/_form.less';
import Export from '@/components/Export';
import { AddressModal } from './AddressModal';

declare interface IInOutStockProps {
    type: typeof StockType[keyof typeof StockType]; //1:出库管理，2入库管理
}

const scroll: TableProps<IStockInItem | IStockOutItem>['scroll'] = {
    x: true,
    scrollToFirstRowOnChange: true,
};

const InOutStock: React.FC<IInOutStockProps> = ({ type }) => {
    const formRef = useRef<JsonFormRef>(null);

    const { visible, setVisibleProps: setOrderVisible, onClose } = useModal<
        IStockOutItem['orderAddress']
    >();

    const columns = useMemo(() => {
        if (type === StockType.In) {
            return [
                {
                    title: '仓库名',
                    width: '150px',
                    dataIndex: 'warehouseId',
                    align: 'center',
                    render: (value: WarehouseMapCode, row) => {
                        return WarehouseMap[value];
                    },
                },
                {
                    title: '创建时间',
                    width: '150px',
                    dataIndex: 'createTime',
                    align: 'center',
                },
                {
                    title: '中台商品ID',
                    width: '150px',
                    dataIndex: 'commodityId',
                    align: 'center',
                },
                {
                    title: '商品SKU ID',
                    width: '150px',
                    dataIndex: 'commoditySkuId',
                    align: 'center',
                },
                {
                    title: '入库单ID',
                    width: '150px',
                    dataIndex: 'referWaybillNo',
                    align: 'center',
                },
                {
                    title: '商品主图',
                    width: '150px',
                    dataIndex: 'productImageUrl',
                    align: 'center',
                    render: _ => <AutoEnLargeImg className="stock-img" src={_} />,
                },
                {
                    title: '入库单状态',
                    width: '150px',
                    dataIndex: 'boundStatus',
                    align: 'center',
                    render: (_: InStockStateCode) => InStockState[_],
                },
                {
                    title: '采购运单ID',
                    width: '150px',
                    dataIndex: 'purchaseWaybillNo',
                    align: 'center',
                },
                {
                    title: '物流商',
                    width: '150px',
                    dataIndex: 'purchaseShippingName',
                    align: 'center',
                },
                {
                    title: '采购订单ID',
                    width: '150px',
                    dataIndex: 'purchaseOrderGoodsId',
                    align: 'center',
                },
                {
                    title: '预报商品数',
                    width: '150px',
                    dataIndex: 'purchaseGoodsNumber',
                    align: 'center',
                },
                {
                    title: '实际入库数',
                    width: '150px',
                    dataIndex: 'waybillNumber',
                    align: 'center',
                },
                {
                    title: '商品重量（g）',
                    width: '150px',
                    dataIndex: 'inboundWeight',
                    align: 'center',
                },
                {
                    title: '入库时间',
                    width: '150px',
                    dataIndex: 'inWarehouseTime',
                    align: 'center',
                    render: _ => utcToLocal(_),
                },
            ] as ColumnProps<IStockInItem>[];
        }
        return [
            {
                title: '仓库名',
                width: '150px',
                dataIndex: 'warehouseId',
                align: 'center',
                render: (value: WarehouseMapCode, row) => {
                    return {
                        children: WarehouseMap[value],
                        props: {
                            rowSpan: row.rowSpan || 0,
                        },
                    };
                },
            },
            {
                title: '参考运单号',
                width: '150px',
                dataIndex: 'referWaybillNo',
                align: 'center',
                render: (value, row) => {
                    return {
                        children: value,
                        props: {
                            rowSpan: row.rowSpan || 0,
                        },
                    };
                },
            },
            {
                title: '目的国',
                width: '150px',
                dataIndex: ['orderAddress', 'country'],
                align: 'center',
                render: (value, row) => {
                    return {
                        children: value,
                        props: {
                            rowSpan: row.rowSpan || 0,
                        },
                    };
                },
            },
            {
                title: '收货地址',
                width: '150px',
                align: 'center',
                render: (value, row) => {
                    return {
                        children: (
                            <Button type="link" onClick={() => setOrderVisible(row.orderAddress)}>
                                查看地址
                            </Button>
                        ),
                        props: {
                            rowSpan: row.rowSpan || 0,
                        },
                    };
                },
            },
            {
                title: '出库单状态',
                width: '150px',
                dataIndex: 'orderGoodsShippingStatus',
                align: 'center',
                render: (value: OutStockStateCode, row) => {
                    return {
                        children: OutStockState[value],
                        props: {
                            rowSpan: row.rowSpan || 0,
                        },
                    };
                },
            },
            {
                title: '尾程运单ID',
                width: '150px',
                dataIndex: 'lastWaybillNo',
                align: 'center',
                render: (value, row) => {
                    return {
                        children: value,
                        props: {
                            rowSpan: row.rowSpan || 0,
                        },
                    };
                },
            },
            {
                title: '物流商',
                width: '150px',
                dataIndex: 'carrierName',
                align: 'center',
                render: (value, row) => {
                    return {
                        children: value,
                        props: {
                            rowSpan: row.rowSpan || 0,
                        },
                    };
                },
            },
            {
                title: '渠道订单ID',
                width: '150px',
                dataIndex: 'channelOrderGoodsSn',
                align: 'center',
            },
            {
                title: '中台订单ID',
                width: '150px',
                dataIndex: 'orderGoodsId',
                align: 'center',
            },
            {
                title: '中台商品ID',
                width: '150px',
                dataIndex: 'commodityId',
                align: 'center',
            },
            {
                title: '商品SKU ID',
                width: '150px',
                dataIndex: 'skuId',
                align: 'center',
            },
            {
                title: '商品图片',
                width: '150px',
                dataIndex: 'productImage',
                align: 'center',
                render: _ => <AutoEnLargeImg className="stock-img" src={_} />,
            },
            {
                title: '出库数',
                width: '150px',
                dataIndex: 'goodsNumber',
                align: 'center',
            },
            {
                title: '发送发货指令时间',
                width: '150px',
                dataIndex: 'deliveryCommandTime',
                align: 'center',
                render: value => (value ? utcToLocal(value) : ''),
            },
            {
                title: '出库重量',
                width: '150px',
                dataIndex: 'totalWeight',
                align: 'center',
                render: (value, row) => {
                    const { weightUnit = 'g', rowSpan = 0 } = row;
                    return {
                        children: value + ' ' + weightUnit,
                        props: {
                            rowSpan: rowSpan,
                        },
                    };
                },
            },
            {
                title: '出库时间',
                width: '150px',
                dataIndex: 'deliveryTime',
                align: 'center',
                render: (value, row) => {
                    return {
                        children: utcToLocal(value),
                        props: {
                            rowSpan: row.rowSpan || 0,
                        },
                    };
                },
            },
            {
                title: '揽收时间',
                width: '150px',
                dataIndex: 'collectTime',
                align: 'center',
                render: (value, row) => {
                    return {
                        children: value ? utcToLocal(value) : '',
                        props: {
                            rowSpan: row.rowSpan || 0,
                        },
                    };
                },
            },
        ] as ColumnProps<IStockOutItem>[];
    }, []);

    const fieldList = useMemo<FormField[]>(() => {
        if (type === StockType.In) {
            return [
                {
                    type: 'dateRanger',
                    label: '创建时间',
                    name: ['create_start_time', 'create_end_time'],
                    className: 'stock-form-picker',
                    formatter: ['start_date', 'end_date'],
                },
                {
                    type: 'dateRanger',
                    label: '入库时间',
                    name: ['in_warehouse_start_time', 'in_warehouse_end_time'],
                    className: 'stock-form-picker',
                    formatter: ['start_date', 'end_date'],
                },
                {
                    type: 'select',
                    label: '入库单状态',
                    name: 'bound_status',
                    defaultValue: '',
                    optionList: [
                        {
                            name: '全部',
                            value: '',
                        },
                        ...InStockStateList,
                    ],
                },
                {
                    type: 'textarea',
                    label: '采购订单ID',
                    name: 'purchase_order_goods_id',
                    formatter: 'multipleToArray',
                },
                /*       {
                    type: 'input',
                    label: '入库单ID',
                    name: 'refer_waybill_no',
                    formatter: 'multipleToArray',
                },*/
                {
                    type: 'select',
                    label: '物流商',
                    name: 'purchase_shipping_name',
                    defaultValue: '',
                    optionList: [
                        {
                            name: '全部',
                            value: '',
                        },
                        ...carrierList,
                    ],
                },
                {
                    type: 'textarea',
                    label: '采购运单ID',
                    name: 'purchase_waybill_no',
                    formatter: 'multipleToArray',
                },
                {
                    type: 'textarea',
                    label: '中台商品ID',
                    name: 'commodity_id',
                    formatter: 'multipleToArray',
                },
                {
                    type: 'textarea',
                    label: '商品SKU ID',
                    name: 'commodity_sku_id',
                    formatter: 'multipleToArray',
                },
                {
                    type: 'textarea',
                    label: '入库单ID',
                    name: 'refer_waybill_no',
                    formatter: 'multipleToArray',
                },
                {
                    type: 'select',
                    label: '仓库名',
                    name: 'warehouse_id',
                    defaultValue: '',
                    optionList: [
                        {
                            name: '全部',
                            value: '',
                        },
                        ...WarehouseList,
                    ],
                },
            ];
        }
        return [
            {
                type: 'dateRanger',
                label: '出库时间',
                name: ['delivery_time_start', 'delivery_time_end'],
                className: 'stock-form-picker',
                formatter: ['start_date', 'end_date'],
            },
            {
                type: 'dateRanger',
                label: '发送出库指令时间',
                name: ['delivery_command_time_start', 'delivery_command_time_end'],
                className: 'stock-form-picker',
                formatter: ['start_date', 'end_date'],
            },
            {
                type: 'select',
                label: '出库单状态',
                name: 'order_goods_shipping_status',
                formatter: 'number',
                defaultValue: '',
                optionList: [
                    {
                        name: '全部',
                        value: '',
                    },
                    ...OutStockStateList,
                ],
            },
            {
                type: 'textarea',
                label: '渠道订单ID',
                name: 'channel_order_goods_sn',
                formatter: 'multipleToArray',
            },
            {
                type: 'textarea',
                label: '中台订单ID',
                name: 'order_goods_id',
                formatter: 'multipleToArray',
            },
            {
                type: 'select',
                label: '物流商',
                name: 'carrier_id',
                defaultValue: '',
                syncDefaultOption: {
                    value: '',
                    name: '全部',
                },
                optionList: () =>
                    queryLogistics().then(({ data = [] }) => {
                        return data.map(({ carrier_name, carrier_id }) => {
                            return { name: carrier_name, value: carrier_id };
                        });
                    }),
            },
            {
                type: 'textarea',
                label: '尾程运单ID',
                name: 'last_waybill_no',
                formatter: 'multipleToArray',
            },
            {
                type: 'textarea',
                label: '中台商品ID',
                name: 'commodity_id',
                formatter: 'multipleToArray',
            },
            {
                type: 'textarea',
                label: '商品SKU ID',
                name: 'sku_id',
                formatter: 'multipleToArray',
            },
            {
                type: 'textarea',
                label: '参考运单号',
                name: 'refer_waybill_no',
                formatter: 'multipleToArray',
            },
            {
                type: 'select',
                label: '仓库名',
                name: 'warehouse_id',
                defaultValue: '',
                optionList: [
                    {
                        name: '全部',
                        value: '',
                    },
                    ...WarehouseList,
                ],
            },
        ];
    }, []);

    const {
        pageSize: page_size,
        pageNumber: page_number,
        ...defaultInitialValues
    } = useMemo(() => {
        // copy link 解析
        const { query, url } = queryString.parseUrl(window.location.href);
        if (!isEmptyObject(query)) {
            window.history.replaceState({}, '', url);
        }
        const {
            pageNumber = defaultPageNumber,
            pageSize = defaultPageSize,
            time_start = 0,
            time_end = 0,
            ...extra
        } = query;
        return {
            pageNumber: Number(pageNumber),
            pageSize: Number(pageSize),
            time_start: unixToStartDate(Number(time_start)),
            time_end: unixToEndDate(Number(time_end)),
            ...extra,
        };
    }, []);

    const {
        query,
        loading,
        pageNumber,
        pageSize,
        dataSource,
        total,
        onSearch,
        onChange,
        onReload,
    } = useList<IStockInItem | IStockOutItem>({
        queryList: type === StockType.In ? queryInList : queryOutList,
        formRef: formRef,
        defaultState: {
            pageSize: page_size,
            pageNumber: page_number,
        },
    });

    const getCopiedLinkQuery = useCallback(() => {
        return {
            ...query,
            tabKey: type === StockType.Out ? '2' : type === StockType.In ? '1' : '3',
        };
    }, [loading]);

    const onExport = useCallback((extra: any) => {
        const values = formRef.current!.getFieldsValue();
        const exportService = type === StockType.In ? exportInList : exportOutList;
        return exportService({ ...values, ...extra });
    }, []);

    const { visible: exportModal, onClose: closeExportModal, setVisibleProps } = useModal<
        boolean
    >();

    const exportComponent = useMemo(() => {
        return (
            <Export
                columns={columns}
                visible={exportModal}
                onOKey={onExport}
                onCancel={closeExportModal}
            />
        );
    }, [exportModal]);

    const pagination = useMemo(() => {
        return {
            total: total,
            current: pageNumber,
            pageSize: pageSize,
            showSizeChanger: true,
            position: ['topRight', 'bottomRight'],
        } as any;
    }, [loading]);

    const table = useMemo(() => {
        return (
            <FitTable<IStockInItem | IStockOutItem>
                bordered={true}
                rowKey={type === StockType.In ? 'purchaseOrderGoodsId' : 'skuId'}
                scroll={scroll}
                bottom={150}
                minHeight={400}
                pagination={pagination}
                columns={columns as ColumnProps<any>[]}
                dataSource={dataSource as any[]}
                // toolBarRender={toolBarRender}
                loading={loading}
                onChange={onChange}
            />
        );
    }, [loading]);

    const form = useMemo(() => {
        return (
            <JsonForm
                labelClassName="stock-form-label"
                ref={formRef}
                fieldList={fieldList}
                initialValues={defaultInitialValues}
            >
                <div>
                    <LoadingButton onClick={onSearch} type="primary" className={formStyles.formBtn}>
                        查询
                    </LoadingButton>
                    <LoadingButton onClick={onReload} className={formStyles.formBtn}>
                        刷新
                    </LoadingButton>
                    <Button onClick={() => setVisibleProps(true)} className={formStyles.formBtn}>
                        导出
                    </Button>
                </div>
            </JsonForm>
        );
    }, [loading]);

    const addressModal = useMemo(() => {
        return <AddressModal visible={visible} onClose={onClose} />;
    }, [visible]);

    return useMemo(() => {
        return (
            <div>
                {form}
                {table}
                <CopyLink getCopiedLinkQuery={getCopiedLinkQuery} />
                {exportComponent}
                {addressModal}
            </div>
        );
    }, [loading, exportModal, visible]);
};

export { InOutStock };

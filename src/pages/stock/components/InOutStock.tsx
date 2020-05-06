import React, { useCallback, useMemo, useRef } from 'react';
import { ProTable, FitTable, useModal } from 'react-components';
import { Button, message } from 'antd';
import '@/styles/index.less';
import '@/styles/stock.less';
import { ColumnProps, TableProps } from 'antd/es/table';
import { unixToStartDate, unixToEndDate } from 'react-components/es/utils/date';
import { JsonFormRef, FormField } from 'react-components/es/JsonForm';
import { JsonForm } from 'react-components';
import { exportInList, exportOutList, queryInList, queryOutList } from '@/services/stock';
import CopyLink from '@/components/copyLink';
import queryString from 'query-string';
import { StockType } from '@/config/dictionaries/Stock';
import { isEmptyObject } from '@/utils/utils';
import { carrierList, defaultPageNumber, defaultPageSize } from '@/config/global';
import { useList } from '@/utils/hooks';
import { LoadingButton } from 'react-components';
import { RequestPagination } from '@/interface/IGlobal';
import { IStockINFormData, IStockInItem, IStockOutItem } from '@/interface/IStock';
import formStyles from 'react-components/es/JsonForm/_form.less';
import Export from '@/components/Export';

declare interface IInOutStockProps {
    type: typeof StockType[keyof typeof StockType]; //1:出库管理，2入库管理
}

const scroll: TableProps<IStockInItem | IStockOutItem>['scroll'] = {
    x: true,
    scrollToFirstRowOnChange: true,
};

const InOutStock: React.FC<IInOutStockProps> = ({ type }) => {
    const formRef = useRef<JsonFormRef>(null);

    const columns = useMemo<ColumnProps<IStockInItem | IStockOutItem>[]>(() => {
        if (type === StockType.In) {
            return [
                {
                    title: '入库时间',
                    width: '150px',
                    dataIndex: 'inboundTime',
                    align: 'center',
                },
                {
                    title: '入库订单号',
                    width: '180px',
                    dataIndex: 'inboundOrderSn',
                    align: 'center',
                },
                {
                    title: '采购订单号',
                    width: '180px',
                    dataIndex: 'purchaseOrderSn',
                    align: 'center',
                },
                {
                    title: '首程运单号',
                    width: '180px',
                    dataIndex: 'firstWaybillNo',
                    align: 'center',
                },
                {
                    title: '计划入库数量',
                    width: '100px',
                    dataIndex: 'planedQuantity',
                    align: 'center',
                },
                {
                    title: '实际入库数量',
                    width: '100px',
                    dataIndex: 'quantity',
                    align: 'center',
                },
                {
                    title: '中台商品ID',
                    width: '150px',
                    dataIndex: 'commodity_id',
                    align: 'center',
                },
            ];
        }
        return [
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
                dataIndex: 'commodity_id',
                align: 'center',
                render: (value, row) => {
                    return {
                        children: <Button type="link">查看地址</Button>,
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
            },
            {
                title: '出库数',
                width: '150px',
                dataIndex: 'goodsNumber',
                align: 'center',
            },
            {
                title: '揽收重量（g）',
                width: '150px',
                dataIndex: 'totalWeight',
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
                title: '出库时间',
                width: '150px',
                dataIndex: 'deliveryTime',
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
                title: '发送发货指令时间',
                width: '150px',
                dataIndex: 'deliveryCommandTime',
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
        ] as ColumnProps<IStockOutItem>[];
    }, []);

    const fieldList = useMemo<FormField[]>(() => {
        if (type === StockType.In) {
            return [
                {
                    type: 'dateRanger',
                    label: <span>入库&emsp;时间</span>,
                    name: ['time_start', 'time_end'],
                    className: 'stock-form-picker',
                    formatter: ['start_date', 'end_date'],
                },
                {
                    type: 'input',
                    label: '入库订单号',
                    name: 'inbound_order_sn',
                },
                {
                    type: 'input',
                    label: '采购订单号',
                    name: 'purchase_order_sn',
                },
                {
                    type: 'input',
                    label: '中台商品ID',
                    name: 'commodity_id',
                },
            ];
        }
        return [
            {
                type: 'dateRanger',
                label: <span>出库&emsp;时间</span>,
                name: ['delivery_time_start', 'delivery_time_end'],
                className: 'stock-form-picker',
                formatter: ['start_date', 'end_date'],
            },
            {
                type: 'dateRanger',
                label: '发送出库指令时间',
                name: ['delivery_command_time_end', 'order_goods_shipping_status'],
                className: 'stock-form-picker',
                formatter: ['start_date', 'end_date'],
            },
            {
                type: 'select',
                label: '入库单状态',
                name: 'order_goods_shipping_status',
                className: 'stock-form-picker',
                formatter: 'number',
                defaultValue: '',
                optionList: [
                    {
                        name: '全部',
                        value: '',
                    },
                    {
                        name: '出库中',
                        value: 5,
                    },
                    {
                        name: '出库成功',
                        value: 8,
                    },
                    {
                        name: '已取消',
                        value: 7,
                    },
                    {
                        name: '出库异常',
                        value: 6,
                    },
                ],
            },
            {
                type: 'input',
                label: '渠道订单ID',
                name: 'channel_order_goods_sn',
            },
            {
                type: 'input',
                label: '中台订单ID',
                name: 'order_goods_id',
            },
            {
                type: 'select',
                label: '物流商',
                name: 'carrier_id',
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
                type: 'input',
                label: '尾程运单ID',
                name: 'last_waybill_no',
            },
            {
                type: 'input',
                label: '中台商品ID',
                name: 'commodity_id',
            },
            {
                type: 'input',
                label: '商品SKU ID',
                name: 'sku_id',
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
    } = useList<IStockInItem | IStockOutItem, IStockINFormData & RequestPagination>({
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

    const toolBarRender = useCallback(() => {
        return [
            <Button
                key="export"
                onClick={() => setVisibleProps(true)}
                className={formStyles.formBtn}
            >
                导出Excel表
            </Button>,
        ];
    }, []);

    const table = useMemo(() => {
        return (
            <FitTable<IStockInItem | IStockOutItem>
                rowKey={type === StockType.In ? 'inboundOrderSn' : 'outboundOrderSn'}
                scroll={scroll}
                bottom={150}
                minHeight={400}
                pagination={pagination}
                toolBarRender={toolBarRender}
                columns={columns}
                dataSource={dataSource}
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
                enableCollapse={false}
            >
                <div>
                    <LoadingButton onClick={onSearch} type="primary" className={formStyles.formBtn}>
                        查询
                    </LoadingButton>
                    <LoadingButton onClick={onReload} className={formStyles.formBtn}>
                        刷新
                    </LoadingButton>
                </div>
            </JsonForm>
        );
    }, []);

    return useMemo(() => {
        return (
            <div>
                {form}
                {table}
                <CopyLink getCopiedLinkQuery={getCopiedLinkQuery} />
                {exportComponent}
            </div>
        );
    }, [loading, exportModal]);
};

export { InOutStock };

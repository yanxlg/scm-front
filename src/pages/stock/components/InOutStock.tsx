import React, { useCallback, useMemo, useRef } from 'react';
import { ProTable, FitTable } from 'react-components';
import { message } from 'antd';
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
import { defaultPageNumber, defaultPageSize } from '@/config/global';
import { useList } from '@/utils/hooks';
import { LoadingButton } from 'react-components';
import { RequestPagination } from '@/interface/IGlobal';
import { SearchOutlined } from '@ant-design/icons';
import { Icons } from '@/components/Icon';
import { IStockINFormData, IStockInItem, IStockOutItem } from '@/interface/IStock';
import formStyles from 'react-components/es/JsonForm/_form.less';
import classNames from 'classnames';

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
                title: '中台商品ID',
                width: '150px',
                dataIndex: 'commodity_id',
                align: 'center',
            },
            {
                title: '出库时间',
                width: '150px',
                dataIndex: 'outboundTime',
                align: 'center',
            },
            {
                title: '出库单号',
                width: '180px',
                dataIndex: 'outboundOrderSn',
                align: 'center',
            },
            {
                title: '计划出库数量',
                width: '100px',
                dataIndex: 'planedQuantity',
                align: 'center',
            },
            {
                title: '实际出库数量',
                width: '100px',
                dataIndex: 'quantity',
                align: 'center',
            },
            {
                title: '尾程运单号',
                width: '180px',
                dataIndex: 'lastWaybillNo',
                align: 'center',
            },
        ];
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
                name: ['time_start', 'time_end'],
                className: 'stock-form-picker',
                formatter: ['start_date', 'end_date'],
            },
            {
                type: 'input',
                label: '出库订单号',
                name: 'outbound_order_sn',
            },
            {
                type: 'input',
                label: '尾程运单号',
                name: 'last_waybill_no',
            },
            {
                type: 'input',
                label: '中台商品ID',
                name: 'commodity_id',
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

    const onExport = useCallback(() => {
        const values = formRef.current!.getFieldsValue();
        const exportService = type === StockType.In ? exportInList : exportOutList;
        return exportService(values).catch(() => {
            message.error('导出失败!');
        });
    }, []);

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
            <LoadingButton key="export" onClick={onExport} className={formStyles.formBtn}>
                导出Excel表
            </LoadingButton>,
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
            </div>
        );
    }, [loading]);
};

export { InOutStock };

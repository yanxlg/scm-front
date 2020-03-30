import React, { useCallback, useMemo, useRef } from 'react';
import { FitTable } from '@/components/FitTable';
import { message, Pagination } from 'antd';
import '@/styles/index.less';
import '@/styles/form.less';
import '@/styles/stock.less';
import { ColumnProps } from 'antd/es/table';
import { convertEndDate, convertStartDate } from '@/utils/date';
import SearchForm, { FormField, SearchFormRef } from '@/components/SearchForm';
import { exportInList, exportOutList, queryInList, queryOutList } from '@/services/stock';
import CopyLink from '@/components/copyLink';
import queryString from 'query-string';
import { StockType } from '@/config/dictionaries/Stock';
import { isEmptyObject } from '@/utils/utils';
import { defaultPageNumber, defaultPageSize, defaultPageSizeOptions } from '@/config/global';
import { useList } from '@/utils/hooks';
import { goButton, showTotal } from '@/components/ProTable';
import LoadingButton from '@/components/LoadingButton';
import { RequestPagination } from '@/interface/IGlobal';
import { SearchOutlined } from '@ant-design/icons/lib';
import { Icons } from '@/components/Icon';
import { IStockINFormData, IStockInItem, IStockOutItem } from '@/interface/IStock';

declare interface IInOutStockProps {
    type: typeof StockType[keyof typeof StockType]; //1:出库管理，2入库管理
}

const InOutStock: React.FC<IInOutStockProps> = ({ type }) => {
    const formRef = useRef<SearchFormRef>(null);

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
                    formItemClassName: 'form-item',
                    className: 'stock-form-picker',
                    formatter: ['start_date', 'end_date'],
                },
                {
                    type: 'input',
                    label: '入库订单号',
                    name: 'inbound_order_sn',
                    formItemClassName: 'form-item',
                    className: 'input-default',
                },
                {
                    type: 'input',
                    label: '采购订单号',
                    name: 'purchase_order_sn',
                    formItemClassName: 'form-item',
                    className: 'input-default',
                },
                {
                    type: 'input',
                    label: '中台商品ID',
                    name: 'commodity_id',
                    formItemClassName: 'form-item',
                    className: 'input-default',
                },
            ];
        }
        return [
            {
                type: 'dateRanger',
                label: <span>出库&emsp;时间</span>,
                name: ['time_start', 'time_end'],
                formItemClassName: 'form-item',
                className: 'stock-form-picker',
                formatter: ['start_date', 'end_date'],
            },
            {
                type: 'input',
                label: '出库订单号',
                name: 'outbound_order_sn',
                formItemClassName: 'form-item',
                className: 'input-default',
            },
            {
                type: 'input',
                label: '尾程运单号',
                name: 'last_waybill_no',
                formItemClassName: 'form-item',
                className: 'input-default',
            },
            {
                type: 'input',
                label: '中台商品ID',
                name: 'commodity_id',
                formItemClassName: 'form-item',
                className: 'input-default',
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
            time_start: convertStartDate(Number(time_start)),
            time_end: convertEndDate(Number(time_end)),
            ...extra,
        };
    }, []);

    const { query, loading, pageNumber, pageSize, dataSource, total, onSearch, onChange } = useList<
        IStockInItem | IStockOutItem,
        IStockINFormData & RequestPagination
    >(type === StockType.In ? queryInList : queryOutList, formRef, undefined, {
        pageSize: page_size,
        pageNumber: page_number,
    });

    const getCopiedLinkQuery = useCallback(() => {
        return {
            ...query.current,
            tabKey: type === StockType.Out ? '2' : type === StockType.In ? '1' : '3',
        };
    }, []);

    const onExport = useCallback(() => {
        const values = formRef.current!.getFieldsValue();
        const exportService = type === StockType.In ? exportInList : exportOutList;
        return exportService(values).catch(() => {
            message.error('导出失败!');
        });
    }, []);

    const onPageChange = useCallback((page: number, pageSize?: number) => {
        onChange({ current: page, pageSize }, {}, {});
    }, []);

    return useMemo(() => {
        return (
            <div>
                <div className="float-clear">
                    <SearchForm
                        labelClassName="stock-form-label"
                        ref={formRef}
                        fieldList={fieldList}
                        initialValues={defaultInitialValues}
                    />
                    <LoadingButton
                        onClick={onSearch}
                        type="primary"
                        className="btn-group vertical-middle form-item"
                        icon={<SearchOutlined />}
                    >
                        查询
                    </LoadingButton>
                    <LoadingButton
                        onClick={onExport}
                        className="btn-group vertical-middle form-item"
                        icon={<Icons type="scm-export" />}
                    >
                        导出Excel表
                    </LoadingButton>
                    <Pagination
                        className="float-right form-item"
                        pageSize={pageSize.current}
                        current={pageNumber.current}
                        total={total}
                        pageSizeOptions={defaultPageSizeOptions}
                        onChange={onPageChange}
                        onShowSizeChange={onPageChange}
                        showSizeChanger={true}
                        showQuickJumper={{
                            goButton: goButton,
                        }}
                        showLessItems={true}
                        showTotal={showTotal}
                    />
                </div>
                <FitTable<IStockInItem | IStockOutItem>
                    className="form-item"
                    rowKey={type === StockType.In ? 'inboundOrderSn' : 'outboundOrderSn'}
                    bordered={true}
                    columns={columns}
                    dataSource={dataSource}
                    pagination={false}
                    loading={loading}
                    scroll={{
                        x: true,
                        scrollToFirstRowOnChange: true,
                    }}
                    bottom={130}
                />
                <CopyLink getCopiedLinkQuery={getCopiedLinkQuery} />
            </div>
        );
    }, [loading]);
};

export { InOutStock };

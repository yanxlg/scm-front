import React, { useCallback, useMemo, useRef } from 'react';
import { FitTable, useModal } from 'react-components';
import { Button, message } from 'antd';
import '@/styles/index.less';
import { ColumnProps, TableProps } from 'antd/es/table';
import { JsonFormRef, FormField } from 'react-components/es/JsonForm';
import { JsonForm } from 'react-components';
import { FormInstance } from 'rc-field-form/lib/interface';
import { exportStockList, queryStockList } from '@/services/stock';
import CopyLink from '@/components/copyLink';
import queryString from 'query-string';
import { AutoEnLargeImg } from 'react-components';
import { isEmptyObject } from '@/utils/utils';
import { defaultPageNumber, defaultPageSize } from '@/config/global';
import { useList } from '@/utils/hooks';
import { IStockRequest, IStockItem, IStockInItem, IStockOutItem } from '@/interface/IStock';
import { RequestPagination } from '@/interface/IGlobal';
import { LoadingButton } from 'react-components';
import formStyles from 'react-components/es/JsonForm/_form.less';
import Export from '@/components/Export';

const scroll: TableProps<IStockInItem | IStockOutItem>['scroll'] = {
    x: true,
    scrollToFirstRowOnChange: true,
};

const StockControl: React.FC = () => {
    const formRef = useRef<JsonFormRef>(null);
    const columns = useMemo<ColumnProps<IStockItem>[]>(() => {
        return [
            {
                title: '商品SKU ID',
                width: '180px',
                dataIndex: 'sku',
                align: 'center',
            },
            {
                title: '中台商品ID',
                width: '180px',
                dataIndex: ['sku_item', 'commodityId'],
                align: 'center',
            },
            {
                title: '商品图片',
                width: '130px',
                dataIndex: ['sku_item', 'mainImageUrl'],
                align: 'center',
                render: (value: string) => <AutoEnLargeImg src={value} className="stock-img" />,
            },
            {
                title: '商品属性',
                width: '130px',
                dataIndex: ['sku_item', 'mainImageUrl'],
                align: 'center',
            },
            {
                title: '可销售库存',
                width: '100px',
                dataIndex: 'can_sale_inventory',
                align: 'center',
            },
            {
                title: '在途库存',
                width: '100px',
                dataIndex: 'transportation_inventory',
                align: 'center',
            },
            {
                title: '锁定库存',
                width: '100px',
                dataIndex: 'bookedInventory',
                align: 'center',
            },

            {
                title: '仓库库存',
                width: '100px',
                dataIndex: 'warehousingInventory',
                align: 'center',
            },
            {
                title: '仓库库存更新时间',
                width: '150px',
                dataIndex: 'lastUpdateTime',
                align: 'center',
            },
        ];
    }, []);
    const fieldsList = useMemo<FormField[]>(() => {
        return [
            {
                type: 'dateRanger',
                label: '仓库库存更新时间',
                name: ['last_update_time_start', 'last_update_time_end'],
                formatter: ['start_date', 'end_date'],
            },
            {
                type: 'input',
                label: '中台商品ID',
                name: 'commodity_id',
            },
            {
                type: 'input',
                label: '商品SKU ID',
                name: 'commodity_sku_id',
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
        const { pageNumber = defaultPageNumber, pageSize = defaultPageSize, ...extra } = query;
        return {
            pageNumber: Number(pageNumber),
            pageSize: Number(pageSize),
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
    } = useList<IStockItem, IStockRequest & RequestPagination>({
        queryList: queryStockList,
        formRef: formRef,
        defaultState: {
            pageSize: page_size,
            pageNumber: page_number,
        },
    });

    const getCopiedLinkQuery = useCallback(() => {
        return {
            ...query,
            tabKey: '3',
        };
    }, [loading]);

    const { visible: exportModal, onClose: closeExportModal, setVisibleProps } = useModal<
        boolean
    >();

    const onExport = useCallback((value: any) => {
        return formRef.current!.validateFields().then(values => {
            return exportStockList({
                ...values,
                ...value,
            });
        });
    }, []);

    const showExport = useCallback(() => {
        formRef.current!.validateFields().then(values => {
            setVisibleProps(true);
        });
    }, []);

    const toolBarRender = useCallback(() => {
        return [
            <Button key="export" onClick={showExport} className={formStyles.formBtn}>
                导出
            </Button>,
        ];
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

    const table = useMemo(() => {
        return (
            <FitTable<IStockItem>
                rowKey={'in_order'}
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
                className={formStyles.formHelpAbsolute}
                initialValues={defaultInitialValues}
                fieldList={fieldsList}
                ref={formRef}
                enableCollapse={false}
            >
                <LoadingButton onClick={onSearch} type="primary" className={formStyles.formBtn}>
                    查询
                </LoadingButton>
                <LoadingButton onClick={onReload} className={formStyles.formBtn}>
                    刷新
                </LoadingButton>
            </JsonForm>
        );
    }, []);

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

export { StockControl };

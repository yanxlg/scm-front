import React, { useCallback, useMemo, useRef } from 'react';
import { FitTable } from 'react-components';
import { message } from 'antd';
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
import { SearchOutlined } from '@ant-design/icons';
import { Icons } from '@/components/Icon';
import formStyles from 'react-components/es/JsonForm/_form.less';
import classNames from 'classnames';

const scroll: TableProps<IStockInItem | IStockOutItem>['scroll'] = {
    x: true,
    scrollToFirstRowOnChange: true,
};

const StockControl: React.FC = () => {
    const formRef = useRef<JsonFormRef>(null);
    const columns = useMemo<ColumnProps<IStockItem>[]>(() => {
        return [
            {
                title: '中台商品ID',
                width: '180px',
                dataIndex: ['sku_item', 'commodityId'],
                align: 'center',
            },
            {
                title: '商品子SKU',
                width: '180px',
                dataIndex: 'sku',
                align: 'center',
            },
            {
                title: 'SKU对应图片',
                width: '130px',
                dataIndex: ['sku_item', 'imageUrl'],
                align: 'center',
                render: (value: string) => <AutoEnLargeImg src={value} className="stock-img" />,
            },
            {
                title: '商品主图',
                width: '130px',
                dataIndex: ['sku_item', 'mainImageUrl'],
                align: 'center',
                render: (value: string) => <AutoEnLargeImg src={value} className="stock-img" />,
            },
            {
                title: 'size',
                width: '128px',
                dataIndex: ['sku_item', 'size'],
                align: 'center',
            },
            {
                title: 'color',
                width: '128px',
                dataIndex: ['sku_item', 'color'],
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
                title: '可销售库存',
                width: '100px',
                dataIndex: 'can_sale_inventory',
                align: 'center',
            },
            {
                title: '仓库库存',
                width: '100px',
                dataIndex: 'warehousingInventory',
                align: 'center',
            },
        ];
    }, []);
    const fieldsList = useMemo<FormField[]>(() => {
        return [
            {
                type: 'input',
                label: '中台商品ID',
                name: 'commodity_id',
                rules: [
                    (form: FormInstance) => {
                        return {
                            validator: (rule, value) => {
                                const sku_id = form.getFieldValue('commodity_sku_id');
                                if (sku_id || value) {
                                    return Promise.resolve();
                                } else {
                                    return Promise.reject('必须输入一个筛选条件');
                                }
                            },
                        };
                    },
                ],
            },
            {
                type: 'input',
                label: 'commodity_sku_id',
                name: 'commodity_sku_id',
                rules: [
                    (form: FormInstance) => {
                        return {
                            validator: (rule, value) => {
                                const commodity_id = form.getFieldValue('commodity_id');
                                if (commodity_id || value) {
                                    return Promise.resolve();
                                } else {
                                    return Promise.reject('必须输入一个筛选条件');
                                }
                            },
                        };
                    },
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
        autoQuery: false,
    });

    const getCopiedLinkQuery = useCallback(() => {
        return {
            ...query,
            tabKey: '3',
        };
    }, []);

    const onExport = useCallback(() => {
        return formRef.current!.validateFields().then(values => {
            return exportStockList(values).catch(() => {
                message.error('导出失败!');
            });
        });
    }, []);

    const toolBarRender = useCallback(() => {
        return [
            <LoadingButton key="export" onClick={onExport} className={formStyles.formBtn}>
                导出Excel表
            </LoadingButton>,
        ];
    }, []);

    const pagination = useMemo(() => {
        return {
            total: total,
            current: pageNumber,
            pageSize: pageSize,
            showSizeChanger: true,
        };
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

export { StockControl };

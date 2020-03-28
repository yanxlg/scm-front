import React, { RefObject, useState, useCallback, useEffect, useMemo } from 'react';
import ReactDOM from 'react-dom';
import { IResponse, IPaginationResponse, RequestPagination } from '@/interface/IGlobal';
import { PaginationConfig } from 'antd/es/pagination';
import { defaultPageNumber, defaultPageSize, EmptyObject } from '@/config/global';
import { SearchFormRef } from '@/components/SearchForm';
import OptimizeCheckbox, { OptimizeCheckboxRef } from '@/components/ProTable/OptimizeCheckbox';
import { ProColumns } from '@ant-design/pro-table/es';
import { GetRowKey, TableRowSelection } from 'antd/es/table/interface';
import { CheckboxChangeEvent } from 'antd/es/checkbox';
import { IProTableProps } from '@/components/ProTable';
import UpdateContainer, { UpdateContainerRef } from '@/components/ProTable/UpdateContainer';

const EmptyArray: string[] = [];

function useList<T, Q extends RequestPagination = any, S = any>(
    queryList: (query: Q) => Promise<IResponse<IPaginationResponse<T>>>,
    searchRef?: RefObject<SearchFormRef>,
    extraQuery?: { [key: string]: any },
    defaultState?: { pageNumber?: number; pageSize?: number },
) {
    const [loading, setLoading] = useState(true);
    const [pageNumber, setPageNumber] = useState(defaultState?.pageNumber ?? defaultPageNumber);
    const [pageSize, setPageSize] = useState(defaultState?.pageSize ?? defaultPageSize);
    const [dataSource, setDataSource] = useState<T[]>([]);
    const [total, setTotal] = useState(0);
    const [query, setQuery] = useState({});
    const [extraData, setExtraData] = useState<S | undefined>(undefined);
    const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>(EmptyArray);

    const getListData = useCallback(
        ({
            page = pageNumber,
            page_count = pageSize,
            ...extra
        }: { page?: number; page_count?: number; [key: string]: any } = {}) => {
            const formValues = searchRef ? searchRef.current!.getFieldsValue() : undefined;
            setLoading(true);
            const query = {
                pageNumber: page,
                pageSize: page_count,
                ...extra,
                ...formValues,
            };
            setQuery(query);
            setSelectedRowKeys(EmptyArray);
            return queryList(query as Q)
                .then(({ data: { total = 0, list = [], ...extraData } = EmptyObject }) => {
                    setDataSource(list);
                    setTotal(total);
                    setPageNumber(page);
                    setPageSize(page_count);
                    setExtraData(extraData);
                })
                .finally(() => {
                    setLoading(false);
                });
        },
        [pageNumber, pageSize],
    );

    const onReload = useCallback(
        () =>
            getListData({
                ...extraQuery,
            }),
        [pageNumber, pageSize, extraQuery],
    );

    const onSearch = useCallback(
        () =>
            getListData({
                page: 1,
                ...extraQuery,
            }),
        [pageNumber, pageSize, extraQuery],
    );

    const onChange = useCallback(
        ({ current, pageSize }: PaginationConfig, filters, sorter) => {
            const sorterConfig =
                sorter && sorter.field
                    ? {
                          sort_by: sorter.field,
                          sort_order: sorter.order,
                      }
                    : {};
            getListData({
                page: current,
                page_count: pageSize,
                ...sorterConfig,
                ...extraQuery,
            });
        },
        [extraQuery],
    );

    useEffect(() => {
        onSearch();
    }, []);

    return {
        query,
        loading,
        pageNumber,
        pageSize,
        dataSource,
        extraData,
        total,
        setLoading,
        setPageNumber,
        setPageSize,
        setDataSource,
        selectedRowKeys,
        setTotal,
        onReload,
        onSearch,
        onChange,
        getListData,
        setSelectedRowKeys,
    };
}

function useModal<T = boolean>() {
    const [visible, setVisible] = useState<T | false>(false);

    const onClose = useCallback(() => {
        setVisible(false);
    }, []);

    const setVisibleProps = useCallback((visibleProps: T) => {
        setVisible(visibleProps);
    }, []);

    return {
        visible,
        onClose,
        setVisibleProps,
    };
}

function useRowSelection<T, U>(props: IProTableProps<T, U>) {
    const {
        rowSelection: _rowSelectionConfig,
        columns,
        rowKey,
        dataSource,
        optimize = true,
    } = props;

    const { fixed, columnWidth, onChange } = _rowSelectionConfig || ({} as TableRowSelection<T>);

    const UpdateContainerRefList: Array<UpdateContainerRef | null> = useMemo(() => {
        return [];
    }, [dataSource]);

    let allCheckedRefList: Array<OptimizeCheckboxRef | null> = useMemo(() => {
        return [];
    }, [dataSource]);

    const itemsRefList: Array<OptimizeCheckboxRef | null> = useMemo(() => {
        return [];
    }, [dataSource]);

    const outerOnChange = useCallback(
        (keys: string[], items: T[]) => {
            if (onChange) {
                onChange(keys, items);
            }
            UpdateContainerRefList.map(item =>
                item?.update({ selectedKeys: keys, selectedRows: items }),
            );
        },
        [onChange],
    );

    const onSelectAll = useCallback(
        (e: CheckboxChangeEvent) => {
            const checked = e.target.checked;
            if (checked) {
                let keys: string[] = [];
                itemsRefList.map(item => {
                    if (item) {
                        item.updateChecked(true);
                        keys.push(item.getValue());
                    }
                });
                outerOnChange(keys, dataSource || []);
            } else {
                itemsRefList.map(item => {
                    item && item.updateChecked(false);
                });
                outerOnChange([], []);
            }
        },
        [onChange, dataSource],
    );

    const SelectedRowKeysWrap = ({
        children,
    }: {
        children: (props: {
            selectedKeys: string[] | undefined;
            selectedRows: T[];
        }) => React.ReactNode[] | null;
    }) => {
        return (
            <UpdateContainer
                ref={ref => {
                    UpdateContainerRefList.push(ref);
                }}
                children={children}
            />
        );
    };

    const onChecked = useCallback(
        (e: CheckboxChangeEvent) => {
            const checked = e.target.checked;
            const value = e.target.value;

            // 从ref中获取keys,不能接收props中selectedKeys，否则columns会发生变化，整个会重新渲染
            let beforeKeys: string[] = [];
            itemsRefList.forEach(item => {
                const values = item?.getValues();
                if (values?.checked) {
                    beforeKeys.push(values.value);
                }
            });
            const set = new Set(beforeKeys);
            if (checked) {
                // 判断全选状态
                set.add(value);
            } else {
                // 判断全选状态
                set.delete(value);
            }
            beforeKeys = Array.from(set);
            const size = beforeKeys.length;
            if (size === 0) {
                allCheckedRefList?.forEach(item => item?.updateChecked(false));
            } else if (size === dataSource!.length) {
                allCheckedRefList?.forEach(item => item?.updateChecked(true));
            } else {
                allCheckedRefList?.forEach(item => item?.setIndeterminate());
            }

            outerOnChange(
                beforeKeys as string[],
                dataSource!.filter((item: any, index) => {
                    const rowValue =
                        typeof rowKey === 'string'
                            ? item[rowKey]
                            : rowKey
                            ? (rowKey as GetRowKey<T>)(item)
                            : index;
                    return beforeKeys.indexOf(rowValue) > -1;
                }),
            );
        },
        [onChange, dataSource],
    );

    const clearCheckedRows = useCallback(
        (callback: boolean = true) => {
            allCheckedRefList?.forEach(item => item?.updateChecked(false));
            itemsRefList.map(item => item && item.updateChecked(false));
            callback && outerOnChange([], []);
        },
        [onChange],
    );

    const optimizeRowSelection = useMemo(() => {
        if (!_rowSelectionConfig) {
            return undefined;
        }
        const isString = typeof rowKey === 'string';
        return {
            title: (
                <OptimizeCheckbox ref={ref => allCheckedRefList.push(ref)} onChange={onSelectAll} />
            ),
            dataIndex: 'checked',
            width: columnWidth,
            align: 'center',
            copyable: false,
            render: (_, record, index) => {
                const rowValue = isString
                    ? (record as any)[rowKey as string]
                    : rowKey
                    ? (rowKey as GetRowKey<T>)(record)
                    : index;
                return (
                    <OptimizeCheckbox
                        value={rowValue}
                        ref={ref => (itemsRefList[index] = ref)}
                        onChange={onChecked}
                    />
                );
            },
            fixed: fixed ? 'left' : undefined,
        } as ProColumns<T>;
    }, [rowKey, fixed, columnWidth]);

    const optimizeColumns = useMemo(() => {
        return [optimizeRowSelection as ProColumns<T>].concat(columns!);
    }, [optimizeRowSelection, columns]);

    return useMemo(() => {
        return {
            columns: !_rowSelectionConfig || !optimize || !columns ? columns : optimizeColumns,
            clearCheckedRows,
            SelectedRowKeysWrap,
        };
    }, [columns, fixed, columnWidth, rowKey]);
}

export { useModal, useList, useRowSelection };

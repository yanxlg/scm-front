import React, { RefObject, useState, useCallback, useEffect } from 'react';
import { IResponse, IPaginationResponse, RequestPagination } from '@/interface/IGlobal';
import { PaginationConfig } from 'antd/es/pagination';
import { defaultPageNumber, defaultPageSize, EmptyObject } from '@/config/global';
import { SearchFormRef } from '@/components/SearchForm';

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

export { useModal, useList };

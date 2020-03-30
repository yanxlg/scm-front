import React, { RefObject, useState, useCallback, useEffect, useRef } from 'react';
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
    autoQuery = true,
) {
    const [loading, setLoading] = useState(autoQuery);

    const extraQueryRef = useRef<{ [key: string]: any } | undefined>(undefined);
    extraQueryRef.current = extraQuery;

    const pageNumber = useRef<number>(defaultState?.pageNumber ?? defaultPageNumber);
    const pageSize = useRef<number>(defaultState?.pageSize ?? defaultPageSize);
    // optimize pageNumber pageSize 静态管理，不进行状态更新，所有更新都通过loading来控制
    // const [pageNumber, setPageNumber] = useState(defaultState?.pageNumber ?? defaultPageNumber);
    // const [pageSize, setPageSize] = useState(defaultState?.pageSize ?? defaultPageSize);
    const [dataSource, setDataSource] = useState<T[]>([]);
    const [total, setTotal] = useState(0);
    const [extraData, setExtraData] = useState<S | undefined>(undefined);
    const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>(EmptyArray);

    const query = useRef<object>({});
    const setQuery = useCallback((nextQuery: object) => {
        query.current = nextQuery;
    }, []);

    const getListData = useCallback(
        ({
            page = pageNumber.current,
            page_count = pageSize.current,
            ...extra
        }: { page?: number; page_count?: number; [key: string]: any } = {}) => {
            return Promise.resolve()
                .then(() => {
                    return searchRef ? searchRef.current!.validateFields() : undefined;
                })
                .then(formValues => {
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
                            pageNumber.current = page;
                            pageSize.current = page_count;
                            setDataSource(list);
                            setTotal(total);
                            setExtraData(extraData);
                        })
                        .finally(() => {
                            setLoading(false);
                        });
                });
        },
        [],
    );

    const onReload = useCallback(
        () =>
            getListData({
                ...extraQueryRef.current,
            }),
        [],
    );

    const onSearch = useCallback(
        () =>
            getListData({
                page: 1,
                page_count: defaultState?.pageSize ?? defaultPageSize,
                ...extraQueryRef.current,
            }),
        [],
    );

    const onChange = useCallback(({ current, pageSize }: PaginationConfig, filters, sorter) => {
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
            ...extraQueryRef.current,
        });
    }, []);

    useEffect(() => {
        if (autoQuery) {
            // 有些场景可能不需要立即调用接口，添加参数控制，默认为true
            onSearch();
        }
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

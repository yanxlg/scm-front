import { RefObject, useState, useCallback, useEffect } from 'react';
import SearchForm from '@/components/SearchForm';
import { IRequestPagination, IResponse, IPaginationResponse } from '@/interface/IGlobal';
import { PaginationConfig } from 'antd/es/pagination';
import { EmptyObject } from '@/config/global';

function useList<T, Q extends IRequestPagination>(
    queryList: (query: Q) => Promise<IResponse<IPaginationResponse<T>>>,
    searchRef?: RefObject<SearchForm>,
    pageSizeKey = 'page_count',
    totalKey = 'total',
    listKey = 'list',
    extraQuery?: { [key: string]: any },
) {
    const [loading, setLoading] = useState(true);
    const [pageNumber, setPageNumber] = useState(1);
    const [pageSize, setPageSize] = useState(50);
    const [dataSource, setDataSource] = useState<T[]>([]);
    const [total, setTotal] = useState(0);

    const getListData = useCallback(
        ({
            page = pageNumber,
            page_count = pageSize,
            ...extra
        }: { page?: number; page_count?: number; [key: string]: any } = {}) => {
            const formValues = searchRef ? searchRef.current!.getFieldsValue() : undefined;
            setLoading(true);
            const query = {
                ...formValues,
                page: page,
                [pageSizeKey]: page_count,
                ...extra,
            };
            return queryList(query as Q)
                .then(({ data = EmptyObject }) => {
                    const total = data[totalKey] || 0;
                    const list = data[listKey] || [];
                    setDataSource(list);
                    setTotal(total);
                    setPageNumber(page);
                    setPageSize(page_count);
                })
                .finally(() => {
                    setLoading(false);
                });
        },
        [pageNumber, pageSize],
    );

    const onReload = useCallback(() => getListData(), [pageNumber, pageSize]);

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
        loading,
        pageNumber,
        pageSize,
        dataSource,
        total,
        setLoading,
        setPageNumber,
        setPageSize,
        setDataSource,
        setTotal,
        onReload,
        onSearch,
        onChange,
        getListData,
    };
}

function useModal<T = string>() {
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

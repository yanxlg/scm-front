import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ProTableProps } from '@ant-design/pro-table/lib/Table';
import { default as DefaultProTable } from '@ant-design/pro-table';
import { Card, Pagination } from 'antd';
import { Key, SorterResult, TableCurrentDataSource } from 'antd/es/table/interface';
import { PaginationConfig } from 'antd/es/pagination';
import cardStyle from '@/styles/_card.less';
import formStyle from '@/styles/_form.less';
import ReactDOM from 'react-dom';
import { debounce } from 'lodash';

const ProTable = <
    T,
    U extends {
        [key: string]: any;
    } = {}
>(
    props: ProTableProps<T, U> & {
        bottom?: number;
        minHeight?: number;
        autoFitY?: boolean;
        children?: React.ReactElement;
    },
) => {
    const [filters, setFilters] = useState<Record<string, Key[] | null>>({});
    const [sorters, setSorters] = useState<SorterResult<T> | SorterResult<T>[]>({});
    const [extra, setExtra] = useState<TableCurrentDataSource<T>>({ currentDataSource: [] });
    const [y, setY] = useState<number | undefined>(undefined);
    const cardRef = useRef<Card>(null);

    const calcX = useMemo(() => {
        const { columns, rowSelection, scroll } = props;
        if (scroll?.x === true || scroll?.x === 'max-content') {
            let x: number = 0;
            if (rowSelection && rowSelection.columnWidth) {
                x += Number(rowSelection.columnWidth) || 0;
            }
            columns?.forEach(column => {
                x += Number(column.width) || 0;
            });
            return x;
        } else {
            return scroll?.x;
        }
    }, [props.columns, props.rowSelection]);

    useEffect(() => {
        const element = ReactDOM.findDOMNode(cardRef.current) as HTMLDivElement;
        const { bottom = 100, minHeight = 500, autoFitY = true } = props;
        const resizeHeight = debounce(
            () => {
                const height =
                    document.body.offsetHeight - element.getBoundingClientRect().top - bottom;
                if ((!minHeight || height >= minHeight) && height > 0) {
                    setY(height);
                } else if (minHeight) {
                    setY(minHeight);
                }
            },
            300,
            {},
        );
        if (autoFitY) {
            resizeHeight();
            window.addEventListener('resize', resizeHeight);
        }
        return () => {
            window.removeEventListener('resize', resizeHeight);
        };
    }, []);

    // sorter,filter会触发
    const onDefaultChange = useCallback(
        (
            _pagination: PaginationConfig,
            filters: Record<string, Key[] | null>,
            sorter: SorterResult<T> | SorterResult<T>[],
            extra: TableCurrentDataSource<T>,
        ) => {
            setFilters(filters);
            setSorters(sorter);
            setExtra(extra);
            const { pagination } = props;
            props.onChange?.(
                pagination ? { pageSize: pagination.pageSize, current: pagination.current } : {},
                filters,
                sorter,
                extra,
            );
        },
        [],
    );
    const onChange = useCallback(
        (current: number, pageSize?: number) => {
            props.onChange &&
                props.onChange({ pageSize: pageSize!, current: current }, filters, sorters, extra);
        },
        [props.onChange, filters, sorters, extra],
    );

    const onShowSizeChange = useCallback(
        (current: number, pageSize: number) => {
            props.onChange &&
                props.onChange({ pageSize: pageSize!, current: current }, filters, sorters, extra);
        },
        [props.onChange, filters, sorters, extra],
    );

    return useMemo(() => {
        const { pagination, scroll, children, ..._props } = props;
        return (
            <Card className={[cardStyle.cardPlain, formStyle.formItem].join(' ')} ref={cardRef}>
                {children}
                <DefaultProTable<T, U>
                    {..._props}
                    pagination={false}
                    onChange={onDefaultChange}
                    scroll={{ ...scroll, x: calcX, y: y }}
                />
                {pagination ? (
                    <Pagination
                        className="ant-table-pagination"
                        pageSizeOptions={['50', '100', '200']}
                        {...pagination}
                        onChange={onChange}
                        onShowSizeChange={onShowSizeChange}
                    />
                ) : null}
            </Card>
        );
    }, [props, y]);
};

export default ProTable;

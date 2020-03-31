import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ColumnsState, ProTableProps } from '@ant-design/pro-table/lib/Table';
import { default as DefaultProTable } from '@ant-design/pro-table';
import { Button, Card, Pagination } from 'antd';
import { Key, SorterResult, TableCurrentDataSource } from 'antd/es/table/interface';
import { PaginationConfig } from 'antd/es/pagination';
import cardStyle from '@/styles/_card.less';
import formStyle from '@/styles/_form.less';
import btnStyle from '@/styles/_btn.less';
import ReactDOM from 'react-dom';
import { debounce } from 'lodash';
import { genColumnKey } from '@ant-design/pro-table/es/component/util';
import { ProColumns } from '@ant-design/pro-table/es';
import { defaultPageSizeOptions } from '@/config/global';

export const showTotal = (total: number) => {
    return <span>共有{total}条</span>;
};

export const goButton = <Button className={btnStyle.btnGo}>Go</Button>;

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

    const calcTotalX = useCallback((_columns?: ProColumns<T>[]) => {
        const { columns, rowSelection, scroll } = props;
        if (scroll?.x === true || scroll?.x === 'max-content') {
            let x: number = 0;
            if (rowSelection && rowSelection.columnWidth) {
                x += parseInt(rowSelection.columnWidth as string) || 0;
            }
            (_columns || columns)?.forEach(column => {
                x += parseInt(column.width as string) || 0;
            });
            return x;
        } else {
            return scroll?.x;
        }
    }, []);

    const calcX = useMemo(() => {
        return calcTotalX();
    }, []);

    const [x, setX] = useState(calcX);

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

    const onColumnsStateChange = useCallback(
        (map: { [key: string]: ColumnsState }) => {
            const { columns = [] } = props;
            const _columns = columns.filter(item => {
                const { key, dataIndex } = item;
                const columnKey = genColumnKey(key, dataIndex);
                if (!columnKey) {
                    return true;
                }
                const config = map[columnKey];
                if (config && config.show === false) {
                    return false;
                }
                return true;
            });
            setX(calcTotalX(_columns));
        },
        [props.onColumnsStateChange],
    );

    return useMemo(() => {
        const { pagination, scroll, children, autoFitY, ..._props } = props;
        return (
            <Card className={[cardStyle.cardPlain, formStyle.formItem].join(' ')} ref={cardRef}>
                {children}
                <DefaultProTable<T, U>
                    {..._props}
                    pagination={false}
                    onChange={onDefaultChange}
                    onColumnsStateChange={onColumnsStateChange}
                    scroll={{ ...scroll, x: x, ...(autoFitY === false ? {} : { y: y }) }}
                />
                {pagination ? (
                    <Pagination
                        className="ant-table-pagination"
                        pageSizeOptions={defaultPageSizeOptions}
                        showQuickJumper={{
                            goButton: goButton,
                        }}
                        showTotal={showTotal}
                        {...pagination}
                        onChange={onChange}
                        onShowSizeChange={onShowSizeChange}
                    />
                ) : null}
            </Card>
        );
    }, [props, y, x]);
};

export default ProTable;

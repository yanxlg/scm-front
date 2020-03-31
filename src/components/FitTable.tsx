import React, { useCallback, useMemo, useRef } from 'react';
import { Table } from 'antd';
import { TableProps } from 'antd/lib/table';
import { useScrollXY } from '@/components/OptimizeProTable/hooks';
import { PaginationConfig } from 'antd/es/pagination';
import { Key, SorterResult, TableCurrentDataSource } from 'antd/lib/table/interface';
import { TablePaginationConfig } from 'antd/es/table';

declare interface IFitTableProps<T> extends TableProps<T> {
    bottom?: number;
    minHeight?: number;
    autoFitY?: boolean;
}

function FitTable<T extends object>({
    bottom = 0,
    minHeight = 500,
    autoFitY = true,
    columns = [],
    rowSelection,
    scroll: propsScroll,
    ...props
}: IFitTableProps<T>) {
    const ref = useRef<HTMLDivElement>(null);
    const scroll = useScrollXY(
        ref,
        bottom,
        minHeight,
        autoFitY,
        columns,
        rowSelection,
        propsScroll,
    );

    return useMemo(() => {
        return (
            <div ref={ref}>
                <Table<T>
                    scroll={scroll}
                    columns={columns}
                    rowSelection={rowSelection}
                    {...props}
                />
            </div>
        );
    }, [props, propsScroll, rowSelection, columns]);
}

export { FitTable };

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Table } from 'antd';
import { TableProps } from 'antd/lib/table';
import { debounce } from 'lodash';

declare interface IFitTableProps<T> extends TableProps<T> {
    bottom?: number;
    minHeight?: number;
    autoFitY?: boolean;
}

function FitTable<T extends object>(props: IFitTableProps<T>) {
    const [y, setY] = useState<number | undefined>(undefined);

    const ref = useRef<HTMLDivElement>(null);

    const calcX = useMemo(() => {
        const { columns, rowSelection, scroll } = props;
        if (scroll?.x === true || scroll?.x === 'max-content') {
            let x: number = 0;
            if (rowSelection && rowSelection.columnWidth) {
                x += parseInt(rowSelection.columnWidth as string) || 0;
            }
            columns?.forEach(column => {
                x += parseInt(column.width as string) || 0;
            });
            return x;
        } else {
            return scroll?.x;
        }
    }, [props.columns, props.rowSelection]);

    useEffect(() => {
        const { bottom = 0, minHeight = 500, autoFitY = true } = props;
        const resizeHeight = debounce(() => {
            const el = ref.current!;
            const height = document.body.offsetHeight - el.getBoundingClientRect().top - bottom;
            if ((!minHeight || height >= minHeight) && height > 0) {
                setY(height);
            } else if (minHeight) {
                setY(minHeight);
            }
        }, 300);

        if (autoFitY) {
            resizeHeight();
            window.addEventListener('resize', resizeHeight);
        }
        return () => {
            window.removeEventListener('resize', resizeHeight);
        };
    }, []);

    return useMemo(() => {
        const { scroll, ..._props } = props;
        return (
            <div ref={ref}>
                <Table<T> {..._props} scroll={{ ...scroll, x: calcX, y: y }} />
            </div>
        );
    }, [props, y]);
}

export { FitTable };

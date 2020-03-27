import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Row, Spin, Col, Checkbox, Form } from 'antd';
import { AutoSizer, List as VList, InfiniteLoader } from 'react-virtualized';
import { ISubTaskIdItem } from '@/interface/ITask';
import { querySubTaskIdList } from '@/services/task';
import { CheckboxChangeEvent } from 'antd/es/checkbox';

declare interface TaskIdListProps {
    task_id: number;
}

const rowColumns = 4;

const TaskIdList: React.FC<TaskIdListProps> = ({ task_id }) => {
    const [dataSet, setDataSet] = useState<ISubTaskIdItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [pageNumber, setPageNumber] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [checkedAll, setCheckedAll] = useState(true);
    const [checkedIds, setCheckedIds] = useState<Set<string>>(new Set());

    const pageSize = useMemo<number>(() => {
        return 400;
    }, []);

    const loadedRowsMap = useMemo<{ [key: number]: 1 }>(() => {
        return {};
    }, []);

    const queryList = useCallback(
        (pageNumberSize: number) => {
            setLoading(true);
            return querySubTaskIdList({
                task_id,
                pageSize,
                pageNumber: pageNumberSize,
            })
                .then(({ data = [] }) => {
                    setDataSet(dataSet.concat(data));
                    if (data.length < pageSize) {
                        setHasMore(false);
                    }
                })
                .finally(() => {
                    setLoading(false);
                });
        },
        [dataSet],
    );

    useEffect(() => {
        queryList(pageNumber);
    }, []);

    const renderItem = useCallback(
        ({ index, key, style }) => {
            let columns = [];
            for (let i = 0; i < rowColumns; i++) {
                const item = dataSet[index * rowColumns + i];
                if (item) {
                    const id = item.plan_id;
                    columns.push(
                        <Col key={`${key}_${i}`} span={24 / rowColumns}>
                            <Checkbox
                                value={id}
                                checked={checkedAll || checkedIds.has(id)}
                                onChange={checkedStateChange}
                            >
                                {id}
                            </Checkbox>
                        </Col>,
                    );
                }
            }
            return (
                <Row style={style} align="middle">
                    {columns}
                </Row>
            );
        },
        [dataSet, checkedIds, checkedAll],
    );

    const isRowLoaded = useCallback(({ index }) => !!loadedRowsMap[index], []);

    const handleInfiniteOnLoad = useCallback(
        ({ startIndex, stopIndex }) => {
            for (let i = startIndex; i <= stopIndex; i++) {
                loadedRowsMap[i] = 1;
            }
            if (startIndex === 0 || loading || !hasMore) {
                return Promise.resolve();
            }
            const rowCount = Math.ceil(dataSet.length / rowColumns) - 1;
            if (stopIndex === rowCount) {
                const number = pageNumber + 1;
                setPageNumber(number);
                return queryList(number);
            } else {
                return Promise.resolve();
            }
        },
        [dataSet, pageNumber, hasMore, loading],
    );

    const onCheckedAllStateChange = useCallback((e: CheckboxChangeEvent) => {
        setCheckedAll(e.target.checked);
    }, []);

    const checkedStateChange = useCallback(
        (e: CheckboxChangeEvent) => {
            const { checked, value } = e.target;
            checked ? checkedIds.add(value) : checkedIds.delete(value);
            const ids = new Set(checkedIds);
            setCheckedIds(ids);
        },
        [checkedIds],
    );

    return useMemo(() => {
        const size = dataSet.length;
        const rowCount = Math.ceil(size / rowColumns);
        return (
            <div style={{ height: 160 }}>
                <Row align="middle" style={{ height: 40 }}>
                    <Col>
                        <Checkbox checked={checkedAll} onChange={onCheckedAllStateChange}>
                            全部子任务
                        </Checkbox>
                        <Spin size="small" spinning={loading} />
                    </Col>
                </Row>
                {size > 0 && (
                    <InfiniteLoader
                        isRowLoaded={isRowLoaded}
                        loadMoreRows={handleInfiniteOnLoad}
                        rowCount={rowCount}
                        minimumBatchSize={1}
                        threshold={4}
                    >
                        {({ onRowsRendered, registerChild }) => (
                            <AutoSizer disableHeight={true}>
                                {({ width }) => (
                                    <VList
                                        overscanRowCount={8}
                                        tabIndex={null}
                                        height={120}
                                        onRowsRendered={onRowsRendered}
                                        rowCount={rowCount}
                                        rowHeight={40}
                                        rowRenderer={renderItem}
                                        width={width}
                                    />
                                )}
                            </AutoSizer>
                        )}
                    </InfiniteLoader>
                )}
            </div>
        );
    }, [dataSet, loading]);
};

export default TaskIdList;
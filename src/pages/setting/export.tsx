import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import Container from '@/components/Container';
import { JsonForm, LoadingButton } from 'react-components';
import { FormField } from 'react-components/es/JsonForm';
import formStyles from 'react-components/es/JsonForm/_form.less';
import { useInterval, useWaterFall } from 'react-components';
import { Card, Col, Row, Progress } from 'antd';
import { AutoSizer, List as VList, InfiniteLoader } from 'react-virtualized';
import dayjs, { Dayjs } from 'dayjs';
import exportStyles from '@/styles/_export.less';
import { Icons } from '@/components/Icon';
import { CloseOutlined } from '@ant-design/icons';
import debounce from 'lodash/debounce';

const fieldList: FormField[] = [
    {
        type: 'input',
        label: '文件名称',
        name: 'file_name',
    },
    {
        type: 'select',
        label: '文件类型',
        name: 'file_type',
    },
    {
        type: 'dateRanger',
        name: ['time_start', 'time_end'],
        label: '导出时间',
        formatter: ['start_date', 'end_date'],
    },
];

declare interface IItem {
    create_time: string;
    id: number;
    file_name: string;
    status: string;
}

let today = dayjs();
function getList() {
    const date = today.format();
    let list = [];
    for (let i = 0; i < 20; i++) {
        list.push({
            create_time: date,
            id: i,
            file_name: `导出文件_${i}`,
            status: 'going',
        });
    }
    today = today.add(-1, 'd');
    return list;
}

declare interface IWaterFallItem {
    type: 'time' | 'card';
    data: any;
}

const Export = () => {
    const { hasMoreRef, onSearch, loading, onNext, total, increment } = useWaterFall<IItem, any>({
        queryPromise: () =>
            Promise.resolve({
                code: 200,
                message: '',
                data: {
                    total: 20,
                    list: getList(),
                },
            }),
    });

    const { start, stop } = useInterval();
    const loadedRowsMap = useMemo<{ [key: number]: 1 }>(() => {
        return {};
    }, []);

    const waterFallAllData = useRef<IWaterFallItem[]>([]);

    const currentDate = useRef<Dayjs>(); // 保存最新日期

    useMemo(() => {
        increment.map(item => {
            const { create_time } = item;
            if (currentDate.current && dayjs(create_time).isSame(currentDate.current, 'd')) {
                const lastItem = waterFallAllData.current[waterFallAllData.current.length - 1];
                const lastLength = lastItem.data.length;
                if (lastLength === 1) {
                    lastItem.data.push(item);
                } else {
                    waterFallAllData.current.push({
                        type: 'card',
                        data: [item],
                    });
                }
            } else {
                currentDate.current = dayjs(create_time);
                // add 一个新的
                waterFallAllData.current.push({
                    type: 'time',
                    data: item,
                });
                waterFallAllData.current.push({
                    type: 'card',
                    data: [item],
                });
            }
        });
    }, [increment]);

    const isRowLoaded = useCallback(({ index }) => !!loadedRowsMap[index], []);

    const renderItem = useCallback(
        ({ index, key, style }) => {
            const item = waterFallAllData.current[index];
            if (item.type === 'time') {
                return (
                    <Row style={style}>
                        <div className={exportStyles.exportDate}>
                            {dayjs(item.data.create_time).format('YYYY-MM-DD')}
                        </div>
                    </Row>
                );
            } else {
                return (
                    <Row style={style} gutter={[50, 0]}>
                        {item.data.map(({ id, create_time, file_name }: any) => {
                            return (
                                <Col key={id} span={12}>
                                    <Card className={exportStyles.exportCard}>
                                        <CloseOutlined className={exportStyles.exportClose} />
                                        <Row
                                            align="middle"
                                            className={exportStyles.exportCardContent}
                                            gutter={[20, 0]}
                                        >
                                            <Col>
                                                <div className={exportStyles.exportIconWrap}>
                                                    <Icons
                                                        type={'scm-biaoge'}
                                                        className={exportStyles.exportIcon}
                                                    />
                                                </div>
                                            </Col>
                                            <Col flex={1}>
                                                <div>{file_name}</div>
                                                <div>
                                                    <Progress
                                                        className={exportStyles.exportProgress}
                                                        percent={50}
                                                        status="active"
                                                        format={percent => (
                                                            <span
                                                                className={
                                                                    exportStyles.exportProgressLabel
                                                                }
                                                            >
                                                                {percent + '% 导出中'}
                                                            </span>
                                                        )}
                                                    />
                                                </div>
                                            </Col>
                                        </Row>
                                    </Card>
                                </Col>
                            );
                        })}
                    </Row>
                );
            }
        },
        [waterFallAllData.current],
    );

    const showItems = useRef<IItem[]>([]); // 缓存当前显示的item

    const updateHandler = useCallback(() => {
        const items = showItems.current;
        const updatedItems = items.filter(item => item.status === 'going'); // 筛选出状态非终结态的数据
        if (updatedItems.length === 0) {
            stop();
        } else {
            // update progress
            console.log('update progress', updatedItems);
            // TODO 更新状态和进度，需要debounce
        }
    }, []);

    const onScrollEnd = useCallback(
        debounce(() => {
            stop();
            start(updateHandler, 10000);
        }, 3000),
        [],
    );

    useEffect(() => {
        return stop;
    }, []);

    const handleInfiniteOnLoad = useCallback(
        ({ startIndex, stopIndex }) => {
            showItems.current = [];
            for (let i = startIndex; i <= stopIndex; i++) {
                loadedRowsMap[i] = 1;
            }
            for (let i = Math.max(0, stopIndex - 8); i <= stopIndex; i++) {
                // 更新showItems
                const item = waterFallAllData.current[i];
                if (item.type === 'card') {
                    showItems.current.push(...item.data);
                }
            }
            onScrollEnd();

            if (startIndex === 0 || loading || !hasMoreRef.current) {
                return Promise.resolve();
            }
            const rowCount = waterFallAllData.current.length - 1;
            if (stopIndex === rowCount) {
                return onNext();
            } else {
                return Promise.resolve();
            }
        },
        [waterFallAllData.current, loading],
    );

    const getRowHeight = useCallback(({ index }) => {
        const item = waterFallAllData.current[index];
        if (item.type === 'card') return 160;
        return 65; // 获取高度
    }, []);

    return (
        <Container>
            <JsonForm fieldList={fieldList} />
            <div>
                <LoadingButton type="primary" className={formStyles.formBtn} onClick={onSearch}>
                    查询
                </LoadingButton>
            </div>
            <div style={{ marginTop: 20 }}>
                {waterFallAllData.current.length > 0 && (
                    <InfiniteLoader
                        isRowLoaded={isRowLoaded}
                        loadMoreRows={handleInfiniteOnLoad}
                        rowCount={waterFallAllData.current.length}
                        minimumBatchSize={1}
                        threshold={4}
                    >
                        {({ onRowsRendered, registerChild }) => (
                            <AutoSizer disableHeight={true}>
                                {({ width }) => (
                                    <VList
                                        height={600}
                                        rowHeight={getRowHeight}
                                        overscanRowCount={8}
                                        tabIndex={null}
                                        onRowsRendered={onRowsRendered}
                                        rowCount={waterFallAllData.current.length}
                                        rowRenderer={renderItem}
                                        width={width}
                                    />
                                )}
                            </AutoSizer>
                        )}
                    </InfiniteLoader>
                )}
            </div>
        </Container>
    );
};

export default Export;

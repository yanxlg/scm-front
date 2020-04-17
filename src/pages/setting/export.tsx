import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Container from '@/components/Container';
import { JsonForm, LoadingButton } from 'react-components';
import { FormField } from 'react-components/es/JsonForm';
import formStyles from 'react-components/es/JsonForm/_form.less';
import { useInterval, useWaterFall } from 'react-components';
import { Card, Col, Row, Progress, message, Modal, Spin } from 'antd';
import { AutoSizer, List as VList, InfiniteLoader } from 'react-virtualized';
import dayjs, { Dayjs } from 'dayjs';
import exportStyles from '@/styles/_export.less';
import { Icons } from '@/components/Icon';
import { CloseOutlined, CloseCircleOutlined } from '@ant-design/icons';
import debounce from 'lodash/debounce';
import { deleteExport, queryDownloadList, retryExport, updateExport } from '@/services/setting';
import { IFileItem } from '@/interface/ISetting';
import { ExportFileStatus } from '@/enums/SettingEnum';

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

declare interface IWaterFallItem {
    type: 'time' | 'card';
    data: any;
}

const Export = () => {
    const {
        hasMoreRef,
        onSearch,
        loading,
        onNext,
        total,
        increment,
        dataSourceRef,
        setTotal,
    } = useWaterFall<IFileItem, any>({
        queryPromise: queryDownloadList,
        autoQuery: true,
        dependenceKey: 'id',
    });

    const [update, setUpdate] = useState(0);

    const { start, stop } = useInterval();
    const loadedRowsMap = useMemo<{ [key: number]: 1 }>(() => {
        return {};
    }, []);

    const waterFallAllData = useRef<IWaterFallItem[]>([]);

    const currentDate = useRef<Dayjs>(); // 保存最新日期

    const generateWaterFallList = useCallback((list: IFileItem[]) => {
        list.map(item => {
            const { create_time } = item;
            const time = dayjs.utc(create_time, 's').local();
            if (currentDate.current && time.isSame(currentDate.current, 'd')) {
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
                currentDate.current = time;
                // add 一个新的
                waterFallAllData.current.push({
                    type: 'time',
                    data: time.format('YYYY-MM-DD'),
                });
                waterFallAllData.current.push({
                    type: 'card',
                    data: [item],
                });
            }
        });
    }, []);

    useMemo(() => {
        generateWaterFallList(increment);
    }, [increment]);

    const isRowLoaded = useCallback(({ index }) => !!loadedRowsMap[index], []);

    const requestSearch = useCallback(() => {
        // clear
        waterFallAllData.current = [];
        currentDate.current = undefined;
        return onSearch();
    }, []);

    const reTry = useCallback((id: string) => {
        // 重新导出
        return retryExport(id).then(
            () => {
                message.success('重新导出任务创建成功');
            },
            () => {
                message.error('重新导出失败，请重试');
            },
        );
    }, []);

    const deleteFile = useCallback((id: string) => {
        Modal.confirm({
            icon: <CloseCircleOutlined className={exportStyles.exportErrorIcon} />,
            title: '删除文件',
            content: '删除后，文件将终止导出并无法下载',
            okText: '确定',
            cancelText: '取消',
            onOk: () => {
                return deleteExport(id).then(
                    () => {
                        message.success('删除成功');
                        // 本地数据将其删除，重排
                        const dataSet = dataSourceRef.current.filter(({ id: _id }) => id !== _id);
                        // rm {id} file
                        waterFallAllData.current = [];
                        currentDate.current = undefined;
                        generateWaterFallList(dataSet);
                        dataSourceRef.current = dataSet;
                        // update
                        setTotal(dataSet.length);
                        setUpdate(Date.now());
                    },
                    () => {
                        message.error('删除失败');
                    },
                );
            },
        });
    }, []);

    const renderItem = useCallback(
        ({ index, key, style }) => {
            const item = waterFallAllData.current[index];
            if (item.type === 'time') {
                return (
                    <Row key={item.data} style={style}>
                        <div className={exportStyles.exportDate}>{item.data}</div>
                    </Row>
                );
            } else {
                return (
                    <Row key={JSON.stringify(item.data)} style={style} gutter={[50, 0]}>
                        {item.data.map(
                            ({ id, filename, percent = '0', status, filesize }: IFileItem) => {
                                return (
                                    <Col key={id} span={12}>
                                        <Card className={exportStyles.exportCard}>
                                            <CloseOutlined
                                                className={exportStyles.exportClose}
                                                onClick={() => deleteFile(id)}
                                            />
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
                                                    <div>{filename}</div>
                                                    {status === ExportFileStatus.Ready ||
                                                    status === ExportFileStatus.Going ? (
                                                        <div>
                                                            <Progress
                                                                className={
                                                                    exportStyles.exportProgress
                                                                }
                                                                percent={Number(percent)}
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
                                                    ) : status === ExportFileStatus.Success ? (
                                                        <div className={exportStyles.exportSize}>
                                                            {filesize}
                                                            <LoadingButton
                                                                type="primary"
                                                                className={
                                                                    exportStyles.exportAction
                                                                }
                                                                onClick={() => {}}
                                                            >
                                                                下载到本地
                                                            </LoadingButton>
                                                        </div>
                                                    ) : status === ExportFileStatus.Failure ? (
                                                        <div className={exportStyles.exportSize}>
                                                            导出失败
                                                            <LoadingButton
                                                                type="primary"
                                                                className={
                                                                    exportStyles.exportAction
                                                                }
                                                                onClick={() => reTry(id)}
                                                            >
                                                                重试
                                                            </LoadingButton>
                                                        </div>
                                                    ) : null}
                                                </Col>
                                            </Row>
                                        </Card>
                                    </Col>
                                );
                            },
                        )}
                    </Row>
                );
            }
        },
        [update], // 强制重新渲染,需要强制重新渲染vList
    );

    const showItems = useRef<IFileItem[]>([]); // 缓存当前显示的item

    const updateHandler = useCallback(() => {
        const items = showItems.current;
        const updatedItems = items.filter(
            item =>
                item.status !== ExportFileStatus.Success &&
                item.status !== ExportFileStatus.Failure,
        ); // 筛选出状态非终结态的数据
        if (updatedItems.length === 0) {
            stop();
        } else {
            const ids = updatedItems.map(({ id }) => id);
            // update progress
            updateExport(ids.join(',')).then(({ data = [] }) => {
                const dataSet = dataSourceRef.current.map(item => {
                    const id = item.id;
                    if (ids.indexOf(id) > -1) {
                        const _item = data.find((_i: any) => _i.id === id);
                        return Object.assign({}, item, _item);
                    } else {
                        return item;
                    }
                });
                // rm {id} file
                waterFallAllData.current = [];
                currentDate.current = undefined;
                generateWaterFallList(dataSet);
                dataSourceRef.current = dataSet;
                // update
                setTotal(dataSet.length);
                setUpdate(Date.now());
            });
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
        [loading],
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
                <LoadingButton
                    type="primary"
                    className={formStyles.formBtn}
                    onClick={requestSearch}
                >
                    查询
                </LoadingButton>
                <div className={exportStyles.exportTotal}>共{total}条</div>
            </div>
            <Spin spinning={loading}>
                <div style={{ marginTop: 20, height: 600 }}>
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
            </Spin>
        </Container>
    );
};

export default Export;

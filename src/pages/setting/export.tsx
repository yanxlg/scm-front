import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Container from '@/components/Container';
import { JsonForm, LoadingButton } from 'react-components';
import { FormField, JsonFormRef } from 'react-components/es/JsonForm';
import formStyles from 'react-components/es/JsonForm/_form.less';
import { useInterval, useWaterFall } from 'react-components';
import { Card, Col, Row, Progress, message, Modal, Spin, Button } from 'antd';
import { AutoSizer, List as VList, InfiniteLoader } from 'react-virtualized';
import dayjs, { Dayjs } from 'dayjs';
import exportStyles from '@/styles/_export.less';
import { Icons } from '@/components/Icon';
import { CloseOutlined, CloseCircleOutlined } from '@ant-design/icons';
import debounce from 'lodash/debounce';
import { deleteExport, queryDownloadList, retryExport, updateExport } from '@/services/setting';
import { IFileItem } from '@/interface/ISetting';
import { ExportFileStatus } from '@/enums/SettingEnum';
import { downloadFile } from '@/services/global';

const fieldList: FormField[] = [
    {
        type: 'input',
        label: '文件名称',
        name: 'filename',
    },
    {
        type: 'select',
        label: '文件类型',
        name: 'module',
        formatter: 'number',
        placeholder: '全部',
        optionList: [
            { value: '', name: '全部' },
            { value: 1, name: '渠道商品库' },
            { value: 2, name: '本地商品库' },
            { value: 3, name: '订单管理' },
            { value: 4, name: '出入库管理' },
            { value: 5, name: '采购管理-仓库异常' },
            { value: 6, name: '采购退货列表' },
            { value: 7, name: '采购单导出' },
            { value: 8, name: '商品编辑-图片下载' },
        ],
    },
    {
        type: 'dateRanger',
        name: ['start_time', 'end_time'],
        label: '导出时间',
        formatter: ['start_date', 'end_date'],
    },
];

declare interface IWaterFallItem {
    type: 'time' | 'card';
    data: any;
}

const Export = () => {
    const formRef = useRef<JsonFormRef>(null);

    const { onSearch, loading, onNext, total, dataSourceRef, dataSource } = useWaterFall<
        IFileItem,
        any
    >({
        queryPromise: queryDownloadList,
        formRef: formRef,
        autoQuery: true,
    });

    const totalRef = useRef(0);
    useMemo(() => {
        totalRef.current = total;
    }, [total]);

    const [update, setUpdate] = useState(0);

    let startRef = useRef(0); // 缓存位置

    let stopRef = useRef(0); // 缓存位置

    const { start, stop } = useInterval();
    const loadedRowsMap = useMemo<{ [key: number]: 1 }>(() => {
        return {};
    }, []);

    const currentDate = useRef<Dayjs>(); // 保存最新日期

    const waterFallAllData = useRef<IWaterFallItem[]>([]);

    const generateWaterFallList = useCallback((list: IFileItem[]) => {
        waterFallAllData.current = [];
        currentDate.current = undefined;
        list.map(item => {
            const { create_time } = item;
            const time = dayjs.utc(Number(create_time) * 1000);
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
        generateWaterFallList(dataSourceRef.current); // 数据发生改变则更新
    }, [dataSource]);

    const isRowLoaded = useCallback(({ index }) => !!loadedRowsMap[index], []);

    const requestSearch = useCallback(() => {
        // clear
        waterFallAllData.current = [];
        currentDate.current = undefined;
        dataSourceRef.current = [];
        return onSearch();
    }, []);

    const updateList = useCallback(dataSet => {
        dataSourceRef.current = dataSet;
        generateWaterFallList(dataSet);
        updateShowItems();
        setUpdate(Date.now());
    }, []);

    const reTry = useCallback((id: string) => {
        // 重新导出
        return retryExport(id).then(
            () => {
                message.success('重新导出任务创建成功');
                // 更新当亲item状态
                const dataSet = dataSourceRef.current.map(item => {
                    if (item.id === id) {
                        return Object.assign({}, item, {
                            percent: '0',
                            status: ExportFileStatus.Ready,
                        });
                    } else {
                        return item;
                    }
                });
                updateList(dataSet);
                updateShowItems();
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
                        totalRef.current -= 1;
                        updateList(dataSet);
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
                    <div key={item.data} style={style}>
                        <Row key={item.data}>
                            <div className={exportStyles.exportDate}>{item.data}</div>
                        </Row>
                    </div>
                );
            } else {
                return (
                    <div key={JSON.stringify(item.data)} style={style}>
                        <Row gutter={[50, 0]}>
                            {item.data.map(
                                ({
                                    id,
                                    filename,
                                    percent = '0',
                                    status,
                                    filesize = '0',
                                    object_url,
                                }: IFileItem) => {
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
                                                        <div
                                                            className={exportStyles.exportIconWrap}
                                                        >
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
                                                            <div
                                                                className={exportStyles.exportSize}
                                                            >
                                                                {Math.floor(
                                                                    (Number(filesize) /
                                                                        1024 /
                                                                        1024) *
                                                                        10000,
                                                                ) / 10000}
                                                                M
                                                                <Button
                                                                    type="primary"
                                                                    className={
                                                                        exportStyles.exportAction
                                                                    }
                                                                    onClick={() =>
                                                                        downloadFile(object_url)
                                                                    }
                                                                >
                                                                    下载到本地
                                                                </Button>
                                                            </div>
                                                        ) : status === ExportFileStatus.Failure ? (
                                                            <div
                                                                className={exportStyles.exportSize}
                                                            >
                                                                <span
                                                                    className={
                                                                        exportStyles.exportErrorText
                                                                    }
                                                                >
                                                                    导出失败
                                                                </span>
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
                    </div>
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
                updateList(dataSet);
                updateShowItems();
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

    const updateShowItems = useCallback(() => {
        showItems.current = [];
        for (let i = startRef.current; i <= stopRef.current; i++) {
            // 更新showItems
            const item = waterFallAllData.current[i];
            if (item && item.type === 'card') {
                showItems.current.push(...item.data);
            }
        }
    }, []);

    const handleInfiniteOnLoad = useCallback(({ startIndex, stopIndex }) => {
        return Promise.resolve();
    }, []);

    const getRowHeight = useCallback(({ index }) => {
        const item = waterFallAllData.current[index];
        if (item.type === 'card') return 160;
        return 65; // 获取高度
    }, []);

    const onRowsRequiredRender = useCallback(
        ({
            startIndex,
            stopIndex,
            overscanStopIndex,
        }: {
            overscanStartIndex: number;
            overscanStopIndex: number;
            startIndex: number;
            stopIndex: number;
        }) => {
            if (stopIndex === overscanStopIndex && stopIndex !== 0) {
                onNext();
            }
            showItems.current = [];
            startRef.current = startIndex;
            stopRef.current = stopIndex;
            updateShowItems();
            onScrollEnd();
        },
        [],
    );

    const form = useMemo(() => <JsonForm fieldList={fieldList} ref={formRef} />, []);

    return (
        <Container>
            {form}
            <div>
                <LoadingButton
                    type="primary"
                    className={formStyles.formBtn}
                    onClick={requestSearch}
                >
                    查询
                </LoadingButton>
                <div className={exportStyles.exportTotal}>共{totalRef.current}条</div>
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
                                            onRowsRendered={info => {
                                                onRowsRequiredRender(info);
                                                onRowsRendered(info);
                                            }}
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

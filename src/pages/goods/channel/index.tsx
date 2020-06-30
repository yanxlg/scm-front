import React, { ReactText, useCallback, useMemo, useRef, useState } from 'react';
import '@/styles/index.less';
import '@/styles/product.less';
import '@/styles/modal.less';
import channelStyles from '@/styles/_channel.less';
import { Modal, message, Button } from 'antd';
import { TableProps } from 'antd/es/table';
import { PopConfirmLoadingButton, FitTable } from 'react-components';
import { AutoEnLargeImg } from 'react-components';
import {
    queryChannelGoodsList,
    updateChannelShelveState,
    queryChannelCategory,
    exportChannelProductList,
} from '@/services/channel';
import {
    ProductStatusMap,
    ProductStatusCode,
    ProductStatusList,
    checkLowerShelf,
    checkUpperShelf,
    ProductStatusResponseMap,
} from '@/config/dictionaries/Product';
import { defaultPageNumber, defaultPageSize } from '@/config/global';
import { IChannelProductListItem } from '@/interface/IChannel';
import { JsonFormRef, FormField } from 'react-components/es/JsonForm';
import { JsonForm } from 'react-components';
import { unixToStartDate, unixToEndDate } from 'react-components/es/utils/date';
import queryString from 'query-string';
import CopyLink from '@/components/copyLink';
import ShipFeeModal from './components/ShipFeeModal';
import SkuEditModal from './components/SkuEditModal';
import Container from '@/components/Container';
import { useList } from '@/utils/hooks';
import { ITaskListItem } from '@/interface/ITask';
import { LoadingButton } from 'react-components';
import SkuDialog from './components/SkuEditModal';
import { isEmptyObject } from '@/utils/utils';
import OnOffLogModal from '@/pages/goods/channel/components/OnOffLogModal';
import { useModal } from 'react-components';
import formStyles from 'react-components/es/JsonForm/_form.less';
import Export from '@/components/Export';
import { queryShopList } from '@/services/global';
import { PermissionRouterWrap } from 'rc-permission';

const salesVolumeList = [
    {
        value: 'all',
        name: '全部',
    },
    {
        value: 'day_10',
        name: '日销量大于10',
    },
    {
        value: 'day_50',
        name: '日销量大于50',
    },
    {
        value: 'day_100',
        name: '日销量大于100',
    },
    {
        value: 'week_100',
        name: '周销量大于100',
    },
    {
        value: 'week_200',
        name: '周销量大于200',
    },
    {
        value: 'week_500',
        name: '周销量大于500',
    },
    {
        value: 'month_100',
        name: '月销量大于100',
    },
    {
        value: 'month_500',
        name: '月销量大于500',
    },
    {
        value: 'month_1000',
        name: '月销量大于1000',
    },
];

const formFields: FormField[] = [
    {
        type: 'dateRanger',
        name: ['onshelf_time_start', 'onshelf_time_end'],
        label: <span>时&emsp;&emsp;&emsp;间</span>,
        className: 'product-picker',
        formatter: ['start_date', 'end_date'],
    },
    {
        type: 'input',
        label: 'Commodity ID',
        name: 'commodity_id',
        placeholder: '多个逗号隔开',
    },
    {
        type: 'input',
        label: <span>虚拟&emsp;ID</span>,
        name: 'vova_virtual_id',
        placeholder: '多个逗号隔开',
    },
    {
        type: 'input',
        label: 'Product ID',
        name: 'product_id',
        placeholder: '多个逗号隔开',
    },
    {
        type: 'select',
        label: <span>销&emsp;&emsp;&emsp;量</span>,
        name: 'sales_volume',
        optionList: salesVolumeList,
    },
    {
        type: 'select',
        label: '销售店铺名称',
        name: 'merchant_ids',
        // placeholder: '请选择',
        syncDefaultOption: {
            value: '',
            name: '全部',
        },
        optionList: () =>
            queryShopList().then(({ data = [] }) => {
                return data.map(({ merchant_name, merchant_id }) => {
                    return { name: merchant_name, value: merchant_id };
                });
            }),
    },
    {
        type: 'select',
        label: '一级类目',
        name: 'level_one_category',
        syncDefaultOption: {
            value: '',
            name: '全部',
        },
        optionList: () => queryChannelCategory(),
        onChange: (name, form) => {
            form.resetFields(['level_two_category']);
        },
    },
    {
        type: 'select',
        label: '二级类目',
        name: 'level_two_category',
        optionListDependence: {
            name: 'level_one_category',
            key: 'children',
        },
        syncDefaultOption: {
            value: '',
            name: '全部',
        },
        optionList: () => queryChannelCategory(),
    },
    {
        type: 'select',
        label: '商品状态',
        name: 'product_status',
        optionList: ProductStatusList.map(({ name, id }) => {
            return { name: name, value: id };
        }),
    },
];

const scroll: TableProps<ITaskListItem>['scroll'] = { x: true, scrollToFirstRowOnChange: true };

const ChannelList: React.FC = props => {
    const searchRef = useRef<JsonFormRef>(null);
    const [exportDialog, setExportDialog] = useState(false);

    const skuRef = useRef<SkuDialog>(null);

    const { visible, onClose, setVisibleProps } = useModal<{
        product_ids: string;
        merchant_id: string;
        commodity_ids: string;
    }>();

    const {
        pageSize: page_size,
        pageNumber: page_number,
        ...defaultInitialValues
    } = useMemo(() => {
        // copy link 解析
        const { query, url } = queryString.parseUrl(window.location.href);
        if (!isEmptyObject(query)) {
            window.history.replaceState({}, '', url);
        }
        const {
            pageNumber = defaultPageNumber,
            pageSize = defaultPageSize,
            onshelf_time_start = 0,
            onshelf_time_end = 0,
            commodity_id = '',
            vova_virtual_id = '',
            product_id = '',
            sales_volume = salesVolumeList[0].value,
            product_status = ProductStatusList[0].id,
            shop_name = '',
            level_one_category = '',
            level_two_category = '',
            merchant_ids = '',
        } = query;
        return {
            pageNumber: Number(pageNumber),
            pageSize: Number(pageSize),
            onshelf_time_start: unixToStartDate(Number(onshelf_time_start)),
            onshelf_time_end: unixToEndDate(Number(onshelf_time_end)),
            commodity_id,
            vova_virtual_id,
            product_id,
            sales_volume,
            shop_name,
            level_one_category,
            level_two_category,
            product_status,
            merchant_ids,
        };
    }, []);

    const {
        query,
        loading,
        pageNumber,
        pageSize,
        dataSource,
        total,
        onSearch,
        onReload,
        onChange,
        selectedRowKeys,
        setSelectedRowKeys,
    } = useList({
        queryList: queryChannelGoodsList,
        formRef: searchRef,
        defaultState: {
            pageSize: page_size,
            pageNumber: page_number,
        },
    });

    const showExcelDialog = useCallback(() => {
        setExportDialog(true);
    }, []);
    const closeExcelDialog = useCallback(() => {
        setExportDialog(false);
    }, []);

    const onExportOKey = useCallback((extra: any) => {
        // export
        const values = searchRef.current!.getFieldsValue();
        return exportChannelProductList({
            ...values,
            ...extra,
        });
    }, []);

    const getCopiedLinkQuery = useCallback(() => {
        return query;
    }, [loading]);

    const showSkuDialog = useCallback((id: string, merchant_id: string, commodity_id: string) => {
        skuRef.current!.showModal(id, merchant_id, commodity_id);
    }, []);

    const showCountryShipFee = useCallback((product_id: string, merchant_id: string) => {
        Modal.info({
            className: channelStyles.channelShipModal,
            icon: null,
            title: '查看国家运费',
            okText: '关闭',
            maskClosable: true,
            content: <ShipFeeModal product_id={product_id} merchant_id={merchant_id} />,
        });
    }, []);

    const onShelves = useCallback((row: IChannelProductListItem) => {
        return updateChannelShelveState({
            type: 'onsale',
            info: {
                onsale: {
                    task_body_list: [
                        {
                            product_id: row.product_id,
                            commodity_id: row.commodity_id,
                            merchant_id: row.merchant_id,
                            sale_domain: 'vova',
                        },
                    ],
                },
            },
        })
            .then(res => {
                message.success('上架任务已发送');
                onReload();
            })
            .catch(() => {
                message.error('上架任务发送失败');
            });
    }, []);

    // 下架操作
    const offShelves = useCallback((row: IChannelProductListItem) => {
        return updateChannelShelveState({
            type: 'offsale',
            info: {
                offsale: {
                    task_body_list: [
                        {
                            product_id: row.product_id,
                            commodity_id: row.commodity_id,
                            merchant_id: row.merchant_id,
                            sale_domain: 'vova',
                        },
                    ],
                },
            },
        })
            .then(res => {
                message.success('下架任务已发送');
                onReload();
            })
            .catch(() => {
                message.error('下架任务发送失败');
            });
    }, []);

    const onShelveList = useCallback(
        (rowKeys: string[]) => {
            const taskBodyList = dataSource
                .filter(item => {
                    return rowKeys.indexOf(item.id) > -1;
                })
                .map(({ product_id, commodity_id, merchant_id }) => {
                    return {
                        product_id: product_id,
                        commodity_id: commodity_id,
                        merchant_id: merchant_id,
                        sale_domain: 'vova',
                    };
                });
            return updateChannelShelveState({
                type: 'onsale',
                info: {
                    onsale: {
                        task_body_list: taskBodyList,
                    },
                },
            })
                .then(res => {
                    message.success('上架任务已发送');
                    onReload();
                })
                .catch(() => {
                    message.error('上架任务发送失败');
                });
        },
        [dataSource],
    );

    const offShelveList = useCallback(
        (rowKeys: string[]) => {
            const taskBodyList = dataSource
                .filter(item => {
                    return rowKeys.indexOf(item.id) > -1;
                })
                .map(({ product_id, commodity_id, merchant_id }) => {
                    return {
                        product_id: product_id,
                        commodity_id: commodity_id,
                        merchant_id: merchant_id,
                        sale_domain: 'vova',
                    };
                });
            return updateChannelShelveState({
                type: 'offsale',
                info: {
                    offsale: {
                        task_body_list: taskBodyList,
                    },
                },
            })
                .then(res => {
                    message.success('下架任务已发送');
                    onReload();
                })
                .catch(() => {
                    message.error('下架任务发送失败');
                });
        },
        [dataSource],
    );

    const showLog = useCallback(
        ({ product_id, merchant_id, commodity_id }: IChannelProductListItem) => {
            setVisibleProps({
                product_ids: product_id,
                merchant_id: merchant_id,
                commodity_ids: commodity_id,
            });
        },
        [],
    );

    const columns = useMemo<TableProps<IChannelProductListItem>['columns']>(() => {
        return [
            {
                title: '操作',
                dataIndex: 'operation',
                align: 'center',
                width: 140,
                fixed: 'left',
                render: (_, item) => {
                    const status = item.product_status;
                    const canUpper = !checkUpperShelf(status);
                    const canDown = !checkLowerShelf(status);
                    return {
                        children: (
                            <>
                                <PopConfirmLoadingButton
                                    buttonProps={{
                                        disabled: canUpper,
                                        children: '上架',
                                        type: 'link',
                                    }}
                                    popConfirmProps={{
                                        title: '确定需要上架该商品吗?',
                                        okText: '确定',
                                        cancelText: '取消',
                                        disabled: canUpper,
                                        placement: 'topRight',
                                        onConfirm: () => onShelves(item),
                                    }}
                                />
                                <PopConfirmLoadingButton
                                    buttonProps={{
                                        disabled: canDown,
                                        children: '下架',
                                        type: 'link',
                                    }}
                                    popConfirmProps={{
                                        title: '确定需要下架该商品吗?',
                                        okText: '确定',
                                        cancelText: '取消',
                                        disabled: canDown,
                                        placement: 'topRight',
                                        onConfirm: () => offShelves(item),
                                    }}
                                />
                            </>
                        ),
                    };
                },
            },
            {
                title: '销售店铺名称',
                dataIndex: 'shop_name',
                align: 'center',
                width: 130,
            },
            {
                title: '虚拟ID',
                dataIndex: 'virtual_id',
                align: 'center',
                width: 100,
            },
            {
                title: '商品图片',
                dataIndex: 'main_image',
                align: 'center',
                width: 120,
                render: (value: string, row: IChannelProductListItem, index: number) => (
                    <AutoEnLargeImg src={value} className={channelStyles.channelImg} />
                ),
            },
            {
                title: 'Commodity_ID',
                dataIndex: 'commodity_id',
                align: 'center',
                width: 160,
            },
            {
                title: 'Product_ID',
                dataIndex: 'product_id',
                align: 'center',
                width: 160,
            },
            {
                title: '销量',
                dataIndex: 'sales_volume',
                align: 'center',
                width: 100,
            },
            {
                title: '评价数量',
                dataIndex: 'evaluate_volume',
                align: 'center',
                width: 100,
            },
            {
                title: '平均评分',
                dataIndex: 'average_score',
                align: 'center',
                width: 100,
            },
            {
                title: '一级类目',
                dataIndex: 'level_one_category',
                align: 'center',
                width: 120,
            },
            {
                title: '二级类目',
                dataIndex: 'level_two_category',
                align: 'center',
                width: 120,
            },
            {
                title: '商品状态',
                dataIndex: 'product_status',
                align: 'center',
                width: 150,
                render: (status: ProductStatusCode = 0, record) => {
                    return (
                        <div>
                            {ProductStatusResponseMap[status]}
                            <Button type="link" onClick={() => showLog(record)}>
                                上下架日志
                            </Button>
                        </div>
                    );
                },
            },
            {
                title: 'sku数量',
                dataIndex: 'sku_count',
                align: 'center',
                width: 140,
                render: (value: number, row: IChannelProductListItem) => {
                    return (
                        <>
                            <div>{value}</div>
                            <Button
                                type="link"
                                onClick={() =>
                                    showSkuDialog(row.id, row.merchant_id, row.commodity_id)
                                }
                            >
                                查看sku详情
                            </Button>
                        </>
                    );
                },
            },
            {
                title: '国家运费',
                dataIndex: 'country_ship_fee',
                align: 'center',
                width: 140,
                render: (value: number, row: IChannelProductListItem) => {
                    return (
                        <Button
                            type="link"
                            onClick={() => showCountryShipFee(row.product_id, row.merchant_id)}
                        >
                            查看国家运费
                        </Button>
                    );
                },
            },
        ];
    }, []);

    const onSelectedRowKeysChange = useCallback((selectedKeys: ReactText[]) => {
        setSelectedRowKeys(selectedKeys as string[]);
    }, []);

    const rowSelection = useMemo(() => {
        return {
            fixed: true,
            columnWidth: '50px',
            selectedRowKeys: selectedRowKeys,
            onChange: onSelectedRowKeysChange,
        };
    }, [selectedRowKeys]);

    const pagination = useMemo(() => {
        return {
            total: total,
            current: pageNumber,
            pageSize: pageSize,
            showSizeChanger: true,
            position: ['topRight', 'bottomRight'],
        } as any;
    }, [loading]);

    const children = useMemo(() => {
        return (
            <div>
                <LoadingButton type="primary" className={formStyles.formBtn} onClick={onSearch}>
                    查询
                </LoadingButton>
                <LoadingButton className={formStyles.formBtn} onClick={onReload}>
                    刷新
                </LoadingButton>
                <Button
                    disabled={total <= 0}
                    // type="primary"
                    className={formStyles.formBtn}
                    onClick={showExcelDialog}
                >
                    导出
                </Button>
            </div>
        );
    }, [total]);

    const search = useMemo(() => {
        return (
            <JsonForm
                ref={searchRef}
                fieldList={formFields}
                labelClassName="product-form-label"
                initialValues={defaultInitialValues}
            >
                {children}
            </JsonForm>
        );
    }, [children]);

    const toolBarRender = useCallback(() => {
        const size = selectedRowKeys.length;
        return [
            <LoadingButton
                key="on"
                type="primary"
                className={formStyles.formBtn}
                onClick={() => onShelveList(selectedRowKeys)}
                disabled={size === 0}
            >
                一键上架
            </LoadingButton>,
            <LoadingButton
                key={'of'}
                type="primary"
                className={formStyles.formBtn}
                onClick={() => offShelveList(selectedRowKeys)}
                disabled={size === 0}
            >
                一键下架
            </LoadingButton>,
        ];
    }, [selectedRowKeys, loading]);
    const table = useMemo(() => {
        return (
            <FitTable<IChannelProductListItem>
                bordered
                rowKey="id"
                scroll={scroll}
                bottom={60}
                minHeight={500}
                rowSelection={rowSelection}
                pagination={pagination}
                columns={columns}
                dataSource={dataSource}
                loading={loading}
                onChange={onChange}
                columnsSettingRender={true}
                toolBarRender={toolBarRender}
            />
        );
    }, [loading, selectedRowKeys]);

    const body = useMemo(() => {
        return (
            <Container>
                {search}
                {table}
                <Export
                    visible={exportDialog}
                    onCancel={closeExcelDialog}
                    columns={columns as any}
                    onOKey={onExportOKey}
                />
                <SkuEditModal ref={skuRef} />
                <CopyLink getCopiedLinkQuery={getCopiedLinkQuery} />
            </Container>
        );
    }, [loading, exportDialog, selectedRowKeys]);

    const logModal = useMemo(() => {
        return <OnOffLogModal visible={visible} onClose={onClose} />;
    }, [visible]);

    return (
        <>
            {body}
            {logModal}
        </>
    );
};

export default PermissionRouterWrap(ChannelList, {
    login: true,
    pid: 'goods/channel',
});

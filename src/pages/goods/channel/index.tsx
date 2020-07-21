import React, { ReactText, useCallback, useMemo, useRef, useState, useEffect } from 'react';
import '@/styles/index.less';
import '@/styles/product.less';
import '@/styles/modal.less';
import channelStyles from '@/styles/_channel.less';
import { Modal, message, Button, Popconfirm } from 'antd';
import { TableProps } from 'antd/es/table';
import { PopConfirmLoadingButton } from 'react-components';
import { AutoEnLargeImg } from 'react-components';
import {
    queryChannelGoodsList,
    updateChannelShelveState,
    queryChannelCategory,
    exportChannelProductList,
    queryGoodsBatchOnsale,
    queryGoodsBatchOffsale,
} from '@/services/channel';
import {
    ProductStatusCode,
    ProductStatusList,
    checkLowerShelf,
    checkUpperShelf,
    ProductStatusResponseMap,
} from '@/config/dictionaries/Product';
import { defaultPageNumber, defaultPageSize } from '@/config/global';
import { IChannelProductListItem, IChannelProductListBody } from '@/interface/IChannel';
import { JsonFormRef, FormField } from 'react-components/es/JsonForm';
import { JsonForm, SettingTable } from 'react-components';
import { unixToStartDate, unixToEndDate } from 'react-components/es/utils/date';
import queryString from 'query-string';
import CopyLink from '@/components/copyLink';
import ShipFeeModal from './components/ShipFeeModal';
import SkuEditModal from './components/SkuEditModal';
import Container from '@/components/Container';
import { useList } from '@/utils/hooks';
import { LoadingButton } from 'react-components';
import SkuDialog from './components/SkuEditModal';
import { isEmptyObject } from '@/utils/utils';
import OnOffLogModal from '@/pages/goods/channel/components/OnOffLogModal';
import { useModal } from 'react-components';
import formStyles from 'react-components/es/JsonForm/_form.less';
import Export from '@/components/Export';
import { queryGoodsSourceList } from '@/services/global';
import { PermissionRouterWrap, PermissionComponent } from 'rc-permission';
import { ConnectState } from '@/models/connect';
import { useDispatch } from '@@/plugin-dva/exports';
import classNames from 'classnames';

const salesVolumeList = [
    {
        value: 'day_10',
        label: '日销量大于10',
    },
    {
        value: 'day_50',
        label: '日销量大于50',
    },
    {
        value: 'day_100',
        label: '日销量大于100',
    },
    {
        value: 'week_100',
        label: '周销量大于100',
    },
    {
        value: 'week_200',
        label: '周销量大于200',
    },
    {
        value: 'week_500',
        label: '周销量大于500',
    },
    {
        value: 'month_100',
        label: '月销量大于100',
    },
    {
        value: 'month_500',
        label: '月销量大于500',
    },
    {
        value: 'month_1000',
        label: '月销量大于1000',
    },
];

const formFields: FormField[] = [
    {
        type: 'dateRanger@2',
        name: ['onshelf_time_start', 'onshelf_time_end'],
        label: '时间',
        formatter: ['start_date', 'end_date'],
        childrenProps: {
            className: 'product-picker',
        },
    },
    {
        type: 'textarea@2',
        label: 'Commodity ID',
        name: 'commodity_id',
        childrenProps: {
            placeholder: '支持多个输入',
            className: 'product-form-input',
        },
        formatter: 'multipleToArrayJoin',
    },
    {
        type: 'textarea@2',
        label: '虚拟ID',
        name: 'vova_virtual_id',
        childrenProps: {
            placeholder: '支持多个输入',
            className: 'product-form-input',
        },
        formatter: 'multipleToArrayJoin',
    },
    {
        type: 'textarea@2',
        label: 'Product ID',
        name: 'product_id',
        childrenProps: {
            placeholder: '支持多个输入',
            className: 'product-form-input',
        },
        formatter: 'multipleToArrayJoin',
    },
    {
        type: 'select@2',
        label: '销量',
        name: 'sales_volume',
        options: salesVolumeList,
        initialValue: 'all',
        defaultOption: {
            label: '全部',
            value: 'all',
        },
        childrenProps: {
            className: 'product-form-input',
        },
    },
    {
        type: 'select@2',
        label: '销售店铺名称',
        name: 'merchant_ids',
        optionKeys: ['name', 'value'],
        options: {
            selector: (state: ConnectState) => {
                return state?.permission?.merchantList?.map(item => {
                    return {
                        ...item,
                        value: item.id,
                    };
                });
            },
        },
        childrenProps: {
            className: 'product-form-input',
        },
    },
    {
        type: 'select@2',
        label: '一级类目',
        name: 'level_one_category',
        options: {
            service: () => queryChannelCategory(),
        },
        optionKeys: ['platform_cate_name', 'platform_cate_id'],
        onChange: (name, form) => {
            form.resetFields(['level_two_category']);
        },
        childrenProps: {
            className: 'product-form-input',
        },
    },
    {
        type: 'select@2',
        label: '二级类目',
        name: 'level_two_category',
        relation: {
            name: 'level_one_category',
            key: 'children',
        },
        options: {
            service: () => queryChannelCategory(),
        },
        optionKeys: ['platform_cate_name', 'platform_cate_id'],
        childrenProps: {
            className: 'product-form-input',
        },
    },
    {
        type: 'select@2',
        label: '商品渠道',
        name: 'origin_platform',
        defaultOption: {
            label: '全部',
            value: '',
        },
        // initialValue: '',
        options: {
            service: () => queryGoodsSourceList(),
            dataPath: null,
        },
        optionKeys: ['name', 'value'],
        childrenProps: {
            className: 'product-form-input',
            mode: 'multiple',
        },
    },
    {
        type: 'select@2',
        label: '商品状态',
        name: 'product_status',
        defaultOption: {
            label: '全部',
            value: '0',
        },
        initialValue: '0',
        options: ProductStatusList.map(({ name, id }) => {
            return { label: name, value: id };
        }),
        childrenProps: {
            className: 'product-form-input',
        },
    },

    {
        type: 'numberRange@2',
        label: '价格范围（$）',
        name: ['min_sale_price', 'max_sale_price'],
        precision: 2,
        childrenProps: {
            className: 'product-form-range',
        },
        formatter: 'number',
    },
];

const ChannelList: React.FC = props => {
    const searchRef = useRef<JsonFormRef>(null);
    const urlQueryRef = useRef<any>(null);
    const [exportDialog, setExportDialog] = useState(false);
    const [onShelfLoading, setOnShelfLoading] = useState(false);
    const [offShelfLoading, setOffShelfLoading] = useState(false);

    const skuRef = useRef<SkuDialog>(null);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch({
            type: 'permission/queryMerchantList',
        });
    }, []);
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
            urlQueryRef.current = query;
        }
        const {
            pageNumber = defaultPageNumber,
            pageSize = defaultPageSize,
            onshelf_time_start = 0,
            onshelf_time_end = 0,
            commodity_id = '',
            vova_virtual_id = '',
            product_id = '',
            shop_name = '',
            level_one_category = '',
            level_two_category = '',
            merchant_ids = '',
            origin_platform = '',
            ...others
        } = query;
        return {
            pageNumber: Number(pageNumber),
            pageSize: Number(pageSize),
            onshelf_time_start: unixToStartDate(Number(onshelf_time_start)),
            onshelf_time_end: unixToEndDate(Number(onshelf_time_end)),
            commodity_id,
            vova_virtual_id,
            product_id,
            shop_name,
            level_one_category,
            level_two_category,
            merchant_ids,
            origin_platform,
            ...others,
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

    const _queryGoodsBatchOnsale = useCallback(() => {
        const data: IChannelProductListBody = searchRef.current!.getFieldsValue();
        setOnShelfLoading(true);
        queryGoodsBatchOnsale(data)
            .then(res => {
                // console.log('queryGoodsBatchOnsale', res);
                message.success('查询商品一键上架成功');
                onReload();
            })
            .finally(() => {
                setOnShelfLoading(false);
            });
    }, []);

    const _queryGoodsBatchOffsale = useCallback(() => {
        const data: IChannelProductListBody = searchRef.current!.getFieldsValue();
        setOffShelfLoading(true);
        queryGoodsBatchOffsale(data)
            .then(res => {
                // console.log('queryGoodsBatchOffsale', res);
                message.success('查询商品一键下架成功');
                onReload();
            })
            .finally(() => {
                setOffShelfLoading(false);
            });
    }, []);

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
                                <PermissionComponent
                                    key="on"
                                    pid="goods/channel/sales"
                                    control="tooltip"
                                >
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
                                </PermissionComponent>
                                <PermissionComponent
                                    key="on"
                                    pid="goods/channel/sales"
                                    control="tooltip"
                                >
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
                                </PermissionComponent>
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
                title: '商品渠道',
                dataIndex: 'origin_platform',
                align: 'center',
                width: 120,
            },
            {
                title: '商品状态',
                dataIndex: 'product_status',
                align: 'center',
                width: 150,
                render: (status: ProductStatusCode, record) => {
                    return (
                        <div>
                            {ProductStatusResponseMap[status]}
                            <PermissionComponent pid={'goods/channel/sales_log'} control="tooltip">
                                <Button type="link" onClick={() => showLog(record)}>
                                    上下架日志
                                </Button>
                            </PermissionComponent>
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
                            <PermissionComponent pid={'goods/channel/sku'} control="tooltip">
                                <Button
                                    type="link"
                                    onClick={() =>
                                        showSkuDialog(row.id, row.merchant_id, row.commodity_id)
                                    }
                                >
                                    查看sku详情
                                </Button>
                            </PermissionComponent>
                        </>
                    );
                },
            },
            {
                title: '在架销售价（$）',
                dataIndex: 'sale_price',
                align: 'center',
                width: 150,
                render: (_, item: IChannelProductListItem) => {
                    const {
                        min_sale_price = '0',
                        max_sale_price = '0',
                        min_shipping_fee = '0',
                        max_shipping_fee = '0',
                    } = item;
                    const salePrice = `${
                        min_sale_price === max_sale_price
                            ? max_sale_price
                            : `${min_sale_price}~${max_sale_price}`
                    }`;
                    const shipPrice = `${
                        min_shipping_fee === max_shipping_fee
                            ? max_shipping_fee
                            : `${min_shipping_fee}~${max_shipping_fee}`
                    }`;
                    return `${salePrice}（含运费${shipPrice}）`;
                },
            },
            {
                title: '国家运费',
                dataIndex: 'country_ship_fee',
                align: 'center',
                width: 140,
                render: (value: number, row: IChannelProductListItem) => {
                    return (
                        <PermissionComponent pid={'goods/channel/shipping_free'} control="tooltip">
                            <Button
                                type="link"
                                onClick={() => showCountryShipFee(row.product_id, row.merchant_id)}
                            >
                                查看国家运费
                            </Button>
                        </PermissionComponent>
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
                containerClassName={classNames(
                    formStyles.formHelpAbsolute,
                    formStyles.formContainer,
                )}
            >
                {children}
            </JsonForm>
        );
    }, [children]);

    const toolBarRender = useCallback(() => {
        const size = selectedRowKeys.length;
        return [
            <PermissionComponent key="on" pid="goods/channel/sales" control="tooltip">
                <LoadingButton
                    type="primary"
                    className={formStyles.formBtn}
                    onClick={() => onShelveList(selectedRowKeys)}
                    disabled={size === 0}
                >
                    一键上架
                </LoadingButton>
            </PermissionComponent>,
            <PermissionComponent key="of" pid="goods/channel/sales" control="tooltip">
                <LoadingButton
                    key={'of'}
                    type="primary"
                    className={formStyles.formBtn}
                    onClick={() => offShelveList(selectedRowKeys)}
                    disabled={size === 0}
                >
                    一键下架
                </LoadingButton>
            </PermissionComponent>,
            <PermissionComponent key="batchon" pid="/v1/vova_goods/batch_onsale" control="tooltip">
                <Popconfirm
                    placement="top"
                    title="确定要立即上架全部商品吗？"
                    onConfirm={_queryGoodsBatchOnsale}
                    okText="确定"
                    cancelText="取消"
                >
                    <Button loading={onShelfLoading} className={formStyles.formBtn}>
                        查询商品一键上架
                    </Button>
                </Popconfirm>
            </PermissionComponent>,
            <PermissionComponent key="batchoff" pid="/v1/vova_goods/batch_onsale" control="tooltip">
                <Popconfirm
                    placement="top"
                    title="确定要立即下架架全部商品吗？"
                    onConfirm={_queryGoodsBatchOffsale}
                    okText="确定"
                    cancelText="取消"
                >
                    <Button loading={offShelfLoading} className={formStyles.formBtn}>
                        查询商品一键下架
                    </Button>
                </Popconfirm>
            </PermissionComponent>,
        ];
    }, [selectedRowKeys, loading, onShelfLoading, offShelfLoading]);

    const table = useMemo(() => {
        return (
            <SettingTable<IChannelProductListItem>
                settingKey={'/channel/goods'}
                rowKey="id"
                bottom={60}
                minHeight={500}
                rowSelection={rowSelection}
                pagination={pagination}
                columns={columns}
                dataSource={dataSource}
                loading={loading}
                onChange={onChange}
                toolBarRender={toolBarRender}
            />
        );
    }, [loading, selectedRowKeys, onShelfLoading, offShelfLoading]);

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
    }, [loading, exportDialog, selectedRowKeys, onShelfLoading, offShelfLoading]);

    const logModal = useMemo(() => {
        return <OnOffLogModal visible={visible} onClose={onClose} />;
    }, [visible]);

    useEffect(() => {
        if (urlQueryRef.current && urlQueryRef.current?.from === 'selection') {
            const { commodity_id, merchant_ids, vova_virtual_id } = urlQueryRef.current;
            if (
                commodity_id &&
                merchant_ids &&
                vova_virtual_id &&
                dataSource &&
                dataSource.length
            ) {
                showSkuDialog(dataSource[0].id, merchant_ids as string, commodity_id as string);
                urlQueryRef.current = null;
            }
        }
    }, [dataSource]);

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

import React, { RefObject, useCallback, useMemo, useRef, useState } from 'react';
import ExcelDialog from './components/ExcelDialog';
import '@/styles/index.less';
import '@/styles/product.less';
import '@/styles/modal.less';
import '@/styles/form.less';
import channelStyles from '@/styles/_channel.less';
import { Modal, message, Button, Pagination } from 'antd';
import { BindAll } from 'lodash-decorators';
import { FitTable } from '@/components/FitTable';
import { ColumnProps } from 'antd/es/table';
import { TaskStatusEnum } from '@/enums/StatusEnum';
import PopConfirmLoadingButton from '@/components/PopConfirmLoadingButton';
import AutoEnLargeImg from '@/components/AutoEnLargeImg';
import {
    queryChannelGoodsList,
    exportChannelProductList,
    updateChannelShelveState,
    queryChannelCategory,
    queryShopList,
} from '@/services/channel';
import {
    ProductStatusMap,
    ProductStatusCode,
    ProductStatusList,
    checkLowerShelf,
    checkUpperShelf,
} from '@/config/dictionaries/Product';
import { defaultPageNumber, defaultPageSize, EmptyObject } from '@/config/global';
import { IChannelProductListItem, IChannelCategoryItem } from '@/interface/IChannel';
import SearchForm, { FormField, SearchFormRef } from '@/components/SearchForm';
import { convertEndDate, convertStartDate } from '@/utils/date';
import queryString from 'query-string';
import CopyLink from '@/components/copyLink';
import ShipFeeModal from './components/ShipFeeModal';
import SkuEditModal from './components/SkuEditModal';
import Container from '@/components/Container';
import { useList } from '@/utils/hooks';
import { ITaskListExtraData, ITaskListItem, ITaskListQuery } from '@/interface/ITask';
import { getTaskList } from '@/services/task';
import LoadingButton from '@/components/LoadingButton';
import { SearchOutlined } from '@ant-design/icons';
import ProTable from '@/components/ProTable';
import { ProColumns } from '@ant-design/pro-table';
import SkuDialog from './components/SkuEditModal';
import { isEmptyObject } from '@/utils/utils';
import MerchantListModal from '@/pages/goods/components/MerchantListModal';
import { Icons } from '@/components/Icon';

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
        formItemClassName: 'form-item',
        formatter: ['start_date', 'end_date'],
    },
    {
        type: 'input',
        label: 'Commodity ID',
        name: 'commodity_id',
        placeholder: '多个逗号隔开',
        className: 'input-default',
        formItemClassName: 'form-item',
    },
    {
        type: 'input',
        label: <span>虚拟&emsp;ID</span>,
        name: 'vova_virtual_id',
        placeholder: '多个逗号隔开',
        className: 'input-default',
        formItemClassName: 'form-item',
    },
    {
        type: 'input',
        label: 'Product ID',
        name: 'product_id',
        placeholder: '多个逗号隔开',
        className: 'input-default',
        formItemClassName: 'form-item',
    },
    {
        type: 'select',
        label: <span>销&emsp;&emsp;&emsp;量</span>,
        name: 'sales_volume',
        className: 'select-default',
        formItemClassName: 'form-item',
        optionList: salesVolumeList,
    },
    {
        type: 'select',
        label: '店铺名称',
        name: 'mechant_ids',
        placeholder: '多个逗号隔开',
        className: 'select-default',
        formItemClassName: 'form-item',
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
        className: 'select-default',
        formItemClassName: 'form-item',
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
        className: 'select-default',
        formItemClassName: 'form-item',
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
        className: 'select-default',
        formItemClassName: 'form-item',
        optionList: ProductStatusList.map(({ name, id }) => {
            return { name: name, value: id };
        }),
    },
];

const ChannelList: React.FC = props => {
    const searchRef = useRef<SearchFormRef>(null);
    const [exportDialog, setExportDialog] = useState(false);

    const skuRef = useRef<SkuDialog>(null);

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
            mechant_ids = '',
        } = query;
        return {
            pageNumber: Number(pageNumber),
            pageSize: Number(pageSize),
            onshelf_time_start: convertStartDate(Number(onshelf_time_start)),
            onshelf_time_end: convertEndDate(Number(onshelf_time_end)),
            commodity_id,
            vova_virtual_id,
            product_id,
            sales_volume,
            shop_name,
            level_one_category,
            level_two_category,
            product_status,
            mechant_ids,
        };
    }, []);

    const {
        query,
        loading,
        pageNumber,
        pageSize,
        dataSource,
        total,
        selectedRowKeys,
        onSearch,
        onReload,
        onChange,
        setSelectedRowKeys,
    } = useList(queryChannelGoodsList, searchRef, undefined, {
        pageSize: page_size,
        pageNumber: page_number,
    });

    const showExcelDialog = useCallback(() => {
        setExportDialog(true);
    }, []);
    const closeExcelDialog = useCallback(() => {
        setExportDialog(false);
    }, []);

    const getCopiedLinkQuery = useCallback(() => {
        return Object.assign({}, query);
    }, [query]);

    const showSkuDialog = useCallback((id: string, merchant_id: string) => {
        skuRef.current!.showModal(id, merchant_id);
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

    const onShelveList = useCallback(() => {
        const taskBodyList = dataSource
            .filter(item => {
                return selectedRowKeys.indexOf(item.product_id) > -1;
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
    }, [selectedRowKeys, dataSource]);

    const offShelveList = useCallback(() => {
        const taskBodyList = dataSource
            .filter(item => {
                return selectedRowKeys.indexOf(item.product_id) > -1;
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
    }, [selectedRowKeys, dataSource]);

    const columns = useMemo(() => {
        return [
            {
                title: '店铺名称',
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
                width: 100,
                render: (status: ProductStatusCode) => {
                    return ProductStatusMap[status];
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
                                onClick={() => showSkuDialog(row.id, row.merchant_id)}
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
            {
                title: '操作',
                dataIndex: 'product_status',
                align: 'center',
                width: 140,
                render: (status: ProductStatusCode, item) => {
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
        ] as ProColumns<IChannelProductListItem>[];
    }, []);

    const onSelectChange = useCallback((selectedRowKeys: React.Key[]) => {
        setSelectedRowKeys(selectedRowKeys as string[]);
    }, []);

    const rowSelection = useMemo(() => {
        return {
            fixed: true,
            columnWidth: '50px',
            selectedRowKeys: selectedRowKeys,
            onChange: onSelectChange,
        };
    }, [selectedRowKeys]);

    const children = useMemo(() => {
        const rowSize = selectedRowKeys.length;
        return (
            <div>
                <LoadingButton
                    type="primary"
                    className="btn-group vertical-middle form-item"
                    icon={<Icons type="scm-on-sale" />}
                    onClick={onShelveList}
                    disabled={rowSize === 0}
                >
                    一键上架
                </LoadingButton>
                <LoadingButton
                    type="primary"
                    className="btn-group vertical-middle form-item"
                    icon={<Icons type="scm-of-sale" />}
                    onClick={offShelveList}
                    disabled={rowSize === 0}
                >
                    一键下架
                </LoadingButton>
                <LoadingButton
                    type="primary"
                    className="btn-group vertical-middle form-item"
                    icon={<SearchOutlined />}
                    onClick={onSearch}
                >
                    查询
                </LoadingButton>
                <Button
                    disabled={total <= 0}
                    type="primary"
                    className="btn-group vertical-middle form-item"
                    onClick={showExcelDialog}
                    icon={<Icons type="scm-export" />}
                >
                    导出
                </Button>
            </div>
        );
    }, [selectedRowKeys, loading]);

    const body = useMemo(() => {
        return (
            <Container>
                <SearchForm
                    ref={searchRef}
                    fieldList={formFields}
                    labelClassName="product-form-label"
                    initialValues={defaultInitialValues}
                >
                    {children}
                </SearchForm>
                <ProTable<IChannelProductListItem>
                    search={false}
                    headerTitle="查询表格"
                    rowKey="product_id"
                    scroll={{ x: true, scrollToFirstRowOnChange: true }}
                    bottom={60}
                    minHeight={500}
                    rowSelection={rowSelection}
                    pagination={{
                        total: total,
                        current: pageNumber,
                        pageSize: pageSize,
                        showSizeChanger: true,
                    }}
                    tableAlertRender={false}
                    columns={columns}
                    dataSource={dataSource}
                    loading={loading}
                    onChange={onChange}
                    options={{
                        density: true,
                        fullScreen: true,
                        reload: onReload,
                        setting: true,
                    }}
                />
                <ExcelDialog
                    visible={exportDialog}
                    total={total}
                    form={searchRef}
                    onCancel={closeExcelDialog}
                />
                <CopyLink getCopiedLinkQuery={getCopiedLinkQuery} />
                <SkuEditModal ref={skuRef} />
            </Container>
        );
    }, [loading, exportDialog, selectedRowKeys]);

    return <>{body}</>;
};

export default ChannelList;

import React, { RefObject } from 'react';
import ExcelDialog from './components/ExcelDialog';
import '@/styles/index.less';
import './index.less';
import '@/styles/product.less';
import '@/styles/modal.less';
import { Modal, message, Button, Pagination } from 'antd';
import { BindAll } from 'lodash-decorators';
import { FitTable } from '@/components/FitTable';
import { ColumnProps } from 'antd/es/table';
import { checkLowerShelf, checkUpperShelf } from '@/enums/StatusEnum';
import PopConfirmLoadingButton from '@/components/PopConfirmLoadingButton';
import AutoEnLargeImg from '@/components/AutoEnLargeImg';
import {
    queryChannelGoodsList,
    exportChannelProductList,
    updateChannelShelveState,
    queryChannelCategory,
} from '@/services/channel';
import {
    ProductStatusMap,
    ProductStatusCode,
    ProductStatusList,
} from '@/config/dictionaries/Product';
import { EmptyObject } from '@/config/global';
import { IChannelProductListItem, IChannelCategoryItem } from '@/interface/IChannel';
import SearchForm, { IFieldItem } from '@/components/SearchForm';
import { convertEndDate, convertStartDate } from '@/utils/date';
import queryString from 'query-string';
import CopyLink from '@/components/copyLink';
import ShipFeeModal from './components/ShipFeeModal';
import SkuEditModal from './components/SkuEditModal';


declare interface IVoVaListState {
    dataSet: Array<IChannelProductListItem>;
    dataLoading: boolean;
    searchLoading: boolean;
    excelDialogStatus: boolean;
    pageNumber: number;
    page: number;
    total: number;
    defaultInitialValues?: { [key: string]: any };
}

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

const formFields: IFieldItem[] = [
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
        type: 'input',
        label: <span>店&ensp;铺&ensp;名</span>,
        name: 'shop_name',
        placeholder: '多个逗号隔开',
        className: 'input-default',
        formItemClassName: 'form-item',
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
        optionList: () =>
            queryChannelCategory()
                .then(({ data = [] } = EmptyObject) => {
                    return data.map(({ platform_cate_id, platform_cate_name, children }) => {
                        return {
                            value: String(platform_cate_id),
                            name: platform_cate_name,
                            children,
                        };
                    });
                })
                .catch(() => {
                    return [];
                }),
        onChange: (name, form, setState) => {
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
            convert: ({ platform_cate_id, platform_cate_name }: IChannelCategoryItem) => {
                return {
                    value: String(platform_cate_id),
                    name: platform_cate_name,
                };
            },
        },
        syncDefaultOption: {
            value: '',
            name: '全部',
        },
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

@BindAll()
class Index extends React.PureComponent<{}, IVoVaListState> {
    private formRef: RefObject<SearchForm> = React.createRef();
    private skuRef: RefObject<SkuEditModal> = React.createRef();
    private queryData: any = {};
    constructor(props: {}) {
        super(props);
        const { page, page_count, ...extra } = this.computeInitialValues();
        this.state = {
            dataSet: [],
            dataLoading: false,
            searchLoading: true,
            total: 0,
            pageNumber: page_count,
            // pageNumber: 1,
            page: page,
            excelDialogStatus: false,
            defaultInitialValues: extra,
        };
    }

    componentDidMount() {
        this.queryList({
            searchLoading: true,
        });
    }
    private computeInitialValues() {
        // copy link 解析
        const { query, url } = queryString.parseUrl(window.location.href);
        if (query) {
            window.history.replaceState({}, '', url);
        }
        const {
            page = 1,
            page_count = 50,
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
        } = query;
        return {
            page: Number(page),
            page_count: Number(page_count),
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
        };
    }
    private queryList(
        params: { page?: number; page_number?: number; searchLoading?: boolean } = {},
    ) {
        const {
            page = this.state.page,
            page_number = this.state.pageNumber,
            searchLoading = false,
        } = params;
        const values = this.formRef.current!.getFieldsValue();
        this.setState({
            dataLoading: true,
            searchLoading,
        });
        const query = {
            page: page,
            page_count: page_number,
            ...values,
        };
        this.queryData = {
            ...query,
        };
        queryChannelGoodsList(query)
            .then(({ data: { list = [], total = 0 } = EmptyObject } = EmptyObject) => {
                this.setState({
                    page: page,
                    pageNumber: page_number,
                    dataSet: list,
                    total,
                });
            })
            .finally(() => {
                this.setState({
                    dataLoading: false,
                    searchLoading: false,
                });
            });
    }

    private onSearch() {
        this.queryList({
            searchLoading: true,
            page: 1,
        });
    }

    // 上架操作
    private onShelves(row: IChannelProductListItem) {
        return updateChannelShelveState({
            type: 'onsale',
            info: {
                onsale: {
                    task_body: {
                        product_id: row.product_id,
                        commodity_id: row.commodity_id,
                        sale_domain: 'vova',
                    },
                },
            },
        })
            .then(res => {
                message.success('上架任务已发送');
                this.queryList();
            })
            .catch(() => {
                message.success('上架任务发送失败');
            });
    }

    // 下架操作
    private offShelves(row: IChannelProductListItem) {
        return updateChannelShelveState({
            type: 'offsale',
            info: {
                offsale: {
                    task_body: {
                        product_id: row.product_id,
                        commodity_id: row.commodity_id,
                        sale_domain: 'vova',
                    },
                },
            },
        })
            .then(res => {
                message.success('下架任务已发送');
                this.queryList();
            })
            .catch(() => {
                message.error('下架任务发送失败');
            });
    }

    private columns: ColumnProps<IChannelProductListItem>[] = [
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
                <AutoEnLargeImg src={value} className="goods-vova-img" />
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
                            ghost={true}
                            size="small"
                            type="primary"
                            onClick={() => this.showSkuDialog(row.product_id)}
                        >查看sku详情</Button>
                    </>
                )
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
                        ghost={true}
                        size="small"
                        type="primary"
                        onClick={() => this.showCountryShipFee(row.product_id)}
                    >查看国家运费</Button>
                )
            },
        },
        // {
        //     title: '链接',
        //     dataIndex: 'vova_product_link',
        //     align: 'center',
        //     width: 240,
        //     render: (url: string) => {
        //         return (
        //             url && (
        //                 <Button target="_blank" type="link" href={url} className="product-link">
        //                     {url}
        //                 </Button>
        //             )
        //         );
        //     },
        // },
        {
            title: '操作',
            dataIndex: 'product_status',
            align: 'center',
            width: 140,
            render: (status, item) => {
                const canUpper = !checkUpperShelf(status);
                const canDown = !checkLowerShelf(status);
                return {
                    children: (
                        <>
                            <PopConfirmLoadingButton
                                buttonProps={{
                                    className: 'shelves-btn',
                                    disabled: canUpper,
                                    children: '上架',
                                }}
                                popConfirmProps={{
                                    title: '确定需要上架该商品吗?',
                                    okText: '确定',
                                    cancelText: '取消',
                                    disabled: canUpper,
                                    onConfirm: () => this.onShelves(item),
                                }}
                            />
                            <PopConfirmLoadingButton
                                buttonProps={{
                                    className: 'unshelves-btn',
                                    disabled: canDown,
                                    children: '下架',
                                }}
                                popConfirmProps={{
                                    title: '确定需要下架该商品吗?',
                                    okText: '确定',
                                    cancelText: '取消',
                                    disabled: canDown,
                                    onConfirm: () => this.offShelves(item),
                                }}
                            />
                        </>
                    ),
                };
            },
        },
    ];

    private showTotal(total: number) {
        return <span className="data-grid-total">共有{total}条</span>;
    }
    private onPageChange(page: number, pageSize?: number) {
        this.queryList({
            page: page,
        });
    }
    private onShowSizeChange(page: number, size: number) {
        this.queryList({
            page: page,
            page_number: size,
        });
    }

    private showExcelDialog() {
        this.setState({
            excelDialogStatus: true,
        });
    }

    // 显示下载弹框
    private toggleExcelDialog(status: boolean) {
        this.setState({
            excelDialogStatus: status,
        });
    }

    private getExcelData(pageNumber: number, pageSize: number) {
        const values = this.formRef.current!.getFieldsValue();
        return exportChannelProductList({
            page: pageNumber,
            page_count: pageSize,
            ...values,
        })
            .catch(err => {
                message.error('导出表格失败！');
            })
            .finally(() => {
                this.toggleExcelDialog(false);
            });
    }

    private getCopiedLinkQuery() {
        return this.queryData;
    }

    private showSkuDialog = (productId: string) => {
        // console.log(this.skuRef);
        this.skuRef.current!.showModal(productId);
    }

    // 查看国家运费
    private showCountryShipFee(product_id: string) {
        Modal.info({
            // className: 'product-modal modal-empty',
            icon: null,
            title: '查看国家运费',
            // cancelText: null,
            okText: '关闭',
            maskClosable: true,
            width: 800,
            content: <ShipFeeModal product_id={product_id} />,
        });
    }
    private getCopiedLinkQuery() {
        return this.queryData;
    }

    render() {
        const {
            dataSet,
            total,
            excelDialogStatus,
            dataLoading,
            page,
            pageNumber,
            searchLoading,
            defaultInitialValues,
        } = this.state;
        return (
            <div className="container">
                <SearchForm
                    ref={this.formRef}
                    fieldList={formFields}
                    labelClassName="product-form-label"
                    initialValues={defaultInitialValues}
                >
                    <div>
                        <Button
                            type="primary"
                            className="btn-group vertical-middle form-item"
                            loading={searchLoading}
                            onClick={this.onSearch}
                        >
                            查询
                        </Button>
                        <Button
                            type="primary"
                            className="btn-group vertical-middle form-item"
                            onClick={this.showExcelDialog}
                        >
                            导出
                        </Button>
                    </div>
                </SearchForm>
                {/*<DataStatusUpdate />*/}
                <div className="float-clear">
                    <Pagination
                        className="float-right form-item"
                        pageSize={pageNumber}
                        current={page}
                        total={total}
                        pageSizeOptions={['50', '100', '500', '1000']}
                        onChange={this.onPageChange}
                        onShowSizeChange={this.onShowSizeChange}
                        showSizeChanger={true}
                        showQuickJumper={{
                            goButton: <Button className="btn-go">Go</Button>,
                        }}
                        showLessItems={true}
                        showTotal={this.showTotal}
                    />
                </div>
                <FitTable
                    className="form-item goods-vova-table"
                    rowKey="product_id"
                    bordered={true}
                    columns={this.columns}
                    dataSource={dataSet}
                    pagination={false}
                    loading={dataLoading}
                    scroll={{
                        x: 'max-content',
                        scrollToFirstRowOnChange: true,
                    }}
                    minHeight={600}
                    bottom={130}
                />
                <ExcelDialog
                    visible={excelDialogStatus}
                    total={total}
                    getExcelData={this.getExcelData}
                    toggleExcelDialog={this.toggleExcelDialog}
                />
                <CopyLink getCopiedLinkQuery={this.getCopiedLinkQuery} />
                <SkuEditModal ref={this.skuRef}/>
            </div>
        );
    }
}

export default Index;

import React, { RefObject } from 'react';
import SearchCondition, { salesVolumeList } from './components/SearchCondition';
import ExcelDialog from './components/ExcelDialog';
import '@/styles/index.less';
import './index.less';
import '@/styles/product.less';
import { Modal, message, Button, Pagination } from 'antd';
import ProductEditModal from './components/ProductEditModal';
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
} from '@/services/channel';
import {
    ProductStatusMap,
    ProductStatusCode,
    ProductStatusList,
} from '@/config/dictionaries/Product';
import { IChannelProductListItem } from '@/interface/IChannel';
import { EmptyObject } from '@/config/global';
import { convertEndDate, convertStartDate } from '@/utils/date';
import queryString from 'query-string';
import CopyLink from '@/components/copyLink';

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

@BindAll()
class Index extends React.PureComponent<{}, IVoVaListState> {
    private formRef: RefObject<SearchCondition> = React.createRef();
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
            sales_volume = salesVolumeList[0].id,
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
                // this.queryList();
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
                // this.queryList();
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
            title: '商品详情',
            dataIndex: 'product_detail',
            align: 'center',
            width: 150,
            render: (value: string, row: IChannelProductListItem, index: number) => {
                return (
                    <Button
                        onClick={() => {
                            this.toggleDetailDialog(row);
                        }}
                    >
                        查看详情
                    </Button>
                );
            },
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
            title: '链接',
            dataIndex: 'vova_product_link',
            align: 'center',
            width: 240,
            render: (url: string) => {
                return (
                    url && (
                        <Button target="_blank" type="link" href={url} className="product-link">
                            {url}
                        </Button>
                    )
                );
            },
        },
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

    // 查看详情弹窗
    private toggleDetailDialog(row: IChannelProductListItem) {
        Modal.info({
            className: 'product-modal modal-empty',
            icon: null,
            title: '查看/编辑商品详情',
            cancelText: null,
            okText: null,
            content: <ProductEditModal product_id={row.product_id} channel="vova" />,
            maskClosable: true,
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
                <SearchCondition
                    defaultInitialValues={defaultInitialValues}
                    ref={this.formRef}
                    searchLoading={searchLoading}
                    onSearch={this.onSearch}
                    toggleExcelDialog={this.toggleExcelDialog}
                />
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
            </div>
        );
    }
}

export default Index;

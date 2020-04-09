import React, { RefObject } from 'react';
import { message, Button } from 'antd';
import ExcelDialog from './components/ExcelDialog';
import { JsonFormRef, FormField } from 'react-components/es/JsonForm';
import { JsonForm } from 'react-components';
import Container from '@/components/Container';
import GoodsProTable from './components/GoodsProTable';
import MerchantListModal from '../components/MerchantListModal';

import {
    getGoodsList,
    postGoodsExports,
    postGoodsOnsale,
    getGoodsDelete,
    IFilterParams,
    getCatagoryList,
    getAllGoodsOnsale,
    getGoodsStatusList,
} from '@/services/goods';

import { RouteComponentProps } from 'react-router';
import CopyLink from '@/components/copyLink';
import queryString from 'query-string';
import { IGoodsList, ISkuItem, ICatagoryItem } from '@/interface/ILocalGoods';
import {
    defaultOption,
    inventoryStatusList,
    versionStatusList,
    publishChannelStatusList,
} from '@/enums/LocalGoodsEnum';
import { EmptyObject } from '@/config/global';

import '../../../styles/goods-local.less';
import '@/styles/form.less';

export declare interface IPageData {
    page?: number;
    page_count?: number;
}

const getCatagoryListPromise = getCatagoryList();

const formFields: FormField[] = [
    {
        type: 'input',
        label: '爬虫任务 ID',
        name: 'task_number',
        placeholder: '多个逗号隔开',
        className: 'local-search-item-input',
        formItemClassName: 'form-item',
        formatter: 'numberStrArr',
    },
    {
        type: 'input',
        label: '店铺 ID',
        name: 'store_id',
        placeholder: '多个逗号隔开',
        className: 'local-search-item-input',
        formItemClassName: 'form-item',
        formatter: 'strArr',
    },
    {
        type: 'input',
        label: 'Commodity ID',
        name: 'commodity_id',
        placeholder: '多个逗号隔开',
        className: 'local-search-item-input',
        formItemClassName: 'form-item',
        formatter: 'strArr',
    },
    {
        type: 'input',
        label: '商品名称',
        name: 'title',
        placeholder: '请输入商品名称',
        className: 'local-search-item-input',
        formItemClassName: 'form-item',
        // formatter: 'strArr',
    },
    {
        type: 'select',
        label: '上架渠道',
        name: 'publish_channel',
        className: 'local-search-item-select',
        formItemClassName: 'form-item',
        formatter: 'number',
        optionList: [defaultOption, ...publishChannelStatusList],
    },
    {
        type: 'select',
        label: '销售状态',
        name: 'inventory_status',
        className: 'local-search-item-select',
        formItemClassName: 'form-item',
        formatter: 'number',
        optionList: [defaultOption, ...inventoryStatusList],
    },
    {
        type: 'select',
        label: '请选择版本状态',
        name: 'product_status',
        className: 'local-search-item-select',
        formItemClassName: 'form-item',
        formatter: 'joinStr',
        placeholder: '请选择版本状态',
        mode: 'multiple',
        maxTagCount: 2,
        optionList: () => getGoodsStatusList(),
    },
    {
        type: 'select',
        label: '版本更新',
        name: 'version_status',
        className: 'local-search-item-select',
        formItemClassName: 'form-item',
        formatter: 'number',
        optionList: [defaultOption, ...versionStatusList],
    },
    {
        type: 'select',
        label: '一级类目',
        name: 'first_catagory',
        className: 'local-search-item-select',
        formItemClassName: 'form-item',
        formatter: 'number',
        syncDefaultOption: {
            value: '',
            name: '全部',
        },
        optionList: () =>
            getCatagoryListPromise
                .then(({ convertList = [] } = EmptyObject) => {
                    return convertList;
                })
                .catch(() => {
                    return [];
                }),
        onChange: (name, form) => {
            form.resetFields(['second_catagory']);
            form.resetFields(['third_catagory']);
        },
    },
    {
        type: 'select',
        label: '二级类目',
        name: 'second_catagory',
        className: 'local-search-item-select',
        formItemClassName: 'form-item',
        formatter: 'number',
        optionListDependence: {
            name: 'first_catagory',
            key: 'children',
        },
        syncDefaultOption: {
            value: '',
            name: '全部',
        },
        optionList: () =>
            getCatagoryListPromise
                .then(({ convertList = [] } = EmptyObject) => {
                    return convertList;
                })
                .catch(() => {
                    return [];
                }),
        onChange: (name, form) => {
            form.resetFields(['third_catagory']);
        },
    },
    {
        type: 'select',
        label: '三级类目',
        name: 'third_catagory',
        className: 'local-search-item-select',
        formItemClassName: 'form-item',
        formatter: 'number',
        optionListDependence: {
            name: ['first_catagory', 'second_catagory'],
            key: 'children',
        },
        syncDefaultOption: {
            value: '',
            name: '全部',
        },
        optionList: () =>
            getCatagoryListPromise
                .then(({ convertList = [] } = EmptyObject) => {
                    return convertList;
                })
                .catch(() => {
                    return [];
                }),
    },
    {
        type: 'inputRange',
        label: 'sku数量',
        name: ['min_sku', 'max_sku'],
        className: 'local-search-item-input-min',
        formItemClassName: 'form-item',
    },
    {
        type: 'inputRange',
        label: '价格范围（￥）',
        name: ['min_price', 'max_price'],
        className: 'local-search-item-input-min',
        formItemClassName: 'form-item',
        precision: 2,
    },
    {
        type: 'inputRange',
        label: '销量',
        name: ['min_sale', 'max_sale'],
        className: 'local-search-item-input-min',
        formItemClassName: 'form-item',
    },
    {
        type: 'positiveInteger',
        label: '评论数量>=',
        name: 'min_comment',
        // placeholder: '多个逗号隔开',
        className: 'local-search-item-input-min',
        formItemClassName: 'form-item',
        formatter: 'number',
    },
];

export type IRowDataItem = IGoodsList & ISkuItem;

declare interface IIndexState {
    excelDialogStataus: boolean;
    merchantDialogStatus: boolean;
    // 按钮加载中状态
    searchLoading: boolean;
    deleteLoading: boolean;
    page: number;
    page_count: number;
    allCount: number;
    goodsList: IRowDataItem[];
    selectedRowKeys: string[];
    allCatagoryList: ICatagoryItem[];
    onsaleType: 'default' | 'all';
}

type LocalPageProps = RouteComponentProps<{}, any, { task_id?: number }>;

class Local extends React.PureComponent<LocalPageProps, IIndexState> {
    private formRef: RefObject<JsonFormRef> = React.createRef();
    // private queryData: any = {};
    // 保存搜索条件
    private searchFilter: IFilterParams | null = null;
    private initialValues: any = {};
    constructor(props: LocalPageProps) {
        super(props);
        // console.log(this.computeInitialValues());
        const { page, page_count, ...initialValues } = this.computeInitialValues();
        this.initialValues = initialValues;
        this.state = {
            excelDialogStataus: false,
            merchantDialogStatus: false,
            deleteLoading: false,
            searchLoading: false,
            page,
            page_count,
            allCount: 0,
            goodsList: [],
            selectedRowKeys: [],
            allCatagoryList: [],
            onsaleType: 'default',
        };
    }
    private computeInitialValues = () => {
        // copy link 解析
        const { query, url } = queryString.parseUrl(window.location.href);
        // console.log('computeInitialValues', query, url);
        if (query) {
            window.history.replaceState({}, '', url);
        }
        const {
            page = 1,
            page_count = 50,
            commodity_id,
            store_id,
            task_number,
            product_status,
            ...rest
        } = query;
        return {
            page: Number(page),
            page_count: Number(page_count),
            commodity_id: commodity_id ? (commodity_id as string[]).join(',') : commodity_id,
            store_id: store_id ? (store_id as string[]).join(',') : store_id,
            task_number: task_number ? (task_number as string[]).join(',') : task_number,
            product_status: product_status ? (product_status as string).split(',') : product_status,
            inventory_status: '',
            version_status: '',
            first_catagory: '',
            second_catagory: '',
            third_catagory: '',
            publish_channel: '',
            ...rest,
        };
    };

    componentDidMount(): void {
        this.getCatagoryList();
        this.onSearch();
        // console.log(this.props);
    }

    changeSelectedRowKeys = (keys: string[]) => {
        this.setState({
            selectedRowKeys: keys,
        });
    };

    // 取消选中的商品
    private cancelSelectedRow = () => {
        this.setState({
            selectedRowKeys: [],
        });
    };

    private onSearch = (searchData?: IPageData, isRefresh?: boolean) => {
        const { page, page_count } = this.state;
        let params: IFilterParams = {
            page,
            page_count,
        };
        if (this.formRef.current) {
            params = Object.assign(params, this.formRef.current?.getFieldsValue());
        }
        if (searchData) {
            params = Object.assign(params, searchData);
        }
        this.setState({
            searchLoading: true,
        });
        return getGoodsList(params)
            .then(res => {
                // console.log(res)
                this.searchFilter = params;
                const { list, all_count } = res.data;
                if (!isRefresh) {
                    this.cancelSelectedRow();
                }
                this.setState({
                    allCount: all_count as number,
                    page: params.page as number,
                    page_count: params.page_count as number,
                    goodsList: this.handleRowData(list),
                });
            })
            .finally(() => {
                this.setState({
                    searchLoading: false,
                });
            });
    };

    private handleClickSearch = () => {
        // console.log(this.formRef.current?.getFieldsValue());
        this.formRef.current?.validateFields().then(values => {
            // console.log('handleClickSearch', values);
            this.onSearch({
                page: 1,
            });
        });
    };

    private getCatagoryList = () => {
        getCatagoryListPromise.then(res => {
            // console.log('getCatagoryList', res);
            this.setState({
                allCatagoryList: res.list,
            });
        });
    };

    // 处理表格数据
    private handleRowData(list: IGoodsList[]): IRowDataItem[] {
        return list.map(item => {
            const { sku_info } = item;
            if (sku_info.length > 0) {
                return {
                    ...item,
                    ...sku_info[0],
                };
            }
            return item;
        });
    }

    // 删除
    getGoodsDelete = () => {
        const { selectedRowKeys, goodsList } = this.state;
        this.setState({
            deleteLoading: true,
        });
        getGoodsDelete({
            commodity_ids: [
                ...new Set(
                    selectedRowKeys.map(productId => {
                        const index = goodsList.findIndex(item => item.product_id === productId);
                        return goodsList[index].commodity_id;
                    }),
                ),
            ],
        })
            .then(res => {
                this.setState({
                    deleteLoading: false,
                });
                this.onSearch();
                const { success, failed } = res.data;
                let str = '';
                if (success.length) {
                    str += `删除成功${success.join('、')}。`;
                } else if (failed.length) {
                    str += `删除失败${failed.map((item: any) => item.id).join('、')}。`;
                }
                message.info(str);
            })
            .finally(() => {
                this.setState({
                    deleteLoading: false,
                });
            });
    };

    // 获取下载表格数据
    private getExcelData = (count: number) => {
        return postGoodsExports(
            Object.assign({}, this.searchFilter, {
                page: count + 1,
                page_count: 10000,
            }),
        ).finally(() => {
            this.toggleExcelDialog(false);
        });
    };

    // 显示下载弹框
    private toggleExcelDialog = (status: boolean) => {
        this.setState({
            excelDialogStataus: status,
        });
    };

    private getCopiedLinkQuery = () => {
        return this.searchFilter as IFilterParams;
    };

    private handleClickOnsale = () => {
        this.setState({
            merchantDialogStatus: true,
            onsaleType: 'default',
        });
    };

    private handleClickAllOnsale = () => {
        this.setState({
            merchantDialogStatus: true,
            onsaleType: 'all',
        });
    };

    // 一键上架
    postGoodsOnsale = (merchants_id: string[]) => {
        const { selectedRowKeys } = this.state;

        return postGoodsOnsale({
            scm_goods_id: selectedRowKeys,
            merchants_id: merchants_id.join(','),
        }).then(res => {
            this.onSearch();
            message.success('上架任务已发送');
        });
    };

    // 查询商品一键上架
    getAllGoodsOnsale = (merchants_id: string[]) => {
        const searchParams = {
            merchants_id: merchants_id.join(','),
            ...this.formRef.current?.getFieldsValue(),
        };
        return getAllGoodsOnsale(searchParams).then(res => {
            // console.log('getAllGoodsOnsale', res);
            this.onSearch();
            message.success('查询商品一键上架成功');
        });
    };

    private merchantOkey = (merchants_id: string[]) => {
        // return Promise.resolve();
        const { onsaleType } = this.state;
        return onsaleType === 'default'
            ? this.postGoodsOnsale(merchants_id)
            : this.getAllGoodsOnsale(merchants_id);
    };

    private merchantCancel = () => {
        this.setState({
            merchantDialogStatus: false,
        });
    };

    private setProductTags = (productId: string, tags: string[]) => {
        const { goodsList } = this.state;
        this.setState({
            goodsList: goodsList.map(item => {
                if (item.product_id === productId) {
                    return {
                        ...item,
                        tags,
                    };
                }
                return item;
            }),
        });
    };

    render() {
        const {
            page,
            page_count,
            allCount,
            goodsList,
            excelDialogStataus,
            merchantDialogStatus,
            selectedRowKeys,
            deleteLoading,
            searchLoading,
            allCatagoryList,
        } = this.state;

        const disabled = selectedRowKeys.length === 0;

        return (
            <Container>
                <div className="goods-local">
                    <JsonForm
                        labelClassName="local-search-label"
                        initialValues={this.initialValues}
                        ref={this.formRef}
                        fieldList={formFields}
                    >
                        <div>
                            <Button
                                type="primary"
                                className="btn-group form-item"
                                loading={searchLoading}
                                onClick={this.handleClickSearch}
                            >
                                查询
                            </Button>
                        </div>
                    </JsonForm>
                    <div style={{ margin: '16px 0' }}>
                        <Button
                            type="primary"
                            className="local-search-item-btn"
                            onClick={this.handleClickOnsale}
                            disabled={disabled}
                        >
                            一键上架
                        </Button>
                        <Button
                            type="primary"
                            className="local-search-all-btn"
                            onClick={this.handleClickAllOnsale}
                        >
                            查询商品一键上架
                        </Button>
                        <Button
                            className="local-search-item-btn"
                            loading={deleteLoading}
                            onClick={this.getGoodsDelete}
                            disabled={disabled}
                        >
                            删除
                        </Button>
                        <Button
                            disabled={allCount === 0}
                            className="local-search-item-btn"
                            onClick={() => this.toggleExcelDialog(true)}
                        >
                            导出至Excel
                        </Button>
                    </div>
                    <GoodsProTable
                        loading={searchLoading}
                        currentPage={page}
                        pageSize={page_count}
                        total={allCount}
                        selectedRowKeys={selectedRowKeys}
                        goodsList={goodsList}
                        allCatagoryList={allCatagoryList}
                        onSearch={this.onSearch}
                        changeSelectedRowKeys={this.changeSelectedRowKeys}
                        setProductTags={this.setProductTags}
                    />
                    <ExcelDialog
                        visible={excelDialogStataus}
                        allCount={allCount}
                        getExcelData={this.getExcelData}
                        toggleExcelDialog={this.toggleExcelDialog}
                    />
                    <CopyLink getCopiedLinkQuery={this.getCopiedLinkQuery} />
                    <MerchantListModal
                        visible={merchantDialogStatus}
                        onOKey={this.merchantOkey}
                        onCancel={this.merchantCancel}
                    />
                </div>
            </Container>
        );
    }
}

export default Local;

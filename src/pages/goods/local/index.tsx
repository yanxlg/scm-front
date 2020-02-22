/**
 * Routes:
 *   - ./src/routes/PrivateRoute.tsx
 */

import React from 'react';
import { Pagination, message } from 'antd';

import LocalSearch from './components/LocalSearch';
import GoodsTable from './components/GoodsTable';

import ImportGoodsDialog from './components/ImportGoodsDialog';
import ShelvesDialog, { ISaleStatausItem } from './components/ShelvesDialog';
import ImgEditDialog from './components/ImgEditDialog';
import ExcelDialog from './components/ExcelDialog';
// good-local.less
import '../../../styles/goods-local.less';

import {
    getGoodsList,
    postGoodsExports,
    postGoodsOnsale,
    getGoodsDelete,
    getGoodsSales,
    IFilterParams,
    getCatagoryList,
    putGoodsEdit,
} from '@/services/goods';
import { strToNumber } from '@/utils/common'
import { RouteComponentProps } from 'dva/router';

declare interface IPageData {
    page?: number;
    page_count?: number;
}

export declare interface ICatagoryData {
    id?: string;
    name?: string;
}

declare interface ITranslateItem {
    language: string;
    updateTime: number;
}

export declare interface ISaleItem {
    onsale_channel: string;
    onsale_time: number;
}

export declare interface ISkuStyle {
    [key: string]: string;
    // size?: string;
    // color?: string;

}

declare interface ISkuItem {
    sku_sn: string;
    sku_style: ISkuStyle;
    sku_price: number;
    sku_weight: number;
    sku_inventory: number;
    sku_shopping_fee: number;
}

declare interface IBaseData {
    commodity_id: string;
    product_id: string;
    goods_img: string;
    goods_status: string;
    title: string;
    description: string;
    first_catagory: ICatagoryData;
    second_catagory: ICatagoryData;
    third_catagory: ICatagoryData;
    sku_number: number;
    sku_image: string[];
    sales_volume: number;
    comments: number;
    brand: string;
    store_id: string;
    store_name: string;
    worm_task_id: number;
    worm_goods_id: number;
    onsale_info: ISaleItem[];
    update_time: number;
    worm_goodsinfo_link: string;
    hasnew_version: number;
}

declare interface IDataItem extends IBaseData {
    sku_info: ISkuItem[];
}

export declare interface IRowDataItem extends IBaseData {
    sku_sn: string;
    sku_style: ISkuStyle;
    sku_price: number;
    sku_weight: number;
    sku_inventory: number;
    sku_shopping_fee: number;
    _rowspan?: number;
}

export declare interface ICategoryItem {
    id: string;
    name: string;
    children?: ICategoryItem[];
}

declare interface IIndexState {
    // updateDialogStatus: boolean;
    importGoodsDialogStatus: boolean;
    shelvesDialogStatus: boolean;
    goodsEditDialogStatus: boolean;
    excelDialogStataus: boolean;
    // 按钮加载中状态
    searchLoading: boolean;
    onsaleLoading: boolean;
    deleteLoading: boolean;
    page: number;
    page_count: number;
    allCount: number;
    goodsList: IRowDataItem[];
    selectedRowKeys: string[];
    rowKeys: string[];
    saleStatusList: ISaleStatausItem[];
    allCatagoryList: ICategoryItem[];
    currentEditGoods: IRowDataItem | null;
    originEditGoods: IRowDataItem | null;
}

const pageSizeOptions = ['50', '100', '500', '1000'];

type LocalPageProps = RouteComponentProps<{}, any, { task_id?: number }>;

class Local extends React.PureComponent<LocalPageProps, IIndexState> {
    localSearchRef: LocalSearch | null = null;

    goodsTableRef: GoodsTable | null = null;

    constructor(props: LocalPageProps) {
        super(props);

        this.state = {
            importGoodsDialogStatus: false,
            shelvesDialogStatus: false,
            goodsEditDialogStatus: true,
            excelDialogStataus: false,
            onsaleLoading: false,
            deleteLoading: false,
            searchLoading: false,
            page: 1,
            page_count: 50,
            allCount: 0,
            goodsList: [],
            selectedRowKeys: [],
            rowKeys: [],
            saleStatusList: [],
            allCatagoryList: [],
            currentEditGoods: null,
            originEditGoods: null,
        };
    }

    componentDidMount(): void {
        this.getCatagoryList();
        this.onSearch();
        // console.log(this.props);
    }

    // 取消选中的商品
    private cancelSelectedRow = () => {
        this.setState({
            selectedRowKeys: [],
        });
        if (this.goodsTableRef) {
            // console.log(this.localSearchRef);
            this.goodsTableRef.cancelCheckAll();
        }
    };

    // 校验 sku数量、价格范围、销量 区间是否正常
    private validateRange = (searhParam: any): boolean => {
        const { min_sku, max_sku, min_price, max_price, min_sale, max_sale } = searhParam;
        if (min_sku >= 0 && max_sku >= 0 && min_sku - max_sku > 0) {
            message.error('sku数量最小值大于最大值！');
            return false;
        }
        if (min_price >= 0 && max_price >= 0 && min_price - max_price > 0) {
            message.error('价格范围最小值大于最大值！');
            return false;
        }
        if (min_sale >= 0 && max_sale >= 0 && min_sale - max_sale > 0) {
            message.error('销量最小值大于最大值！');
            return false;
        }
        return true;
    };

    private onSearch = (searchData?: IPageData, isRefresh?: boolean) => {
        const { page, page_count } = this.state;
        let params: IFilterParams = {
            page,
            page_count,
        };
        if (this.localSearchRef) {
            const {
                secondCatagoryList,
                thirdCatagoryList,
                task_number,
                store_id,
                commodity_id,
                inventory_status,
                version_status,
                first_catagory,
                second_catagory,
                third_catagory,
                ...searhParams
            } = this.localSearchRef.state;
            if (!this.validateRange(searhParams)) {
                return;
            }
            // 转换数据格式
            params = Object.assign(params, searhParams, {
                inventory_status: strToNumber(inventory_status),
                version_status: strToNumber(version_status),
                first_catagory: strToNumber(first_catagory),
                second_catagory: strToNumber(second_catagory),
                third_catagory: strToNumber(third_catagory),
                task_number: task_number.split(',').filter(item => item.trim()),
                store_id: store_id.split(',').filter(item => item.trim()),
                commodity_id: commodity_id.split(',').map(item => Number(item.trim())).filter(item => item),
            });
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
                const { list, all_count } = res.data;
                // console.log(111111, this.addRowSpanData(list));
                this.setState({
                    allCount: all_count,
                    page: params.page,
                    page_count: params.page_count,
                    goodsList: this.addRowSpanData(list),
                });
                if (!isRefresh) {
                    this.cancelSelectedRow();
                }
            })
            .finally(() => {
                this.setState({
                    searchLoading: false,
                });
            });
    };

    private getCatagoryList = () => {
        getCatagoryList()
            .then(res => {
                // console.log('getCatagoryList', res);
                this.setState({
                    allCatagoryList: res.data,
                });
            })
            .catch(err => {
                message.error('获取所有类目失败');
            });
    };

    // 找到当前类目
    private getCurrentCatagory = (firstId: string, secondId?: string): ICategoryItem[] => {
        const { allCatagoryList } = this.state;
        let ret: ICategoryItem[] = [];
        const firstIndex = allCatagoryList.findIndex(item => item.id === firstId);
        ret = allCatagoryList[firstIndex].children as ICategoryItem[] || [];
        if (secondId) {
            const secondIndex = ret.findIndex(item => item.id === secondId);
            ret = ret[secondIndex].children as ICategoryItem[] || [];
            // ret = ret[secondIndex] ? (ret[secondIndex].children as ICategoryItem[]) : [];
        }
        return ret;
    };

    // 设置选择行
    private changeSelectedRowKeys = (keys: string[]) => {
        this.setState({
            selectedRowKeys: keys,
        });
    };

    // 处理表格数据，用于合并单元格
    private addRowSpanData(list: IDataItem[]): IRowDataItem[] {
        let ret: IRowDataItem[] = [];
        let rowKeys: string[] = [];
        // let goodsId: string | number = 0;
        for (let i = 0, len = list.length; i < len; i++) {
            let { 
                sku_info,
                first_catagory,
                second_catagory,
                third_catagory,
                ...rest 
            } = list[i];
            first_catagory = Array.isArray(first_catagory) ? {} : first_catagory;
            second_catagory = Array.isArray(second_catagory) ? {} : second_catagory;
            third_catagory = Array.isArray(third_catagory) ? {} : third_catagory;
            sku_info.forEach((item, index) => {
                let rowDataItem: IRowDataItem = {
                    ...rest,
                    ...item,
                    first_catagory,
                    second_catagory,
                    third_catagory
                };
                if (index === 0) {
                    rowDataItem._rowspan = sku_info.length;
                    rowKeys.push(rowDataItem.product_id);
                }
                // rowDataItem._isCollapse = false;
                // rowDataItem._isParent = true;
                // rowDataItem._hidden = false;
                ret.push(rowDataItem);
            });
        }
        this.setState({
            rowKeys,
        });
        // console.log('1111', ret);
        return ret;
        // return list
    }

    // 导入商品弹框
    toggleImportGoodsDialog = (status: boolean) => {
        this.setState({
            importGoodsDialogStatus: status,
        });
    };

    // 上架状态记录弹框
    toggleShelvesDialog = (status: boolean) => {
        this.setState({
            shelvesDialogStatus: status,
        });
    };

    // 查询商品上下架记录
    searchGoodsSale = (product_id: string) => {
        getGoodsSales({
            product_id: product_id,
        })
            .then(res => {
                // console.log('product_id', product_id, res);
                this.toggleShelvesDialog(true);
                this.setState({
                    // (item, index, list)
                    saleStatusList: res.data.map(
                        (item: ISaleStatausItem, index: number, list: ISaleStatausItem[]) => {
                            item.order = list.length - index;
                            return item;
                        },
                    ),
                });
            })
            .catch(err => {});
    };

    // 编辑图片弹框
    toggleImgEditDialog = (status: boolean, imgList?: string[], product_id?: string) => {
        this.setState({
            goodsEditDialogStatus: status,
        });
    };

    // 编辑商品弹框
    toggleEditGoodsDialog = (status: boolean, rowData?: IRowDataItem) => {
        // console.log('toggleEditGoodsDialog', rowData);
        this.setState({
            goodsEditDialogStatus: status,
            currentEditGoods: rowData ? { ...rowData } : null,
            originEditGoods: rowData ? { ...rowData } : null,
        })
    }

    // 编辑title和description
    changeGoodsText = (type: string, text: string) => {
        const { currentEditGoods } = this.state;
        // 'title' | 'description'
        this.setState({
            currentEditGoods: {
                ...(currentEditGoods as IRowDataItem),
                [type]: text
            }
        })
    }

    // 编辑类目
    changeGoodsCatagory = (type: string, id: string) => {
        const { currentEditGoods } = this.state;
        if (type === 'first_catagory') {
            this.setState({
                currentEditGoods: {
                    ...(currentEditGoods as IRowDataItem),
                    first_catagory: {
                        id
                    },
                    second_catagory: {},
                    third_catagory: {}
                }
            })
        } else if (type === 'second_catagory') {
            this.setState({
                currentEditGoods: {
                    ...(currentEditGoods as IRowDataItem),
                    second_catagory: { id },
                    third_catagory: {}
                }
            })
        } else {
            this.setState({
                currentEditGoods: {
                    ...(currentEditGoods as IRowDataItem),
                    third_catagory: { id }
                }
            })
        }
    }

    // 编辑图片
    changeGoodsImg = (imgList: string[]) => {
        const { currentEditGoods } = this.state;
        this.setState({
            currentEditGoods: {
                ...(currentEditGoods as IRowDataItem),
                sku_image: imgList
            }
        })
    }

    // 重置编辑弹框
    resetGoodsData = () => {
        const { originEditGoods } = this.state;
        this.setState({
            currentEditGoods: { ...(originEditGoods as IRowDataItem) }
        })
    }

    // 一键上架
    postGoodsOnsale = () => {
        const { selectedRowKeys } = this.state;
        if (!selectedRowKeys.length) {
            return message.error('一键上架需要选择商品');
        }
        this.setState({
            onsaleLoading: true,
        });
        postGoodsOnsale({ scm_goods_id: selectedRowKeys })
            .then(res => {
                // console.log('postGoodsOnsale');
                this.setState({
                    onsaleLoading: false,
                });
                this.onSearch();
                message.success('一键上架成功');
            })
            .catch(err => {
                // console.log('postGoodsOnsale ERR');
                this.setState({
                    onsaleLoading: false,
                });
                // message.error('一键上架失败');
            });
    };

    // 删除
    getGoodsDelete = () => {
        const { selectedRowKeys, goodsList } = this.state;
        if (!selectedRowKeys.length) {
            return message.error('删除需要选择商品');
        }
        this.setState({
            deleteLoading: true,
        });
        // console.log('selectedRowKeys', selectedRowKeys);
        getGoodsDelete({ 
            commodity_ids: [...new Set(selectedRowKeys.map(productId => {
                const index = goodsList.findIndex(item => item.product_id === productId)
                return goodsList[index].commodity_id;
            }))] 
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
                    str += `删除失败${failed.join('、')}。`;
                }
                message.success(str);
            })
            .catch(err => {
                // console.log('getGoodsDelete ERR');
                this.setState({
                    deleteLoading: false,
                });
                // message.success('商品删除失败！');
            });
    };

    onChangePage = (page: number) => {
        this.onSearch({
            page,
        });
    };

    pageCountChange = (current: number, size: number) => {
        this.onSearch({
            page_count: size,
        });
    };

    // 显示下载弹框
    toggleExcelDialog = (status: boolean) => {
        this.setState({
            excelDialogStataus: status,
        });
    };

    // 获取下载表格数据
    getExcelData = (count: number) => {
        postGoodsExports({
            page: count + 1,
            page_count: 10000,
        })
            .catch(err => {
                // console.log('postGoodsExports err', err);
                message.error('导出表格失败！');
            })
            .finally(() => {
                this.toggleExcelDialog(false);
            });
    };

    render() {
        const {
            page,
            page_count,
            allCount,
            goodsList,
            importGoodsDialogStatus,
            shelvesDialogStatus,
            goodsEditDialogStatus,
            excelDialogStataus,
            selectedRowKeys,
            rowKeys,
            onsaleLoading,
            deleteLoading,
            searchLoading,
            saleStatusList,
            allCatagoryList,
            currentEditGoods,
            originEditGoods
        } = this.state;

        const task_id = this.props.location.state?.task_id;

        return (
            <div className="goods-local">
                <LocalSearch
                    task_id={task_id}
                    // toggleUpdateDialog={this.toggleUpdateDialog}
                    ref={node => (this.localSearchRef = node)}
                    searchLoading={searchLoading}
                    onsaleLoading={onsaleLoading}
                    deleteLoading={deleteLoading}
                    allCatagoryList={allCatagoryList}
                    onSearch={this.onSearch}
                    postGoodsOnsale={this.postGoodsOnsale}
                    getGoodsDelete={this.getGoodsDelete}
                    toggleExcelDialog={this.toggleExcelDialog}
                    getCurrentCatagory={this.getCurrentCatagory}
                />
                <Pagination
                    className="goods-local-pagination"
                    total={allCount}
                    current={page}
                    pageSize={page_count}
                    showSizeChanger={true}
                    showQuickJumper={true}
                    pageSizeOptions={pageSizeOptions}
                    onChange={this.onChangePage}
                    onShowSizeChange={this.pageCountChange}
                />
                <GoodsTable
                    ref={node => (this.goodsTableRef = node)}
                    searchLoading={searchLoading}
                    goodsList={goodsList}
                    allCatagoryList={allCatagoryList}
                    selectedRowKeys={selectedRowKeys}
                    rowKeys={rowKeys}
                    toggleEditGoodsDialog={this.toggleEditGoodsDialog}
                    changeSelectedRowKeys={this.changeSelectedRowKeys}
                    searchGoodsSale={this.searchGoodsSale}
                />
                <ImportGoodsDialog
                    visible={importGoodsDialogStatus}
                    toggleImportGoodsDialog={this.toggleImportGoodsDialog}
                />
                <ShelvesDialog
                    visible={shelvesDialogStatus}
                    saleStatusList={saleStatusList}
                    toggleShelvesDialog={this.toggleShelvesDialog}
                />
                <ImgEditDialog
                    visible={goodsEditDialogStatus}
                    originEditGoods={originEditGoods}
                    currentEditGoods={currentEditGoods}
                    allCatagoryList={allCatagoryList}
                    toggleEditGoodsDialog={this.toggleEditGoodsDialog}
                    getCurrentCatagory={this.getCurrentCatagory}
                    changeGoodsText={this.changeGoodsText}
                    changeGoodsCatagory={this.changeGoodsCatagory}
                    changeGoodsImg={this.changeGoodsImg}
                    resetGoodsData={this.resetGoodsData}
                    onSearch={this.onSearch}
                />
                <ExcelDialog
                    visible={excelDialogStataus}
                    allCount={allCount}
                    getExcelData={this.getExcelData}
                    toggleExcelDialog={this.toggleExcelDialog}
                />
            </div>
        );
    }
}

export default Local;

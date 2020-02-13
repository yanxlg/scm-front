import React from 'react';
import { Pagination, message } from 'antd'; 

import LocalSearch from './components/LocalSearch';
import GoodsTable from './components/GoodsTable';

import ImportGoodsDialog from './components/ImportGoodsDialog';
import ShelvesDialog, { ISaleStatausItem } from './components/ShelvesDialog';
import ImgEditDialog from './components/ImgEditDialog';
import ExcelDialog from './components/ExcelDialogV1';
// good-local.less
import '../../styles/goods-local.less';

import {
    getGoodsList,
    getGoodsOnsale,
    getGoodsDelete,
    getGoodsSales,
    IFilterParams,
    getCatagoryList,
    putGoodsEdit,
    IGoodsEditDataItem
} from '@/services/goods';

declare interface IPageData {
    page?: number;
    page_count?: number;
}

export declare interface ICatagoryData {
    id: number;
    name: string;
}

declare interface ITranslateItem {
    language: string;
    updateTime: number;
}

export declare interface ISaleItem {
    onSaleChannel: string;
    onSaleTime: number;
}

export declare interface IScmSkuStyle {
    size?: string;
    color?: string;
}

declare interface IScmSkuItem {
    scmSkuSn: string;
    scmSkuStyle: IScmSkuStyle;
    scmSkuPrice: number;
    scmSkuWeight: number;
    scmSkuInventory: number;
    scmSkuShoppingTime: number;
    scmSkuShoppingFee: number;
}

declare interface IBaseData {
    commodityId: string;
    productId: string;
    goodsImg: string;
    wormTaskId: number;
    wormGoodsId: number;
    isOnSale: number;
    translateInfo: ITranslateItem[];
    onSaleInfo: ISaleItem[];
    title: string;
    description: string;
    skuNumber: number;
    salesVolume: number;
    comments: number;
    firstCatagory: ICatagoryData;
    secondCatagory: ICatagoryData;
    thirdCatagory: ICatagoryData;
    brand: string;
    storeId: string;
    storeName: string;
    wormTime: number;
    wormGoodsInfoLink: string;
    skuImage: string[];
    hasNewVersion: number;
}

declare interface IDataItem extends IBaseData {
    scmSkuInfo: IScmSkuItem[];
}

export declare interface IRowDataItem extends IBaseData {
    scmSkuSn: string;
    scmSkuStyle: IScmSkuStyle;
    scmSkuPrice: number;
    scmSkuWeight: number;
    scmSkuInventory: number;
    scmSkuShoppingTime: number;
    scmSkuShoppingFee: number;
    _rowspan?: number;
}

export declare interface ICategoryItem {
    id: number;
    name: string;
    children?: ICategoryItem[]
}

declare interface IIndexState {
    // updateDialogStatus: boolean;
    importGoodsDialogStatus: boolean;
    shelvesDialogStatus: boolean;
    imgEditDialogStatus: boolean;
    excelDialogStataus: boolean;
    isEditing: boolean;
    // 按钮加载中状态
    searchLoading: boolean;
    onsaleLoading: boolean;
    deleteLoading: boolean;
    page: number;
    page_count: number;
    allCount: number;
    activeProductId: string;
    goodsList: IRowDataItem[];
    activeImgList: string[];
    selectedRowKeys: string[];
    rowKeys: string[];
    saleStatusList: ISaleStatausItem[];
    allCatagoryList: ICategoryItem[];
    // 当前正在编辑的商品
    editGoodsList: IRowDataItem[];
}

const pageSizeOptions = ['30', '50', '100', '200']

class Local extends React.PureComponent<{}, IIndexState> {

    localSearchRef: LocalSearch | null =  null;

    goodsTableRef: GoodsTable | null = null;

    constructor(props: {}) {
        super(props);
        this.state = {
            importGoodsDialogStatus: false,
            shelvesDialogStatus: false,
            imgEditDialogStatus: false,
            excelDialogStataus: false,
            onsaleLoading: false,
            deleteLoading: false,
            searchLoading: false,
            isEditing: false,
            page: 1,
            page_count: 30,
            allCount: 0,
            activeProductId: '',
            goodsList: [],
            activeImgList: [],
            selectedRowKeys: [],
            rowKeys: [],
            saleStatusList: [],
            allCatagoryList: [],
            editGoodsList: []
        };
    }

    componentDidMount(): void {
        this.getCatagoryList();
        this.onSearch();
        // console.log(this.props);
    }

    // 取消选中的商品
    cancelSelectedRow = () => {
        this.setState({
            selectedRowKeys: []
        });
        if (this.goodsTableRef) {
            // console.log(this.localSearchRef);
            this.goodsTableRef.cancelCheckAll();
        }
    }

    // 校验 sku数量、价格范围、销量 区间是否正常
    validateRange = (searhParam: any): boolean => {
        const {
            min_sku,
            max_sku,
            min_price,
            max_price,
            min_sale,
            max_sale
        } = searhParam;
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
    }

    private onSearch = (searchData?: IPageData, isRefresh?: boolean) => {
        const { page, page_count } = this.state;
        let params: IFilterParams = {
            page,
            page_count
        };
        if (this.localSearchRef) {
            const { secondCatagoryList, thirdCatagoryList, ...searhParams } = this.localSearchRef.state;
            if (!this.validateRange(searhParams)) {
                return;
            }
            params = Object.assign(params, searhParams);
        }
        if (searchData) {
            params = Object.assign(params, searchData);
        }
        this.setState({
            searchLoading: true
        });
        return getGoodsList(params).then((res) => {
            // console.log(res)
            const { list, allCount } = res.data;
            // console.log(111111, this.addRowSpanData(list));
            this.setState({
                allCount,
                page: params.page,
                page_count: params.page_count,
                isEditing: false,
                editGoodsList: [],
                goodsList: this.addRowSpanData(list)
            });
            if (!isRefresh) {
                this.cancelSelectedRow();
            }
        }).finally(() => {
            this.setState({
                searchLoading: false
            });
        });
        
    }

    private getCatagoryList = () => {
        getCatagoryList().then(res => {
            // console.log('getCatagoryList', res);
            this.setState({
                allCatagoryList: res.data
            })
        }).catch(err => {
            message.error('获取所有类目失败');
        })
    }

    // 找到当前类目
    private getCurrentCatagory = (firstId: number, secondId?: number): ICategoryItem[] => {
        const { allCatagoryList } = this.state;
        let ret: ICategoryItem[] = []
        const firstIndex = allCatagoryList.findIndex(item => item.id === firstId);
        ret = allCatagoryList[firstIndex].children as ICategoryItem[]
        if (secondId) {
            const secondIndex = ret.findIndex(item => item.id === secondId);
            ret = ret[secondIndex] ? (ret[secondIndex].children as ICategoryItem[]) : []
        }
        return ret
    }

    // 设置正在编辑的商品
    setEditGoodsList = () => {
        const { selectedRowKeys, goodsList } = this.state;
        if (selectedRowKeys.length) {
            const editGoodsList: IRowDataItem[] = [];
            selectedRowKeys.forEach(productId => {
                const index = goodsList.findIndex(goodsItem => productId === goodsItem.productId);
                editGoodsList.push(goodsList[index]);
            });
            // console.log('setEditGoodsList', selectedRowKeys, editGoodsList);
            this.setState({
                editGoodsList,
                isEditing: true
            })
        } else {
            message.error('请选择需要编辑的商品！')
        }
    }

    // 改变编辑中的商品数据
    changeEditGoodsList = (productId: string, type: string, val: string) => {
        const { editGoodsList } = this.state;
        this.setState({
            editGoodsList: editGoodsList.map(item => {
                if (item.productId === productId) {
                    const ret = { ...item }
                    // type为title,description,
                    if (['title', 'description'].indexOf(type) > -1) {
                        ret[type as 'title' | 'description'] = val;
                    } else if (type === 'firstCatagory') {
                        ret.firstCatagory = {
                            id: Number(val),
                            name: ''
                        }
                        ret.secondCatagory = {
                            id: -1,
                            name: ''
                        }
                        ret.thirdCatagory = {
                            id: -1,
                            name: ''
                        }
                    } else if (type === 'secondCatagory') {
                        ret.secondCatagory = {
                            id: Number(val),
                            name: ''
                        }
                        ret.thirdCatagory = {
                            id: -1,
                            name: ''
                        }
                    } else if (type === 'thirdCatagory') {
                        ret.thirdCatagory = {
                            id: Number(val),
                            name: ''
                        }
                    }
                    
                    return ret;
                }
                return item;
            })
        });
    }

    // 取消、保存
    toggleEdit = (status: boolean) => {
        if (status) {
            this.validateAndPutEditGoods();
        } else {
            this.setState({
                isEditing: false,
                editGoodsList: []
            })
        }
    }

    // 检查类目修改正确和找到修改的数据发送请求
    validateAndPutEditGoods = () => {
        const { editGoodsList, goodsList } = this.state;
        const hasEditList: IGoodsEditDataItem[] = [];
        for (let i = 0; i < editGoodsList.length; i++) {
            const currentGoods = editGoodsList[i];
            const {
                productId,
                title,
                description,
                firstCatagory,
                secondCatagory,
                thirdCatagory
            } = currentGoods
            if (secondCatagory.id === -1 || thirdCatagory.id === -1) {
                return message.error(`商品${productId}类目信息缺失！`);
            }
            // 找出编辑过的数据
            const index = goodsList.findIndex(item => item.productId === productId);
            const {
                title: rawTitle,
                description: rawDescription,
                firstCatagory: rawFirstCatagory,
                secondCatagory: rawSecondCatagory,
                thirdCatagory: rawThirdCatagory
            } = goodsList[index];
            if (
                title !== rawTitle ||
                description !== rawDescription ||
                firstCatagory.id !== rawFirstCatagory.id ||
                secondCatagory.id !== rawSecondCatagory.id ||
                thirdCatagory.id !== rawThirdCatagory.id
            ) {
                hasEditList.push({
                    productId,
                    title,
                    description,
                    firstCatagory: firstCatagory.id,
                    secondCatagory: secondCatagory.id,
                    thirdCatagory: thirdCatagory.id
                });
            }
        }
        if (hasEditList.length) {
            putGoodsEdit({
                modify_data: hasEditList
            }).then(res => {
                // console.log('putGoodsEdit', res);
                this.onSearch();
                this.setState({
                    isEditing: false,
                    editGoodsList: []
                });
            }).catch(() => {
                // console.log('putGoodsEdit', res);
                message.error('编辑商品信息失败');
            })
        }
        // console.log('editGoodsList', hasEditList);
    }

    // 设置选择行
    private changeSelectedRowKeys = (keys: string[]) => {
        this.setState({
            selectedRowKeys: keys 
        })
    }

    // 处理表格数据，用于合并单元格
    private addRowSpanData(list: IDataItem[]): IRowDataItem[] {
        let ret: IRowDataItem[] = [];
        let rowKeys: string[] = [];
        // let goodsId: string | number = 0;
        for (let i = 0, len = list.length; i < len; i++) {
            const { scmSkuInfo, ...rest } = list[i];
            scmSkuInfo.forEach((item, index) => {
                let rowDataItem: IRowDataItem = {
                    ...rest,
                    ...item
                }
                if (index === 0) {
                    rowDataItem._rowspan = scmSkuInfo.length;
                    rowKeys.push(rowDataItem.productId);
                }
                // rowDataItem._isCollapse = false;
                // rowDataItem._isParent = true;
                // rowDataItem._hidden = false;
                ret.push(rowDataItem);
            })
        }
        this.setState({
            rowKeys
        })
        // console.log('1111', ret);
        return ret;
        // return list
    }

    // 导入商品弹框
    toggleImportGoodsDialog = (status: boolean) => {
        this.setState({
            importGoodsDialogStatus: status
        });
    }

    // 上架状态记录弹框
    toggleShelvesDialog = (status: boolean) => {
        this.setState({
            shelvesDialogStatus: status
        })
    }

    // 查询商品上下架记录
    searchGoodsSale = (productId: string) => {
        getGoodsSales({
            product_id: productId
        }).then(res => {
            // console.log('productId', productId, res);
            this.toggleShelvesDialog(true);
            this.setState({
                // (item, index, list) 
                saleStatusList: res.data.map((item: ISaleStatausItem, index: number, list: ISaleStatausItem[]) => {
                    item.order = list.length - index;
                    return item
                })
            })
        }).catch(err => {

        })
        
        
    }

    // 编辑图片弹框
    toggleImgEditDialog = (status: boolean, imgList?: string[], productId?: string) => {
        this.setState({
            imgEditDialogStatus: status,
            activeImgList: imgList || [],
            activeProductId: productId || ''
        });
    }

    // 图片更新之后同步到goodsList
    updateGoodsListImg = (imgList: string[], productId: string) => {
        const { goodsList } = this.state;
        this.setState({
            goodsList: goodsList.map(item => {
                if (item.productId !== productId) {
                    return item;
                };
                const ret = {...item};
                ret.skuImage = imgList;
                return ret;
            })
        })
    }

    // 一键上架
    getGoodsOnsale = () => {
        const { selectedRowKeys } = this.state;
        if (!selectedRowKeys.length) {
            return message.error('一键上架需要选择商品');
        }
        this.setState({
            onsaleLoading: true
        })
        getGoodsOnsale({scm_goods_id: selectedRowKeys}).then(res => {
            // console.log('getGoodsOnsale');
            this.setState({
                onsaleLoading: false
            });
            this.onSearch();
            message.success('一键上架成功');
        }).catch(err => {
            // console.log('getGoodsOnsale ERR');
            this.setState({
                onsaleLoading: false
            });
            message.error('一键上架失败');
        })
    }

    // 删除
    getGoodsDelete = () => {
        const { selectedRowKeys } = this.state;
        if (!selectedRowKeys.length) {
            return message.error('删除需要选择商品');
        }
        this.setState({
            deleteLoading: true
        })
        getGoodsDelete({product_ids: selectedRowKeys}).then(res => {
            this.setState({
                deleteLoading: false
            });
            this.onSearch();
            message.success('商品删除成功！');
        }).catch(err => {
            // console.log('getGoodsDelete ERR');
            this.setState({
                deleteLoading: false
            });
            message.success('商品删除失败！');
        })
    }

    onChangePage = (page: number) => {
        this.onSearch({
            page
        });
    }
    
    pageCountChange = (current: number, size: number) => {
        this.onSearch({
            page_count: size
        });
    }

    // 显示下载弹框
    toggleExcelDialog = (status: boolean) => {
        this.setState({
            excelDialogStataus: status
        });
    }

    // 获取下载表格数据
    getExcelData = (count: number) => {
        getGoodsList({
            page: count + 1,
            page_count: 10000
        }).then((res) => {
            const { list } = res.data;
            this.toggleExcelDialog(false);
            this.downloadExcel(this.addRowSpanData(list));

        }).catch(err => {
            message.error('获取下载表格数据失败！');
        })
    }

    // 生成表格
    downloadExcel = (goodsList: IRowDataItem[]) => {
        // console.log('downloadExcel', goodsList);
        const titleList = [
            'Commodity ID',
            'Product ID',
            '商品图片',
            '标题',
            '描述',
            '一级类目',
            '二级类目',
            '三级类目',
            'sku数量',
            '中台sku sn',
            '规格',
            '价格',
            '运费',
            '重量',
            '库存',
            '销量',
            '评价数量',
            '品牌',
            '店铺 id',
            '店铺名称',
            '爬虫任务 id',
            '爬虫商品ID',
            '上架渠道',
            '更新时间',
            '链接'
        ];
        let str = titleList.join(',') + '\n';
        goodsList.forEach(item => {
            const {
                commodityId,
                productId,
                goodsImg,
                title,
                description,
                firstCatagory,
                secondCatagory,
                thirdCatagory,
                skuNumber,
                scmSkuSn,
                scmSkuStyle,
                scmSkuPrice,
                scmSkuShoppingFee,
                scmSkuWeight,
                scmSkuInventory,
                salesVolume,
                comments,
                brand,
                storeId,
                storeName,
                wormTaskId,
                wormGoodsId,
                onSaleInfo,
                wormTime,
                wormGoodsInfoLink,
                _rowspan
            } = item;
            // 规格
            let skuStr = '';
            skuStr += scmSkuStyle.size ? ('Size: ' + scmSkuStyle.size + '\t') : ''
            skuStr += scmSkuStyle.color ? ('Color: ' + scmSkuStyle.color) : ''
            str += (_rowspan ? commodityId : '') + ',';
            str += (_rowspan ? productId : '') + ',';
            str += (_rowspan ? goodsImg : '') + ',';
            str += (_rowspan ? title : '') + ',';
            str += (_rowspan ? description : '') + ',';
            str += (_rowspan ? firstCatagory.name : '') + ',';
            str += (_rowspan ? secondCatagory.name : '') + ',';
            str += (_rowspan ? thirdCatagory.name : '') + ',';
            str += (_rowspan ? skuNumber : '') + ',';
            str += scmSkuSn + ',';
            str += skuStr + ',';
            str += scmSkuPrice + ',';
            str += scmSkuShoppingFee + ',';
            str += scmSkuWeight + ',';
            str += scmSkuInventory + ',';
            str += (_rowspan ? salesVolume : '') + ',';
            str += (_rowspan ? comments : '') + ',';
            str += (_rowspan ? brand : '') + ',';
            str += (_rowspan ? storeId : '') + ',';
            str += (_rowspan ? storeName : '') + ',';
            str += (_rowspan ? wormTaskId : '') + ',';
            str += (_rowspan ? wormGoodsId : '') + ',';
            str += (_rowspan ? onSaleInfo.map(item => item.onSaleChannel).join('、') : '') + ',';
            str += (_rowspan ? wormTime : '') + ',';
            str += (_rowspan ? wormGoodsInfoLink : '') + '\n';
            
        })
        let blob = new Blob([str], {type: "text/plain;charset=utf-8"});
        //解决中文乱码问题
        blob =  new Blob([String.fromCharCode(0xFEFF), blob], {type: blob.type});
        const object_url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = object_url;
        link.download =  "商品.xls";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    render() {

        const {
            page,
            page_count, 
            allCount,
            activeProductId,
            goodsList,
            activeImgList,
            importGoodsDialogStatus, 
            shelvesDialogStatus,
            imgEditDialogStatus,
            excelDialogStataus,
            selectedRowKeys,
            rowKeys,
            onsaleLoading,
            deleteLoading,
            searchLoading,
            saleStatusList,
            allCatagoryList,
            isEditing,
            editGoodsList
        } = this.state;

        return (
            <div className="goods-local">
                <LocalSearch 
                    // toggleUpdateDialog={this.toggleUpdateDialog}
                    ref={node => (this.localSearchRef = node)}
                    isEditing={isEditing}
                    searchLoading={searchLoading}
                    onsaleLoading={onsaleLoading}
                    deleteLoading={deleteLoading}
                    allCatagoryList={allCatagoryList}
                    onSearch={this.onSearch}
                    getGoodsOnsale={this.getGoodsOnsale}
                    getGoodsDelete={this.getGoodsDelete}
                    toggleExcelDialog={this.toggleExcelDialog}
                    getCurrentCatagory={this.getCurrentCatagory}
                    setEditGoodsList={this.setEditGoodsList}
                    toggleEdit={this.toggleEdit}
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
                    editGoodsList={editGoodsList}
                    allCatagoryList={allCatagoryList}
                    selectedRowKeys={selectedRowKeys}
                    rowKeys={rowKeys}
                    toggleImgEditDialog={this.toggleImgEditDialog}
                    changeSelectedRowKeys={this.changeSelectedRowKeys}
                    searchGoodsSale={this.searchGoodsSale}
                    changeEditGoodsList={this.changeEditGoodsList}
                    getCurrentCatagory={this.getCurrentCatagory}
                />
                <ImportGoodsDialog visible={importGoodsDialogStatus} toggleImportGoodsDialog={this.toggleImportGoodsDialog}/>
                <ShelvesDialog 
                    visible={shelvesDialogStatus}
                    saleStatusList={saleStatusList}
                    toggleShelvesDialog={this.toggleShelvesDialog}
                />
                <ImgEditDialog
                    visible={imgEditDialogStatus}
                    productId={activeProductId}
                    imgList={activeImgList}
                    toggleImgEditDialog={this.toggleImgEditDialog}
                    updateGoodsListImg={this.updateGoodsListImg}
                />
                <ExcelDialog
                    visible={excelDialogStataus}
                    allCount={allCount}
                    getExcelData={this.getExcelData}
                    toggleExcelDialog={this.toggleExcelDialog}
                />
            </div>
        )
    }
}

export default Local;

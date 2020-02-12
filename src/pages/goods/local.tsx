import React from 'react';
import { Pagination } from 'antd'; 

import LocalSearch from './components/LocalSearch';
import GoodsTable from './components/GoodsTable';
// import UpdateDialog from './components/UpdateDialog';
import ImportGoodsDialog from './components/ImportGoodsDialog';
import ShelvesDialog, { ISaleStatausItem } from './components/ShelvesDialog';
import TranslationDialog from './components/TranslationDialog';
import ImgEditDialog from './components/ImgEditDialog';
// good-local.less
import '../../styles/goods-local.less';

import {
    getGoodsList,
    getGoodsOnsale,
    getGoodsDelete,
    getGoodsSales,
    IFilterParams
} from '@/services/goods';
import { message } from 'antd';

declare interface IPageData {
    page?: number;
    page_count?: number;
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
    firstCatagory: string;
    secondCatagory: string;
    thirdCatagory: string;
    brand: string;
    storeId: string;
    storeName: string;
    wormTime: number;
    wormGoodsInfoLink: string;
    skuImage: string[];
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
    // _isParent?: boolean;
    // _isCollapse?: boolean;
    // _hidden?: boolean;
    _rowspan?: number;
    // _checked?: boolean;
}

declare interface IIndexState {
    // updateDialogStatus: boolean;
    importGoodsDialogStatus: boolean;
    shelvesDialogStatus: boolean;
    translationDialogStatus: boolean;
    imgEditDialogStatus: boolean;
    // 按钮加载中状态
    searchLoading: boolean;
    onsaleLoading: boolean;
    deleteLoading: boolean;
    // updateType: string;
    page: number;
    page_count: number;
    activeProductId: string;
    goodsList: IRowDataItem[];
    activeImgList: string[];
    selectedRowKeys: string[];
    rowKeys: string[];
    saleStatusList: ISaleStatausItem[];
}

class Local extends React.PureComponent<{}, IIndexState> {

    localSearchRef: LocalSearch | null =  null

    constructor(props: {}) {
        super(props);
        this.state = {
            // updateDialogStatus: false,
            importGoodsDialogStatus: false,
            shelvesDialogStatus: false,
            translationDialogStatus: false,
            imgEditDialogStatus: false,
            onsaleLoading: false,
            deleteLoading: false,
            searchLoading: false,
            // updateType: 'weight',
            page: 1,
            page_count: 10,
            activeProductId: '',
            goodsList: [],
            activeImgList: [],
            selectedRowKeys: [],
            rowKeys: [],
            saleStatusList: []
        };
    }

    componentDidMount(): void {
        this.onSearch();
        // console.log(this.props);
    }

    private onSearch = (searchData?: IPageData) => {
        this.setState({
            searchLoading: true
        });
        const { page, page_count } = this.state;
        let params: IFilterParams = {
            page,
            page_count
        };
        if (this.localSearchRef) {
            params = Object.assign(params, this.localSearchRef.state);
        }
        if (searchData) {
            params = Object.assign(params, searchData);
        }
        return getGoodsList(params).then((res) => {
            // console.log(res)
            const { list } = res.data;
            // console.log(111111, this.addRowSpanData(list));
            this.setState({
                page: params.page,
                page_count: params.page_count,
                goodsList: this.addRowSpanData(list)
            });
        }).finally(() => {
            this.setState({
                searchLoading: false
            });
        });
        
    }

    // 设置选择行
    private changeSelectedRowKeys = (keys: string[]) => {
        this.setState({
            selectedRowKeys: keys 
        })
    }

    // 编辑标题和描述成功改变goodsList
    private changeGoodsList = (productId: string, type: 'title' | 'desc', text: string) => {
        const { goodsList } = this.state;
        this.setState({
            goodsList: [...goodsList].map(item => {
                const ret = {...item}
                if (item.productId === productId) {
                    ret[type === 'title' ? 'title' : 'description'] = text;
                }
                return ret;
            })
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

    // 折叠收起
    collapseGoods = (parentId: string, status: boolean) => {
        const { goodsList } = this.state;
        // debugger
        // this.setState({
        //     goodsList: goodsList.map(item => {
        //         if (!item.isParent) {
        //             item._hidden = !status
        //         }
        //         item.isCollapse = status
        //         return item
        //     })
        // });
    }

    // 重量和价格编辑弹框
    // toggleUpdateDialog = (status: boolean, type?: string) => {
    //     this.setState({
    //         updateDialogStatus: status,
    //         updateType: type || 'weight'
    //     });
    // }

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

    // 翻译弹框
    toggleTranslationDialog = (status: boolean) => {
        this.setState({
            translationDialogStatus: status
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
            })
        }).catch(err => {
            // console.log('getGoodsOnsale ERR');
            this.setState({
                onsaleLoading: false
            })
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
            // console.log('getGoodsDelete');
            this.setState({
                deleteLoading: false
            })
        }).catch(err => {
            // console.log('getGoodsDelete ERR');
            this.setState({
                deleteLoading: false
            })
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

    // 生成表格
    downloadExcel = () => {
        const { goodsList } = this.state;
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
            str += (_rowspan ? firstCatagory : '') + ',';
            str += (_rowspan ? secondCatagory : '') + ',';
            str += (_rowspan ? thirdCatagory : '') + ',';
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
            activeProductId,
            goodsList,
            activeImgList,
            // updateType,
            // updateDialogStatus, 
            importGoodsDialogStatus, 
            shelvesDialogStatus,
            translationDialogStatus,
            imgEditDialogStatus,
            selectedRowKeys,
            rowKeys,
            onsaleLoading,
            deleteLoading,
            searchLoading,
            saleStatusList
        } = this.state;

        return (
            <div className="goods-local">
                <LocalSearch 
                    // toggleUpdateDialog={this.toggleUpdateDialog}
                    ref={node => (this.localSearchRef = node)}
                    searchLoading={searchLoading}
                    onsaleLoading={onsaleLoading}
                    deleteLoading={deleteLoading}
                    onSearch={this.onSearch}
                    getGoodsOnsale={this.getGoodsOnsale}
                    getGoodsDelete={this.getGoodsDelete}
                    downloadExcel={this.downloadExcel}
                />
                <Pagination
                    className="goods-local-pagination"
                    total={500}
                    current={page}
                    pageSize={page_count}
                    showSizeChanger={true}
                    showQuickJumper={true}
                    onChange={this.onChangePage}
                    onShowSizeChange={this.pageCountChange}
                />
                <GoodsTable
                    searchLoading={searchLoading}
                    goodsList={goodsList}
                    selectedRowKeys={selectedRowKeys}
                    rowKeys={rowKeys}
                    collapseGoods={this.collapseGoods}
                    toggleImgEditDialog={this.toggleImgEditDialog}
                    changeSelectedRowKeys={this.changeSelectedRowKeys}
                    changeGoodsList={this.changeGoodsList}
                    searchGoodsSale={this.searchGoodsSale}
                />
                {/* <UpdateDialog 
                    visible={updateDialogStatus}
                    type={updateType}
                    toggleUpdateDialog={this.toggleUpdateDialog}
                /> */}
                <ImportGoodsDialog visible={importGoodsDialogStatus} toggleImportGoodsDialog={this.toggleImportGoodsDialog}/>
                <ShelvesDialog 
                    visible={shelvesDialogStatus}
                    saleStatusList={saleStatusList}
                    toggleShelvesDialog={this.toggleShelvesDialog}
                />
                {/* <TranslationDialog
                    visible={translationDialogStatus}
                    toggleTranslationDialog={this.toggleTranslationDialog}
                /> */}
                <ImgEditDialog
                    visible={imgEditDialogStatus}
                    productId={activeProductId}
                    imgList={activeImgList}
                    toggleImgEditDialog={this.toggleImgEditDialog}
                    updateGoodsListImg={this.updateGoodsListImg}
                />
            </div>
        )
    }
}

export default Local;

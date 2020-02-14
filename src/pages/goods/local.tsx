import React from 'react';

import LocalSearch from './components/LocalSearch';
import GoodsTable from './components/GoodsTable';
import UpdateDialog from './components/UpdateDialog';
import ImportGoodsDialog from './components/ImportGoodsDialog';
import ShelvesDialog from './components/ShelvesDialog';
import TranslationDialog from './components/TranslationDialog';
import ImgEditDialog from './components/ImgEditDialog';
// good-local.less
import '../../styles/goods-local.less';

import {
    getGoodsList
} from '@/services/goods';

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

export declare interface ISkuImgItem {
    imgId: string;
    imgUrl: string;
}

declare interface IBaseData {
    // scmGoodsSn: string;
    // scmGoodsId: number;
    commodityId: string;
    productId: number;
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
    skuImage: ISkuImgItem[];
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
}

declare interface IIndexState {
    // updateDialogStatus: boolean;
    importGoodsDialogStatus: boolean;
    shelvesDialogStatus: boolean;
    translationDialogStatus: boolean;
    imgEditDialogStatus: boolean;
    // updateType: string;
    goodsList: IRowDataItem[];
    activeImgList: ISkuImgItem[];
}

class Local extends React.PureComponent<{}, IIndexState> {

    constructor(props: {}) {
        super(props);
        this.state = {
            // updateDialogStatus: false,
            importGoodsDialogStatus: false,
            shelvesDialogStatus: false,
            translationDialogStatus: false,
            imgEditDialogStatus: false,
            // updateType: 'weight',
            goodsList: [],
            activeImgList: [
                // {
                //     imgId: '1',
                //     imgUrl: '//image-tb.airyclub.com/image/500_500/filler/29/6f/6a69f58c96aa7b793b62c6c5af8f296f.jpg'
                // },
                // {
                //     imgId: '2',
                //     imgUrl: '//image-tb.vova.com/image/500_500/filler/6d/1a/2d391127928221c2a442c8b0e1f26d1a.jpg'
                // },
                // {
                //     imgId: '3',
                //     imgUrl: '//image-tb.vova.com/image/500_500/filler/97/b8/d41a4dab05900caf879244f041cc97b8.jpg'
                // }
            ],

        };
    }

    componentDidMount(): void {
        this.onSearch();
        // console.log(this.props);
    }

    private onSearch() {
        return getGoodsList({
            page: 1,
            page_count: 10
        }).then((res) => {
            // console.log(res)
            const { list } = res.data;
            // console.log(111111, this.addRowSpanData(list));
            this.setState({
                goodsList: this.addRowSpanData(list)
            });
        }).finally(() => {
            // this.setState({
            //     dataLoading: false,
            //     searchLoading:false
            // });
        });
        
    }

    // 处理表格数据，用于合并单元格
    private addRowSpanData(list: IDataItem[]): IRowDataItem[] {
        let ret: IRowDataItem[] = [];
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
                }
                // rowDataItem._isCollapse = false;
                // rowDataItem._isParent = true;
                // rowDataItem._hidden = false;
                ret.push(rowDataItem);
            })
        }
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

    // 翻译弹框
    toggleTranslationDialog = (status: boolean) => {
        this.setState({
            translationDialogStatus: status
        })
    }

    // 编辑图片弹框
    toggleImgEditDialog = (status: boolean, imgList?: ISkuImgItem[]) => {
        this.setState({
            imgEditDialogStatus: status,
            activeImgList: imgList || []
        })
    }

    render() {

        const { 
            goodsList,
            activeImgList,
            // updateType,
            // updateDialogStatus, 
            importGoodsDialogStatus, 
            shelvesDialogStatus,
            translationDialogStatus,
            imgEditDialogStatus
        } = this.state;

        return (
            <div className="goods-local">
                <LocalSearch 
                    // toggleUpdateDialog={this.toggleUpdateDialog}
                />
                <GoodsTable 
                    goodsList={goodsList}
                    collapseGoods={this.collapseGoods}
                    toggleImgEditDialog={this.toggleImgEditDialog}
                />
                {/* <UpdateDialog 
                    visible={updateDialogStatus}
                    type={updateType}
                    toggleUpdateDialog={this.toggleUpdateDialog}
                /> */}
                <ImportGoodsDialog visible={importGoodsDialogStatus} toggleImportGoodsDialog={this.toggleImportGoodsDialog}/>
                <ShelvesDialog 
                    visible={shelvesDialogStatus}
                    toggleShelvesDialog={this.toggleShelvesDialog}
                />
                <TranslationDialog
                    visible={translationDialogStatus}
                    toggleTranslationDialog={this.toggleTranslationDialog}
                />
                <ImgEditDialog
                    visible={imgEditDialogStatus}
                    imgList={activeImgList}
                    toggleImgEditDialog={this.toggleImgEditDialog}
                />
            </div>
        )
    }
}

export default Local;

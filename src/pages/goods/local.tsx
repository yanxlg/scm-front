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

export declare interface IDataItem {
    [key: string]: any;
    // _rowspan?: number;
}

declare interface IIndexState {
    goodsList: IDataItem[];
    updateDialogStatus: boolean;
    importGoodsDialogStatus: boolean;
    shelvesDialogStatus: boolean;
    translationDialogStatus: boolean;
    imgEditDialogStatus: boolean;
}

class Local extends React.PureComponent<{}, IIndexState> {

    constructor(props: {}) {
        super(props);
        this.state = {
            goodsList: [],
            updateDialogStatus: false,
            importGoodsDialogStatus: false,
            shelvesDialogStatus: false,
            translationDialogStatus: false,
            imgEditDialogStatus: false,
        };
    }

    componentDidMount(): void {
        this.onSearch();
        // console.log(this.props);
    }

    private onSearch() {
        return getGoodsList({
            page: 1,
            size: 10
        }).then((res) => {
            // console.log(res)
            const { list } = res.data;
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
    private addRowSpanData(list: IDataItem[]): IDataItem[] {
        let ret: IDataItem[] = [];
        let goodsId: string | number = 0;
        for (let i = 0, len = list.length; i < len; i++) {
            let currentItem = list[i];
            currentItem.isCollapse = false;
            if (currentItem.isParent) {
                currentItem._hidden = false;
            } else {
                currentItem._hidden = true;
            }
            if (goodsId !== currentItem.a1) {
                goodsId = currentItem.a1;
                currentItem._rowspan = list.filter(item => item.a1 === goodsId).length;
            }
            ret.push(currentItem);
        }
        return ret;
    }

    // 折叠收起
    collapseGoods = (parentId: string, status: boolean) => {
        const { goodsList } = this.state;
        // debugger
        this.setState({
            goodsList: goodsList.map(item => {
                if (!item.isParent) {
                    item._hidden = !status
                }
                item.isCollapse = status
                return item
            })
        });
    }

    // 编辑弹框
    toggleUpdateDialog = (status: boolean) => {
        this.setState({
            updateDialogStatus: status
        });
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

    // 翻译弹框
    toggleTranslationDialog = (status: boolean) => {
        this.setState({
            translationDialogStatus: status
        })
    }

    // 编辑图片弹框
    toggleImgEditDialog = (status: boolean) => {
        this.setState({
            imgEditDialogStatus: status
        })
    }

    render() {

        const { 
            goodsList, 
            updateDialogStatus, 
            importGoodsDialogStatus, 
            shelvesDialogStatus,
            translationDialogStatus,
            imgEditDialogStatus
        } = this.state;

        return (
            <div className="goods-local">
                <LocalSearch />
                <GoodsTable 
                    goodsList={goodsList}
                    collapseGoods={this.collapseGoods}
                />
                <UpdateDialog visible={updateDialogStatus} toggleUpdateDialog={this.toggleUpdateDialog}/>
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
                    toggleImgEditDialog={this.toggleImgEditDialog}
                />
            </div>
        )
    }
}

export default Local;

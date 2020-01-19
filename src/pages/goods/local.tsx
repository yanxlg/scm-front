import React from 'react';

import LocalSearch from './components/local-search';
import GoodsTable from './components/goods-table';
// good-local.less
import '../../styles/goods-local.less';

import {
    getGoodsList
} from '@/services/goods';

export declare interface IDataItem {
    'a1': string;
    'a2': string;
    'a3': string;
    'a4': string;
    'a5': string;
    'a6': string;
    'a7': string;
    'a8': string;
    'a9': string;
    'a10': string;
    'a11': string;
    'a12': string;
    'a13': string;
    'a14': string;
    'a15': string;
    'a16': string;
    'a17': string;
    'a18': string;
    'a19': string;
    'a20': string;
    'a21': string;
    _rowspan?: number;
}

declare interface IIndexState {
    goodsList: IDataItem[];
}

class Local extends React.PureComponent<{}, IIndexState> {

    constructor(props: {}) {
        super(props);
        this.state = {
            goodsList: []
        };
    }

    componentDidMount(): void {
        this.onSearch();
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
        let goodsId = '';
        for (let i = 0, len = list.length; i < len; i++) {
            let currentItem = list[i];
            if (goodsId !== currentItem.a3) {
                goodsId = currentItem.a3;
                currentItem._rowspan = list.filter(item => item.a3 === goodsId).length;
            }
            ret.push(currentItem);
        }
        return ret;
    }

    render() {

        const { goodsList } = this.state;

        return (
            <div className="goods-local">
                <LocalSearch />
                <GoodsTable goodsList={goodsList}/>
            </div>
        )
    }
}

export default Local;

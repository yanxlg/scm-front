import React, { ChangeEvent } from 'react';
import { Input, InputNumber, Select, Button } from 'antd';
// import { ClickParam } from 'antd/lib/menu';

import { ICategoryItem } from '../index';

const { Option } = Select;

declare interface IPageData {
    page?: number;
    page_count?: number;
}

declare interface ILocalSearchProps {
    searchLoading: boolean;
    onsaleLoading: boolean;
    deleteLoading: boolean;
    allCatagoryList: ICategoryItem[];
    onSearch(params?: IPageData, isRefresh?: boolean): void;
    postGoodsOnsale(): void;
    getGoodsDelete(): void;
    toggleExcelDialog(status: boolean): void;
    getCurrentCatagory(firstId: string, secondId?: string): ICategoryItem[];
    task_id?: number; // 默认task_id
}

declare interface ILocalSearchState {
    task_number: string; // 任务 id
    store_id: string; // 店铺 ID
    commodity_id: string; // Commodity_ID
    inventory_status: string; // 库存
    version_status: string; // 版本更新
    first_catagory: string; // 一级类目
    second_catagory: string; // 二级类目
    third_catagory: string; // 三级类目
    min_sale: number | undefined; // 销量最小
    max_sale: number | undefined; // 销量最大值
    min_sku: number | undefined; // sku数量最小值
    max_sku: number | undefined; // sku最大值
    min_price: number | undefined; // 价格范围最小值
    max_price: number | undefined; // 价格范围最大值
    min_comment: number | undefined; // 评论数量最小值
    secondCatagoryList: ICategoryItem[];
    thirdCatagoryList: ICategoryItem[];
}

// <{}, ILocalSearchState>

class LocalSearch extends React.PureComponent<ILocalSearchProps, ILocalSearchState> {
    constructor(props: ILocalSearchProps) {
        super(props);
        this.state = {
            task_number: props.task_id !== void 0 ? `${props.task_id}` : '',
            store_id: '',
            commodity_id: '',
            inventory_status: '',
            version_status: '',
            first_catagory: '',
            second_catagory: '',
            third_catagory: '',
            min_sku: undefined,
            max_sku: undefined,
            min_price: undefined,
            max_price: undefined,
            min_sale: undefined,
            max_sale: undefined,
            min_comment: undefined,
            secondCatagoryList: [],
            thirdCatagoryList: [],
        };
    }

    // task_number,store_id,commodity_id
    private setInputVal = (e: ChangeEvent<HTMLInputElement>) => {
        this.setState({
            [e.target.name as 'task_number']: e.target.value,
        });
    };

    // inventory_status,version_status,third_catagory
    private setSelectVal = (type: string, val: string) => {
        this.setState({
            [type as 'inventory_status']: val,
        });
    }

    private setFirstCatagory = (val: string) => {
        // console.log('setFirstCatagory', val);
        this.setState({
            first_catagory: val,
            secondCatagoryList: val ? this.props.getCurrentCatagory(val) : [],
            thirdCatagoryList: [],
            second_catagory: '',
            third_catagory: '',
        });
    };

    private setSecondCatagory = (val: string) => {
        const { first_catagory } = this.state;
        this.setState({
            second_catagory: val,
            thirdCatagoryList: val
                ? this.props.getCurrentCatagory(first_catagory, val)
                : [],
            third_catagory: '',
        });
    };

    // min_sale,max_sale,min_sku,max_sku,min_price,max_price,min_comment
    private setNumber = (type: string, val: number | undefined) => {
        this.setState({
            [type as 'min_sale']: val ? val : undefined,
        });
    }

    onSearch = () => {
        // console.log('onSearch', this.state);
        this.props.onSearch();
    };

    refreshPage = () => {
        this.props.onSearch({}, true);
    };

    postGoodsOnsale = () => {
        this.props.postGoodsOnsale();
    };

    getGoodsDelete = () => {
        this.props.getGoodsDelete();
    };

    render() {
        const {
            onsaleLoading,
            deleteLoading,
            searchLoading,
            allCatagoryList,
        } = this.props;

        const {
            task_number,
            store_id,
            commodity_id,
            inventory_status,
            version_status,
            first_catagory,
            second_catagory,
            third_catagory,
            min_sku,
            max_sku,
            min_price,
            max_price,
            min_sale,
            max_sale,
            min_comment,
            secondCatagoryList,
            thirdCatagoryList,
        } = this.state;

        return (
            <div className="local-search">
                <div className="local-search-item">
                    <span className="local-search-label">爬虫任务 ID</span>
                    <Input
                        className="local-search-item-input"
                        placeholder="请输入爬虫任务ID"
                        name="task_number"
                        value={task_number}
                        onChange={this.setInputVal}
                    />
                </div>
                <div className="local-search-item">
                    <span className="local-search-label">店铺 ID</span>
                    <Input
                        className="local-search-item-input"
                        placeholder="请输入店铺ID"
                        name="store_id"
                        value={store_id}
                        onChange={this.setInputVal}
                    />
                </div>
                <div className="local-search-item">
                    <span className="local-search-label">Commodity ID</span>
                    <Input
                        className="local-search-item-input"
                        placeholder="请输入Commodity ID"
                        name="commodity_id"
                        value={commodity_id}
                        onChange={this.setInputVal}
                    />
                </div>
                <div className="local-search-item">
                    <span className="local-search-label">库存</span>
                    <Select
                        className="local-search-item-select"
                        value={inventory_status}
                        onChange={(val: string) => this.setSelectVal('inventory_status', val)}
                    >
                        <Option value="">全部</Option>
                        <Option value="1">不可销售</Option>
                        <Option value="2">可销售</Option>
                    </Select>
                </div>
                <div className="local-search-item">
                    <span className="local-search-label">版本更新</span>
                    <Select
                        className="local-search-item-select"
                        value={version_status}
                        onChange={(val: string) => this.setSelectVal('version_status', val)}
                    >
                        <Option value="">全部</Option>
                        <Option value="1">有新版本更新</Option>
                        <Option value="2">无新版本更新</Option>
                    </Select>
                </div>
                <div className="local-search-item">
                    <span className="local-search-label">一级类目</span>
                    <Select
                        className="local-search-item-select"
                        value={first_catagory}
                        onChange={this.setFirstCatagory}
                    >
                        <Option value="">全部</Option>
                        {/* <Option value="1">xxx</Option> */}
                        {allCatagoryList.map(item => (
                            <Option key={item.id + ''} value={item.id + ''}>
                                {item.name}
                            </Option>
                        ))}
                    </Select>
                </div>
                <div className="local-search-item">
                    <span className="local-search-label">二级类目</span>
                    <Select
                        className="local-search-item-select"
                        value={second_catagory}
                        onChange={this.setSecondCatagory}
                    >
                        <Option value="">全部</Option>
                        {secondCatagoryList.map(item => (
                            <Option key={item.id + ''} value={item.id + ''}>
                                {item.name}
                            </Option>
                        ))}
                    </Select>
                </div>
                <div className="local-search-item">
                    <span className="local-search-label">三级类目</span>
                    <Select
                        className="local-search-item-select"
                        value={third_catagory}
                        onChange={(val: string) => this.setSelectVal('third_catagory', val)}
                    >
                        <Option value="">全部</Option>
                        {thirdCatagoryList.map(item => (
                            <Option key={item.id + ''} value={item.id + ''}>
                                {item.name}
                            </Option>
                        ))}
                    </Select>
                </div>
                <div className="local-search-item">
                    <span className="local-search-label">sku数量</span>
                    <InputNumber
                        className="local-search-item-input-min"
                        min={0}
                        precision={0}
                        value={min_sku}
                        onChange={(val) => this.setNumber('min_sku', val)}
                    />
                    <span className="local-search-item-join">-</span>
                    <InputNumber
                        className="local-search-item-input-min"
                        min={0}
                        precision={0}
                        value={max_sku}
                        onChange={(val) => this.setNumber('max_sku', val)}
                    />
                </div>
                <div className="local-search-item">
                    <span className="local-search-label">价格范围（￥）</span>
                    <InputNumber
                        className="local-search-item-input-min"
                        min={0}
                        value={min_price}
                        onChange={(val) => this.setNumber('min_price', val)}
                    />
                    <span className="local-search-item-join">-</span>
                    <InputNumber
                        className="local-search-item-input-min"
                        min={0}
                        value={max_price}
                        onChange={(val) => this.setNumber('max_price', val)}
                    />
                </div>
                <div className="local-search-item">
                    <span className="local-search-label">销量</span>
                    <InputNumber
                        className="local-search-item-input-min"
                        min={0}
                        precision={0}
                        value={min_sale}
                        onChange={(val) => this.setNumber('min_sale', val)}
                    />
                    <span className="local-search-item-join">-</span>
                    <InputNumber
                        className="local-search-item-input-min"
                        min={0}
                        precision={0}
                        value={max_sale}
                        onChange={(val) => this.setNumber('max_sale', val)}
                    />
                </div>
                <div className="local-search-item">
                    <span className="local-search-label">评论数量>=</span>
                    <InputNumber
                        className="local-search-item-input-min"
                        min={0}
                        precision={0}
                        value={min_comment}
                        onChange={(val) => this.setNumber('min_comment', val)}
                    />
                </div>
                <div>
                    <Button
                        type="primary"
                        className="local-search-item-btn"
                        loading={searchLoading}
                        onClick={this.onSearch}
                    >
                        查询
                    </Button>
                    <Button
                        type="primary"
                        className="local-search-item-btn"
                        loading={onsaleLoading}
                        onClick={this.postGoodsOnsale}
                    >
                        一键上架
                    </Button>
                    <Button
                        className="local-search-item-btn"
                        loading={deleteLoading}
                        onClick={this.getGoodsDelete}
                    >
                        删除
                    </Button>
                    <Button className="local-search-item-btn" onClick={this.refreshPage}>
                        刷新
                    </Button>
                    <Button
                        className="local-search-item-btn"
                        onClick={() => this.props.toggleExcelDialog(true)}
                    >
                        导出至Excel
                    </Button>
                </div>
            </div>
        );
    }
}

export default LocalSearch;

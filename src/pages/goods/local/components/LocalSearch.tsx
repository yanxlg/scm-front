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
    // toggleUpdateDialog(status: boolean, type?: string): void;
    isEditing: boolean;
    searchLoading: boolean;
    onsaleLoading: boolean;
    deleteLoading: boolean;
    allCatagoryList: ICategoryItem[];
    onSearch(params?: IPageData, isRefresh?: boolean): void;
    getGoodsOnsale(): void;
    getGoodsDelete(): void;
    toggleExcelDialog(status: boolean): void;
    setEditGoodsList(): void;
    getCurrentCatagory(firstId: number, secondId?: number): ICategoryItem[];
    toggleEdit(status: boolean): void;

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

    private setTaskNumber = (e: ChangeEvent<HTMLInputElement>) => {
        this.setState({
            task_number: e.target.value,
        });
    };

    private setStoreId = (e: ChangeEvent<HTMLInputElement>) => {
        this.setState({
            store_id: e.target.value,
        });
    };

    private setcommodity_id = (e: ChangeEvent<HTMLInputElement>) => {
        this.setState({
            commodity_id: e.target.value,
        });
    };

    private setInventoryStatus = (val: string) => {
        this.setState({
            inventory_status: val,
        });
    };

    private setVersionStatus = (val: string) => {
        this.setState({
            version_status: val,
        });
    };

    private setFirstCatagory = (val: string) => {
        // console.log('setFirstCatagory', val);
        this.setState({
            first_catagory: val,
            secondCatagoryList: val ? this.props.getCurrentCatagory(Number(val)) : [],
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
                ? this.props.getCurrentCatagory(Number(first_catagory), Number(val))
                : [],
            third_catagory: '',
        });
    };

    private setThirdCatagory = (val: string) => {
        this.setState({
            third_catagory: val,
        });
    };

    private setMinSale = (val: number | undefined) => {
        this.setState({
            min_sale: val,
        });
    };

    private setMaxSale = (val: number | undefined) => {
        this.setState({
            max_sale: val,
        });
    };

    private setMinSku = (val: number | undefined) => {
        this.setState({
            min_sku: val,
        });
    };

    private setMaxSku = (val: number | undefined) => {
        this.setState({
            max_sku: val,
        });
    };

    private setMinPrice = (val: number | undefined) => {
        this.setState({
            min_price: val,
        });
    };

    private setMaxPrice = (val: number | undefined) => {
        this.setState({
            max_price: val,
        });
    };

    private setMinComment = (val: number | undefined) => {
        this.setState({
            min_comment: val,
        });
    };

    onSearch = () => {
        // console.log('onSearch', this.state);
        this.props.onSearch();
    };

    refreshPage = () => {
        this.props.onSearch({}, true);
    };

    getGoodsOnsale = () => {
        this.props.getGoodsOnsale();
    };

    getGoodsDelete = () => {
        this.props.getGoodsDelete();
    };

    render() {
        const {
            isEditing,
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
                        onChange={this.setTaskNumber}
                    />
                </div>
                <div className="local-search-item">
                    <span className="local-search-label">店铺 ID</span>
                    <Input
                        className="local-search-item-input"
                        placeholder="请输入店铺ID"
                        name="store_id"
                        value={store_id}
                        onChange={this.setStoreId}
                    />
                </div>
                <div className="local-search-item">
                    <span className="local-search-label">Commodity ID</span>
                    <Input
                        className="local-search-item-input"
                        placeholder="请输入Commodity ID"
                        name="commodity_id"
                        value={commodity_id}
                        onChange={this.setcommodity_id}
                    />
                </div>
                <div className="local-search-item">
                    <span className="local-search-label">库存</span>
                    <Select
                        className="local-search-item-select"
                        value={inventory_status}
                        onChange={this.setInventoryStatus}
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
                        onChange={this.setVersionStatus}
                    >
                        <Option value="">全部</Option>
                        <Option value="2">有新版本更新</Option>
                        <Option value="1">无新版本更新</Option>
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
                        onChange={this.setThirdCatagory}
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
                        value={min_sku}
                        onChange={this.setMinSku}
                    />
                    <span className="local-search-item-join">-</span>
                    <InputNumber
                        className="local-search-item-input-min"
                        min={0}
                        value={max_sku}
                        onChange={this.setMaxSku}
                    />
                </div>
                <div className="local-search-item">
                    <span className="local-search-label">价格范围（￥）</span>
                    <InputNumber
                        className="local-search-item-input-min"
                        min={0}
                        value={min_price}
                        onChange={this.setMinPrice}
                    />
                    <span className="local-search-item-join">-</span>
                    <InputNumber
                        className="local-search-item-input-min"
                        min={0}
                        value={max_price}
                        onChange={this.setMaxPrice}
                    />
                </div>
                <div className="local-search-item">
                    <span className="local-search-label">销量</span>
                    <InputNumber
                        className="local-search-item-input-min"
                        min={0}
                        value={min_sale}
                        onChange={this.setMinSale}
                    />
                    <span className="local-search-item-join">-</span>
                    <InputNumber
                        className="local-search-item-input-min"
                        min={0}
                        value={max_sale}
                        onChange={this.setMaxSale}
                    />
                </div>
                <div className="local-search-item">
                    <span className="local-search-label">评论数量>=</span>
                    <InputNumber
                        className="local-search-item-input-min"
                        min={0}
                        value={min_comment}
                        onChange={this.setMinComment}
                    />
                </div>
                <div className="local-search-item">
                    <Button
                        type="primary"
                        className="local-search-item-btn"
                        loading={searchLoading}
                        onClick={this.onSearch}
                    >
                        查询
                    </Button>
                </div>
                <div className="local-search-item">
                    <Button
                        type="primary"
                        className="local-search-item-btn"
                        loading={onsaleLoading}
                        onClick={this.getGoodsOnsale}
                    >
                        一键上架
                    </Button>
                </div>
                <div className="local-search-item">
                    {isEditing ? (
                        <>
                            <Button
                                className="local-search-item-small-btn"
                                size="small"
                                onClick={() => this.props.toggleEdit(false)}
                            >
                                取消
                            </Button>
                            <Button
                                type="primary"
                                className="local-search-item-small-btn"
                                size="small"
                                onClick={() => this.props.toggleEdit(true)}
                            >
                                保存
                            </Button>
                        </>
                    ) : (
                        <Button
                            className="local-search-item-btn"
                            onClick={this.props.setEditGoodsList}
                        >
                            编辑
                        </Button>
                    )}
                </div>
                <div className="local-search-item">
                    <Button
                        className="local-search-item-btn"
                        loading={deleteLoading}
                        onClick={this.getGoodsDelete}
                    >
                        删除
                    </Button>
                </div>
                <div className="local-search-item">
                    <Button className="local-search-item-btn" onClick={this.refreshPage}>
                        刷新
                    </Button>
                </div>
                <div className="local-search-item">
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

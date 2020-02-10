import React, { ChangeEvent } from 'react';
import { Input, InputNumber, Select, Button, Menu, Dropdown, Icon } from 'antd';
import { ClickParam } from 'antd/lib/menu';

const { Option } = Select;

declare interface ILocalSearchProps {
    // toggleUpdateDialog(status: boolean, type?: string): void;
}

declare interface ILocalSearchState {
    task_number: string;                // 任务 id
    store_id: string;                   // 店铺 ID
    scm_goods_sn: string;               // 中台商品 SN
    first_catagory: string;             // 一级类目
    second_catagory: string;            // 二级类目
    third_catagory: string;             // 三级类目
    sale_status: string;                // 上架状态
    min_sale: number | undefined;       // 销量最小
    max_sale: number | undefined;       // 销量最大值
    min_inventory: number | undefined;  // 库存最小值
    min_sku: number | undefined;        // sku数量最小值
    min_price: number | undefined;      // 价格范围最小值
    max_price: number | undefined;      // 价格范围最大值
    min_comment: number | undefined;    // 评论数量最小值
    max_inventory: number | undefined;  // 库存最大值
    max_sku: number | undefined;        // sku最大值
    // [key: string]: any;
}

// <{}, ILocalSearchState>

class LocalSearch extends React.PureComponent<ILocalSearchProps, ILocalSearchState> {

    constructor(props: ILocalSearchProps) {
        super(props);
        this.state = {
            task_number: '',
            store_id: '',
            scm_goods_sn: '',
            first_catagory: '',
            second_catagory: '',
            third_catagory: '',
            sale_status: '',
            min_sale: undefined,
            max_sale: undefined,
            min_inventory: undefined,
            max_inventory: undefined,
            min_sku: undefined,
            max_sku: undefined,
            min_price: undefined,
            max_price: undefined,
            min_comment: undefined
        };
    }

    private setTaskNumber = (e: ChangeEvent<HTMLInputElement>) => {
        this.setState({
            task_number: e.target.value 
        })
    }

    private setStoreId = (e: ChangeEvent<HTMLInputElement>) => {
        this.setState({
            store_id: e.target.value 
        })
    }

    private setScmGoodsSn = (e: ChangeEvent<HTMLInputElement>) => {
        this.setState({
            scm_goods_sn: e.target.value 
        })
    }

    private setFirstCatagory = (val: string) => {
        this.setState({
            first_catagory: val
        })
    }

    private setSecondCatagory = (val: string) => {
        this.setState({
            second_catagory: val
        })
    }

    private setThirdCatagory = (val: string) => {
        this.setState({
            third_catagory: val
        })
    }

    private setSaleStatus = (val: string) => {
        this.setState({
            sale_status: val
        })
    }

    private setMinSale = (val: number | undefined) => {
        this.setState({
            min_sale: val
        })
    }

    private setMaxSale = (val: number | undefined) => {
        this.setState({
            max_sale: val
        })
    }

    private setMinInventory = (val: number | undefined) => {
        this.setState({
            min_inventory: val
        })
    }

    private setMaxInventory = (val: number | undefined) => {
        this.setState({
            max_inventory: val
        })
    }

    private setMinSku = (val: number | undefined) => {
        this.setState({
            min_sku: val
        })
    }

    private setMaxSku = (val: number | undefined) => {
        this.setState({
            max_sku: val
        })
    }

    private setMinPrice = (val: number | undefined) => {
        this.setState({
            min_price: val
        })
    }

    private setMaxPrice = (val: number | undefined) => {
        this.setState({
            max_price: val
        })
    }

    private setMinComment = (val: number | undefined) => {
        this.setState({
            min_comment: val
        })
    }

    onSearch = () => {
        // console.log('onSearch', this.state);
    }

    // handleMenuClick = (e: ClickParam) => {
    //     console.log('handleMenuClick', e)
    //     this.props.toggleUpdateDialog(true, e.key)
    // }

    render() {
        const {
            task_number,
            store_id,
            scm_goods_sn,
            first_catagory,
            second_catagory,
            third_catagory,
            sale_status
        } = this.state

        // const menu = (
        //     <Menu onClick={this.handleMenuClick}>
        //       <Menu.Item key="weight">修改重量</Menu.Item>
        //       <Menu.Item key="price">修改价格</Menu.Item>
        //     </Menu>
        // );

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
                        name="scm_goods_sn"
                        value={scm_goods_sn}
                        onChange={this.setScmGoodsSn}
                    />
                </div>
                <div className="local-search-item">
                    <span className="local-search-label">库存</span>
                    <Select 
                        className="local-search-item-select"
                        value=""
                    >
                        <Option value="">全部</Option>
                        <Option value="0">不可销售</Option>
                        <Option value="1">可销售</Option>
                    </Select>
                </div>
                <div className="local-search-item">
                    <span className="local-search-label">版本更新</span>
                    <Select 
                        className="local-search-item-select"
                        value=""
                    >
                        <Option value="">全部</Option>
                        <Option value="1">有新版本更新</Option>
                        <Option value="0">无新版本更新</Option>
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
                        <Option value="1">xxx</Option>
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
                        <Option value="1">xxx</Option>
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
                        <Option value="1">xxx</Option>
                    </Select>
                </div>
                {/* <div className="local-search-item">
                    <span className="local-search-label">上架状态</span>
                    <Select 
                        className="local-search-item-select" 
                        value={sale_status}
                        onChange={this.setSaleStatus}
                    >
                        <Option value="">全部</Option>
                        <Option value="1">是</Option>
                        <Option value="0">否</Option>
                    </Select>
                </div> */}
                
                {/* <div className="local-search-item">
                    <span className="local-search-label">库存</span>
                    <InputNumber 
                        className="local-search-item-input-min"
                        onChange={this.setMinInventory} 
                    />
                    <span className="local-search-item-join">-</span>
                    <InputNumber 
                        className="local-search-item-input-min" 
                        onChange={this.setMaxInventory}
                    />
                </div> */}
                <div className="local-search-item">
                    <span className="local-search-label">sku数量</span>
                    <InputNumber 
                        className="local-search-item-input-min"
                        onChange={this.setMinSku}
                    />
                    <span className="local-search-item-join">-</span>
                    <InputNumber 
                        className="local-search-item-input-min"
                        onChange={this.setMaxSku}
                    />
                </div>
                <div className="local-search-item">
                    <span className="local-search-label">价格范围（￥）</span>
                    <InputNumber 
                        className="local-search-item-input-min"
                        onChange={this.setMinPrice}
                    />
                    <span className="local-search-item-join">-</span>
                    <InputNumber 
                        className="local-search-item-input-min"
                        onChange={this.setMaxPrice}
                    />
                </div>
                <div className="local-search-item">
                    <span className="local-search-label">销量</span>
                    <InputNumber 
                        className="local-search-item-input-min"
                        onChange={this.setMinSale}
                    />
                    <span className="local-search-item-join">-</span>
                    <InputNumber 
                        className="local-search-item-input-min"
                        onChange={this.setMaxSale}
                    />
                </div>
                <div className="local-search-item">
                    <span className="local-search-label">评论数量>=</span>
                    <InputNumber 
                        className="local-search-item-input-min"
                        onChange={this.setMinComment}
                    />
                </div>
                <div className="local-search-item">
                    <Button
                        type="primary" 
                        className="local-search-item-btn"
                        onClick={this.onSearch}
                    >查询</Button>
                </div>
                <div className="local-search-item">
                    <Button type="primary" className="local-search-item-btn">一键上架</Button>
                </div>
                {/* <div className="local-search-item">
                    <Dropdown 
                        className="local-search-item-btn"
                        placement="bottomCenter"
                        overlay={menu}
                    >
                        <Button>
                            批量编辑 <Icon type="down" />
                        </Button>
                    </Dropdown>
                </div> */}
                <div className="local-search-item">
                    <Button className="local-search-item-btn">导入商品</Button>
                </div>
                <div className="local-search-item">
                    <Button className="local-search-item-btn">删除</Button>
                </div>
                <div className="local-search-item">
                    <Button className="local-search-item-btn">刷新</Button>
                </div>
                <div className="local-search-item">
                    <Button className="local-search-item-btn">导出至Excel</Button>
                </div>
                {/* <div className="local-search-item">
                    <Button className="local-search-item-btn" style={{width: 160}}>下载商品导入模板</Button>
                </div> */}
            </div>
        )
    }
}

export default LocalSearch;

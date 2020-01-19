import React from 'react';
import { Input, Select, Button } from 'antd';

const { Option } = Select;

class LocalSearch extends React.PureComponent {
    render() {
        return (
            <div className="local-search">
                <div className="local-search-item">
                    <span className="local-search-label">任务 ID</span>
                    <Input className="local-search-item-input" placeholder="请输入任务ID"/>
                </div>
                <div className="local-search-item">
                    <span className="local-search-label">店铺 ID</span>
                    <Input className="local-search-item-input" placeholder="请输入任务ID"/>
                </div>
                <div className="local-search-item">
                    <span className="local-search-label">Goods ID</span>
                    <Input className="local-search-item-input" placeholder="请输入任务ID"/>
                </div>
                <div className="local-search-item">
                    <span className="local-search-label">一级类目</span>
                    <Select className="local-search-item-select" value="">
                        <Option value="">全部</Option>
                        <Option value="1">xxx</Option>
                    </Select>
                </div>
                <div className="local-search-item">
                    <span className="local-search-label">二级类目</span>
                    <Select className="local-search-item-select" value="">
                        <Option value="">全部</Option>
                        <Option value="1">xxx</Option>
                    </Select>
                </div>
                <div className="local-search-item">
                    <span className="local-search-label">上架状态</span>
                    <Select className="local-search-item-select" value="">
                        <Option value="">全部</Option>
                        <Option value="1">xxx</Option>
                    </Select>
                </div>
                <div className="local-search-item">
                    <span className="local-search-label">销量</span>
                    <Input className="local-search-item-input-min" />
                    <span className="local-search-item-join">-</span>
                    <Input className="local-search-item-input-min" />
                </div>
                <div className="local-search-item">
                    <span className="local-search-label">库存</span>
                    <Input className="local-search-item-input-min" />
                    <span className="local-search-item-join">-</span>
                    <Input className="local-search-item-input-min" />
                </div>
                <div className="local-search-item">
                    <span className="local-search-label">sku数量</span>
                    <Input className="local-search-item-input-min" />
                    <span className="local-search-item-join">-</span>
                    <Input className="local-search-item-input-min" />
                </div>
                <div className="local-search-item">
                    <span className="local-search-label">价格范围（￥）</span>
                    <Input className="local-search-item-input-min" />
                    <span className="local-search-item-join">-</span>
                    <Input className="local-search-item-input-min" />
                </div>
                <div className="local-search-item">
                    <span className="local-search-label">评论数量>=</span>
                    <Input className="local-search-item-input-min" />
                </div>
                <div className="local-search-item">
                    <Button type="primary" className="local-search-item-btn">查询</Button>
                </div>
                <div className="local-search-item">
                    <Button type="primary" className="local-search-item-btn">一键上架</Button>
                </div>
                <div className="local-search-item">
                    <Button className="local-search-item-btn">批量编辑</Button>
                </div>
                <div className="local-search-item">
                    <Button className="local-search-item-btn">批量删除</Button>
                </div>
                <div className="local-search-item">
                    <Button className="local-search-item-btn">导出至Excel</Button>
                </div>
                <div className="local-search-item">
                    <Button className="local-search-item-btn">刷新当前页面</Button>
                </div>
            </div>
        )
    }
}

export default LocalSearch;

import React, { PureComponent } from 'react'
import { Table, message, Button } from 'antd';
import { ColumnProps } from 'antd/es/table';
import { IRowDataItem } from '@/pages/goods/vova/index';
import { putVovaGoodsSales } from '@/services/VovaGoodsService';

declare interface GoodsTableProps {
    goodsList: IRowDataItem[];
    allCount: number;
    toggleDetailDialog(row: IRowDataItem): void;
    page: number;
    pageCount: number;
    onSearch: Function;
}
export default class GoodsTable extends PureComponent<GoodsTableProps> {
    constructor(props: any) {
        super(props);
        this.state = {
            page: 1,
            pageCount: 10,
        };
    }

    private columns: ColumnProps<IRowDataItem>[] = [
        {
            key: 'storeName',
            title: '店铺名称',
            dataIndex: 'shop_name',
            align: 'center',
            width: 130,
        },
        {
            key: 'virtualGoodsId',
            title: '虚拟ID',
            dataIndex: 'vova_virtual_id',
            align: 'center',
            width: 100,
        },
        {
            key: 'goodsImg',
            title: '商品图片',
            dataIndex: 'sku_pics',
            align: 'center',
            width: 100,
            render: (value: string, row: IRowDataItem, index: number) => (
                <img className="goods-vova-img" src={row.sku_pics} />
            )
        },
        {
            key: 'commodityId',
            title: 'Commodity_ID',
            dataIndex: 'commodity_id',
            align: 'center',
            width: 130,
        },
        {
            key: 'productId',
            title: 'Product_ID',
            dataIndex: 'product_id',
            align: 'center',
            width: 130,
        },
        {
            key: 'salesVolume',
            title: '销量',
            dataIndex: 'sales_volume',
            align: 'center',
            width: 100,
        },
        {
            key: 'productDetail',
            title: '商品详情',
            dataIndex: 'product_detail',
            align: 'center',
            width: 100,
            render: (value: string, row: IRowDataItem, index: number) => {
                return {
                    children: (
                        <>
                            <Button onClick={() => { this.toggleDetailDialog(row) }}>查看详情</Button>
                        </>
                    )
                };
            }
        },
        {
            key: 'evaluateVolume',
            title: '评价数量',
            dataIndex: 'evaluate_volume',
            align: 'center',
            width: 100,
        },
        {
            key: 'averageScore',
            title: '平均评分',
            dataIndex: 'average_score',
            align: 'center',
            width: 100,
        },
        {
            key: 'levelOneCategory',
            title: '一级类目',
            dataIndex: 'level_one_category',
            align: 'center',
            width: 100,
        },
        {
            key: 'levelTwoCategory',
            title: '二级类目',
            dataIndex: 'level_two_category',
            align: 'center',
            width: 100,
        },
        {
            key: 'productStatus',
            title: '商品状态',
            dataIndex: 'product_status',
            align: 'center',
            width: 100,
        },
        {
            key: 'vovaProductLink',
            title: '链接',
            dataIndex: 'vova_product_link',
            align: 'center',
            width: 100,
        },
        {
            key: 'operation',
            title: '操作',
            dataIndex: 'operation',
            align: 'center',
            width: 100,
            render: (value: string, row: IRowDataItem, index: number) => {
                return {
                    children: (
                        <>
                            <Button className="shelves-btn" onClick={() => { this.onShelves(row) }}>上架</Button>
                            <Button className="unshelves-btn" onClick={() => { this.offShelves(row) }}>下架</Button>
                        </>
                    )
                };
            }
        }
    ];

    // 上架操作
    onShelves = (row: IRowDataItem) => {
        putVovaGoodsSales({
            type: 'onsale',
            info: {
                product_id: row.product_id,
                commodity_id: row.commodity_id,
                sale_domain: 'vova'
            }
        } as any).then(res => {
            if (res === 200) {
                message.success('上架成功');
            } else {
                message.error('上架失败');
            }
        })
    }

    // 下架操作
    offShelves = (row: IRowDataItem) => {
        putVovaGoodsSales({
            type: 'offsale',
            info: {
                product_id: row.product_id,
                commodity_id: row.commodity_id,
                sale_domain: 'vova'
            }
        } as any).then(res => {
            if (res === 200) {
                message.success('下架成功');
            } else {
                message.error('下架失败');
            }
        })
    }

    toggleDetailDialog = (row: IRowDataItem) => {
        this.props.toggleDetailDialog(row);
    }

    onSizeChange = (current: number, size?: number) => {
        this.setState({
            page: current,
            pageCount: size
        });
        this.props.onSearch(current, size);
    }

    render() {
        const { goodsList, allCount } = this.props;
        const { pageCount } = this.state;
        return (
            <>
                <Table
                    bordered={true}
                    rowKey="scmSkuSn"
                    className="goods-vova-table"
                    columns={this.columns}
                    dataSource={goodsList}
                    scroll={{ x: true }}
                    pagination={{
                        pageSize: pageCount || 10,
                        pageSizeOptions: ['10', '50', '100', '200', '500', '1000', '10000'],
                        onShowSizeChange: (current: number, size: number) => {
                            this.onSizeChange(current, size);
                        },
                        onChange: (page: number, pageSize?: number) => {
                            this.onSizeChange(page, pageSize);
                        },
                        showSizeChanger: true,
                        showQuickJumper: true,
                        total: allCount,
                    }}
                />
            </>
        )
    }
}

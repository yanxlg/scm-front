import React, { PureComponent } from 'react'
import { Table, Checkbox, Pagination, Input, Button } from 'antd';
import { ColumnProps } from 'antd/es/table';
import ZoomImage from '@/components/ZoomImage';
import { IRowDataItem } from '@/pages/goods/vova/index';

declare interface GoodsTableProps {
    goodsList: IRowDataItem[];
    allCount: number;
    toggleDetailDialog(product_id: number): void;
}
export default class GoodsTable extends PureComponent<GoodsTableProps> {
    private columns: ColumnProps<IRowDataItem>[] = [
        {
            key: 'storeName',
            title: '店铺名称',
            dataIndex: 'shop_name',
            align: 'center',
            width: 130,
            render: this.mergeCell
        },
        {
            key: 'virtualGoodsId',
            title: '虚拟ID',
            dataIndex: 'product_id',
            align: 'center',
            width: 100,
            render: this.mergeCell
        },
        {
            key: 'goodsImg',
            title: '商品图片',
            dataIndex: 'sku_pics',
            align: 'center',
            width: 100,
            render: (value: string, row: IRowDataItem, index: number) => {
                return {
                    children: (
                        <ZoomImage className="goods-vova-img" src={row.sku_pics} />
                    ),
                    props: {
                        rowSpan: row._rowspan || 0
                    }
                };
            }
        },
        {
            key: 'commodityId',
            title: 'Commodity_ID',
            dataIndex: 'commodityId',
            align: 'center',
            width: 130,
            render: (value: string, row: IRowDataItem, index: number) => {
                return {
                    children: (
                        <>
                            <div>{value}</div>
                        </>
                    ),
                    props: {
                        rowSpan: row._rowspan || 0
                    }
                };
            }
        },
        {
            key: 'productId',
            title: 'Product_ID',
            dataIndex: 'productId',
            align: 'center',
            width: 130,
            render: this.mergeCell
        },
        {
            key: 'salesVolume',
            title: '销量',
            dataIndex: 'sales_volume',
            align: 'center',
            width: 100,
            render: this.mergeCell
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
                            <Button onClick={() => { this.toggleDetailDialog(row.product_id) }}>查看详情</Button>
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
            render: this.mergeCell
        },
        {
            key: 'averageScore',
            title: '平均评分',
            dataIndex: 'average_score',
            align: 'center',
            width: 100,
            render: this.mergeCell
        },
        {
            key: 'levelOneCategory',
            title: '一级类目',
            dataIndex: 'level_one_category',
            align: 'center',
            width: 100,
            render: this.mergeCell
        },
        {
            key: 'levelTwoCategory',
            title: '二级类目',
            dataIndex: 'level_two_category',
            align: 'center',
            width: 100,
            render: this.mergeCell
        },
        {
            key: 'productStatus',
            title: '商品状态',
            dataIndex: 'product_status',
            align: 'center',
            width: 130,
            render: this.mergeCell
        },
        {
            key: 'vovaProductLink',
            title: '链接',
            dataIndex: 'vova_product_link',
            align: 'center',
            width: 100,
            render: this.mergeCell
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
                            <Button onClick={() => { this.onShelves(row) }}>上架</Button>
                            <Button onClick={() => { this.offShelves(row) }}>下架</Button>
                        </>
                    )
                };
            }
        }
    ];

    onShelves = (row: IRowDataItem) => {

    }

    offShelves = (row: IRowDataItem) => {

    }

    toggleDetailDialog = (product_id: number) => {
        const {toggleDetailDialog} = this.props;
        toggleDetailDialog(product_id);
    }

    private mergeCell(value: string, row: IRowDataItem, index: number) {
        return {
            children: value,
            props: {
                rowSpan: row._rowspan || 0
            }
        };
    }

    render() {
        const { goodsList, allCount } = this.props;
        return (
            <>
                <Table
                    bordered={true}
                    rowKey="scmSkuSn"
                    className="goods-vova-table"
                    // bordered={true}
                    // rowSelection={rowSelection}
                    columns={this.columns}
                    dataSource={goodsList}
                    scroll={{ x: true }}
                    pagination={false}
                    // loading={dataLoading}
                    // onRow={this.toggleRow}
                />
                <Pagination
                    className="goods-vova-pagination"
                    total={allCount || 1}
                    showSizeChanger={true}
                    showQuickJumper={true}
                />
            </>
        )
    }
}

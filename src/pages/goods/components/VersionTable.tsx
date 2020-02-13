import React from 'react';
import { Button, Pagination, Table } from 'antd';
import { ColumnProps } from 'antd/es/table';
import { IGoodsVersionRowItem, IGoodsImgs } from '../version';

import VersionImgDialog from './VersionImgDialog';

declare interface IVersionTableProps {
    loading: boolean;
    versionGoodsList: IGoodsVersionRowItem[]
}

declare interface VersionTableState {
    versionImgDialogStatus: boolean;
    activeRow: IGoodsVersionRowItem | null;
}

class VersionTable extends React.PureComponent<IVersionTableProps, VersionTableState> {

    private columns: ColumnProps<IGoodsVersionRowItem>[] = [
        {
            key: 'x',
            width: 100,
            title: '操作',
            dataIndex: 'product_id',
            align: 'center',
            render: (value: string, row: IGoodsVersionRowItem, index: number) => {
                const children = (
                    <div>
                        xxx
                    </div>
                )
                return {
                    children,
                    props: {
                        rowSpan: row._rowspan || 0
                    }
                };
            }
        },
        {
            key: 'product_id',
            width: 100,
            title: 'Product ID',
            dataIndex: 'product_id',
            align: 'center',
            render: this.mergeCell
        },
        {
            key: 'up_shelf_channel',
            width: 100,
            title: '上架渠道',
            dataIndex: 'up_shelf_channel',
            align: 'center',
            render: this.mergeCell
        },
        {
            key: 'goods_imgs',
            width: 120,
            title: '商品图片',
            dataIndex: 'goods_imgs',
            align: 'center',
            render: (value: IGoodsImgs, row: IGoodsVersionRowItem) => {
                let isChange = false;
                const { main_image_url: mainImg, sub_image: subImgs } = value;
                if (row._prevVersion) {
                    const { main_image_url: prevMainImg, sub_image: prevSubImgs } = row._prevVersion.goods_imgs;
                    if (mainImg !== prevMainImg) {
                        isChange = true;
                    }
                    if (subImgs.length !== prevSubImgs.length) {
                        isChange = true;
                    } else {
                        subImgs.forEach((item, index) => {
                            if (item.sub_image_url !== prevSubImgs[index].sub_image_url) {
                                isChange = true;
                            }
                        })
                    }

                }
                const children = (
                    <div>
                        <img src={value.main_image_url}/>
                        <Button 
                            type="link"
                            className={isChange ? 'red' : ''}  
                            block={true}
                            onClick={() => this.showImgs(row)}
                        >查看详情</Button>
                    </div>
                )
                return {
                    children,
                    props: {
                        rowSpan: row._rowspan || 0
                    }
                };
            }
        },
        {
            key: 'goods_title',
            width: 200,
            title: '商品标题',
            dataIndex: 'goods_title',
            align: 'center',
            render: (value: string, row: IGoodsVersionRowItem) => {
                let children = null;
                if (row._prevVersion) {
                    if (row._prevVersion.goods_title === value) {
                        children = <div className="text-left">原标题: {value}</div>
                    } else {
                        children = (
                            <>
                                <div className="text-left">原标题: {row._prevVersion.goods_title}</div>
                                <div className="text-left red">新标题: {value}</div>
                            </>
                        )
                    }
                } else {
                    children = <div className="text-left red">新标题: {value}</div>
                }
                return {
                    children,
                    props: {
                        rowSpan: row._rowspan || 0
                    }
                };
            }
        },
        {
            key: 'goods_description',
            width: 200,
            title: '商品描述',
            dataIndex: 'goods_description',
            align: 'center',
            render: (value: string, row: IGoodsVersionRowItem) => {
                let children = null;
                if (row._prevVersion) {
                    if (row._prevVersion.goods_description === value) {
                        children = <div className="text-left">原描述: {value}</div>
                    } else {
                        children = (
                            <>
                                <div className="text-left">原描述: {row._prevVersion.goods_description}</div>
                                <div className="text-left red">新描述: {value}</div>
                            </>
                        )
                    }
                } else {
                    children = <div className="text-left red">新描述: {value}</div>
                }
                return {
                    children,
                    props: {
                        rowSpan: row._rowspan || 0
                    }
                };
            }
        },
        {
            key: 'middle_sku_id',
            width: 120,
            title: '中台sku ID',
            dataIndex: 'middle_sku_id',
            align: 'center',
        },
        {
            key: 'source_sku_id',
            width: 120,
            title: '源sku ID',
            dataIndex: 'source_sku_id',
            align: 'center',
        },
        {
            key: 'specs',
            width: 140,
            title: '规格',
            dataIndex: 'specs',
            align: 'center',
            render: (value: string, row: IGoodsVersionRowItem) => {
                return (
                    <div className="border text-left">
                        <div className="nowrap">{value.split(',')}</div>
                    </div>
                )
            }
        },
        {
            key: 'price',
            width: 140,
            title: '价格',
            dataIndex: 'price',
            align: 'center',
            render: (value: number, row: IGoodsVersionRowItem) => this.compareVersion(value, row, 'price', '价格')
        },
        {
            key: 'price1',
            width: 120,
            title: '价格变化',
            // dataIndex: 'price',
            align: 'center',
            render: (a1, row: IGoodsVersionRowItem) => {
                const value = row.price;
                let children = null;
                if (row._prevVersion && row._prevVersion.price !== value) {
                    const prevPrice = row._prevVersion.price;
                    const num = value - prevPrice;
                    // 
                    children = <div><span className="red">{num > 0 ? '↑' : '↓'}</span> {Math.abs(prevPrice - value)}</div>
                } else {
                    children = <div>-</div>
                }
                return <div className="border">{children}</div>
            }
        },
        {
            key: 'weight',
            width: 120,
            title: '重量',
            dataIndex: 'weight',
            align: 'center',
            render: (value: number, row: IGoodsVersionRowItem) => this.compareVersion(value, row, 'weight', '重量')
        },
        {
            key: 'stock',
            width: 120,
            title: '库存',
            dataIndex: 'stock',
            align: 'center',
            render: (value: number, row: IGoodsVersionRowItem) => this.compareVersion(value, row, 'stock', '库存')
        },     
        {
            key: 'shipping_fee',
            width: 120,
            title: '运费',
            dataIndex: 'shipping_fee',
            align: 'center',
            render: (value: number, row: IGoodsVersionRowItem) => this.compareVersion(value, row, 'shipping_fee', '运费')
        },
        {
            key: 'sales_volume',
            width: 120,
            title: '销量',
            dataIndex: 'sales_volume',
            align: 'center',
            render: (value: number, row: IGoodsVersionRowItem) => this.compareVersion(value, row, 'sales_volume', '销量')
        },
        {
            key: 'evaluation_quantity',
            width: 160,
            title: '评价数量',
            dataIndex: 'evaluation_quantity',
            align: 'center',
            render: (value: number, row: IGoodsVersionRowItem) => this.compareVersion(value, row, 'evaluation_quantity', '评论数')
        },
        {
            key: 'category_one_level',
            width: 120,
            title: '一级类目',
            dataIndex: 'category_one_level',
            align: 'center',
            render: (value: number, row: IGoodsVersionRowItem) => this.compareVersion(value, row, 'category_one_level', '类目')
        },
        {
            key: 'category_two_level',
            width: 120,
            title: '二级类目',
            dataIndex: 'category_two_level',
            align: 'center',
            render: (value: number, row: IGoodsVersionRowItem) => this.compareVersion(value, row, 'category_two_level', '类目')
        },
        {
            key: 'category_three_level',
            width: 120,
            title: '三级类目',
            dataIndex: 'category_three_level',
            align: 'center',
            render: (value: number, row: IGoodsVersionRowItem) => this.compareVersion(value, row, 'category_three_level', '类目')
        },
        {
            key: 'change_time',
            width: 120,
            title: '变更时间',
            dataIndex: 'change_time',
            align: 'center',
            render: this.mergeAndBorderCell
        },
        {
            key: 'change_operator',
            width: 120,
            title: '变更人',
            dataIndex: 'change_operator',
            align: 'center',
            render: this.mergeAndBorderCell
        }
    ]

    constructor(props: IVersionTableProps) {
        super(props);
        this.state = {
            versionImgDialogStatus: false,
            activeRow: null
        }
    }

    // 版本数据对比
    private compareVersion = (value: number, row: IGoodsVersionRowItem, key: string, desc: string) => {
        let children = null;
        if (row._prevVersion) {
            const prevValue = row._prevVersion[key as 'shipping_fee'];
            if (prevValue === value) {
                children = <div>原{desc}: {value}</div>
            } else {
                children = (
                    <>
                        <div>原{desc}: {prevValue}</div>
                        <div className="red">新{desc}: {value}</div>
                    </>
                )
            }
        } else {
            children = <div className="red">新{desc}: {value}</div>
        }
        return <div className="border text-left">{children}</div>
    }

    // 展示图片弹框
    showImgs = (rowData: IGoodsVersionRowItem) => {
        // console.log('showImgs', rowData);
        this.setState({
            activeRow: rowData
        }, () => {
            this.toggleVersionImgDialog(true);
        })
    }

    // 合并单元格
    private mergeCell(value: string, row: IGoodsVersionRowItem, index: number) {
        return {
            children: value,
            props: {
                rowSpan: row._rowspan || 0
            }
        };
    }

    // 表格内容展示加边框
    private borderCell(value: string, row: IGoodsVersionRowItem, index: number) {
        return (
            <div className="border">
                <div className="nowrap">{value}</div>
            </div>
        )
    }

    // 合并单元格和展示边框
    private mergeAndBorderCell(value: string, row: IGoodsVersionRowItem, index: number) {
        return {
            children: (
                <div className="border">
                    <div className="nowrap">{value}</div>
                </div>
            ),
            props: {
                rowSpan: row._rowspan || 0
            }
        };
    }

    

    private toggleVersionImgDialog = (status: boolean) => {
        this.setState({
            versionImgDialogStatus: status
        });
    }

    render() {

        const { versionGoodsList, loading } = this.props;
        const { versionImgDialogStatus, activeRow } = this.state;

        return (
            <>
                <Table
                    bordered={true}
                    rowKey='middle_sku_id'
                    className="goods-version-table"
                    loading={loading}
                    scroll={{ x: true }}
                    pagination={false}
                    columns={this.columns}
                    dataSource={versionGoodsList}
                />
                <VersionImgDialog
                    visible={versionImgDialogStatus}
                    activeRow={activeRow}
                    toggleVersionImgDialog={this.toggleVersionImgDialog}
                />
            </>
        )
    }
}

export default VersionTable;

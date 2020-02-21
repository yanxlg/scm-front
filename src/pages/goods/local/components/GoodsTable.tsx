import React, { ChangeEvent } from 'react';
import { Table, Checkbox, Button, Input, Select, message } from 'antd';
import Link from 'umi/link';
import ZoomImage from '@/components/ZoomImage';

import { ColumnProps } from 'antd/es/table';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';
import { IRowDataItem, ISaleItem, ISkuStyle, ICatagoryData, ICategoryItem } from '../index';

import { formatDate } from '@/utils/date';

const { Option } = Select;
const { TextArea } = Input;

declare interface IGoodsTableProps {
    searchLoading: boolean;
    selectedRowKeys: string[];
    rowKeys: string[];
    goodsList: IRowDataItem[];
    allCatagoryList: ICategoryItem[];
    toggleEditGoodsDialog(status: boolean, row: IRowDataItem): void;
    changeSelectedRowKeys(rowKeys: string[]): void;
    searchGoodsSale(product_id: string): void;
}

declare interface IGoodsTableState {
    indeterminate: boolean;
    checkAll: boolean;
}

class GoodsTable extends React.PureComponent<IGoodsTableProps, IGoodsTableState> {
    constructor(props: IGoodsTableProps) {
        super(props);
        this.state = {
            indeterminate: false,
            checkAll: false,
        };
    }

    private columns: ColumnProps<IRowDataItem>[] = [
        {
            key: 'x',
            title: () => (
                <Checkbox
                    indeterminate={this.state.indeterminate}
                    checked={this.state.checkAll}
                    onChange={this.onCheckAllChange}
                />
            ),
            // dataIndex: 'a1',
            align: 'center',
            width: 60,
            render: (value: string, row: IRowDataItem, index: number) => {
                const { selectedRowKeys } = this.props;
                const { product_id } = row;
                return {
                    // children: row._isParent ? <Checkbox /> : null,
                    children: (
                        <Checkbox
                            checked={selectedRowKeys.indexOf(product_id) > -1}
                            onChange={() => this.selectedRow(product_id)}
                        />
                    ),
                    props: {
                        rowSpan: row._rowspan || 0,
                    },
                };
            },
        },
        {
            key: 'commodity_id',
            title: 'Commodity ID',
            dataIndex: 'commodity_id',
            align: 'center',
            width: 130,
            render: (value: string, row: IRowDataItem) => {
                return {
                    children: (
                        <>
                            <Link to={`/goods/local/version?id=${value}`}>{value}</Link>
                             
                        </>
                    ),
                    props: {
                        rowSpan: row._rowspan || 0,
                    },
                };
            },
        },
        {
            key: 'product_id',
            title: 'Product ID',
            dataIndex: 'product_id',
            align: 'center',
            width: 130,
            render: (value: string, row: IRowDataItem) => {
                return {
                    children: (
                        <>
                            <div className={row.hasnew_version ? 'red' : ''}>{value}</div>
                            <Button
                                className="goods-local-img-edit"
                                size="small"
                                onClick={() => this.props.toggleEditGoodsDialog(true, row)}
                            >
                                编辑
                            </Button>
                        </>
                    ),
                    props: {
                        rowSpan: row._rowspan || 0,
                    },
                };
            },
        },
        {
            key: 'goods_status',
            title: '商品状态',
            dataIndex: 'goods_status',
            align: 'center',
            width: 120,
            render: this.mergeCell,
        },
        {
            key: 'goods_img',
            title: '商品图片',
            dataIndex: 'goods_img',
            align: 'center',
            width: 100,
            render: (value: string, row: IRowDataItem, index: number) => {
                return {
                    children: <ZoomImage className="goods-local-img" src={row.sku_image[0]} />,
                    props: {
                        rowSpan: row._rowspan || 0,
                    },
                };
            },
        },
        {
            key: 'title',
            title: '标题',
            dataIndex: 'title',
            align: 'center',
            width: 200,
            render: (value: string, row: IRowDataItem) => {
                return {
                    children: <div className="text">{value}</div>,
                    props: {
                        rowSpan: row._rowspan || 0,
                    },
                };
            },
        },
        {
            key: 'description',
            title: '描述',
            dataIndex: 'description',
            align: 'center',
            width: 200,
            render: (value: string, row: IRowDataItem) => {
                return {
                    children: <div className="text">{value}</div>,
                    props: {
                        rowSpan: row._rowspan || 0,
                    },
                };
            },
        },

        {
            key: 'first_catagory',
            title: '一级类目',
            dataIndex: 'first_catagory',
            align: 'center',
            width: 100,
            render: (value: ICatagoryData, row: IRowDataItem) => {
                return {
                    children: <div>{value.name || ''}</div>,
                    props: {
                        rowSpan: row._rowspan || 0,
                    },
                };
            }
        },
        {
            key: 'second_catagory',
            title: '二级类目',
            dataIndex: 'second_catagory',
            align: 'center',
            width: 100,
            render: (value: ICatagoryData, row: IRowDataItem) => {
                return {
                    children: <div>{value.name || ''}</div>,
                    props: {
                        rowSpan: row._rowspan || 0,
                    },
                };
            }
        },
        {
            key: 'third_catagory',
            title: '三级类目',
            dataIndex: 'third_catagory',
            align: 'center',
            width: 100,
            render: (value: ICatagoryData, row: IRowDataItem) => {
                return {
                    children: <div>{value.name || ''}</div>,
                    props: {
                        rowSpan: row._rowspan || 0,
                    },
                };
            }
        },
        {
            key: 'sku_number',
            title: 'sku数量',
            dataIndex: 'sku_number',
            align: 'center',
            width: 100,
            render: this.mergeCell,
        },
        {
            key: 'sku_sn',
            title: '中台sku sn',
            dataIndex: 'sku_sn',
            align: 'center',
            width: 120,
        },
        {
            key: 'sku_style',
            title: '规格',
            dataIndex: 'sku_style',
            align: 'center',
            width: 180,
            render: (value: ISkuStyle, row: IRowDataItem, index: number) => {
                return (
                    <div>
                        {
                            value ? (
                                Object.keys(value).map(key => (
                                    <span key={key}>{key}: {value[key]}</span>
                                ))
                            ) : null
                        }
                    </div>
                );
            },
        },
        {
            key: 'sku_price',
            title: '价格',
            dataIndex: 'sku_price',
            align: 'center',
            width: 100,
        },
        {
            key: 'sku_shopping_fee',
            title: '运费',
            dataIndex: 'sku_shopping_fee',
            align: 'center',
            width: 100,
        },
        {
            key: 'sku_weight',
            title: '重量',
            dataIndex: 'sku_weight',
            align: 'center',
            width: 100,
            // render: (value: string, row: IRowDataItem, index: number) => {
            //     return <Input value={value}/>
            // }
        },
        {
            key: 'sku_inventory',
            title: '库存',
            dataIndex: 'sku_inventory',
            align: 'center',
            width: 100,
        },
        // {
        //     key: 'scmSkuShoppingTime',
        //     title: '发货时间',
        //     dataIndex: 'scmSkuShoppingTime',
        //     align: 'center',
        //     width: 100
        // },

        {
            key: 'sales_volume',
            title: '销量',
            dataIndex: 'sales_volume',
            align: 'center',
            width: 100,
            render: this.mergeCell,
        },
        {
            key: 'comments',
            title: '评价数量',
            dataIndex: 'comments',
            align: 'center',
            width: 100,
            render: this.mergeCell,
        },
        {
            key: 'brand',
            title: '品牌',
            dataIndex: 'brand',
            align: 'center',
            width: 100,
            render: this.mergeCell,
        },
        {
            key: 'store_id',
            title: '店铺 id',
            dataIndex: 'store_id',
            align: 'center',
            width: 100,
            render: this.mergeCell,
        },
        {
            key: 'store_name',
            title: '店铺名称',
            dataIndex: 'store_name',
            align: 'center',
            width: 100,
            render: this.mergeCell,
        },
        {
            key: 'worm_task_id',
            title: '爬虫任务ID',
            dataIndex: 'worm_task_id',
            align: 'center',
            width: 120,
            render: this.mergeCell,
        },
        {
            key: 'worm_goods_id',
            title: '爬虫商品ID',
            dataIndex: 'worm_goods_id',
            align: 'center',
            width: 120,
            render: this.mergeCell,
        },
        // {
        //     key: 'isOnSale',
        //     title: '是否可上架',
        //     dataIndex: 'isOnSale',
        //     align: 'center',
        //     width: 100,
        //     render: this.mergeCell
        // },
        {
            key: 'onsale_info',
            title: '上架渠道',
            dataIndex: 'onsale_info',
            align: 'center',
            width: 100,
            render: (value: ISaleItem[], row: IRowDataItem, index: number) => {
                return {
                    children: value ? (
                        <Button
                            type="link"
                            onClick={() => this.props.searchGoodsSale(row.product_id)}
                        >
                            {value.map((item: ISaleItem) => item.onsale_channel).join('、')}
                        </Button>
                    ) : null,
                    props: {
                        rowSpan: row._rowspan || 0,
                    },
                };
            },
        },
        {
            key: 'update_time',
            title: '更新时间',
            dataIndex: 'update_time',
            align: 'center',
            width: 120,
            render: (value: number, row: IRowDataItem) => {
                return {
                    children: <div>{formatDate(new Date(value * 1000), 'yyyy-MM-dd')}</div>,
                    props: {
                        rowSpan: row._rowspan || 0,
                    },
                };
            },
        },

        {
            key: 'worm_goodsinfo_link',
            title: '链接',
            dataIndex: 'worm_goodsinfo_link',
            align: 'center',
            width: 200,
            render: (value: string, row: IRowDataItem) => {
                return {
                    children: (
                        <a href={value} target="_blank">
                            {value}
                        </a>
                    ),
                    props: {
                        rowSpan: row._rowspan || 0,
                    },
                };
            },
        },
    ];

    // 取消全选
    cancelCheckAll = () => {
        this.setState({
            indeterminate: false,
            checkAll: false,
        });
    };

    // 点击全选
    private onCheckAllChange = (e: CheckboxChangeEvent) => {
        // console.log(1111, );
        // checkedList: e.target.checked ? plainOptions : [],
        // indeterminate: false,
        // checkAll: e.target.checked,
        const checked = e.target.checked;
        const { rowKeys } = this.props;
        this.setState({
            indeterminate: false,
            checkAll: checked,
        });
        this.props.changeSelectedRowKeys(checked ? [...rowKeys] : []);
    };

    // 选择商品行
    private selectedRow = (id: string) => {
        // console.log('selectedRow', id);
        const { selectedRowKeys, rowKeys } = this.props;
        const copySelectedRowKeys = [...selectedRowKeys];
        const index = copySelectedRowKeys.indexOf(id);
        if (index === -1) {
            copySelectedRowKeys.push(id);
        } else {
            copySelectedRowKeys.splice(index, 1);
        }
        const len = copySelectedRowKeys.length;
        this.setState({
            indeterminate: len > 0 && len !== rowKeys.length,
            checkAll: len === rowKeys.length,
        });
        this.props.changeSelectedRowKeys(copySelectedRowKeys);
    };

    // 合并单元格
    private mergeCell(value: string, row: IRowDataItem, index: number) {
        return {
            children: value,
            props: {
                rowSpan: row._rowspan || 0,
            },
        };
    }

    render() {
        const { goodsList, searchLoading } = this.props;
        return (
            <Table
                bordered={true}
                rowKey="sku_sn"
                className="goods-local-table"
                columns={this.columns}
                dataSource={goodsList}
                scroll={{ x: true }}
                pagination={false}
                loading={searchLoading}
            />
        );
    }
}

export default GoodsTable;

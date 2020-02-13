
import React, { ChangeEvent } from 'react';
import { Table, Checkbox, Button, Input, Select, message } from 'antd';
import Link from 'umi/link';
import ZoomImage from '@/components/ZoomImage';

import { ColumnProps } from 'antd/es/table';
import { CheckboxChangeEvent } from 'antd/lib/checkbox'
import { IRowDataItem, ISaleItem, IScmSkuStyle, ICatagoryData, ICategoryItem } from '../local';

const { Option } = Select;

declare interface IGoodsTableProps {
    searchLoading: boolean;
    selectedRowKeys: string[];
    rowKeys: string[];
    goodsList: IRowDataItem[];
    editGoodsList: IRowDataItem[];
    allCatagoryList: ICategoryItem[];
    toggleImgEditDialog(status: boolean, imgList?: string[], productId?: string): void;
    changeSelectedRowKeys(rowKeys: string[]): void;
    searchGoodsSale(productId: string): void;
    changeEditGoodsList(productId: string, type: string, val: any): void;
    getCurrentCatagory(firstId: number, secondId?: number): ICategoryItem[];
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
            checkAll: false
        }
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
                const { productId } = row;
                return {
                    // children: row._isParent ? <Checkbox /> : null,
                    children: (
                        <Checkbox 
                            checked={selectedRowKeys.indexOf(productId)>-1} 
                            onChange={() => this.selectedRow(productId)}
                        />
                    ),
                    props: {
                        rowSpan: row._rowspan || 0
                    }
                };
            }
        },
        {
            key: 'commodityId',
            title: 'Commodity ID',
            dataIndex: 'commodityId',
            align: 'center',
            width: 130,
            render: (value: string, row: IRowDataItem) => {
                return {
                    children: (
                        <Link to={`/goods/version?id=${value}`}>{value}</Link>
                    ),
                    props: {
                        rowSpan: row._rowspan || 0
                    }
                };
            }
        },
        {
            key: 'productId',
            title: 'Product ID',
            dataIndex: 'productId',
            align: 'center',
            width: 130,
            render: this.mergeCell
        },
        {
            key: 'goodsImg',
            title: '商品图片',
            dataIndex: 'goodsImg',
            align: 'center',
            width: 100,
            render: (value: string, row: IRowDataItem, index: number) => {
                return {
                    children: (
                        <>
                            <ZoomImage className="goods-local-img" src={row.skuImage[0]} />
                            <Button 
                                className="goods-local-img-edit" 
                                size="small"
                                onClick={() => this.clickImgEdit(row.skuImage, row.productId)}
                            >编辑</Button>
                        </>
                    ),
                    props: {
                        rowSpan: row._rowspan || 0
                    }
                };
            }
        },
        {
            key: 'title',
            title: '标题',
            dataIndex: 'title',
            align: 'center',
            width: 200,
            render: (value: string, row: IRowDataItem) => {
                const { editGoodsList } = this.props;
                const index = editGoodsList.findIndex(item => row.productId === item.productId);
                return {
                    children: index > -1 ? (
                        <Input 
                            value={editGoodsList[index].title}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => this.props.changeEditGoodsList(row.productId, 'title', e.target.value)}
                        />
                    ) : (<div>{value}</div>),
                    props: {
                        rowSpan: row._rowspan || 0
                    }
                }
            }
        },
        {
            key: 'description',
            title: '描述',
            dataIndex: 'description',
            align: 'center',
            width: 200,
            render: (value: string, row: IRowDataItem) => {
                const { editGoodsList } = this.props;
                const index = editGoodsList.findIndex(item => row.productId === item.productId);
                return {
                    children: index > -1 ? (
                        <Input 
                            value={editGoodsList[index].description}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => this.props.changeEditGoodsList(row.productId, 'description', e.target.value)}
                        />
                    ) : (<div>{value}</div>),
                    props: {
                        rowSpan: row._rowspan || 0
                    }
                }
            }
        },
        
        {
            key: 'firstCatagory',
            title: '一级类目',
            dataIndex: 'firstCatagory',
            align: 'center',
            width: 100,
            render: (value: ICatagoryData, row: IRowDataItem) => {
                const { editGoodsList, allCatagoryList } = this.props;
                const index = editGoodsList.findIndex(item => row.productId === item.productId);
                const currentEditGoods = editGoodsList[index];
                return {
                    children: index > -1 ? (
                        <Select 
                            className=""
                            value={currentEditGoods.firstCatagory.id + ''}
                            onChange={(val: string) => this.props.changeEditGoodsList(row.productId, 'firstCatagory', val)}
                        >
                            {
                                allCatagoryList.map(item => (
                                    <Option key={item.id + ''} value={item.id + ''}>{item.name}</Option>
                                ))
                            }
                        </Select>
                    ) : (<div>{value.name}</div>),
                    props: {
                        rowSpan: row._rowspan || 0
                    }
                }
            }
        },
        {
            key: 'secondCatagory',
            title: '二级类目',
            dataIndex: 'secondCatagory',
            align: 'center',
            width: 100,
            render: (value: ICatagoryData, row: IRowDataItem) => {
                const { editGoodsList, allCatagoryList } = this.props;
                const index = editGoodsList.findIndex(item => row.productId === item.productId);
                const currentEditGoods = editGoodsList[index];
                let catagoryList: ICategoryItem[] = [];
                if (currentEditGoods) {
                    catagoryList = this.props.getCurrentCatagory(currentEditGoods.firstCatagory.id);
                }
                return {
                    children: index > -1 ? (
                        <Select 
                            className=""
                            value={currentEditGoods.secondCatagory.id + ''}
                            onChange={(val: string) => this.props.changeEditGoodsList(row.productId, 'secondCatagory', val)}
                        >
                            <Option value="-1">请选择</Option>
                            {
                                catagoryList.map(item => (
                                    <Option key={item.id + ''} value={item.id + ''}>{item.name}</Option>
                                ))
                            }
                        </Select>
                    ) : (<div>{value.name}</div>),
                    props: {
                        rowSpan: row._rowspan || 0
                    }
                }
            }
        },
        {
            key: 'thirdCatagory',
            title: '三级类目',
            dataIndex: 'thirdCatagory',
            align: 'center',
            width: 100,
            render: (value: ICatagoryData, row: IRowDataItem) => {
                const { editGoodsList, allCatagoryList } = this.props;
                const index = editGoodsList.findIndex(item => row.productId === item.productId);
                const currentEditGoods = editGoodsList[index];
                let catagoryList: ICategoryItem[] = [];
                if (currentEditGoods) {
                    const { firstCatagory, secondCatagory } = currentEditGoods;
                    catagoryList = this.props.getCurrentCatagory(firstCatagory.id, secondCatagory.id);
                }
                return {
                    children: index > -1 ? (
                        <Select 
                            className=""
                            value={currentEditGoods.thirdCatagory.id + ''}
                            onChange={(val: string) => this.props.changeEditGoodsList(row.productId, 'thirdCatagory', val)}
                        >
                             <Option value="-1">请选择</Option>
                            {
                                catagoryList.map(item => (
                                    <Option key={item.id + ''} value={item.id + ''}>{item.name}</Option>
                                ))
                            }
                        </Select>
                    ) : (<div>{value.name}</div>),
                    props: {
                        rowSpan: row._rowspan || 0
                    }
                }
            }
        },
        {
            key: 'skuNumber',
            title: 'sku数量',
            dataIndex: 'skuNumber',
            align: 'center',
            width: 100,
            render: this.mergeCell
        },
        {
            key: 'scmSkuSn',
            title: '中台sku sn',
            dataIndex: 'scmSkuSn',
            align: 'center',
            width: 120
        },
        {
            key: 'scmSkuStyle',
            title: '规格',
            dataIndex: 'scmSkuStyle',
            align: 'center',
            width: 120,
            render: (value: IScmSkuStyle, row: IRowDataItem, index: number) => {
                return (
                    <>
                        {
                           value.size ? <div>Size: {value.size}</div> : null}
                        {
                           value.color ? <div>Color: {value.color}</div> : null}
                    </>
                )
            }
        },
        {
            key: 'scmSkuPrice',
            title: '价格',
            dataIndex: 'scmSkuPrice',
            align: 'center',
            width: 100
        },
        {
            key: 'scmSkuShoppingFee',
            title: '运费',
            dataIndex: 'scmSkuShoppingFee',
            align: 'center',
            width: 100
        },
        {
            key: 'scmSkuWeight',
            title: '重量',
            dataIndex: 'scmSkuWeight',
            align: 'center',
            width: 100,
            // render: (value: string, row: IRowDataItem, index: number) => {
            //     return <Input value={value}/>
            // }
        },
        {
            key: 'scmSkuInventory',
            title: '库存',
            dataIndex: 'scmSkuInventory',
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
            key: 'salesVolume',
            title: '销量',
            dataIndex: 'salesVolume',
            align: 'center',
            width: 100,
            render: this.mergeCell
        },
        {
            key: 'comments',
            title: '评价数量',
            dataIndex: 'comments',
            align: 'center',
            width: 100,
            render: this.mergeCell
        },
        {
            key: 'brand',
            title: '品牌',
            dataIndex: 'brand',
            align: 'center',
            width: 100,
            render: this.mergeCell
        },
        {
            key: 'storeId',
            title: '店铺 id',
            dataIndex: 'storeId',
            align: 'center',
            width: 100,
            render: this.mergeCell
        },
        {
            key: 'storeName',
            title: '店铺名称',
            dataIndex: 'storeName',
            align: 'center',
            width: 100,
            render: this.mergeCell
        },
        {
            key: 'wormTaskId',
            title: '爬虫任务 id',
            dataIndex: 'wormTaskId',
            align: 'center',
            width: 100,
            render: this.mergeCell
        },
        {
            key: 'wormGoodsId',
            title: '爬虫商品ID',
            dataIndex: 'wormGoodsId',
            align: 'center',
            width: 100,
            render: this.mergeCell
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
            key: 'onSaleInfo',
            title: '上架渠道',
            dataIndex: 'onSaleInfo',
            align: 'center',
            width: 100,
            render: (value: ISaleItem[], row: IRowDataItem, index: number) => {
                return {
                    children: (
                        <Button type="link" onClick={() => this.props.searchGoodsSale(row.productId)}>
                            {
                                value.map((item: ISaleItem) => item.onSaleChannel).join('、')
                            }
                        </Button>
                    ),
                    props: {
                        rowSpan: row._rowspan || 0
                    }
                };
            }
        },
        {
            key: 'wormTime',
            title: '更新时间',
            dataIndex: 'wormTime',
            align: 'center',
            width: 100,
            render: this.mergeCell
        },

        {
            key: 'wormGoodsInfoLink',
            title: '链接',
            dataIndex: 'wormGoodsInfoLink',
            align: 'center',
            width: 100,
            render: this.mergeCell
        }
    ];

    // 取消全选
    cancelCheckAll = () => {
        this.setState({
            indeterminate: false,
            checkAll: false
        })
    }

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
            checkAll: checked
        });
        this.props.changeSelectedRowKeys(checked ? [...rowKeys] : []);
    }

    // 选择商品行
    private selectedRow = (id: string) => {
        // console.log('selectedRow', id);
        const { selectedRowKeys, rowKeys } = this.props;
        const copySelectedRowKeys = [...selectedRowKeys];
        const index = copySelectedRowKeys.indexOf(id);
        if ( index === -1 ) {
            copySelectedRowKeys.push(id);
        } else {
            copySelectedRowKeys.splice(index, 1);
        }
        const len = copySelectedRowKeys.length;
        this.setState({
            indeterminate: len > 0 && len !== rowKeys.length,
            checkAll: len === rowKeys.length
        })
        this.props.changeSelectedRowKeys(copySelectedRowKeys);
    }

    // 图片编辑
    private clickImgEdit = (imgList: string[], productId: string) => {
        // console.log('clickImgEdit', rowData);
        this.props.toggleImgEditDialog(true, imgList, productId);
    }

    // 合并单元格
    private mergeCell(value: string, row: IRowDataItem, index: number) {
        return {
            children: value,
            props: {
                rowSpan: row._rowspan || 0
            }
        };
    }

    render() {
        const { goodsList, searchLoading } = this.props;
        return (
            <Table
                bordered={true}
                rowKey="scmSkuSn"
                className="goods-local-table"
                columns={this.columns}
                dataSource={goodsList}
                scroll={{ x: true }}
                pagination={false}
                loading={searchLoading}
            />
        )
    }
}

export default GoodsTable;

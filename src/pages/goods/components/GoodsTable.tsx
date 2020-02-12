
import React from 'react';
import { Table, Checkbox, Button, message } from 'antd';
import ZoomImage from '@/components/ZoomImage';
import EditableCell from './EditableCell';

// import { cloneDeep } from 'lodash';
// import { BindAll } from 'lodash-decorators';
import { ColumnProps } from 'antd/es/table';
import { CheckboxChangeEvent } from 'antd/lib/checkbox'
import { IRowDataItem, ISaleItem, IScmSkuStyle } from '../local';
import {
    putGoodsEdit
} from '@/services/goods';

declare interface IGoodsTableProps {
    searchLoading: boolean;
    goodsList: IRowDataItem[];
    selectedRowKeys: string[];
    rowKeys: string[];
    collapseGoods(parentId: string, status: boolean): void;
    toggleImgEditDialog(status: boolean, imgList?: string[], productId?: string): void;
    changeSelectedRowKeys(rowKeys: string[]): void;
    changeGoodsList(productId: string, type: 'title' | 'desc', text: string): void;
    searchGoodsSale(productId: string): void;
}

declare interface IGoodsTableState {
    indeterminate: boolean;
    checkAll: boolean;
}

// @BindAll()
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
            render: (value: string, row: IRowDataItem, index: number) => {
                // console.log('1111', row);
                // {
                //     row._isParent 
                //     ? <Button size="small" onClick={() => this.props.collapseGoods(row.parentId, !row.isCollapse)}>{row.isCollapse ? '收起' : '展开'}</Button> 
                //     : null
                // }
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
                            <ZoomImage className="goods-local-img" src={row.goodsImg} />
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
            // render: this.mergeCell
            render: (value: string, row: IRowDataItem, index: number) => {
                return {
                    children: (
                        <EditableCell
                            text={row.title}
                            editGoodsInfo={(text, cb) => this.editGoodsInfo('title', row.productId, text, cb)}
                        />
                    ),
                    props: {
                        rowSpan: row._rowspan || 0
                    }
                };
            }
        },
        {
            key: 'description',
            title: '描述',
            dataIndex: 'description',
            align: 'center',
            width: 200,
            render: (value: string, row: IRowDataItem, index: number) => {
                return {
                    children: (
                        <EditableCell
                            text={row.description}
                            editGoodsInfo={(text, cb) => this.editGoodsInfo('desc', row.productId, text, cb)}
                        />
                    ),
                    props: {
                        rowSpan: row._rowspan || 0
                    }
                };
            }
        },
        
        {
            key: 'firstCatagory',
            title: '一级类目',
            dataIndex: 'firstCatagory',
            align: 'center',
            width: 100,
            render: this.mergeCell
        },
        {
            key: 'secondCatagory',
            title: '二级类目',
            dataIndex: 'secondCatagory',
            align: 'center',
            width: 100,
            render: this.mergeCell
        },
        {
            key: 'thirdCatagory',
            title: '三级类目',
            dataIndex: 'thirdCatagory',
            align: 'center',
            width: 100,
            render: this.mergeCell
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

    // 编辑标题或描述
    private editGoodsInfo = (type: 'title' | 'desc', productId: string, text: string, cb: () => void) => {
        // console.log('editGoodsInfo', productId, text);
        const data = type === 'title' ? { product_id: productId, title: text } : { product_id: productId, description: text  }
        putGoodsEdit(data).then(res => {
            // console.log('putGoodsEdit Success', res);
            cb();
            this.props.changeGoodsList(productId, type, text);
            message.success('编辑成功');
        }).catch(err => {
            // console.log('putGoodsEdit Err', err);
            message.error('编辑失败');
        })
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

    // private onSelectChange(selectedRowKeys: number[] | string[]) {
    //     this.setState({ selectedRowKeys: selectedRowKeys as number[] });
    //     console.log('onSelectChange', selectedRowKeys);
    // };

    // 控制表格隐藏行
    // private toggleRow(record: IRowDataItem) {
    //     return {
    //         hidden: record._hidden,
    //         className: '1211'
    //     }
    // }

    render() {

        // const rowSelection = {
        //     fixed: true,
        //     columnWidth: '60px',
        //     // selectedRowKeys: selectedRowKeys,
        //     onChange: this.onSelectChange,
        //     render: this.mergeCell
        // };

        const { goodsList, searchLoading } = this.props;
        // console.log('goodsList', goodsList);
        return (
            <Table
                bordered={true}
                rowKey="scmSkuSn"
                className="goods-local-table"
                // bordered={true}
                // rowSelection={rowSelection}
                columns={this.columns}
                dataSource={goodsList}
                scroll={{ x: true }}
                pagination={false}
                loading={searchLoading}
                // onRow={this.toggleRow}
            />
            
        )
    }
}

export default GoodsTable;

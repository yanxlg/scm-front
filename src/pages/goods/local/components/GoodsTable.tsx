import React, { RefObject } from 'react';
import { Table, Button } from 'antd';
import Link from 'umi/link';
import ZoomImage from '@/components/ZoomImage';
import SkuDialog from './SkuDialog';

import { ColumnProps } from 'antd/es/table';
import { IRowDataItem, ISaleItem, ICatagoryData } from '../index';

import { formatDate } from '@/utils/date';

declare interface IProps {
    searchLoading: boolean;
    selectedRowKeys: string[];
    goodsList: IRowDataItem[];
    toggleEditGoodsDialog(status: boolean, row: IRowDataItem): void;
    changeSelectedRowKeys(rowKeys: string[]): void;
    searchGoodsSale(product_id: string, saleList: ISaleItem[]): void;
}

declare interface IState {
    skuDialogStatus: boolean;
    currentRowData: IRowDataItem | null;
}
class GoodsTable extends React.PureComponent<IProps, IState> {

    private skuDialogRef: RefObject<SkuDialog> = React.createRef();

    constructor(props: IProps) {
        super(props);
        this.state = {
            skuDialogStatus: false,
            currentRowData: null
        }
    }
   
    private columns: ColumnProps<IRowDataItem>[] = [
        {
            fixed: true,
            key: 'commodity_id',
            title: 'Commodity ID',
            dataIndex: 'commodity_id',
            align: 'center',
            width: 140,
            render: (value: string, row: IRowDataItem) => {
                return (
                    <>
                        <div>{value}</div>
                        <Button
                            ghost={true}
                            size="small"
                            type="primary"
                            className="goods-local-img-edit"
                            onClick={() => this.props.toggleEditGoodsDialog(true, row)}
                        >
                            编辑
                        </Button>
                        
                    </>
                )
            },
        },
        {
            fixed: true,
            key: 'product_id',
            title: 'Product ID',
            dataIndex: 'product_id',
            align: 'center',
            width: 140,
            render: (value: string, row: IRowDataItem) => {
                return (
                    <>
                        <div className={row.hasnew_version ? 'red' : ''}>{value}</div>
                        <Link to={`/goods/local/version?id=${row.commodity_id}`}>
                            <Button
                                ghost={true}
                                size="small" 
                                type="primary"
                                className="goods-local-img-edit" 
                            >查看更多版本</Button>
                        </Link>
                    </>
                )
            },
        },
        {
            key: 'goods_status',
            title: '版本状态',
            dataIndex: 'goods_status',
            align: 'center',
            width: 110
        },
        {
            key: 'inventory_status',
            title: '销售状态',
            dataIndex: 'inventory_status',
            align: 'center',
            width: 100,
            render: (value: number) => {
                return value === 1 ? '可销售' : '不可销售';
            },
        },
        {
            key: 'goods_img',
            title: '商品图片',
            dataIndex: 'goods_img',
            align: 'center',
            width: 120,
            render: (value: string, row: IRowDataItem) => {
                return <ZoomImage className="goods-local-img" src={value} />
            },
        },
        {
            key: 'title',
            title: '商品名称',
            dataIndex: 'title',
            align: 'center',
            width: 200,
            render: (value: string, row: IRowDataItem) => {
                return <div className="text">{value}</div>;
            },
        },
        {
            key: 'first_catagory',
            title: '商品分类',
            dataIndex: 'first_catagory',
            align: 'center',
            width: 120,
            render: (value: ICatagoryData, row: IRowDataItem) => {
                const { second_catagory, third_catagory } = row;
                return <div>{third_catagory.name || second_catagory.name || value.name || ''}</div>
            }
        },
        {
            key: 'sku_number',
            title: 'sku数量',
            dataIndex: 'sku_number',
            align: 'center',
            width: 120,
            render: (value: number, row: IRowDataItem) => {
                return (
                    <>
                        <div>{value}</div>
                        <Button
                            ghost={true}
                            size="small" 
                            type="primary"
                            className="goods-local-img-edit"
                            onClick={() => this.showSkuDialog(row)} 
                        >查看sku信息</Button>
                    </>
                )
            }
        },
        {
            key: 'sku_price',
            width: 140,
            title: '爬虫价格',
            dataIndex: 'sku_price',
            align: 'center',
            render: (value: number) => {
                return `￥${value}`
            }
        },
        {
            key: 'sales_volume',
            title: '销量',
            dataIndex: 'sales_volume',
            align: 'center',
            width: 100
        },
        {
            key: 'comments',
            title: '评价数量',
            dataIndex: 'comments',
            align: 'center',
            width: 100
        },
        {
            key: 'store_id',
            title: '店铺 id',
            dataIndex: 'store_id',
            align: 'center',
            width: 110
        },
        {
            key: 'store_name',
            title: '店铺名称',
            dataIndex: 'store_name',
            align: 'center',
            width: 140
        },
        {
            key: 'worm_task_id',
            title: '爬虫任务ID',
            dataIndex: 'worm_task_id',
            align: 'center',
            width: 120
        },
        {
            key: 'worm_goods_id',
            title: '爬虫商品ID',
            dataIndex: 'worm_goods_id',
            align: 'center',
            width: 120
        },
        {
            key: 'onsale_info',
            title: '上架渠道',
            dataIndex: 'onsale_info',
            align: 'center',
            width: 100,
            render: (value: ISaleItem[], row: IRowDataItem, index: number) => {
                const channelList = [...new Set(value.map(item => item.onsale_channel))];
                return value ? (
                    <Button
                        type="link"
                        onClick={() => this.props.searchGoodsSale(row.product_id, value)}
                    >
                        {channelList.join('、')}
                    </Button>
                ) : null
            },
        },
        {
            key: 'update_time',
            title: '更新时间',
            dataIndex: 'update_time',
            align: 'center',
            width: 120,
            render: (value: number) => {
                return <div>{formatDate(new Date(value * 1000), 'yyyy-MM-dd hh:mm:ss')}</div>
            },
        },
        {
            key: 'create_time',
            title: '上传时间',
            dataIndex: 'create_time',
            align: 'center',
            width: 120,
            render: (value: number) => {
                return <div>{formatDate(new Date(value * 1000), 'yyyy-MM-dd hh:mm:ss')}</div>
            },
        },
        {
            key: 'worm_goodsinfo_link',
            title: '链接',
            dataIndex: 'worm_goodsinfo_link',
            align: 'center',
            width: 200,
            render: (value: string, row: IRowDataItem) => {
                return <a href={value} target="_blank">{value}</a>
            },
        },
    ];

    private onSelectChange = (selectedRowKeys: React.Key[]) => {
        // console.log('onSelectChange', selectedRowKeys);
        this.props.changeSelectedRowKeys(selectedRowKeys as string[]);
    }

    private showSkuDialog = (rowData: IRowDataItem) => {
        this.setState({
            currentRowData: rowData
        }, () => {
            this.toggleSkuDialog(true);
            this.skuDialogRef.current!.getSkuList(rowData.product_id, { page: 1 });
        });
    }

    private toggleSkuDialog = (status: boolean) => {
        this.setState({
            skuDialogStatus: status
        });
    }

    render() {
        const { goodsList, searchLoading, selectedRowKeys } = this.props;
        const { skuDialogStatus, currentRowData } = this.state;
        const rowSelection = {
            fixed: true,
            selectedRowKeys: selectedRowKeys,
            onChange: this.onSelectChange
        };
        return (
            <>
                <Table
                    bordered={true}
                    rowKey="product_id"
                    className="goods-local-table"
                    rowSelection={rowSelection}
                    columns={this.columns}
                    dataSource={goodsList}
                    scroll={{ x: true, y: 600 }}
                    pagination={false}
                    loading={searchLoading}
                />
                <SkuDialog
                    visible={skuDialogStatus}
                    ref={this.skuDialogRef}
                    currentRowData={currentRowData}
                    toggleSkuDialog={this.toggleSkuDialog}
                />
            </>
            
        );
    }
}

export default GoodsTable;

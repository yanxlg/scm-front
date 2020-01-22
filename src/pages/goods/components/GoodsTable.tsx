
import React from 'react';
import { Table, Checkbox, Pagination, Input, Button } from 'antd';
import ZoomImage from '@/components/ZoomImage';

import { BindAll } from 'lodash-decorators';
import { ColumnProps } from 'antd/es/table';
import { IDataItem } from '../local';

declare interface GoodsTableProps {
    goodsList: IDataItem[];
    collapseGoods(parentId: string, status: boolean): void;
}

@BindAll()
class GoodsTable extends React.PureComponent<GoodsTableProps> {

    private columns: ColumnProps<IDataItem>[] = [
        {
            key: 'x',
            title: <Checkbox />,
            // dataIndex: 'a1',
            align: 'center',
            width: 60,
            render: (value: string, row: IDataItem, index: number) => {
                return {
                    children: row.isParent ? <Checkbox /> : null,
                    props: {
                        rowSpan: row._rowspan || 0
                    }
                };
            }
        },
        {
            key: 'a1',
            title: '中台商品ID',
            dataIndex: 'a1',
            align: 'center',
            width: 120,
            render: (value: string, row: IDataItem, index: number) => {
                // console.log('1111', row);
                return {
                    children: (
                        <>
                            <div>{value}</div>
                            {
                                row.isParent 
                                ? <Button size="small" onClick={() => this.props.collapseGoods(row.parentId, !row.isCollapse)}>{row.isCollapse ? '收起' : '展开'}</Button> 
                                : null
                            }
                        </>
                    ),
                    props: {
                        rowSpan: row._rowspan || 0
                    }
                };
            }
        },
        {
            key: 'a2',
            title: '商品图片',
            dataIndex: 'a2',
            align: 'center',
            width: 100,
            render: (value: string, row: IDataItem, index: number) => {
                return {
                    children: <ZoomImage className="goods-local-img" src={row.a2} />,
                    props: {
                        rowSpan: row._rowspan || 0
                    }
                };
            }
        },
        {
            key: 'a3',
            title: '任务 id',
            dataIndex: 'a3',
            align: 'center',
            width: 100,
            render: this.mergeCell
        },
        {
            key: 'a4',
            title: '爬虫商品ID',
            dataIndex: 'a4',
            align: 'center',
            width: 100,
            render: this.mergeCell
        },
        {
            key: 'a5',
            title: '采集平台',
            dataIndex: 'a5',
            align: 'center',
            width: 100,
            render: this.mergeCell
        },
        {
            key: 'a6',
            title: '标题',
            dataIndex: 'a6',
            align: 'center',
            width: 100,
            render: this.mergeCell
        },
        {
            key: 'a7',
            title: '描述',
            dataIndex: 'a7',
            align: 'center',
            width: 100,
            render: this.mergeCell
        },
        {
            key: 'a8',
            title: 'sku数量',
            dataIndex: 'a8',
            align: 'center',
            width: 160,
            render: (value: string, row: IDataItem, index: number) => {
                return <Input value={value}/>
            }
        },
        {
            key: 'a9',
            title: '中台sku id',
            dataIndex: 'a9',
            align: 'center',
            width: 160,
            render: (value: string, row: IDataItem, index: number) => {
                return <Input value={value}/>
            }
        },
        {
            key: 'a10',
            title: '规格',
            dataIndex: 'a10',
            align: 'center',
            width: 100,
            render: (value: string, row: IDataItem, index: number) => {
                return <Input value={value}/>
            }
        },
        {
            key: 'a11',
            title: '价格',
            dataIndex: 'a11',
            align: 'center',
            width: 100,
            render: (value: string, row: IDataItem, index: number) => {
                return <Input value={value}/>
            }
        },
        {
            key: 'a12',
            title: '重量',
            dataIndex: 'a12',
            align: 'center',
            width: 100,
            render: (value: string, row: IDataItem, index: number) => {
                return <Input value={value}/>
            }
        },
        {
            key: 'a13',
            title: '库存',
            dataIndex: 'a13',
            align: 'center',
            width: 100,
            render: this.mergeCell
        },   
        {
            key: 'a14',
            title: '发货时间',
            dataIndex: 'a14',
            align: 'center',
            width: 100,
            render: this.mergeCell
        },
        {
            key: 'a15',
            title: '运费',
            dataIndex: 'a15',
            align: 'center',
            width: 100,
            render: this.mergeCell
        },
        {
            key: 'a16',
            title: '销量',
            dataIndex: 'a16',
            align: 'center',
            width: 100,
            render: this.mergeCell
        },
        {
            key: 'a17',
            title: '评价数量',
            dataIndex: 'a17',
            align: 'center',
            width: 100,
            render: this.mergeCell
        },{
            key: 'a18',
            title: '一级类目',
            dataIndex: 'a18',
            align: 'center',
            width: 100,
            render: this.mergeCell
        },
        {
            key: 'a19',
            title: '二级类目',
            dataIndex: 'a19',
            align: 'center',
            width: 100,
            render: this.mergeCell
        },
        {
            key: 'a20',
            title: '品牌',
            dataIndex: 'a20',
            align: 'center',
            width: 100,
            render: this.mergeCell
        },
        {
            key: 'a21',
            title: '店铺 id',
            dataIndex: 'a21',
            align: 'center',
            width: 100,
            render: this.mergeCell
        },
        {
            key: 'a22',
            title: '店铺名称',
            dataIndex: 'a22',
            align: 'center',
            width: 100,
            render: this.mergeCell
        },
        {
            key: 'a23',
            title: '采集时间',
            dataIndex: 'a23',
            align: 'center',
            width: 100,
            render: this.mergeCell
        },
        {
            key: 'a24',
            title: '上架状态',
            dataIndex: 'a24',
            align: 'center',
            width: 100,
            render: this.mergeCell
        },
        {
            key: 'a25',
            title: '链接',
            dataIndex: 'a25',
            align: 'center',
            width: 100,
            render: this.mergeCell
        },
        {
            key: '',
            title: '操作',
            // dataIndex: 'a25',
            align: 'center',
            width: 240,
            render: (value: string, row: IDataItem, index: number) => {
                return (
                    <>
                        <Button size="small">上架</Button>
                        <Button size="small">编辑</Button>
                        <Button size="small">版本跟踪</Button>
                    </>
                )
            }
        },
    ];

    // 合并单元格
    private mergeCell(value: string, row: IDataItem, index: number) {
        return {
            children: value,
            props: {
                rowSpan: row._rowspan || 0
            }
        };
    }

    private onSelectChange(selectedRowKeys: number[] | string[]) {
        // this.setState({ selectedRowKeys: selectedRowKeys as number[] });
    };

    

    // 控制表格隐藏行
    private toggleRow(record: IDataItem) {
        return {
            hidden: record._hidden
        }
    }

    render() {

        // const rowSelection = {
        //     fixed: true,
        //     columnWidth: '60px',
        //     // selectedRowKeys: selectedRowKeys,
        //     onChange: this.onSelectChange,
        //     render: this.mergeCell
        // };

        const { goodsList } = this.props;
        // console.log('goodsList', goodsList);
        return (
            <>
                <Pagination
                    className="goods-local-pagination"
                    total={500} 
                    showSizeChanger={true} 
                    showQuickJumper={true} 
                />
                <Table
                    bordered={true}
                    // rowKey="order_goods_sn"
                    className="goods-local-table"
                    // bordered={true}
                    // rowSelection={rowSelection}
                    columns={this.columns}
                    dataSource={goodsList}
                    scroll={{ x: true }}
                    pagination={false}
                    // loading={dataLoading}
                    onRow={this.toggleRow}
                />
            </>
            
        )
    }
}

export default GoodsTable;

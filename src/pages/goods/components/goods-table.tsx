
import React from 'react';
import { Table, Checkbox, Pagination, Input } from 'antd';
import { BindAll } from 'lodash-decorators';
import { ColumnProps } from 'antd/es/table';
import { IDataItem } from '../local';

declare interface GoodsTableProps {
    goodsList: IDataItem[];
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
                    children: <Checkbox />,
                    props: {
                        rowSpan: row._rowspan || 0
                    }
                };
            }
        },
        {
            key: 'a1',
            title: 'ID',
            dataIndex: 'a1',
            align: 'center',
            width: 80,
            render: this.mergeCell
        },
        {
            key: 'a2',
            title: '商品图片',
            dataIndex: 'a2',
            align: 'center',
            width: 100,
            render: this.mergeCell
        },
        {
            key: 'a3',
            title: 'Goods id',
            dataIndex: 'a3',
            align: 'center',
            width: 100,
            render: this.mergeCell
        },
        {
            key: 'a4',
            title: '任务 id',
            dataIndex: 'a4',
            align: 'center',
            width: 100,
            render: this.mergeCell
        },
        {
            key: 'a5',
            title: '标题',
            dataIndex: 'a5',
            align: 'center',
            width: 100,
            render: this.mergeCell
        },
        {
            key: 'a6',
            title: '描述',
            dataIndex: 'a6',
            align: 'center',
            width: 100,
            render: this.mergeCell
        },
        {
            key: 'a7',
            title: 'sku数量',
            dataIndex: 'a7',
            align: 'center',
            width: 100,
            render: this.mergeCell
        },
        {
            key: 'a8',
            title: '子sku id',
            dataIndex: 'a8',
            align: 'center',
            width: 160,
            render: (value: string, row: IDataItem, index: number) => {
                return <Input value={value}/>
            }
        },
        {
            key: 'a9',
            title: '规格',
            dataIndex: 'a9',
            align: 'center',
            width: 160,
            render: (value: string, row: IDataItem, index: number) => {
                return <Input value={value}/>
            }
        },
        {
            key: 'a10',
            title: '价格',
            dataIndex: 'a10',
            align: 'center',
            width: 100,
            render: (value: string, row: IDataItem, index: number) => {
                return <Input value={value}/>
            }
        },
        {
            key: 'a11',
            title: '重量',
            dataIndex: 'a11',
            align: 'center',
            width: 100,
            render: (value: string, row: IDataItem, index: number) => {
                return <Input value={value}/>
            }
        },
        {
            key: 'a12',
            title: '库存',
            dataIndex: 'a12',
            align: 'center',
            width: 100,
            render: (value: string, row: IDataItem, index: number) => {
                return <Input value={value}/>
            }
        },
        {
            key: 'a13',
            title: '销量',
            dataIndex: 'a13',
            align: 'center',
            width: 100,
            render: this.mergeCell
        },
        {
            key: 'a14',
            title: '评价数量',
            dataIndex: 'a14',
            align: 'center',
            width: 100,
            render: this.mergeCell
        },
        {
            key: 'a15',
            title: '一级类目',
            dataIndex: 'a15',
            align: 'center',
            width: 100,
            render: this.mergeCell
        },
        {
            key: 'a16',
            title: '二级类目',
            dataIndex: 'a16',
            align: 'center',
            width: 100,
            render: this.mergeCell
        },
        {
            key: 'a17',
            title: '店铺 id',
            dataIndex: 'a17',
            align: 'center',
            width: 100,
            render: this.mergeCell
        },{
            key: 'a18',
            title: '店铺名称',
            dataIndex: 'a18',
            align: 'center',
            width: 100,
            render: this.mergeCell
        },
        {
            key: 'a19',
            title: '采集时间',
            dataIndex: 'a19',
            align: 'center',
            width: 100,
            render: this.mergeCell
        },
        {
            key: 'a20',
            title: '上架状态',
            dataIndex: 'a20',
            align: 'center',
            width: 100,
            render: this.mergeCell
        },
        {
            key: 'a21',
            title: '链接',
            dataIndex: 'a21',
            align: 'center',
            width: 100,
            render: this.mergeCell
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

    render() {

        // const rowSelection = {
        //     fixed: true,
        //     columnWidth: '60px',
        //     // selectedRowKeys: selectedRowKeys,
        //     onChange: this.onSelectChange,
        //     render: this.mergeCell
        // };

        const { goodsList } = this.props;

        return (
            <>
                <Pagination
                    className="goods-pagination"
                    total={500} 
                    showSizeChanger={true} 
                    showQuickJumper={true} 
                />
                <Table
                    // rowKey="order_goods_sn"
                    className="goods-table"
                    // bordered={true}
                    // rowSelection={rowSelection}
                    columns={this.columns}
                    dataSource={goodsList}
                    scroll={{ x: true }}
                    pagination={false}
                    // loading={dataLoading}
                    bordered={true}
                />
            </>
            
        )
    }
}

export default GoodsTable;

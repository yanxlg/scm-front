import React from 'react';
import { DatePicker, Button, Pagination, Table } from 'antd';
import { ColumnProps } from 'antd/es/table';

import VersionImgDialog from './VersionImgDialog';

import {
    getGoodsVersionList
} from '@/services/goods';

const { RangePicker } = DatePicker;

declare interface IDataItem {
    [key: string]: any;
}

declare interface VersionTableState {
    goodsList: IDataItem[];
    versionImgDialogStatus: boolean;
}

class VersionTable extends React.PureComponent<{}, VersionTableState> {

    private columns: ColumnProps<IDataItem>[] = [
        {
            key: 'a1',
            width: 120,
            title: '商品图片',
            dataIndex: 'a1',
            align: 'center',
            render: (value: string, row: IDataItem, index: number) => {
                const children = (
                    <div>
                        <img src={value}/>
                        <Button type="link" block={true}>查看详情</Button>
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
            key: 'a2',
            width: 200,
            title: '商品标题',
            dataIndex: 'a2',
            align: 'center',
            render: this.mergeCell
        },
        {
            key: 'a3',
            width: 200,
            title: '商品描述',
            dataIndex: 'a3',
            align: 'center',
            render: this.mergeCell
        },
        {
            key: 'a4',
            width: 120,
            title: '中台 sku id',
            dataIndex: 'a4',
            align: 'center',
        },
        {
            key: 'a5',
            width: 120,
            title: '源sku id',
            dataIndex: 'a5',
            align: 'center',
        },
        {
            key: 'a6',
            width: 140,
            title: '规格',
            dataIndex: 'a6',
            align: 'center',
            render: (value: string, row: IDataItem, index: number) => {
                return (
                    <div className="border text-left">
                        <div className="nowrap">Size: M</div>
                        <div className="nowrap">Color: Blue</div>
                    </div>
                )
            }
        },
        {
            key: 'a7',
            width: 120,
            title: '价格',
            dataIndex: 'a7',
            align: 'center',
            render: this.borderCell
        },
        {
            key: 'a8',
            width: 120,
            title: '价格变化',
            dataIndex: 'a8',
            align: 'center',
            render: this.borderCell
        },
        {
            key: 'a9',
            width: 120,
            title: '重量',
            dataIndex: 'a9',
            align: 'center',
            render: this.borderCell
        },
        {
            key: 'a10',
            width: 120,
            title: '库存',
            dataIndex: 'a10',
            align: 'center',
            render: this.borderCell
        },
        {
            key: 'a11',
            width: 120,
            title: '发货时间',
            dataIndex: 'a11',
            align: 'center',
            render: this.borderCell
        },
        {
            key: 'a12',
            width: 120,
            title: '运费',
            dataIndex: 'a12',
            align: 'center',
            render: this.borderCell
        },
        {
            key: 'a13',
            width: 120,
            title: '销量',
            dataIndex: 'a13',
            align: 'center',
            render: this.borderCell
        },
        {
            key: 'a14',
            width: 120,
            title: '评价数量',
            dataIndex: 'a14',
            align: 'center',
            render: this.borderCell
        },
        {
            key: 'a15',
            width: 120,
            title: '一级类目',
            dataIndex: 'a15',
            align: 'center',
            render: this.borderCell
        },
        {
            key: 'a16',
            width: 120,
            title: '二级类目',
            dataIndex: 'a16',
            align: 'center',
            render: this.borderCell
        },
        {
            key: 'a17',
            width: 120,
            title: '变更时间',
            dataIndex: 'a17',
            align: 'center',
            render: this.mergeAndBorderCell
        },
        {
            key: 'a18',
            width: 120,
            title: '变更人',
            dataIndex: 'a18',
            align: 'center',
            render: this.mergeAndBorderCell
        },
        {
            key: 'a19',
            width: 120,
            title: '商品版本号',
            dataIndex: 'a19',
            align: 'center',
            render: this.mergeAndBorderCell
        }
    ]

    constructor(props: {}) {
        super(props);
        this.state = {
            goodsList: [],
            versionImgDialogStatus: true,
        }
    }

    componentDidMount(): void {
        this.onSearch();
        // console.log(this.props);
    }

    // 合并单元格
    private mergeCell(value: string, row: IDataItem, index: number) {
        return {
            children: value,
            props: {
                rowSpan: row._rowspan || 0
            }
        };
    }

    // 表格内容展示加边框
    private borderCell(value: string, row: IDataItem, index: number) {
        return (
            <div className="border">
                <div className="nowrap">{value}</div>
            </div>
        )
    }

    // 合并单元格和展示边框
    private mergeAndBorderCell(value: string, row: IDataItem, index: number) {
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

    // 处理表格数据，用于合并单元格
    private addRowSpanData(list: IDataItem[]): IDataItem[] {
        let ret: IDataItem[] = [];
        let goodsId: string | number = 0;
        for (let i = 0, len = list.length; i < len; i++) {
            let currentItem = list[i];
            if (goodsId !== currentItem.id) {
                goodsId = currentItem.id;
                currentItem._rowspan = list.filter(item => item.id === goodsId).length;
            }
            ret.push(currentItem);
        }
        return ret;
    }

    private onSearch = () => {
        return getGoodsVersionList({
            page: 1,
            size: 3
        }).then((res) => {
            // console.log(res)
            const { list } = res.data;
            this.setState({
                goodsList: this.addRowSpanData(list)
            });
        }).finally(() => {
            // this.setState({
            //     dataLoading: false,
            //     searchLoading:false
            // });
        });
    }

    private toggleVersionImgDialog = (status: boolean) => {
        this.setState({
            versionImgDialogStatus: status
        });
    }

    render() {

        const { goodsList, versionImgDialogStatus } = this.state;

        return (
            <>
                <div className="goods-version-filter">
                    <div className="left-item">
                        <span className="">商品调价跟踪</span>
                        <RangePicker className="date"/>
                        <Button>导出至Excel</Button>
                    </div>
                    <Pagination size="small" total={50} showSizeChanger={true} showQuickJumper={true} />
                </div>
                <Table
                    bordered={true}
                    // rowKey='id'
                    className="goods-version-table"
                    scroll={{ x: true }}
                    pagination={false}
                    columns={this.columns}
                    dataSource={goodsList}
                />
                <VersionImgDialog
                    visible={versionImgDialogStatus}
                    toggleVersionImgDialog={this.toggleVersionImgDialog}
                />
            </>
        )
    }
}

export default VersionTable;

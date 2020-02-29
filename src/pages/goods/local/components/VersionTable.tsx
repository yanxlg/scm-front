import React from 'react';
import { Button, Table } from 'antd';
import { ColumnProps } from 'antd/es/table';
import { IGoodsVersionRowItem, ISkuStyle, IOnsaleItem, ICatagoryData } from '../version';

import VersionImgDialog from './VersionImgDialog';
import { formatDate } from '@/utils/date';

declare interface IVersionTableProps {
    loading: boolean;
    versionGoodsList: IGoodsVersionRowItem[];
    operationVersion(product_id: string, type: string): void;
}

declare interface VersionTableState {
    versionImgDialogStatus: boolean;
    activeRow: IGoodsVersionRowItem | null;
}

class VersionTable extends React.PureComponent<IVersionTableProps, VersionTableState> {
    private columns: ColumnProps<IGoodsVersionRowItem>[] = [
        {
            key: 'goods_status',
            width: 160,
            title: '操作',
            dataIndex: 'goods_status',
            align: 'center',
            render: (value: string, row: IGoodsVersionRowItem) => {
                const { operationVersion } = this.props;
                let children = null;
                // UPDATED RELEASED INITIALIZED updated
                if (value !== 'RELEASED') {
                    children = (
                        <Button
                            className="btn"
                            type="primary"
                            size="small"
                            onClick={() => operationVersion(row.product_id, 'apply')}
                        >
                            应用
                        </Button>
                    );
                } else {
                    children = (
                        <Button ghost={true} className="btn" type="primary" size="small">
                            当前版本
                        </Button>
                    );
                }
                return {
                    children,
                    props: {
                        rowSpan: row._rowspan || 0,
                    },
                };
            },
        },
        {
            key: 'product_id',
            width: 140,
            title: 'Product ID',
            dataIndex: 'product_id',
            align: 'center',
            render: this.mergeCell,
        },
        {
            key: 'onsale_info',
            width: 100,
            title: '上架渠道',
            dataIndex: 'onsale_info',
            align: 'center',
            render: (value: IOnsaleItem[], row: IGoodsVersionRowItem) => {
                return {
                    children: <div>{value.map(item => item.onsale_channel).join('、')}</div>,
                    props: {
                        rowSpan: row._rowspan || 0,
                    },
                };
            },
        },
        {
            key: 'sku_image',
            width: 120,
            title: '商品图片',
            dataIndex: 'sku_image',
            align: 'center',
            render: (value: string[], row: IGoodsVersionRowItem) => {
                // let isChange = false;
                // if (row._prevVersion) {
                //     const prevImgList = row._prevVersion.sku_image;
                //     if (value.length !== prevImgList.length) {
                //         isChange = true;
                //     } else {
                //         value.forEach((item, index) => {
                //             if (item !== prevImgList[index]) {
                //                 isChange = true;
                //             }
                //         });
                //     }
                // }
                const children = (
                    <div>
                        <img src={value[0]} />
                        <Button
                            type="link"
                            // className={isChange ? 'red' : ''}
                            block={true}
                            onClick={() => this.showImgs(row)}
                        >
                            查看详情
                        </Button>
                    </div>
                );
                return {
                    children,
                    props: {
                        rowSpan: row._rowspan || 0,
                    },
                };
            },
        },
        {
            key: 'title',
            width: 200,
            title: '商品标题',
            dataIndex: 'title',
            align: 'center',
            render: (value: string, row: IGoodsVersionRowItem) => {
                // let children = null;
                // if (row._prevVersion) {
                //     if (row._prevVersion.title === value) {
                //         children = <div className="text-left">原标题: {value}</div>;
                //     } else {
                //         children = (
                //             <>
                //                 <div className="text-left">
                //                     原标题: {row._prevVersion.title}
                //                 </div>
                //                 <div className="text-left red">新标题: {value}</div>
                //             </>
                //         );
                //     }
                // } else {
                //     children = <div className="text-left red">新标题: {value}</div>;
                // }
                // className="text-left"
                return {
                    children: <div>{value}</div>,
                    props: {
                        rowSpan: row._rowspan || 0,
                    },
                };
            },
        },
        {
            key: 'description',
            width: 200,
            title: '商品描述',
            dataIndex: 'description',
            align: 'center',
            render: (value: string, row: IGoodsVersionRowItem) => {
                // let children = null;
                // if (row._prevVersion) {
                //     if (row._prevVersion.description === value) {
                //         children = <div className="text-left">原描述: {value}</div>;
                //     } else {
                //         children = (
                //             <>
                //                 <div className="text-left">
                //                     原描述: {row._prevVersion.description}
                //                 </div>
                //                 <div className="text-left red">新描述: {value}</div>
                //             </>
                //         );
                //     }
                // } else {
                //     children = <div className="text-left red">新描述: {value}</div>;
                // }
                //  className="text-left red"
                return {
                    children: <div>{value}</div>,
                    props: {
                        rowSpan: row._rowspan || 0,
                    },
                };
            },
        },
        {
            key: 'sku_id',
            width: 140,
            title: '中台sku ID',
            dataIndex: 'sku_id',
            align: 'center',
        },
        {
            key: 'origin_sku_id',
            width: 130,
            title: '源sku ID',
            dataIndex: 'origin_sku_id',
            align: 'center',
        },
        {
            key: 'sku_style',
            width: 140,
            title: '规格',
            dataIndex: 'sku_style',
            align: 'center',
            render: (value: ISkuStyle, row: IGoodsVersionRowItem) => {
                return (
                    // className="border text-left"
                    <div>
                        {Object.keys(value).map(item => (
                            <div key={item}>
                                {item}: {value[item]}
                            </div>
                        ))}
                        {/* <div className="nowrap">{value.split(',')}</div> */}
                    </div>
                );
            },
        },
        {
            key: 'sku_price',
            width: 140,
            title: '价格',
            dataIndex: 'sku_price',
            align: 'center',
            // render: (value: number, row: IGoodsVersionRowItem) =>
            //     this.compareVersion(value, row, 'sku_price', '价格'),
        },
        // {
        //     key: 'price1',
        //     width: 120,
        //     title: '价格变化',
        //     // dataIndex: 'price',
        //     align: 'center',
        //     render: (a1, row: IGoodsVersionRowItem) => {
        //         const value = row.sku_price;
        //         let children = null;
        //         if (row._prevVersion && row._prevVersion.sku_price != value) {
        //             const prevPrice = row._prevVersion.sku_price;
        //             const num = value - prevPrice;
        //             //
        //             children = (
        //                 <div>
        //                     <span className="red">{num > 0 ? '↑' : '↓'}</span>{' '}
        //                     {Math.abs(prevPrice - value)}
        //                 </div>
        //             );
        //         } else {
        //             children = <div>-</div>;
        //         }
        //         return <div className="border">{children}</div>;
        //     },
        // },
        {
            key: 'sku_weight',
            width: 120,
            title: '重量',
            dataIndex: 'sku_weight',
            align: 'center',
            // render: (value: number, row: IGoodsVersionRowItem) =>
            //     this.compareVersion(value, row, 'sku_weight', '重量'),
        },
        {
            key: 'sku_inventory',
            width: 120,
            title: '库存',
            dataIndex: 'sku_inventory',
            align: 'center',
            // render: (value: number, row: IGoodsVersionRowItem) =>
            //     this.compareVersion(value, row, 'sku_inventory', '库存'),
        },
        {
            key: 'sales_volume',
            width: 120,
            title: '销量',
            dataIndex: 'sales_volume',
            align: 'center',
            // render: (value: number, row: IGoodsVersionRowItem) =>
            //     this.compareVersion(value, row, 'sales_volume', '销量', true),
            render: (value: string, row: IGoodsVersionRowItem) => {
                return {
                    children: <div>{value}</div>,
                    props: {
                        rowSpan: row._rowspan || 0,
                    },
                };
            },
        },
        {
            key: 'comments',
            width: 160,
            title: '评价数量',
            dataIndex: 'comments',
            align: 'center',
            // render: (value: number, row: IGoodsVersionRowItem) =>
            //     this.compareVersion(value, row, 'comments', '评论数', true),
            render: (value: string, row: IGoodsVersionRowItem) => {
                return {
                    children: <div>{value}</div>,
                    props: {
                        rowSpan: row._rowspan || 0,
                    },
                };
            },
        },
        {
            key: 'first_catagory',
            width: 120,
            title: '一级类目',
            dataIndex: 'first_catagory',
            align: 'center',
            // render: (value: ICatagoryData, row: IGoodsVersionRowItem) =>
            //     this.compareCatagory(value, row, 'first_catagory', '类目', true),
            render: (value: ICatagoryData, row: IGoodsVersionRowItem) => {
                return {
                    children: <div>{value.name}</div>,
                    props: {
                        rowSpan: row._rowspan || 0,
                    },
                };
            },
        },
        {
            key: 'second_catagory',
            width: 120,
            title: '二级类目',
            dataIndex: 'second_catagory',
            align: 'center',
            // render: (value: ICatagoryData, row: IGoodsVersionRowItem) =>
            //     this.compareCatagory(value, row, 'second_catagory', '类目', true),
            render: (value: ICatagoryData, row: IGoodsVersionRowItem) => {
                return {
                    children: <div>{value.name}</div>,
                    props: {
                        rowSpan: row._rowspan || 0,
                    },
                };
            },
        },
        {
            key: 'third_catagory',
            width: 120,
            title: '三级类目',
            dataIndex: 'third_catagory',
            align: 'center',
            // render: (value: ICatagoryData, row: IGoodsVersionRowItem) =>
            //     this.compareCatagory(value, row, 'third_catagory', '类目', true),
            render: (value: ICatagoryData, row: IGoodsVersionRowItem) => {
                return {
                    children: <div>{value.name}</div>,
                    props: {
                        rowSpan: row._rowspan || 0,
                    },
                };
            },
        },
        {
            key: '_update_time',
            width: 180,
            title: '变更时间',
            dataIndex: '_update_time',
            align: 'center',
            render: (value: string, row: IGoodsVersionRowItem) => {
                return {
                    // children: (
                    //     <div className="border">
                    //         <div className="nowrap">{value}</div>
                    //     </div>
                    // ),
                    children: <div>{value}</div>,
                    props: {
                        rowSpan: row._rowspan || 0,
                    },
                };
            },
        },
    ];

    constructor(props: IVersionTableProps) {
        super(props);
        this.state = {
            versionImgDialogStatus: false,
            activeRow: null,
        };
    }

    // 版本数据对比
    // private compareVersion = (
    //     value: number | string,
    //     row: IGoodsVersionRowItem,
    //     key: string,
    //     desc: string,
    //     isMerge?: boolean
    // ) => {
    //     let children = null;
    //     if (row._prevVersion) {
    //         const prevValue = row._prevVersion[key as 'sku_price'];
    //         if (prevValue === value) {
    //             children = (
    //                 <div>
    //                     原{desc}: {value}
    //                 </div>
    //             );
    //         } else {
    //             children = (
    //                 <>
    //                     <div>
    //                         原{desc}: {prevValue}
    //                     </div>
    //                     <div className="red">
    //                         新{desc}: {value}
    //                     </div>
    //                 </>
    //             );
    //         }
    //     } else {
    //         children = (
    //             <div className="red">
    //                 新{desc}: {value}
    //             </div>
    //         );
    //     }
    //     return {
    //         children: <div className="border text-left">{children}</div>,
    //         props: {
    //             rowSpan: isMerge ? (row._rowspan || 0) : 1
    //         },
    //     };
    // };

    // 类目数据对比
    // private compareCatagory = (
    //     value: ICatagoryData,
    //     row: IGoodsVersionRowItem,
    //     key: string,
    //     desc: string,
    //     isMerge?: boolean
    // ) => {
    //     let children = null;
    //     if (row._prevVersion) {
    //         const prevValue = row._prevVersion[key as 'first_catagory'];
    //         if (prevValue.id === value.id) {
    //             children = (
    //                 <div>
    //                     原{desc}: {value.name}
    //                 </div>
    //             );
    //         } else {
    //             children = (
    //                 <>
    //                     <div>
    //                         原{desc}: {prevValue.name}
    //                     </div>
    //                     <div className="red">
    //                         新{desc}: {value.name}
    //                     </div>
    //                 </>
    //             );
    //         }
    //     } else {
    //         children = (
    //             <div className="red">
    //                 新{desc}: {value.name}
    //             </div>
    //         );
    //     }
    //     return {
    //         children: <div className="border text-left">{children}</div>,
    //         props: {
    //             rowSpan: isMerge ? (row._rowspan || 0) : 1
    //         },
    //     };
    // };

    // 展示图片弹框
    showImgs = (rowData: IGoodsVersionRowItem) => {
        // console.log('showImgs', rowData);
        this.setState(
            {
                activeRow: rowData,
            },
            () => {
                this.toggleVersionImgDialog(true);
            },
        );
    };

    // 合并单元格
    private mergeCell(value: string, row: IGoodsVersionRowItem, index: number) {
        return {
            children: value,
            props: {
                rowSpan: row._rowspan || 0,
            },
        };
    }

    private toggleVersionImgDialog = (status: boolean) => {
        this.setState({
            versionImgDialogStatus: status,
        });
    };

    render() {
        const { versionGoodsList, loading } = this.props;
        const { versionImgDialogStatus, activeRow } = this.state;

        return (
            <>
                <Table
                    bordered={true}
                    rowKey="sku_id"
                    className="goods-version-table"
                    loading={loading}
                    scroll={{ x: true, y: 600 }}
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
        );
    }
}

export default VersionTable;

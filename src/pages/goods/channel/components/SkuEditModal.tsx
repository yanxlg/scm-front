import React from 'react';
import { Modal, Table, Pagination, Skeleton, Input, InputNumber } from 'antd';
import { ColumnProps } from 'antd/es/table';

// import { getGoodsSkuList } from '@/services/goods';

const { TextArea } = Input;

declare interface ISkuStyle {
    [key: string]: string;
}

declare interface ISkuItem {
    serial: number;
    sku_id: string;
    sku_style: ISkuStyle;
    sku_price: number;
    sku_fee: number;
    sku_sale_price: number;
    comment: string;
}

declare interface IEditPriceItem {
    sku_id: string;
    sku_sale_price: number | undefined;
    comment: string;
}

declare interface IPageData {
    page?: number;
    page_count?: number;
}

declare interface IGoodsDetail {
    [key: string]: any;
}

declare interface IState {
    visible: boolean;
    loading: boolean;
    page: number;
    allCount: number;
    productId: string;
    skuList: ISkuItem[];
    goodsDetail: IGoodsDetail | null;
    editList: IEditPriceItem[];
}

class SkuDialog extends React.PureComponent<{}, IState> {
    private columns: ColumnProps<ISkuItem>[] = [
        {
            key: 'serial',
            title: () => `序号(${this.state.allCount})`,
            dataIndex: 'serial',
            align: 'center',
            width: 100,
        },
        {
            key: 'sku_id',
            title: '子SKU',
            dataIndex: 'sku_id',
            align: 'center',
            width: 100,
        },
        {
            key: 'sku_style',
            title: '规格',
            dataIndex: 'sku_style',
            align: 'center',
            width: 160,
            render: (value: ISkuStyle) => {
                return Object.keys(value).map(key => (
                    <div key={key}>
                        {key}: {value[key]}
                    </div>
                ));
            },
        },
        {
            key: 'sku_price',
            title: '价格',
            dataIndex: 'sku_price',
            align: 'center',
            width: 100,
            render: (value: string) => {
                return '￥' + value;
            },
        },
        {
            key: 'fee',
            title: '运费',
            dataIndex: 'fee',
            align: 'center',
            width: 100,
        },
        {
            key: 'sku_sale_price',
            title: '销售价格调整',
            dataIndex: 'sku_sale_price',
            align: 'center',
            width: 150,
            render: (value: number, row: ISkuItem) => {
                return (
                    <InputNumber 
                        min={0}
                        precision={2}
                        defaultValue={value}
                        style={{width: '100%'}}
                        onChange={(val) => this.changePrice(val, row)}
                    />
                )
            }
        },
        {
            key: 'comment',
            title: '销售价格调整',
            dataIndex: 'comment',
            align: 'center',
            width: 200,
            render: (value: string, row: ISkuItem) => {
                return <TextArea autoSize={true} defaultValue={value} onChange={e => this.changeComment(e.target.value, row)} />
            }
        }
    ];

    constructor(props: {}) {
        super(props);
        this.state = {
            visible: false,
            loading: false,
            productId: '',
            page: 1,
            allCount: 0,
            skuList: [
                {
                    serial: 1,
                    sku_id: '123',
                    sku_style: {
                        size: '1',
                        color: '2'
                    },
                    sku_price: 88,
                    sku_fee: 12,
                    sku_sale_price: 120,
                    comment: '太便宜'
                }
            ],
            // goodsDetail: null,
            goodsDetail: {
                goods_img: '//image-tb.vova.com/image/500_500/filler/6d/1a/2d391127928221c2a442c8b0e1f26d1a.jpg',
                title: 'title',
                desc: 'desc',
                product_id: 'product_id',
                commodity_id: 'commodity_id',
                worm_goods_id: 'worm_goods_id',
            },
            editList: []
        };
    }

    showModal = (productId: string) => {
        this.setState({
            productId,
            visible: true
        })
    }

    private handleCancel = () => {
        this.setState({
            visible: false,
            editList: []
        })
    };

    private handleOk = () => {
        // console.log('handleOk', this.state.editList);
    }

    private getSkuList = (productId: string, pageData?: IPageData) => {
        const { page } = this.state;
        let params = {
            page,
            product_id: productId,
            page_count: 50,
        };
        if (pageData) {
            params = Object.assign(params, pageData);
        }
        this.setState({
            loading: true,
        });
        // getGoodsSkuList(params)
        //     .then(res => {
        //         // console.log('getGoodsSkuList', res);
        //         const { all_count, list } = res.data;
        //         this.setState({
        //             page: params.page,
        //             allCount: all_count,
        //             skuList: list.map((item: any, index: number) => {
        //                 const { sku_id, sku_style, sku_price, sku_weight, sku_inventory } = item;
        //                 return {
        //                     serial: (params.page - 1) * 50 + index + 1,
        //                     sku_id,
        //                     sku_style,
        //                     sku_price,
        //                     sku_weight,
        //                     sku_inventory,
        //                 };
        //             }),
        //         });
        //     })
        //     .finally(() => {
        //         this.setState({
        //             loading: false,
        //         });
        //     });
    };

    private onChangePage = (page: number) => {
        // this.getSkuList(this.props.currentRowData!.product_id, {
        //     page,
        // });
    };

    private changePrice = (val: number | undefined, rowData: ISkuItem) => {
        // console.log('changePrice', val, rowData);
        const { editList } = this.state;
        const i =  editList.findIndex(item => item.sku_id === rowData.sku_id)
        if (i > -1) {
            this.setState({
                editList: editList.map((item, index: number) => {
                    if (i === index) {
                        return {
                            ...item,
                            sku_sale_price: val
                        }
                    }
                    return item;
                })
            })
        } else {
            this.setState({
                editList: [
                    ...editList,
                    {
                        sku_id: rowData.sku_id,
                        sku_sale_price: val,
                        comment: rowData.comment
                    }
                ]
            })
        }
    }

    private changeComment = (val: string, rowData: ISkuItem) => {
        // console.log('changePrice', val, rowData);
        const { editList } = this.state;
        const i =  editList.findIndex(item => item.sku_id === rowData.sku_id)
        if (i > -1) {
            this.setState({
                editList: editList.map((item, index: number) => {
                    if (i === index) {
                        return {
                            ...item,
                            comment: val
                        }
                    }
                    return item;
                })
            })
        } else {
            this.setState({
                editList: [
                    ...editList,
                    {
                        sku_id: rowData.sku_id,
                        sku_sale_price: rowData.sku_sale_price,
                        comment: val
                    }
                ]
            })
        }
    }

    render() {
        const { visible, loading, page, allCount, skuList, goodsDetail } = this.state;
        return (
            <Modal
                width={980}
                title="sku详情"
                visible={visible}
                onCancel={this.handleCancel}
                onOk={this.handleOk}
                maskClosable={false}
                // bodyStyle={{
                //     maxHeight: 600,
                //     overflow: 'auto'
                // }}
            >
                <div className="product-sku-dialog">
                    {
                        goodsDetail ? (
                            <div className="overflow-hidden">
                                <img className="goods-img" src={goodsDetail.goods_img} />
                                <div className="overflow-hidden">
                                    <div className="text item">
                                        标题：{goodsDetail.title}
                                    </div>
                                    <div className="text item">
                                        描述：{goodsDetail.desc}
                                    </div>
                                    <div className="item">
                                        <span>Product ID: {goodsDetail.product_id}</span>
                                        <span>中台商品ID：{goodsDetail.commodity_id}</span>
                                        <span>爬虫商品 id：{goodsDetail.worm_goods_id}</span>
                                    </div>
                                    <div className="item">
                                        <span>一级分类: </span>
                                        <span>二级分类：</span>
                                        <span>三级分类：</span>
                                    </div>
                                </div>
                            </div>
                        ) : <Skeleton avatar={true} active={true} paragraph={{ rows: 1 }} />
                    }
                    
                    <Table
                        bordered={true}
                        rowKey="sku_id"
                        className="table"
                        loading={loading}
                        columns={this.columns}
                        dataSource={skuList}
                        scroll={{ y: 400 }}
                        pagination={false}
                    />
                    {/* <Pagination
                        size="small"
                        total={allCount}
                        current={page}
                        defaultPageSize={50}
                        showQuickJumper={true}
                        onChange={this.onChangePage}
                        showTotal={total => `共${total}条`}
                    /> */}
                </div>
            </Modal>
        );
    }
}

export default SkuDialog;

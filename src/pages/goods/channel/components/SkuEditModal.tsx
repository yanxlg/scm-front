import React from 'react';
import { Modal, Table, Pagination, Skeleton, Input, InputNumber } from 'antd';
import { ColumnProps } from 'antd/es/table';

// import { getGoodsSkuList } from '@/services/goods';
import { queryGoodsDetail, queryGoodsSkuList } from '@/services/channel';
import { IGoodsDetailResponse, ISpecsItem, IGoodsSkuItem } from '@/interface/IChannel';

const { TextArea } = Input;

declare interface IEditPriceItem {
    sku_id: string;
    sku_sale_price: number | undefined;
    comment: string;
}

declare interface IState {
    visible: boolean;
    loading: boolean;
    page: number;
    total: number;
    productId: string;
    skuList: IGoodsSkuItem[];
    goodsDetail: IGoodsDetailResponse | null;
    editList: IEditPriceItem[];
}

class SkuDialog extends React.PureComponent<{}, IState> {
    private columns: ColumnProps<IGoodsSkuItem>[] = [
        {
            key: 'serial',
            title: () => `序号(${this.state.total})`,
            dataIndex: 'serial',
            align: 'center',
            width: 100,
        },
        {
            key: 'sku_name',
            title: '子SKU',
            dataIndex: 'sku_name',
            align: 'center',
            width: 160,
        },
        {
            key: 'specs',
            title: '规格',
            dataIndex: 'specs',
            align: 'center',
            width: 160,
            render: (value: ISpecsItem[]) => {
                return value.map(item => (
                    <div key={item.name}>
                        {item.name}: {item.value}
                    </div>
                ));
            },
        },
        {
            key: 'price',
            title: '价格',
            dataIndex: 'price',
            align: 'center',
            width: 100,
            render: (value: string) => {
                return '￥' + value;
            },
        },
        {
            key: 'shipping_fee',
            title: '运费',
            dataIndex: 'shipping_fee',
            align: 'center',
            width: 60,
        },
        {
            key: 'sku_sale_price',
            title: '销售价格调整',
            dataIndex: 'sku_sale_price',
            align: 'center',
            width: 120,
            render: (value: number, row: IGoodsSkuItem) => {
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
            width: 180,
            render: (value: string, row: IGoodsSkuItem) => {
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
            total: 0,
            skuList: [],
            goodsDetail: null,
            editList: []
        };
    }

    showModal = (productId: string) => {
        this.setState({
            productId,
            visible: true
        }, () => {
            this.queryGoodsDetail();
            this.queryGoodsSkuList(1);
        });
    }

    queryGoodsDetail = () => {
        const { productId } = this.state;
        queryGoodsDetail({
            product_id: productId,
            channel: 'vova'
        }).then(res => {
            // console.log('queryGoodsDetail', res);
            this.setState({
                goodsDetail: res.data
            });
        })
    }

    queryGoodsSkuList = (page: number) => {
        const { productId } = this.state;
        this.setState({
            loading: true
        });
        const page_count = 10;
        queryGoodsSkuList({
            page,
            page_count,
            product_id: productId,
            channel: 'vova'
        }).then(res => {
            // console.log('queryGoodsSkuList', res);
            const { total, sku_list } = res.data;
            this.setState({
                total: Number(total),
                skuList: sku_list.map((item, index: number) => {
                    return {
                        serial: (page - 1) * page_count + index + 1,
                        ...item
                    }
                })
            });
        }).finally(() => {
            this.setState({
                loading: false
            })
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

    private onChangePage = (page: number) => {
        this.queryGoodsSkuList(page);
    };

    private changePrice = (val: number | undefined, rowData: IGoodsSkuItem) => {
        // console.log('changePrice', val, rowData);
        // const { editList } = this.state;
        // const i =  editList.findIndex(item => item.sku_id === rowData.sku_id)
        // if (i > -1) {
        //     this.setState({
        //         editList: editList.map((item, index: number) => {
        //             if (i === index) {
        //                 return {
        //                     ...item,
        //                     sku_sale_price: val
        //                 }
        //             }
        //             return item;
        //         })
        //     })
        // } else {
        //     this.setState({
        //         editList: [
        //             ...editList,
        //             {
        //                 sku_id: rowData.sku_id,
        //                 sku_sale_price: val,
        //                 comment: rowData.comment
        //             }
        //         ]
        //     })
        // }
    }

    private changeComment = (val: string, rowData: IGoodsSkuItem) => {
        // console.log('changePrice', val, rowData);
        // const { editList } = this.state;
        // const i =  editList.findIndex(item => item.sku_id === rowData.sku_id)
        // if (i > -1) {
        //     this.setState({
        //         editList: editList.map((item, index: number) => {
        //             if (i === index) {
        //                 return {
        //                     ...item,
        //                     comment: val
        //                 }
        //             }
        //             return item;
        //         })
        //     })
        // } else {
        //     this.setState({
        //         editList: [
        //             ...editList,
        //             {
        //                 sku_id: rowData.sku_id,
        //                 sku_sale_price: rowData.sku_sale_price,
        //                 comment: val
        //             }
        //         ]
        //     })
        // }
    }

    render() {
        const { visible, loading, page, total, skuList, goodsDetail } = this.state;
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
                                <img className="goods-img" src={goodsDetail.main_image} />
                                <div className="overflow-hidden">
                                    <div className="text item">
                                        标题：{goodsDetail.product_name}
                                    </div>
                                    <div className="text item">
                                        描述：{goodsDetail.product_description}
                                    </div>
                                    <div className="item">
                                        <div className="desc">
                                            <span className="float-left">Product ID:</span>
                                            <div className="overflow-hidden">{goodsDetail.product_id}</div>
                                             
                                        </div>
                                        <div className="desc center">
                                            <span className="float-left">中台商品ID:</span>
                                            <div className="overflow-hidden">{goodsDetail.commodity_id}</div>
                                        </div>
                                        <div className="desc">
                                            <span className="float-left">爬虫商品 id:</span>
                                            <div className="overflow-hidden">{goodsDetail.spider_product_id}</div>
                                        </div>
                                    </div>
                                    <div className="item">
                                        <div className="desc">
                                            <span className="float-left">一级分类:</span>
                                            <div className="overflow-hidden">{goodsDetail.category_level_1}</div>
                                        </div>
                                        <div className="desc center">
                                            <span className="float-left">二级分类:</span>
                                            <div className="overflow-hidden">{goodsDetail.category_level_2}</div>
                                        </div>
                                        <div className="desc">
                                            <span className="float-left">三级分类:</span>
                                            <div className="overflow-hidden">{goodsDetail.category_level_3}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : <Skeleton avatar={true} active={true} paragraph={{ rows: 1 }} />
                    }
                    
                    <Table
                        bordered={true}
                        rowKey="sku_name"
                        className="table"
                        loading={loading}
                        columns={this.columns}
                        dataSource={skuList}
                        scroll={{ y: 400 }}
                        pagination={false}
                    />
                    <Pagination
                        size="small"
                        total={total}
                        current={page}
                        pageSize={10}
                        onChange={this.onChangePage}
                        showTotal={total => `共${total}条`}
                        style={{marginTop: 12}}
                    />
                </div>
            </Modal>
        );
    }
}

export default SkuDialog;

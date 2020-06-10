import React from 'react';
import { Modal, Table, Pagination, Skeleton, Input, InputNumber, message } from 'antd';
import { ColumnProps } from 'antd/es/table';

// import { getGoodsSkuList } from '@/services/goods';
import { queryGoodsDetail, queryGoodsSkuList, editSkuPrice } from '@/services/channel';
import {
    IGoodsDetailResponse,
    ISpecsItem,
    IGoodsSkuItem,
    IEditSkuItem,
} from '@/interface/IChannel';

const { TextArea } = Input;

declare interface IState {
    visible: boolean;
    loading: boolean;
    commodity_id: string;
    page: number;
    total: number;
    id: string;
    merchant_id: string;
    skuList: IGoodsSkuItem[];
    goodsDetail: IGoodsDetailResponse | null;
    editList: IEditSkuItem[];
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
                return '$' + value;
            },
        },
        {
            key: 'shipping_fee',
            title: '运费',
            dataIndex: 'shipping_fee',
            align: 'center',
            width: 80,
        },
        {
            key: 'adjust_price',
            title: '销售价格调整',
            dataIndex: 'adjust_price',
            align: 'center',
            width: 120,
            render: (value: string, row: IGoodsSkuItem) => {
                const min = row.price === void 0 ? 0 : -Number(row.price);
                return (
                    <InputNumber
                        min={min}
                        precision={2}
                        defaultValue={value ? Number(value) : undefined}
                        style={{ width: '100%' }}
                        onChange={val => this.changePrice(val, row)}
                    />
                );
            },
        },
        {
            key: 'adjust_reason',
            title: '备注',
            dataIndex: 'adjust_reason',
            align: 'center',
            width: 180,
            render: (value: string, row: IGoodsSkuItem) => {
                return (
                    <TextArea
                        autoSize={true}
                        defaultValue={value}
                        onChange={e => this.changeComment(e.target.value, row)}
                    />
                );
            },
        },
    ];

    constructor(props: {}) {
        super(props);
        this.state = {
            visible: false,
            loading: false,
            id: '',
            merchant_id: '',
            commodity_id: '',
            page: 1,
            total: 0,
            skuList: [],
            goodsDetail: null,
            editList: [],
        };
    }

    showModal = (id: string, merchant_id: string, commodity_id: string) => {
        this.setState(
            {
                id,
                merchant_id,
                commodity_id,
                visible: true,
            },
            () => {
                this.queryGoodsDetail();
                this.queryGoodsSkuList(1);
            },
        );
    };

    queryGoodsDetail = () => {
        const { id } = this.state;
        queryGoodsDetail({
            id: id,
            channel: 'vova',
        }).then(res => {
            // console.log('queryGoodsDetail', res);
            this.setState({
                goodsDetail: res.data,
            });
        });
    };

    queryGoodsSkuList = (page: number) => {
        const { id, editList } = this.state;
        this.setState({
            loading: true,
        });
        const page_count = 50;
        queryGoodsSkuList({
            page,
            page_count,
            id: id,
            channel: 'vova',
        })
            .then(res => {
                // console.log('queryGoodsSkuList', res);
                const { total, sku_list } = res.data;
                this.setState({
                    page,
                    total: Number(total),
                    skuList: sku_list.map((item, index: number) => {
                        const i = editList.findIndex(editItem => editItem.sku === item.sku_name);
                        if (i > -1) {
                            return {
                                serial: (page - 1) * page_count + index + 1,
                                ...item,
                                adjust_price: editList[i].adjustment_price,
                                adjust_reason: editList[i].adjustment_reason,
                            };
                        } else {
                            return {
                                serial: (page - 1) * page_count + index + 1,
                                ...item,
                            };
                        }
                    }),
                });
            })
            .finally(() => {
                this.setState({
                    loading: false,
                });
            });
    };

    private handleCancel = () => {
        this.setState({
            visible: false,
            loading: false,
            id: '',
            merchant_id: '',
            page: 1,
            total: 0,
            skuList: [],
            goodsDetail: null,
            editList: [],
        });
    };

    private handleOk = () => {
        // console.log('handleOk', this.state.editList);
        const { editList, merchant_id, commodity_id } = this.state;
        for (let i = 0; i < editList.length; i++) {
            const { sku, adjustment_price, adjustment_reason } = editList[i];
            if (!adjustment_price || !adjustment_reason) {
                return message.info(`请完善${sku}修改信息`);
            }
        }
        if (!editList || editList.length === 0) {
            message.warn(`请修改后再保存`);
            return;
        }
        editSkuPrice({
            sku_list: editList,
            merchant_id: merchant_id,
            commodity_id: commodity_id,
        }).then(res => {
            // console.log('editSkuPrice', res);
            message.success(res.data.execute_status);
            this.handleCancel();
        });
    };

    private onChangePage = (page: number) => {
        this.queryGoodsSkuList(page);
    };

    private changePrice = (val: number | undefined | string, rowData: IGoodsSkuItem) => {
        // console.log('changePrice', val, rowData);
        const { editList } = this.state;
        const i = editList.findIndex(item => item.sku === rowData.sku_name);
        const valStr = val !== void 0 ? val + '' : '';
        if (i > -1) {
            this.setState({
                editList: editList.map((item, index: number) => {
                    if (i === index) {
                        return {
                            ...item,
                            adjustment_price: valStr,
                        };
                    }
                    return item;
                }),
            });
        } else {
            this.setState({
                editList: [
                    ...editList,
                    {
                        sku: rowData.sku_name,
                        adjustment_price: valStr,
                        adjustment_reason: rowData.adjust_reason,
                    },
                ],
            });
        }
    };

    private changeComment = (val: string, rowData: IGoodsSkuItem) => {
        // console.log('changePrice', val, rowData);
        const { editList } = this.state;
        const i = editList.findIndex(item => item.sku === rowData.sku_name);
        if (i > -1) {
            this.setState({
                editList: editList.map((item, index: number) => {
                    if (i === index) {
                        return {
                            ...item,
                            adjustment_reason: val,
                        };
                    }
                    return item;
                }),
            });
        } else {
            this.setState({
                editList: [
                    ...editList,
                    {
                        sku: rowData.sku_name,
                        adjustment_price: rowData.adjust_price,
                        adjustment_reason: val,
                    },
                ],
            });
        }
    };

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
                    {goodsDetail ? (
                        <div className="overflow-hidden">
                            <img className="goods-img" src={goodsDetail.main_image} />
                            <div className="overflow-hidden">
                                <div className="text item">标题：{goodsDetail.product_name}</div>
                                <div className="text item">
                                    描述：{goodsDetail.product_description}
                                </div>
                                <div className="item">
                                    <div className="desc">
                                        <span className="float-left name">Product ID:</span>
                                        <div className="overflow-hidden">
                                            {goodsDetail.product_id}
                                        </div>
                                    </div>
                                    <div className="desc center">
                                        <span className="float-left name">中台商品ID:</span>
                                        <div className="overflow-hidden">
                                            {goodsDetail.commodity_id}
                                        </div>
                                    </div>
                                    <div className="desc">
                                        <span className="float-left name">爬虫商品 id:</span>
                                        <div className="overflow-hidden">
                                            {goodsDetail.spider_product_id}
                                        </div>
                                    </div>
                                </div>
                                <div className="item">
                                    <div className="desc">
                                        <span className="float-left name">一级分类:</span>
                                        <div className="overflow-hidden">
                                            {goodsDetail.category_level_1}
                                        </div>
                                    </div>
                                    <div className="desc center">
                                        <span className="float-left name">二级分类:</span>
                                        <div className="overflow-hidden">
                                            {goodsDetail.category_level_2}
                                        </div>
                                    </div>
                                    <div className="desc">
                                        <span className="float-left name">三级分类:</span>
                                        <div className="overflow-hidden">
                                            {goodsDetail.category_level_3}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <Skeleton avatar={true} active={true} paragraph={{ rows: 1 }} />
                    )}

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
                        pageSize={50}
                        onChange={this.onChangePage}
                        showTotal={total => `共${total}条`}
                        style={{ marginTop: 12 }}
                    />
                </div>
            </Modal>
        );
    }
}

export default SkuDialog;

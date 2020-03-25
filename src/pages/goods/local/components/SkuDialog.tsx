import React from 'react';
import { Modal, Table, Pagination } from 'antd';
import { ColumnProps } from 'antd/es/table';
import AutoEnLargeImg from '@/components/AutoEnLargeImg';

import { ISkuStyleItem } from '@/interface/ILocalGoods';
import { getGoodsSkuList } from '@/services/goods';

import './SkuDialog.less';

declare interface ISkuItem {
    origin_sku_id: string;
    shipping_fee: number;
    sku_id: string;
    sku_style: ISkuStyleItem[];
    sku_price: string;
    sku_inventory: string;
    sku_weight: number;
    serial: number;
    sku_amount: number; // 爬虫价格 = 价格 + 运费
    image_url: string;
}

declare interface IPageData {
    page?: number;
    page_count?: number;
}

declare interface IPorps {
    visible: boolean;
    // currentRowData: IRowDataItem | null;
    currentRowData: any;
    toggleSkuDialog(status: boolean): void;
}

declare interface IState {
    loading: boolean;
    page: number;
    allCount: number;
    skuList: ISkuItem[];
}

class SkuDialog extends React.PureComponent<IPorps, IState> {
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
            title: 'SKU ID',
            dataIndex: 'sku_id',
            align: 'center',
            width: 120,
        },
        {
            key: 'image_url',
            title: '对应图片',
            dataIndex: 'image_url',
            align: 'center',
            width: 120,
            render: (value: string) => {
                return <AutoEnLargeImg src={value} className="sku-img" />;
            }
        },
        {
            key: 'sku_style',
            title: '规格',
            dataIndex: 'sku_style',
            align: 'center',
            width: 200,
            render: (value: ISkuStyleItem[]) => {
                return value.map(item => (
                    <div key={item.option}>
                        {item.option}: {item.value}
                    </div>
                ))
            },
        },
        {
            key: 'sku_amount',
            title: '爬虫价格(￥)',
            dataIndex: 'sku_amount',
            align: 'center',
            width: 100
        },
        {
            key: 'sku_price',
            title: '单价(￥)',
            dataIndex: 'sku_price',
            align: 'center',
            width: 100
        },
        {
            key: 'shipping_fee',
            title: '运费(￥)',
            dataIndex: 'shipping_fee',
            align: 'center',
            width: 100
        },
        {
            key: 'sku_weight',
            title: '重量',
            dataIndex: 'sku_weight',
            align: 'center',
            width: 100,
        },
        {
            key: 'sku_inventory',
            title: '库存',
            dataIndex: 'sku_inventory',
            align: 'center',
            width: 100,
        },
    ];

    constructor(props: IPorps) {
        super(props);
        this.state = {
            loading: false,
            page: 1,
            allCount: 0,
            skuList: [],
        };
    }

    private handleCancel = () => {
        this.props.toggleSkuDialog(false);
    };

    getSkuList = (productId: string, pageData?: IPageData) => {
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
        getGoodsSkuList(params)
            .then(res => {
                // console.log('getGoodsSkuList', res);
                const { all_count, list } = res.data;
                this.setState({
                    page: params.page,
                    allCount: all_count,
                    skuList: list.map((item: any, index: number) => {
                        let { sku_style, sku_price, shipping_fee, variant_image, ...rest } = item;
                        return {
                            ...rest,
                            sku_price,
                            shipping_fee,
                            sku_amount: Number(sku_price) + Number(shipping_fee),
                            sku_style: sku_style.map(({ option, value }: any) => ({
                                option,
                                value
                            })),
                            image_url: variant_image?.url,
                            serial: (params.page - 1) * 50 + index + 1,
                        };
                    }),
                });
            })
            .finally(() => {
                this.setState({
                    loading: false,
                });
            });
    };

    onChangePage = (page: number) => {
        this.getSkuList(this.props.currentRowData!.product_id, {
            page,
        });
    };

    render() {
        const { visible, currentRowData } = this.props;
        const { loading, page, allCount, skuList } = this.state;
        if (!currentRowData) {
            return null;
        } else {
            const {
                goods_img,
                title,
                worm_goodsinfo_link,
                product_id,
                commodity_id,
                worm_goods_id,
                first_catagory,
                second_catagory,
                third_catagory,
            } = currentRowData;
            return (
                <Modal
                    width={1000}
                    visible={visible}
                    onCancel={this.handleCancel}
                    maskClosable={false}
                    footer={null}
                    // bodyStyle={{
                    //     maxHeight: 600,
                    //     overflow: 'auto'
                    // }}
                >
                    <div className="goods-sku-dialog">
                        <div className="goods-info">
                            <img className="main-img" src={goods_img} />
                            <div className="content">
                                <div className="desc">
                                    商品标题：{title}
                                    <a href={worm_goodsinfo_link} target="_blank">
                                        【查看源商品】
                                    </a>
                                </div>
                                <div className="center">
                                    <div className="goods-item one">
                                        <span className="float-left">product id:</span>
                                        <div className="overflow-hidden">{product_id}</div>
                                    </div>
                                    <div className="goods-item two">
                                        <span className="float-left">commodity id:</span>
                                        <div className="overflow-hidden">{commodity_id}</div>
                                    </div>
                                    <div className="goods-item three">
                                        <span className="float-left">爬虫商品 id:</span>
                                        <div className="overflow-hidden">{worm_goods_id}</div>
                                    </div>
                                </div>
                                <div>
                                    <div className="goods-item one">
                                        <span className="float-left">一级分类:</span>
                                        <div className="overflow-hidden">{first_catagory.name}</div>
                                    </div>
                                    <div className="goods-item two">
                                        <span className="float-left">二级分类:</span>
                                        <div className="overflow-hidden">
                                            {second_catagory.name}
                                        </div>
                                    </div>
                                    <div className="goods-item three">
                                        <span className="float-left">三级分类:</span>
                                        <div className="overflow-hidden">{third_catagory.name}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
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
                        <Pagination
                            size="small"
                            total={allCount}
                            current={page}
                            defaultPageSize={50}
                            showQuickJumper={true}
                            onChange={this.onChangePage}
                            showTotal={total => `共${total}条`}
                        />
                    </div>
                </Modal>
            );
        }
    }
}

export default SkuDialog;

import React, { ChangeEvent } from 'react';
import { Modal, Pagination, Row, Col, Button, Input } from 'antd';
import { ColumnProps } from 'antd/es/table';
import { AutoEnLargeImg } from 'react-components';
import { FitTable } from 'react-components';

import { ISkuStyleItem, ISkuInfo } from '@/interface/ILocalGoods';
import { getGoodsSkuList, ISkuParams } from '@/services/goods';
import { setCommoditySkuTag } from '@/services/goods-attr';

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
    commodity_sku_id: string;
    tags: string[];
}

declare interface IPorps {
    visible: boolean;
    currentSkuInfo: ISkuInfo | null;
    hideSkuDialog(): void;
}

declare interface IState {
    loading: boolean;
    page: number;
    allCount: number;
    skuList: ISkuItem[];
    value: string;
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
            },
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
                ));
            },
        },
        {
            key: 'sku_amount',
            title: '爬虫价格(￥)',
            dataIndex: 'sku_amount',
            align: 'center',
            width: 140,
        },
        {
            key: 'sku_price',
            title: '单价(￥)',
            dataIndex: 'sku_price',
            align: 'center',
            width: 100,
        },
        {
            key: 'shipping_fee',
            title: '运费(￥)',
            dataIndex: 'shipping_fee',
            align: 'center',
            width: 100,
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
        {
            fixed: 'right',
            key: '_attr',
            title: '属性',
            // dataIndex: 'xxx',
            align: 'center',
            width: 170,
            render: (value, row: ISkuItem) => {
                const { currentSkuInfo } = this.props;
                const { tags, commodity_sku_id } = row;
                return (
                    <div style={{ textAlign: 'left' }}>
                        {currentSkuInfo?.tags?.map((item: string) => {
                            const isActive = tags.indexOf(item) > -1;
                            return (
                                <Button
                                    size="small"
                                    className="tag-btn"
                                    type={isActive ? 'primary' : 'default'}
                                    key={item}
                                    onClick={() =>
                                        this.setCommoditySkuTag(commodity_sku_id, item, tags)
                                    }
                                >
                                    {item}
                                </Button>
                            );
                        })}
                    </div>
                );
            },
        },
    ];
    constructor(props: IPorps) {
        super(props);
        this.state = {
            loading: false,
            page: 1,
            allCount: 0,
            skuList: [],
            value: '',
        };
    }

    private setCommoditySkuTag = (commodity_sku_id: string, item: string, tags: string[]) => {
        // console.log('commodity_sku_id', commodity_sku_id);
        const commodity_id = this.props.currentSkuInfo!.commodity_id as string;
        const index = tags.indexOf(item);
        let list: string[] = [];
        if (index > -1) {
            list = [...tags.slice(0, index), ...tags.slice(index + 1)];
        } else {
            list = [...tags, item];
        }
        this.setState({
            loading: true,
        });
        setCommoditySkuTag({
            commodity_sku_id,
            tag_name: list,
            commodity_id,
        })
            .then(() => {
                // console.log('setCommoditySkuTag', res);
                const { skuList } = this.state;
                this.setState({
                    skuList: skuList.map(item => {
                        if (item.commodity_sku_id === commodity_sku_id) {
                            return {
                                ...item,
                                tags: list,
                            };
                        }
                        return item;
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
        this.props.hideSkuDialog();
    };

    getSkuList = (productId: string, pageData?: ISkuParams) => {
        const { page, value } = this.state;
        let params: ISkuParams = {
            page,
            product_id: productId,
            page_count: 50,
            variantids: value,
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
                                value,
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
        this.getSkuList(this.props.currentSkuInfo!.product_id, {
            page,
        });
    };

    changeValue = (e: ChangeEvent<HTMLInputElement>) => {
        this.setState({
            value: e.target.value,
        });
    };

    handleClickSearch = () => {
        const { value } = this.state;
        this.getSkuList(this.props.currentSkuInfo!.product_id, {
            page: 1,
        });
    };

    render() {
        const { visible, currentSkuInfo } = this.props;
        const { loading, page, allCount, skuList, value } = this.state;
        if (!currentSkuInfo) {
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
            } = currentSkuInfo;
            return (
                <Modal
                    width={1000}
                    visible={visible}
                    style={{ top: 50 }}
                    onCancel={this.handleCancel}
                    maskClosable={false}
                    footer={null}
                >
                    <div className="goods-sku-dialog">
                        <div className="goods-info">
                            <img className="main-img" src={goods_img} />
                            <div className="content">
                                <Row>
                                    <Col span={7}>Product ID: {product_id}</Col>
                                    <Col span={10}>Commodity ID: {commodity_id}</Col>
                                    <Col span={5}>爬虫商品 ID: {worm_goods_id}</Col>
                                </Row>
                                <div className="desc">
                                    商品标题：{title}
                                    <a href={worm_goodsinfo_link} target="_blank">
                                        【查看源商品】
                                    </a>
                                </div>
                                <Row>
                                    <Col span={8}>一级分类: {first_catagory?.name}</Col>
                                    <Col span={8}>二级分类: {second_catagory?.name}</Col>
                                    <Col span={8}>三级分类: {third_catagory?.name}</Col>
                                </Row>
                            </div>
                        </div>
                        <Row className="filter-section" gutter={16}>
                            <Col span={21} className="input-wrap">
                                <span className="label">SKU ID:</span>
                                <Input
                                    value={value}
                                    onChange={this.changeValue}
                                    placeholder="支持多个搜索，以英文逗号隔开"
                                />
                            </Col>
                            <Col span={3}>
                                <Button
                                    type="primary"
                                    className="btn"
                                    loading={loading}
                                    onClick={this.handleClickSearch}
                                >
                                    搜索
                                </Button>
                            </Col>
                        </Row>
                        <FitTable
                            bordered={true}
                            rowKey="sku_id"
                            className="table"
                            loading={loading}
                            columns={this.columns}
                            dataSource={skuList}
                            scroll={{ x: 'max-content', y: 400 }}
                            // minHeight={100}
                            autoFitY={false}
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

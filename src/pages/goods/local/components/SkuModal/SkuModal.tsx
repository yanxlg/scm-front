import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { Modal, Row, Col, Input, Button, Pagination } from 'antd';
import { ISkuStyleItem, ISkuInfo } from '@/interface/ILocalGoods';
import { FitTable, AutoEnLargeImg } from 'react-components';
import { setCommoditySkuTag } from '@/services/goods-attr';
import { getGoodsSkuList, ISkuParams } from '@/services/goods';
import { ColumnsType } from 'antd/es/table';

import styles from './_SkuModal.less';

declare interface ISkuItem {
    origin_sku_id: string;
    shipping_fee: number;
    sku_id: string;
    sku_style: any[];
    sku_price: string;
    sku_inventory: string;
    sku_weight: number;
    serial: number;
    sku_amount: number; // 爬虫价格 = 价格 + 运费
    image_url: string;
    commodity_sku_id: string;
    tags: string[];
}

interface IProps {
    visible: boolean;
    currentSkuInfo: ISkuInfo | null;
    onCancel(): void;
}

const SkuModal: React.FC<IProps> = ({ visible, currentSkuInfo, onCancel }) => {
    const [loading, setLoading] = useState(false);
    const [pageNumber, setPageNumber] = useState(1);
    const [total, setTotal] = useState(0);
    const [searchVal, setSearchVal] = useState('');
    const [skuList, setSkuList] = useState<ISkuItem[]>([]);

    const handleCancel = useCallback(() => {
        setPageNumber(1);
        setTotal(0);
        setSearchVal('');
        setSkuList([]);
        onCancel();
    }, []);

    const _getGoodsSkuList = useCallback(
        (pageData?: ISkuParams) => {
            const productId = currentSkuInfo?.product_id as string;
            let params: ISkuParams = {
                page: pageNumber,
                product_id: productId,
                page_count: 50,
                variantids: searchVal,
            };
            if (pageData) {
                params = Object.assign(params, pageData);
            }
            setLoading(true);
            getGoodsSkuList(params)
                .then(res => {
                    // console.log('getGoodsSkuList', res);
                    const { all_count, list } = res.data;
                    setPageNumber(params.page);
                    setTotal(all_count);
                    setSkuList(
                        list.map((item: any, index: number) => {
                            let {
                                sku_style,
                                sku_price,
                                shipping_fee,
                                variant_image,
                                ...rest
                            } = item;
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
                    );
                })
                .finally(() => {
                    setLoading(false);
                });
        },
        [pageNumber, searchVal, currentSkuInfo],
    );

    const _setCommoditySkuTag = useCallback(
        (commodity_sku_id: string, item: string, tags: string[]) => {
            const commodity_id = currentSkuInfo?.commodity_id as string;
            const index = tags.indexOf(item);
            let list: string[] = [];
            if (index > -1) {
                list = [...tags.slice(0, index), ...tags.slice(index + 1)];
            } else {
                list = [...tags, item];
            }
            setLoading(loading);
            setCommoditySkuTag({
                commodity_sku_id,
                tag_name: list,
                commodity_id,
            })
                .then(() => {
                    setSkuList(
                        skuList.map(item => {
                            if (item.commodity_sku_id === commodity_sku_id) {
                                return {
                                    ...item,
                                    tags: list,
                                };
                            }
                            return item;
                        }),
                    );
                })
                .finally(() => {
                    setLoading(false);
                });
        },
        [currentSkuInfo, skuList],
    );

    const handleClickSearch = useCallback(() => {
        _getGoodsSkuList({
            page: 1,
        });
    }, [_getGoodsSkuList]);

    const handleChangePage = useCallback(
        (page: number) => {
            _getGoodsSkuList({
                page,
            });
        },
        [_getGoodsSkuList],
    );

    useEffect(() => {
        if (visible) {
            _getGoodsSkuList({
                page: 1,
            });
        }
    }, [visible]);

    const goodsInfoNode = useMemo(() => {
        if (!currentSkuInfo) {
            return null;
        }
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
            <div className={styles.goodsInfo}>
                <img className={styles.mainImg} src={goods_img} />
                <div>
                    <Row>
                        <Col span={7}>Product ID: {product_id}</Col>
                        <Col span={10}>Commodity ID: {commodity_id}</Col>
                        <Col span={5}>爬虫商品 ID: {worm_goods_id}</Col>
                    </Row>
                    <div className={styles.desc}>
                        商品标题：{title}
                        <a className={styles.link} href={worm_goodsinfo_link} target="_blank">
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
        );
    }, [currentSkuInfo]);

    const columns = useMemo<ColumnsType<ISkuItem>>(() => {
        return [
            {
                key: 'serial',
                title: () => `序号(${total})`,
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
                    return <AutoEnLargeImg src={value} className={styles.skuImg} />;
                },
            },
            {
                key: 'sku_style',
                title: '规格',
                dataIndex: 'sku_style',
                align: 'center',
                width: 200,
                render: (value: any[]) => {
                    return value.map(item => (
                        <div key={item.option.text}>
                            {item.option.text}: {item.value.text}
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
                render: (_: any, row: ISkuItem) => {
                    const { tags, commodity_sku_id } = row;
                    return (
                        <div style={{ textAlign: 'left' }}>
                            {currentSkuInfo?.tags?.map((item: string) => {
                                const isActive = tags.indexOf(item) > -1;
                                return (
                                    <Button
                                        size="small"
                                        className={styles.tagBtn}
                                        type={isActive ? 'primary' : 'default'}
                                        key={item}
                                        onClick={() =>
                                            _setCommoditySkuTag(commodity_sku_id, item, tags)
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
    }, [total, currentSkuInfo, _setCommoditySkuTag]);

    return useMemo(() => {
        return (
            <Modal
                width={1000}
                visible={visible}
                style={{ top: 50 }}
                onCancel={handleCancel}
                maskClosable={false}
                footer={null}
            >
                <div className={styles.skuContent}>
                    {goodsInfoNode}
                    <Row className={styles.filterSection} gutter={16}>
                        <Col span={21} className={styles.inputWrap}>
                            <span className={styles.label}>SKU ID:</span>
                            <Input
                                value={searchVal}
                                onChange={e => setSearchVal(e.target.value)}
                                placeholder="支持多个搜索，以英文逗号隔开"
                            />
                        </Col>
                        <Col span={3}>
                            <Button
                                type="primary"
                                className={styles.btn}
                                loading={loading}
                                onClick={handleClickSearch}
                            >
                                搜索
                            </Button>
                        </Col>
                    </Row>
                    <FitTable
                        bordered
                        rowKey="sku_id"
                        className={styles.table}
                        loading={loading}
                        columns={columns}
                        dataSource={skuList}
                        scroll={{ x: 'max-content', y: 400 }}
                        autoFitY={false}
                        pagination={false}
                    />
                    <Pagination
                        size="small"
                        total={total}
                        current={pageNumber}
                        defaultPageSize={50}
                        showQuickJumper={true}
                        showSizeChanger={false}
                        onChange={handleChangePage}
                        showTotal={total => `共${total}条`}
                    />
                </div>
            </Modal>
        );
    }, [visible, currentSkuInfo, searchVal, loading, skuList]);
};

export default SkuModal;

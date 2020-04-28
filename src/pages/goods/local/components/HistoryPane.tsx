import React, { useMemo, useState, useCallback, useEffect } from 'react';
import { Button } from 'antd';
import { FitTable, AutoEnLargeImg } from 'react-components';
import { ColumnType } from 'antd/lib/table';
import { getGoodsVersion } from '@/services/goods';
import { IGoodsVersionAndSkuItem, IOnsaleItem } from '@/interface/ILocalGoods';
import { utcToLocal } from 'react-components/es/utils/date';
import usePagination from '../hooks/usePagination';
import useSkuDialog from '../hooks/useSkuDialog';
import SkuDialog from './SkuDialog';

import styles from '../_version.less';

interface IProps {
    commodityId: string;
}

const HistoryPane: React.FC<IProps> = ({ commodityId }) => {
    const [loading, setLoading] = useState(false);
    const [goodsList, setGoodsList] = useState<IGoodsVersionAndSkuItem[]>([]);

    const { page, setPage, pageSize, setPageSize, total, setTotal } = usePagination();
    const {
        skuStatus,
        currentSkuGoods,
        skuDialogRef,
        showSkuDialog,
        hideSkuDialog,
    } = useSkuDialog();

    const _getGoodsVersion = useCallback(
        (params = { page, page_count: pageSize }) => {
            setLoading(true);
            getGoodsVersion({
                ...params,
                commodity_id: commodityId,
            })
                .then(res => {
                    // console.log('_getGoodsVersion', res);
                    const { list, all_count } = res.data;
                    setPage(params.page);
                    setPageSize(params.page_count);
                    setTotal(all_count as number);
                    setGoodsList(
                        list.map(item => {
                            const { sku_info, update_time } = item;
                            const _update_time = utcToLocal(update_time);
                            if (sku_info?.length > 0) {
                                return {
                                    _update_time,
                                    ...item,
                                    ...sku_info[0],
                                };
                            }
                            return {
                                _update_time,
                                ...item,
                            };
                        }),
                    );
                })
                .finally(() => {
                    setLoading(false);
                });
        },
        [page, pageSize],
    );

    const onChange = useCallback(({ current, pageSize }) => {
        _getGoodsVersion({
            page: current,
            page_count: pageSize,
        });
    }, []);

    const handleShowSku = useCallback(record => {
        const {
            tags,
            product_id,
            goods_img,
            title,
            worm_goodsinfo_link,
            worm_goods_id,
            first_catagory,
            second_catagory,
            third_catagory,
        } = record;
        showSkuDialog({
            commodity_id: commodityId,
            tags,
            product_id,
            goods_img,
            title,
            worm_goodsinfo_link,
            worm_goods_id,
            first_catagory,
            second_catagory,
            third_catagory,
        });
    }, []);

    useEffect(() => {
        _getGoodsVersion();
    }, []);

    const columns = useMemo<ColumnType<IGoodsVersionAndSkuItem>[]>(() => {
        return [
            {
                title: 'Product ID',
                dataIndex: 'product_id',
                width: 140,
                align: 'center',
            },
            {
                title: '版本状态',
                dataIndex: 'goods_status',
                width: 120,
                align: 'center',
            },
            {
                title: '上架渠道',
                dataIndex: 'onsale_info',
                align: 'center',
                width: 120,
                render: (value: IOnsaleItem[]) => {
                    return [...new Set(value.map(item => item.onsale_channel))].map(channel => (
                        <div key={channel}>{channel}</div>
                    ));
                },
            },
            {
                title: '销售状态',
                dataIndex: 'inventory_status',
                align: 'center',
                width: 120,
                render: (val: string) => (val == '1' ? '可销售' : '不可销售'),
            },
            {
                title: '商品图片',
                dataIndex: 'goods_img',
                align: 'center',
                width: 120,
                render: (val: string) => <AutoEnLargeImg src={val} className={styles.goodsImg} />,
            },
            {
                title: '商品名称',
                dataIndex: 'title',
                width: 160,
                align: 'center',
            },
            {
                title: '商品描述',
                dataIndex: 'description',
                width: 200,
                align: 'center',
            },
            {
                title: '商品分类',
                dataIndex: 'first_catagory',
                align: 'center',
                width: 160,
                render: (_, row: IGoodsVersionAndSkuItem) => {
                    const { first_catagory, second_catagory, third_catagory } = row;
                    return `${first_catagory.name || ''}-${second_catagory.name ||
                        ''}-${third_catagory.name || ''}`;
                },
            },
            {
                title: 'sku数量',
                dataIndex: 'sku_number',
                width: 120,
                align: 'center',
                render: (value: number, row: IGoodsVersionAndSkuItem) => {
                    return (
                        <>
                            <div>{value}</div>
                            <Button
                                type="link"
                                className={styles.link}
                                onClick={() => handleShowSku(row)}
                            >
                                查看sku信息
                            </Button>
                        </>
                    );
                },
            },
            {
                title: '爬虫价格(￥)',
                dataIndex: 'price_min',
                width: 120,
                align: 'center',
                render: (_: string, row: IGoodsVersionAndSkuItem) => {
                    const { price_min, price_max, shipping_fee_min, shipping_fee_max } = row;
                    return (
                        <>
                            {price_min}~{price_max}
                            <div>
                                (含运费{shipping_fee_min}~{shipping_fee_max})
                            </div>
                        </>
                    );
                },
            },
            {
                title: '销量',
                dataIndex: 'sales_volume',
                width: 120,
                align: 'center',
            },
            {
                title: '变更时间',
                dataIndex: '_update_time',
                width: 120,
                align: 'center',
            },
        ];
    }, []);

    const pagination = useMemo(() => {
        return {
            total: total,
            current: page,
            pageSize: pageSize,
            showSizeChanger: true,
            position: ['topRight', 'bottomRight'],
        } as any;
    }, [loading]);

    return useMemo(() => {
        return (
            <>
                <FitTable
                    bordered
                    rowKey="product_id"
                    loading={loading}
                    columns={columns}
                    dataSource={goodsList}
                    scroll={{ x: 'max-content' }}
                    columnsSettingRender={true}
                    pagination={pagination}
                    onChange={onChange}
                />
                <SkuDialog
                    visible={skuStatus}
                    ref={skuDialogRef}
                    currentSkuInfo={currentSkuGoods}
                    hideSkuDialog={hideSkuDialog}
                />
            </>
        );
    }, [loading, goodsList, skuStatus, currentSkuGoods]);
};

export default HistoryPane;

import React, { useMemo, useState, useCallback, useEffect } from 'react';
import { Modal } from 'antd';
import { getGoodsVersion } from '@/services/goods';
import { IGoodsVersionAndSkuItem, IOnsaleItem } from '@/interface/ILocalGoods';
import { utcToLocal } from 'react-components/es/utils/date';
import { ColumnType } from 'antd/lib/table';
import { AutoEnLargeImg, FitTable } from 'react-components';

import styles from '../_version.less';

interface IProps {
    visible: boolean;
    productId: string;
    hideModal(): void;
}

const VersionParentDialog: React.FC<IProps> = ({ visible, hideModal, productId }) => {
    const [loading, setLoading] = useState(false);
    const [goodsList, setGoodsList] = useState<IGoodsVersionAndSkuItem[]>();

    const getCurrentList = useCallback(() => {
        setLoading(true);
        getGoodsVersion({
            page: 1,
            page_count: 50,
            commodity_id: productId,
        })
            .then(res => {
                // console.log('getCurrentList', res);
                const { list } = res.data;
                setGoodsList(
                    list.map(item => {
                        const { sku_info, update_time, ...rest } = item;
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
    }, [productId]);

    const onCancel = useCallback(() => {
        hideModal();
    }, []);

    const columns = useMemo<ColumnType<IGoodsVersionAndSkuItem>[]>(() => {
        return [
            {
                title: '类型',
                // dataIndex: 'product_id',
                width: 120,
                align: 'center',
            },
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
            },
            {
                title: '爬虫价格(￥)',
                dataIndex: '',
                width: 120,
                align: 'center',
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

    useEffect(() => {
        if (productId) {
            getCurrentList();
        }
    }, [productId]);

    return useMemo(() => {
        return (
            <Modal
                title="查看父版本"
                visible={visible}
                width={800}
                footer={null}
                onCancel={onCancel}
            >
                <FitTable
                    bordered
                    rowKey="product_id"
                    loading={loading}
                    columns={columns}
                    dataSource={goodsList}
                    scroll={{ x: 'max-content' }}
                    pagination={false}
                    autoFitY={false}
                />
            </Modal>
        );
    }, [visible, loading, goodsList]);
};

export default VersionParentDialog;

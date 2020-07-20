import React, { useMemo, useState, useEffect, useCallback } from 'react';
import { Table, Pagination } from 'antd';
import { ColumnsType } from 'antd/es/table';

import similarStyles from './_similar.less';
import { querySimilarGoodsList } from '@/services/order-manage';
import { ISimilarGoodsItem } from '@/interface/IOrder';
import { AutoEnLargeImg } from 'react-components';

interface IProps {
    commodityId: string;
}

const SimilarTable: React.FC<IProps> = ({ commodityId }) => {
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [similarList, setSimilarList] = useState<ISimilarGoodsItem[]>([]);

    const columns = useMemo<ColumnsType<ISimilarGoodsItem>>(() => {
        return [
            {
                title: 'Commodity ID',
                dataIndex: 'commodityId',
                width: 130,
                align: 'center',
            },
            {
                title: '商品图片',
                dataIndex: 'defaultImage',
                width: 130,
                align: 'center',
                render: (val: string) => (
                    <AutoEnLargeImg src={val} className={similarStyles.image} />
                ),
            },
            {
                title: '商品名称',
                dataIndex: 'productTitle',
                width: 130,
                align: 'center',
            },
            {
                title: '商品价格(￥)',
                dataIndex: 'priceMin',
                width: 130,
                align: 'center',
                render: (priceMin: string, record) => {
                    const { priceMax, shippingFeeMin, shippingFeeMax } = record;
                    return (
                        <>
                            <div>{`${priceMin} ~ ${priceMax}`}</div>
                            <div>(含运费{`${shippingFeeMin} ~ ${shippingFeeMax}`})</div>
                        </>
                    );
                },
            },
            {
                title: '商详链接',
                dataIndex: 'productUrl',
                width: 130,
                align: 'center',
                render: (val: string) => (
                    <a href={val} target="_blank">
                        {val}
                    </a>
                ),
            },
            {
                title: '商品相似度',
                dataIndex: 'similar',
                width: 130,
                align: 'center',
            },
            {
                title: '销售状态',
                dataIndex: 'isOnSale',
                width: 130,
                align: 'center',
                render: (val: string) => (val === '1' ? '可销售' : '不可销售'),
            },
        ];
    }, []);

    const _querySimilarGoodsList = useCallback(
        page => {
            setLoading(true);
            querySimilarGoodsList({
                page,
                page_count: 10,
                commodity_id: commodityId,
            }).then(({ total, list }: { total: number; list: ISimilarGoodsItem[] }) => {
                // console.log('querySimilarGoodsList', res);
                setLoading(false);
                setPage(page);
                setTotal(total);
                setSimilarList(list);
            });
        },
        [commodityId],
    );

    const handleChangePage = useCallback(page => {
        // console.log('handleChangePage', page);
        _querySimilarGoodsList(page);
    }, []);

    useEffect(() => {
        if (commodityId) {
            // console.log('commodityId', commodityId, 1111111);
            _querySimilarGoodsList(1);
        }
    }, [commodityId]);

    return useMemo(() => {
        return (
            <div className={similarStyles.similarList}>
                <div className={similarStyles.title}>本地商品库相似商品</div>
                <Table
                    bordered
                    loading={loading}
                    columns={columns}
                    dataSource={similarList}
                    pagination={false}
                    scroll={{ x: 'max-content', y: 400 }}
                />
                <div className={similarStyles.pagination}>
                    <Pagination
                        size="small"
                        current={page}
                        total={total}
                        onChange={handleChangePage}
                        showQuickJumper
                    />
                </div>
            </div>
        );
    }, [loading, page, similarList, total]);
};

export default SimilarTable;

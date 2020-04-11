import React, { useMemo, useState, useCallback, useEffect } from 'react';
import { Button } from 'antd';
import { FitTable, AutoEnLargeImg } from 'react-components';
import { ColumnType } from 'antd/lib/table';
import { getGoodsVersion } from '@/services/goods';
import { IGoodsVersionAndSkuItem, IOnsaleItem } from '@/interface/ILocalGoods';
import { utcToLocal } from 'react-components/es/utils/date';
import ImgEditDialog from './ImgEditDialog/ImgEditDialog';
import SkuDialog from './SkuDialog';
import useEditDialog from '../hooks/useEditDialog';
import useSkuDialog from '../hooks/useSkuDialog';

import styles from '../_version.less';
import { LockOutlined } from '@ant-design/icons';

interface IProps {
    commodityId: string;
}

const CurrentPane: React.FC<IProps> = ({
    commodityId
}) => {
    const [loading, setLoading] = useState(false);
    const [goodsList, setGoodsList] = useState<IGoodsVersionAndSkuItem[]>([]);
    const {
        goodsEditStatus,
        // setGoodsEditStatus,
        currentEditGoods,
        // setCurrentEditGoods,
        originEditGoods,
        // setOriginEditGoods,
        allCatagoryList,
        getCurrentCatagory,
        toggleEditGoodsDialog,
        changeGoodsText,
        changeGoodsCatagory,
        changeGoodsImg,
        resetGoodsData
    } = useEditDialog();
    const {
        skuStatus,
        currentSkuGoods,
        skuDialogRef,
        showSkuDialog,
        hideSkuDialog
    } = useSkuDialog();
    
    const getCurrentList = useCallback(
        () => {
            setLoading(true);
            getGoodsVersion({
                page: 1,
                page_count: 50,
                commodity_id: commodityId
            }).then(res => {
                // console.log('getCurrentList', res);
                const { list } = res.data;
                setGoodsList(list.map(item => {
                    const { sku_info, update_time, ...rest  } = item;
                    const _update_time = utcToLocal(update_time);
                    if (sku_info?.length > 0) {
                        return {
                            _update_time,
                            commodity_id: commodityId,
                            ...item,
                            ...sku_info[0]
                        }
                    }
                    return {
                        _update_time,
                        commodity_id: commodityId,
                        ...item
                    };
                }))
            }).finally(() => {
                setLoading(false);
            });
        },
        [],
    );

    const columns = useMemo<ColumnType<IGoodsVersionAndSkuItem>[]>(
        () => {
            return [
                {
                    fixed: 'left',
                    title: '操作',
                    // dataIndex: 'goods_status',
                    width: 120,
                    align: 'center',
                    render: (_, row: IGoodsVersionAndSkuItem) => {
                        return (
                            <>
                                <Button type="link" onClick={() => toggleEditGoodsDialog(true, row)}>编辑</Button>   
                            </>
                        )
                    }
                },
                {
                    title: 'Product ID',
                    dataIndex: 'product_id',
                    width: 120,
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
                    render: (val: string) => val == '1' ? '可销售' : '不可销售'
                },
                {
                    title: () => <>商品图片<LockOutlined className={styles.icon}/></>,
                    dataIndex: 'goods_img',
                    align: 'center',
                    width: 120,
                    render: (val: string) => <AutoEnLargeImg src={val} className={styles.goodsImg} />
                },
                {
                    title: () => <>商品名称<LockOutlined className={styles.icon}/></>,
                    dataIndex: 'title',
                    width: 160,
                    align: 'center',
                },
                {
                    title: () => <>商品描述<LockOutlined className={styles.icon}/></>,
                    dataIndex: 'description',
                    width: 200,
                    align: 'center',
                },
                {
                    title: () => <>商品分类<LockOutlined className={styles.icon}/></>,
                    dataIndex: 'first_catagory',
                    align: 'center',
                    width: 160,
                    render: (_, row: IGoodsVersionAndSkuItem) => {
                        const { first_catagory, second_catagory, third_catagory } = row;
                        return `${first_catagory.name || ''}-${second_catagory.name || ''}-${third_catagory.name || ''}`;
                    }
                },
                {
                    title: () => <>sku数量<LockOutlined className={styles.icon}/></>,
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
                                    onClick={() => showSkuDialog(row)}
                                >
                                    查看sku信息
                                </Button>
                            </>
                        );
                    }
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
        },
        []
    );

    useEffect(() => {
        getCurrentList();
    }, []);

    return useMemo(
        () => {
            return (
                <>
                    <FitTable
                        bordered
                        rowKey="product_id"
                        loading={loading}
                        columns={columns}
                        dataSource={goodsList}
                        scroll={{ x: 'max-content' }}
                        autoFitY={true}
                        pagination={false}
                    />
                    <ImgEditDialog
                        visible={goodsEditStatus}
                        originEditGoods={originEditGoods}
                        currentEditGoods={currentEditGoods}
                        allCatagoryList={allCatagoryList}
                        toggleEditGoodsDialog={toggleEditGoodsDialog}
                        getCurrentCatagory={getCurrentCatagory}
                        changeGoodsText={changeGoodsText}
                        changeGoodsCatagory={changeGoodsCatagory}
                        changeGoodsImg={changeGoodsImg}
                        resetGoodsData={resetGoodsData}
                        onSearch={getCurrentList}
                    />
                    <SkuDialog
                        visible={skuStatus}
                        ref={skuDialogRef}
                        currentRowData={currentSkuGoods}
                        hideSkuDialog={hideSkuDialog}
                    />
                </>
                
            )
        }, 
        [goodsList, loading, goodsEditStatus, currentEditGoods, skuStatus, currentSkuGoods]
    )
}

export default CurrentPane;
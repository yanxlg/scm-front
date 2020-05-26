import React, { useMemo, useState, useCallback, useEffect, useRef } from 'react';
import { Button, message } from 'antd';
import { FitTable, AutoEnLargeImg, LoadingButton } from 'react-components';
import { ColumnType } from 'antd/lib/table';
import { getGoodsLock, setGoodsLock, getGoodsCurrentList, setGoodsMix } from '@/services/goods';
import { IGoodsLockItem, IPublishItem, IGoodsAndSkuItem } from '@/interface/ILocalGoods';
import { utcToLocal } from 'react-components/es/utils/date';
import Lock from './Lock';

import formStyles from 'react-components/es/JsonForm/_form.less';
import styles from '../_version.less';
import SkuModal from './SkuModal/SkuModal';
import useSkuModal from '../hooks/useSkuModal';
import GoodsEditModal from './GoodsEditModal/GoodsEditModal';
import useGoodsEditModal from '../hooks/useGoodsEditModal';

interface IProps {
    commodityId: string;
}

const CurrentPane: React.FC<IProps> = ({ commodityId }) => {
    const currentProductRef = useRef<any>();
    const [loading, setLoading] = useState(false);
    const [goodsList, setGoodsList] = useState<IGoodsAndSkuItem[]>([]);
    const [lockInfo, setLockInfo] = useState<IGoodsLockItem>({
        image_is_lock: false,
        description_is_lock: false,
        title_is_lock: false,
        sku_is_lock: false,
        category_is_lock: false,
    });
    const [applyList, setApplyList] = useState<string[]>([]);
    // 编辑商品
    const { editGoodsStatus, productId, showEditGoods, hideEditGoods } = useGoodsEditModal();
    // 查看sku信息
    const { skuStatus, currentSkuInfo, channelSource, showSkuModal, hideSkuModal } = useSkuModal();

    const conversionData = useCallback(record => {
        const { sku_info, update_time } = record;
        const _update_time = utcToLocal(update_time);
        if (sku_info?.length > 0) {
            return {
                _update_time,
                commodity_id: commodityId,
                ...record,
                ...sku_info[0],
            };
        }
        return {
            _update_time,
            commodity_id: commodityId,
            ...record,
        };
    }, []);

    const _getGoodsCurrentList = useCallback(() => {
        setLoading(true);
        return getGoodsCurrentList(commodityId)
            .then((res: any) => {
                const { crawlerProduct, parentProduct, currentProduct } = res.data;
                const list: IGoodsAndSkuItem[] = [];
                const _currentProduct = conversionData({
                    ...currentProduct,
                    _type: 'current',
                });
                currentProductRef.current = { ..._currentProduct };
                !Array.isArray(crawlerProduct) &&
                    list.push(
                        conversionData({
                            ...crawlerProduct,
                            _type: 'new',
                        }),
                    );
                !Array.isArray(currentProduct) && list.push(_currentProduct);
                !Array.isArray(parentProduct) &&
                    list.push(
                        conversionData({
                            ...parentProduct,
                            _type: 'old',
                        }),
                    );

                setGoodsList(list);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);
    const _getGoodsLock = useCallback(() => {
        getGoodsLock(commodityId).then((res: any) => {
            const {
                categoryIsLock,
                descriptionIsLock,
                imageIsLock,
                skuIsLock,
                titleIsLock,
            } = res.data;
            setLockInfo({
                image_is_lock: imageIsLock === 2 ? true : false,
                description_is_lock: descriptionIsLock === 2 ? true : false,
                title_is_lock: titleIsLock === 2 ? true : false,
                sku_is_lock: skuIsLock === 2 ? true : false,
                category_is_lock: categoryIsLock === 2 ? true : false,
            });
        });
    }, []);
    const _setGoodsLock = useCallback(
        (key: keyof IGoodsLockItem, status) => {
            // image_is_lock
            // sku_is_lock
            const data: IGoodsLockItem = {};
            // [key]: status,
            if (key === 'image_is_lock' || key === 'sku_is_lock') {
                data.image_is_lock = status;
                data.sku_is_lock = status;
            } else {
                data[key] = status;
            }
            setGoodsLock(commodityId, data).then(() => {
                setLockInfo({
                    ...lockInfo,
                    ...data,
                });
                _getGoodsCurrentList();
            });
        },
        [lockInfo],
    );

    const updateApplyToTable = useCallback(
        (field, currentStatus) => {
            setGoodsList(
                goodsList.map(item => {
                    const { _type, origin } = item;
                    if (_type === 'current') {
                        switch (field) {
                            case 'all':
                                if (currentStatus) {
                                    return {
                                        ...currentProductRef.current,
                                        origin,
                                    };
                                } else {
                                    return {
                                        ...goodsList[0],
                                        _type: 'current',
                                        origin,
                                    };
                                }
                            case 'category':
                                if (currentStatus) {
                                    return {
                                        ...item,
                                        first_catagory: currentProductRef.current.first_catagory,
                                        second_catagory: currentProductRef.current.second_catagory,
                                        third_catagory: currentProductRef.current.third_catagory,
                                    };
                                } else {
                                    return {
                                        ...item,
                                        first_catagory: goodsList[0].first_catagory,
                                        second_catagory: goodsList[0].second_catagory,
                                        third_catagory: goodsList[0].third_catagory,
                                    };
                                }
                            case 'price':
                                if (currentStatus) {
                                    return {
                                        ...item,
                                        price_min: currentProductRef.current.price_min,
                                        price_max: currentProductRef.current.price_max,
                                        shipping_fee_min:
                                            currentProductRef.current.shipping_fee_min,
                                        shipping_fee_max:
                                            currentProductRef.current.shipping_fee_max,
                                    };
                                } else {
                                    return {
                                        ...item,
                                        price_min: goodsList[0].price_min,
                                        price_max: goodsList[0].price_max,
                                        shipping_fee_min: goodsList[0].shipping_fee_min,
                                        shipping_fee_max: goodsList[0].shipping_fee_max,
                                    };
                                }
                            default:
                                if (currentStatus) {
                                    return {
                                        ...item,
                                        [field]: currentProductRef.current[field],
                                    };
                                } else {
                                    return {
                                        ...item,
                                        [field]: goodsList[0][field as 'title'],
                                    };
                                }
                        }
                    }
                    return item;
                }),
            );
        },
        [goodsList],
    );

    const applyField = useCallback(
        (field, currentStatus) => {
            if (field === 'all') {
                if (currentStatus) {
                    setApplyList([]);
                } else {
                    setApplyList([
                        'goods_img',
                        'title',
                        'description',
                        'category',
                        'sku_number',
                        'price',
                    ]);
                }
            } else {
                if (currentStatus) {
                    const list = [...applyList];
                    const i = list.findIndex(item => item === field);
                    list.splice(i, 1);
                    setApplyList(list);
                } else {
                    setApplyList([...applyList, field]);
                }
            }
            updateApplyToTable(field, currentStatus);
        },
        [applyList, updateApplyToTable],
    );

    const handleSave = useCallback(() => {
        let release_product_id = '';
        let new_product_id = '';
        let release_origin = '';
        let new_origin = '';
        goodsList.forEach(item => {
            const { _type } = item;
            if (_type === 'current') {
                release_product_id = item.product_id;
                release_origin = item.origin as string;
            } else if (_type === 'new') {
                new_product_id = item.product_id;
                new_origin = item.origin as string;
            }
        });
        if (release_origin === 'MID_STAGE' && new_origin === 'CRAWLER') {
            return setGoodsMix({
                release_product_id,
                new_product_id,
                field: applyList,
                commodity_id: commodityId,
            }).then(() => {
                setApplyList([]);
                _getGoodsLock();
                _getGoodsCurrentList();
            });
        }
        message.error('不符合融合版本');
        return Promise.resolve();
    }, [applyList, goodsList]);

    const handleReset = useCallback(() => {
        setApplyList([]);
        updateApplyToTable('all', true);
    }, [updateApplyToTable]);

    const columns = useMemo<ColumnType<IGoodsAndSkuItem>[]>(() => {
        const {
            image_is_lock,
            description_is_lock,
            title_is_lock,
            sku_is_lock,
            category_is_lock,
        } = lockInfo;
        return [
            {
                fixed: 'left',
                title: '类型',
                dataIndex: '_type',
                width: 140,
                align: 'center',
                render: (val: string, row: IGoodsAndSkuItem) => {
                    const isAllApply = applyList.length === 6;
                    return (
                        <>
                            {val === 'new' && (
                                <div>
                                    <div className={styles.new}>爬虫版本</div>
                                    <Button
                                        type="link"
                                        onClick={() => applyField('all', isAllApply)}
                                    >
                                        {isAllApply ? '全部取消应用' : '全部应用'}
                                    </Button>
                                </div>
                            )}
                            {val === 'current' && (
                                <div>
                                    <div className={styles.current}>当前版本</div>
                                    <Button
                                        type="link"
                                        onClick={() => showEditGoods(row.product_id)}
                                    >
                                        编辑
                                    </Button>
                                </div>
                            )}
                            {val === 'old' && '上一版本'}
                        </>
                    );
                },
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
                dataIndex: 'publish_status',
                align: 'center',
                width: 120,
                render: (value: IPublishItem[]) => {
                    return [...new Set(value.map(item => item.publishChannel))].map(channel => (
                        <div key={channel}>{channel}</div>
                    ));
                },
            },
            {
                title: '销售状态',
                dataIndex: 'inventory_status',
                align: 'center',
                width: 120,
                render: (val: number) => (val == 1 ? '可销售' : '不可销售'),
            },
            {
                title: () => (
                    <>
                        商品图片
                        <span onClick={() => _setGoodsLock('image_is_lock', !image_is_lock)}>
                            <Lock isLock={image_is_lock} className={styles.icon} />
                        </span>
                    </>
                ),
                dataIndex: 'goods_img',
                align: 'center',
                width: 120,
                render: (val: string, row: IGoodsAndSkuItem) => {
                    const { _type } = row;
                    const isCrawlerProduct = _type === 'new';
                    const isApply = applyList.indexOf('goods_img') > -1;
                    const applyText = isApply ? '取消应用' : '应用';
                    return isCrawlerProduct ? (
                        <>
                            <div className={styles.cellBox}>
                                <AutoEnLargeImg src={val} className={styles.goodsImg} />
                            </div>
                            <Button
                                type="link"
                                className={styles.applyBtn}
                                onClick={() => applyField('goods_img', isApply)}
                            >
                                {applyText}
                            </Button>
                        </>
                    ) : (
                        <AutoEnLargeImg src={val} className={styles.goodsImg} />
                    );
                },
            },
            {
                title: () => (
                    <>
                        商品名称
                        <span onClick={() => _setGoodsLock('title_is_lock', !title_is_lock)}>
                            <Lock isLock={title_is_lock} className={styles.icon} />
                        </span>
                    </>
                ),
                dataIndex: 'title',
                width: 160,
                align: 'center',
                render: (val, row: IGoodsAndSkuItem) => {
                    const { _type } = row;
                    const isCrawlerProduct = _type === 'new';
                    const isApply = applyList.indexOf('title') > -1;
                    const applyText = isApply ? '取消应用' : '应用';
                    return isCrawlerProduct ? (
                        <>
                            <div className={styles.cellBox}>{val}</div>
                            <Button
                                type="link"
                                className={styles.applyBtn}
                                onClick={() => applyField('title', isApply)}
                            >
                                {applyText}
                            </Button>
                        </>
                    ) : (
                        val
                    );
                },
            },
            {
                title: () => (
                    <>
                        商品描述
                        <span
                            onClick={() =>
                                _setGoodsLock('description_is_lock', !description_is_lock)
                            }
                        >
                            <Lock isLock={description_is_lock} className={styles.icon} />
                        </span>
                    </>
                ),
                dataIndex: 'description',
                width: 240,
                align: 'center',
                render: (val, row: IGoodsAndSkuItem) => {
                    const { _type } = row;
                    const isCrawlerProduct = _type === 'new';
                    const isApply = applyList.indexOf('description') > -1;
                    const applyText = isApply ? '取消应用' : '应用';
                    return isCrawlerProduct ? (
                        <>
                            <div className={styles.cellBox}>{val}</div>
                            <Button
                                type="link"
                                className={styles.applyBtn}
                                onClick={() => applyField('description', isApply)}
                            >
                                {applyText}
                            </Button>
                        </>
                    ) : (
                        val
                    );
                },
            },
            {
                title: () => (
                    <>
                        商品分类
                        <span onClick={() => _setGoodsLock('category_is_lock', !category_is_lock)}>
                            <Lock isLock={category_is_lock} className={styles.icon} />
                        </span>
                    </>
                ),
                dataIndex: 'first_catagory',
                align: 'center',
                width: 160,
                render: (_, row: IGoodsAndSkuItem) => {
                    const { first_catagory, second_catagory, third_catagory, _type } = row;
                    const val = `${first_catagory.name || ''}-${second_catagory.name ||
                        ''}-${third_catagory.name || ''}`;
                    const isCrawlerProduct = _type === 'new';
                    const isApply = applyList.indexOf('category') > -1;
                    const applyText = isApply ? '取消应用' : '应用';
                    return isCrawlerProduct ? (
                        <>
                            <div className={styles.cellBox}>{val}</div>
                            <Button
                                type="link"
                                className={styles.applyBtn}
                                onClick={() => applyField('category', isApply)}
                            >
                                {applyText}
                            </Button>
                        </>
                    ) : (
                        val
                    );
                },
            },
            {
                title: () => (
                    <>
                        sku数量
                        <span onClick={() => _setGoodsLock('sku_is_lock', !sku_is_lock)}>
                            <Lock isLock={sku_is_lock} className={styles.icon} />
                        </span>
                    </>
                ),
                dataIndex: 'sku_number',
                width: 120,
                align: 'center',
                render: (value: number, row: IGoodsAndSkuItem) => {
                    const { _type } = row;
                    const isCrawlerProduct = _type === 'new';
                    const isApply = applyList.indexOf('sku_number') > -1;
                    const applyText = isApply ? '取消应用' : '应用';
                    const node = (
                        <>
                            <div>{value}</div>
                            <Button
                                type="link"
                                className={styles.link}
                                onClick={() => showSkuModal(row)}
                            >
                                查看sku信息
                            </Button>
                        </>
                    );
                    return isCrawlerProduct ? (
                        <>
                            <div className={styles.cellBox}>{node}</div>
                            <Button
                                type="link"
                                className={styles.applyBtn}
                                onClick={() => applyField('sku_number', isApply)}
                            >
                                {applyText}
                            </Button>
                        </>
                    ) : (
                        node
                    );
                },
            },
            {
                title: '爬虫价格(￥)',
                dataIndex: 'price_min',
                width: 120,
                align: 'center',
                render: (_: string, row: IGoodsAndSkuItem) => {
                    const { price_min, price_max, shipping_fee_min, shipping_fee_max, _type } = row;
                    const isCrawlerProduct = _type === 'new';
                    const isApply = applyList.indexOf('price') > -1;
                    const applyText = isApply ? '取消应用' : '应用';
                    const node = (
                        <>
                            {price_min}~{price_max}
                            <div>
                                (含运费{shipping_fee_min}~{shipping_fee_max})
                            </div>
                        </>
                    );
                    return isCrawlerProduct ? (
                        <>
                            <div className={styles.cellBox}>{node}</div>
                            <Button
                                type="link"
                                className={styles.applyBtn}
                                onClick={() => applyField('price', isApply)}
                            >
                                {applyText}
                            </Button>
                        </>
                    ) : (
                        node
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
    }, [lockInfo, applyList, applyField]);

    useEffect(() => {
        _getGoodsLock();
        _getGoodsCurrentList();
    }, []);

    return useMemo(() => {
        const disabled = applyList.length === 0;
        return (
            <>
                <FitTable
                    bordered
                    rowKey="product_id"
                    loading={loading}
                    columns={columns}
                    dataSource={goodsList}
                    scroll={{ x: 'max-content' }}
                    // columnsSettingRender={true}
                    pagination={false}
                />

                <div className={styles.btnContainer}>
                    <Button
                        className={formStyles.formBtn}
                        onClick={handleReset}
                        disabled={disabled}
                    >
                        重置
                    </Button>
                    <LoadingButton
                        type="primary"
                        className={formStyles.formBtn}
                        onClick={handleSave}
                        disabled={disabled}
                    >
                        保存
                    </LoadingButton>
                </div>
                <GoodsEditModal
                    visible={editGoodsStatus}
                    productId={productId}
                    onCancel={hideEditGoods}
                    onReload={_getGoodsCurrentList}
                />
                <SkuModal
                    visible={skuStatus}
                    channelSource={channelSource}
                    currentSkuInfo={currentSkuInfo}
                    onCancel={hideSkuModal}
                />
            </>
        );
    }, [goodsList, loading, skuStatus, currentSkuInfo, columns, applyList, editGoodsStatus]);
};

export default CurrentPane;

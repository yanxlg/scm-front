import React, { useMemo, useCallback, ReactText, useState, RefObject } from 'react';
import { FitTable, AutoEnLargeImg, LoadingButton, message } from 'react-components';
import { Button } from 'antd';
import {
    IGoodsAndSkuItem,
    ICatagoryItem,
    IPublishItem,
    ISkuInfo,
    IGoodsEditItem,
} from '@/interface/ILocalGoods';
import { Link } from 'umi';
import PopConfirmSetAttr from '../PopConfirmSetAttr/PopConfirmSetAttr';
import { publishStatusCode, publishStatusMap } from '@/enums/LocalGoodsEnum';
import { utcToLocal } from 'react-components/lib/utils/date';
import { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import { PaginationConfig } from 'antd/es/pagination';
import MerchantListModal from '@/pages/goods/components/MerchantListModal';
import {
    getGoodsList,
    postGoodsExports,
    postGoodsOnsale,
    getGoodsDelete,
    IFilterParams,
    getCatagoryList,
    postAllGoodsOnsale,
    getGoodsStatusList,
} from '@/services/goods';
import Export from '@/components/Export';
import { JsonFormRef } from 'react-components/lib/JsonForm';
import ShelvesModal from '../ShelvesModal/ShelvesModal';
import SkuModal from '../SkuModal/SkuModal';
import GoodsMergeModal from '../GoodsMergeModal/GoodsMergeModal';
import GoodsEditModal from '../GoodsEditModal/GoodsEditModal';

import styles from './_GoodsTable.less';
import formStyles from 'react-components/es/JsonForm/_form.less';

interface IProps {
    loading: boolean;
    exportStatus: boolean;
    pageNumber: number;
    pageSize: number;
    total: number;
    goodsList: IGoodsAndSkuItem[];
    selectedRowKeys: string[];
    formRef: RefObject<JsonFormRef>;
    queryRef: RefObject<object>;
    setExportStatus(status: boolean): void;
    setSelectedRowKeys(keys: string[]): void;
    onChange({ current, pageSize }: PaginationConfig, filters: any, sorter: any): Promise<void>;
    onReload(): Promise<void>;
}

const GoodsTable: React.FC<IProps> = ({
    loading,
    exportStatus,
    pageNumber,
    pageSize,
    total,
    goodsList,
    selectedRowKeys,
    formRef,
    setExportStatus,
    setSelectedRowKeys,
    onChange,
    onReload,
    queryRef,
}) => {
    const [merchantStatus, setMerchantStatus] = useState(false);
    const [publistStatus, setPublistStatus] = useState(false);
    const [skuStatus, setSkuStatus] = useState(false);
    const [onsaleType, setOnsaleType] = useState<'default' | 'all'>('default');
    const [publistList, setPublistList] = useState<IPublishItem[]>([]);
    const [currentSkuInfo, setCurrentSkuInfo] = useState<ISkuInfo | null>(null);
    // 关联商品
    const [mergeStatus, setMergeStatus] = useState(false);
    const [commodityId, setCommodityId] = useState('');
    const [productSn, setProductSn] = useState('');
    // 编辑商品
    const [editGoodsStatus, setEditGoodsStatus] = useState(false);
    const [editGoodsInfo, setEditGoodsInfo] = useState<IGoodsEditItem | null>(null);

    // 一键上架
    const _postGoodsOnsale = useCallback((merchants_id: string[], selectedRowKeys: string[]) => {
        return postGoodsOnsale({
            scm_goods_id: selectedRowKeys,
            merchants_id: merchants_id.join(','),
        }).then(() => {
            onReload();
            message.success('上架任务已发送');
        });
    }, []);

    // 查询商品一键上架
    const _postAllGoodsOnsale = useCallback((merchants_id: string[]) => {
        const searchParams = {
            merchants_id: merchants_id.join(','),
            ...formRef.current?.getFieldsValue(),
        };
        return postAllGoodsOnsale(searchParams).then(() => {
            onReload();
            message.success('查询商品一键上架成功');
        });
    }, []);

    // 删除商品
    const _getGoodsDelete = useCallback(() => {
        return getGoodsDelete({
            commodity_ids: [
                ...new Set(
                    selectedRowKeys.map(productId => {
                        const index = goodsList.findIndex(item => item.product_id === productId);
                        return goodsList[index].commodity_id;
                    }),
                ),
            ],
        }).then((res: any) => {
            onReload();
            const { success, failed } = res.data;
            let str = '';
            if (success.length) {
                str += `删除成功${success.join('、')}。`;
            } else if (failed.length) {
                str += `删除失败${failed.map((item: any) => item.id).join('、')}。`;
            }
            message.info(str);
        });
    }, [selectedRowKeys, goodsList]);

    const merchantOkey = useCallback(
        (merchants_id: string[]) => {
            return onsaleType === 'default'
                ? _postGoodsOnsale(merchants_id, selectedRowKeys)
                : _postAllGoodsOnsale(merchants_id);
        },
        [onsaleType, selectedRowKeys],
    );

    const merchantCancel = useCallback(() => {
        setMerchantStatus(false);
    }, []);

    const onSelectedRowKeysChange = useCallback((selectedKeys: ReactText[]) => {
        // console.log('selectedKeys', selectedKeys);
        setSelectedRowKeys(selectedKeys as string[]);
    }, []);

    const toolBarRender = useCallback(() => {
        const handleClickOnsale = () => {
            setMerchantStatus(true);
            setOnsaleType('default');
        };

        const handleClickAllOnsale = () => {
            setMerchantStatus(true);
            setOnsaleType('all');
        };
        const disabled = selectedRowKeys.length === 0;
        return [
            <Button
                key="1"
                type="primary"
                className={formStyles.formBtn}
                onClick={handleClickOnsale}
                disabled={disabled}
            >
                一键上架
            </Button>,
            <Button
                key="2"
                type="primary"
                className={formStyles.formBtn}
                onClick={handleClickAllOnsale}
            >
                查询商品一键上架
            </Button>,
            <LoadingButton
                key="3"
                className={formStyles.formBtn}
                onClick={_getGoodsDelete}
                disabled={disabled}
            >
                删除
            </LoadingButton>,
        ];
    }, [selectedRowKeys, _getGoodsDelete]);

    const handleExportOkey = useCallback(values => {
        return postGoodsExports({
            ...values,
            ...queryRef.current,
        });
    }, []);

    const handleExportCancel = useCallback(() => {
        setExportStatus(false);
    }, []);

    const showGoodsPublist = useCallback(publistList => {
        setPublistStatus(true);
        setPublistList(
            publistList.map(
                (item: IPublishItem, index: number): IPublishItem => {
                    return {
                        ...item,
                        serialNum: index + 1,
                    };
                },
            ),
        );
    }, []);

    const hideGoodsPublist = useCallback(() => {
        setPublistStatus(false);
        setPublistList([]);
    }, []);

    const showEditGoods = useCallback((record: IGoodsAndSkuItem) => {
        // console.log('showEditGoods', record);
        const {
            product_id,
            title,
            description,
            first_catagory,
            second_catagory,
            third_catagory,
            goods_img,
            sku_image,
        } = record;
        setEditGoodsStatus(true);
        const list = [...sku_image];
        const index = list.findIndex(img => img === goods_img);
        if (index > -1) {
            list.splice(index, 1);
            list.unshift(goods_img);
        }
        setEditGoodsInfo({
            product_id,
            title,
            description,
            first_catagory,
            second_catagory,
            third_catagory,
            goods_img,
            sku_image: list,
        });
    }, []);

    const hideEditGoods = useCallback(() => {
        setEditGoodsStatus(false);
    }, []);

    const showSkuModal = useCallback(record => {
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
            commodity_id,
        } = record;
        setSkuStatus(true);
        setCurrentSkuInfo({
            tags,
            product_id,
            goods_img,
            title,
            worm_goodsinfo_link,
            worm_goods_id,
            first_catagory,
            second_catagory,
            third_catagory,
            commodity_id,
        });
    }, []);

    const hideSkuModal = useCallback(() => {
        setSkuStatus(false);
        setCurrentSkuInfo(null);
    }, []);

    const showMergeModal = useCallback((commodity_id, product_sn) => {
        setMergeStatus(true);
        setCommodityId(commodity_id);
        setProductSn(product_sn !== '0' ? product_sn : '');
    }, []);

    const hideMergeModal = useCallback(() => {
        setMergeStatus(false);
        setCommodityId('');
        setProductSn('');
    }, []);

    const columns = useMemo<ColumnsType<IGoodsAndSkuItem>>(() => {
        return [
            {
                fixed: 'left',
                key: '_operation',
                title: '操作',
                align: 'center',
                width: 156,
                render: (_: any, row: IGoodsAndSkuItem) => {
                    const { goods_status } = row;
                    return (
                        <>
                            <div>
                                {goods_status !== 'FROZEN' && (
                                    <Button type="link" onClick={() => showEditGoods(row)}>
                                        编辑商品
                                    </Button>
                                )}
                            </div>
                            <div style={{ marginTop: -6 }}>
                                <Link to={`/goods/local/${row.commodity_id}`}>
                                    <Button type="link">查看更多版本</Button>
                                </Link>
                            </div>
                        </>
                    );
                },
            },
            {
                key: 'commodity_id',
                title: 'Commodity ID',
                dataIndex: 'commodity_id',
                align: 'center',
                width: 140,
            },
            {
                key: 'product_id',
                title: 'Product ID',
                dataIndex: 'product_id',
                align: 'center',
                width: 120,
                render: (value: string, row: IGoodsAndSkuItem) => {
                    return <div className={row.hasnew_version ? 'red' : ''}>{value}</div>;
                },
            },
            {
                key: 'product_sn',
                title: 'Product SN',
                dataIndex: 'product_sn',
                align: 'center',
                width: 140,
                render: (value: string, row: IGoodsAndSkuItem) => {
                    const _value = value !== '0' ? value : '';
                    const { commodity_id, product_sn } = row;
                    return (
                        <>
                            <div>{_value}</div>
                            <Button
                                type="link"
                                onClick={() => showMergeModal(commodity_id, product_sn)}
                            >
                                {_value ? '查看商品组' : '关联商品'}
                            </Button>
                        </>
                    );
                },
            },
            {
                key: 'goods_status',
                title: '版本状态',
                dataIndex: 'goods_status',
                align: 'center',
                width: 110,
            },
            {
                key: 'inventory_status',
                title: '销售状态',
                dataIndex: 'inventory_status',
                align: 'center',
                width: 100,
                render: (value: number) => {
                    return value === 1 ? '可销售' : '不可销售';
                },
            },
            {
                key: 'goods_img',
                title: '商品图片',
                dataIndex: 'goods_img',
                align: 'center',
                width: 120,
                render: (value: string, row: IGoodsAndSkuItem) => {
                    return <AutoEnLargeImg src={value} className={styles.img} />;
                },
            },
            {
                key: 'title',
                title: '商品名称',
                dataIndex: 'title',
                align: 'center',
                width: 200,
                render: (value: string, row: IGoodsAndSkuItem) => {
                    return <div className="text">{value}</div>;
                },
            },
            {
                key: 'tags',
                title: '商品属性',
                dataIndex: 'tags',
                align: 'center',
                width: 200,
                render: (value: string[], row: IGoodsAndSkuItem) => {
                    const { commodity_id, product_id } = row;
                    return (
                        <div>
                            <div>
                                {value.map(item => (
                                    <Button
                                        size="small"
                                        key={item}
                                        style={{ marginRight: 4, marginBottom: 4 }}
                                    >
                                        {item}
                                    </Button>
                                ))}
                            </div>
                            <PopConfirmSetAttr
                                tags={value}
                                commodityId={commodity_id}
                                productId={product_id}
                                onReload={onReload}
                            />
                        </div>
                    );
                },
            },
            {
                key: 'first_catagory',
                title: '商品分类',
                dataIndex: 'first_catagory',
                align: 'center',
                width: 120,
                render: (value: ICatagoryItem, row: IGoodsAndSkuItem) => {
                    const { second_catagory, third_catagory } = row;
                    return (
                        <div>{third_catagory.name || second_catagory.name || value.name || ''}</div>
                    );
                },
            },
            {
                key: 'sku_number',
                title: 'sku数量',
                dataIndex: 'sku_number',
                align: 'center',
                width: 140,
                render: (value: number, row: IGoodsAndSkuItem) => {
                    return (
                        <>
                            <div>{value}</div>
                            <Button
                                type="link"
                                // className="goods-local-img-edit"
                                onClick={() => showSkuModal(row)}
                            >
                                查看sku信息
                            </Button>
                        </>
                    );
                },
            },
            {
                key: 'price_min',
                width: 140,
                title: '爬虫价格(￥)',
                dataIndex: 'price_min',
                align: 'center',
                render: (value: number, row: IGoodsAndSkuItem) => {
                    const { price_min, price_max, shipping_fee_min, shipping_fee_max } = row;
                    return (
                        <div>
                            {price_min}~{price_max}
                            <div>
                                (含运费{shipping_fee_min}~{shipping_fee_max})
                            </div>
                        </div>
                    );
                },
            },
            {
                key: 'sales_volume',
                title: '销量',
                dataIndex: 'sales_volume',
                align: 'center',
                width: 100,
            },
            {
                key: 'comments',
                title: '评价数量',
                dataIndex: 'comments',
                align: 'center',
                width: 100,
            },
            {
                key: 'store_id',
                title: '店铺 id',
                dataIndex: 'store_id',
                align: 'center',
                width: 110,
            },
            {
                key: 'store_name',
                title: '店铺名称',
                dataIndex: 'store_name',
                align: 'center',
                width: 140,
            },
            {
                key: 'worm_task_id',
                title: '爬虫任务ID',
                dataIndex: 'worm_task_id',
                align: 'center',
                width: 120,
            },
            {
                key: 'worm_goods_id',
                title: '爬虫商品ID',
                dataIndex: 'worm_goods_id',
                align: 'center',
                width: 120,
            },
            {
                key: 'publish_status',
                title: '上架渠道',
                dataIndex: 'publish_status',
                align: 'center',
                width: 160,
                render: (value: IPublishItem[], row: IGoodsAndSkuItem, index: number) => {
                    const channelInfo: { [key: string]: IPublishItem } = {};
                    value?.forEach(item => {
                        const { publishChannel, publishStore } = item;
                        const key = `${publishStore}_${publishChannel}`;
                        if (!channelInfo[key]) {
                            channelInfo[key] = item;
                        }
                    });
                    const keys = Object.keys(channelInfo);
                    return keys.length > 0 ? (
                        <>
                            {keys.map(key => {
                                const { publishStatus, publishChannel, publishStore } = channelInfo[
                                    key
                                ];
                                const _publishStatus = (publishStatus
                                    ? publishStatus
                                    : 0) as publishStatusCode;
                                return (
                                    <div key={key}>
                                        <div>
                                            {publishChannel}-{publishStore}
                                        </div>
                                        <div>({publishStatusMap[_publishStatus]})</div>
                                    </div>
                                );
                            })}
                            <Button type="link" onClick={() => showGoodsPublist(value)}>
                                上架日志
                            </Button>
                        </>
                    ) : null;
                },
            },
            {
                key: 'update_time',
                title: '更新时间',
                dataIndex: 'update_time',
                align: 'center',
                width: 120,
                render: (value: number) => {
                    return <div>{utcToLocal(value)}</div>;
                },
            },
            {
                key: 'create_time',
                title: '上传时间',
                dataIndex: 'create_time',
                align: 'center',
                width: 120,
                render: (value: number) => {
                    return <div>{utcToLocal(value)}</div>;
                },
            },
            {
                key: 'worm_goodsinfo_link',
                title: '商详链接',
                dataIndex: 'worm_goodsinfo_link',
                align: 'center',
                width: 200,
                render: (value: string, row: IGoodsAndSkuItem) => {
                    return (
                        <a href={value} target="_blank">
                            {value}
                        </a>
                    );
                },
            },
        ];
    }, []);

    const pagination = useMemo<TablePaginationConfig>(() => {
        return {
            current: pageNumber,
            pageSize: pageSize,
            total: total,
            showSizeChanger: true,
            position: ['topRight', 'bottomRight'],
        };
    }, [loading]);

    const rowSelection = useMemo(() => {
        return {
            fixed: true,
            columnWidth: 60,
            selectedRowKeys: selectedRowKeys,
            onChange: onSelectedRowKeysChange,
        };
    }, [selectedRowKeys]);

    return useMemo(() => {
        // console.log('selectedRowKeys-1111111', selectedRowKeys);
        return (
            <>
                <FitTable
                    bordered
                    rowKey="product_id"
                    loading={loading}
                    columns={columns}
                    rowSelection={rowSelection}
                    dataSource={goodsList}
                    scroll={{ x: 'max-content' }}
                    columnsSettingRender={true}
                    pagination={pagination}
                    onChange={onChange}
                    toolBarRender={toolBarRender}
                />
                <MerchantListModal
                    visible={merchantStatus}
                    onOKey={merchantOkey}
                    onCancel={merchantCancel}
                />
                <Export
                    columns={columns}
                    visible={exportStatus}
                    // onOKey
                    onOKey={handleExportOkey}
                    onCancel={handleExportCancel}
                />
                <ShelvesModal
                    visible={publistStatus}
                    publishStatusList={publistList}
                    onCancel={hideGoodsPublist}
                />
                <SkuModal
                    visible={skuStatus}
                    currentSkuInfo={currentSkuInfo}
                    onCancel={hideSkuModal}
                />
                <GoodsMergeModal
                    visible={mergeStatus}
                    commodityId={commodityId}
                    productSn={productSn}
                    onReload={onReload}
                    onCancel={hideMergeModal}
                />
                <GoodsEditModal
                    visible={editGoodsStatus}
                    currentGoodsInfo={editGoodsInfo}
                    onCancel={hideEditGoods}
                />
            </>
        );
    }, [
        loading,
        selectedRowKeys,
        merchantStatus,
        exportStatus,
        publistStatus,
        skuStatus,
        mergeStatus,
        editGoodsStatus,
    ]);
};

export default GoodsTable;

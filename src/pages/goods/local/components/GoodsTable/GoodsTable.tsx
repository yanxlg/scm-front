import React, { useMemo, useCallback, ReactText, useState, RefObject, useEffect } from 'react';
import { FitTable, AutoEnLargeImg, LoadingButton, message, useModal2 } from 'react-components';
import { Button } from 'antd';
import { IGoodsAndSkuItem, ICatagoryItem, IPublishItem } from '@/interface/ILocalGoods';
import { Link } from 'umi';
import PopConfirmSetAttr from '../PopConfirmSetAttr/PopConfirmSetAttr';
import { publishStatusCode, publishStatusMap } from '@/enums/LocalGoodsEnum';
import { utcToLocal } from 'react-components/es/utils/date';
import { ColumnsType } from 'antd/es/table';
import MerchantListModal from '@/pages/goods/components/MerchantListModal';
import {
    postGoodsExports,
    postGoodsOnsale,
    getGoodsDelete,
    postAllGoodsOnsale,
} from '@/services/goods';
import Export from '@/components/Export';
import { JsonFormRef } from 'react-components/es/JsonForm';
import ShelvesModal from '../ShelvesModal/ShelvesModal';
import SkuModal from '../SkuModal/SkuModal';
import GoodsMergeModal from '../GoodsMergeModal/GoodsMergeModal';
import GoodsEditModal from '../GoodsEditModal/GoodsEditModal';
import useSkuModal from '../../hooks/useSkuModal';
import useGoodsEditModal from '../../hooks/useGoodsEditModal';
import CountryFreightModal from '../CountryFreightModal/CountryFreightModal';

import styles from './_GoodsTable.less';
import formStyles from 'react-components/es/JsonForm/_form.less';
import { GoodsSourceEnum } from '@/enums/GlobalEnum';
import { PaginationConfig } from 'react-components/es/FitTable';
import GoodsTagsModal from '@/pages/goods/local/components/GoodsTagsModal';
import useCountryFreightModal from '../../hooks/useCountryFreightModal';
import { queryShopList } from '@/services/global';
import { ISHopList } from '@/interface/IGlobal';

interface IProps {
    loading: boolean;
    exportStatus: boolean;
    pageNumber: number;
    pageSize: number;
    total: number;
    sourceChannel: string;
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
    sourceChannel,
    goodsList,
    selectedRowKeys,
    formRef,
    setExportStatus,
    setSelectedRowKeys,
    onChange,
    onReload,
    queryRef,
}) => {
    const [publistStatus, setPublistStatus] = useState(false);
    const [publistList, setPublistList] = useState<IPublishItem[]>([]);
    // 上架商品
    const [merchantStatus, setMerchantStatus] = useState(false);
    const [onsaleType, setOnsaleType] = useState<'default' | 'all'>('default');
    const [disabledChannelList, setDisabledChannelList] = useState<string[]>([]);
    const [disabledShopList, setDisabledShopList] = useState<string[]>([]);
    // 关联商品
    const [mergeStatus, setMergeStatus] = useState(false);
    const [commodityId, setCommodityId] = useState('');
    const [productSn, setProductSn] = useState('');
    // 编辑商品
    const {
        editGoodsStatus,
        showEditGoods,
        hideEditGoods,
        productId,
        setProductId,
    } = useGoodsEditModal();
    // 查看sku信息
    const { skuStatus, currentSkuInfo, channelSource, showSkuModal, hideSkuModal } = useSkuModal();
    // 查看国家运费
    const {
        countryFreightStatus,
        countryFreightId,
        showCountryFreight,
        hideCountryFreight,
    } = useCountryFreightModal();
    // 店铺列表
    const [shopList, setShopList] = useState<ISHopList>([]);

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

    const _queryShopList = useCallback(() => {
        return queryShopList().then(res => {
            // console.log('111111', res);
            setShopList(res.data);
        });
    }, []);

    const merchantOkey = useCallback(
        (merchants_id: string[]) => {
            return onsaleType === 'default'
                ? _postGoodsOnsale(merchants_id, selectedRowKeys)
                : _postAllGoodsOnsale(merchants_id);
        },
        [onsaleType, selectedRowKeys],
    );

    const showMerchantModal = useCallback(() => {
        // {1: "pdd", 2: "vova"}
        setMerchantStatus(true);
        // console.log('111111', formRef.current?.getFieldsValue());
        const { source_channel } = formRef.current?.getFieldsValue() as any;
        if (!source_channel) {
            return;
        }
        if (source_channel === GoodsSourceEnum.VOVA) {
            setDisabledChannelList(['vova']);
            setDisabledShopList([]);
        } else if (source_channel === GoodsSourceEnum.FD) {
            setDisabledChannelList([]);
            setDisabledShopList(
                shopList
                    .filter(item => item.merchant_name !== 'VogueFD')
                    .map(item => item.merchant_name),
            );
        } else {
            setDisabledChannelList([]);
            setDisabledShopList([]);
        }
    }, [shopList]);

    const merchantCancel = useCallback(() => {
        setMerchantStatus(false);
    }, []);

    const onSelectedRowKeysChange = useCallback((selectedKeys: ReactText[]) => {
        setSelectedRowKeys(selectedKeys as string[]);
    }, []);

    const [modal, showModal, closeModal] = useModal2<Array<string>>();

    const toolBarRender = useCallback(() => {
        const handleClickOnsale = () => {
            showMerchantModal();
            setOnsaleType('default');
        };

        const handleClickAllOnsale = () => {
            showMerchantModal();
            setOnsaleType('all');
        };
        const disabled = selectedRowKeys.length === 0;
        return [
            <Button
                key="1"
                type="primary"
                className={formStyles.formBtn}
                onClick={handleClickOnsale}
                disabled={disabled || !sourceChannel}
            >
                一键上架
            </Button>,
            <Button
                ghost
                key="2"
                type="primary"
                className={formStyles.formBtn}
                onClick={handleClickAllOnsale}
                disabled={!sourceChannel}
            >
                查询商品一键上架
            </Button>,
            <Button
                key="4"
                type="primary"
                className={formStyles.formBtn}
                onClick={() => showModal(selectedRowKeys)}
                disabled={disabled}
            >
                修改商品属性
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
    }, [selectedRowKeys, sourceChannel, _getGoodsDelete]);

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
                title: '操作',
                dataIndex: '_operation',
                align: 'center',
                width: 156,
                render: (_: any, row: IGoodsAndSkuItem) => {
                    const { goods_status, product_id } = row;
                    return (
                        <>
                            <div>
                                {goods_status !== 'FROZEN' && (
                                    <Button type="link" onClick={() => showEditGoods(product_id)}>
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
                title: 'Commodity ID',
                dataIndex: 'commodity_id',
                align: 'center',
                width: 140,
            },
            {
                title: 'Product ID',
                dataIndex: 'product_id',
                align: 'center',
                width: 120,
                render: (value: string, row: IGoodsAndSkuItem) => {
                    return <div className={row.hasnew_version ? 'red' : ''}>{value}</div>;
                },
            },
            // {
            //     key: 'product_sn',
            //     title: 'Product SN',
            //     dataIndex: 'product_sn',
            //     align: 'center',
            //     width: 140,
            //     render: (value: string, row: IGoodsAndSkuItem) => {
            //         const _value = value !== '0' ? value : '';
            //         const { commodity_id, product_sn } = row;
            //         return (
            //             <>
            //                 <div>{_value}</div>
            //                 <Button
            //                     type="link"
            //                     onClick={() => showMergeModal(commodity_id, product_sn)}
            //                 >
            //                     {_value ? '查看商品组' : '关联商品'}
            //                 </Button>
            //             </>
            //         );
            //     },
            // },
            {
                title: '版本状态',
                dataIndex: 'goods_status',
                align: 'center',
                width: 110,
            },
            {
                title: '销售状态',
                dataIndex: 'inventory_status',
                align: 'center',
                width: 100,
                render: (value: number) => {
                    return value === 1 ? '可销售' : '不可销售';
                },
            },
            {
                title: '商品图片',
                dataIndex: 'goods_img',
                align: 'center',
                width: 120,
                render: (value: string, row: IGoodsAndSkuItem) => {
                    return <AutoEnLargeImg src={value} className={styles.img} />;
                },
            },
            {
                title: '商品名称',
                dataIndex: 'title',
                align: 'center',
                width: 200,
                render: (value: string, row: IGoodsAndSkuItem) => {
                    return <div className="text">{value}</div>;
                },
            },
            {
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
                width: 140,
                title: '爬虫价格(￥)',
                dataIndex: 'price_min',
                align: 'center',
                render: (value: number, row: IGoodsAndSkuItem) => {
                    const {
                        price_min,
                        price_max,
                        shipping_fee_min,
                        shipping_fee_max,
                        source_channel,
                        product_id,
                    } = row;
                    return (
                        <div>
                            {price_min}~{price_max}
                            <div>
                                (含运费{shipping_fee_min}~{shipping_fee_max})
                            </div>
                            {source_channel !== 'pdd' ? (
                                <a onClick={() => showCountryFreight(product_id)}>更多国家价格</a>
                            ) : null}
                        </div>
                    );
                },
            },
            {
                title: '销量',
                dataIndex: 'sales_volume',
                align: 'center',
                width: 100,
            },
            {
                title: '评价数量',
                dataIndex: 'comments',
                align: 'center',
                width: 100,
            },
            {
                title: '店铺 id',
                dataIndex: 'store_id',
                align: 'center',
                width: 110,
            },
            {
                title: '店铺名称',
                dataIndex: 'store_name',
                align: 'center',
                width: 140,
            },
            {
                title: '爬虫任务ID',
                dataIndex: 'worm_task_id',
                align: 'center',
                width: 120,
            },
            {
                title: '爬虫商品ID',
                dataIndex: 'worm_goods_id',
                align: 'center',
                width: 120,
            },
            {
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
                title: '更新时间',
                dataIndex: 'update_time',
                align: 'center',
                width: 120,
                render: (value: number) => {
                    return <div>{utcToLocal(value)}</div>;
                },
            },
            {
                title: '上传时间',
                dataIndex: 'create_time',
                align: 'center',
                width: 120,
                render: (value: number) => {
                    return <div>{utcToLocal(value)}</div>;
                },
            },
            {
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
            {
                title: '商品渠道来源',
                dataIndex: 'source_channel',
                align: 'center',
                width: 120,
            },
        ];
    }, []);

    const pagination = useMemo(() => {
        return {
            current: pageNumber,
            pageSize: pageSize,
            total: total,
            showSizeChanger: true,
            position: ['topRight', 'bottomRight'],
        } as any;
    }, [loading]);

    const rowSelection = useMemo(() => {
        return {
            fixed: true,
            columnWidth: 60,
            selectedRowKeys: selectedRowKeys,
            onChange: onSelectedRowKeysChange,
        };
    }, [selectedRowKeys]);

    const GoodsTagsUpdateModal = useMemo(() => {
        return (
            <GoodsTagsModal
                visible={
                    modal === false
                        ? false
                        : goodsList.filter(({ product_id }) => modal.indexOf(product_id) > -1)
                }
                onClose={closeModal}
                onReload={onReload}
            />
        );
    }, [modal]);

    useEffect(() => {
        _queryShopList();
    }, []);

    return useMemo(() => {
        return (
            <>
                <FitTable
                    bordered={true}
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
                    disabledChannelList={disabledChannelList}
                    disabledShopList={disabledShopList}
                    onOKey={merchantOkey}
                    onCancel={merchantCancel}
                />
                <Export
                    columns={columns.filter((item: any) => item.dataIndex[0] !== '_')}
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
                    channelSource={channelSource}
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
                    productId={productId}
                    onCancel={hideEditGoods}
                    onReload={onReload}
                />
                <CountryFreightModal
                    visible={countryFreightStatus}
                    productId={countryFreightId}
                    onCancel={hideCountryFreight}
                />
                {GoodsTagsUpdateModal}
            </>
        );
    }, [
        loading,
        productId,
        selectedRowKeys,
        merchantStatus,
        exportStatus,
        publistStatus,
        skuStatus,
        mergeStatus,
        editGoodsStatus,
        countryFreightStatus,
        modal,
        toolBarRender,
    ]);
};

export default GoodsTable;

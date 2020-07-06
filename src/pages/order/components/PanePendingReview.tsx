import React, { useMemo, useRef, useCallback, useState, useEffect } from 'react';
import { Button, notification } from 'antd';
import {
    JsonForm,
    LoadingButton,
    FitTable,
    useModal,
    useList,
    AutoEnLargeImg,
} from 'react-components';
import { JsonFormRef, FormField } from 'react-components/es/JsonForm';
import { IReviewSearch, IReviewOrderItem } from '@/interface/IOrder';
import {
    getReviewOrderList,
    postExportReview,
    delChannelOrders,
    postReviewPass,
    postOrderOffsale,
    getOrderGoodsDetail,
    queryShopList,
} from '@/services/order-manage';
import { utcToLocal } from 'react-components/es/utils/date';
import { ColumnsType } from 'antd/es/table';
import Export from '@/components/Export';
import CancelOrder from './CancelOrder';

import formStyles from 'react-components/es/JsonForm/_form.less';
import { defaultOptionItem1 } from '@/enums/OrderEnum';
import { getCategoryList } from '@/services/global';
import { getCategoryLowestLevel, getCategoryName } from '@/utils/utils';
import { IOptionItem } from 'react-components/es/JsonForm/items/Select';

declare interface IProps {
    getAllTabCount(): void;
}

const formFields: FormField[] = [
    {
        type: 'dateRanger',
        name: ['order_time_start', 'order_time_end'],
        label: '订单生成时间',
        className: 'order-date-picker',
        formatter: ['start_date', 'end_date'],
    },
    {
        type: 'textarea',
        name: 'order_goods_id',
        label: '子订单ID',
        className: 'order-input-review',
        placeholder: '请输入',
        formatter: 'multipleToArray',
    },
    {
        type: 'select',
        name: 'product_shop',
        label: '销售店铺名称',
        className: 'order-input-review',
        syncDefaultOption: defaultOptionItem1,
        optionList: () =>
            queryShopList().then(({ data = [] }) => {
                return data.map((item: any) => {
                    const { merchant_name } = item;
                    return {
                        name: merchant_name,
                        value: merchant_name,
                    };
                });
            }),
    },
    {
        type: 'textarea',
        name: 'channel_order_goods_sn',
        label: '销售订单ID',
        className: 'order-input-review',
        placeholder: '请输入',
        formatter: 'multipleToArray',
    },
    {
        type: 'select',
        label: '一级类目',
        key: 'first_category',
        name: 'first_category',
        className: 'order-input',
        initialValue: '',
        syncDefaultOption: defaultOptionItem1,
        optionList: () => getCategoryList(),
        onChange: (name, form) => {
            form.resetFields(['second_category']);
            form.resetFields(['third_category']);
        },
    },
    {
        type: 'select',
        label: '二级类目',
        key: 'second_category',
        name: 'second_category',
        className: 'order-input',
        initialValue: '',
        optionListDependence: {
            name: 'first_category',
            key: 'children',
        },
        syncDefaultOption: defaultOptionItem1,
        optionList: () => getCategoryList(),
        onChange: (name, form) => {
            form.resetFields(['third_category']);
        },
    },
    {
        type: 'select',
        label: '三级类目',
        key: 'third_category',
        name: 'third_category',
        className: 'order-input',
        initialValue: '',
        optionListDependence: {
            name: ['first_category', 'second_category'],
            key: 'children',
        },
        syncDefaultOption: defaultOptionItem1,
        optionList: () => getCategoryList(),
    },
];

const initialValues = {
    product_shop: '',
};

const PanePendingReview: React.FC<IProps> = ({ getAllTabCount }) => {
    const formRef = useRef<JsonFormRef>(null);
    const categoryRef = useRef<IOptionItem[]>([]);
    const [allCategoryList, setAllCategoryList] = useState<IOptionItem[]>([]);
    const {
        dataSource,
        loading,
        queryRef,
        onSearch,
        total,
        pageSize,
        pageNumber,
        onChange,
        onReload,
        selectedRowKeys,
        setSelectedRowKeys,
    } = useList({
        queryList: getReviewOrderList,
        formRef: formRef,
        convertQuery: (query: any) => {
            // console.log('query', query);
            const {
                first_category = '',
                second_category = '',
                third_category = '',
                ...rest
            } = query;
            return {
                ...rest,
                three_level_catogry_code: getCategoryLowestLevel(
                    categoryRef.current,
                    first_category,
                    second_category,
                    third_category,
                ),
            };
        },
    });
    const { visible, setVisibleProps, onClose } = useModal<boolean>();

    useEffect(() => {
        getCategoryList().then(list => {
            categoryRef.current = list;
            setAllCategoryList(list);
        });
    }, []);

    const orderList = useMemo(() => {
        const list: IReviewOrderItem[] = [];
        dataSource.forEach(({ orderGoods }: any) => {
            const {
                createTime,
                orderGoodsId,
                productImage,
                productStyle,
                goodsNumber,
                freight,
                goodsAmount,
                productShop,
                channelOrderGoodsSn,
                productName,
                productId,
                commodityId,
                threeLevelCatogryCode,
            } = orderGoods;
            // const {

            // } = orderInfo;
            list.push({
                createTime,
                orderGoodsId,
                productImage,
                productStyle,
                goodsNumber,
                freight,
                goodsAmount,
                productShop,
                channelOrderGoodsSn,
                productName,
                productId,
                commodityId,
                threeLevelCatogryCode,
            });
        });
        return list;
    }, [dataSource]);

    const batchOperateSuccess = useCallback((name: string = '', list: string[]) => {
        getAllTabCount();
        notification.success({
            message: `${name}成功`,
            description: (
                <div>
                    {list.map((item: string) => (
                        <div key={item}>{item}</div>
                    ))}
                </div>
            ),
        });
    }, []);

    const batchOperateFail = useCallback(
        (name: string = '', list: { order_goods_id: string; result: string }[]) => {
            notification.error({
                message: `${name}失败`,
                description: (
                    <div>
                        {list.map((item: any) => (
                            <div>
                                {item.order_goods_id}: {item.result.slice(0, 50)}
                            </div>
                        ))}
                    </div>
                ),
            });
        },
        [],
    );

    // 审核通过
    const _postReviewPass = useCallback((orderGoodsIds: string[]) => {
        return postReviewPass({
            order_goods_ids: orderGoodsIds,
        }).then(res => {
            // console.log('postReviewPass', res);
            onReload();
            const { success, failed } = res.data;
            if (success!.length) {
                batchOperateSuccess('审核通过', success);
            }
            if (failed!.length) {
                batchOperateFail(
                    '审核通过',
                    failed.map(({ orderGoodsId, msg }: any) => ({
                        order_goods_id: orderGoodsId,
                        result: msg,
                    })),
                );
            }
        });
    }, []);

    // 下架商品
    const _postOrderOffsale = useCallback((orderGoodsIds: string[]) => {
        return postOrderOffsale({
            order_goods_ids: orderGoodsIds,
        }).then(res => {
            // console.log('postOrderOffsale', res);
            onReload();
            // failed
            const { success } = res.data;
            if (success!.length) {
                batchOperateSuccess('下架商品', [
                    ...new Set(success.map((item: any) => item.product_id)),
                ] as string[]);
            }
            // if (failed!.length) {
            //     batchOperateFail('下架商品', [...new Set(failed.map((item: any) => item.product_id))] as string[]);
            // }
        });
    }, []);

    // 获取跳转链接
    const _getOrderGoodsDetail = useCallback((productId: string) => {
        return getOrderGoodsDetail(productId).then(res => {
            // console.log('getOrderGoodsDetail', res);
            const { worm_goodsinfo_link } = res.data;
            window.open(worm_goodsinfo_link);
        });
    }, []);

    const _postExportReview = useCallback((values: any) => {
        // console.log('_postExportReview', values, queryRef.current);
        return postExportReview({
            ...values,
            query: queryRef.current,
            module: 3,
            type: 9,
        });
    }, []);

    const search = useMemo(() => {
        return (
            <JsonForm
                ref={formRef}
                fieldList={formFields}
                labelClassName="order-label"
                initialValues={initialValues}
            >
                <div>
                    <LoadingButton type="primary" className={formStyles.formBtn} onClick={onSearch}>
                        查询
                    </LoadingButton>
                    <LoadingButton className={formStyles.formBtn} onClick={onReload}>
                        刷新
                    </LoadingButton>
                    <Button
                        disabled={total <= 0}
                        className={formStyles.formBtn}
                        onClick={() => setVisibleProps(true)}
                    >
                        导出
                    </Button>
                </div>
            </JsonForm>
        );
    }, [loading]);

    const columns = useMemo<ColumnsType<IReviewOrderItem>>(() => {
        return [
            {
                title: '操作',
                dataIndex: '_',
                align: 'center',
                width: 120,
                render: (_, row: IReviewOrderItem) => {
                    const { orderGoodsId } = row;
                    return (
                        <>
                            <div>
                                <a onClick={() => _postReviewPass([orderGoodsId])}>审核通过</a>
                            </div>
                            <div style={{ margin: '2px 0' }}>
                                <CancelOrder
                                    orderGoodsIds={[orderGoodsId]}
                                    onReload={onReload}
                                    getAllTabCount={getAllTabCount}
                                >
                                    <a>取消订单</a>
                                </CancelOrder>
                            </div>
                            <div>
                                <a onClick={() => _postOrderOffsale([orderGoodsId])}>下架商品</a>
                            </div>
                        </>
                    );
                },
            },
            {
                title: '订单生成时间',
                dataIndex: 'createTime',
                align: 'center',
                width: 120,
                render: (value: string) => utcToLocal(value, ''),
            },
            {
                title: '子订单ID',
                dataIndex: 'orderGoodsId',
                align: 'center',
                width: 120,
            },
            {
                title: 'Commodity ID',
                dataIndex: 'commodityId',
                align: 'center',
                width: 130,
            },
            {
                title: '商品名称',
                dataIndex: 'productName',
                align: 'center',
                width: 180,
                render: (value: string, row: IReviewOrderItem) => {
                    // href=""
                    const { productId } = row;
                    return (
                        <div className="order-text-ellipsis">
                            <a
                                className="order-link"
                                onClick={() => _getOrderGoodsDetail(productId)}
                            >
                                {value}
                            </a>
                        </div>
                    );
                },
            },
            {
                title: 'SKU图片',
                dataIndex: 'productImage',
                align: 'center',
                width: 100,
                render: (value: string) => {
                    return <AutoEnLargeImg src={value} className="order-img-lazy" />;
                },
            },
            {
                title: '商品规格',
                dataIndex: 'productStyle',
                align: 'center',
                width: 180,
                render: (value: string) => {
                    let child: any = null;
                    if (value) {
                        try {
                            const styleInfo = JSON.parse(value);
                            child = (
                                <>
                                    {Object.keys(styleInfo).map(key => (
                                        <div key={key}>{`${key}: ${styleInfo[key]}`}</div>
                                    ))}
                                </>
                            );
                        } catch (err) {}
                    }
                    return child;
                },
            },
            {
                title: '销售商品数量',
                dataIndex: 'goodsNumber',
                align: 'center',
                width: 120,
            },
            {
                title: '销售商品运费($)',
                dataIndex: 'freight',
                align: 'center',
                width: 140,
            },
            {
                title: '销售商品总金额($)',
                dataIndex: 'goodsAmount',
                align: 'center',
                width: 150,
            },
            {
                title: '销售店铺名称',
                dataIndex: 'productShop',
                align: 'center',
                width: 120,
            },
            {
                title: '销售订单ID',
                dataIndex: 'channelOrderGoodsSn',
                align: 'center',
                width: 120,
            },
            {
                title: '商品最低类目',
                dataIndex: 'threeLevelCatogryCode',
                align: 'center',
                width: 140,
                render: (value: number) => getCategoryName(String(value), allCategoryList),
            },
        ];
    }, [allCategoryList]);

    const pagination = useMemo(() => {
        return {
            total: total,
            current: pageNumber,
            pageSize: pageSize,
            showSizeChanger: true,
            position: ['topRight', 'bottomRight'],
        } as any;
    }, [loading]);

    const toolBarRender = useCallback(() => {
        const disabled = selectedRowKeys.length === 0 ? true : false;
        return [
            <LoadingButton
                key="1"
                type="primary"
                disabled={disabled}
                className={formStyles.formBtn}
                onClick={() => _postReviewPass(selectedRowKeys)}
            >
                审核通过
            </LoadingButton>,
            <CancelOrder
                orderGoodsIds={selectedRowKeys}
                onReload={onReload}
                getAllTabCount={getAllTabCount}
            >
                <Button
                    key="2"
                    type="primary"
                    className={formStyles.formBtn}
                    disabled={selectedRowKeys.length === 0}
                >
                    取消订单
                </Button>
            </CancelOrder>,
            <LoadingButton
                key="3"
                type="primary"
                className={formStyles.formBtn}
                onClick={() => _postOrderOffsale(selectedRowKeys)}
                disabled={selectedRowKeys.length === 0}
            >
                下架商品
            </LoadingButton>,
        ];
    }, [selectedRowKeys]);

    return useMemo(() => {
        // console.log('orderList', orderList);
        return (
            <>
                {search}
                <FitTable
                    bordered={true}
                    rowKey="orderGoodsId"
                    className="order-table"
                    loading={loading}
                    columns={columns}
                    rowSelection={{
                        fixed: true,
                        columnWidth: 60,
                        selectedRowKeys: selectedRowKeys,
                        onChange: (selectedRowKeys: React.Key[]) =>
                            setSelectedRowKeys(selectedRowKeys as string[]),
                    }}
                    dataSource={orderList}
                    scroll={{ x: 'max-content' }}
                    columnsSettingRender={true}
                    pagination={pagination}
                    onChange={onChange}
                    toolBarRender={toolBarRender}
                />
                <Export
                    columns={columns.filter((item: any) => item.dataIndex[0] !== '_') as any}
                    visible={visible}
                    onOKey={_postExportReview}
                    onCancel={onClose}
                />
            </>
        );
    }, [loading, orderList, selectedRowKeys, visible, columns]);
};

export default PanePendingReview;

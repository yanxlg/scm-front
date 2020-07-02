import React, { useState, useRef, useCallback, useMemo, useEffect } from 'react';
import { Pagination, Checkbox, DatePicker, Row, Col, Popconfirm, Spin, message } from 'antd';
import Container from '@/components/Container';
import { JsonForm, LoadingButton } from 'react-components';
import { JsonFormRef, FormField } from 'react-components/es/JsonForm';
import { queryShopFilterList } from '@/services/global';
import { getCatagoryList } from '@/services/goods';
import { EmptyObject } from '@/config/global';
import { getAllGoodsTagList } from '@/services/price-strategy';
import classnames from 'classnames';

import formStyles from 'react-components/es/JsonForm/_form.less';
import styles from './_index.less';
import { DeleteOutlined } from '@ant-design/icons';
import GoodsDetailModal from './components/GoodsDetailModal';
import { IOptionItem } from 'react-components/lib/JsonForm/items/Select';
import { getUTCDate, startDateToUnixWithUTC, endDateToUnixWithUTC } from '@/utils/date';
import { Dayjs } from 'dayjs';
import {
    deleteGoodsSelection,
    onsaleGoodsSelection,
    queryGoodsSelectionList,
    exportGoodsSelection,
} from '@/services/selection';
import { IQueryGoodsSelectionListReq, ISelectionGoodsItem } from '@/interface/ISelection';
import { history } from '@@/core/history';

const { RangePicker } = DatePicker;

const goodsLayout = {
    xs: { span: 12 },
    lg: { span: 8 },
    xl: { span: 6 },
    xxl: { span: 4 },
};

const timeFormat = 'YYYY-MM-DD';

const Selection: React.FC = () => {
    const formRef = useRef<JsonFormRef>(null);
    const queryRef = useRef<IQueryGoodsSelectionListReq | null>(null);
    const [loading, setLoading] = useState(true);
    const [goodsDetailStatus, setGoodsDetailStatus] = useState(false);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(50);
    const [total, setTotal] = useState(0);
    const [commodityId, setCommodityId] = useState('');
    const [merchantId, setMerchantId] = useState('');
    const [salePlatformCommodityId, setSalePlatformCommodityId] = useState('');
    const [modelType, setModelType] = useState<string[]>(['explosion']);
    const [channelList, setChannelList] = useState<IOptionItem[]>([]);
    const [allCategoryList, setAllCategoryList] = useState<IOptionItem[]>([]);
    const [dates, setDates] = useState<[Dayjs, Dayjs]>([getUTCDate().add(-1, 'day'), getUTCDate()]);
    const [goodsList, setGoodsList] = useState<ISelectionGoodsItem[]>([]);

    const getQueryData = useCallback(
        async (data: IQueryGoodsSelectionListReq = {}) => {
            const searchData = await formRef.current?.validateFields();
            const {
                first_cate = [],
                second_cate = [],
                third_cate = [],
                commodity_id,
                merchant_id,
                product_tag,
                lower_price,
                upper_price,
                lower_order,
                upper_order,
            } = searchData as any;

            let idList: string[] = [];

            if (first_cate.length && second_cate.length && third_cate.length) {
                idList = [...first_cate, ...second_cate, ...third_cate];
            } else if (first_cate.length && second_cate.length) {
                allCategoryList.forEach(({ value, children: secondList }) => {
                    if (first_cate.indexOf(value) > -1) {
                        idList.push(value as string);
                        secondList?.forEach(
                            ({ value: secondValue, children: thirdList }: IOptionItem) => {
                                if (second_cate.indexOf(secondValue) > -1) {
                                    idList.push(secondValue as string);
                                    thirdList?.forEach(({ value: thirdValue }: IOptionItem) => {
                                        idList.push(thirdValue as string);
                                    });
                                }
                            },
                        );
                    }
                });
            } else if (first_cate.length) {
                allCategoryList.forEach(({ value, children: secondList }) => {
                    if (first_cate.indexOf(value) > -1) {
                        idList.push(value as string);
                        secondList?.forEach(
                            ({ value: secondValue, children: thirdList }: IOptionItem) => {
                                idList.push(secondValue as string);
                                thirdList?.forEach(({ value: thirdValue }: IOptionItem) => {
                                    idList.push(thirdValue as string);
                                });
                            },
                        );
                    }
                });
            }

            return {
                page,
                merchant_id,
                commodity_id,
                product_tag,
                lower_price,
                upper_price,
                lower_order,
                upper_order,
                limit: pageSize,
                cat_id: idList.join(','),
                model_type: modelType.join(','),
                start_date: startDateToUnixWithUTC(dates[0]),
                end_date:
                    getUTCDate().format(timeFormat) === dates[1].format(timeFormat)
                        ? getUTCDate().unix()
                        : endDateToUnixWithUTC(dates[1]),
                ...data,
            };
        },
        [dates, modelType, page, pageSize, allCategoryList],
    );

    const onSearch = useCallback(
        async (data: IQueryGoodsSelectionListReq = {}) => {
            const postData = await getQueryData(data);
            queryRef.current = postData;
            return _queryGoodsSelectionList(postData);
        },
        [getQueryData],
    );

    const _queryGoodsSelectionList = useCallback((postData: IQueryGoodsSelectionListReq) => {
        setLoading(true);
        return queryGoodsSelectionList(postData)
            .then(({ data }) => {
                const { page, limit } = postData;
                setPage(page as number);
                setPageSize(limit as number);
                if (data) {
                    const { model_list, total } = data;
                    setTotal(Number(total));
                    setGoodsList(model_list);
                }
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    const _queryShopFilterList = useCallback(() => {
        queryShopFilterList().then(res => {
            setChannelList(res);
            if (res.length > 0) {
                let merchant_id: string = '';
                res.forEach(({ name, children }) => {
                    if (name.toLowerCase() === 'vova') {
                        merchant_id = children[0]?.value ?? '';
                    }
                });
                formRef.current?.setFieldsValue({
                    sales_channel: 'vova',
                    merchant_id,
                });
                onSearch({
                    merchant_id,
                });
            }
        });
    }, [onSearch]);

    const _getCatagoryList = useCallback(() => {
        return getCatagoryList()
            .then(({ convertList = [] } = EmptyObject) => {
                setAllCategoryList(convertList);
                return convertList;
            })
            .catch(() => {
                return [];
            });
    }, []);

    const _deleteGoodsSelection = useCallback(
        (commodity_id, merchant_id) => {
            // e.stopPropagation();
            deleteGoodsSelection({
                commodity_id,
                merchant_id,
                start_date: queryRef.current?.start_date as number,
                end_date: queryRef.current?.end_date as number,
            }).then(() => {
                message.success('删除成功！');
                onSearch();
            });
        },
        [onSearch],
    );

    const _onsaleGoodsSelection = useCallback(
        (commodity_id, merchant_id) => {
            onsaleGoodsSelection({
                commodity_id,
                merchant_id,
            }).then(() => {
                message.success('上架成功！');
                onSearch();
            });
        },
        [onSearch],
    );

    const _exportGoodsSelection = useCallback(async () => {
        const { page, limit, ...rest } = await getQueryData();
        return exportGoodsSelection(rest).then(res => {
            message.success('导出任务发送成功');
            history.push('/setting/export');
        });
    }, [getQueryData]);

    const onChangePagination = useCallback(
        page => {
            onSearch({
                page,
            });
        },
        [onSearch],
    );

    const onShowSizeChange = useCallback(
        (current, size) => {
            onSearch({
                page: current,
                limit: size,
            });
        },
        [onSearch],
    );

    const onChangeGoodsType = useCallback(
        vals => {
            setModelType(vals);
            onSearch({
                model_type: vals.join(','),
            });
        },
        [onSearch],
    );

    const showGoodsModal = useCallback((commodity_id, merchant_id, sale_platform_commodity_id) => {
        setGoodsDetailStatus(true);
        setCommodityId(commodity_id);
        setMerchantId(merchant_id);
        setSalePlatformCommodityId(sale_platform_commodity_id);
    }, []);

    const hideGoodsModal = useCallback(() => {
        setGoodsDetailStatus(false);
    }, []);

    const disabledDate = useCallback(currentDate => {
        return (
            currentDate.valueOf() > getUTCDate().valueOf() ||
            currentDate.valueOf() <
                getUTCDate()
                    .add(-60, 'day')
                    .valueOf()
        );
    }, []);

    const handleRangePicker = useCallback(
        values => {
            // console.log(args);
            setDates(values);
            onSearch({
                start_date: startDateToUnixWithUTC(values[0]),
                end_date:
                    getUTCDate().format(timeFormat) === values[1].format(timeFormat)
                        ? getUTCDate().unix()
                        : endDateToUnixWithUTC(values[1]),
            });
        },
        [onSearch],
    );

    const paginationNode = useMemo(() => {
        return (
            <div className={styles.pagination}>
                <Pagination
                    showQuickJumper
                    current={page}
                    pageSize={pageSize}
                    total={total}
                    pageSizeOptions={['50', '100', '200', '500']}
                    showTotal={total => `共 ${total} 条`}
                    onChange={onChangePagination}
                    onShowSizeChange={onShowSizeChange}
                />
            </div>
        );
    }, [page, pageSize, total, onSearch]);

    const goodsNode = useMemo(() => {
        return (
            <Row gutter={[30, 30]}>
                {goodsList.map(item => {
                    const {
                        commodity_id,
                        merchant_id,
                        main_image,
                        is_on_sale,
                        sale_price,
                        lower_profit,
                        upper_profit,
                        last_price_change_day,
                        last_day_sale_order,
                        lat_day_sale_order_change,
                        last_7day_sale_order,
                        total_sale_order,
                        product_tag,
                        title,
                        sale_number,
                        comment_number,
                        origin_price,
                        model,
                        sale_price_change,
                        sale_platform_commodity_id,
                        is_vova_old,
                        product_link,
                    } = item;
                    return (
                        <Col
                            {...goodsLayout}
                            className={styles.goodsContainer}
                            onClick={() =>
                                showGoodsModal(
                                    commodity_id,
                                    merchant_id,
                                    sale_platform_commodity_id,
                                )
                            }
                            key={commodity_id}
                        >
                            <div className={styles.imgContainer}>
                                {main_image && <img src={main_image} className={styles.goodsImg} />}
                                {!is_on_sale ? (
                                    <>
                                        <div
                                            className={classnames(
                                                styles.shelf,
                                                styles.offShelf,
                                                // styles.show,
                                            )}
                                        >
                                            已下架
                                        </div>

                                        {is_vova_old !== 1 ? (
                                            <div onClick={e => e.stopPropagation()}>
                                                <Popconfirm
                                                    placement="bottom"
                                                    title="重新上架该商品？"
                                                    onConfirm={() =>
                                                        _onsaleGoodsSelection(
                                                            commodity_id,
                                                            merchant_id,
                                                        )
                                                    }
                                                    okText="确定"
                                                    cancelText="取消"
                                                    //
                                                >
                                                    <div
                                                        className={classnames(
                                                            styles.shelf,
                                                            styles.onShelf,
                                                            styles.show,
                                                        )}
                                                    >
                                                        去上架
                                                    </div>
                                                </Popconfirm>
                                            </div>
                                        ) : null}
                                    </>
                                ) : null}
                                <div
                                    className={classnames(styles.arc, styles.arcShow)}
                                    onClick={e => e.stopPropagation()}
                                >
                                    <Popconfirm
                                        placement="bottom"
                                        title="确定要从选品模型中剔除此商品吗？"
                                        onConfirm={() =>
                                            _deleteGoodsSelection(commodity_id, merchant_id)
                                        }
                                        okText="确定"
                                        cancelText="取消"
                                    >
                                        <DeleteOutlined className={styles.del} />
                                    </Popconfirm>
                                </div>
                                <div className={styles.typeList}>
                                    <div className={styles.type}>
                                        {model}
                                        {/* {typeMap[model as 'explosion'] || ''} */}
                                    </div>
                                </div>
                            </div>
                            <div className={styles.goodsInfo}>
                                <div className={styles.price}>
                                    <div>$ {sale_price}</div>
                                    {sale_price_change === 1 && (
                                        <div className={classnames(styles.increase, styles.arrow)}>
                                            ↑
                                        </div>
                                    )}
                                    {sale_price_change === -1 && (
                                        <div className={classnames(styles.decrease, styles.arrow)}>
                                            ↓
                                        </div>
                                    )}
                                    <div className={styles.profit}>
                                        (利润 {lower_profit}-{upper_profit})
                                    </div>
                                </div>
                                <div className={styles.time}>
                                    售价更新时间 {last_price_change_day}
                                </div>
                                <div className={styles.item}>
                                    <div>昨日销量</div>
                                    <div>
                                        <span
                                            className={classnames(
                                                styles.salesChange,
                                                lat_day_sale_order_change >= 0
                                                    ? styles.increase
                                                    : styles.decrease,
                                            )}
                                        >
                                            {(lat_day_sale_order_change > 0 ? '+' : '') +
                                                lat_day_sale_order_change}
                                        </span>
                                        <span>{last_day_sale_order}</span>
                                    </div>
                                </div>
                                <div className={styles.item}>
                                    <div>近7日销量</div>
                                    <div>{last_7day_sale_order}</div>
                                </div>
                                <div className={styles.item}>
                                    <div>累计销量</div>
                                    <div>{total_sale_order}</div>
                                </div>
                                <div className={styles.tagList}>
                                    {product_tag?.map((tag: string) => (
                                        <div key={tag} className={styles.tag}>
                                            {tag}
                                        </div>
                                    ))}
                                </div>
                                <div className={styles.back}>
                                    <div
                                        className={styles.title}
                                        onClick={e => e.stopPropagation()}
                                    >
                                        <a target="_blank" href={product_link}>
                                            {title}
                                        </a>
                                    </div>
                                    <div className={styles.item}>
                                        <div>爬虫价</div>
                                        <div>¥{origin_price}</div>
                                    </div>
                                    <div className={styles.item}>
                                        <div>采购渠道销量</div>
                                        <div>{sale_number}</div>
                                    </div>
                                    <div className={styles.item}>
                                        <div>评论数</div>
                                        <div>{comment_number}</div>
                                    </div>
                                    {/* <div className={styles.item}>
                                        <div>评价等级</div>
                                        <div>3.5</div>
                                    </div> */}
                                </div>
                            </div>
                        </Col>
                    );
                })}
            </Row>
        );
    }, [goodsList, _deleteGoodsSelection, _onsaleGoodsSelection]);

    const formFields = useMemo<FormField[]>(() => {
        return [
            {
                type: 'input',
                label: 'Commodity ID',
                name: 'commodity_id',
                placeholder: '请输入',
                className: styles.input,
            },
            {
                type: 'treeSelect',
                label: '一级品类',
                name: 'first_cate',
                optionList: _getCatagoryList,
                placeholder: '请选择',
                className: styles.input,
                onChange: (name, form) => {
                    form.resetFields(['second_cate']);
                    form.resetFields(['third_cate']);
                },
            },
            {
                type: 'treeSelect',
                label: '二级品类',
                name: 'second_cate',
                optionListDependence: {
                    name: 'first_cate',
                    key: 'children',
                },
                placeholder: '请选择',
                className: styles.input,
                optionList: _getCatagoryList,
                onChange: (name, form) => {
                    form.resetFields(['third_cate']);
                },
            },
            {
                type: 'treeSelect',
                label: '三级品类',
                name: 'third_cate',
                optionListDependence: {
                    name: ['first_cate', 'second_cate'],
                    key: 'children',
                },
                placeholder: '请选择',
                className: styles.input,
                optionList: _getCatagoryList,
            },
            {
                type: 'select',
                label: '销售渠道',
                name: 'sales_channel',
                placeholder: '请选择',
                className: styles.input,
                optionList: channelList,
                onChange: (nameField, form) => {
                    let merchant_id: string = '';
                    channelList.forEach(({ name, children }) => {
                        if (name.toLowerCase() === form.getFieldValue(nameField).toLowerCase()) {
                            merchant_id = children[0]?.value ?? '';
                        }
                    });
                    form.setFieldsValue({
                        merchant_id,
                    });
                },
            },
            {
                type: 'select',
                label: '销售店铺',
                name: 'merchant_id',
                placeholder: '请选择',
                className: styles.input,
                optionListDependence: { name: 'sales_channel', key: 'children' },
                optionList: () => queryShopFilterList(),
            },
            {
                type: 'treeSelect',
                label: '商品标签',
                name: 'product_tag',
                placeholder: '请选择',
                className: styles.input,
                optionList: () => getAllGoodsTagList(),
                formatter: 'join',
            },
            {
                type: 'numberRange',
                label: '销售价格',
                className: styles.inputNumber,
                name: ['lower_price', 'upper_price'],
            },
            {
                type: 'positiveIntegerRange',
                label: '累计销量',
                className: styles.inputNumber,
                name: ['lower_order', 'upper_order'],
            },
        ];
    }, [channelList]);

    const searchNode = useMemo(() => {
        return (
            <JsonForm
                className={styles.wrapper}
                ref={formRef}
                fieldList={formFields}
                // initialValues={initialValues}
            >
                <div>
                    <LoadingButton
                        type="primary"
                        className={formStyles.formBtn}
                        onClick={() => onSearch({ page: 1 })}
                    >
                        查询
                    </LoadingButton>
                    <LoadingButton className={formStyles.formBtn} onClick={() => onSearch()}>
                        刷新
                    </LoadingButton>
                    <LoadingButton
                        // disabled={total <= 0}
                        className={formStyles.formBtn}
                        onClick={_exportGoodsSelection}
                    >
                        导出
                    </LoadingButton>
                </div>
            </JsonForm>
        );
    }, [channelList, onSearch]);

    useEffect(() => {
        _queryShopFilterList();
    }, []);

    return useMemo(() => {
        return (
            <Container>
                {searchNode}
                {paginationNode}
                <div className={styles.goodsHeader}>
                    <Checkbox.Group
                        onChange={onChangeGoodsType}
                        value={modelType}
                        disabled={loading}
                    >
                        <Checkbox
                            value="explosion"
                            disabled={modelType.length === 1 && modelType.indexOf('explosion') > -1}
                        >
                            爆款
                        </Checkbox>
                        <Checkbox
                            value="best_seller"
                            disabled={
                                modelType.length === 1 && modelType.indexOf('best_seller') > -1
                            }
                        >
                            畅销款
                        </Checkbox>
                        <Checkbox
                            value="potential"
                            disabled={modelType.length === 1 && modelType.indexOf('potential') > -1}
                        >
                            潜力款
                        </Checkbox>
                    </Checkbox.Group>
                    <div>
                        时间：
                        <RangePicker
                            allowClear={false}
                            value={dates}
                            disabledDate={disabledDate}
                            onChange={handleRangePicker}
                            disabled={loading}
                        />
                    </div>
                </div>
                <Spin spinning={loading}>{goodsNode}</Spin>

                {paginationNode}
                <GoodsDetailModal
                    visible={goodsDetailStatus}
                    commodityId={commodityId}
                    merchantId={merchantId}
                    salePlatformCommodityId={salePlatformCommodityId}
                    onCancel={hideGoodsModal}
                />
            </Container>
        );
    }, [goodsDetailStatus, searchNode, goodsNode, dates, modelType, loading, onSearch]);
};

// export default React.memo(Selection);

export default Selection;

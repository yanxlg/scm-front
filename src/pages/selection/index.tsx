import React, { useState, useRef, useCallback, useMemo, useEffect } from 'react';
import { Button, Pagination, Checkbox, DatePicker, Row, Col, Popconfirm } from 'antd';
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
import { getUTCDate } from '@/utils/date';
import { Dayjs } from 'dayjs';
import { deleteGoodsSelection, onsaleGoodsSelection } from '@/services/selection';

const { RangePicker } = DatePicker;

const goodsLayout = {
    xs: { span: 12 },
    lg: { span: 8 },
    xl: { span: 6 },
    xxl: { span: 4 },
};

const Selection: React.FC = () => {
    const formRef = useRef<JsonFormRef>(null);
    const [goodsDetailStatus, setGoodsDetailStatus] = useState(false);
    const [channelList, setChannelList] = useState<IOptionItem[]>([]);
    const [dates, setDates] = useState<[Dayjs, Dayjs]>([
        getUTCDate().add(-1, 'day'),
        getUTCDate().add(-1, 'day'),
    ]);
    const [goodsList, setGoodsList] = useState<any[]>([
        {
            onShelf: true,
            types: ['爆款', '畅销款', '潜力款'],
            price: 10.89,
            tags: ['品牌', '大件', '活体'],
            imgUrl:
                'https://supply-img-t.vova.com.hk/spider/images/item/18/c9/502c0c008652f737b0d5d52d2d4e18c9.jpg',
        },
        {
            onShelf: false,
            imgUrl:
                'https://supply-img-t.vova.com.hk/spider/images/item/18/c9/502c0c008652f737b0d5d52d2d4e18c9.jpg',
        },
        {
            onShelf: true,
            imgUrl:
                'https://supply-img-t.vova.com.hk/spider/images/item/18/c9/502c0c008652f737b0d5d52d2d4e18c9.jpg',
        },
        {
            onShelf: true,
            imgUrl:
                'https://supply-img-t.vova.com.hk/spider/images/item/18/c9/502c0c008652f737b0d5d52d2d4e18c9.jpg',
        },
        {
            onShelf: true,
            imgUrl:
                'https://supply-img-t.vova.com.hk/spider/images/item/18/c9/502c0c008652f737b0d5d52d2d4e18c9.jpg',
        },
        {
            onShelf: true,
            imgUrl:
                'https://supply-img-t.vova.com.hk/spider/images/item/18/c9/502c0c008652f737b0d5d52d2d4e18c9.jpg',
        },
        {
            onShelf: true,
            imgUrl:
                'https://supply-img-t.vova.com.hk/spider/images/item/18/c9/502c0c008652f737b0d5d52d2d4e18c9.jpg',
        },
    ]);

    // console.log(channelList);

    const onChangePagination = useCallback(() => {}, []);
    const onChangeGoodsType = useCallback(vals => {
        console.log('onChangeGoodsType', vals);
    }, []);

    const showGoodsModal = useCallback(() => {
        setGoodsDetailStatus(true);
    }, []);

    const hideGoodsModal = useCallback(() => {
        setGoodsDetailStatus(false);
    }, []);

    const onSearch = useCallback(async () => {
        // console.log('onSearch', formRef.current?.getFieldsValue());
        const data = await formRef.current?.validateFields();
        console.log('onSearch', data);
        const { first_cate, second_cate, third_cate } = data as any;
        return Promise.resolve();
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

    const handleRangePicker = useCallback(values => {
        // console.log(args);
        setDates(values);
    }, []);

    // 获取所有的cat_id
    const getAllCategoryIds = useCallback(() => {}, []);

    const _queryShopFilterList = useCallback(() => {
        queryShopFilterList().then(res => {
            setChannelList(res);
            if (res.length > 0) {
                let sales_store: string = '';
                res.forEach(({ name, children }) => {
                    if (name.toLowerCase() === 'vova') {
                        sales_store = children[0]?.value ?? '';
                    }
                });
                formRef.current?.setFieldsValue({
                    sales_channel: 'vova',
                    sales_store,
                });
            }
        });
    }, []);

    const _getCatagoryList = useCallback(() => {
        return getCatagoryList()
            .then(({ convertList = [] } = EmptyObject) => {
                return convertList;
            })
            .catch(() => {
                return [];
            });
    }, []);

    // e,
    const _deleteGoodsSelection = useCallback((commodity_id, merchant_id) => {
        // e.stopPropagation();
        deleteGoodsSelection({
            commodity_id,
            merchant_id,
        }).then(() => {});
    }, []);

    const _onsaleGoodsSelection = useCallback((commodity_id, merchant_id) => {
        onsaleGoodsSelection({
            commodity_id,
            merchant_id,
        }).then(() => {});
    }, []);

    const paginationNode = useMemo(() => {
        return (
            <div className={styles.pagination}>
                <Pagination
                    showQuickJumper
                    defaultCurrent={2}
                    total={500}
                    onChange={onChangePagination}
                />
            </div>
        );
    }, []);

    const goodsNode = useMemo(() => {
        return (
            <Row gutter={[30, 30]}>
                {goodsList.map(item => {
                    const { imgUrl, onShelf, types, price, tags } = item;
                    return (
                        <Col
                            {...goodsLayout}
                            className={styles.goodsContainer}
                            onClick={() => showGoodsModal()}
                        >
                            <div className={styles.imgContainer}>
                                <img src={imgUrl} className={styles.goodsImg} />
                                {onShelf ? (
                                    <>
                                        <div
                                            className={classnames(
                                                styles.shelf,
                                                styles.offShelf,
                                                styles.show,
                                            )}
                                        >
                                            已下架
                                        </div>
                                        <div
                                            className={classnames(styles.arc, styles.arcShow)}
                                            onClick={e => e.stopPropagation()}
                                        >
                                            <Popconfirm
                                                placement="bottom"
                                                title="确定要从选品模型中剔除此商品吗？"
                                                onConfirm={() => _deleteGoodsSelection('1', '2')}
                                                okText="确定"
                                                cancelText="取消"
                                            >
                                                <DeleteOutlined className={styles.del} />
                                            </Popconfirm>
                                        </div>
                                    </>
                                ) : (
                                    <div onClick={e => e.stopPropagation()}>
                                        <Popconfirm
                                            placement="bottom"
                                            title="重新上架该商品？"
                                            onConfirm={() => _onsaleGoodsSelection('1', '2')}
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
                                )}
                                <div className={styles.typeList}>
                                    {types?.map((type: string) => (
                                        <div className={styles.type} key={type}>
                                            {type}
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className={styles.goodsInfo}>
                                <div className={styles.price}>
                                    <div>$ {price}</div>
                                    <div className={styles.profit}>(利润 20.01-30.1)</div>
                                </div>
                                <div className={styles.time}>售价更新时间 05.07 14:45</div>
                                <div className={styles.item}>
                                    <div>昨日销量</div>
                                    <div>
                                        <span className={styles.salesChange}>+20</span>
                                        <span>245</span>
                                    </div>
                                </div>
                                <div className={styles.item}>
                                    <div>近7日销量</div>
                                    <div>2453</div>
                                </div>
                                <div className={styles.item}>
                                    <div>累计销量</div>
                                    <div>20000</div>
                                </div>
                                <div className={styles.tagList}>
                                    {tags?.map((tag: string) => (
                                        <div key={tag} className={styles.tag}>
                                            {tag}
                                        </div>
                                    ))}
                                </div>
                                <div className={styles.back}>
                                    <div className={styles.title}>
                                        标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题
                                    </div>
                                    <div className={styles.item}>
                                        <div>爬虫价</div>
                                        <div>¥2.45</div>
                                    </div>
                                    <div className={styles.item}>
                                        <div>采购渠道销量</div>
                                        <div>245</div>
                                    </div>
                                    <div className={styles.item}>
                                        <div>评论数</div>
                                        <div>200</div>
                                    </div>
                                    <div className={styles.item}>
                                        <div>评价等级</div>
                                        <div>3.5</div>
                                    </div>
                                </div>
                            </div>
                        </Col>
                    );
                })}
            </Row>
        );
    }, [goodsList]);

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
                    let sales_store: string = '';
                    channelList.forEach(({ name, children }) => {
                        if (name.toLowerCase() === form.getFieldValue(nameField).toLowerCase()) {
                            sales_store = children[0]?.value ?? '';
                        }
                    });
                    form.setFieldsValue({
                        sales_store,
                    });
                },
            },
            {
                type: 'select',
                label: '销售店铺',
                name: 'sales_store',
                placeholder: '请选择',
                className: styles.input,
                optionListDependence: { name: 'sales_channel', key: 'children' },
                optionList: () => queryShopFilterList(),
            },
            {
                type: 'treeSelect',
                label: '商品标签',
                name: 'tags',
                placeholder: '请选择',
                className: styles.input,
                optionList: () => getAllGoodsTagList(),
                formatter: 'join',
            },
            {
                type: 'numberRange',
                label: '销售价格',
                className: styles.inputNumber,
                name: ['min_sales_price', 'max_sales_price'],
            },
            {
                type: 'positiveIntegerRange',
                label: '累计销量',
                className: styles.inputNumber,
                name: ['min_sales_num', 'max_sales_num'],
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
                    <LoadingButton type="primary" className={formStyles.formBtn} onClick={onSearch}>
                        查询
                    </LoadingButton>
                    <LoadingButton className={formStyles.formBtn} onClick={onSearch}>
                        刷新
                    </LoadingButton>
                    <Button
                        // disabled={total <= 0}
                        className={formStyles.formBtn}
                        onClick={() => {}}
                    >
                        导出
                    </Button>
                </div>
            </JsonForm>
        );
    }, [channelList]);

    useEffect(() => {
        _queryShopFilterList();
    }, []);

    // useEffect(() => {

    // }, [channelList]);

    return useMemo(() => {
        return (
            <Container>
                {searchNode}
                {paginationNode}
                <div className={styles.goodsHeader}>
                    <Checkbox.Group onChange={onChangeGoodsType} defaultValue={['explosion']}>
                        <Checkbox value="explosion">爆款</Checkbox>
                        <Checkbox value="best_seller">畅销款</Checkbox>
                        <Checkbox value="potential">潜力款</Checkbox>
                    </Checkbox.Group>
                    <div>
                        时间：
                        <RangePicker
                            allowClear={false}
                            value={dates}
                            disabledDate={disabledDate}
                            onChange={handleRangePicker}
                        />
                    </div>
                </div>
                {goodsNode}
                {paginationNode}
                <GoodsDetailModal visible={goodsDetailStatus} onCancel={hideGoodsModal} />
            </Container>
        );
    }, [goodsDetailStatus, searchNode, dates]);
};

// export default React.memo(Selection);

export default Selection;

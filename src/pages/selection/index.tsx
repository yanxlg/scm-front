import React, { useState, useRef, useCallback, useMemo } from 'react';
import { Button, Pagination, Checkbox, DatePicker, Row, Col } from 'antd';
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

const { RangePicker } = DatePicker;

const initialValues = {
    enable_platform: 'vova',
};

const _getCatagoryList = () =>
    getCatagoryList()
        .then(({ convertList = [] } = EmptyObject) => {
            return convertList;
        })
        .catch(() => {
            return [];
        });

const formFields: FormField[] = [
    {
        type: 'input',
        label: 'Commodity ID',
        name: 'commodity_id',
        placeholder: '请输入',
        // className: styles.input,
        formatter: 'number_str_arr',
    },
    {
        type: 'treeSelect',
        label: '一级品类',
        name: 'first_category',
        optionList: _getCatagoryList,
        placeholder: '请选择',
        onChange: (name, form) => {
            form.resetFields(['second_category']);
            form.resetFields(['third_category']);
        },
        formatter: 'join',
    },
    {
        type: 'treeSelect',
        label: '二级品类',
        name: 'second_category',
        optionListDependence: {
            name: 'first_category',
            key: 'children',
        },
        placeholder: '请选择',
        optionList: _getCatagoryList,
        onChange: (name, form) => {
            form.resetFields(['third_category']);
        },
        formatter: 'join',
    },
    {
        type: 'treeSelect',
        label: '三级品类',
        name: 'third_category',
        optionListDependence: {
            name: ['first_category', 'second_category'],
            key: 'children',
        },
        placeholder: '请选择',
        optionList: _getCatagoryList,
        formatter: 'join',
    },
    {
        type: 'select',
        label: '销售渠道',
        name: 'enable_platform',
        placeholder: '请选择',
        optionList: () => queryShopFilterList(),
        onChange: (name, form) => {
            form.resetFields(['enable_merchant']);
        },
        // formatter: 'join',
    },
    {
        type: 'select',
        label: '销售店铺',
        name: 'enable_merchant',
        placeholder: '请选择',
        optionListDependence: { name: 'enable_platform', key: 'children' },
        optionList: () => queryShopFilterList(),
        formatter: 'join',
    },
    {
        type: 'treeSelect',
        label: '商品标签',
        name: 'product_tags',
        placeholder: '请选择',
        optionList: () => getAllGoodsTagList(),
        formatter: 'join',
    },
    {
        type: 'positiveIntegerRange',
        label: '销售价格',
        name: ['a1', 'a2'],

        // placeholder: '请输入',
        // // className: styles.input,
        // formatter: 'number_str_arr',
    },
    // {
    //     type: 'inputRange',
    //     label: '价格范围（￥）',
    //     name: ['min_price', 'max_price'],
    //     className: styles.inputMin,
    //     precision: 2,
    // },
    // {
    //     type: 'inputRange',
    //     label: '销量',
    //     name: ['min_sale', 'max_sale'],
    //     className: styles.inputMin,
    // },
    // {
    //     type: 'positiveInteger',
    //     label: '评论数量>=',
    //     name: 'min_comment',
    //     // placeholder: '多个逗号隔开',
    //     className: styles.inputMin,
    //     formatter: 'number',
    // },
];

const goodsLayout = {
    xs: { span: 12 },
    lg: { span: 8 },
    xl: { span: 6 },
    xxl: { span: 4 },
};

const Selection: React.FC = () => {
    const formRef = useRef<JsonFormRef>(null);
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

    const onChangePagination = useCallback(() => {}, []);
    const onChangeGoodsType = useCallback(vals => {
        console.log('onChangeGoodsType', vals);
    }, []);

    const onSearch = useCallback(async () => {
        // console.log('onSearch', formRef.current?.getFieldsValue());
        const data = await formRef.current?.validateFields();
        console.log('onSearch', data);
        return Promise.resolve();
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
                        <Col {...goodsLayout} className={styles.goodsContainer}>
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
                                        <div className={classnames(styles.arc, styles.arcShow)}>
                                            <DeleteOutlined className={styles.del} />
                                        </div>
                                    </>
                                ) : (
                                    <div
                                        className={classnames(
                                            styles.shelf,
                                            styles.onShelf,
                                            styles.show,
                                        )}
                                    >
                                        去上架
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

    return (
        <Container>
            <JsonForm
                className={styles.wrapper}
                ref={formRef}
                fieldList={formFields}
                initialValues={initialValues}
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
            {paginationNode}
            <div className={styles.goodsHeader}>
                <Checkbox.Group onChange={onChangeGoodsType}>
                    <Checkbox value="1">爆款</Checkbox>
                    <Checkbox value="2">畅销款</Checkbox>
                    <Checkbox value="3">潜力款</Checkbox>
                </Checkbox.Group>
                <div>
                    时间：
                    <RangePicker />
                </div>
            </div>
            {goodsNode}
            {paginationNode}
        </Container>
    );
};

export default React.memo(Selection);

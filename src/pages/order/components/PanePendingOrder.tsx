import React, { RefObject } from 'react';
import { Button, Pagination } from 'antd';
import { FormInstance } from 'antd/es/form';

import SearchForm, { FormField, SearchFormRef } from '@/components/SearchForm';

import TablePendingOrder from './TablePendingOrder';

import { getPendingOrderList, IPendingFilterParams } from '@/services/order-manage';
import { transStartDate, transEndDate, utcToLocal } from '@/utils/date';
import {
    defaultOptionItem,
    channelOptionList,
    orderStatusOptionList,
    pageSizeOptions,
} from '@/enums/OrderEnum';

// self::$Assert::nullOrInteger($params['order_start_time'] ?? null, 'require int order_start_time; get %s'); //订单开始时间
// self::$Assert::nullOrInteger($params['order_end_time'] ?? null, 'require int order_end_time; get %s');     //订单结束时间
// self::$Assert::isArray($params['order_goods_id'] ?? [], 'require []int order_goods_id; get %s'); //中台订单ID
// self::$Assert::isArray($params['product_id'] ?? [], 'require []string product_id; get %s');//中台商品id
// self::$Assert::isArray($params['sku_id'] ?? [], 'require []string sku_id; get %s');//中台sku_id
// self::$Assert::nullOrInteger($params['channel_source'] ?? null, 'require channel_source; get %s');//渠道
// self::$Assert::nullOrInteger($params['order_goods_status'] ?? null, 'require order_goods_status; get %s');//中台订单状态

const fieldList: FormField[] = [
    {
        type: 'input',
        name: 'order_goods_id',
        label: '中台订单ID',
        className: 'order-input',
        formItemClassName: 'order-form-item',
        placeholder: '请输入中台订单ID',
    },
    {
        type: 'input',
        name: 'product_id',
        label: '中台商品ID',
        className: 'order-input',
        formItemClassName: 'order-form-item',
        placeholder: '请输入中台商品ID',
    },
    {
        type: 'input',
        name: 'sku_id',
        label: '中台SKU ID',
        className: 'order-input',
        formItemClassName: 'order-form-item',
        placeholder: '请输入中台SKU ID',
    },
    {
        type: 'select',
        name: 'channel_source',
        label: '销售渠道',
        className: 'order-input',
        formItemClassName: 'order-form-item',
        optionList: [defaultOptionItem, ...channelOptionList],
    },
    {
        type: 'select',
        name: 'order_goods_status',
        label: '中台订单状态',
        className: 'order-input',
        formItemClassName: 'order-form-item',
        optionList: [defaultOptionItem, ...orderStatusOptionList],
    },
    {
        type: 'dateRanger',
        name: ['order_start_time', 'order_end_time'],
        label: '订单时间',
        className: 'order-pending-date-picker',
        formItemClassName: 'order-form-item',
        placeholder: '请选择订单时间',
    },
];

export declare interface IStyleData {
    [key: string]: string;
}

export declare interface ICatagoryData {
    id: string;
    name: string;
}

export declare interface IOrderItem {
    [key: string]: any;
}

declare interface IState {
    page: number;
    pageCount: number;
    total: number;
    loading: boolean;
    // selectedRowKeys: string[];
    orderList: IOrderItem[];
}

class PanePendingOrder extends React.PureComponent<{}, IState> {
    private formRef: RefObject<SearchFormRef> = React.createRef();

    private initialValues = {
        channel_source: 100,
        order_goods_status: 100,
    };

    constructor(props: {}) {
        super(props);
        this.state = {
            page: 1,
            pageCount: 50,
            total: 0,
            loading: false,
            orderList: [],
            // selectedRowKeys: []
        };
    }

    componentDidMount() {
        // console.log('PaneAll');
        this.onSearch();
    }

    onSearch = (baseParams?: IPendingFilterParams) => {
        const { page, pageCount } = this.state;
        let params: IPendingFilterParams = {
            page,
            page_count: pageCount,
        };
        // if (this.orderFilterRef.current) {
        //     // console.log('onSearch', this.orderFilterRef.current.getValues());
        //     params = Object.assign(params, this.orderFilterRef.current.getValues());
        // }
        if (baseParams) {
            params = Object.assign(params, baseParams);
        }
        // console.log('getValues', this.orderFilterRef.current!.getValues());
        this.setState({
            loading: true,
        });
        getPendingOrderList(params)
            .then(res => {
                // console.log('getProductOrderList', res);
                // const { total, list } = res.data;
                const { all_count, list } = res.data;
                // const childList: any[] = [];
                // list.forEach((item: any) => {
                //     item.orderGoods.forEach((goodsItem: any) => {
                //         childList.push(goodsItem);
                //     });
                // });
                // this.setState({
                //     total: all_count,
                //     page: params.page as number,
                //     pageCount: params.page_count as number,
                //     orderList: this.getOrderData(childList),
                // });
            })
            .finally(() => {
                this.setState({
                    loading: false,
                });
            });
    };

    // 获取子订单=>采购计划数据
    private getOrderList(list: any[]): IOrderItem[] {
        // console.log(1111, list);
        const childOrderList: IOrderItem[] = [];
        list.forEach((goodsItem: any) => {
            const { orderGoods, orderInfo } = goodsItem;
            const { orderGoodsPurchasePlan, ...orderRest } = orderGoods;
            const { currency, confirmTime, channelOrderSn, channelSource } = orderInfo;
            // console.log(111, orderGoodsPurchasePlan, orderGoods);
            if (orderGoodsPurchasePlan) {
                // 生成采购计划
                orderGoodsPurchasePlan.forEach((purchaseItem: any, index: number) => {
                    const {
                        createTime: purchaseCreateTime,
                        lastUpdateTime: purchaseLastUpdateTime,
                        ...purchaseRest
                    } = purchaseItem;
                    const childOrderItem: any = {
                        ...orderRest,
                        ...purchaseRest,
                        purchaseCreateTime,
                        purchaseLastUpdateTime,
                        currency,
                        confirmTime,
                        channelOrderSn,
                        channelSource,
                    };
                    if (index === 0) {
                        childOrderItem._rowspan = orderGoodsPurchasePlan.length;
                        childOrderItem._checked = false;
                    }
                    childOrderList.push(childOrderItem);
                });
            } else {
                // 没有生成采购计划
                childOrderList.push({
                    currency,
                    confirmTime,
                    channelOrderSn,
                    channelSource,
                    ...orderRest,
                    _rowspan: 1,
                    _checked: false,
                });
            }
        });
        // console.log(1111, childOrderList);
        return childOrderList;
    }

    // 获取查询数据
    getFieldsValue = () => {
        // console.log('111', this.formRef.current!.getFieldsValue());
        const fields = this.formRef.current!.getFieldsValue();
        const {
            order_start_time,
            order_end_time,
            // middleground_order_id,
            // product_id,
            // sku_id
        } = fields;
        return Object.assign(fields, {
            order_start_time: order_start_time
                ? transStartDate(order_start_time)
                : order_start_time,
            order_end_time: order_end_time ? transEndDate(order_end_time) : order_end_time,
        });
    };

    // 全选
    onCheckAllChange = (status: boolean) => {
        const { orderList } = this.state;
        this.setState({
            orderList: orderList.map(item => {
                if (item._rowspan) {
                    return {
                        ...item,
                        _checked: status,
                    };
                }
                return item;
            }),
        });
    };

    // 单选
    onSelectedRow = (row: IOrderItem) => {
        const { orderList } = this.state;
        this.setState({
            orderList: orderList.map(item => {
                if (row._rowspan && row.orderGoodsId === item.orderGoodsId) {
                    return {
                        ...item,
                        _checked: !row._checked,
                    };
                }
                return item;
            }),
        });
    };

    render() {
        const { loading, orderList, total, page, pageCount } = this.state;

        return (
            <>
                <div>
                    <SearchForm
                        labelClassName="order-pending-label"
                        fieldList={fieldList}
                        ref={this.formRef}
                        initialValues={this.initialValues}
                    />
                    <div className="order-operation">
                        <Button
                            type="primary"
                            className="order-btn"
                            onClick={() => this.getFieldsValue()}
                        >
                            查询
                        </Button>
                        <Button type="primary" className="order-btn">
                            一键拍单
                        </Button>
                        <Button type="primary" className="order-btn">
                            取消销售单
                        </Button>
                        <Button type="primary" className="order-btn">
                            导出数据
                        </Button>
                    </div>
                    <TablePendingOrder
                        loading={loading}
                        orderList={orderList}
                        onCheckAllChange={this.onCheckAllChange}
                        onSelectedRow={this.onSelectedRow}
                    />
                    <Pagination
                        className="order-pagination"
                        // size="small"
                        total={total}
                        current={page}
                        pageSize={pageCount}
                        showSizeChanger={true}
                        showQuickJumper={true}
                        pageSizeOptions={pageSizeOptions}
                        // onChange={this.onChangePage}
                        // onShowSizeChange={this.pageCountChange}
                        showTotal={total => `共${total}条`}
                    />
                </div>
            </>
        );
    }
}

export default PanePendingOrder;

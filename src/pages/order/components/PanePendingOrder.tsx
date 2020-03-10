import React, { RefObject } from 'react';
import { Button, Pagination } from 'antd';
import { FormInstance } from 'antd/es/form';

import SearchForm, { IFieldItem } from '@/components/SearchForm';

import TablePendingOrder from './TablePendingOrder';

import { 
    getPendingOrderList,
    IFilterParams
} from '@/services/order-manage';
import { transStartDate, transEndDate, utcToLocal } from '@/utils/date';
import { 
    defaultOptionItem, 
    channelOptionList, 
    orderStatusOptionList,
    pageSizeOptions
} from '@/enums/OrderEnum';
import { AntAnchor } from 'antd/lib/anchor/Anchor';

const defaultFieldList: IFieldItem[] = [
    {
        type: 'dateRanger',
        name: ['order_start_time', 'order_end_time'],
        label: '订单时间',
        className: 'order-date-picker',
        // formItemClassName: 'order-form-item',
        placeholder: '请选择订单时间',
    },
    {
        type: 'input',
        name: 'middleground_order_id',
        label: '中台订单ID',
        className: 'order-input',
        formItemClassName: 'order-form-item',
        placeholder: '请输入中台订单ID',
    },
    {
        type: 'select',
        name: 'channel',
        label: '销售渠道',
        className: 'order-input',
        formItemClassName: 'order-form-item',
        optionList: [
            defaultOptionItem,
            ...channelOptionList
        ],
    }
];

const allFieldList: IFieldItem[] = [
    ...defaultFieldList,
    {
        type: 'select',
        name: 'order_goods_status',
        label: '中台订单状态',
        className: 'order-input',
        formItemClassName: 'order-form-item',
        optionList: [
            defaultOptionItem,
            ...orderStatusOptionList
        ],
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
        label: '中台sku id',
        className: 'order-input',
        formItemClassName: 'order-form-item',
        placeholder: '请输入中台sku id',
    }
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
    showStatus: boolean;
    // selectedRowKeys: string[];
    orderList: IOrderItem[];
}

class PanePendingOrder extends React.PureComponent<{}, IState> {

    private formRef: RefObject<FormInstance> = React.createRef();

    private initialValues = {
        channel: 100,
        order_goods_status: 100
    }

    constructor(props: {}) {
        super(props);
        this.state = {
            page: 1,
            pageCount: 30,
            total: 0,
            loading: false,
            showStatus: false,
            orderList: [],
            // selectedRowKeys: []
        }
    }

    componentDidMount() {
        // console.log('PaneAll');
        this.onSearch();
    }

    onSearch = (baseParams?: IFilterParams) => {
        const { page, pageCount } = this.state;
        let params: IFilterParams = {
            page,
            page_count: pageCount
        }
        // if (this.orderFilterRef.current) {
        //     // console.log('onSearch', this.orderFilterRef.current.getValues());
        //     params = Object.assign(params, this.orderFilterRef.current.getValues());
        // }
        if (baseParams) {
            params = Object.assign(params, baseParams);
        }
        // console.log('getValues', this.orderFilterRef.current!.getValues());
        this.setState({
            loading: true
        })
        getPendingOrderList(params).then(res => {
            // console.log('getProductOrderList', res);
            // const { total, list } = res.data;
            const { all_count, list } = res.data;
            const childList: any[] = [];
            list.forEach((item: any) => {
                item.orderGoods.forEach((goodsItem: any) => {
                    childList.push(goodsItem);
                })
            })
            this.setState({
                total: all_count,
                page: params.page as number,
                pageCount: params.page_count as number,
                orderList: this.getOrderData(childList)
            })
        }).finally(() => {
            this.setState({
                loading: false
            })
        })
    }

    // 获取子订单=>采购计划数据
    private getOrderData(list: any[]): IOrderItem[] {
        const orderList: IOrderItem[] = [];
        list.forEach((goodsItem: any) => {
            const {
                orderGoodsPurchasePlan,
                channelOrderGoodsSn,
                createTime: goodsCreateTime,
                lastUpdateTime: goodsLastUpdateTime,
                goodsAmount,
                goodsNumber,
                orderGoodsExtension,
                orderGoodsId,
                orderGoodsShippingStatus,
                orderGoodsStatus,
                orderId,
                productId,
                productPlatform,
                productShop,
                skuId
            } = goodsItem;
            // console.log(111, goodsItem);
            orderGoodsPurchasePlan.forEach((purchaseItem: any, index: number) => {
                const {
                    createTime: purchaseCreateTime,
                    lastUpdateTime: purchaseLastUpdateTime,
                    // orderGoodsId,
                    purchaseAmount,
                    purchaseNumber,
                    purchaseOrderPayStatus,
                    purchaseOrderShippingStatus,
                    purchaseOrderStatus,
                    purchasePlanId,
                    purchasePlatform
                } = purchaseItem;
                const orderItem: any = {
                    channelOrderGoodsSn,
                    goodsCreateTime,
                    goodsLastUpdateTime,
                    goodsAmount,
                    goodsNumber,
                    orderGoodsExtension,
                    orderGoodsId,
                    orderGoodsShippingStatus,
                    orderGoodsStatus,
                    orderId,
                    productId,
                    productPlatform,
                    productShop,
                    skuId,
                    purchaseAmount,
                    purchaseNumber,
                    purchaseOrderPayStatus,
                    purchaseOrderShippingStatus,
                    purchaseOrderStatus,
                    purchasePlanId,
                    purchasePlatform,
                    purchaseCreateTime,
                    purchaseLastUpdateTime
                }
                if (index === 0) {
                    orderItem._rowspan = orderGoodsPurchasePlan.length;
                    orderItem._checked = false;
                }
                orderList.push(orderItem);
            })
        });
        // console.log(1111, childOrderList);
        return orderList;
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
        } = fields
        return Object.assign(fields, {
            order_start_time: order_start_time ? transStartDate(order_start_time) : order_start_time,
            order_end_time: order_end_time ? transEndDate(order_end_time) : order_end_time,
        });
    }

    changeShowStatus = () => {
        const { showStatus } = this.state;
        this.setState({
            showStatus: !showStatus
        });
    }

    // 全选
    onCheckAllChange = (status: boolean) => {
        const { orderList } = this.state;
        this.setState({
            orderList: orderList.map(item => {
                if (item._rowspan) {
                    return {
                        ...item,
                        _checked: status
                    }
                }
                return item;
            })
        });
    }

    // 单选
    onSelectedRow = (row: IOrderItem) => {
        const { orderList } = this.state;
        this.setState({
            orderList: orderList.map(item => {
                if (row._rowspan && row.orderGoodsId === item.orderGoodsId) {
                    return {
                        ...item,
                        _checked: !row._checked
                    }
                }
                return item;
            })
        });
    }

    render() {

        const {
            showStatus,
            loading,
            orderList,
            total,
            page,
            pageCount,

        } = this.state;

        

        const fieldList = showStatus ? allFieldList : defaultFieldList;

        return (
            <>
                <div>
                    <SearchForm
                        labelClassName="order-label"
                        fieldList={fieldList}
                        formRef={this.formRef}
                        initialValues={this.initialValues}
                    />
                    <div className="order-operation">
                        <Button type="primary" className="order-btn" onClick={() => this.getFieldsValue()}>查询</Button>
                        <Button type="primary" className="order-btn">一键拍单</Button>
                        <Button type="primary" className="order-btn">取消销售单</Button>
                        <Button type="primary" className="order-btn">导出数据</Button>
                        <Button 
                            type="default" 
                            className="order-btn"
                            onClick={this.changeShowStatus}
                        >{ showStatus ? '收起' : '展示'}搜索条件</Button>
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
                        showTotal={(total) => `共${total}条`}
                    />
                </div>
            </>
        );
    }
}

export default PanePendingOrder;

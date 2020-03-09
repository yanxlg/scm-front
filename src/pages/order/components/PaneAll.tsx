import React, { RefObject } from 'react';
import { Pagination, Button } from 'antd';
import { FormInstance } from 'antd/lib/form';

import JsonForm, { IFieldItem } from '@/components/JsonForm';
import OptionalColumn, { IOptionalColItem } from './OptionalColumn';
import TableAll from './TableAll';
import TableParentAll from './TableParentAll';

import { 
    getAllOrderList,
    IFilterParams
} from '@/services/order-manage';
import { 
    childDefaultFieldList,
    childAllFieldList,
    childOptionalColList, 
    parentDefaultFieldList,
    parentAllFieldList,
    defaultColChildList, 
    defaultParentColList,
    parentOptionalColList, 
    pageSizeOptions 
} from '@/enums/OrderEnum';
import { transStartDate, transEndDate, utcToLocal } from '@/utils/date';

export declare interface IPurchaseStatus {
    status: number;
    comment: string;
}

declare interface IGoodsItem {
    goods_commodity_id: string;
    goods_purchase_status: IPurchaseStatus;   // 采购订单状态
    goods_purchase_payment_status: number;    // 采购支付状态
    goods_purchase_delivery_status: number;   // 采购配送状态
    goods_purchase_order_time: number;        // 采购生成时间
    goods_purchase_order_sn: string;          // 采购订单号
    goods_purchase_waybill_sn: string;        // 采购运单号
}

declare interface IBaseOrderItem {
    order_confirm_time: number;           // 订单确认时间
    channel_order_id: string;             // 渠道订单ID
    channel_goods_price: number;          // 价格
    channel_shipping_fee: number;         // 运费
    goods_number: number;                 // 商品数量
    cancel_order_time: number;            // 取消订单时间
    middleground_order_status: number;    // 中台订单状态
    purchase_payment_status: number;      // 采购支付状态
    purchase_order_time: number;          // 采购生成时间
    purchase_shipping_no: string;         // 采购运单号
    channel: number;                      // 销售渠道
    middleground_p_order_id: string;      // 中台父订单ID
    currency_type: string;                // 货币类型
    remain_delivery_time: string;         // 发货剩余时间
    channel_store_name: string;           // 渠道店铺名
    purchase_cancel_reason: number;       // 采购取消原因
    goods_amount: number;                 // 商品总金额
    channel_order_status: number;         // 渠道订单状态
    purchase_order_status: number;        // 采购订单状态
    purchase_delivery_status: number;     // 采购配送状态
    purchase_order_no: string;            // 采购订单号
    p_order_id: string;                   // 父订单ID
    child_order_id: string;               // 子订单ID
    middleground_c_order_id: string;      // 中台子订单ID 
}

// export declare interface IOrderItem extends IBaseOrderItem, IGoodsItem {
//     _checked?: boolean;
//     _rowspan?: number;
// }

export declare interface IChildOrderItem {
    [key: string]: any;
}

export declare interface IParentOrderItem {
    [key: string]: any;
}

declare interface IPaneAllState {
    page: number;
    pageCount: number;
    total: number;
    loading: boolean;
    showFilterStatus: boolean;
    showColStatus: boolean;
    showParentStatus: boolean;
    childOrderList: IChildOrderItem[];
    parentOrderList: IParentOrderItem[];
    fieldList: IFieldItem[];
    selectedColKeyList: string[];
    colChildList: string[];
    colParentList: string[];
    childOptionalColList: IOptionalColItem[];

}

class PaneAll extends React.PureComponent<{}, IPaneAllState> {

    private formRef: RefObject<FormInstance> = React.createRef();
    private optionalRef: RefObject<OptionalColumn> = React.createRef();

    private initialValues = {
        channel: 100,
        sale_order_status: 100,
        purchase_order_status: 100,
        purchase_pay_status: 100,
        purchase_shipping_status: 100,
        purchase_cancel_res: 100
    }

    private endFieldItem: IFieldItem = {
        type: 'checkbox',
        name: 'only_p_order',
        label: '仅展示父订单ID',
        onChange: (status: boolean) => {
            this.changeParentOrder(status);
        }
    }

    constructor(props: {}) {
        super(props);
        this.state = {
            page: 1,
            pageCount: 50,
            total: 0,
            loading: false,
            showFilterStatus: false,
            showColStatus: false,
            showParentStatus: false,
            childOrderList: [],
            parentOrderList: [],
            fieldList: [
                ...childDefaultFieldList,
                this.endFieldItem
            ],
            selectedColKeyList: [],
            childOptionalColList: childOptionalColList,
            // 表格展示的列
            colChildList: defaultColChildList,
            colParentList: defaultParentColList
        }
    }

    componentDidMount() {
        this.onSearch();
    }

    private onSearch = (filterParams?: IFilterParams) => {
        const { page, pageCount } = this.state;
        let params: IFilterParams = {
            page,
            page_count: pageCount
        }
        // if (this.orderFilterRef.current) {
        //     // console.log('onSearch', this.orderFilterRef.current.getValues());
        //     params = Object.assign(params, this.orderFilterRef.current.getValues());
        // }
        if (filterParams) {
            params = Object.assign(params, filterParams);
        }
        // console.log('getValues', this.orderFilterRef.current!.getValues());
        this.setState({
            loading: true
        })
        getAllOrderList(params).then(res => {
            // console.log('getProductOrderList', res);
            const { all_count, list } = res.data;
            const { page, page_count, only_p_order } = params;
            this.setState({
                total: all_count,
                page: page as number,
                pageCount: page_count as number
            })
            if (only_p_order) {
                this.setState({
                    parentOrderList: this.getParentOrderData(list),
                })
            } else {
                this.setState({
                    childOrderList: this.getChildOrderData(list)
                })
            }
        }).finally(() => {
            this.setState({
                loading: false
            })
        })
    }

    // 获取子订单=>采购计划数据
    private getChildOrderData(list: any[]): IChildOrderItem[] {
        const childOrderList: IChildOrderItem[] = [];
        list.forEach((goodsItem: any) => {
            const { orderGoods } = goodsItem;
            const { orderGoodsPurchasePlan, ...orderRest } = orderGoods;
            // console.log(111, goodsCreateTime);
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
                    purchaseLastUpdateTime
                }
                if (index === 0) {
                    childOrderItem._rowspan = orderGoodsPurchasePlan.length;
                    childOrderItem._checked = false;
                }
                childOrderList.push(childOrderItem);
            })
        });
        // console.log(1111, childOrderList);
        return childOrderList;
    }

    // 获取中单订单=>子订单数据
    private getParentOrderData(list: any[]): IParentOrderItem[] {
        const parentOrderList: IParentOrderItem[] = [];
        list.forEach(item => {
            const {
                orderGoods,
                ...parentRest
            } = item;
            orderGoods.forEach((goodsItem: any, index: number) => {
                const {
                    // orderId,
                    createTime: goodsCreateTime,
                    lastUpdateTime: goodsLastUpdateTime,
                    ...goodsRest
                } = goodsItem;
                const parentOrderItem: any = {
                    goodsCreateTime,
                    goodsLastUpdateTime,
                    ...parentRest,
                    ...goodsRest
                }
                if (index === 0) {
                    parentOrderItem._rowspan = orderGoods.length;
                }
                parentOrderList.push(parentOrderItem);
            })
        });
        return parentOrderList;
    }

    private changeParentOrder = (status: boolean) => {
        // console.log('changeParentOrder', status);
        const { showColStatus } = this.state;
        this.setState({
            showParentStatus: status,
            selectedColKeyList: [],
            childOptionalColList: status ? parentOptionalColList : childOptionalColList,
            // childOrderList: [],
            // parentOrderList: []
            
        }, () => {
            // 切换过滤条件
            this.changeFilter();
            if (showColStatus) {
                this.optionalRef.current!.cancelCheckAll();
            }
            this.onSearch({
                page: 1,
                page_count: 50,
                only_p_order: status ? 1 : 0
            });
        });
        
    }

    // 展示过滤条件
    private changeFilter = () => {
        const { showParentStatus, showFilterStatus } = this.state;
        let fieldList: IFieldItem[] = [];
        if ( showParentStatus && showFilterStatus ) {
            fieldList = parentAllFieldList
        } else if (showParentStatus && !showFilterStatus) {
            fieldList = parentDefaultFieldList
        } else if (!showParentStatus && showFilterStatus) {
            fieldList = childAllFieldList
        } else {
            fieldList = childDefaultFieldList
        }
        this.setState({
            fieldList: [
                ...fieldList,
                this.endFieldItem
            ]
        })
    }

    private changeShowFilterStatus = () => {
        const { showFilterStatus } = this.state;
        this.setState({
            showFilterStatus: !showFilterStatus
        }, () => {
            this.changeFilter();
        });
    }

    changeShowColStatus = () => {
        const { showColStatus } = this.state;
        this.setState({
            showColStatus: !showColStatus
        });
    }

    changeSelectedColList = (list: string[]) => {
        const { showParentStatus } = this.state;
        this.setState({
            selectedColKeyList: list,
            // colChildList: [...defaultColChildList, ...list]
        });
        if (showParentStatus) {
            this.setState({
                colParentList: [...defaultParentColList, ...list]
            })
        } else {
            this.setState({
                colChildList: [...defaultColChildList, ...list]
            })
        }
    }

    // 获取查询数据
    getFieldsValue = () => {
        // console.log('111', this.formRef.current!.getFieldsValue());
        const fields = this.formRef.current!.getFieldsValue();
        const {
            order_start_time,
            order_end_time,
            purchase_start_time,
            purchase_end_time,
            only_p_order
        } = fields
        return Object.assign(fields, {
            order_start_time: order_start_time ? transStartDate(order_start_time) : order_start_time,
            order_end_time: order_end_time ? transEndDate(order_end_time) : order_end_time,
            purchase_start_time: purchase_start_time ? transStartDate(purchase_start_time) : purchase_start_time,
            purchase_end_time: purchase_end_time ? transStartDate(purchase_end_time) : purchase_end_time,
            only_p_order: only_p_order ? 1 : 0
        });
    }

    // 全选
    onCheckAllChange = (status: boolean) => {
        const { childOrderList } = this.state;
        this.setState({
            childOrderList: childOrderList.map(item => {
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
    onSelectedRow = (row: IChildOrderItem) => {
        const { childOrderList } = this.state;
        this.setState({
            childOrderList: childOrderList.map(item => {
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
            page,
            pageCount,
            total,
            loading,
            showFilterStatus,
            showParentStatus,
            showColStatus,
            childOrderList,
            parentOrderList,
            fieldList,
            selectedColKeyList,
            childOptionalColList,
            colChildList,
            colParentList
        } = this.state;
    
        return (
            <>
                <div>
                    <JsonForm
                        fieldList={fieldList}
                        labelClassName="order-label"
                        formRef={this.formRef}
                        initialValues={this.initialValues}
                    />
                    <div className="order-operation">
                        <Button 
                            type="primary" 
                            className="order-btn"
                            onClick={() => this.getFieldsValue()}
                        >查询</Button>
                        {
                            !showParentStatus ? (
                                <Button type="primary" className="order-btn">一键拍单</Button>
                            ) : null
                        }
                        {
                            !showParentStatus ? (
                                <Button type="primary" className="order-btn">取消采购单</Button>
                            ) : null
                        }
                        {
                            !showParentStatus ? (
                                <Button type="primary" className="order-btn">取消渠道订单</Button>
                            ) : null
                        }
                        <Button type="primary" className="order-btn">导出数据</Button>
                        <Button 
                            className="order-btn"
                            onClick={this.changeShowFilterStatus}
                        >{ showFilterStatus ? '收起' : '展示'}搜索条件</Button>
                        <Button 
                            className="order-btn"
                            onClick={this.changeShowColStatus}
                        >{ showColStatus ? '收起' : '展示'}字段设置</Button>
                    </div>
                    {
                        showColStatus ? (
                            <OptionalColumn
                                ref={this.optionalRef}
                                optionalColList={childOptionalColList}
                                selectedColKeyList={selectedColKeyList}
                                changeSelectedColList={this.changeSelectedColList}
                            />
                        ) : null
                    }
                    {
                        !showParentStatus ? (
                            <TableAll
                                loading={loading}
                                colList={colChildList}
                                orderList={childOrderList}
                                onCheckAllChange={this.onCheckAllChange}
                                onSelectedRow={this.onSelectedRow}
                            />
                        ) : (
                            <TableParentAll
                                loading={loading}
                                colList={colParentList}
                                orderList={parentOrderList}
                            />
                        )
                    }
                    
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

export default PaneAll;

import React, { RefObject } from 'react';
import { Pagination, Button, message, notification } from 'antd';

import SearchForm, { IFieldItem } from '@/components/SearchForm';
import OptionalColumn, { IOptionalColItem } from './OptionalColumn';
import TableAll from './TableAll';
import TableParentAll from './TableParentAll';

import {
    getAllOrderList,
    IFilterParams,
    delChannelOrders,
    postOrdersPlace,
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
    pageSizeOptions,
} from '@/enums/OrderEnum';
import { transStartDate, transEndDate, utcToLocal } from '@/utils/date';

export declare interface IPurchaseStatus {
    status: number;
    comment: string;
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
    private formRef: RefObject<SearchForm> = React.createRef();
    private optionalRef: RefObject<OptionalColumn> = React.createRef();

    private initialValues = {
        channel_source: 100,
        order_goods_status: 100,
        order_goods_shipping_status: 100,
        non_purchase_plan: 100,
    };

    private endFieldItem: IFieldItem = {
        type: 'checkbox',
        name: 'only_p_order',
        label: '仅展示父订单ID',
        // name, form, setState
        onChange: (name, form, setState) => {
            this.changeParentOrder(form.getFieldValue(name));
        },
    };

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
            fieldList: [...childDefaultFieldList, this.endFieldItem],
            selectedColKeyList: [],
            childOptionalColList: childOptionalColList,
            // 表格展示的列
            colChildList: defaultColChildList,
            colParentList: defaultParentColList,
        };
    }

    componentDidMount() {
        this.onSearch();
    }

    private onSearch = (filterParams?: IFilterParams) => {
        const { page, pageCount } = this.state;
        let params: IFilterParams = {
            page,
            page_count: pageCount,
        };
        // if (this.orderFilterRef.current) {
        //     // console.log('onSearch', this.orderFilterRef.current.getValues());
        //     params = Object.assign(params, this.orderFilterRef.current.getValues());
        // }
        if (filterParams) {
            params = Object.assign(params, filterParams);
        }
        // console.log('getValues', this.orderFilterRef.current!.getValues());
        this.setState({
            loading: true,
        });
        getAllOrderList(params)
            .then(res => {
                // console.log('getProductOrderList', res);
                const { all_count, list } = res.data;
                const { page, page_count, only_p_order } = params;
                this.setState({
                    total: all_count,
                    page: page as number,
                    pageCount: page_count as number,
                });
                if (only_p_order) {
                    this.setState({
                        parentOrderList: this.getParentOrderData(list),
                    });
                } else {
                    this.setState({
                        childOrderList: this.getChildOrderData(list),
                    });
                }
            })
            .finally(() => {
                this.setState({
                    loading: false,
                });
            });
    };

    // 获取子订单=>采购计划数据
    private getChildOrderData(list: any[]): IChildOrderItem[] {
        // console.log(1111, list);
        const childOrderList: IChildOrderItem[] = [];
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

    // 获取中单订单=>子订单数据
    private getParentOrderData(list: any[]): IParentOrderItem[] {
        const parentOrderList: IParentOrderItem[] = [];
        list.forEach(item => {
            const { orderGoods, ...parentRest } = item;
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
                    ...goodsRest,
                };
                if (index === 0) {
                    parentOrderItem._rowspan = orderGoods.length;
                }
                parentOrderList.push(parentOrderItem);
            });
        });
        return parentOrderList;
    }

    private changeParentOrder = (status: boolean) => {
        // console.log('changeParentOrder', status);
        const { showColStatus } = this.state;
        this.setState(
            {
                showParentStatus: status,
                selectedColKeyList: [],
                childOptionalColList: status ? parentOptionalColList : childOptionalColList,
                // childOrderList: [],
                // parentOrderList: []
            },
            () => {
                // 切换过滤条件
                this.changeFilter();
                if (showColStatus) {
                    this.optionalRef.current!.cancelCheckAll();
                }
                this.onSearch({
                    page: 1,
                    page_count: 50,
                    only_p_order: status ? 1 : 0,
                });
            },
        );
    };

    // 展示过滤条件
    private changeFilter = () => {
        const { showParentStatus, showFilterStatus } = this.state;
        let fieldList: IFieldItem[] = [];
        if (showParentStatus && showFilterStatus) {
            fieldList = parentAllFieldList;
        } else if (showParentStatus && !showFilterStatus) {
            fieldList = parentDefaultFieldList;
        } else if (!showParentStatus && showFilterStatus) {
            fieldList = childAllFieldList;
        } else {
            fieldList = childDefaultFieldList;
        }
        this.setState({
            fieldList: [...fieldList, this.endFieldItem],
        });
    };

    private changeShowFilterStatus = () => {
        const { showFilterStatus } = this.state;
        this.setState(
            {
                showFilterStatus: !showFilterStatus,
            },
            () => {
                this.changeFilter();
            },
        );
    };

    private changeShowColStatus = () => {
        const { showColStatus } = this.state;
        this.setState({
            showColStatus: !showColStatus,
        });
    };

    private changeSelectedColList = (list: string[]) => {
        const { showParentStatus } = this.state;
        this.setState({
            selectedColKeyList: list,
            // colChildList: [...defaultColChildList, ...list]
        });
        if (showParentStatus) {
            this.setState({
                colParentList: [...defaultParentColList, ...list],
            });
        } else {
            this.setState({
                colChildList: [...defaultColChildList, ...list],
            });
        }
    };

    // 全选
    onCheckAllChange = (status: boolean) => {
        const { childOrderList } = this.state;
        this.setState({
            childOrderList: childOrderList.map(item => {
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
    onSelectedRow = (row: IChildOrderItem) => {
        const { childOrderList } = this.state;
        this.setState({
            childOrderList: childOrderList.map(item => {
                if (item._rowspan && row.orderGoodsId === item.orderGoodsId) {
                    return {
                        ...item,
                        _checked: !row._checked,
                    };
                }
                return item;
            }),
        });
    };

    // 获取查询数据
    private getFieldsValue = () => {
        // console.log('111', this.formRef.current!.getFieldsValue());
    };

    // 一键拍单
    postOrdersPlace = () => {
        const { childOrderList } = this.state;
        const orderGoodsIdList = childOrderList
            .filter(item => item._checked)
            .map(item => item.orderGoodsId);
        if (orderGoodsIdList.length) {
            // console.log('orderGoodsIdList', orderGoodsIdList);
            postOrdersPlace({
                order_goods_ids: orderGoodsIdList,
            }).then(res => {
                // console.log('delChannelOrders', res);
                const { success, failed } = res.data;
                if (success!.length) {
                    notification.success({
                        message: '拍单成功',
                        description: success.join('、'),
                    });
                } else if (failed!.length) {
                    notification.error({
                        message: '拍单失败',
                        description: (
                            <div>
                                {failed.map((item: any) => (
                                    <div>
                                        {item.order_goods_id}: {item.result}
                                    </div>
                                ))}
                            </div>
                        ),
                    });
                }
            });
        } else {
            message.error('请选择需要拍单的订单！');
        }
    };

    // 取消渠道订单
    cancelChannelOrder = () => {
        const { childOrderList } = this.state;
        const orderGoodsIdList = childOrderList
            .filter(item => item._checked)
            .map(item => item.orderGoodsId);
        if (orderGoodsIdList.length) {
            // console.log('orderGoodsIdList', orderGoodsIdList);
            delChannelOrders({
                order_goods_ids: orderGoodsIdList,
            }).then(res => {
                // console.log('delChannelOrders', res);
                const { success, failed } = res.data;
                if (success!.length) {
                    notification.success({
                        message: '取消渠道订单成功',
                        description: success.join('、'),
                    });
                } else if (failed!.length) {
                    notification.error({
                        message: '取消渠道订单失败',
                        description: (
                            <div>
                                {failed.map((item: any) => (
                                    <div>
                                        {item.order_goods_id}: {item.result}
                                    </div>
                                ))}
                            </div>
                        ),
                    });
                }
            });
        } else {
            message.error('请选择需要删除的订单！');
        }
    };

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
            colParentList,
        } = this.state;

        return (
            <>
                <div>
                    <SearchForm
                        ref={this.formRef}
                        fieldList={fieldList}
                        labelClassName="order-label"
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
                        {!showParentStatus ? (
                            <Button
                                type="primary"
                                className="order-btn"
                                onClick={this.postOrdersPlace}
                            >
                                一键拍单
                            </Button>
                        ) : null}
                        {!showParentStatus ? (
                            <Button type="primary" className="order-btn">
                                取消采购单
                            </Button>
                        ) : null}
                        {!showParentStatus ? (
                            <Button
                                type="primary"
                                className="order-btn"
                                onClick={this.cancelChannelOrder}
                            >
                                取消渠道订单
                            </Button>
                        ) : null}
                        <Button type="primary" className="order-btn">
                            导出数据
                        </Button>
                        <Button className="order-btn" onClick={this.changeShowFilterStatus}>
                            {showFilterStatus ? '收起' : '展示'}搜索条件
                        </Button>
                        <Button className="order-btn" onClick={this.changeShowColStatus}>
                            {showColStatus ? '收起' : '展示'}字段设置
                        </Button>
                    </div>
                    {showColStatus ? (
                        <OptionalColumn
                            ref={this.optionalRef}
                            optionalColList={childOptionalColList}
                            selectedColKeyList={selectedColKeyList}
                            changeSelectedColList={this.changeSelectedColList}
                        />
                    ) : null}
                    {!showParentStatus ? (
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
                    )}

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

export default PaneAll;

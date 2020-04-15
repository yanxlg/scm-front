import React, { RefObject } from 'react';
import { Pagination, Button, message, notification } from 'antd';

import { JsonFormRef, FormField } from 'react-components/es/JsonForm';
import { JsonForm } from 'react-components';

import { LoadingButton } from 'react-components';
import OptionalColumn, { IOptionalColItem } from './OptionalColumn';
import TableAll from './TableAll';
import TableParentAll from './TableParentAll';

import {
    getAllOrderList,
    delChannelOrders,
    postOrdersPlace,
    delPurchaseOrders,
    postExportAll,
    IFilterParams,
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
import { getCurrentPage } from '@/utils/common';

export declare interface IPurchaseStatus {
    status: number;
    comment: string;
}

export declare interface ISkuStyle {
    [key: string]: string;
}

export declare interface IGoodsDetail {
    product_id: string;
    goods_img: string;
    title: string;
    sku_style?: ISkuStyle[];
    sku_sn?: string;
    sku_img?: string;
    commodity_sku_id?: string;
}

export declare interface IChildOrderItem {
    [key: string]: any;
}

export declare interface IParentOrderItem {
    [key: string]: any;
}

declare interface IProps {
    getAllTabCount(type: number): void;
}

declare interface IState {
    page: number;
    pageCount: number;
    total: number;
    loading: boolean;
    showFilterStatus: boolean;
    showColStatus: boolean;
    showParentStatus: boolean;
    childOrderList: IChildOrderItem[];
    parentOrderList: IParentOrderItem[];
    fieldList: FormField[];
    selectedColKeyList: string[];
    colChildList: string[];
    colParentList: string[];
    childOptionalColList: IOptionalColItem[];
}

class PaneAll extends React.PureComponent<IProps, IState> {
    private formRef: RefObject<JsonFormRef> = React.createRef();
    private optionalRef: RefObject<OptionalColumn> = React.createRef();
    private currentSearchParams: IFilterParams | null = null;
    private initialValues = {
        channel_source: 100,
        order_goods_status: 100,
        order_goods_shipping_status: 100,
        non_purchase_plan: 100,
        purchase_order_pay_status: 100,
        purchase_order_status: 100,
        reserve_status: 100,
    };

    private endFieldItem: FormField = {
        type: 'checkbox',
        name: 'only_p_order',
        label: '仅展示父订单ID',
        formItemClassName: 'order-form-item',
        // name, form, setState
        onChange: (name, form) => {
            this.changeParentOrder(form.getFieldValue(name));
        },
    };

    constructor(props: IProps) {
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
        const fields = this.getFieldsValue();
        // if (!fields) {}
        let params: IFilterParams = {
            page,
            page_count: pageCount,
            ...fields,
        };
        // console.log(this.getFieldsValue())
        // return
        if (filterParams) {
            params = Object.assign(params, filterParams);
        }
        // console.log('getValues', this.orderFilterRef.current!.getValues());
        this.setState({
            loading: true,
        });
        getAllOrderList(params)
            .then(res => {
                this.currentSearchParams = params;
                // console.log('getProductOrderList', res);
                const { all_count, list } = res.data;
                const { page, page_count, only_p_order } = params;
                if (list) {
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
                        this.setState(
                            {
                                childOrderList: this.getChildOrderData(list),
                            },
                            () => {
                                this.bindMouseenter();
                            },
                        );
                    }
                }
            })
            .finally(() => {
                this.setState({
                    loading: false,
                });
            });
    };

    // 获取查询数据
    private getFieldsValue = () => {
        const { only_p_order, ...fields } = this.formRef.current!.getFieldsValue();
        return {
            only_p_order: only_p_order ? 1 : 0,
            ...fields,
        };
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
        this.currentSearchParams = null;
        this.setState(
            {
                showParentStatus: status,
                page: 1,
                pageCount: 50,
                total: 0,
                selectedColKeyList: [],
                childOptionalColList: status ? parentOptionalColList : childOptionalColList,
                childOrderList: [],
                parentOrderList: [],
            },
            () => {
                // 切换过滤条件
                this.changeFilter();
                if (showColStatus) {
                    this.optionalRef.current!.cancelCheckAll();
                }
                this.onSearch();
                this.props.getAllTabCount(status ? 1 : 2);
            },
        );
    };

    // 展示过滤条件
    private changeFilter = () => {
        const { showParentStatus, showFilterStatus } = this.state;
        let fieldList: FormField[] = [];
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

    // private changeShowColStatus = () => {
    //     const { showColStatus } = this.state;
    //     this.setState({
    //         showColStatus: !showColStatus,
    //     });
    // };

    private changeSelectedColList = (list: string[]) => {
        const { showParentStatus } = this.state;
        this.setState({
            selectedColKeyList: list,
            // colChildList: [...defaultColChildList, ...list]
        });
        if (showParentStatus) {
            const colList = parentOptionalColList
                .filter(item => list.indexOf(item.key) > -1)
                .map(item => item.key);
            this.setState({
                colParentList: [...defaultParentColList, ...colList],
            });
        } else {
            const colList = childOptionalColList
                .filter(item => list.indexOf(item.key) > -1)
                .map(item => item.key);
            this.setState({
                colChildList: [...defaultColChildList, ...colList],
            });
        }
    };

    // 全选
    private onCheckAllChange = (status: boolean) => {
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
    private onSelectedRow = (row: IChildOrderItem) => {
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

    // 获取勾选的orderGoodsId
    private getOrderGoodsIdList = (): string[] => {
        const { childOrderList } = this.state;
        return childOrderList.filter(item => item._checked).map(item => item.orderGoodsId);
    };

    // 一键拍单
    private postOrdersPlace = () => {
        const orderGoodsIdList = this.getOrderGoodsIdList();
        if (orderGoodsIdList.length) {
            // console.log('orderGoodsIdList', orderGoodsIdList);
            return postOrdersPlace({
                order_goods_ids: orderGoodsIdList,
            }).then(res => {
                // console.log('delChannelOrders', res);
                this.onSearch();
                const { success, failed } = res.data;
                if (success!.length) {
                    notification.success({
                        message: '拍单成功',
                        description: (
                            <div>
                                {success.map((item: string) => (
                                    <div key={item}>{item}</div>
                                ))}
                            </div>
                        ),
                    });
                }
                if (failed!.length) {
                    notification.error({
                        message: '拍单失败',
                        description: (
                            <div>
                                {failed.map((item: any) => (
                                    <div>
                                        {item.order_goods_id}: {item.result.slice(0, 50)}
                                    </div>
                                ))}
                            </div>
                        ),
                    });
                }
            });
        } else {
            message.error('请选择需要拍单的订单！');
            return Promise.resolve();
        }
    };

    // 取消采购订单
    private cancelPurchaseOrder = () => {
        const orderGoodsIdList = this.getOrderGoodsIdList();
        if (orderGoodsIdList.length) {
            return delPurchaseOrders({
                order_goods_ids: orderGoodsIdList,
            }).then(res => {
                const { success, failed } = res.data;
                // console.log(1111, failed);
                this.onSearch();
                if (success!.length) {
                    notification.success({
                        message: '取消采购单成功',
                        description: (
                            <div>
                                {success.map((item: string) => (
                                    <div key={item}>{item}</div>
                                ))}
                            </div>
                        ),
                    });
                }
                if (failed!.length) {
                    notification.error({
                        message: '取消采购单失败',
                        description: (
                            <div>
                                {failed.map((item: any) => (
                                    <div key={item.order_goods_id}>
                                        {item.order_goods_id}: {item.result.slice(0, 50)}
                                    </div>
                                ))}
                            </div>
                        ),
                    });
                }
            });
        } else {
            message.error('请选择需要取消的订单！');
            return Promise.resolve();
        }
    };

    // 取消渠道订单
    private cancelChannelOrder = () => {
        const orderGoodsIdList = this.getOrderGoodsIdList();
        if (orderGoodsIdList.length) {
            // console.log('orderGoodsIdList', orderGoodsIdList);
            return delChannelOrders({
                order_goods_ids: orderGoodsIdList,
            }).then(res => {
                // console.log('delChannelOrders', res);
                const { success, failed } = res.data;
                this.onSearch();
                if (success!.length) {
                    notification.success({
                        message: '取消渠道订单成功',
                        description: (
                            <div>
                                {success.map((item: string) => (
                                    <div key={item}>{item}</div>
                                ))}
                            </div>
                        ),
                    });
                }
                if (failed!.length) {
                    notification.error({
                        message: '取消渠道订单失败',
                        description: (
                            <div>
                                {failed.map((item: any) => (
                                    <div>
                                        {item.order_goods_id}: {item.result.slice(0, 50)}
                                    </div>
                                ))}
                            </div>
                        ),
                    });
                }
            });
        } else {
            message.error('请选择需要取消的订单！');
            return Promise.resolve();
        }
    };

    private onChangePage = (page: number) => {
        this.onSearch({
            page,
        });
    };

    private pageCountChange = (current: number, size: number) => {
        const { page, pageCount } = this.state;
        this.onSearch({
            page: getCurrentPage(size, (page - 1) * pageCount + 1),
            page_count: size,
        });
    };

    // 导出excel
    private postExportAll = () => {
        const params = this.currentSearchParams
            ? this.currentSearchParams
            : {
                  page: 1,
                  page_count: 50,
              };
        return postExportAll(params);
    };

    // 绑定事件，处理hover问题
    private bindMouseenter = () => {
        [...document.querySelectorAll('.colspan-cell')].forEach(item => {
            // console.log(item);
            item.addEventListener('mouseenter', function(e) {
                // console.log(e.target?.parentNode);
                const id = (e.target as any).parentNode.getAttribute('data-id');
                [...document.querySelectorAll(`.order-tr[data-id='${id}']`)].forEach(node => {
                    node.classList.add('hover');
                });
            });

            item.addEventListener('mouseleave', function(e) {
                // console.log(e.target?.parentNode);
                const id = (e.target as any).parentNode.getAttribute('data-id');
                [...document.querySelectorAll(`.order-tr[data-id='${id}']`)].forEach(node => {
                    node.classList.remove('hover');
                });
            });
        });
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
                    <JsonForm
                        ref={this.formRef}
                        fieldList={fieldList}
                        labelClassName="order-all-label"
                        initialValues={this.initialValues}
                        enableCollapse={false}
                    />
                    <div className="order-operation">
                        <Button
                            type="primary"
                            className="order-btn"
                            loading={loading}
                            onClick={() => this.onSearch()}
                        >
                            查询
                        </Button>
                        {!showParentStatus ? (
                            <LoadingButton
                                type="primary"
                                className="order-btn"
                                onClick={this.postOrdersPlace}
                            >
                                一键拍单
                            </LoadingButton>
                        ) : null}
                        {!showParentStatus ? (
                            <LoadingButton
                                type="primary"
                                className="order-btn"
                                onClick={this.cancelPurchaseOrder}
                            >
                                取消采购单
                            </LoadingButton>
                        ) : null}
                        {!showParentStatus ? (
                            <LoadingButton
                                type="primary"
                                className="order-btn"
                                onClick={this.cancelChannelOrder}
                            >
                                取消渠道订单
                            </LoadingButton>
                        ) : null}
                        <LoadingButton
                            type="primary"
                            className="order-btn"
                            onClick={this.postExportAll}
                        >
                            导出数据
                        </LoadingButton>
                        <Button className="order-btn" onClick={this.changeShowFilterStatus}>
                            {showFilterStatus ? '收起' : '展示'}搜索条件
                        </Button>
                        {/* <Button className="order-btn" onClick={this.changeShowColStatus}>
                            {showColStatus ? '收起' : '展示'}字段设置
                        </Button> */}
                    </div>
                    {/* {showColStatus ? (
                        <OptionalColumn
                            ref={this.optionalRef}
                            optionalColList={childOptionalColList}
                            selectedColKeyList={selectedColKeyList}
                            changeSelectedColList={this.changeSelectedColList}
                        />
                    ) : null} */}
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
                    <div style={{ textAlign: 'right' }}>
                        <Pagination
                            className="order-pagination"
                            size="small"
                            total={total}
                            current={page}
                            pageSize={pageCount}
                            showSizeChanger={true}
                            showQuickJumper={true}
                            pageSizeOptions={pageSizeOptions}
                            onChange={this.onChangePage}
                            onShowSizeChange={this.pageCountChange}
                            showTotal={total => `共${total}条`}
                        />
                    </div>
                </div>
            </>
        );
    }
}

export default PaneAll;

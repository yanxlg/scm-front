import React, { RefObject } from 'react';
import { Button, notification } from 'antd';
import { JsonFormRef, FormField } from 'react-components/es/JsonForm';
import { JsonForm, LoadingButton } from 'react-components';
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
    childAllFieldList,
    parentAllFieldList,
    defaultColChildList,
    defaultParentColList,
} from '@/enums/OrderEnum';
import { getCurrentPage } from '@/utils/common';

import formStyles from 'react-components/es/JsonForm/_form.less';

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
    showParentStatus: boolean;
    childOrderList: IChildOrderItem[];
    parentOrderList: IParentOrderItem[];
    fieldList: FormField[];
    colChildList: string[];
    colParentList: string[];
    exportModal: boolean;
}

class PaneAll extends React.PureComponent<IProps, IState> {
    private formRef: RefObject<JsonFormRef> = React.createRef();
    private currentSearchParams: IFilterParams | null = null;
    private regenerateStatus: boolean = false;
    // 保留接口返回的list
    private resList: any[] = [];
    private initialValues = {
        channel_source: '',
        product_shop: '',
        // purchase_fail_code: '',
        order_goods_status: 100,
        order_goods_shipping_status: 100,
        non_purchase_plan: 100,
        purchase_order_pay_status: 100,
        purchase_order_status: 100,
        reserve_status: 100,
        order_goods_cancel_type: 100,
        purchase_plan_cancel_type: 100,
    };

    constructor(props: IProps) {
        super(props);
        this.state = {
            page: 1,
            pageCount: 50,
            total: 0,
            loading: false,
            showParentStatus: false,
            childOrderList: [],
            parentOrderList: [],
            fieldList: [...childAllFieldList],
            // 表格展示的列
            colChildList: defaultColChildList,
            colParentList: defaultParentColList,
            exportModal: false,
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
        return getAllOrderList(params)
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
                        this.resList = list;
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
        const { showParentStatus } = this.state;
        return {
            ...this.formRef.current!.getFieldsValue(),
            only_p_order: showParentStatus ? 1 : 0,
        };
    };

    // 获取子订单=>采购计划数据
    private getChildOrderData(list: any[]): IChildOrderItem[] {
        // console.log(1111, list);
        const childOrderList: IChildOrderItem[] = [];
        list.forEach((goodsItem: any) => {
            const { orderGoods, orderInfo } = goodsItem;
            const { orderGoodsPurchasePlan, ...orderRest } = orderGoods;
            const {
                currency,
                confirmTime,
                channelOrderSn,
                channelSource,
                orderAddress,
            } = orderInfo;
            // console.log(111, orderGoodsPurchasePlan, orderGoods);
            if (orderGoodsPurchasePlan) {
                let purchasePlanList = [...orderGoodsPurchasePlan];
                if (!this.regenerateStatus) {
                    purchasePlanList = purchasePlanList.filter(
                        (item: any) => item.purchaseOrderStatus !== 6,
                    );
                }
                // 生成采购计划
                purchasePlanList.forEach((purchaseItem: any, index: number) => {
                    const {
                        createTime: purchaseCreateTime,
                        lastUpdateTime: purchaseLastUpdateTime,
                        cancelType: purchaseCancelType,
                        purchaseOrderStatus,
                        ...purchaseRest
                    } = purchaseItem;
                    const childOrderItem: any = {
                        ...orderRest,
                        ...purchaseRest,
                        purchaseCreateTime,
                        purchaseLastUpdateTime,
                        purchaseCancelType,
                        currency,
                        confirmTime,
                        channelOrderSn,
                        channelSource,
                        orderAddress,
                        purchaseOrderStatus,
                    };
                    if (index === 0) {
                        childOrderItem._rowspan = purchasePlanList.length;
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
                    orderAddress,
                    _rowspan: 1,
                    _checked: false,
                });
            }
        });
        // console.log(1111, childOrderList);
        return childOrderList;
    }

    private changeRegenerate = (status: boolean) => {
        this.regenerateStatus = status;
        this.setState({
            childOrderList: this.getChildOrderData(this.resList),
        });
    };

    // 获取中单订单=>子订单数据
    private getParentOrderData(list: any[]): IParentOrderItem[] {
        const parentOrderList: IParentOrderItem[] = [];
        list.forEach(item => {
            const { orderGoods, ...parentRest } = item;
            if (orderGoods) {
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
            } else {
                parentOrderList.push({
                    ...parentRest,
                    _rowspan: 1,
                });
            }
        });
        return parentOrderList;
    }

    private changeParentOrder = (status: boolean) => {
        this.currentSearchParams = null;
        this.setState(
            {
                showParentStatus: status,
                page: 1,
                pageCount: 50,
                total: 0,
                childOrderList: [],
                parentOrderList: [],
                fieldList: status ? parentAllFieldList : childAllFieldList,
            },
            () => {
                this.onSearch();
                this.props.getAllTabCount(status ? 1 : 2);
            },
        );
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
    private postOrdersPlace = (idList: string[]) => {
        return postOrdersPlace({
            order_goods_ids: idList,
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
    };

    // 取消采购订单
    private cancelPurchaseOrder = (idList: string[]) => {
        return delPurchaseOrders({
            order_goods_ids: idList,
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
    };

    // 取消渠道订单
    private cancelChannelOrder = (idList: string[]) => {
        return delChannelOrders({
            order_goods_ids: idList,
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
    };

    // 导出excel
    private postExportAll = (value: any) => {
        return postExportAll({
            ...this.currentSearchParams,
            ...value,
        });
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

    private closeExport = () => {
        this.setState({
            exportModal: false,
        });
    };

    private showExport = () => {
        this.setState({
            exportModal: true,
        });
    };

    private handleClickSearch = () => {
        return this.onSearch({
            page: 1,
        });
    };

    render() {
        const {
            page,
            pageCount,
            total,
            loading,
            showParentStatus,
            childOrderList,
            parentOrderList,
            fieldList,
            colChildList,
            colParentList,
            exportModal,
        } = this.state;

        return (
            <>
                <div>
                    <JsonForm
                        ref={this.formRef}
                        fieldList={fieldList}
                        labelClassName="order-all-label"
                        initialValues={this.initialValues}
                        // enableCollapse={false}
                        defaultCollapse={false}
                    >
                        <div>
                            <LoadingButton
                                type="primary"
                                className={formStyles.formBtn}
                                onClick={() => this.handleClickSearch()}
                            >
                                查询
                            </LoadingButton>
                            <LoadingButton
                                className={formStyles.formBtn}
                                onClick={() => this.onSearch()}
                            >
                                刷新
                            </LoadingButton>
                            <Button
                                disabled={total <= 0}
                                className={formStyles.formBtn}
                                onClick={this.showExport}
                            >
                                导出
                            </Button>
                        </div>
                    </JsonForm>
                    {/* <div className="order-operation">
                        
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
                    </div> */}
                    {!showParentStatus ? (
                        <TableAll
                            loading={loading}
                            page={page}
                            pageSize={pageCount}
                            total={total}
                            colList={colChildList}
                            orderList={childOrderList}
                            onCheckAllChange={this.onCheckAllChange}
                            onSelectedRow={this.onSelectedRow}
                            visible={exportModal}
                            onOKey={this.postExportAll}
                            onCancel={this.closeExport}
                            onSearch={this.onSearch}
                            postOrdersPlace={this.postOrdersPlace}
                            cancelPurchaseOrder={this.cancelPurchaseOrder}
                            cancelChannelOrder={this.cancelChannelOrder}
                            changeParentOrder={this.changeParentOrder}
                            showParentStatus={showParentStatus}
                            getOrderGoodsIdList={this.getOrderGoodsIdList}
                            getAllTabCount={this.props.getAllTabCount}
                            changeRegenerate={this.changeRegenerate}
                        />
                    ) : (
                        <TableParentAll
                            loading={loading}
                            page={page}
                            pageSize={pageCount}
                            total={total}
                            colList={colParentList}
                            orderList={parentOrderList}
                            visible={exportModal}
                            onOKey={this.postExportAll}
                            onCancel={this.closeExport}
                            showParentStatus={showParentStatus}
                            changeParentOrder={this.changeParentOrder}
                            onSearch={this.onSearch}
                        />
                    )}
                </div>
            </>
        );
    }
}

export default PaneAll;
